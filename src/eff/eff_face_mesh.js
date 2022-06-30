class eff_face_mesh {
  static meta_props = {
    alpha: [255, 230, 180, 100, 10],
    align: ['center', 'left', 'right', 'none'],
    back_color: [0, 1],
    period: [0, 0.5, 1, 2, 5, 10, 20, 30, 60],
    hi_rez: [1, 0],
    sticky: [1, 0],
    _reveal: [0, 5, 10, 12, 15, 20, 30, 40, 50, 100, 200, 500],
    reveal_full: [1, 0],
    box_outter: [0, 1],
    box_rect: [0, 1],
    // _src_patch: [0, 1],
    _mar_h: [0, 0, 2, 5, 10, 20, 30, 40],
    draw: ['mesh', 'dots', 'rects', 'tris', 'crop', 'pixd', 'cycle'],
    draw_mod: [4], // how many to cycle thru
    slen: [2, 1, 2, 3, 4, 5, 10],
    // show: [1, 0],
    _mask_index: [0, 1440],
    avg_index: [0, 1440],
    pixd_n: [8, 16, 32, 64, 128],
    detect_max: [1, 10],
  };
  static tri_dir = [
    [
      [1, 1],
      [-1, -1],
    ],
    [
      [-1, -1],
      [1, -1],
    ],
    [
      [1, -1],
      [1, 1],
    ],
    [
      [-1, 1],
      [-1, -1],
    ],
  ];
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    if (this.facemesh) {
      this.facemesh.video = this.video;
    }
    let layer = this.output;
    layer.noStroke();
    // layer.strokeWeight(0);
    if (this.back_color) {
      layer.fill(this.avg_color);
      layer.rect(0, 0, layer.width, layer.height);
    } else {
      layer.clear();
    }
    this.drawKeypoints();
    if (this.reveal_full && !this.mesh_done) {
      return;
    }
    this.period_timer.check(() => {
      this.iperiod++;
      // console.log('eff_face_mesh this.iperiod ', this.iperiod);
    });
  }
  patch_stepper() {
    console.log('eff_face_mesh patch_stepper', this.draw_index, '', this.draw);
    this.draw_index = (this.draw_index + 1) % this.draw_mod;
    this.draw = this.constructor.meta_props.draw[this.draw_index];
    // console.log('eff_face_mesh draw_index', this.draw_index, '', this.draw);
  }
  init() {
    // this.hi_rez = 1; // Process at output pad resolution
    this.init_input = this.input;
    this.cycle_period = 0;
    // this.from = 0; // Only use first face detected
    this.from = 0;
    this.to = this.detect_max; // Detect max
    // this.to = 1;
    this.mesh_done = 0;
    this.nnits = 0;
    this.iperiod = 0;
    this.iperiod_next = -1;
    this.period_timer = new period_timer(this.period);
    this.video = this.input.elt;
    this.predictions = [];
    this.iupdate = 0;
    ui_message('loading model...');
    this.facemesh = ml5.facemesh(this.video, function () {
      // console.log('eff_facetrian Model ready!');
      ui_message('');
    });
    this.facemesh.on('predict', (results) => {
      // console.log('facemesh predict results.length', results.length);
      if (this.draw == 'cycle') {
        this.iperiod_next = this.iperiod + 1;
      }
      if (results.length !== 0 && this.iperiod != this.iperiod_next) {
        this.iupdate++;
        this.iperiod_next = this.iperiod;
        this.predictions = results;
        this.nnits = 0;
        this.frozen = 0;
      } else {
        this.frozen = 1;
      }
    });
    this.avg_color = [255, 255, 255, 255];
    let w = this.input.width;
    let h = this.input.height;
    // console.log('eff_face_mesh img w', w, 'h', h);
    this.img = createImage(w, h);
    if (this.hi_rez) {
      w = this.isrc.pad.width;
      h = this.isrc.pad.height;
    }
    // console.log('eff_face_mesh hi_rez', this.hi_rez, 'w', w, 'h', h);
    this.output = createGraphics(w, h);
    this.draw_index = 0;
    w = this.pixd_n;
    h = this.pixd_n;
    this.pixd_img = createImage(w, h);
  }
  drawKeypoints() {
    if (!this.frozen) {
      image_copy(this.img, this.init_input);
    } else {
      // No face detected
      // Display nothing if enabled
      // Otherwise last capture is displayed
      if (!this.sticky) {
        return;
      }
    }
    this.ddraw = this.draw;
    if (this.ddraw === 'cycle') {
      this.ddraw = this.constructor.meta_props.draw[this.draw_index];
      if (this.cycle_period != this.iperiod) {
        this.cycle_period = this.iperiod;
        this.draw_index = (this.draw_index + 1) % 4;
      }
    }
    face_mesh_draw(this, this.img, this.predictions);
  }
}
