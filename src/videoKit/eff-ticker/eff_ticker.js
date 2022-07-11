//

export default class eff_ticker {
  static meta_props = {
    display_copy_right: [0, 1],
  };
  constructor(props) {
    Object.assign(this, props);

    this.width = this.eff_src.urect.width;
    this.height = this.eff_src.urect.height;
    this.output = createGraphics(width, height);
    // console.log('width', this.width);

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
