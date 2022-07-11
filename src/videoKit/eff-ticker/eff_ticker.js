//
export default class eff_ticker {
  static meta_props = {
    fruit: ['apple', 'banana', 'cherry'],
    text: {
      message: 'Hello',
    },
  };
  constructor(props) {
    Object.assign(this, props);
  }
  prepareOutput() {
    // console.log('eff_example render');
  }
}
