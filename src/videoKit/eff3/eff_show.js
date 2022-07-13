import { image_scaled_pad } from '../util/image.js?v=113';
import { patch_index1 } from '../core-ui/ui_patch_eff.js?v=113';

export default class eff_show_pad {
  static meta_props = {
    // show: [1, 0],
    // step_patch: [1, 0],
    step_patch: [0, 1],
    next: {
      button: (ent, aPatch) => {
        ent.trigger_step(aPatch);
      },
    },
  };
  constructor(props) {
    Object.assign(this, props);
  }
  init() {
    this.done = 0;
  }
  prepareOutput() {
    this.trigger_check();
    if (!this.eff_spec.ihide) {
      if (this.input) {
        let img = this.input.get();
        image_scaled_pad(img, this.eff_spec.urect);
      }
    } else {
      this.output = this.input;
    }
  }
  trigger_check() {
    if (!this.done) {
      this.trigger_step();
      this.done = 1;
    }
  }
  trigger_step() {
    if (!this.step_patch) return;
    let src = patch_index1(this.step_patch);
    if (src && src.patch_stepper) {
      // console.log('eff_show_pad trigger_step step_patch', this.step_patch);
      src.patch_stepper();
    }
  }
}
