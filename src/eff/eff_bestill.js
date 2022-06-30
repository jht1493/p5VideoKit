class eff_bestill {
  static meta_props = {
    factor: [10, 1, 5, 10, 20, 40, 50, 100, 200, 500, 1000, 2000, 3000, 5000, 10000],
    mirror: [0, 1],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    if (this.mirror) {
      this.bestill_render_mirror();
    } else {
      this.bestill_render();
    }
  }
  init() {
    this.stillf = [this.factor, this.factor, this.factor];
    let input = this.input;
    this.output = createImage(input.width, input.height);
    this.srcimage = createImage(this.output.width, this.output.height);
    this.buf = [];
    // console.log('eff_bestill stillf', this.stillf);
  }
  bestill_render() {
    // console.log('bestill_render this', this);
    if (!this.inited) {
      this.buf_init();
      return;
    }
    let { output, srcimage, buf } = this;
    image_copy(srcimage, this.input);
    srcimage.loadPixels();
    output.loadPixels();
    let rf = this.stillf[0];
    let bf = this.stillf[1];
    let gf = this.stillf[2];
    let rm = rf - 1;
    let bm = bf - 1;
    let gm = gf - 1;
    let w = srcimage.width;
    let h = srcimage.height;
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let ii = (w * y + x) * 4;
        buf[ii + 0] = (buf[ii + 0] * rm + srcimage.pixels[ii + 0]) / rf;
        buf[ii + 1] = (buf[ii + 1] * bm + srcimage.pixels[ii + 1]) / bf;
        buf[ii + 2] = (buf[ii + 2] * gm + srcimage.pixels[ii + 2]) / gf;
        output.pixels[ii + 0] = buf[ii + 0];
        output.pixels[ii + 1] = buf[ii + 1];
        output.pixels[ii + 2] = buf[ii + 2];
      }
    }
    output.updatePixels();
  }
  bestill_render_mirror() {
    // console.log('bestill_render this', this);
    if (!this.inited) {
      this.buf_init();
      return;
    }
    let { output, srcimage, buf } = this;
    image_copy(srcimage, this.input);
    srcimage.loadPixels();
    output.loadPixels();
    let rf = this.stillf[0];
    let bf = this.stillf[1];
    let gf = this.stillf[2];
    let rm = rf - 1;
    let bm = bf - 1;
    let gm = gf - 1;
    let w = srcimage.width;
    let h = srcimage.height;
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let ii = (w * y + x) * 4;
        let jj = (w * y + (w - 1 - x)) * 4;
        buf[ii + 0] = (buf[ii + 0] * rm + srcimage.pixels[ii + 0]) / rf;
        buf[ii + 1] = (buf[ii + 1] * bm + srcimage.pixels[ii + 1]) / bf;
        buf[ii + 2] = (buf[ii + 2] * gm + srcimage.pixels[ii + 2]) / gf;
        output.pixels[jj + 0] = buf[ii + 0];
        output.pixels[jj + 1] = buf[ii + 1];
        output.pixels[jj + 2] = buf[ii + 2];
      }
    }
    output.updatePixels();
  }
  buf_init() {
    this.inited = 1;
    let { buf, output } = this;
    let w = output.width;
    let h = output.height;
    image_copy(output, this.input);
    output.loadPixels();
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let ii = (w * y + x) * 4;
        buf[ii + 0] = output.pixels[ii + 0];
        buf[ii + 1] = output.pixels[ii + 1];
        buf[ii + 2] = output.pixels[ii + 2];
      }
    }
  }
}
