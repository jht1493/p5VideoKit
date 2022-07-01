export function test1(msg) {
  console.log('test1 msg', msg);
}
export function test2(msg) {
  console.log('test2 msg', msg);
}

console.log('myModule self', self);
// module is undefined
// console.log('myModule module', module);
// console.log('myModule exports', exports);
