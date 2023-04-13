// converting video slit scan to a effect pluging example
//
export default class eff_a_slit_scan {
  static meta_props = [
    // { prop: 'num_prop', label: 'prop1', selection: [0, 1] },
    { prop: 'expand', selection: [1, 2, 3] },
    { prop: 'step', selection: [1, 0.1, 0.2, 2, 4] },
    { prop: 'period', selection: [-1, 0, 1, 2, 3] },
  ];

  constructor(props) {
    //
    Object.assign(this, props);
    console.log('eff_a_slit_scan props.expand', props.expand);
    // console.log('eff_a_slit_scan constructor width, height', width, height);

    this.vw = this.input.width;
    this.vh = this.input.height;
    console.log('eff_a_slit_scan constructor input vw vh', this.vw, this.vh);

    this.output = createGraphics(this.vw * this.expand, this.vh);
    // this.output.background(255);

    this.x = 0;

    this.period_timer = new this.videoKit.PeriodTimer(this.period);
  }
  prepareOutput() {
    // this.input.loadPixels();
    this.output.copy(this.input, this.vw / 2, 0, 1, this.vh, this.x, 0, 1, this.vh);
    this.x = this.x + this.step;
    if (this.x > this.output.width) {
      this.x = 0;
    }
    if (this.period_timer.check()) {
      this.output.clear();
    }
  }
}

// https://editor.p5js.org/jht9629-nyu/sketches/hw8qkUuAw
// https://editor.p5js.org/codingtrain/sketches/B1L5j8uk4
// Slit Scan

// let video;
// let x = 0;

// function setup() {
//   createCanvas(400, 240);
//   pixelDensity(1);
//   video = createCapture(VIDEO);
//   video.size(320, 240);
//   background(51);
// }

// function draw() {
//   // ?? is this needed
//   // video.loadPixels();
//   let w = video.width;
//   let h = video.height;
//   copy(video, w/2, 0, 1, h, x, 0, 1, h);
//   x = x + 1;
//   if (x > width) {
//     x = 0;
//   }
// }
