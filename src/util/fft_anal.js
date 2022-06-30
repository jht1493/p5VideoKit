class fft_anal {
  constructor(props) {
    // { media }
    Object.assign(this, props);
    // console.log('fft_anal this', this);
    this.init_analyser();
  }

  init_analyser() {
    let a_audioCtx = getAudioContext();
    a_audioCtx.resume();

    let stream = this.media.device.stream;
    this.analyser = a_audioCtx.createAnalyser();
    let source = a_audioCtx.createMediaStreamSource(stream);
    source.connect(this.analyser);
    this.spectrum_arr = new Uint8Array(this.analyser.frequencyBinCount);
    // console.log('fft_anal this.spectrum_arr.length', this.spectrum_arr.length);
  }

  spectrum() {
    if (!this.analyser) return [];
    this.analyser.getByteFrequencyData(this.spectrum_arr);
    return this.spectrum_arr;
  }
}
