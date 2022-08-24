import { image_scaled_pad } from '../../util/image.js?v={{vers}}';
import { ui_message } from '../../core/create_ui.js?v={{vers}}';

export default class eff_show_pad {
  //
  static meta_props = {
    record_fps: [4, 6, 12, 24, 30, 60],
    record_duration: [5, 10, 20, 30, 60],
    record_start: {
      button: (ent, aPatch) => {
        ent.record_start(aPatch);
      },
    },
    record_stop: {
      button: (ent, aPatch) => {
        ent.record_stop(aPatch);
      },
    },
    record_save_name: {
      text_input: 'record_log',
    },
    record_show: [0, 1],
  };

  constructor(props) {
    Object.assign(this, props);
    this.init();
  }

  init() {
    this.record_init();
  }

  prepareOutput() {
    if (!this.eff_spec.ihide) {
      if (this.input) {
        let img = this.input.get();
        image_scaled_pad(img, this.eff_spec.urect);
      }
    } else {
      this.output = this.input;
    }
    if (this.recording) {
      let lapseSec = (Date.now() - this.start_time) / 100;
      lapseSec = Math.trunc(lapseSec) / 10;
      if (lapseSec != this.lapseSec) {
        ui_message('Recording ' + lapseSec + ' secs');
        this.lapseSec = lapseSec;
      }
    }
    if (this.end_time < Date.now()) {
      this.end_time = Number.MAX_SAFE_INTEGER;
      this.record_stop();
    }
  }

  record_start() {
    console.log('record_start');
    this.recorder.start();
    this.recording = 1;
    this.start_time = Date.now();
    this.end_time = Date.now() + this.record_duration * 1000;
    this.lapseSec = -1;
    // console.log('record_start Date.now()', Date.now());
    // console.log('record_start record_duration', this.record_duration);
    // console.log('record_start end_time', this.end_time);
  }

  record_stop() {
    console.log('record_stop recording', this.recording);
    if (this.recording) {
      console.log('record_stop recorder.stop');
      this.recorder.stop();
      ui_message('');
    }
    this.recording = 0;
  }

  record_init() {
    this.chunks = [];
    this.recording = 0;
    this.end_time = Number.MAX_SAFE_INTEGER;
    let stream = document.querySelector('canvas').captureStream(this.record_fps);
    this.recorder = new MediaRecorder(stream);
    this.recorder.ondataavailable = (e) => {
      if (e.data.size) {
        this.chunks.push(e.data);
      }
    };
    this.recorder.onstop = (evt) => {
      // console.log('recorder.onstop', evt);
      this.exportVideo();
    };
  }

  exportVideo() {
    let blob = new Blob(this.chunks, { type: 'video/webm' });
    if (this.record_show) {
      // Draw video to screen
      let videoElement = document.createElement('video');
      videoElement.setAttribute('id', Date.now());
      videoElement.controls = true;
      document.body.appendChild(videoElement);
      videoElement.src = window.URL.createObjectURL(blob);
    }
    // Download the video
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = this.record_save_name + '.webm';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// https://editor.p5js.org/jht1493/sketches/AnPN6baGO
// Canvas Record to Video -buts
