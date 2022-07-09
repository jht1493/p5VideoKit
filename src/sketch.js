// p5LiveVideo example dashboard
// https://github.com/jht1493/p5VideoKit
//
let videoKit;

p5.disableFriendlyErrors = true; // disables FES to improve performance

function setup() {
  // Report startup time for debugging
  let lapse = window.performance.now() - a_start_now;
  console.log('setup lapse', lapse);

  // pixelDensity does not appear to affect live media
  // pixelDensity(1);

  createCanvas(100, 100);

  // p5VideoKit create must follow createCanvas

  // effects for import, will appear at top of patch effect menu
  let effects = [
    { label: 'example', import_path: 'import/eff_example' },
    { label: 'ncell', import_path: 'import/eff_ncell' },
  ];

  // settings for import, will appear at top of settings menu
  let settings = [
    { label: 'live4', import_path: 'settings/demo/live4.json' },
    { label: 'slant-4', import_path: 'settings/demo/slant-4.json' },
    { label: '2x2.json', import_path: 'settings/demo/2x2.json' },
    { label: 'ncell-circles', import_path: 'settings/demo/ncell-circles.json' },
  ];

  videoKit = new p5VideoKit();

  videoKit.init({ effects, settings }).then(() => {
    console.log('videoKit.init done');
  });
}

function draw() {
  videoKit.draw();
}

// https://editor.p5js.org/shawn/sketches/jZQ64AMJc
// p5LiveMedia Test Video
// https://github.com/vanevery/p5LiveMedia
