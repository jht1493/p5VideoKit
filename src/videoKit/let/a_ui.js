export let a_ = {
  app_ver: 'Present?v=84 ',
  store_ver: '2',
  store_name: 'Store-A',
  store_prefix: 'a',
  ui: {
    setting: '',
    back_color: 200,
    room_name: 'VideoKit-Room-1',
    patch_layout: 'Single',
    canvas_size: '960x540',
    capture_size: '480x270',
    render_size: 'Canvas',
    chat_name: 'jht',
    chat_chk: 0,
    live_index: 0,
    live_chk: 0,
    mediaDiv_states: [],
    urects_lock: 0,
    urects_count: 0,
    canvas_resize_ref: '',
    canvas_data_chk: 0,
    patches: [{ eff_src: { ipatch: 0, imedia: 1, eff_label: 'show' } }],
  },
  patch_instances: [],
  canvas_size_lock: 0,
  hideui: 0, // Default is to hide using with s= settings
  chat_name: '', // chat name from url param c
  settings: [],
};
// !!@ For debugging
window.a_ = a_;
