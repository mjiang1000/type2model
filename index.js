const fs = require('fs')

const cls_map = new Map()
const isReference = (t) => t === 'TSTypeReference'
const primary_type_map = {
    'TSNumberKeyword': 'number',
    'TSBooleanKeyword': 'boolean',
    'TSStringKeyword': 'string',
    'TSUndefinedKeyword': 'undefined',
    'TSNullKeyword': 'null'
}
const primary_type = Object.values(primary_type_map)
const isPrimaryType = (k) => primary_type.includes(k)

const other_type = ['TSAnyKeyword','TSVoidKeyword']

const temps = {
    primary: (key, type) =>  `if (typeof val === '${type}') {
        this._${key} = val
    }`,
    tsTypeReference: (key, type) => `if (val instanceof ${type}) {
        this._${key} = val
    } else {
        this._${key} = new ${type}(val)
    }`
}
const propertySetTemplate = ({key, typeAnnotation}) => {
    const {type, annot} = typeAnnotation
    if (isPrimaryType(type)) {
        return temps.primary(key, type)
    }

    if (annot === 'TSTypeReference') {
        return temps.tsTypeReference(key, type)
    }

    if (annot === 'TSArrayType') {
        const {elementType} = typeAnnotation
        if (isPrimaryType(elementType)) {
            
            return `if (val instanceof Array) {
                ${temps.primary(key, elementType)}
            }`
        } else {
           return  `if (val instanceof Array) {
            this._${key} = val.map(i => i instanceof ${elementType} ? i : new ${elementType}(i) )
        }`
        }
    }

    if (annot === 'TSUnionType') {
        const {types} = typeAnnotation
       
        const firstIdx = types.find(i => !isPrimaryType(i))
        
        return `
        let init = false;
        for (let i of [${types.map(i => `'${i}'`).join(',')}]) {
            const isPrimary = (t) => [${primary_type.map(i => `'${i}'`).join(',')}].indexOf(t) > -1
            if (typeof val === i) {
                init = true
                this._${key} = val
                break;
            }
        }
        if (!init) {
            const cls = ${firstIdx};
            this._${key} = val instanceof cls ? val : new cls(val)
        }
        `
    }
    
}
const propertyTemplate = ({key, typeAnnotation}) => {
    return `get ${key}() {
        return this._${key}
    }
        set ${key}(val) {
           ${propertySetTemplate({key, typeAnnotation})}
        }
    `
}

const classTemplate = (clsObj) => {
    const keys = `[${clsObj.property.map(i =>  `'${i.key}'`).join(',')}]`
    const properties = clsObj.property
return`export class ${clsObj.name} {
        ${clsObj.property.map(i => 
            `_${i.key}:${i.typeAnnotation.type};`
        ).join("\n")}
        constructor(obj) {
            this.getkeys().map(i => this[i] = obj[i])
        }

        ${properties.map(i => propertyTemplate(i)).join('\n')}

        getkeys() {
            return ${keys};
        }
        getJson() {
            
            return this.getkeys().reduce((prev, k) => {
                const v = this[k]
                if (v instanceof Array) {
                    prev[k] = v.map(i => i && i.getJson ? i.getJson() : i)
                } else {
                    if (v && v.getJson) {
                        prev[k] = v.getJson()
                    } else {
                        prev[k] = v
                    }
                }
                
                return prev
            }, {})
        }
    }

`    
}


const getVisiter = (modelstr = []) =>  {
    return {
    Program: {
      enter(path) {
        //   console.log(path)
      }
    },
    TSInterfaceDeclaration: {
        enter(path) {
     
            const node = path.node
            const interfaceName = node.id.name
            const interfaceBody = node.body.body || []
            const clsObj = {
                name: interfaceName,
                property: interfaceBody.map((node) => {
                    if (node.type !== 'TSPropertySignature') return
                  //   console.log(node.typeAnnotation.typeAnnotation )
                    const typeAnnotation = node.typeAnnotation.typeAnnotation
                    const type = typeAnnotation.type
                    const prop = {
                        key: node.key.name,
                        typeAnnotation: {
                            annot: type,
                            type: primary_type_map[type]
                        }
                    }
                    if (type === 'TSTypeReference') {
                        prop.typeAnnotation = {
                            annot: type,
                            type:  typeAnnotation.typeName.name,
                        }
                        
                    }
                    if (type === 'TSUnionType') {
                        const types = typeAnnotation.types.map(i => {
                            if (i.type === 'TSTypeReference') {
                                return i.typeName.name
                            } else {
                                return primary_type_map[i.type]
                            }
                        })
                        prop.typeAnnotation = {
                            annot: type,
                            types,
                            type: types.join(' | ')
                        }
                    }
                    if (type === 'TSArrayType') {
                        const ele = typeAnnotation.elementType
                        let t = typeAnnotation.elementType.type
                        if (t === 'TSTypeReference') {
                            t = ele.typeName.name
                        } else {
                            t = primary_type_map[t]
                        }
                        prop.typeAnnotation = {
                            annot: type,
                            elementType: t,
                            type: `${t}[]`
                        }
                    }
                    return prop
                }).filter(i => !!i)
            }
            console.log(interfaceName, JSON.stringify(clsObj, null, 2))
        //   console.log(classTemplate(clsObj))
            if (modelstr) {modelstr.push(classTemplate(clsObj))}
        }
    }
  }
}

exports.default = function () {
  return {
    visitor: getVisiter()
  };
};


exports.getVisiter = getVisiter
