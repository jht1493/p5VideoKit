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
