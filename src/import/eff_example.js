export default class eff_example {
  static meta_props = {
    fruit: ['apple', 'banana', 'cherry'],
    text: {
      message: 'Hello',
    },
  };
  constructor(props) {
    Object.assign(this, props);
  }
  render() {}
}