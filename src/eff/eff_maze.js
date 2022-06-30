class eff_maze {
  static meta_props = {
    ncell: [32, 64, 128, 16],
    weight: [0.5, 0.6, 0.7, 0.8],
    rate: ['frame', 'line', 'ncell'],
    period: [5, 10, 20, 30],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    image_copy(this.src, this.input);
    while (!this.draw_one()) {}
    this.period_timer.check(() => {
      this.period_next();
    });
  }
  init() {
    if (!this.period_timer) this.period_timer = new period_timer(this.period);
    let w = this.input.width;
    let h = this.input.height;
    this.inw = w;
    this.inh = h;
    if (!this.src) this.src = createImage(w, h);
    if (!this.output) this.output = createGraphics(w, h);
    this.xs = w / this.ncell;
    this.ys = h / this.ncell;
    if (this.xs > this.ys) {
      this.ys = this.xs;
    } else {
      this.xs = this.ys;
    }
    // this.img1 = createImage(1, 1);
    this.x = 0;
    this.y = 0;
    this.rs = [];
    this.ri = 0;
    // console.log('this.xs=' + this.xs);
  }
  period_next() {
    this.output.clear();
    this.x = 0;
    this.y = 0;
    this.rs = [];
    this.ri = 0;
    this.full = 0;
  }
  draw_one() {
    let layer = this.output;
    let x = this.x;
    let y = this.y;
    let xlen = this.xs;
    let ylen = this.ys;
    // let col = video_get(this, x, y);
    let col = this.src.get(x, y);
    layer.stroke(col);
    layer.strokeWeight(this.weight * xlen);
    let r;
    if (this.full) {
      r = this.rs[this.ri];
      this.ri++;
    } else {
      r = random(1) > 0.5;
      this.rs.push(r);
    }
    if (r) {
      layer.line(x, y, x + xlen, y + ylen);
    } else {
      layer.line(x, y + ylen, x + xlen, y);
    }
    this.x += this.xs;
    if (this.x >= this.inw) {
      this.x = 0;
      this.y += this.ys;
      if (this.y >= this.inh) {
        this.y = 0;
        this.full = 1;
        this.ri = 0;
        return this.rate === 'frame';
      }
      return this.rate === 'line';
    }
    return this.rate === 'ncell';
  }
}

// Very slow
// Copy sub-area of pixels to get average
// video_get(this, x, y) {
//   this.img1.copy(this.src, x, y, this.xs, this.ys, 0, 0, 1, 1);
//   return this.img1.get(0, 0);
//   // return this.src.get(x, y);
// }

// copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)
