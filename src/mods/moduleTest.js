function moduleTest() {
  import('./modules/myModule.js')
    .then((module) => {
      // Do something with the module.
      console.log('moduleTest module', module);
    })
    .catch((err) => {
      myErr = err;
      console.log('moduleTest catch', err);
    });
}

let myErr;
