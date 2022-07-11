eff_ticker.prototype.draw_dots_fast = function () {
  let n = this.a_fast ? this.a_fast_n : 1;
  // attempt at dot rhythm
  // n = random([0, 1]);
  while (n-- > 0) {
    this.draw_dots();
  }
};
eff_ticker.prototype.draw_dots = function () {
  if (this.dot_count_reached()) {
    return;
  }
  this.dot_count++;
  // console.log('draw_dots dot_count', dot_count, 'bit_count', bit_count);
  let x = this.panel_right + this.dot_x;
  let y = this.panel_top + this.dot_y;
  this.fill_dot_color();
  this.draw_dot(x, y, this.pix_len, this.pix_len);
  this.dot_x += this.pix_len;
  if (this.dot_x + this.pix_len >= this.panel_width) {
    this.dot_x = 0;
    this.dot_y += this.pix_len;
    if (this.dot_y + this.pix_len >= this.panel_height) {
      this.dot_y = 0;
    }
  }
};

eff_ticker.prototype.dot_next = function () {
  // console.log('dot_next dot_cindex', dot_cindex);
  // dot_cindex ^= 1;
  this.dot_cindex = 1;
  // !!@ 2-day
  // dot_count_total += dot_count;
  this.dot_count = 0;
  this.select_entry();
  if (this.dot_count_total + this.a_count > this.dot_panel_max) {
    console.log('dot_next dot_panel_max dot_count_total', this.dot_count_total);
    // !!@ 2-day
    // fresh_canvas();
    this.dot_count_total = 0;
  }
  if (this.cycle_done) {
    this.cycle_start_init();
  }
};

eff_ticker.prototype.cycle_start_init = function () {
  // console.log('cycle_start_init a_dir', a_dir);
  this.let_init();
  // !!@ 2-day
  // a_dir = a_dir === 'up' ? 'down' : 'up';
  this.fresh_canvas();
  this.load_json();
};

eff_ticker.prototype.fresh_canvas = function () {
  console.log('fresh_canvas day_next', this.day_next);
  this.clear_per_day();
  this.dot_x = 0;
  this.dot_y = 0;
};

eff_ticker.prototype.dot_count_reached = function () {
  return this.dot_count >= this.a_count;
};

eff_ticker.prototype.draw_dot = function (a_x, a_y, len_x, len_y) {
  this.output.rect(a_x, a_y, len_x, len_y);
  // ellipse(a_x + len_x / 2, a_y + len_y / 2, len_x, len_y);
};

eff_ticker.prototype.fill_dot_color = function () {
  this.output.fill(this.dot_colors[this.dot_cindex]);
};
