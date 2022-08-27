import { a_ } from '../let/a_state.js?v={{vers}}';
import { init_size_in } from '../core-ui/ui_canvas.js?v={{vers}}';
import { ui_prop_set } from '../core-ui/ui_restore.js?v={{vers}}';
import { media_reset } from '../core/create_mediaDevices.js?v={{vers}}';
import { patch_inst_clear } from '../core/patch_inst.js?v={{vers}}';
import { ui_div_append } from '../core-ui/ui_tools.js?v={{vers}}';

export function ui_capture_size(div) {
  let html = `
  <span> Capture Size: </span>
  <select id=icapture_size>
    ${capture_size_options(a_capture_sizes)}
  </select>
  `;

  function capture_size_options(sizes) {
    let arr = sizes.map((se) => `<option value="${se.label}">${se.label}</option>`);
    return arr.join('');
  }

  ui_div_append(div, html);

  let icapture_size = window.icapture_size;
  let se = get_capture_size();
  icapture_size.selectedIndex = se.index;
  // Can not use arrow funtion here to get this
  icapture_size.addEventListener('change', capture_size_change);

  function capture_size_change() {
    // console.log('capture_size change value', this.value);
    let value = this.value;
    ui_prop_set('capture_size', value);
    media_reset();
    patch_inst_clear();
  }
}

// <span> Capture Size: </span>
// <select>
//   <option value="default">default</option>
//   <option value="320x240">320x240</option>
//   <option value="480x270">480x270</option>
//   <option value="640x480">640x480</option>
//   <option value="960x540">960x540</option>
//   <option value="1920x1080">1920x1080</option>
//   <option value="20x15">20x15</option>
//   <option value="40x30">40x30</option>
//   <option value="80x60">80x60</option>
//   <option value="160x120">160x120</option>
// </select>
//

export function ui_capture_init() {
  a_capture_sizes_dict = init_size_in(a_capture_sizes);
}

export function get_capture_size() {
  let se = a_capture_sizes_dict[a_.ui.capture_size];
  // console.log('get_capture_size index', a_.ui.capture_sizei, 'se', se);
  if (se) return se;
  return a_capture_sizes[1];
}

let a_capture_sizes_dict;

let a_capture_sizes = [
  {
    label: 'default',
  },
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
    width: 20,
    height: 15,
  },
  {
    width: 40,
    height: 30,
  },
  {
    width: 80,
    height: 60,
  },
  {
    width: 160,
    height: 120,
  },
];

// !!@ retired p5dom style for ui creation
//
// div.child(createSpan(' Capture Size: '));
// let aSel = createSelect();
// div.child(aSel);
// for (let se of a_capture_sizes) {
//   aSel.option(se.label);
// }
// aSel.selected(a_.ui.capture_size);
// aSel.changed(function () {
//   let label = this.value();
//   let se = a_capture_sizes_dict[label];
//   ui_prop_set('capture_size', se.label);
//   media_reset();
//   patch_inst_clear();
// });
