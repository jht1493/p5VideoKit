class eff_loop {
  static meta_props = {
    period: [1, 0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 60],
    // phase_check: [0, 1],
    next: {
      button: (ent, aPatch) => {
        ent.next_action(aPatch);
      },
    },
    prev: {
      button: (ent, aPatch) => {
        ent.prev_action(aPatch);
      },
    },
    step_patch: [0, 2, 3],
    _freeze_patch: [0, 1],
    freeze_screen: [0, 1],
  };
  static eff_names = [
    // 'show',
    'bright',
    // 'show',
    'delaunay',
    // 'show',
    'grid',
    // 'show',
    'bright',
    // 'show',
    'maze',
    // 'show',
    'sketchy',
    // 'show',
    'slant_scan',
    // 'show',
    'slit_scan',
  ];
  // static eff_names = [
  //   'show',
  //   'bright',
  //   'show',
  //   'delaunay',
  //   'show',
  //   'grid',
  //   'show',
  //   'bright',
  //   'show',
  //   'maze',
  //   'show',
  //   'sketchy',
  //   'show',
  //   'slant_scan',
  //   'show',
  //   'slit_scan',
  // ];
  // static eff_names = ['show', 'sketchy'];
  // show will trigger patch_stepper in face_mesh
  static eff_namesXX = [
    'show',
    'delaunay',
    'sketchy',
    'maze',
    'grid',
    // 'bright',
    // 'diff',
    // 'triangle',
    // 'slit_scan',
    // 'slant_scan',
  ];
  constructor(props) {
    Object.assign(this, props);
    this.basic_props = Object.assign({}, props);
    this.init();
  }
  render() {
    this.advance_check();
    if (this.advancePending) {
      this.patch_step();
      this.trigger_step();
      this.advancePending = 0;
    }
    let other = this.prepare_input(this.eff_inst);
    if (other) {
      if (this.freeze_patch && this.wasFrozen && this.got_freeze) {
        // console.log('eff_loop  ', this.got_freeze);
        this.draw_freeze();
      } else {
        other.render();
        this.output = other.output;
      }
    }
    this.period_timer.check(() => {
      this.iperiod++;
      if (this.has_phase_check) {
        // Waiting for other.completed_phase
      } else {
        this.possibleAdvance();
      }
    });
    if (0) {
      let src = patch_index1(1);
      if (src) {
        src.draw = 'mesh';
      }
    }
  }
  possibleAdvance() {
    if (this.freeze_patch && this.wasFrozen) {
      return;
    }
    this.advancePending = 1;
  }
  prepare_input(other) {
    if (other) {
      other.input = this.input;
    }
    return other;
  }
  init() {
    this.index = 0;
    this.eff_inst = null;
    this.eff_inst_arr = [];
    this.next_eff();
    this.period_timer = new period_timer(this.period);
    this.iperiod = 0;
    this.img_freeze = createImage(this.input.width, this.input.height);
  }
  trigger_step() {
    if (!this.step_patch) return;
    let src = patch_index1(this.step_patch);
    // console.log(  'trigger_step src', src, 'src.patch_stepper', src.patch_stepper );
    if (src && src.patch_stepper) {
      src.patch_stepper();
    }
  }
  draw_freeze() {
    image_scaled_pad(this.img_freeze, this.isrc.pad);
  }
  advance_check() {
    if (this.freeze_patch) {
      let src = patch_index1(this.freeze_patch);
      if (src) {
        // console.log('src.frozen', src.frozen);
        // if (!this.wasFrozen && src.frozen) {
        //   this.advancePending = 1;
        // }
        this.wasFrozen = src.frozen;
      }
    }
    if (this.has_completed_phase) {
      let other = this.eff_inst;
      if (other.completed_phase()) {
        // this.advancePending = 1;
        this.possibleAdvance();
      }
    }
  }
  patch_step() {
    // console.log('eff_loop step');
    this.next_eff();
  }
  next_action(aPatch) {
    this.next_eff();
  }
  prev_action(aPatch) {
    console.log('eff_loop c index', this.index);
    this.index = this.index - 2;
    let eff_names = this.constructor.eff_names;
    this.index = (eff_names.length + this.index) % eff_names.length;
    console.log('eff_loop d index', this.index);
    this.next_eff();
  }
  next_eff() {
    // console.log('eff_loop a index', this.index);
    let eff_names = this.constructor.eff_names;
    let label = eff_names[this.index];
    this.index = (this.index + 1) % eff_names.length;
    let aeff = effect_label(label);
    // console.log('next_eff aeff', aeff);
    if (aeff) {
      console.log('next_eff aeff', aeff.label);
      let iprops = this.eff_inits(aeff.eff.meta_props);
      // Set input on iprops for eff_inst.init
      this.prepare_input(iprops);
      let eff_inst = this.eff_inst_arr[this.index];
      if (!eff_inst) {
        eff_inst = new aeff.eff(iprops);
        this.eff_inst_arr[this.index] = eff_inst;
      } else {
        // console.log('next_eff init eff_inst', eff_inst);
        eff_inst.init();
      }
      this.eff_inst = eff_inst;
      this.has_completed_phase = this.eff_inst.completed_phase;
    }
  }
  eff_inits(dict) {
    let iprops = Object.assign({}, this.basic_props);
    for (let prop in dict) {
      // eg. items = factor: [10, 50, 100 ... ]
      let items = dict[prop];
      if (prop.substring(0, 1) === '_') {
        prop = prop.substring(1);
      }
      if (Array.isArray(items)) {
        // eg. items = factor: [10, 50, 100 ... ]
        iprops[prop] = items[0];
      } else {
        // eg: _next: { button: next_action }
      }
    }
    return iprops;
  }
}
