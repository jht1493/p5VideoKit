// example of meta_props for showing effect properties in the dashboard
//
export default class eff_example {
  static meta_props = {
    num_prop: [200, 100, 200, 255],
    num_prop2: { label: 'prop2', selection: [200, 100, 200, 255] },
    span1: { span: 'span1:' },
    textInput_prop: { textInput: 'Hello world!', style: 'width:40%' },
    break1_prop: {}, // create a line break
    span2: { span: 'span2: ' },
    slider1_prop: { slider: { min: 0, max: 8 }, style: 'width:20%' },
    break2_prop: {}, // create a line break
    slider2_prop: { slider: { min: -5, max: 5 }, style: 'width:20%' },
    slider3_prop: { slider: { step: 0.01 }, style: 'width:20%' },
    break3_prop: {}, // create a line break
    button1_prop: {
      button: (inst, aPatch) => {
        console.log('button1_prop inst', inst, 'aPatch', aPatch);
      },
      style: 'width:40%',
    },
    button2_prop: {
      label: 'button2',
      button: (inst, aPatch) => {
        console.log('button2_prop inst', inst, 'aPatch', aPatch);
      },
      style: 'width:40%',
    },
    // span2: { span: 'span2: ', style: 'width:10%' }, // !!@ style not taken
  };
  static meta_props1 = [
    { span: 'span1 - to the world ' },
    { prop: 'textInput1', textInput: 'Hello world!', style: 'width:80%' },
    { span: 'span2 - to the world ' },
    {}, // break
    { prop: 'slider1', slider: { min: 0, max: 8 }, style: 'width:20%' },
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
    let txt = this.textInput_prop + ' ' + this.num_prop + ' ' + this.slider1_prop;
    this.output.text(txt, x, y);
  }
}
