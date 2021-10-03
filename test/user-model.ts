export class ID {
  _name: string;
  _code: number;
  constructor(obj) {
    this.getkeys().map((i) => (this[i] = obj[i]));
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

  getkeys() {
    return ["name", "code"];
  }
  getJson() {
    return this.getkeys().reduce((prev, k) => {
      const v = this[k];
      if (v instanceof Array) {
        prev[k] = v.map((i) => (i && i.getJson ? i.getJson() : i));
      } else {
        if (v && v.getJson) {
          prev[k] = v.getJson();
        } else {
          prev[k] = v;
        }
      }

      return prev;
    }, {});
  }
}

export class Score {
  _name: string;
  _level: string;
  _date: string | Date;
  constructor(obj) {
    this.getkeys().map((i) => (this[i] = obj[i]));
  }

  get name() {
    return this._name;
  }
  set name(val) {
    if (typeof val === "string") {
      this._name = val;
    }
  }

  get level() {
    return this._level;
  }
  set level(val) {
    if (typeof val === "string") {
      this._level = val;
    }
  }

  get date() {
    return this._date;
  }
  set date(val) {
    let init = false;
    for (let i of ["string", "Date"]) {
      const isPrimary = (t) =>
        ["number", "boolean", "string", "undefined", "null"].indexOf(t) > -1;
      if (typeof val === i) {
        init = true;
        this._date = val;
        break;
      }
    }
    if (!init) {
      const cls = Date;
      this._date = val instanceof cls ? val : new cls(val);
    }
  }

  getkeys() {
    return ["name", "level", "date"];
  }
  getJson() {
    return this.getkeys().reduce((prev, k) => {
      const v = this[k];
      if (v instanceof Array) {
        prev[k] = v.map((i) => (i && i.getJson ? i.getJson() : i));
      } else {
        if (v && v.getJson) {
          prev[k] = v.getJson();
        } else {
          prev[k] = v;
        }
      }

      return prev;
    }, {});
  }
}

export class Stu {
  _age: number;
  _sex: boolean;
  _id: ID;
  _name: string;
  _scores: Score[];
  constructor(obj) {
    this.getkeys().map((i) => (this[i] = obj[i]));
  }

  get age() {
    return this._age;
  }
  set age(val) {
    if (typeof val === "number") {
      this._age = val;
    }
  }

  get sex() {
    return this._sex;
  }
  set sex(val) {
    if (typeof val === "boolean") {
      this._sex = val;
    }
  }

  get id() {
    return this._id;
  }
  set id(val) {
    if (val instanceof ID) {
      this._id = val;
    } else {
      this._id = new ID(val);
    }
  }

  get name() {
    return this._name;
  }
  set name(val) {
    if (typeof val === "string") {
      this._name = val;
    }
  }

  get scores() {
    return this._scores;
  }
  set scores(val) {
    if (val instanceof Array) {
      this._scores = val.map((i) => (i instanceof Score ? i : new Score(i)));
    }
  }

  getkeys() {
    return ["age", "sex", "id", "name", "scores"];
  }
  getJson() {
    return this.getkeys().reduce((prev, k) => {
      const v = this[k];
      if (v instanceof Array) {
        prev[k] = v.map((i) => (i && i.getJson ? i.getJson() : i));
      } else {
        if (v && v.getJson) {
          prev[k] = v.getJson();
        } else {
          prev[k] = v;
        }
      }

      return prev;
    }, {});
  }
}
