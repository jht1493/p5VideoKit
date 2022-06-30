class eff_triangle {
  static meta_props = {
    dcell: [5, 10, 20, 30],
    rate: ['frame', 'line', 'ncell'],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    image_copy(this.img, this.input);
    while (!this.scan_draw_step()) {}
    // image_scaled_pad(this.output, this.isrc.pad);
  }
  init() {
    this.iimage = 0; // to sync with eff_tile
    let w = this.input.width;
    let h = this.input.height;
    this.img = createImage(w, h);
    this.output = createGraphics(w, h);
    this.output.noStroke();
    this.x = 0;
    this.y = 0;
    this.nstep = 200;
    this.flag = 1;
  }
  scan_draw_step() {
    let layer = this.output;
    let img = this.img;
    let d = this.dcell;
    let col = img.get(this.x, this.y);
    layer.fill(col);
    let x1 = this.x;
    let y1 = this.y;
    let x2 = x1 + d;
    let y2 = y1 + d;
    let x3 = x1 - d;
    let y3 = y1 + d;
    if (this.flag) {
      x1 = this.x - d;
      x2 = this.x + d;
      y2 = y1;
      x3 = this.x;
    }
    this.flag = !this.flag;
    layer.triangle(x1, y1, x2, y2, x3, y3);
    this.x += d;
    let xstop = img.width;
    if (this.x >= xstop) {
      this.x = 0;
      this.y += d;
      this.flag = !this.flag;
      if (this.y >= img.height) {
        this.y = 0;
        this.iimage++;
        return this.rate === 'frame';
      }
      return this.rate === 'line';
    }
    return this.rate === 'ncell';
  }
}
