// p5VideoKit main class
//  Must be include in html as
//    <script src="videoKit/p5VideoKit.js?v=94"></script>
//

class p5VideoKit {
  //
  // let effects = [
  //   { label: 'example', import_path: 'module/eff_example', menu: 1 },

  constructor(p5_instance = p5.instance) {
    // console.log('p5VideoKit p5_instance', p5_instance);
    // To work in p5 instance mode we need to use this.p0 on all p5 globals
    //
    if (!p5_instance) {
      console.log('p5VideoKit !!@ no p5_instance');
    }
    this.p5_instance = p5_instance;
    this.my_canvas = p5_instance._renderer;
    if (!this.my_canvas) {
      console.log('p5VideoKit !!@ no my_canvas');
    }
  }

  init({ effects, settings }) {
    let inpath = './core/apex.js?v={{vers}}';
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
