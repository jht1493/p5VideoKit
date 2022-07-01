class eff_fft_graph {
  static meta_props = { max: [5, 6, 7, 2, 4, 8, 9, 10] };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    this.layer.clear();
    this.draw_fft();
    image_scaled_pad(this.layer, this.isrc.pad);
  }
  init() {
    this.layer = createGraphics(width, height);
    this.layer.noStroke();
    this.alpha = 20;
    this.alpha2 = 200;
    this.start = 0; // Window onto fft data
    this.end = this.max * 100;
    this.base = 0;
    this.vols = [];
    this.fft_maxs = [];
    this.vol_len = 1;
    this.n_vol = int(this.layer.width / this.vol_len);
    let a_audioCtx = getAudioContext();
    a_audioCtx.resume();
    this.analyser = a_audioCtx.createAnalyser();
    let stream = this.media.device.stream;
    let source = a_audioCtx.createMediaStreamSource(stream);
    source.connect(this.analyser);
  }
  draw_fft() {
    let layer = this.layer;
    let spectrum = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(spectrum);
    let i_start = Math.round((spectrum.length * this.start) / 1000);
    let i_end = Math.round((spectrum.length * this.end) / 1000);
    let b_len = width / (i_end - i_start);
    let fmax = 0;
    for (let i = i_start; i < i_end; i++) {
      let ff = spectrum[i];
      layer.fill(ff, 0, 0, this.alpha2);
      let x = map(i, i_start, i_end, 0, width);
      let h = map(ff, this.base, 255, 0, height);
      layer.rect(x, height - h, b_len, h);
      if (h > fmax) fmax = h;
    }
    this.fft_maxs.push(fmax);
    if (this.fft_maxs.length > this.n_vol) {
      this.fft_maxs.splice(0, 1);
    }
    this.draw_fft_max();
  }
  draw_fft_max() {
    let layer = this.layer;
    let x = width - this.fft_maxs.length * this.vol_len;
    if (x < 0) x = 0;
    let y2 = height;
    let len = 5;
    for (let v of this.fft_maxs) {
      let h = v;
      let c = map(h, 0, y2, 150, 255);
      layer.fill(c, c, 0, this.alpha);
      layer.rect(x, y2 - h, len, h);
      x += this.vol_len;
    }
  }
}

// Derived from
// https://editor.p5js.org/shawn/sketches/jE67n-n2x
// Day 1: Active speaker display - 50 Days of Video Chat by shwan
