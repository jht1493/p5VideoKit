import { patch_index1 } from '../core-ui/ui_patch_eff.js?v=121';

export default class eff_show_none {
  static meta_props = {
    back_color_patch: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };
  constructor(props) {
    Object.assign(this, props);
  }
  prepareOutput() {
    if (this.back_color_patch) {
      let src = patch_index1(this.back_color_patch);
      if (src && src.avg_color) {
        noStroke();
        fill(src.avg_color);
        let urect = this.eff_spec.urect;
        rect(urect.x0, urect.y0, urect.width, urect.height);
      }
    }
  }
}
