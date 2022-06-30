let g_image_groups = [
  'group',
  'fmfm',
  'fema',
  'male',
  'group',
  'graph',
  'other',
  'test',
  'jht',
  'covid19m',
  '370-img',
  'screens',
];

class eff_image_show {
  static meta_props = {
    group: g_image_groups,
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
    reset: {
      button: (ent, aPatch) => {
        ent.reset_action(aPatch);
      },
    },
    labeled: [0, 1],
    label_align: ['center', 'left', 'right'],
    image_align: ['none', 'center'],
    _loop: [0, 1],
    period: [5, 10, 20, 30, 60],
    shuffle: [0, 1, 0],
    // pixel_density: [1, 2, 4],
    _face: ['none', 'mesh', 'points'],
    align: ['center', 'none'],
    alpha: [255, 230, 180, 100, 10],
    color: ['black', 'white', 'color'],
    ncell: [32, 64, 128, 256, 512, 16],
    shape: ['circle', 'rect'],
    _zoomed: [0, 1],
    peg_width: [1, 0],
    zoom_out: {
      button: (ent, aPatch) => {
        return ent.zoom_out_action(aPatch);
      },
    },
    pan: {
      button: (ent, aPatch) => {
        return ent.pan_action(aPatch);
      },
    },
    add: {
      button: (ent, aPatch) => {
        return ent.add_action(aPatch);
      },
    },
    pan_ease: [0, 1],
    _export_on: [0, 1],
    export_do: {
      button: (ent, aPatch) => {
        ent.export_action(aPatch);
      },
    },
    // _image_name: [
    //   'test/fac.png',
    //   'fema/212.jpg',
    //   'fema/216.jpg',
    //   'fema/217.jpg',
    //   'male/068.jpg',
    //   'male/187.jpg',
    //   'male/189.jpg',
    // ],
    // show: [1, 0],
    // load_msg: [1, 0],
    // reveal: [0, 5, 10, 50, 100, 200, 500],
    // bbox: [0, 1],
    // wt: [0, 0.1, 0.2, 0.5, 1],
  };
  constructor(props) {
    Object.assign(this, props);
    this.image_name = 'test/fac.png';
    // this.show = 1;
    this.load_msg = 1;
    // this.export = 0;
    this.reveal = 0;
    this.bbox = 0;
    this.wt = 0;
    this.col_black = this.color === 'black';
    this.col_white = this.color === 'white';
    this.shapef = this.shape === 'rect' ? rect : ellipse;
    this.avg_color = [255, 255, 255, 255];
    this.init();
    this.zoom_init();
    this.align_center = this.image_align === 'center';
    // console.log('eff_image_show pad', this.isrc.pad);
    my_canvas.mousePressed(() => {
      this.mousePressed();
    });
    this.output = createGraphics(this.isrc.pad.width, this.isrc.pad.height);
  }
  render() {
    if (!this.img) return;
    if (this.loop) {
      this.period_timer.check(() => {
        this.period_next();
      });
    }
    this.pan_check();
    this.show_image();
    this.face_render();
  }
  init() {
    this.predictions = [];
    this.period_timer = new period_timer(this.period);
    this.load_image();
  }
  show_image() {
    if (!this.zoomed) {
      layer_image_scaled_pad(this.output, this.img, this.isrc.pad, this.align_center);
      // this.output = this.img;
    } else {
      this.show_zoomed(this.img, this.isrc.pad);
    }
    this.draw_image_name();
  }
  draw_image_name() {
    if (!this.labeled) return;
    let layer = this.output;
    let index = this.image_name.lastIndexOf('/') + 1;
    let lindex = this.image_name.lastIndexOf('.');
    let str = this.image_name.substr(index, lindex - index);
    let ta = layer.textAscent();
    let td = layer.textDescent();
    let tw = layer.textWidth(str);
    let margin = 2;
    layer.fill('black');
    let hi = margin * 2 + ta + td;
    let pw = layer.width;
    let x = 0;
    if (this.label_align == 'center') {
      x += pw / 4 - (tw + margin) / 2;
    } else if (this.label_align == 'right') {
      x += pw - (tw + margin);
    } else {
      x += margin;
    }
    let y = layer.height - hi;
    layer.rect(x, y, tw + margin * 2, hi);
    layer.fill('white');
    x += margin;
    y += ta + margin;
    layer.text(str, x, y);
  }
  show_zoomed(img, pad) {
    if (!pad) pad = { width, height, x0: 0, y0: 0 };
    let dw = pad.width;
    let dh = pad.height;
    let iw = img.width;
    let ih = img.height;
    let rr = ih / iw;
    if (this.peg_width) {
      dh = dw * rr;
    } else {
      dw = dh / rr;
    }
    iw = dw * this.zscale;
    ih = dh * this.zscale;
    // image(img, pad.x0, pad.y0, dw, dh, -this.zx0, -this.zy0, iw, ih);
    // image(img, pad.x0 + this.zx0, pad.y0 + this.zy0, dw, dh, 0, 0, iw, ih);
    image(img, pad.x0, pad.y0, dw, dh, this.zx0, this.zy0, iw, ih);
    // image(img, dx,     dy,     dWidth, dHeight, sx, sy, [sWidth], [sHeight])
    //       img, pad.x0, pad.y0, dw,     dh,      0,  0,  iw,       ih
    // console.log('rr', rr);
  }
  mouseDragged() {
    // this.mousePressed();
    // this.zx0 = (this.mouseX - mouseX) * this.zscale;
    // this.zy0 = (this.mouseY - mouseY) * this.zscale;
    this.zx0 = (this.mouseX - mouseX) * this.zscale;
    this.zy0 = (this.mouseY - mouseY) * this.zscale;
  }
  mousePressed() {
    console.log('eff_image_show mousePressed');
    if (keyIsPressed && keyCode == SHIFT) {
      this.zscale /= 2;
    }
    this.mouseX = this.zx0 / this.zscale + mouseX;
    this.mouseY = this.zy0 / this.zscale + mouseY;
    // console.log('eff_image_show mouseX', mouseX, 'mouseY', mouseY);
  }
  mouseReleased() {
    // console.log('> zx0', this.zx0, 'zy0', this.zy0, 'zscale', this.zscale);
  }
  zoom_init() {
    this.show = !this.zoomed;
    this.zx0 = 0;
    this.zy0 = 0;
    this.zscale = 4;
    this.mouseX = 0;
    this.mouseY = 0;
    this.pan_index = 0;
  }
  pan_action() {
    console.log('pan_action', this.image_name);
    let cus = a_closeup[this.image_name];
    if (!cus) return 1;
    let cu = cus[this.pan_index];
    this.pan_index = (this.pan_index + 1) % cus.length;
    if (this.pan_ease) {
      this.pan_target = cu;
    } else {
      this.zx0 = cu.x;
      this.zy0 = cu.y;
      this.zscale = cu.s;
    }
  }
  pan_check() {
    if (!this.pan_target) return;
    let easing = 0.05;
    let cu = this.pan_target;
    this.zx0 += (cu.x - this.zx0) * easing;
    this.zy0 += (cu.y - this.zy0) * easing;
    this.zscale += (cu.s - this.zscale) * easing;
  }
  add_action() {
    let cu = { x: this.zx0, y: this.zy0, s: this.zscale };
    let cus = a_closeup[this.image_name];
    if (!cus) {
      cus = [];
      a_closeup[this.image_name] = cus;
    }
    cus.push(cu);
    let str = JSON.stringify(a_closeup, null, 2);
    console.log(str);
  }
  zoom_out_action() {
    let zscale = this.zscale * 2;
    this.zoom_init();
    // this.zscale = zscale;
    this.zscale = this.zscale_org;
    console.log('this.zscale', this.zscale);
  }
  face_render() {
    noStroke();
    if (this.face === 'points') {
      this.draw_face_points(this.predictions);
    }
    // 'mesh' this.draw_face_mesh(this.predictions);
  }
  export_action() {
    let ename = this.replace_ext(this.image_name, '.json');
    saveJSON(this.predictions, ename);
  }
  next_action(aPatch) {
    if (!aPatch.eff.iimage) aPatch.eff.iimage = 0;
    aPatch.eff.iimage = (aPatch.eff.iimage + 1) % this.images.length;
    // if (aPatch.eff.iimage < 0 || aPatch.eff.iimage >= this.images.length - 1) aPatch.eff.iimage = 0;
    ui_patch_update(aPatch);
  }
  previous_action(aPatch) {
    if (!aPatch.eff.iimage) aPatch.eff.iimage = 0;
    aPatch.eff.iimage--;
    // if (aPatch.eff.iimage < 0) aPatch.eff.iimage = this.images.length - 1;
    ui_patch_update(aPatch);
  }
  reset_action(aPatch) {
    delete aPatch.iimage;
    ui_patch_update(aPatch);
  }
  period_next() {
    if (!this.iimage) this.iimage = 0;
    this.iimage = (this.iimage + 1) % this.images.length;
    // console.log('period_next this.iimage', this.iimage);
    this.load_image();
  }
  load_image() {
    this.nnits = 0;
    // !!@ this.group is string undefined sometimes. not sure why.
    // if (!this.group) this.group = 'group';
    this.images = a_images[this.group];
    // if (!this.images) this.images = a_images['group'];
    // console.log('load_image images', this.images, 'group', this.group);
    if (this.shuffle) {
      this.images = shuffle(this.images);
    }
    let image_name = this.image_name;
    if (this.iimage !== undefined) {
      // console.log('eff_image_show this.iimage=' + this.iimage);
      if (this.iimage >= this.images.length) {
        this.iimage = this.images.length - 1;
      }
      image_name = this.group + '/' + this.images[this.iimage];
    }
    let ipath = '../assets/webdb/' + image_name;
    loadImage(ipath, (img) => {
      console.log('eff_image_show img.width', img.width, 'height', img.height);
      console.log('eff_image_show output width', this.output.width, 'height', this.output.height);
      console.log('eff_image_show pad width', this.isrc.pad.width, 'height', this.isrc.pad.height);

      if (this.zoomed) {
        this.zscale = img.width / this.isrc.pad.width;
        this.zscale_org = this.zscale;
        console.log('eff_image_show this.zscale', this.zscale);
      }
      console.log('ipatch', this.isrc.ipatch, 'image_name', image_name);
      this.imageReady(img, image_name);
    });
  }
  // when the image is ready, then load up poseNet
  imageReady(img, image_name) {
    this.img = img;
    this.image_name = image_name;
    if (this.face === 'none') return;
    let jname = this.replace_ext(this.image_name, '.json');
    let jpath = '../assets/webdb/' + jname;
    console.log('eff_image_show jpath', jpath);
    // console.log('eff_image_show export_on', this.export_on);
    if (this.export_on) {
      this.load_model();
    } else {
      loadJSON(
        jpath,
        (obj) => {
          // console.log('loadJSON obj', obj);
          this.predictions = obj;
        },
        (err) => {
          console.log('loadJSON err', err);
          this.load_model();
        }
      );
    }
  }
  replace_ext(name, ext) {
    // fema/212.jpg
    // fmfm/../fema/212.jpg
    let index = name.lastIndexOf('.');
    let ename = this.image_name.substring(0, index) + ext;
    return ename;
  }
  load_model() {
    if (this.load_msg) {
      ui_message('loading model...');
    }
    this.facemesh = ml5.facemesh(() => {
      // console.log('eff_image_show Model ready!');
      ui_message('');
      this.facemesh.predict(this.img);
      // console.log('eff_image_show 2');
    });
    this.facemesh.on('predict', (results) => {
      // console.log('eff_image_show predict');
      this.predictions = results;
      if (this.export_on) {
        this.export_action();
      }
    });
  }
  draw_face_points(predictions) {
    let img = this.img;
    let fget = (x, y) => {
      let col = img.get(x, y);
      col[3] = this.alpha;
      return col;
    };
    if (this.col_black) {
      fget = (x, y) => {
        return [0, 0, 0, this.alpha];
      };
    } else if (this.col_white) {
      fget = (x, y) => {
        return [255, 255, 255, this.alpha];
      };
    }
    let pad = this.isrc.pad;
    let w = pad.width;
    let h = pad.height;
    let ox0 = pad.x0;
    let oy0 = pad.y0;
    let rr = h / img.height;
    let c_len = w / this.ncell;
    let align_none = this.align === 'none';
    let align_center = this.align === 'center';
    let align_right = this.align === 'right';
    noStroke();
    for (let i = 0; i < predictions.length; i += 1) {
      const pred = predictions[i];
      const keypoints = pred.scaledMesh;
      // let box = pred.boundingBox;
      // let [x1, y1] = box.topLeft[0];
      // let [x2, y2] = box.bottomRight[0];
      let [x1, y1] = keypoints[10];
      let [x2, y2] = keypoints[152];
      x1 = keypoints[234][0];
      x2 = keypoints[454][0];
      let xlen = x2 - x1;
      let ylen = y2 - y1;
      noFill();
      rect(ox0 + x1 * rr, oy0 + y1 * rr, xlen * rr, ylen * rr);
      let r1 = h / ylen;
      let x0 = 0; // flush left
      if (align_right) x0 = w - xlen * r1;
      else if (align_center) x0 = (w - xlen * r1) / 2;
      else if (align_none) {
        r1 = rr;
        x1 = 0;
        y1 = 0;
      }
      // Draw facial keypoints.
      for (let j = 0; j < keypoints.length; j += 1) {
        let [x, y] = keypoints[j];
        let col = fget(x, y);
        // x = (x - x1) * r1 + x0;
        x = (x - x1) * r1 + x0;
        y = (y - y1) * r1;
        fill(col);
        // ellipse(x, y, c_len, c_len);
        // rect(x, y, c_len, c_len);
        this.shapef(ox0 + x, oy0 + y, c_len, c_len);
      }
    }
  }
}

let a_closeup = {
  'group/002.jpg': [
    { x: 252.8, y: 475.2, s: 0.8 },
    { x: 1004, y: 500, s: 0.8 },
    { x: 1684.8, y: 509.6, s: 0.8 },
    { x: 2676, y: 611.2, s: 0.8 },
    { x: 588, y: 1156.8, s: 0.8 },
    { x: 1598.4, y: 1111.2, s: 0.8 },
    { x: 2541.6, y: 1196.8, s: 0.8 },
    { x: 0, y: 0, s: 3.2 },
  ],
  'group/001.jpg': [
    { x: 394, y: 740.8, s: 0.4 },
    { x: 828, y: 726.8, s: 0.4 },
    { x: 1218.8, y: 732.4, s: 0.4 },
    { x: 1814, y: 664.4, s: 0.4 },
    { x: 2276, y: 567.6, s: 0.4 },
    { x: 2846.8, y: 649.2, s: 0.4 },
    { x: 3240.0, y: 652.4, s: 0.4 },
    { x: 0, y: 0, s: 3.2 },
  ],
};
