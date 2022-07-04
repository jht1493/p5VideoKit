let a_app_ver = 'Present?v=35 ';
let a_store_ver = '192';
let a_store_name = 'Store-A';
let a_store_prefix = '';
let a_ui = {
  setting: '',
  back_color: 200,
  room_name: 'Dice-Play-1',
  patch_layout: 'Single',
  canvas_size: '960x540',
  capture_size: '480x270',
  render_size: 'Canvas',
  chat_name: 'jht',
  chat_chk: 0,
  live_index: 0,
  live_chk: 0,
  patches: [{ eff_src: { ipatch: 0, imedia: 1, eff_label: 'show' } }],
  mediaDiv_states: [],
  urects_lock: 0,
  urects_count: 0,
  canvas_resize_ref: '',
  canvas_data_chk: 0,
};
let a_patch_instances = [];
let a_canvas_size_lock = 0;
let a_hideui = 0; // Default is to hide using with s= settings
let a_chat_name; // chat name from url param c

let a_effects_dict;

function effectFind(label) {
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
    console.log('effectFind label not found', label);
    eff = a_effects[0];
  }
  return eff;
}
