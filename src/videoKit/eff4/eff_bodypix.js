import { ui_message } from '../core/create_ui.js?v={{vers}}';

export default class eff_bodypix {
  static meta_props = {
    alpha: [255, 230, 180, 100, 10],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init(this);
  }
  prepareOutput() {
    if (this.eff_spec.ihide) return;
    this.bodypix.segment(this.video, (error, results) => {
      this.gotResults(error, results);
    });
    if (this.segmentation) {
      image(this.segmentation.backgroundMask, 0, 0, width, height);
    }
  }
  init() {
    ui_message('loading model...');
    this.video = this.input.elt;
    const options = {
      outputStride: 8, // 8, 16, or 32, default is 16
      segmentationThreshold: 0.3, // 0 - 1, defaults to 0.5
    };
    this.bodypix = ml5.bodyPix(options);
  }
  gotResults(error, result) {
    ui_message('');
    if (this.eff_spec.ihide) return;
    if (error) {
      console.log('eff_body_pix', error);
      return;
    }
    this.segmentation = result;
    this.bodypix.segment(this.video, (error, results) => {
      this.gotResults(error, results);
    });
  }
}

// https://learn.ml5js.org/#/reference/bodypix

// https://editor.p5js.org/ml5/sketches/BodyPix_Webcam_Parts
// https://editor.p5js.org/ml5/sketches/BodyPix_Webcam
