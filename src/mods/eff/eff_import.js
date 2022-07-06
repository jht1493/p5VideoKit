export default class eff_import {
  static meta_props = {
    path: {
      text_input: 'import/eff_example.js',
    },
    reload: {
      button: (inst, aPatch) => {
        // console.log('eff_import reload inst', inst, 'aPatch', aPatch);
        console.log('eff_import reload aPatch.eff_inits', aPatch.eff_inits);
        if (!aPatch.eff_inits.path) {
          aPatch.eff_inits.path = inst.constructor.meta_props.path.text_input;
        }
        ui_patch_update(aPatch);
        window.location.reload();
      },
    },
  };
  constructor(props) {
    Object.assign(this, props);
  }
  render() {}
}
