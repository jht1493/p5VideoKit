import { image_scaled_pad, image_copy } from '../../util/image.js?v={{vers}}';
import { ui_message } from '../../core-ui/a_ui_create.js?v={{vers}}';
import { FFT_analyser } from '../../util/FFT_analyser.js?v={{vers}}';

export default class eff_face_band {
  static meta_props = {
    align: ['center', 'left', 'right', 'none'],
    alpha: [255, 230, 180, 100, 10],
    size: [0.2, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    back_color: [0, 1],
    fft: [1, 0],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init(this);
  }
  prepareOutput() {
    this.output.clear();
    this.output.noStroke();
    if (this.facemesh) {
      this.facemesh.video = this.video;
    }
    this.drawKeypoints(this.predictions);
    if (this.back_color) {
      fill(this.avg_color);
      rect(this.eff_spec.urect.x0, this.eff_spec.urect.y0, this.eff_spec.urect.width, this.eff_spec.urect.height);
    }
    image_scaled_pad(this.output, this.eff_spec.urect);
  }
  init() {
    console.log('eff_face_band init', this);
    this.fft_anal = new FFT_analyser({ media: this.media });
    this.video = this.input.elt;
    this.predictions = [];
    // console.log('this.video', this.video);
    if (typeof ml5 == 'undefined') {
      // console.log('ml5 undefined');
      return;
    }
    ui_message('loading model...');
    this.facemesh = ml5.facemesh(this.video, function () {
      // console.log('eff_facemesh Model ready!');
      ui_message('');
    });
    this.facemesh.on('predict', (results) => {
      // console.log('facemesh predict results.length', results.length);
      if (results.length !== 0) {
        this.predictions = results;
        this.frozen = 0;
      } else {
        this.frozen = 1;
      }
    });
    let w = this.input.width;
    let h = this.input.height;
    this.img = createImage(w, h);
    this.avg_color = [255, 255, 255, 255];
    this.img = createImage(this.input.width, this.input.height);
    this.output = createGraphics(this.eff_spec.urect.width, this.eff_spec.urect.height);
  }
  drawKeypoints(predictions) {
    let layer = this.output;
    let img = this.img;
    if (!this.frozen) {
      image_copy(img, this.input);
    }

    let urect = this.eff_spec.urect;
    let w = urect.width;
    let h = urect.height;

    let rr = h / img.height;

    let align_none = this.align === 'none';
    let align_cthiser = this.align === 'center';
    let align_right = this.align === 'right';

    // let deep = 0.5;
    let deep = 1.0 - this.size;
    let deeps = [];

    let col_sum = [0, 0, 0];
    let ncol = 0;

    let nsil = 36;
    if (this.fft) {
      let spectrum = this.fft_anal.spectrum();
      let ns = spectrum.length - 1;
      let nhalf = int(nsil / 2);
      // console.log('eff_face_band spectrum.length', spectrum.length, 'nsil', nsil);
      // eff_face_band spectrum.length 1024 nsil 36
      let imax = 0;
      for (let i = ns; i >= 0; i--) {
        let ff = spectrum[i];
        if (ff > 0) {
          imax = i;
          break;
        }
      }
      // console.log('eff_face_band imax', imax);
      let nstep = int((imax + 1) / nsil);
      let is = 0;
      for (let i = 0; i <= nhalf; i++) {
        let sum = 0;
        for (let j = 0; j < nstep; j++) {
          sum += spectrum[is];
          is++;
        }
        sum = sum / nstep;
        let d = map(sum, 0, 255, 1, 0);
        deeps[i] = d;
        deeps[nsil - i] = d;
      }
    } else {
      for (let i = 0; i < nsil; i++) {
        deeps[i] = deep;
      }
    }

    for (let i = 0; i < predictions.length; i += 1) {
      const pred = predictions[i];
      const keypoints = pred.scaledMesh;

      // let box = pred.boundingBox;
      // let [x1k, y1k] = box.topLeft[0];
      // let [x2k, y2k] = box.bottomRight[0];

      let [x1k, y1k] = keypoints[10];
      let [x2k, y2k] = keypoints[152];
      x1k = keypoints[234][0];
      x2k = keypoints[454][0];

      let xlen = x2k - x1k;
      let ylen = y2k - y1k;

      // noFill();
      // rect(x1k * rr, y1k * rr, xlen * rr, ylen * rr);

      let r1 = h / ylen;
      let x0 = 0; // flush left
      if (align_right) x0 = w - xlen * r1;
      else if (align_cthiser) x0 = (w - xlen * r1) / 2;
      else if (align_none) {
        r1 = rr;
        x1k = 0;
        y1k = 0;
      }
      let sil = [...pred.annotations.silhouette];

      layer.strokeWeight(0);

      // let [x1, y1] = keypoints[195];
      let [x1, y1] = keypoints[1];
      x1 = (x1 - x1k) * r1 + x0;
      y1 = (y1 - y1k) * r1;

      sil.push(sil[0]);
      let col;

      for (let i = 0; i < nsil; i++) {
        let [ax, ay] = sil[i];
        col = img.get(ax, ay);
        col[3] = this.alpha;

        col_sum[0] += col[0];
        col_sum[1] += col[1];
        col_sum[2] += col[2];
        ncol++;

        let [bx, by] = sil[i + 1];

        ax = (ax - x1k) * r1 + x0;
        ay = (ay - y1k) * r1;
        let cx = x1 + (ax - x1) * deeps[i];
        let cy = y1 + (ay - y1) * deeps[i];

        bx = (bx - x1k) * r1 + x0;
        by = (by - y1k) * r1;
        let dx = x1 + (bx - x1) * deeps[i];
        let dy = y1 + (by - y1) * deeps[i];

        layer.fill(col);
        layer.quad(ax, ay, bx, by, dx, dy, cx, cy);
      }
      if (ncol > 0) {
        this.avg_color[0] = int(col_sum[0] / ncol);
        this.avg_color[1] = int(col_sum[1] / ncol);
        this.avg_color[2] = int(col_sum[2] / ncol);
      }
    }
  }
}

// Set sound input to local camera
