// p5LiveVideo example dashboard
// https://github.com/jht1493/p5VideoKit
//
let videoKit; // home for library routines

p5.disableFriendlyErrors = true; // disables p5js FES (friendly error system) 
// to improve performance

function setup() {
  // Report startup time for debugging
  let lapse = window.performance.now() - a_start_now;
  console.log('setup lapse', lapse); 
  // indicate how long it took to load everything

  // pixelDensity does not appear to affect live media
  // pixelDensity(1);

  // Need some starting dimensions for canvas.
  // Size will get adjusted by ui later in startup
  createCanvas(100, 100);
  // createCanvas(100, 100, WEBGL);

  // must call createCanvas before new p5VideoKit

  // effects for import, will appear at top of the effect menu
  // examples of effects that have been added to the VideoKit library,
  // you could add some more !!!!
  // an EFFECT can have many PROPERTIES specific to the effect eg cell size, color, canvas size
  // for example you can have the same circle choice in Effect1 and Effect2, but different
  // properties like number of circles per frame and the video source 

  let effects = [
    { label: 'a_my_example', import_path: 'effects/eff_a_my_example.js', ui_label: 'a_my_example' },
    { label: 'a_example_props', import_path: 'effects/eff_a_example_props.js', ui_label: 'a_example_props' },
    { label: 'a_slit_scan', import_path: 'effects/eff_a_slit_scan.js', ui_label: 'a_slit_scan' },
    { label: 'ncell', import_path: 'effects/eff_ncell.js', ui_label: 'ncell' },
    { label: 'shader_clamp', import_path: 'effects/eff_shader_clamp.js', ui_label: 'shader_clamp' },
    { label: 'shader_ripple', import_path: 'effects/eff_shader_ripple.js', ui_label: 'shader_ripple' },
    { label: 'skin_tone_main', import_path: 'effects/eff_skin_tone_main.js', ui_label: 'skin_tone_main' },
    { label: 'live_gallery', import_path: 'effects/eff_live_gallery.js', ui_label: 'live_gallery' },
    { label: 'movie_grid', import_path: 'effects/eff_movie_grid.js', ui_label: 'movie_grid' },
    { label: 'bbtest', import_path: 'effects/eff_bbtest.js', ui_label: 'bbtest' },
  ];

  // settings for import, will appear at top of settings menu
  // loads a json file with predefined values for all the settings associated with the effect
  let settings = [
    // slit scan circle.json
    { label: 'slit scan circle', import_path: 'settings/slit scan circle.json' },
    { label: 'delaunay-alpha-5', import_path: 'settings/delaunay-alpha-5.json' },
    { label: 'live_gallery-video', import_path: 'settings/live_gallery-video.json' },
    { label: 'live_gallery-yoyo', import_path: 'settings/live_gallery-yoyo.json' },
    { label: 'live_gallery', import_path: 'settings/live_gallery.json' },
    { label: 'movie-grid', import_path: 'settings/movie-grid.json' },
    { label: 'screen-club', import_path: 'settings/screen-club.json' },
    { label: 'videoKit', import_path: 'settings/videoKit.json' },
    { label: 'bbtest', import_path: 'settings/bbtest.json' },
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
