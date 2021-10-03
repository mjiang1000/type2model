import { Stu } from "./user-model";
const zs = new Stu({ age: 13, name: '张三', id: { name: '学号', code: 110509 } });
const kt = new Stu({ age: 12, name: '狂徒', sex: false, id: { name: '学号', code: 110509 }, scores: [{ name: '历史', level: 'A', date: new Date() }] });
const js = zs.getJson();
console.log(zs.getJson());
console.log(kt.getJson());
