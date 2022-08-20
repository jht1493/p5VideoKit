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
    { label: 'example', import_path: 'import/eff_example.js' },
    { label: 'ncell', import_path: 'import/eff_ncell.js' },
    { label: 'skin_tone_main', import_path: 'import/eff_skin_tone_main.js' },
    { label: 'live_gallery', import_path: 'import/eff_live_gallery.js' },
  ];

  // settings for import, will appear at top of settings menu
  let settings = [
    //
    { label: 'grid1', import_path: 'settings/demo/grid1.json' },
    { label: 'effects4', import_path: 'settings/demo/effects4.json' },
    { label: 'circles4', import_path: 'settings/demo/circles4.json' },
    { label: 'slant4', import_path: 'settings/demo/slant4.json' },
    { label: 'skin_tone_main-qr', import_path: 'settings/2022-skin-tone/skin-tone-main-qr.json' },
    { label: 'live_gallery', import_path: 'import/live_gallery.json' },
    { label: 'live_gallery-video', import_path: 'import/live_gallery-video.json' },
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
