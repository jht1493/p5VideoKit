class eff_show_pad {
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
  render() {
    this.trigger_check();
    if (!this.isrc.ihide) {
      if (this.input) {
        let img = this.input.get();
        image_scaled_pad(img, this.isrc.pad);
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

class eff_show_none {
  static meta_props = {
    back_color_patch: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };
  constructor(props) {
    Object.assign(this, props);
  }
  render() {
    if (this.back_color_patch) {
      let src = patch_index1(this.back_color_patch);
      if (src && src.avg_color) {
        noStroke();
        fill(src.avg_color);
        let pad = this.isrc.pad;
        rect(pad.x0, pad.y0, pad.width, pad.height);
      }
    }
  }
}
