export class FFT_analyser {
  constructor(props) {
    // { media }
    Object.assign(this, props);
    // console.log('fft_anal this', this);
    this.init_analyser();
  }

  init_analyser() {
    console.log('FFT_analyser media', this.media);
    let a_audioCtx = getAudioContext();
    a_audioCtx.resume();
    if (!this.media.mediaDevice) return;
    let stream = this.media.mediaDevice.stream;
    this.analyser = a_audioCtx.createAnalyser();
    try {
      let source = a_audioCtx.createMediaStreamSource(stream);
      source.connect(this.analyser);
    } catch (err) {
      console.log('createMediaStreamSource err', err);
    }
    this.spectrum_arr = new Uint8Array(this.analyser.frequencyBinCount);
    // console.log('fft_anal this.spectrum_arr.length', this.spectrum_arr.length);
  }

  spectrum() {
    if (!this.analyser) return [];
    this.analyser.getByteFrequencyData(this.spectrum_arr);
    return this.spectrum_arr;
  }
}
