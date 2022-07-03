let my_canvas;
let videoKit;

p5.disableFriendlyErrors = true; // disables FES

function setup() {
  let lapse = window.performance.now() - a_start_now;
  console.log('setup lapse', lapse);

  // pixelDensity(1); // does not appear to affect live media
  my_canvas = createCanvas(100, 100);

  videoKit = new p5VideoKit();

  // moduleTest();
}

function draw() {
  videoKit.draw();
}

// https://editor.p5js.org/jht1493/sketches/9AlTdNafC
// p5LiveMedia video dice twins mir

// https://editor.p5js.org/jht1493/sketches/NPAHU279L
// p5LiveMedia video dice twins

// https://editor.p5js.org/jht1493/sketches/0Oj2yPY7P
// p5LiveMedia video dice 1

// https://editor.p5js.org/shawn/sketches/jZQ64AMJc
// p5LiveMedia Test Video
// https://github.com/vanevery/p5LiveMedia
