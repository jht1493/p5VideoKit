let my_canvas;
let videoKit;

p5.disableFriendlyErrors = true; // disables FES to improve performance

function setup() {
  let lapse = window.performance.now() - a_start_now;
  console.log('setup lapse', lapse);

  // pixelDensity(1); // does not appear to affect live media
  // !!@ retore my_canvas
  my_canvas = createCanvas(100, 100);

  let effects = [
    { label: 'example', import_path: 'import/eff_example' },
    { label: 'ncell', import_path: 'import/eff_ncell' },
  ];
  let settings = [
    { label: '2x2.json', import_path: 'settings/demo/-2x2.json' },
    { label: 'ncell-circles', import_path: 'settings/demo/-ncell-circles.json' },
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
