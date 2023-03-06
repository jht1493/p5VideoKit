eff_ticker.prototype.load_json = function () {
  this.json_loaded = 0;
  // let url = 'https://epvisual.com/COVID-19-Impact/Dashboard/a0/c_data/world/c_series/United_States.json';
  let url = 'https://jht1493.net/COVID-19-Impact/Dashboard/a0/c_data/world/c_series/United_States.json';
  loadJSON(url, (data) => {
    // console.log('load_json data last', JSON.stringify(data[data.length - 1]));
    // console.log('data.length', data.length);
    // console.log('load_count', this.load_count);
    this.json_loaded = 1;
    this.load_count++;
    this.data_index_start = 0;
    this.cycle_done = 0;
    this.a_data = data;
    this.data_index_down = data.length;
    // this.data_index_down = 745; // !!@
    // this.data_index_down = 1000; // !!@
    if (this.data_index_offset) this.data_index_down = this.data_index_offset + 1;
    this.data_index_up = 0;
    this.data_index_mid = Math.floor(this.data_index_down / 2);
    this.prepare_data();
    this.select_entry();
  });
};

eff_ticker.prototype.select_entry = function () {
  let select_down = () => {
    do {
      this.data_index_down--;
      if (this.data_index_down < 1) {
        this.data_index_down = this.a_data.length - 1;
        this.cycle_done = 1;
      }
      this.data_index = this.data_index_down;
      ent1 = this.a_data[this.data_index];
      this.a_count = ent1.count;
    } while (this.a_count < 1);
  };
  let select_up = () => {
    do {
      this.data_index_up++;
      if (this.data_index_up >= this.a_data.length) {
        this.data_index_up = 1;
        this.cycle_done = 1;
      }
      this.data_index = this.data_index_up;
      ent1 = this.a_data[this.data_index];
      this.a_count = ent1.count;
    } while (a_count < 1);
    if (!this.data_index_start) {
      this.data_index_start = this.data_index_up;
    }
  };
  let select_up_down = () => {
    do {
      if (this.a_down) {
        this.data_index_down--;
        if (this.data_index_down < this.data_index_mid) {
          this.data_index_down = this.a_data.length - 1;
          this.cycle_done = 1;
        }
        this.data_index = this.data_index_down;
      } else {
        this.data_index_up++;
        if (this.data_index_up > this.data_index_mid) {
          this.data_index_up = 0;
          this.cycle_done = 1;
        }
        this.data_index = this.data_index_up;
      }
      ent1 = this.a_data[this.data_index];
      this.a_count = ent1.count;
    } while (this.a_count < 1);
    this.a_down ^= 1;
  };

  let ent1, ent0;
  if (this.a_dir === 'down') {
    select_down();
  } else if (this.a_dir === 'up') {
    select_up();
  } else {
    select_up_down();
  }
  this.a_date = ent1.on;
  let s = this.a_count > 1 ? 's' : '';
  if (this.day_next == 0) {
    this.a_string = '   COVID-19 Memorial\n\n' + this.a_date + '\n';
    // this.a_string = this.a_date + '\n' + this.a_count + '\n';
    // this.panel_top += this.dot_y + this.char_len + this.y_margin * 2;
    this.panel_top += this.dot_y + this.char_len * 2 + this.y_margin * 2;
    this.day_next++;
  } else {
    if (this.day_next == 1) {
      this.panel_top += this.dot_y + this.char_len + this.y_margin * 2;
      // this.y_top = this.char_len * 3;
      this.y_top = this.char_len * 4;
      // this.sort_data();
    }
    // else {
    //   this.panel_top += this.dot_y + this.char_len + this.y_margin * 2;
    // }
    this.day_next++;
    // this.a_string = this.a_date + '\n' + this.a_count + '\n\nUSA Death' + s + '\n' + this.a_postfix;
    this.a_string = this.a_date + '\n' + '\nUSA Death' + s + '\n' + this.a_postfix;
    // a_string = a_date + '\n' + a_count + '\n\n' + a_postfix;
  }
  this.end_index = this.a_string.length - 1;
  this.begin_day();
};

// mindex 85 mdate 2020-04-16 mcount 4607
// eff_ticker.prototype.function =  show_max_deaths() {
//   let mindex = -1;
//   let mcount = -1;
//   let mdate;
//   for (let index = 1; index < a_data.length - 1; index++) {
//     let ent1 = a_data[index];
//     let ent0 = a_data[index - 1];
//     let count = ent1.Deaths - ent0.Deaths;
//     if (count > mcount) {
//       mindex = index;
//       mcount = count;
//       mdate = ent1.on;
//     }
//   }
//   console.log("mindex", mindex, "mdate", mdate, "mcount", mcount);
// }

// -- 2023-03-05 23:37:09
// 2020-04-16 4605 85
// 2021-01-20 4408 364
// 2021-01-12 4349 356
// 2021-01-08 4224 352
// 2021-12-22 4185 700
// 2022-02-04 4126 744
// 2022-01-28 4093 737
// 2021-01-21 4063 365
// 2021-01-27 4061 371
// 2021-01-26 4012 370

// -- 2022-02-08 13:06:51
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

eff_ticker.prototype.prepare_data = function () {
  let ent0 = { Deaths: 0 };
  for (let index = 0; index < this.a_data.length; index++) {
    let ent1 = this.a_data[index];
    let count = ent1.Deaths - ent0.Deaths;
    ent1.count = count;
    ent1.index = index;
    ent0 = ent1;
  }
};

eff_ticker.prototype.sort_data = function () {
  let data = this.a_data.slice();
  data.sort((ent0, ent1) => ent0.count - ent1.count);
  if (1) {
    let n = 10;
    for (let index = 0; index < n; index++) {
      let ent = data[data.length - 1 - index];
      console.log(ent.on, ent.count, ent.index);
    }
  }
  return data;
};
