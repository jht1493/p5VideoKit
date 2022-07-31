import { image_copy } from '../../util/image.js?v={{vers}}';

export default class eff_phyllotaxis {
  static meta_props = {
    back_color: [-1, 0, 51, 255, -1],
    nstep: [5, 1, 5, 10, 20, 30, 50, 100, 200, 400, 800, 1000, 2 * 1000],
    len: [6, 0.5, 1, 2, 4, 8, 16, 32, 12, 24],
    max: [-1, 1000, 2000, 3000, 5000, 10 * 1000, 20 * 1000, 30 * 1000, 40 * 1000],
    jump: [0, 1],
    ngrid: [0, 2, 3, 4, 8],
    spacing: [1, 0.125, 0.25, 0.5, 2, 3, 4, 8, 16, 32],
    // hsb: [0, 1],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    this.draw_it();
  }
  init() {
    let { width, height } = this.input;
    this.src = createImage(width, height);
    this.output = createGraphics(width, height);
    let layer = this.output;
    layer.noStroke();
    layer.angleMode(DEGREES);
    // if (this.hsb) {
    //   layer.colorMode(HSB);
    // }
    this.dcount = 0;
    // this.len = 6;
    this.x0 = width / 2;
    this.y0 = height / 2;
    // console.log('eff_phyllotaxis width, height', width, height);
    this.nmax = this.max;
    if (this.nmax < 0) this.nmax = width * height;
    this.a_offset = 0;
    this.off_margin = width * 0.1;
  }
  draw_it() {
    image_copy(this.src, this.input);
    let layer = this.output;
    // if (this.back_color < 0) {
    //   layer.clear();
    // } else {
    //   layer.background(this.back_color);
    // }
    let { width, height } = this.input;
    let offLeft, offRight, offTop, offBottom;
    for (let i = 0; i < this.dcount; i++) {
      let a = i * 137.5 * this.spacing + this.a_offset;
      let r = this.len * sqrt(i);
      let x = r * cos(a) + this.x0;
      let y = r * sin(a) + this.y0;
      // console.log('eff_phyllotaxis i', i, x, y);
      let col = this.src.get(x, y);
      layer.fill(col);
      // console.log('eff_phyllotaxis i', i, x, y, col);
      layer.ellipse(x, y, this.len, this.len);
      if (x < -this.off_margin) offLeft = 1;
      if (x > width + this.off_margin) offRight = 1;
      if (y < -this.off_margin) offTop = 1;
      if (y > height + this.off_margin) offBottom = 1;
      if (offLeft && offRight && offTop && offBottom) {
        this.nhit = i;
        if (!this.nhit_reported) {
          console.log('eff_phyllotaxis nhit', this.nhit, 'nmax', this.nmax);
          this.nhit_reported = 1;
        }
        // eff_phyllotaxis nhit 3619 nmax 129600
        this.nextCycle();
        return;
      }
    }
    // this.dcount = Math.min(this.dcount + this.nstep, this.nmax);
    this.dcount += this.nstep;
    if (this.dcount > this.nmax) {
      this.dcount = this.nmax;
      if (this.jump) {
        this.nextCycle();
      }
    }
  }
  nextCycle() {
    this.a_offset += 1;
    this.dcount = 0;
    if (this.jump) {
      let { width, height } = this.input;
      if (this.ngrid === 0) {
        this.x0 = random(this.off_margin, width - this.off_margin);
        this.y0 = random(this.off_margin, height - this.off_margin);
        // console.log('eff_phyllotaxis x0 y0', this.x0, this.y0);
      } else {
        let w = width / this.ngrid;
        let iw = Math.floor(random(0, this.ngrid));
        let x = w * iw + w / 2;
        let h = height / this.ngrid;
        let ih = Math.floor(random(0, this.ngrid));
        let y = h * ih + h / 2;
        this.x0 = x;
        this.y0 = y;
      }
    }
  }
}

// https://editor.p5js.org/jht1493/sketches/oN4feOu7h
// Phyllotaxis still

// https://editor.p5js.org/codingtrain/sketches/CehY0jsLV
// Phyllotaxis

// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/KWoJgHFYWxY
