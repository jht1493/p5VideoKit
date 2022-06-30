class eff_slant_scan {
  static meta_props = {
    ncell: [512, 1024, 2028],
    // step: [1, 2, 4, 0.2],
    start: [225, 45, 90, 135, 180, 225, 270, 315],
    end: [360, 90, 135, 180, 270, 315],
    delta: [5, 1, 2, 4, 6, 8, 16, 32, 64],
    dir_up: [0, 1],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    strokeWeight(this.scan.xstep / 2);
    image_copy(this.image, this.input);
    if (this.dir_up) {
      this.draw_scan_up();
    } else {
      this.draw_scan_down();
    }
  }
  init() {
    this.angle = this.start;
    this.from_degrees = TWO_PI / 360;
    let w = this.input.width;
    let h = this.input.height;
    this.r = max(w, h) * 4;
    this.in_width = w;
    this.in_height = h;
    this.output = createGraphics(w, h);
    this.init_image();
    this.init_scan();
    this.init_src();
    if (this.dir_up) {
      this.scan.y = this.scan.yend - this.scan.ystep;
      this.src.y = this.src.yend - this.src.ystep;
    }
  }
  draw_scan_up() {
    this.scan.x = this.scan.xstart;
    this.src.x = this.src.xstart;
    while (this.scan.x < this.scan.xend) {
      let x = this.scan.x + this.step;
      let y = this.scan.y + this.step;
      let col = this.image.get(this.src.x, this.src.y);
      let ang = this.angle * this.from_degrees;
      let x2 = this.r * cos(ang);
      let y2 = this.r * sin(ang);
      this.output.stroke(col);
      this.output.line(x, y, x + x2, y + y2);
      this.scan.x += this.scan.xstep;
      this.src.x += this.src.xstep;
    }
    this.scan.y -= this.scan.ystep;
    this.src.y -= this.src.ystep;
    if (this.scan.y < this.scan.ystart) {
      this.scan.y = this.scan.yend - this.scan.ystep;
      this.src.y = this.src.yend - this.src.ystep;
      this.angle += this.delta;
      if (this.angle > this.end || this.angle < this.start) {
        this.angle = this.start;
      }
    }
  }
  draw_scan_down() {
    this.scan.x = this.scan.xstart;
    this.src.x = this.src.xstart;
    while (this.scan.x < this.scan.xend) {
      let x = this.scan.x + this.step;
      let y = this.scan.y + this.step;
      let col = this.image.get(this.src.x, this.src.y);
      let ang = this.angle * this.from_degrees;
      let x2 = this.r * cos(ang);
      let y2 = this.r * sin(ang);
      this.output.stroke(col);
      this.output.line(x, y, x + x2, y + y2);
      this.scan.x += this.scan.xstep;
      this.src.x += this.src.xstep;
    }
    this.scan.y += this.scan.ystep;
    this.src.y += this.src.ystep;
    if (this.scan.y >= this.scan.yend) {
      this.scan.y = this.scan.ystart;
      this.src.y = this.src.ystart;
      this.angle += this.delta;
      if (this.angle > this.end || this.angle < this.start) {
        this.angle = this.start;
      }
    }
  }
  init_image() {
    let w = this.ncell;
    let h = int(this.ncell * (this.in_height / this.in_width));
    this.image = createImage(w, h);
  }
  init_src() {
    this.src = {};
    this.src.xstart = 0;
    this.src.xend = this.image.width;
    this.src.xdim = this.src.xend - this.src.xstart;
    this.src.ystart = 0;
    this.src.yend = this.image.height;
    this.src.ydim = this.src.yend - this.src.ystart;
    this.src.xstep = 1;
    this.src.ystep = 1;
    this.src.x = this.src.xstart;
    this.src.y = this.src.ystart;
  }
  init_scan() {
    this.scan = {};
    this.scan.xstep = this.in_width / this.ncell;
    this.scan.ystep = this.scan.xstep;
    this.scan.xdim = this.in_width;
    this.scan.xstart = 0;
    this.scan.xend = this.scan.xstart + this.scan.xdim;
    this.scan.ydim = this.in_height;
    this.scan.ystart = 0;
    this.scan.yend = this.scan.ystart + this.scan.ydim;
    this.scan.x = this.scan.xstart;
    this.scan.y = this.scan.ystart;
    // console.log('xstep', this.scan.xstep, 'ystep', this.scan.ystep);
  }
}
