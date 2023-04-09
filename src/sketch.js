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

  // Need some starting dimensions for canvas.
  // Will get adjusted by ui later in startup
  createCanvas(100, 100);
  // createCanvas(100, 100, WEBGL);

  // must call createCanvas before new p5VideoKit

  // effects for import, will appear at top of patch effect menu
  let effects = [
    { label: 'props_example', import_path: 'effects/eff_props_example.js' },
    { label: 'ncell', import_path: 'effects/eff_ncell.js' },
    { label: 'skin_tone_main', import_path: 'effects/eff_skin_tone_main.js' },
    { label: 'live_gallery', import_path: 'effects/eff_live_gallery.js' },
    { label: 'shader_clamp', import_path: 'effects/eff_shader_clamp.js' },
    { label: 'shader_ripple', import_path: 'effects/eff_shader_ripple.js' },
    { label: 'movie_grid', import_path: 'effects/eff_movie_grid.js' },
  ];

  // settings for import, will appear at top of settings menu
  let settings = [
    { label: 'delaunay-alpha-5', import_path: 'settings/delaunay-alpha-5.json' },
    { label: 'live_gallery-video', import_path: 'settings/live_gallery-videojson' },
    { label: 'live_gallery-yoyo', import_path: 'settings/live_gallery-yoyo.json' },
    { label: 'movie-grid.json', import_path: 'settings/movie-grid.json' },
    { label: 'screen-club', import_path: 'settings/screen-club.json' },
    { label: 'videoKit', import_path: 'settings/videoKit.json' },
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
