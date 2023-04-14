// converting video slit scan to a effect pluging example
//
// effects have to be declared as a class
// convention is that properties in UI 
// appear in meta_props array as drop-downs
// goal: you don't have to write the code
// you just have to select the drop-downs
// save a json with your selections

export default class eff_bbtest {
  static meta_props = [
    // { prop: 'num_prop', label: 'prop1', selection: [0, 1] },
    { prop: 'expand', selection: [1, 2, 3] },
    { prop: 'step', selection: [1, 0.1, 0.2, 2, 4] },
    { prop: 'period', selection: [-1, 0, 1, 2, 3] },
  ];

  constructor(props) {
    //
    Object.assign(this, props);
    console.log('eff_bbtest props.expand', props.expand);
    // console.log('eff_bbtest constructor width, height', width, height);

    this.vw = this.input.width;
    this.vh = this.input.height;
    console.log('eff_bbtest constructor input vw vh', this.vw, this.vh);

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
    this.output.fill(240,0,0);
    this.output.circle(width/2, height/2, 100);
  }
}

// https://editor.p5js.org/jht9629-nyu/sketches/hw8qkUuAw
// https://editor.p5js.org/codingtrain/sketches/B1L5j8uk4
// Slit Scan 
// this is original code that would work in p5js editor
// and is adapted to the VideoKit plug-in model
// the sketches in the effects directory plug-in
// to the video kit
// certain requirements in order to plug-in:
// 1. meta_pro array
// 2. constructor for the class
// analogous to setup only called once
// 3. prepareOutput() analogous to draw
// repeatedly called for every frame


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
