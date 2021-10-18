README.md

使用ts type生成 model

 type 生成 model
```bash

node ./main.js 
```

测试
```bash
npx tsc test/test.ts

node ./test/test.js
```



前言
日常开发时，经常遇到需要判断数据类型或者数据是否为'空的情况'

```js
const {list = [], name = ''} = responcedata

list?.forEach(i => typeof i??.date === 'string')

```
如此类判断，不胜其烦，而且经常容易出现bug。js语言是一种弱类型的语言，赋值操作不涉及类型判断，导致数据类型难以确定。
Typescript 类型
ts类型为开发阶段提供了便利，通过编辑器，在开发阶段保障数据类型的准确性；但也仅限于开发阶段，ts编译之后的js代码，运行时依旧是裸奔；

如何在运行时也能保障js的类型正确呢？这是一个值得思考的问题。

model

有过后端开发经历的同学想必都知道orm。如果我们在前端也定义一层model，该model有接口定义描述生成。后续业务逻辑数据均来自于model，当model层数据类型是可靠时，后续的类型判断将极大减少。```ts
// types
interface ID {
  name: string;
  code: number;
}


// model
export class ID {
  _name: string;
  _code: number;
  constructor(obj) {
    this.name = obj.name
    this.code = obj.code
  }
  get name() {
    return this._name;
  }
  set name(val) {
    if (typeof val === "string") {
      this._name = val;
    }
  }
  get code() {
    return this._code;
  }
  set code(val) {
    if (typeof val === "number") {
      this._code = val;
    }
  }
}
```

以上代码model ID劫持了setter，赋值时如果类型不符合，赋值无效。这样能保证我们最终的model实例是可控的


type to model
如何从types生成model代码？关键是要从ts文件提取如下信息
● 有多少个interface
● interface有多少个属性
● 属性的类型是什么
● 组合类型，数组类型等

分析代码当然离不开 「ast」- https://astexplorer.net/ ，先看图了解一下大概的结构
![MTY4ODg1MjkxNjQ2MTAzMw_581808_dp9CAEGwojmnn0E0_1633258988 1](https://user-images.githubusercontent.com/9973727/137670347-1a6cad96-d284-41a5-af62-6d967127e75b.png)


整理一下对于我们有用的信息
```

{
  "type": "File",
  "program": {
    "type": "Program",
    "body": [
      {
        "type": "InterfaceDeclaration",
        "id": {
          "type": "Identifier",
          "name": "ID"
        },
        "typeParameters": null,
        "body": {
          "type": "ObjectTypeAnnotation",
          "callProperties": [],
          "properties": [
            {
              "type": "ObjectTypeProperty",
              "key": {
                "type": "Identifier",
                "name": "name"
              },
              "value": {
                "type": "StringTypeAnnotation"
              }
            },
            {
              "type": "ObjectTypeProperty",
              "key": {
                "type": "Identifier",
                "name": "code"
              },
             
              "value": {
                "type": "NumberTypeAnnotation"
              }
            }
          ]
        }
      }
    ]
  }
}
```


从中可以很容易看出interface，属性，类型等信息。

babel-parser 获取关键信息
本地babel-parser解析结果和线上的有所区别。
interface 如下
![MTY4ODg1MjkxNjQ2MTAzMw_773157_ihXCjzenmyZG1gHV_1633259573 1](https://user-images.githubusercontent.com/9973727/137670280-8fdff11c-caba-43bb-a97a-85d3f0c46c99.png)


分析得到如下结果 clsObj
![MTY4ODg1MjkxNjQ2MTAzMw_6584_l6zxSlzhZbTtd3pI_1633259812 1](https://user-images.githubusercontent.com/9973727/137670303-defeeb44-d9b4-4065-aac4-21416a30a24b.png)


根据 clsObj生成model.ts

demo
按照以上的描述，完成一个简易的demo
demo：  「GitHub - mjiang1000/type2model: 使用ts type生成 model」- https://github.com/mjiang1000/type2model 

展望

1. 目前实现了js的基本类型，Date，Error等
2. 联合类型支持 string | Date，但不能支持，string|Date|User
3. 支持string[], Date[]
4. 不支持a&b

还需进一步完善支持更多的ts语法。
关于model的setter还需要完善，目前采用this._name的写法有副作用。








