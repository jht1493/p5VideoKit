let my_canvas;
let videoKit;

p5.disableFriendlyErrors = true; // disables FES

function setup() {
  let lapse = window.performance.now() - a_start_now;
  console.log('setup lapse', lapse);

  // pixelDensity(1); // does not appear to affect live media
  my_canvas = createCanvas(100, 100);

  let effects = [
    { label: 'example', import_path: 'import/eff_example' },
    { label: 'ncell', import_path: 'import/eff_ncell' },
  ];

  videoKit = new p5VideoKit({ effects });

  videoKit.init().then(() => {
    console.log('videoKit.init done');
  });

  // moduleTest();
}

function draw() {
  videoKit.draw();
}

// https://editor.p5js.org/shawn/sketches/jZQ64AMJc
// p5LiveMedia Test Video
// https://github.com/vanevery/p5LiveMedia
