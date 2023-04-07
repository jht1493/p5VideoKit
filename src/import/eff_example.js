// Example of simple effect show parameter in dashboard
//

export default class eff_example {
  static meta_props = {
    num_prop: [200, 100, 200, 255],
    message_prop: {
      // style: 'width:80%', // !!@ style not taking to message:
      message: 'message - to the world ',
    },
    text_prop: {
      style: 'width:80%',
      text_input: 'Hello world!',
    },
    button1_prop: {
      style: 'width:40%',
      button: (inst, aPatch) => {
        console.log('button1_prop inst', inst, 'aPatch', aPatch);
      },
    },
    break1_prop: {}, // create a line break
    button2_prop: {
      style: 'width:40%',
      button: (inst, aPatch) => {
        console.log('button2_prop inst', inst, 'aPatch', aPatch);
      },
    },
    slider1_prop: {
      style: 'width:20%',
      slider: { min: 0, max: 8 },
    },
    slider2_prop: {
      style: 'width:20%',
      slider: { min: -5, max: 5 },
    },
    slider3_prop: {
      style: 'width:20%',
      slider: { step: 0.1 }, // default min: 0, max: 100
    },
  };
  static meta_props1 = [
    {
      prop: 'message',
      message: 'message - to the world ',
    },
  ];

  // new eff_example({message_prop1, num_prop, text_prop})
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
    let txt = this.text_prop + ' ' + this.num_prop + ' ' + this.slider1_prop;
    this.output.text(txt, x, y);
  }
}
