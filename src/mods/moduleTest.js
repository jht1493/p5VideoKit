function moduleTest() {
  import('./modules/myModule.js')
    .then((module) => {
      // Do something with the module.
      console.log('moduleTest module', module);
      a_mod = module;
      console.log('moduleTest test1', module.test1('test1 called'));
    })
    .catch((err) => {
      console.log('moduleTest catch', err);
      a_err = err;
    });
}

let a_err;
let a_mod;
