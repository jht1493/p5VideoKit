import { a_ } from '../let/a_state.js?v={{vers}}';
import { ui_prop_set } from '../core-ui/ui_restore.js?v={{vers}}';
import { store_set } from '../core-ui/ui_restore.js?v={{vers}}';
import { ui_window_refresh } from '../core-ui/a_ui_create.js?v={{vers}}';
import { ui_div_append } from '../core-ui/ui_tools.js?v={{vers}}';

export function ui_canvas_div(div) {
  let html = `
  <span>[Canvas Size: </span>
  <select id=icanvas_size>
    ${canvas_size_options(a_canvas_sizes)}
  </select>
  <div style="display: inline">
    <input type="checkbox" id="icanvas_lock" />
    <label for="icanvas_lock">Lock]</label>
  </div>
  `;

  function canvas_size_options(sizes) {
    let arr = sizes.map((se) => `<option value="${se.label}">${se.label}</option>`);
    return arr.join('');
  }

  ui_div_append(div, html);

  let icanvas_size = window.icanvas_size;
  let se = canvas_size_default();
  icanvas_size.selectedIndex = se.index;
  // Can not use arrow funtion here to get this
  icanvas_size.addEventListener('change', canvs_size_change);

  function canvs_size_change() {
    let index = this.selectedIndex;
    // console.log('icanvas_size change this', this);
    // console.log('icanvas_size change index', index);
    let se = a_canvas_sizes[index];
    if (se.func) {
      se.func();
    } else if (se.width) {
      ui_prop_set('canvas_size', se.label);
      resizeCanvas(se.width, se.height);
    } else {
      console.log('No canvas size in se', se);
    }
    ui_window_refresh();
  }

  let icanvas_lock = window.icanvas_lock;
  icanvas_lock.checked = a_.canvas_size_lock;
  icanvas_lock.addEventListener('change', check_lock_change);

  function check_lock_change() {
    // console.log('icanvas_lock change this', this);
    let state = this.checked;
    a_.canvas_size_lock = state ? 1 : 0;
    store_set('a_.canvas_size_lock', a_.canvas_size_lock + '');
  }
}

// <option value="320x240">320x240</option>
// <option value="480x270">480x270</option>
// <option value="640x480">640x480</option>
// <option value="960x540">960x540</option>
// <option value="1920x1080">1920x1080</option>
// <option value="540x960">540x960</option>
// <option value="1080x1920">1080x1920</option>
// <option value="2160x3840">2160x3840</option>
// <option value="Window">Window</option>
// <option value="Full Screen">Full Screen</option>
//

export function ui_canvas_init() {
  a_canvas_sizes_dict = init_size_in(a_canvas_sizes);
}

export function canvas_size_default() {
  let sz = a_canvas_sizes_dict[a_.ui.canvas_size];
  // console.log('canvas_sizei canvas_size', a_.ui.canvas_size, 'sz', sz);
  if (sz) return sz;
  return a_canvas_sizes[0];
}

export function init_size_in(sizes) {
  let dict = {};
  let index = 0;
  for (let se of sizes) {
    if (!se.label) {
      // label eg. 960x540
      se.label = se.width + 'x' + se.height;
    }
    se.index = index;
    dict[se.label] = se;
    index++;
  }
  return dict;
}

// 1920x1080 --> { width: 1920, height: 1080 }
export function str_to_width_height(str) {
  let pl = str.split('x');
  let width = parseFloat(pl[0]);
  let height = parseFloat(pl[1]);
  return { width, height };
}

export function toggleFullScreen() {
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

// {
//   width: 1280,
//   height: 480,
// },
// {
//   width: 1280,
//   height: 960,
// },
// {
//   width: 1920,
//   height: 1440,
// },
// {
//   width: 1080,
//   height: 1920,
// },
// {
//   width: 960,
//   height: 720,
// },
// {
//   width: 1600,
//   height: 1200,
// },

let a_canvas_sizes_dict;

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
    width: 1920,
    height: 1080,
  },
  {
    width: 540,
    height: 960,
  },
  {
    width: 1080,
    height: 1920,
  },
  {
    width: 2160,
    height: 3840,
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

// !!@ retired p5dom style for ui creation
//
// canvas_size();
// canvas_lock();
// function canvas_size() {
//   div.child(createSpan('[Canvas Size: '));
//   let aSel = createSelect();
//   div.child(aSel);
//   for (let se of a_canvas_sizes) {
//     aSel.option(se.label);
//   }
//   aSel.selected(a_.ui.canvas_size);
//   aSel.changed(function () {
//     let label = this.value();
//     let se = a_canvas_sizes_dict[label];
//     if (se.func) {
//       se.func();
//     } else if (se.width) {
//       ui_prop_set('canvas_size', se.label);
//       resizeCanvas(se.width, se.height);
//     } else {
//       console.log('No canvas size in se', se);
//     }
//     ui_window_refresh();
//   });
// }
// function canvas_lock() {
//   let chk = createCheckbox('Lock]', a_.canvas_size_lock);
//   div.child(chk);
//   chk.style('display:inline');
//   chk.changed(function () {
//     let state = this.checked();
//     a_.canvas_size_lock = state ? 1 : 0;
//     store_set('a_.canvas_size_lock', a_.canvas_size_lock + '');
//   });
// }
