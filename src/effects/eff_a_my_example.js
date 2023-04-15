// eff_a_my_example - copy and customized from eff_a_example_props
//
export default class eff_a_my_example {
  static meta_props = [
    { prop: 'num_prop', label: 'prop1', selection: [100, 200, 300, 400] },
    {}, // create a line break
    // { prop: 'num_prop', label: 'prop1', selection: [100, 200, 300, 400] },
    // { prop: 'str_prop2', label: 'prop2', selection: ['red', 'green', 'yellow'] },
    // { prop: 'textInput_prop', label: 'text1', textInput: 'Hello world!', style: 'width:40%' },
    { prop: 'slider1_prop', label: 'slider1', slider: { min: 0, max: 255 }, style: 'width:20%' },
    { prop: 'slider2_prop', label: 'slider2', slider: { min: 0, max: 255 }, style: 'width:20%' },
    { prop: 'slider3_prop', label: 'slider3', slider: { min: 0, max: 255 }, style: 'width:20%' },
    {}, // create a line break
    {
      prop: 'button1',
      button: (inst, aPatch) => {
        console.log('button1_prop inst', inst, 'aPatch', aPatch);
        inst.xspeed = (inst.xspeed + 1) % 5;
      },
      style: 'width:40%',
    },
    {
      label: 'button2',
      button: (inst, aPatch) => {
        console.log('button2_prop inst', inst, 'aPatch', aPatch);
        inst.yspeed = (inst.yspeed + 1) % 5;
      },
      style: 'width:40%',
    },
    // span2: { span: 'span2: ', style: 'width:10%' }, // !!@ style not taken
  ];

  // new eff_example({message_prop1, num_prop, text_prop})
  constructor(props) {
    Object.assign(this, props);
    // console.log('eff_a_example_props props', props);
    let { width, height } = this.input;
    this.output = createGraphics(width, height);
    console.log('eff_a_my_example constructor width, height', width, height);

    this.xpos = width / 2;
    this.ypos = height / 2;
    this.xspeed = 0;
    this.yspeed = 0;
  }

  prepareOutput() {
    // console.log('eff_example prepareOutput text_prop', this.text_prop);

    let { width, height } = this.output;

    // let x = 0;
    // let y = height / 10;
    // let txsize = height / 10;
    // this.output.textSize(txsize);
    // let txt = this.textInput_prop + ' ' + this.num_prop + ' ' + this.slider1_prop;
    // this.output.text(txt, x, y);

    this.xpos = (this.xpos + this.xspeed) % width;
    this.ypos = (this.ypos + this.yspeed) % height;
    this.output.fill([this.slider1_prop, this.slider2_prop, this.slider3_prop]);
    this.output.circle(this.xpos, this.ypos, this.num_prop);
  }
}
