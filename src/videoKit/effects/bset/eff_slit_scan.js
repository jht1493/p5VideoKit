export default class eff_slit_scan {
  static meta_props = {
    xdir: [0, 1],
    step: [6, 1, 2, 4, 8, 16, 0.2],
    auto_flip: [0, 1],
    speed: [0, 1, 2, 5, 10, 20, 100],
    flip: {
      button: (ent, aPatch) => {
        ent.flip_action(aPatch);
      },
    },
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    this.draw_slit();
  }
  init() {
    this.iimage = 0; // to sync with eff_tile
    this.x = 0;
    this.y = 0;
    this.output = createImage(this.input.width, this.input.height);
  }
  flip_action() {
    this.xdir ^= 1;
  }
  draw_slit() {
    this.filled = 0;
    let n = this.xdir ? this.output.width : this.output.height;
    if (this.speed) {
      n = Math.floor(n * (this.speed / 100));
    } else {
      n = 1;
    }
    while (!this.filled && n-- > 0) {
      this.draw_slit1();
    }
  }
  draw_slit1() {
    let w = this.output.width;
    let h = this.output.height;
    let x = this.x;
    let y = this.y;
    let s = this.step;
    if (this.xdir) {
      this.output.copy(this.input, w / 2, 0, s, h, x, 0, s, h);
      //          copy(     video,    sx,sy,sw,sh,dx,dy,dw,dh)
      this.x = this.x + this.step;
      if (this.x > w) {
        this.filled = 1;
        this.x = 0;
        this.check_flip();
      }
    } else {
      this.output.copy(this.input, 0, h / 2, w, s, 0, y, w, s);
      //         copy(      video, sx,   sy,sw,sh,dx,dy,dw,dh)
      this.y = this.y + this.step;
      if (this.y > h) {
        this.filled = 1;
        this.y = 0;
        this.check_flip();
      }
    }
  }
  check_flip() {
    if (this.auto_flip) {
      this.flip_action();
    }
  }
}

// copy(video, sx, sy, sw, sh, dx, dy, dw, dh)
// https://editor.p5js.org/jht1493/sketches/yDHzF0TDZ
// 11.7: Slit-Scan copy-image
