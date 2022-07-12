// Example of simple effect show parameter in dashboard
//
import { image_copy } from '../videoKit/util/image.js';
// !!@ Move to this.videoKit.image_copy to avoid import

export default class eff_example {
  static meta_props = {
    text: {
      message: 'An example effect',
    },
    num: [200, 100, 200, 255],
    some_text: {
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
    // console.log('eff_example prepareOutput some_text', this.some_text);
    let { width, height } = this.output;
    let x = 0;
    let y = height / 2;
    let txsize = height / 10;
    this.output.textSize(txsize);
    // this.output.background(this.num);
    // image_copy(this.output, this.input);
    // this.output.text('hello', x, y);
    let txt = this.some_text + ' ' + this.num;
    this.output.text(txt, x, y);
  }
}
