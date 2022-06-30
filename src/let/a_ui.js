let a_app_ver = 'Dice?v=14 ';
let a_store_ver = '192';
let a_store_name = 'Store-A';
let a_store_prefix = '';
let a_ui = {
  setting: '',
  back_color: 200,
  room_name: 'Dice-Play-1',
  patch_layout: 'Single',
  canvas_size: '640x480',
  capture_size: '320x240',
  chat_name: 'jht',
  chat_chk: 0,
  live_index: 0,
  live_chk: 0,
  patches: [{ isrc: { ipatch: 0, imedia: 1, effect: 'show' } }],
  medias: [],
  pads_lock: 0,
  pads_count: 0,
  canvas_resize_ref: '',
  // pads_scale
  canvas_data_chk: 0,
};
let a_patch_instances = [];
let a_canvas_size_lock = 0;

let a_hideui = 0; // Default is to hide using with s= settings
let a_chat_name; // chat name from url param c

let a_effects_dict;

function effect_label(label) {
  if (!a_effects_dict) {
    a_effects_dict = {};
    let index = 0;
    for (let eff of a_effects) {
      a_effects_dict[eff.label] = eff;
      eff.index = index;
      index++;
    }
  }
  if (!label) {
    return a_effects[0];
  }
  let eff = a_effects_dict[label];
  if (!eff) {
    console.log('effect_label !!@ eff', label);
    eff = a_effects[0];
  }
  return eff;
}
