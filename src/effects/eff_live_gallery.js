// live_gallery Show recorded media in grid from folder
//    p5VideoKit-gallery-yoyo
//

export default class eff_live_gallery {
  static meta_props = {
    ncell: [3, 1, 2, 3, 4, 5, 6, 7],
    ifirst: [1, 2],
    nPerHour: [0, 1, 2, 5, 10, 15, 20, 30, 60],
    nPerMinute: [0, 1, 2, 5, 10, 15, 20, 30, 60],
    nPerSecond: [0, 1, 2, 5, 10, 15, 20, 30, 60],
    period: [5, -1, 5, 10, 15, 20, 30, 60, 120],
    _movie_record: [0, 1],
    fps: [4, 6, 12, 15, 24, 30, 60],
    duration: [5, 10, 20, 30, 60],
    save_image: [0, 1],
    save_seen_limit: [8, 4, 10, 100, 360, 1000],
    save_period_limit: [25920, 12960, 360, 15, 60, 120],
    save_name: {
      text_input: 'live_gallery',
    },
    _first_period_record: [1, 0],
    record_canvas: [0, 1],
    tile_inputs: [0, 1],
    live_center: [0, 0],
    live_top_left: [1, 0],
    show_count: [1, 0],
    _movie_play: [0, 1],
    movie_url: {
      style: 'width:40%',
      text_input: './external/media/p5VideoKit-gallery-yoyo/live_gallery',
    },
  };
  constructor(props) {
    // console.log('src/import/eff_live_gallery.js');
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    this.frameCount++;
    this.render_inputs();
    this.check_movie_record();
    this.check_movie_play();
  }
  deinit() {
    console.log('eff_live_gallery deinit mediaElements.length', this.mediaElements.length);
    this.output.remove();
    for (let ent of this.mediaElements) {
      if (ent && ent.mediaElement) {
        console.log('stage_next_movie remove ent.saved_index', ent.saved_index);
        ent.mediaElement.remove();
      } else {
        console.log('eff_live_gallery deinit ent', ent);
      }
    }
  }
  check_movie_record() {
    if (this.recordingStarted) {
      return;
    }
    if (this.period_timer.check() || this.firstPeriod) {
      // Save entire canvas or video input
      // console.log('eff_live_gallery period_timer', this.save_index);
      if (this.movie_record) {
        this.recordingStarted = 1;
        let doneFunc = () => {
          // console.log('eff_live_gallery doneFunc');
          this.recordingStarted = 0;
          this.stage_next_movie(this.saved_index);
        };
        this.saved_index = this.save_index;
        let save_name = this.save_name + '-' + (this.save_index + '').padStart(4, 0);
        this.save_index = (this.save_index + 1) % this.save_period_limit;
        let fps = this.fps;
        let duration = this.duration;
        let sourceElt = this.input.elt;
        if (this.show_count) {
          sourceElt = this.graphics.elt;
        }
        if (this.record_canvas) sourceElt = null;
        this.videoKit.recordVideo({ save_name, fps, duration, doneFunc, sourceElt });
        console.log('eff_live_gallery save_name', save_name);
      }
      if (this.save_image) {
        saveCanvas(this.output, this.save_name, 'jpg');
      }
      this.firstPeriod = 0;
    }
  }

  stage_next_movie(saved_index) {
    // console.log('stage_next_movie n', this.mediaElements.length);
    let n = this.mediaElements.length;
    // select the previous index to give recording one cycle to be saved to file system
    saved_index = (saved_index - 1 + this.save_period_limit) % this.save_period_limit;
    // mindex = saved_index % n;
    let ent;
    if (this.live_center) {
      // Take from begining and Put at end
      let ents = this.mediaElements.splice(0, 1);
      ent = ents[0];
      if (ent) {
        this.mediaElements.push(ent);
      }
    } else {
      // Take from end and put a begining
      let ents = this.mediaElements.splice(n - 1, 1);
      ent = ents[0];
      if (ent) {
        this.mediaElements.splice(0, 0, ent);
      }
    }
    if (!ent) return;
    if (ent.mediaElement) {
      console.log('stage_next_movie remove ent.saved_index', ent.saved_index);
      ent.mediaElement.remove();
    }
    console.log('stage_next_movie ent.saved_index', ent.saved_index, 'saved_index', saved_index);
    ent.mediaElement = this.create_mediaElement(saved_index);
    ent.saved_index = saved_index;
  }

  render_inputs() {
    if (this.tile_inputs) {
      let nshow = this.urects.length;
      let layer = this.output;
      let n = videoKit.mediaDivCount();
      let sindex = 0;
      for (let imedia = this.ifirst; imedia < n; imedia++) {
        let urect = this.urects[sindex].urect;
        this.videoKit.layerCopyInput(layer, { imedia, urect });
        sindex = (sindex + 1) % nshow;
      }
    } else if (this.show_count) {
      let str = '' + this.frameCount;
      let { width, height } = this.input;
      // let x = width - this.textDropWidth / 2;
      // let y = height - this.textHi;
      let dropWidth = this.graphics.textWidth(str) * 1.2;
      let x = width - dropWidth * 0.9;
      let y = height - this.textHi;
      this.graphics.image(this.input, 0, 0);
      this.graphics.rect(x, y, dropWidth, this.textHi);
      // this.graphics.text(str, x, y + this.textHi - 10);
      this.graphics.text(str, x, y + this.textHi - 10);
      // this.layerCopyInput(this.output, { input: this.graphics, urect });
      let input = this.graphics;
      let urect = this.live_urect.urect;
      this.videoKit.layerCopyInput(this.output, { input, urect });
    } else {
      let urect = this.live_urect.urect;
      let imedia = this.ifirst;
      this.videoKit.layerCopyInput(this.output, { imedia, urect });
    }
  }

  init_graphics() {
    this.graphics = createGraphics(this.input.width, this.input.height);
    this.graphics.noStroke();
    this.textHi = this.input.height / 12;
    this.graphics.textSize(this.textHi);
    this.textDropWidth = this.input.width / 4;
    console.log('textDropWidth', this.textDropWidth, 'textLeading', this.graphics.textLeading());
  }

  check_movie_play() {
    if (!this.movie_play) return;
    for (let index = 0; index < this.urects.length; index++) {
      let urect = this.urects[index].urect;
      let mindex = index % this.save_seen_limit;
      let ent = this.mediaElements[mindex];
      if (!ent) {
        ent = {};
        this.mediaElements[index] = ent;
      }
      if (!ent.mediaElement) {
        ent.mediaElement = this.create_mediaElement(mindex);
        ent.saved_index = mindex;
      }
      // if (index == this.urects.length - 1) {
      //   console.log('check_movie_play index', index, 'mindex', mindex, 'ent.mindex', ent.mindex);
      // }
      this.display_mediaElement(ent.mediaElement, urect);
    }
  }

  display_mediaElement(mediaElement, urect) {
    let sx = 0;
    let sy = 0;
    let sw = mediaElement.width;
    let sh = mediaElement.height;
    let { x0, y0, width, height } = urect;
    let dw = height * (sw / sh);
    let x1 = Math.floor(x0 + (width - dw) / 2);
    this.output.copy(mediaElement, sx, sy, sw, sh, x1, y0, dw, height);
  }

  create_mediaElement(movieIndex) {
    let ipath = this.movie_url;
    // -0010.webm
    ipath += '-' + (movieIndex + '').padStart(4, 0);
    ipath += '.webm';
    ipath += '?v=' + Math.random();
    // console.log('create_mediaElement ipath=' + ipath);
    // console.log('eff_mov_show vid', this.vid);
    // if (mediaElement) {
    //   mediaElement.remove();
    // }
    let mediaElement = createVideo(ipath, () => {
      // console.log('eff_mov_show loaded');
      mediaElement.loop();
      mediaElement.volume(0);
      // mediaElement.speed(this.speed);
      mediaElement.play();
    });
    mediaElement.onended(() => {
      console.log('mediaElement onended movieIndex', movieIndex);
      // this.stage_next_movie();
    });
    mediaElement.hide();
    // mediaElement.size(width, height);
    // mediaElement.position(0, 0);
    return mediaElement;
  }

  init() {
    this.frameCount = 0;
    this.init_graphics();
    this.firstPeriod = this.first_period_record;
    this.save_index = 0;
    this.recordingStarted = 0;
    let videoKit = this.videoKit;
    let urmain = this.eff_spec.urect;
    this.output = createGraphics(urmain.width, urmain.height);
    let period = this.period;
    if (this.nPerHour) {
      period = 60 * 60 * (1 / this.nPerHour);
    }
    if (this.nPerMinute) {
      period = 60 * (1 / this.nPerMinute);
    }
    if (this.nPerSecond) {
      period = 1 / this.nPerSecond;
    }
    this.period_timer = new videoKit.PeriodTimer(period);
    this.iperiod = 0;
    this.urects = [];
    this.mediaElements = [];
    let x0 = urmain.x0;
    let y0 = urmain.y0;
    let wedge = x0 + urmain.width;
    let hedge = y0 + urmain.height;
    let xstep = wedge / this.ncell;
    let ystep = hedge / this.ncell;
    let n = this.ncell * this.ncell;
    for (let index = 0; index < n; index++) {
      let urect = { x0, y0, width: xstep, height: ystep };
      this.urects.push({ urect });
      x0 += xstep;
      if (x0 + xstep > wedge) {
        x0 = urmain.x0;
        y0 += ystep;
        if (y0 + ystep > hedge) {
          y0 = urmain.y0;
        }
      }
    }
    if (this.live_center) {
      let index = Math.trunc(n / 2);
      this.live_urect = this.urects[index];
      this.urects.splice(index, 1);
    } else if (this.live_top_left) {
      let index = 0;
      this.live_urect = this.urects[index];
      this.urects.splice(index, 1);
    }
  }
}

/*
// !!@ Source graphics must be arg to saveCanvas

      this.output.saveCanvas(this.save_name, 'jpg');

Uncaught TypeError: Cannot read properties of undefined (reading 'toBlob')
    at k.default.saveCanvas (p5.min.js:3:552605)
    at eff_live_gallery.prepareOutput (eff_live_gallery.js?v={{vers}}:34:19)
    at p5VideoKit.draw_patch (apex.js?v={{vers}}:218:8)
    at p5VideoKit.draw (apex.js?v={{vers}}:47:18)
    at draw (sketch.js?v={{vers}}:47:12)
    at o.default.redraw (p5.min.js:3:487659)
    at _draw (p5.min.js:3:424542)
*/
