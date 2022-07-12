// Show a ncell by ncell grid of effects
// eff_labels is array of effects to cycle between
//
export default class eff_ncell {
  static meta_props = {
    ncell: [2, 3, 4],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    let videoKit = this.videoKit;
    for (let eff of this.effs) {
      videoKit.prepareOutput(eff);
    }
    for (let eff of this.effs) {
      videoKit.ouputToCanvas(eff);
    }
  }
  init() {
    this.effs = [];
    // let eff_labels = ['circle', 'maze', 'bright', 'grid'];
    let eff_labels = ['circle'];
    let videoKit = this.videoKit;
    let imedia = 1;
    let uout = this.eff_src.urect;
    let x0 = uout.x0;
    let y0 = uout.y0;
    let uw = x0 + uout.width;
    let uh = y0 + uout.height;
    let xstep = uw / this.ncell;
    let ystep = uh / this.ncell;
    let n = this.ncell * this.ncell;
    for (let index = 0; index < n; index++) {
      let urect = { x0, y0, width: xstep, height: ystep };
      let eff_label = eff_labels[index % eff_labels.length];
      let props = {};
      let eff = videoKit.createEffect({ eff_label, imedia, urect, props });
      // console.log('eff_nbyn index', index, 'eff', eff);
      this.effs.push(eff);
      x0 += xstep;
      if (x0 >= uw) {
        x0 = uout.x0;
        y0 += ystep;
        if (y0 >= uh) {
          y0 = uout.y0;
        }
      }
    }
  }
}

// p5VideoKit.prototype.createEffect = function ({eff_label, imedia, urect, props}) {
