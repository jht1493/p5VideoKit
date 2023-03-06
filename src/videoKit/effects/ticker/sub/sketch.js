// let a_width = 1280;
// let a_height = 720;
// let a_width = 960;
// let a_height = 540;
// let my_canvas;

import './sketch_draw_dots.js?v={{vers}}';
import './sketch_draw.js?v={{vers}}';
import './sketch_font8.js?v={{vers}}';
import './sketch_let.js?v={{vers}}';
import './sketch_load.js?v={{vers}}';
import './sketch_paused.js?v={{vers}}';

eff_ticker.prototype.init = function () {
  // my_canvas = createCanvas(a_width, a_height);
  // let parent = document.getElementsByTagName('body')[0];
  // parent.insertBefore(my_canvas.elt, title.elt);
  console.log('eff_ticker init');
  // this.output.noStroke();
  // ui_create();
  this.let_init();
  this.fresh_canvas();
  this.begin_day();
  this.load_json();
  this.setup_period_reload();
  if (this.display_copy_right) this.show_copyright();
};

// overwrite stub prepareOutput in eff_ticker.js
eff_ticker.prototype.prepareOutput = function () {
  // console.log('eff_ticker prepareOutput');
  if (!this.json_loaded) return;
  if (!this.a_run) return;
  if (this.a_state === 'draw_bit') {
    this.draw_bit();
  } else {
    this.page_pause();
  }
  this.draw_dots_fast();
  this.draw_count(this.dot_count + '');
  // draw_progress();
  this.draw_day_count();
  // this.update_ui();
};

// jump_action
eff_ticker.prototype.jump_action = function () {
  console.log('eff_ticker jump_action');
  this.data_index_down = 86;
  this.page_pause_count = -1;
  this.page_pause_secs = 2;
};

// 2020-04-16 4607 85
// 2021-01-20 4442 364
// 2021-01-12 4389 356
// 2021-01-08 4189 352
// 2022-02-04 4154 744 **
// 2021-01-21 4137 365
// 2021-01-27 4128 371
// 2022-01-26 4068 735 **
// 2021-01-07 4028 351
// 2021-01-13 4018 357

eff_ticker.prototype.show_copyright = function () {
  let adiv = createDiv();
  adiv.style('font-size:24px');
  let title = createDiv('COVID-19 Memorial Ticker (preview)');
  let copyr = createDiv('Copyright 2020-Present John Henry Thompson & Shindy Johnson');
  let adash = createA('https://jht1493.net/COVID-19-Impact/Dashboard/', 'COVID-19-Impact Dashboard', '_blank');
  // adiv.child([title, copyr, adash]);
  adiv.child(title);
  adiv.child(adash);
  adiv.child(copyr);
};

eff_ticker.prototype.setup_period_reload = function () {
  // Reload at 8am to get most recent update
  let sec = parse_restart_time('08:00:00');
  // let sec = parse_restart_time('23:59:59');
  // let sec = parse_restart_time('13:26:00');
  // console.log('setup_period_reload sec', sec);
  let per = sec * 1000;
  setTimeout(() => {
    // let loc = window.location.href;
    // window.location = loc;
    console.log('setup_period_reload setTimeout ');
    this.cycle_start_init();
  }, per);
};

eff_ticker.prototype.begin_day = function () {
  // console.log('begin_day day_next', day_next);
  this.clear_per_day();
  this.cycle_init();
  this.day_start = millis();
  this.bit_count = 0;
  this.string_index = this.start_index;
  this.y_pos = this.y_top;
  this.draw_char_start();
  // console.log('begin_day dot_count', dot_count, 'bit_count', bit_count);
  // !!@ 2-day
  this.dot_y = 0;
  this.dot_x = 0;
};

eff_ticker.prototype.clear_per_day = function () {
  // console.log('clear_per_day this.day_next', this.day_next);
  let yLeft = 0;
  let yRight = 0;
  if (this.day_next >= 1) {
    yLeft = this.y_top;
    yRight = this.panel_top;
    // console.log('clear_per_day yRight', yRight, 'yLeft', yLeft, 'day_next', day_next);
  }
  this.output.erase();
  this.output.fill(0);
  this.output.rect(0, yLeft, this.panel_right, this.height);
  this.output.rect(this.panel_right, yRight, this.width - this.panel_right, this.height);
  this.output.noErase();
};

eff_ticker.prototype.draw_progress = function () {
  let x = -1;
  let y = this.height - this.pix_len + 1;
  // let nu = data_index_up - data_index_start;
  // let de = a_data.length - data_index_start;
  let nu = this.data_index_up;
  let de = this.a_data.length;
  if (this.a_dir === 'down') {
    nu = this.a_data.length - this.data_index_down;
    de = this.a_data.length;
  }
  let w = (this.width * nu) / de;
  this.output.fill('white');
  this.output.rect(x, y, w, pix_len);
  x = 0;
  let r2 = this.pix_len / 2;
  for (let i = 0; i < this.load_count - 1; i++) {
    this.output.circle(x + r2, y + r2, r2);
    x += this.pix_len;
  }
  this.output.fill(0);
};

eff_ticker.prototype.draw_day_count = function () {
  // str = 'day ' + data_index + '/' + a_data.length + ' ';
  // let str = 'DAY ' + data_index + ' of ' + a_data.length;
  let str = 'USA COVID DEATHS - DAY ' + this.data_index + ' of ' + this.a_data.length;
  str += ' - TOTAL DEATHS ' + this.a_data[this.a_data.length - 1].Deaths;
  // console.log('draw_day_count ', str);
  let th = this.pix_len * 1.5;
  this.output.textSize(th);
  // let th = textAscent() + textDescent() + textLeading();
  // th = pix_len * 1.5;
  let tw = this.output.textWidth(str);
  // let x = width - tw - 1;
  let x = 1;
  let y = this.height - 3;
  this.output.erase();
  this.output.fill(0);
  this.output.rect(x, y - th, tw, th);
  this.output.noErase();
  this.output.fill('white');
  this.output.text(str, x, y);
};

eff_ticker.prototype.draw_count = function (str) {
  // let x = x_margin + (char_len * (nchars_wide - str.length)) / 2;
  let boxwidth = this.char_len * 5;
  // let xedge = panel_right;
  let xedge = this.width;
  let x = xedge - this.x_margin - boxwidth;
  // let y = y_margin;
  let y = this.panel_top - this.char_len;
  this.output.erase();
  this.output.fill(0);
  this.output.rect(x, y, boxwidth, this.char_len);
  this.output.noErase();
  // x = panel_right - x_margin - char_len * str.length;
  x = xedge - this.char_len * str.length;
  for (let ch of str) {
    this.draw_char(x, y, ch);
    x += this.char_len;
  }
};

eff_ticker.prototype.draw_char = function (x0, y0, ch) {
  let bytes = this.font8x8_dict[ch];
  for (let y1 = 0; y1 < 8; y1++) {
    let byte = bytes[y1];
    for (let x1 = 0; x1 < 8; x1++) {
      if (byte & (1 << x1)) {
        // fill('gray');
        this.fill_dot_color();
        let x = x0 + x1 * this.pix_len;
        let y = y0 + y1 * this.pix_len;
        this.output.rect(x, y, this.pix_len, this.pix_len);
      }
    }
  }
};

function parse_period(period_str) {
  // hh:mm:ss
  // mm:ss
  // ss
  let arr = period_str.split(':').map(parseFloat);
  if (arr.length == 1) {
    arr[2] = arr[0];
    arr[1] = 0;
    arr[0] = 0;
  } else if (arr.length == 2) {
    arr[2] = arr[1];
    arr[1] = arr[0];
    arr[0] = 0;
  }
  let secs = (arr[0] * 60 + arr[1]) * 60 + arr[2];
  // console.log('parse_period secs', secs);
  return secs;
}

function parse_restart_time(restart_time) {
  let secs = parse_period(restart_time);
  // console.log('parse_restart_time secs', secs);
  let d = new Date();
  let nsecs = (d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds();
  // console.log('parse_restart_time nsecs', nsecs);
  let m = 24 * 60 * 60;
  let per = (secs - nsecs + m) % m;
  // console.log('parse_restart_time per', per);
  return per;
}

// https://github.com/EP-Visual-Design/COVID-19-parsed-data/blob/main/c_data/world/c_series/United_States.json
// https://raw.githubusercontent.com/EP-Visual-Design/COVID-19-parsed-data/main/c_data/world/c_series/United_States.json
