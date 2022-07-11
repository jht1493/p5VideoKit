//

export default class eff_ticker {
  static meta_props = {
    display_copy_right: [0, 1],
  };
  constructor(props) {
    Object.assign(this, props);
    // this.setup(this.display_copy_right);

    import('./sub/sketch.js')
      .then((module) => {
        // console.log('eff_ticker module', module);
        this.setup(this.display_copy_right);
      })
      .catch((err) => {
        console.log('eff_ticker err', err);
      });
  }
  prepareOutput() {
    // console.log('eff_ticker prepareOutput');
  }
}

window.eff_ticker = eff_ticker;

// import './sub/sketch_draw_dots.js';
// import './sub/sketch_draw.js';
// import './sub/sketch_font8.js';
// import './sub/sketch_let.js';
// import './sub/sketch_load.js';
// import './sub/sketch_paused.js';
// import './sub/sketch.js';
