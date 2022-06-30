class eff_grid {
  static meta_props = {
    ncell: [32, 16, 32, 64, 128],
    margin: [1, 2, 3],
    rate: ['frame', 'line', 'ncell'],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    image_copy(this.src, this.input);
    while (!this.draw_one()) {}
    this.output.image(this.src, 0, 0);
    this.output.image(this.glayer, 0, 0);
  }
  init() {
    let w = this.input.width;
    let h = this.input.height;
    this.inw = w;
    this.inh = h;
    if (!this.src) this.src = createImage(w, h);
    if (!this.output) this.output = createGraphics(w, h);
    if (!this.glayer) this.glayer = createGraphics(w, h);
    this.glayer.background(0, 0, 0, 0);
    this.glayer.noStroke();
    this.xs = w / this.ncell;
    this.ys = h / this.ncell;
    if (this.xs > this.ys) {
      this.ys = this.xs;
    } else {
      this.xs = this.ys;
    }
    this.x = 0;
    this.y = 0;
    // this.blk = createImage(this.xs, this.ys);
    // this.img1 = createImage(1, 1);
  }
  draw_one() {
    let layer = this.glayer;
    let x = this.x + this.margin;
    let y = this.y + this.margin;
    // let col = video_get(this, x, y);
    let col = this.src.get(x, y);
    // col[3] = this.alpha;
    let w = this.xs - this.margin;
    let h = this.ys - this.margin;
    layer.fill(col);
    layer.rect(x, y, w, h);
    this.x += this.xs;
    if (this.x >= this.inw) {
      this.x = 0;
      this.y += this.ys;
      if (this.y >= this.inh) {
        this.y = 0;
        return this.rate === 'frame';
      }
      return this.rate === 'line';
    }
    return this.rate === 'ncell';
  }
  // Copy sub-area of pixels to get average
  //  video_get(x, y) {
  //   this.img1.copy(this.src, x, y, this.xs, this.ys, 0, 0, 1, 1);
  //   return this.img1.get(0, 0);
  // }
}

// copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)
