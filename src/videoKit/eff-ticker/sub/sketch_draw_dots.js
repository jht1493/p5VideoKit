eff_ticker.prototype.draw_dots_fast = function () {
  let n = a_fast ? a_fast_n : 1;
  // attempt at dot rhythm
  // n = random([0, 1]);
  while (n-- > 0) {
    draw_dots();
  }
};
eff_ticker.prototype.draw_dots = function () {
  if (dot_count_reached()) {
    return;
  }
  dot_count++;
  // console.log('draw_dots dot_count', dot_count, 'bit_count', bit_count);
  let x = panel_right + dot_x;
  let y = panel_top + dot_y;
  fill_dot_color();
  draw_dot(x, y, pix_len, pix_len);
  dot_x += pix_len;
  if (dot_x + pix_len >= panel_width) {
    dot_x = 0;
    dot_y += pix_len;
    if (dot_y + pix_len >= panel_height) {
      dot_y = 0;
    }
  }
};

eff_ticker.prototype.dot_next = function () {
  // console.log('dot_next dot_cindex', dot_cindex);
  // dot_cindex ^= 1;
  dot_cindex = 1;
  // !!@ 2-day
  // dot_count_total += dot_count;
  dot_count = 0;
  select_entry();
  if (dot_count_total + a_count > dot_panel_max) {
    console.log('dot_next dot_panel_max dot_count_total', dot_count_total);
    // !!@ 2-day
    // fresh_canvas();
    dot_count_total = 0;
  }
  if (cycle_done) {
    cycle_start_init();
  }
};

eff_ticker.prototype.cycle_start_init = function () {
  // console.log('cycle_start_init a_dir', a_dir);
  let_init();
  // !!@ 2-day
  // a_dir = a_dir === 'up' ? 'down' : 'up';
  fresh_canvas();
  load_json();
};

eff_ticker.prototype.fresh_canvas = function () {
  console.log('fresh_canvas day_next', day_next);
  // background(0);
  clear_per_day();
  dot_x = 0;
  dot_y = 0;
};

eff_ticker.prototype.dot_count_reached = function () {
  return dot_count >= a_count;
};

eff_ticker.prototype.draw_dot = function (a_x, a_y, len_x, len_y) {
  rect(a_x, a_y, len_x, len_y);
  // ellipse(a_x + len_x / 2, a_y + len_y / 2, len_x, len_y);
};

eff_ticker.prototype.fill_dot_color = function () {
  fill(dot_colors[dot_cindex]);
};
