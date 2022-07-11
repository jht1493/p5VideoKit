let page_pause_count;

function page_pause_start() {
  // page_pause_count = a_fast ? 1 : page_pause_frames;
  // page_pause_count = a_fast ? page_pause_frames / 2 : page_pause_frames;
  // console.log('page_pause_start day_next', day_next);
  let n = a_fast ? 0 : page_pause_secs;
  // if (day_next == 1) n = 0;
  page_pause_count = n * frameRate();
  a_state = 'page_pause';
  set_last();
}

function page_pause() {
  if (!dot_count_reached()) {
    return;
  }
  page_pause_count -= 1;
  if (page_pause_count < 0) {
    a_state = 'draw_bit';
    a_paused = 0;
    dot_next();
  }
}

function set_paused() {
  a_paused = 1;
  // console.log('a_paused', a_paused, 'y_pos', y_pos);
  a_x = 0;
}

function draw_paused() {
  // if (0) {
  //   a_x += pix_len;
  //   if (a_x + x_margin > width) {
  //     a_x = x_margin;
  //     a_y += pix_len;
  //     if (a_y + y_margin > height) {
  //       a_y = y_top;
  //       bottom_color = bottom_color == 'white' ? 'gray' : 'white';
  //     }
  //   }
  //   fill(bottom_color);
  //   draw_shape(a_x, a_y, pix_len, pix_len);
  //   bit_count++;
  //   return;
  // }
  if (message_done()) {
    page_pause_start();
  }
}
