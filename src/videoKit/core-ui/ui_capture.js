import { a_ } from '../let/a_ui.js?v={{vers}}';
import { init_size_in } from '../core-ui/ui_canvas.js?v={{vers}}';
import { ui_prop_set } from '../core/ui_restore.js?v={{vers}}';
import { media_reset } from '../core/create_mediaDevices.js?v={{vers}}';
import { patch_inst_clear } from '../core/patch_inst.js?v={{vers}}';

export function ui_capture_size(div) {
  // console.log('ui_capture_size');
  div.child(createSpan(' Capture Size: '));
  let aSel = createSelect();
  div.child(aSel);
  for (let se of a_capture_sizes) {
    aSel.option(se.label);
  }
  aSel.selected(a_.ui.capture_size);
  aSel.changed(function () {
    let label = this.value();
    let se = a_capture_sizes_dict[label];
    ui_prop_set('capture_size', se.label);
    media_reset();
    patch_inst_clear();
  });
}

export function ui_capture_init() {
  a_capture_sizes_dict = init_size_in(a_capture_sizes);
}

export function get_capture_size() {
  let se = a_capture_sizes_dict[a_.ui.capture_size];
  // console.log('get_capture_size index', a_.ui.capture_sizei, 'se', se);
  return se;
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
