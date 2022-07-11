let a_width = 1280;
let a_height = 720;
// let a_width = 960;
// let a_height = 540;
let my_canvas;

function setup() {
  my_canvas = createCanvas(a_width, a_height);
  // let parent = document.getElementsByTagName('body')[0];
  // parent.insertBefore(my_canvas.elt, title.elt);
  create_ui();
  let_init();
  fresh_canvas();
  begin_day();
  load_json();
  setup_period_reload();
  show_copyright();
}

function show_copyright() {
  let adiv = createDiv();
  adiv.style('font-size:24px');
  let title = createDiv('COVID-19 Memorial Ticker (preview)');
  let copyr = createDiv('Copyright 2020-2022 John Henry Thompson & Shindy Johnson');
  let adash = createA('https://epvisual.com/COVID-19-Impact/Dashboard/a0/', 'COVID-19-Impact Dashboard', '_blank');
  // adiv.child([title, copyr, adash]);
  adiv.child(title);
  adiv.child(adash);
  adiv.child(copyr);
}

function setup_period_reload() {
  // Reload at 8am to get most recent update
  let sec = parse_restart_time('08:00:00');
  // let sec = parse_restart_time('23:59:59');
  // let sec = parse_restart_time('13:26:00');
  // console.log('setup_period_reload sec', sec);
  let per = sec * 1000;
  setTimeout(function () {
    // let loc = window.location.href;
    // window.location = loc;
    console.log('setup_period_reload setTimeout ');
    cycle_start_init();
  }, per);
}

function begin_day() {
  // console.log('begin_day day_next', day_next);
  clear_per_day();
  cycle_init();
  day_start = millis();
  bit_count = 0;
  string_index = start_index;
  y_pos = y_top;
  draw_char_start();
  // console.log('begin_day dot_count', dot_count, 'bit_count', bit_count);
  // !!@ 2-day
  dot_y = 0;
  dot_x = 0;
}

function clear_per_day() {
  // console.log('clear_per_day day_next', day_next);
  fill(0);
  let yLeft = 0;
  let yRight = 0;
  if (day_next >= 1) {
    yLeft = y_top;
    yRight = panel_top;
    // console.log('clear_per_day yRight', yRight, 'yLeft', yLeft, 'day_next', day_next);
  }
  rect(0, yLeft, panel_right, height);
  rect(panel_right, yRight, width - panel_right, height);
}

function draw() {
  if (!json_loaded) return;
  if (!a_run) return;

  if (a_state === 'draw_bit') {
    draw_bit();
  } else {
    page_pause();
  }

  draw_dots_fast();

  draw_count(dot_count + '');

  // draw_progress();

  draw_day_count();

  update_ui();
}

function draw_progress() {
  let x = -1;
  let y = height - pix_len + 1;
  // let nu = data_index_up - data_index_start;
  // let de = a_data.length - data_index_start;
  let nu = data_index_up;
  let de = a_data.length;
  if (a_dir === 'down') {
    nu = a_data.length - data_index_down;
    de = a_data.length;
  }
  let w = (width * nu) / de;
  fill('white');
  rect(x, y, w, pix_len);
  x = 0;
  let r2 = pix_len / 2;
  for (let i = 0; i < load_count - 1; i++) {
    circle(x + r2, y + r2, r2);
    x += pix_len;
  }
  fill(0);
}

function draw_day_count() {
  // str = 'day ' + data_index + '/' + a_data.length + ' ';
  // let str = 'DAY ' + data_index + ' of ' + a_data.length;
  let str = 'USA COVID DEATHS - DAY ' + data_index + ' of ' + a_data.length;
  str += ' - TOTAL DEATHS ' + a_data[a_data.length - 1].Deaths;
  // console.log('draw_day_count ', str);
  let th = pix_len * 1.5;
  textSize(th);
  // let th = textAscent() + textDescent() + textLeading();
  // th = pix_len * 1.5;
  let tw = textWidth(str);
  // let x = width - tw - 1;
  let x = 1;
  let y = height - 3;
  fill(0);
  rect(x, y - th, tw, th);
  fill('white');
  text(str, x, y);
}

function draw_count(str) {
  // let x = x_margin + (char_len * (nchars_wide - str.length)) / 2;
  let boxwidth = char_len * 5;
  // let xedge = panel_right;
  let xedge = width;
  let x = xedge - x_margin - boxwidth;
  // let y = y_margin;
  let y = panel_top - char_len;
  fill('black');
  rect(x, y, boxwidth, char_len);
  // x = panel_right - x_margin - char_len * str.length;
  x = xedge - char_len * str.length;
  for (let ch of str) {
    draw_char(x, y, ch);
    x += char_len;
  }
}

function draw_char(x0, y0, ch) {
  let bytes = font8x8_dict[ch];
  for (let y1 = 0; y1 < 8; y1++) {
    let byte = bytes[y1];
    for (x1 = 0; x1 < 8; x1++) {
      if (byte & (1 << x1)) {
        // fill('gray');
        fill_dot_color();
        let x = x0 + x1 * pix_len;
        let y = y0 + y1 * pix_len;
        rect(x, y, pix_len, pix_len);
      }
    }
  }
}

// https://github.com/EP-Visual-Design/COVID-19-parsed-data/blob/main/c_data/world/c_series/United_States.json
// https://raw.githubusercontent.com/EP-Visual-Design/COVID-19-parsed-data/main/c_data/world/c_series/United_States.json
