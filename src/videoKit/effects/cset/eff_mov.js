import { image_scaled_pad } from '../../util/image.js?v={{vers}}';
import { PeriodTimer } from '../../util/PeriodTimer.js?v={{vers}}';
import { ui_patch_update } from '../../core-ui/ui_patch.js?v={{vers}}';
import { a_images } from '../../let/a_images.js?v={{vers}}';

export default class eff_mov_show {
  static meta_props = {
    group: ['covid19mov', '370-mov'],
    ifile: [0, 1, 2],
    speed: [1, 0.5, 0.2, 0.1],
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
    _loop: [0, 1],
    period: [5, 10, 20, 30, 60],
  };
  constructor(props) {
    Object.assign(this, props);
    this.file_name = 'covid19mov/Document_Ticker-short-h.mov';
    this.init();
  }
  prepareOutput() {
    if (this.loop) {
      this.period_timer.check(() => {
        this.period_next();
      });
    }
    // console.log('eff_mov_show', this.vid.duration(), this.vid.time());
    // image(this.vid, 0, 0, width, height);
    image_scaled_pad(this.vid, this.eff_spec.urect);
  }
  init() {
    this.predictions = [];
    this.period_timer = new PeriodTimer(this.period);
    this.load_from_group();
  }
  load_from_group() {
    this.files = a_images[this.group];
    if (this.shuffle) {
      this.files = shuffle(this.files);
    }
    let file_name = this.file_name;
    if (this.ifile !== undefined) {
      console.log('eff_mov_show this.ifile=' + this.ifile);
      if (this.ifile >= this.files.length) {
        this.ifile = this.files.length - 1;
      }
      file_name = this.group + '/' + this.files[this.ifile];
    }
    let ipath = './external/media/webdb/' + file_name;
    console.log('eff_mov_show ipath=' + ipath);
    // console.log('eff_mov_show vid', this.vid);
    this.vid = createVideo(ipath, () => {
      console.log('eff_mov_show loaded');
      this.vid.loop();
      this.vid.volume(0);
      this.vid.speed(this.speed);
      this.vid.play();
    });
    this.vid.onended(() => {
      // Chrome fails to play in reverse
      // this.ispeed = this.ispeed == 1 ? -1 : 1;
      console.log('eff_mov_show onended', this.ispeed);
      this.vid.speed(this.speed);
      this.vid.play();
    });
    this.vid.hide();
    // this.vid.size(width, height);
    // this.vid.position(0, 0);
  }
  deinit() {
    console.log('eff_mov_show deinit vid', this.vid);
    if (this.vid) {
      this.vid.remove();
    }
  }
  next_action(aPatch) {
    if (!aPatch.eff_props.ifile) aPatch.eff_props.ifile = 0;
    aPatch.eff_props.ifile = (aPatch.eff_props.ifile + 1) % this.files.length;
    // if (aPatch.eff_props.ifile < 0 || aPatch.eff_props.ifile >= this.files.length - 1) aPatch.eff_props.ifile = 0;
    ui_patch_update(aPatch);
  }
  previous_action(aPatch) {
    if (!aPatch.eff_props.ifile) aPatch.eff_props.ifile = 0;
    aPatch.eff_props.ifile--;
    if (aPatch.eff_props.ifile < 0) aPatch.eff_props.ifile = this.files.length - 1;
    ui_patch_update(aPatch);
  }
}
