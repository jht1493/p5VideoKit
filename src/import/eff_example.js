// example1 - using meta_props for showing effect properties in the dashboard
//
export default class eff_example {
  static meta_props = [
    // { prop: 'num_prop', label: 'prop1', selection: [100, 200, 300, 400] },
    { prop: 'num_prop', label: 'prop1', selection: [100, 200, 300, 400] },
    { prop: 'str_prop2', label: 'prop2', selection: ['red', 'green', 'yellow'] },
    { prop: 'textInput_prop', label: 'text1', textInput: 'Hello world!', style: 'width:40%' },
    {}, // create a line break
    { prop: 'slider1_prop', label: 'slider1', slider: { min: 0, max: 8 }, style: 'width:20%' },
    {}, // create a line break
    { prop: 'slider2_prop', label: 'slider2', slider: { min: -5, max: 5 }, style: 'width:20%' },
    { prop: 'slider3_prop', label: 'slider3', slider: { step: 0.01 }, style: 'width:20%' },
    {}, // create a line break
    {
      prop: 'button1',
      button: (inst, aPatch) => {
        console.log('button1_prop inst', inst, 'aPatch', aPatch);
      },
      style: 'width:40%',
    },
    {
      label: 'button2',
      button: (inst, aPatch) => {
        console.log('button2_prop inst', inst, 'aPatch', aPatch);
      },
      style: 'width:40%',
    },
    // span2: { span: 'span2: ', style: 'width:10%' }, // !!@ style not taken
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
