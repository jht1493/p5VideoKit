//

export default class eff_ticker {
  static meta_props = {
    display_copy_right: [0, 1],
    jump: {
      button: (inst, aPatch) => {
        inst.jump_action(aPatch);
      },
    },
  };
  constructor(props) {
    Object.assign(this, props);

    this.width = this.eff_spec.urect.width;
    this.height = this.eff_spec.urect.height;
    this.output = createGraphics(width, height);
    // console.log('width', this.width);

    // import dynamically so we don't take a import hit until actually used.
    //
    import('./sub/sketch.js')
      .then((module) => {
        // console.log('eff_ticker module', module);
        this.init();
      })
      .catch((err) => {
        console.log('eff_ticker err', err);
      });
  }
  prepareOutput() {
    console.log('eff_ticker prepareOutput stub');
  }
}

window.eff_ticker = eff_ticker;
// global class eff_ticker becomes the base for other methods, eg.
//  eff_ticker.prototype.init = function () {
// example of converting mult-script global to class methods.
