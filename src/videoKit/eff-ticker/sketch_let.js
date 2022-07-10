let a_run = 1;
let a_fast = 0;
let a_fast_n = 100;
let a_count = 3750;
let draw_bit_delay = 1;
let a_paused;
let page_pause_secs = 10;
let a_string = a_count + ' USA\nDeaths on\n2020-12-30\n';
let nchars_wide = 11;
let a_data;
let data_index;
// to heal we must remember
// let a_postfix = '"to heal\nwe must\nremember"';
// let a_postfix = '\nto heal\nwe remember';
let a_postfix = '\nto heal\nwe must\nremember';
let n_lines = 6;
let cycle_time;
let last_count;
let cycle_start_time;
let day_start;
let start_index = 0;
let end_index = a_string.length - 1;
let string_index = start_index;
let pix_len;
let char_len;
let x_margin;
let y_margin;
let x_pos;
let y_pos;
let y_top;
let x_right;
let a_char;
let a_bytes;
let bit_index;
let byte_index;
let a_x;
let a_y;
let a_byte;
let cursor_x;
let cursor_y;
let bit_count;
let a_rev = 0;
let bottom_color;
let a_date;
let cycle_done = 0;
let panel_len;
let dot_x;
let dot_y;
let dot_count;
// let dot_colors = ['gray', 'lightgray'];
let dot_colors = [
  [128, 128, 128, 255],
  [211, 211, 211, 255],
];
let dot_cindex = 0;
let panel_right, panel_width, panel_top, panel_height;
let a_state = 'draw_bit';
let a_down = 0;
let a_dir = 'down';
// let a_dir = 'up';
let data_index_start;
let data_index_offset = 0;
let data_index_end;
let data_index_down;
let data_index_up;
let data_index_mid;
let load_count = 0;
let json_loaded = 0;
let day_next = 0;

function let_init() {
  // data_index_offset = 85;
  // data_index_offset = 600;
  bottom_color = 'white';
  panel_len = width / 2;
  pix_len = panel_len / (nchars_wide * 8);
  char_len = 8 * pix_len;
  x_margin = pix_len;
  y_margin = pix_len;
  x_pos = x_margin;
  // y_top = y_margin + (height - n_lines * char_len) / 2;
  y_top = y_margin;
  y_pos = y_top;
  panel_right = panel_len + x_margin;
  panel_width = width - panel_right - x_margin;
  panel_top = y_margin + char_len;
  panel_height = height - 3 * y_margin;
  dot_x = 0;
  dot_y = 0;
  dot_count = 0;
  dot_count_total = 0;
  dot_panel_max = Math.floor(panel_width / pix_len) * Math.floor(panel_height / pix_len);
  cycle_start_time = millis();
  a_state = 'draw_bit';
  a_paused = 0;
  dot_cindex = 0;
  let nlines = Math.floor(panel_height / (pix_len * 8));
  console.log('dot_panel_max', dot_panel_max);
  console.log('panel_height', panel_height);
  console.log('pix_len', pix_len);
  console.log('nlines', nlines);
  day_next = 0;
}

function cycle_init() {
  y_pos = y_top;
  x_pos = x_margin;
}
