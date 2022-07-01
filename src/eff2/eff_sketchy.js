class eff_sketchy {
  static meta_props = {
    speed: [150, 1, 2, 5, 10, 20, 100],
    alpha: [255, 230, 180, 100, 10],
    // phase_factor: [55, 20, 30, 40, 50],
    phase_max: [200, 50, 100, 200],
    edgeX: [0, 1],
    edgeY: [0, 1],
  };
  constructor(props) {
    // console.log('eff_sketchy constructor props ', props);
    Object.assign(this, props);
    this.init();
  }
  render() {
    this.update_phase();
    this.sketchy_draw();
  }
  sketchy_draw() {
    image_copy(this.a_image, this.input);
    let n = this.output.width;
    if (this.speed) {
      n = Math.floor(n * (this.speed / 100));
    } else {
      n = 100;
    }
    while (!this.filled && n-- > 0) {
      for (let obj of this.objs) {
        this.draw_obj(obj);
      }
    }
  }
  update_phase() {
    this.phase_down--;
    if (this.phase_down < 0) {
      this.phase_down = this.phase_max;
      // this.phase ^= 1;
      this.phase = 1;
    }
  }
  init_phase() {
    this.phase_down = this.phase_max;
    this.phase = 0;
    // console.log('eff_sketchy phase_max', this.phase_max);
  }
  completed_phase() {
    return this.phase;
  }
  // new_phase(nthis) {
  //   let nphase;
  //   if (nthis.phase === undefined) {
  //     nthis.phase = this.phase;
  //     nphase = 0;
  //   } else {
  //     nphase = this.phase != nthis.phase;
  //     nthis.phase = this.phase;
  //   }
  //   return nphase;
  // }
  init() {
    let w = this.input.width;
    let h = this.input.height;
    // console.log('eff_sketchy w', w, 'h', h);
    this.init_phase();
    if (!this.output) this.output = createGraphics(w, h);
    this.output.noStroke();
    if (!this.a_image) this.a_image = createImage(w, h);
    this.a_alpha = 100;
    this.d_scale = 1;
    this.objs = this.init_objs();
    for (let obj of this.objs) {
      this.initpos_obj(obj);
    }
  }
  init_objs() {
    return [
      {
        step: 0.01, // each step (0.0 to 1.0)
        pct: 0, // Percentage traveled (0.0 to 1.0)
        gray: 0,
        x: 0,
        y: 50,
        d: 100,
        d_range: [2, 4],
        color_step: 1,
      },
      {
        step: 0.01, // each step (0.0 to 1.0)
        pct: 0, // Percentage traveled (0.0 to 1.0)
        gray: 255,
        x: 0,
        y: 50,
        d: 10,
        // d_range: [10, 20],
        d_range: [5, 10],
        color_step: -1,
      },
    ];
  }
  draw_obj(ob) {
    let layer = this.output;
    let col = this.a_image.get(ob.x, ob.y);
    col[3] = this.a_alpha;
    let dd = ob.d * this.d_scale;
    layer.fill(col);
    layer.circle(ob.x - dd / 2, ob.y, dd);
    // ob.gray += ob.color_step;
    // if (ob.gray > 255 || ob.gray < 0) {
    //   ob.color_step *= -1;
    //   ob.gray += ob.color_step;
    // }
    this.step_obj(ob);
  }
  step_obj(ob) {
    if (ob.pct < 1.0) {
      ob.x = ob.startX + (ob.stopX - ob.startX) * ob.pct;
      ob.y = ob.startY + (ob.stopY - ob.startY) * ob.pct;
      ob.pct += ob.step;
    } else {
      this.nextpos_obj(ob);
    }
  }
  nextpos_obj(ob) {
    ob.startX = ob.stopX;
    ob.startY = ob.stopY;
    ob.pct = 0;
    this.init_stop(ob, this.output);
  }
  initpos_obj(ob) {
    let layer = this.output;
    this.d_scale = layer.width / 640;
    ob.edgeX = this.edgeX;
    ob.edgeY = this.edgeY;
    ob.step = (1 / layer.width) * 7;
    ob.pct = 0;
    this.init_stop(ob, layer);
    ob.startX = round(random(ob.w_range[0], ob.w_range[1]));
    ob.startY = round(random(ob.h_range[0], ob.h_range[1]));
    if (ob.edgeX) {
      ob.startX = 0;
    } else if (ob.edgeY) {
      ob.startY = 0;
    }
  }
  init_stop(ob) {
    let layer = this.output;
    ob.d = random(ob.d_range);
    let m = ob.d * 2;
    ob.w_range = [-m, layer.width + m];
    ob.h_range = [-m, layer.height + m];
    ob.stopX = round(random(ob.w_range[0], ob.w_range[1]));
    ob.stopY = round(random(ob.h_range[0], ob.h_range[1]));
    if (ob.edgeX) {
      ob.stopX = ob.edgeX & 2 ? 0 : ob.w_range[1];
      ob.edgeX ^= 2;
    } else if (ob.edgeY) {
      ob.stopY = ob.edgeY & 2 ? 0 : ob.h_range[1];
      ob.edgeY ^= 2;
    }
  }
}
