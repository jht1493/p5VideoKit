// Show live media in grid from room
//    VideoKit-Room-4
//

export default class eff_live_gallery {
  static meta_props = {
    ncell: [2, 2, 3, 4, 5, 6, 7],
    ifirst: [2, 1],
    nPerHour: [0, 1, 2, 5, 10, 15, 20, 30, 60],
    nPerMinute: [0, 1, 2, 5, 10, 15, 20, 30, 60],
    nPerSecond: [0, 1, 2, 5, 10, 15, 20, 30, 60],
    period: [60, -1, 5, 10, 15, 30, 60, 120],
    save_name: {
      text_input: 'live_gallery',
    },
  };
  constructor(props) {
    // console.log('src/import/eff_live_gallery.js');
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    let videoKit = this.videoKit;
    let n = videoKit.mediaDivCount();
    let nshow = this.urects.length;
    let layer = this.output;
    let sindex = 0;
    for (let imedia = this.ifirst; imedia < n; imedia++) {
      let urect = this.urects[sindex].urect;
      videoKit.layerCopyInput(layer, { imedia, urect });
      sindex = (sindex + 1) % nshow;
    }
    if (this.period_timer.check() || this.firstPeriod) {
      // Save entire canvas. We could save individual images
      console.log('eff_live_gallery period_timer');
      saveCanvas(this.output, this.save_name, 'jpg');
      this.firstPeriod = 0;
    }
  }

  init() {
    // this.firstPeriod = 1;
    this.firstPeriod = 0;
    let videoKit = this.videoKit;
    let urmain = this.eff_spec.urect;
    this.output = createGraphics(urmain.width, urmain.height);
    // let period = -1;
    let period = this.period;
    if (this.nPerHour) {
      period = 60 * 60 * (1 / this.nPerHour);
    }
    if (this.nPerMinute) {
      period = 60 * (1 / this.nPerMinute);
    }
    if (this.nPerSecond) {
      period = 1 / this.nPerSecond;
    }
    this.period_timer = new videoKit.PeriodTimer(period);
    this.iperiod = 0;
    this.urects = [];
    let x0 = urmain.x0;
    let y0 = urmain.y0;
    let wedge = x0 + urmain.width;
    let hedge = y0 + urmain.height;
    let xstep = wedge / this.ncell;
    let ystep = hedge / this.ncell;
    let n = this.ncell * this.ncell;
    let qrIndex = this.qr_image_index;
    if (qrIndex < 0) qrIndex = n - 1;
    for (let index = 0; index < n; index++) {
      let urect = { x0, y0, width: xstep, height: ystep };
      this.urects.push({ urect });
      x0 += xstep;
      if (x0 + xstep > wedge) {
        x0 = urmain.x0;
        y0 += ystep;
        if (y0 + ystep > hedge) {
          y0 = urmain.y0;
        }
      }
    }
  }
}
/*

// !!@ Source graphics must be arg to saveCanvas

      this.output.saveCanvas(this.save_name, 'jpg');

Uncaught TypeError: Cannot read properties of undefined (reading 'toBlob')
    at k.default.saveCanvas (p5.min.js:3:552605)
    at eff_live_gallery.prepareOutput (eff_live_gallery.js?v={{vers}}:34:19)
    at p5VideoKit.draw_patch (apex.js?v={{vers}}:218:8)
    at p5VideoKit.draw (apex.js?v={{vers}}:47:18)
    at draw (sketch.js?v={{vers}}:47:12)
    at o.default.redraw (p5.min.js:3:487659)
    at _draw (p5.min.js:3:424542)

*/
