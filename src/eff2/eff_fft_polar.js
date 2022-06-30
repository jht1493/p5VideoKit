class eff_fft_polar {
  static meta_props = {
    max: [5, 6, 7, 2, 4, 8, 9, 10],
    delta: [1, 5, 10, 15],
    period: [30, 5, 10, 20, 30, 60],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    this.period_timer.check(() => {
      this.period_next();
    });
    this.draw_fft();
    image_scaled_pad(this.layer, this.isrc.pad);
  }
  init() {
    this.layer = createGraphics(this.isrc.pad.width, this.isrc.pad.height);
    let layer = this.layer;
    layer.noStroke();
    this.alpha_line = 10;
    this.alpha_hist = 20;
    this.start = 0; // Window onto fft data
    this.end = this.max * 100;
    this.base = 0;
    this.vols = [];
    this.fft_maxs = [];
    this.vol_len = 1;
    this.n_vol = int(layer.width / this.vol_len);
    this.th_offset = 0;
    this.th_delta = (TWO_PI / 360) * this.delta;
    this.x0 = layer.width / 2;
    this.y0 = layer.height / 2;
    this.init_analyser();
    this.period_timer = new period_timer(this.period);
  }
  init_analyser() {
    let a_audioCtx = getAudioContext();
    a_audioCtx.resume();
    let stream = this.media.device.stream;
    this.analyser = a_audioCtx.createAnalyser();
    let source = a_audioCtx.createMediaStreamSource(stream);
    source.connect(this.analyser);
  }
  draw_fft() {
    if (!this.analyser) return;
    let spectrum = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(spectrum);
    let layer = this.layer;
    let i_start = Math.round((spectrum.length * this.start) / 1000);
    let i_end = Math.round((spectrum.length * this.end) / 1000);
    // let b_len = layer.width / (i_end - i_start);
    let imax = 0;
    for (let i = i_end; i > i_start; i--) {
      let ff = spectrum[i];
      if (ff > 0) {
        imax = i;
        break;
      }
    }
    let fmax = 0;
    let x0 = this.x0;
    let y0 = this.y0;
    for (let i = i_start; i < i_end; i++) {
      let ff = spectrum[i];
      // let th = map(i, i_start, i_end, 0, TWO_PI);
      let th = map(i, i_start, imax, 0, TWO_PI);
      let rr = map(ff, this.base, 255, 0, 1);
      // layer.fill(ff, 0, 0, this.alpha2);
      // layer.rect(x, layer.height - h, b_len, h);
      rr = rr * y0;
      th = th + this.th_offset;
      let x1 = rr * cos(th);
      let y1 = rr * sin(th);
      layer.stroke(ff, 0, 0, this.alpha_line);
      layer.line(x0, y0, x0 + x1, y0 + y1);
    }
    this.fft_maxs.push(fmax);
    if (this.fft_maxs.length > this.n_vol) {
      this.fft_maxs.splice(0, 1);
    }
    this.th_offset += this.th_delta;
    // draw_fft_max(this);
  }
  draw_fft_max() {
    let layer = this.layer;
    let x = layer.width - this.fft_maxs.length * this.vol_len;
    if (x < 0) x = 0;
    let y2 = layer.height;
    let len = 5;
    for (let v of this.fft_maxs) {
      let h = v;
      let c = map(h, 0, y2, 150, 255);
      layer.fill(c, c, 0, this.alpha_hist);
      layer.rect(x, y2 - h, len, h);
      x += this.vol_len;
    }
  }
  period_next() {
    let layer = this.layer;
    this.x0 = random(layer.width / 4, layer.width - layer.width / 4);
    this.y0 = random(layer.height / 4, layer.height - layer.height / 4);
  }
}

// Derived from
// https://editor.p5js.org/shawn/sketches/jE67n-n2x
// Day 1: Active speaker display - 50 Days of Video Chat by shwan
