class eff_tile_clock {
  static meta_props = {
    center_draw: ['pixd', 'mesh', 'dots', 'rects', 'tris', 'crop', 'cycle'],
    // ncell: [3, 2, 3, 4, 5, 6, 7, 8],
    period: [1, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 10, 20, 30, 60],
    next: {
      button: (ent, aPatch) => {
        ent.next_action(aPatch);
      },
    },
    prev: {
      button: (ent, aPatch) => {
        ent.previous_action(aPatch);
      },
    },
    pixd_n: [16, 8, 16, 32, 64, 128],
    gray_back: [0, 1, 0],
    _freeze_patch: [0, 1],
    center_only: [0, 1],
    freeze_damp: [1, 0, 0.5, 1, 2, 3, 4, 5, 6, 10, 20, 30, 60],
  };
  // 3 x 3 grid position 0,1,2 x and y
  static clock_wise_pos = [
    // [x, y]
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2],
    [1, 2],
    [0, 2],
    [0, 1],
    [0, 0],
  ];
  static center_pos = [1, 1];

  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    this.check_patches();
    if (this.advancePending) {
      this.draw_step(1);
      if (this.center_only) {
        this.draw_live();
      }
      this.advancePending = 0;
    }
    if (!this.center_only) {
      if (this.freeze_patch && this.wasFrozen) {
        this.draw_live();
      } else {
        this.draw_stamp();
      }
    }
    this.draw_center();
    this.period_timer.check(() => {
      this.iperiod++;
      if (this.freeze_patch) {
        if (!this.wasFrozen) {
          this.capture_live();
        }
      } else {
        this.advancePending = 1;
      }
    });
  }
  next_action(aPatch) {
    this.draw_step(1);
  }
  previous_action(aPatch) {
    this.draw_step(-1);
  }
  init() {
    this.ncell = 3;
    this.wasFrozen = 0;
    this.iperiod = 0;
    this.period_timer = new period_timer(this.period);
    this.twidth = width;
    this.theight = height;
    this.output = createGraphics(this.twidth, this.theight);
    this.xstep = Math.floor(this.twidth / this.ncell);
    this.ystep = Math.floor(this.theight / this.ncell);
    this.img_live = createImage(this.xstep, this.ystep);
    this.index = 0;
    this.draw_step(0);
    this.center_layer = createGraphics(this.xstep, this.ystep);
    this.pixd_img = createImage(this.pixd_n, this.pixd_n);
    this.face_mesh_center = {
      align: 'center',
      alpha: 255,
      mar_h: 5,
      // draw: 'pixd',
      // ddraw: 'pixd',
      draw: this.center_draw,
      ddraw: this.center_draw,
      slen: 5,
      output: this.center_layer,
      from: 0, // Only use first face detected
      to: 1,
      avg_color: [255, 255, 255, 255],
      pixd_img: this.pixd_img,
    };
    this.advancePendingTime = 0;
  }
  draw_center() {
    let simg = this.center_layer;
    let sx = 0;
    let sy = 0;
    let sw = simg.width;
    let sh = simg.height;
    let { xstep, ystep } = this;
    let x = xstep;
    let y = ystep;
    this.output.copy(simg, sx, sy, sw, sh, x, y, xstep, ystep);
  }
  patch_stepper() {
    this.advancePending = 1;
  }
  draw_step(dir) {
    let [xpos, ypos] = this.constructor.clock_wise_pos[this.index];
    // console.log('draw_step index', this.index, xpos, ypos);
    let n = this.constructor.clock_wise_pos.length;
    this.index = (this.index + dir + n) % n;
    this.x = this.xstep * xpos;
    this.y = this.ystep * ypos;
  }
  check_patches() {
    if (this.freeze_patch) {
      let src = patch_index1(this.freeze_patch);
      if (src) {
        // console.log('src.frozen', src.frozen);
        if (this.advancePendingTime) {
          let ntime = new Date().getTime();
          let lapse = (ntime - this.advancePendingTime) / 1000;
          if (lapse > this.freeze_damp) {
            if (src.frozen) {
              this.advancePending = 1;
              this.advancePendingTime = 0;
            }
            // this.wasFrozen = src.frozen;
          }
        } else {
          if (!this.wasFrozen && src.frozen) {
            this.advancePendingTime = new Date().getTime();
            // this.advancePending = 1;
          }
          // this.wasFrozen = src.frozen;
        }
        this.wasFrozen = src.frozen;
        this.draw_to_center_layer(src);
      }
    }
  }
  draw_to_center_layer(src) {
    let layer = this.center_layer;
    layer.clear();
    if (this.gray_back) {
      layer.background(this.face_mesh_center.avg_color);
    } else if (src.avg_color) {
      layer.background(src.avg_color);
    }
    layer.noStroke();
    // layer.strokeWeight(0);
    face_mesh_draw(this.face_mesh_center, src.img, src.predictions);
  }
  draw_stamp() {
    let simg = this.input;
    if (this.advancePending) return;
    let sx = 0;
    let sy = 0;
    let sw = simg.width;
    let sh = simg.height;
    let { x, y, xstep, ystep } = this;
    this.output.copy(simg, sx, sy, sw, sh, x, y, xstep, ystep);
    // copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)
    this.last_x = x;
    this.last_y = y;
  }
  draw_live() {
    // console.log('draw_live');
    let simg = this.img_live;
    let sx = 0;
    let sy = 0;
    let sw = simg.width;
    let sh = simg.height;
    let { xstep, ystep } = this;
    let x = this.last_x;
    let y = this.last_y;
    if (this.center_only) {
      x = this.x;
      y = this.y;
    }
    this.output.copy(simg, sx, sy, sw, sh, x, y, xstep, ystep);
  }
  capture_live() {
    // console.log('capture_live');
    let dimg = this.img_live;
    let { xstep, ystep } = this;
    let sx = this.last_x;
    let sy = this.last_y;
    if (this.center_only) {
      sx = xstep;
      sy = ystep;
    }
    dimg.copy(this.output, sx, sy, xstep, ystep, 0, 0, dimg.width, dimg.height);
    // this.got_freeze = this.iperiod;
  }
}
