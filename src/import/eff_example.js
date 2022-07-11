// Example of simple effect show parameter in dashboard
//
export default class eff_example {
  static meta_props = {
    text: {
      message: 'An example effect',
    },
    num: [0, 1, 2, 3],
    some_text: {
      text_input: 'Text to display',
    },
  };
  constructor(props) {
    Object.assign(this, props);
  }
  prepareOutput() {
    // console.log('eff_example prepareOutput');
  }
}
