// Show live media in grid from room
//    VideoKit-Room-4
//

export default class eff_movie_grid {
  static meta_props = {
    ncell: [1, 2, 3, 4, 5, 6, 7],
    nmovie: [10, 50, 10, 50],
    _movie_url: {
      style: 'width:80%',
      // text_input: './external/media/webdb/jht/IMG_4491.JPEG',
      text_input: './external/media/p5VideoKit-gallery-yoyo/live_gallery',
    },
  };
  constructor(props) {
    // console.log('src/import/eff_live_gallery.js');
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    let videoKit = this.videoKit;
    let movieIndex = this.movieIndex;
    let urect = this.urects[movieIndex % this.urects.length].urect;
    let input = this.vid;
    let sx = 0;
    let sy = 0;
    let sw = input.width;
    let sh = input.height;
    let { x0, y0, width, height } = urect;
    let layer = this.output;
    let dw = height * (sw / sh);
    let x1 = Math.floor(x0 + (width - dw) / 2);
    layer.copy(input, sx, sy, sw, sh, x1, y0, dw, height);
  }

  init() {
    this.movieIndex = 0;
    this.init_grid();
    this.setup_movie();
  }
  setup_movie() {
    let ipath = this.movie_url;
    // -0010.webm
    ipath += '-' + (this.movieIndex + '').padStart(4, 0);
    ipath += '.webm';
    ipath += '?v=' + Math.random();
    console.log('eff_movie_grid ipath=' + ipath);
    // console.log('eff_mov_show vid', this.vid);
    if (this.vid) {
      this.vid.remove();
    }
    this.vid = createVideo(ipath, () => {
      // console.log('eff_mov_show loaded');
      // this.vid.loop();
      this.vid.volume(0);
      // this.vid.speed(this.speed);
      this.vid.play();
    });
    this.vid.onended(() => {
      // Chrome fails to play in reverse
      // this.ispeed = this.ispeed == 1 ? -1 : 1;
      // console.log('eff_movie_grid onended movieIndex', this.movieIndex);
      // this.vid.speed(this.speed);
      // this.vid.play();
      this.movieIndex = (this.movieIndex + 1) % this.nmovie;
      this.setup_movie();
    });
    this.vid.hide();
    // this.vid.size(width, height);
    // this.vid.position(0, 0);
  }
  init_grid() {
    let videoKit = this.videoKit;
    let urmain = this.eff_spec.urect;
    this.output = createGraphics(urmain.width, urmain.height);
    this.urects = [];
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
  }
}
