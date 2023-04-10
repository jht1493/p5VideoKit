// Show live media in grid with qr code
//
export default class eff_skin_tone_main {
  static meta_props = [
    { prop: 'ncell', selection: [3, 2, 3, 4, 5, 6, 7] },
    { prop: 'qr_image_index', selection: [-1, 8, 4, 15] },
    { prop: 'ifirst', selection: [2, 1] },
    { prop: 'period', selection: [5, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 10, 20, 30, 60] },
    { prop: 'showQRCode', selection: [1, 0, 1] },
    {
      prop: 'toggleQRCode',
      button: (inst, aPatch) => {
        console.log('toggleQRCode inst', inst);
        inst.showQRCode = inst.showQRCode ? 0 : 1;
        console.log('toggleQRCode inst.showQRCode', inst.showQRCode);
      },
    },
  ];
  constructor(props) {
    // console.log('src/import/eff_skin_tone_main.js');
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    let videoKit = this.videoKit;
    let n = videoKit.mediaDivCount();
    let nshow = this.urects.length;
    let layer = this.output;
    let sindex = this.show_index;
    for (let imedia = this.ifirst; imedia < n; imedia++) {
      let urect = this.urects[sindex].urect;
      videoKit.layerCopyInput(layer, { imedia, urect });
      sindex = (sindex + 1) % nshow;
    }
    if (this.showQRCode) {
      videoKit.layerCopyEffect(layer, this.eff_qr);
    }
    if (this.period_timer.check()) {
      let nstep = n - this.ifirst;
      this.show_index = (this.show_index + nstep) % nshow;
      if (this.show_index == this.qr_image_index) {
        this.showQRCode = 0;
      }
    }
  }
  deinit() {
    this.output.remove();
    this.videoKit.deinitEffect(this.eff_qr);
  }
  init() {
    let videoKit = this.videoKit;
    let urmain = this.eff_spec.urect;
    this.output = createGraphics(urmain.width, urmain.height);
    this.period_timer = new videoKit.PeriodTimer(this.period);
    this.iperiod = 0;
    this.imedia = this.ifirst;
    this.effs_all = [];
    this.urects = [];
    this.show_index = 0;
    let imedia = -1;
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
      let props = {};
      if (index == qrIndex) {
        let eff_label = 'image_url';
        props = { image_url: './effects/skintone-guest_jht1493.net.png' };
        this.eff_qr = videoKit.createEffect({ eff_label, imedia, urect, props });
      }
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

// p5VideoKit.prototype.createEffect = function ({eff_label, imedia, urect, props}) {
