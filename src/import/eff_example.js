// Example of simple effect show parameter in dashboard
//

export default class eff_example {
  static meta_props = {
    message_prop1: {
      message: 'An example effect',
    },
    num_prop: [200, 100, 200, 255],
    text_prop: {
      text_input: 'Word up!',
    },
  };
  constructor(props) {
    Object.assign(this, props);
    // console.log('eff_example props', props);
    let { width, height } = this.input;
    this.output = createGraphics(width, height);
    console.log('eff_example constructor width, height', width, height);
  }
  prepareOutput() {
    // console.log('eff_example prepareOutput text_prop', this.text_prop);
    let { width, height } = this.output;
    let x = 0;
    let y = height / 2;
    let txsize = height / 10;
    this.output.textSize(txsize);
    // this.output.background(this.num_prop);
    let txt = this.text_prop + ' ' + this.num_prop;
    this.output.text(txt, x, y);
  }
}
