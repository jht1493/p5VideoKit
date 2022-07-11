function draw_char_start() {
  a_char = a_string[string_index];
  while (a_char === '\n') {
    draw_next_line();
    next_string_index();
    if (a_paused) return;
    a_char = a_string[string_index];
    // print('string_index', string_index, 'a_char', a_char);
  }
  a_bytes = font8x8_dict[a_char];
  if (!a_bytes) {
    return;
  }
  a_x = x_pos;
  a_y = y_pos;
  byte_index = 0;
  bit_index = 0;
  a_byte = a_bytes[byte_index];
  fill('black');
  rect(a_x, a_y, char_len * 2, char_len);
}

function draw_bit() {
  let n = 1;
  let rush = dot_count_reached();
  if (a_fast) {
    n = a_fast_n;
  } else if (rush) {
    // n = (n + 1) % 11;
    n = draw_bit_delay;
  }
  while (n-- > 0) {
    draw_bit_one(rush);
    if (a_paused) return;
  }
}

function draw_bit_one(rush) {
  let bc = bit_count;
  while (bit_count == bc) {
    if (bit_index < 8) {
      if (a_byte & (1 << bit_index)) {
        let dci = dot_cindex;
        // if (rush) dci ^= 1;
        // else {
        //   // console.log('draw_bit_one ~rush bit_count', bit_count);
        // }
        fill(dot_colors[dci]);
        draw_shape(a_x, a_y, pix_len, pix_len);
        if (!a_rev) bit_count++;
      } else {
        if (a_rev) {
          fill('white');
          draw_shape(a_x, a_y, pix_len, pix_len);
          bit_count++;
        }
      }
      bit_index += 1;
      a_x += pix_len;
    } else {
      bit_index = 0;
      byte_index += 1;
      a_x = x_pos;
      a_y += pix_len;
      if (byte_index < 8) {
        a_byte = a_bytes[byte_index];
      } else {
        draw_next_char();
        if (a_paused) return;
      }
    }
    if (a_paused) {
      draw_paused();
      return;
    }
  }
}

function draw_shape(a_x, a_y, len_x, len_y) {
  rect(a_x, a_y, len_x, len_y);
  // ellipse(a_x + len_x / 2, a_y + len_y / 2, len_x, len_y);
}

function draw_next_char() {
  next_string_index();
  if (a_paused) return;
  x_pos += char_len;
  if (x_pos + char_len - x_margin > width) {
    draw_next_line();
  }
  draw_char_start();
}

function next_string_index() {
  string_index += 1;
  if (string_index > end_index) {
    set_paused();
  }
}

function message_done() {
  return string_index > end_index;
}

function draw_next_line() {
  x_pos = x_margin;
  y_pos += char_len;
  if (y_pos + char_len > height - y_margin) {
    y_pos = y_top;
    string_index = start_index;
  }
}

function set_last() {
  if (bit_count) last_count = bit_count;
}
