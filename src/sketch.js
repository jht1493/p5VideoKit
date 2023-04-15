// p5LiveVideo example dashboard
// https://github.com/jht1493/p5VideoKit
//
let videoKit;

p5.disableFriendlyErrors = true; // disables FES to improve performance

function setup() {
  // Report startup time for debugging
  let lapse = window.performance.now() - a_start_now;
  console.log('setup lapse', lapse);

  // Need some starting dimensions for canvas.
  // Will get adjusted by ui later in startup
  createCanvas(100, 100);

  // must call createCanvas before new p5VideoKit

  videoKit = new p5VideoKit(a_config);
}

function draw() {
  videoKit.draw();
}

let a_config = {
  // effects for import, will appear at top of the effect menu
  effects: [
    { label: 'a_example_props', import_path: 'effects/eff_a_example_props.js' },
    { label: 'a_my_example', import_path: 'effects/eff_a_my_example.js' },
    { label: 'a_slit_scan', import_path: 'effects/eff_a_slit_scan.js' },
    { label: 'live_gallery', import_path: 'effects/eff_live_gallery.js' },
    { label: 'maze_spin', import_path: 'effects/maze_spin/eff_maze_spin.js' },
    { label: 'movie_grid', import_path: 'effects/eff_movie_grid.js' },
    { label: 'ncell', import_path: 'effects/eff_ncell.js' },
    { label: 'shader_clamp', import_path: 'effects/eff_shader_clamp.js' },
    { label: 'shader_ripple', import_path: 'effects/eff_shader_ripple.js' },
    { label: 'skin_tone_main', import_path: 'effects/eff_skin_tone_main.js' },
  ],
  // settings for import, will appear in the settings menu
  settings: [
    { label: '2x2-maze-facemesh', import_path: 'settings/2x2-maze-facemesh.json' },
    { label: '2x2-maze-spin-random-0-1-2', import_path: 'settings/2x2-maze-spin-random-0-1-2.json' },
    { label: 'delaunay-alpha-5', import_path: 'settings/delaunay-alpha-5.json' },
    { label: 'live_gallery-video', import_path: 'settings/live_gallery-video.json' },
    { label: 'live_gallery-yoyo', import_path: 'settings/live_gallery-yoyo.json' },
    { label: 'live_gallery', import_path: 'settings/live_gallery.json' },
    { label: 'movie-grid', import_path: 'settings/movie-grid.json' },
    { label: 'screen-club', import_path: 'settings/screen-club.json' },
    { label: 'slit scan circle', import_path: 'settings/slit scan circle.json' },
    { label: 'videoKit', import_path: 'settings/videoKit.json' },
  ],
};

// https://editor.p5js.org/shawn/sketches/jZQ64AMJc
// p5LiveMedia Test Video
// https://github.com/vanevery/p5LiveMedia
