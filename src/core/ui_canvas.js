function ui_canvas(div) {
  // console.log('ui_canvas');
  canvas_size();

  canvas_lock();

  function canvas_size() {
    div.child(createSpan('[Canvas Size: '));
    let aSel = createSelect();
    div.child(aSel);
    for (let se of a_canvas_sizes) {
      aSel.option(se.label);
    }
    aSel.selected(a_ui.canvas_size);
    aSel.changed(function () {
      let label = this.value();
      let se = a_canvas_sizes_dict[label];
      if (se.func) {
        se.func();
      } else if (se.width) {
        a_ui_set('canvas_size', se.label);
        resizeCanvas(se.width, se.height);
      } else {
        console.log('No canvas size in se', se);
      }
      ui_window_refresh();
    });
  }

  function canvas_lock() {
    let chk = createCheckbox('Lock]', a_canvas_size_lock);
    div.child(chk);
    chk.style('display:inline');
    chk.changed(function () {
      let state = this.checked();
      a_canvas_size_lock = state ? 1 : 0;
      store_set('a_canvas_size_lock', a_canvas_size_lock + '');
    });
  }
}

let a_canvas_sizes_dict;

function ui_canvas_init() {
  a_canvas_sizes_dict = init_size_in(a_canvas_sizes);
}

let a_canvas_sizes = [
  {
    width: 320,
    height: 240,
  },
  {
    width: 480,
    height: 270,
  },
  {
    width: 640,
    height: 480,
  },
  {
    width: 960,
    height: 540,
  },
  {
    width: 1280,
    height: 480,
  },
  {
    width: 1280,
    height: 960,
  },
  {
    width: 1920,
    height: 1080,
  },
  {
    width: 1920,
    height: 1440,
  },
  {
    width: 1080,
    height: 1920,
  },
  {
    width: 960,
    height: 720,
  },
  {
    width: 1600,
    height: 1200,
  },
  {
    label: 'Window',
    func: function () {
      resizeCanvas(windowWidth, windowHeight);
    },
  },
  {
    label: 'Full Screen',
    func: function () {
      toggleFullScreen();
      resizeCanvas(windowWidth, windowHeight);
    },
  },
];

function canvas_size_default() {
  let sz = a_canvas_sizes_dict[a_ui.canvas_size];
  // console.log('canvas_sizei index', a_ui.canvas_sizei, 'size', sz);
  if (sz) return sz;
  return a_canvas_sizes[0];
}

function init_size_in(sizes) {
  let dict = {};
  for (let se of sizes) {
    if (!se.label) {
      se.label = se.width + 'x' + se.height;
    }
    dict[se.label] = se;
  }
  return dict;
}

// 1920x1080 --> { width: 1920, height: 1080 }
function str_to_width_height(str) {
  let pl = str.split('x');
  let width = parseFloat(pl[0]);
  let height = parseFloat(pl[1]);
  return { width, height };
}

function toggleFullScreen() {
  if (!document.documentElement.requestFullscreen) {
    console.log('NO document.documentElement.requestFullscreen');
    return;
  }
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
