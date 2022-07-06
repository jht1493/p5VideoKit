export default class eff_import {
  static meta_props = {
    path: {
      text_input: 'import/eff_example.js',
    },
    reload: {
      button: (inst, aPatch) => {
        console.log('eff_import reload inst', inst, 'aPatch', aPatch);
        window.location.reload();
      },
    },
  };
  constructor(props) {
    Object.assign(this, props);
  }
  render() {}
}
