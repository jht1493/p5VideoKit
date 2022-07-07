export default class eff_nbyn {
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
      eff.prepareOutput();
    }
    for (let eff of this.effs) {
      videoKit.imageToCanvas(eff);
    }
  }
  init() {
    this.effs = [];
    // console.log('eff_nbyn init');
    let videoKit = this.videoKit;
    let devIndex = 1;
    let x0 = 0;
    let y0 = 0;
    let uw = Math.floor(this.eff_src.urect.width);
    let uh = Math.floor(this.eff_src.urect.height);
    let xstep = uw / this.ncell;
    let ystep = uh / this.ncell;
    let props = { ncell: 32, margin: 1, rate: 'frame' };
    // static meta_props = {
    //   ncell: [32, 16, 32, 64, 128],
    //   margin: [1, 2, 3],
    //   rate: ['frame', 'line', 'ncell'],
    // };
    let n = this.ncell * this.ncell;
    for (let index = 0; index < n; index++) {
      let urect = { x0, y0, width: xstep, height: ystep };
      let eff = videoKit.createEffect('grid', devIndex, urect, props);
      console.log('eff_nbyn index', index, 'eff', eff);
      this.effs.push(eff);
      x0 += xstep;
      if (x0 >= uw) {
        x0 = 0;
        y0 += ystep;
        if (y0 >= uh) {
          y0 = 0;
        }
      }
    }
  }
}
