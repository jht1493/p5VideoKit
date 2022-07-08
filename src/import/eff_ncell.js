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
      videoKit.imageToCanvas(eff);
    }
  }
  init() {
    this.effs = [];
    // let eff_names = ['circle', 'maze', 'bright', 'grid'];
    let eff_names = ['circle'];
    let videoKit = this.videoKit;
    let devIndex = 1;
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
      let eff_name = eff_names[index % eff_names.length];
      let props = videoKit.factoryPropInits(eff_name);
      let eff = videoKit.createEffect(eff_name, devIndex, urect, props);
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
