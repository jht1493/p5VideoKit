export default class eff_import {
  static meta_props = {
    import_path: {
      text_input: 'import/eff_example.js',
    },
    reload: {
      button: (inst, aPatch) => {
        // console.log('eff_import reload inst', inst, 'aPatch', aPatch);
        // console.log('eff_import reload aPatch.eff_inits', aPatch.eff_inits);
        if (!aPatch.eff_inits.import_path) {
          aPatch.eff_inits.import_path = inst.constructor.meta_props.import_path.text_input;
        }
        ui_patch_update(aPatch);
        window.location.reload();
      },
    },
  };
  constructor(props) {
    // console.log('eff_import props', props);
    Object.assign(this, props);
    let factory = a_import_factory_dict[this.import_path];
    // console.log('eff_import factory', factory);
    if (factory) {
      this.eff_inst = new factory(props);
    }
  }
  prepareOutput() {
    // console.log('eff_import render this.eff_inst', this.eff_inst);
    if (this.eff_inst) {
      this.eff_inst.prepareOutput();
      this.output = this.eff_inst.output;
    }
  }
}
