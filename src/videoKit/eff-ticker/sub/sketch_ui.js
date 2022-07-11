function create_ui() {
  ui_top_pane();
  ui_size_pane();
  // ui_patch_layout();
  // ui_patch_eff_panes();
  // ui_patch_buttons();
  // createElement('br');
  // ui_live_selection();
  // ui_chat_pane();
  // createElement('br');
}

function ui_top_pane() {
  createSpan(a_app_ver);
  createButton('Present').mousePressed(function () {
    present_action();
  });
  createButton('HideUI').mousePressed(function () {
    ui_hide();
    ui_window_refresh();
  });
  createButton('Reset').mousePressed(function () {
    cycle_start_init();
  });
  createSpan().id('i_fps');
  createSpan().id('i_ctime');
  createSpan().id('i_dtime');
  createSpan().id('i_lcount');
  createSpan().id('i_msg');
  createElement('br');
  createButton('Jump').mousePressed(function () {
    data_index_down = 50;
    page_pause_count = -1;
    page_pause_secs = 2;
  });
  createButton('Normal').mousePressed(function () {
    a_fast = 0;
    console.log('a_fast', a_fast, 'a_fast_n', a_fast_n);
  });
  createButton('Fast').mousePressed(function () {
    a_fast = 1;
    a_fast_n = a_fast_n * 2;
    console.log('a_fast', a_fast, 'a_fast_n', a_fast_n);
  });
  createButton('Slower').mousePressed(function () {
    a_fast_n = Math.floor(a_fast_n / 2);
    console.log('a_fast', a_fast, 'a_fast_n', a_fast_n);
  });
  createButton('Run').mousePressed(function () {
    a_run = !a_run;
    console.log('a_run', a_run);
  });
}

function present_action() {
  load_count = 0;
  toggleFullScreen();
  let delay = 3000;
  let dir_saved = a_dir;
  function func() {
    resizeCanvas(windowWidth, windowHeight);
    ui_hide();
    ui_window_refresh();
    a_dir = dir_saved;
  }
  setTimeout(func, delay);
}

function ui_window_refresh() {
  my_canvas.elt.style.cursor = 'none';
  a_width = windowWidth;
  a_height = windowHeight;
  cycle_start_init();
}

function update_ui() {
  ui_show_num('fps', frameRate());
  if (cycle_start_time) {
    let lapse = (millis() - cycle_start_time) / 1000 / 60;
    ui_show_num('ctime', lapse);
  }
  if (day_start) {
    let lapse = (millis() - day_start) / 1000 / 60;
    ui_show_num('dtime', lapse);
  }
  if (last_count) {
    ui_show_num('lcount', last_count);
  }
  ui_show_text('msg', a_date + ' ' + a_count);
  // ui_show_num('lwrap', wrap_count);
}
