//

class p5VideoKit {
  //
  // let effects = [
  //   { label: 'example', import_path: 'module/eff_example', menu: 1 },

  constructor(p5_instance = p5.instance) {
    // console.log('p5VideoKit p5_inst', p5_inst);
    // To work in p5 instance mode we need to use this.p0 on all p5 globals
    //
    this.p0 = p5_instance;
  }

  init({ effects, settings }) {
    let inpath = './core/amain.js';
    return new Promise((resolve, reject) => {
      import(inpath)
        .then((module) => {
          // console.log('p5VideoKit module', module);
          this.vk_setup(effects, settings, resolve);
        })
        .catch((err) => {
          console.log('p5VideoKit err', err, '\n inpath', inpath);
          reject();
        });
    });
  }

  draw() {
    console.log('p5VideoKit draw stub');
  }
}
