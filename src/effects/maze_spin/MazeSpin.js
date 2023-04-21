// maze with rotating transition

// https://editor.p5js.org/jht9629-gmail/sketches/-FuOH_EE4

import SpiralWalker from './sub/SpiralWalker.js?v={{vers}}';
import SecondsTimer from './sub/SecondsTimer.js?v={{vers}}';
import { report_1ofn, div_report } from './sub/report.js?v={{vers}}';
import { array_zero, array_add, array_random } from './sub/array.js?v={{vers}}';

export default class MazeSpin {
  // this.ncells
  // this.width = this.width
  // this.height = this.height
  // this.strokeWeight = 0.5;
  // this.delta = 1;
  // this.step_period = 1.0;
  // this.pause_period = 1.0; // 0.5;
  // this.do_cycle = 0;
  // this.do_spiral
  // this.alpha
  constructor(props) {
    // console.log('MazeSpin props', props);
    Object.assign(this, props);

    this.now = [];
    this.next = [];
    this.random = [];

    this.report_lines = [];
    this.div;

    this.d = int(this.width / this.ncells);

    this.output = createGraphics(this.width, this.height);
    if (this.video_color) {
      this.input_copy = createImage(this.width, this.height);
    }
    this.output.noFill();
    this.output.strokeWeight(this.d * this.strokeWeight);

    let n = this.do_spiral ? this.make_spiral_pts() : this.make_grid_pts();
    array_zero(this.now, n);
    array_zero(this.next, n);
    array_zero(this.random, n);
    array_add(this.next, this.delta);
    this.target = this.next;

    this.timer = new SecondsTimer();
    this.timer.setPeriod(this.step_period);

    this.clear_timer = new SecondsTimer();
    this.clear_timer.setPeriod(this.clear_period);

    if (this.do_cycle == 0) {
      this.draw_step = 'draw_maze0_step';
    } else if (this.do_cycle == 1) {
      array_random(this.next);
      this.draw_step = 'draw_maze1_step';
    } else {
      this.draw_step = 'draw_maze2_step0';
    }

    report_1ofn(this);
    div_report(this, this.target, 'setup');
  }

  prepareOutput() {
    // console.log('MazeSpin prepareOutput');
    if (this.video_color) {
      // copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)
      this.input_copy.copy(this.input, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
    }
    this[this.draw_step]();
  }

  draw_maze_progress() {
    this.draw_maze_at(this.timer.progress());
  }

  draw_maze_still() {
    this.draw_maze_at(1.0);
  }

  draw_maze_at(at) {
    // this.output.background(220);
    if (this.clear_timer.arrived()) {
      this.output.clear();
    }
    let tangle = HALF_PI * at;
    let half = this.d / 2;
    let drawLeft = this.do_truchet ? 'truchet_drawLeft' : 'line_drawLeft';
    let drawRight = this.do_truchet ? 'truchet_drawRight' : 'line_drawRight';
    for (let index = 0; index < this.pts.length; index++) {
      let [x, y] = this.pts[index];
      let now = this.now[index];
      let target = this.target[index];
      let angle = now == target ? 0 : tangle;
      if (this.video_color) {
        let col = this.input_copy.get(x, y);
        col[3] = this.alpha;
        this.output.stroke(col);
      }
      if (now) {
        this[drawLeft](x, y, this.d, half, angle);
      } else {
        this[drawRight](x, y, this.d, half, angle);
      }
    }
  }

  // sequential
  draw_maze0_step() {
    this.draw_maze_progress();
    if (this.timer.arrived()) {
      this.timer.setPeriod(this.pause_period);
      this.draw_step = 'draw_maze0_pause';
    }
  }

  draw_maze0_pause() {
    this.draw_maze_still();
    if (this.timer.arrived()) {
      array_add(this.now, this.delta);
      array_add(this.next, this.delta);
      div_report(this, this.target, 'draw_maze0_step');
      this.timer.setPeriod(this.step_period);
      this.draw_step = 'draw_maze0_step';
    }
  }

  // random to random
  draw_maze1_step() {
    this.draw_maze_progress();
    if (this.timer.arrived()) {
      this.timer.setPeriod(this.pause_period);
      this.draw_step = 'draw_maze1_pause';
    }
  }

  draw_maze1_pause() {
    this.draw_maze_still();
    if (this.timer.arrived()) {
      let oldNow = this.now;
      this.now = this.next;
      this.next = oldNow;
      this.target = this.next;
      array_random(this.target);
      div_report(this, this.target, 'draw_maze1_step');
      this.timer.setPeriod(this.step_period);
      this.draw_step = 'draw_maze1_step';
    }
  }

  // --
  // sequencail - random - sequential
  draw_maze2_step0() {
    this.draw_maze_progress();
    if (this.timer.arrived()) {
      this.timer.setPeriod(this.pause_period);
      this.draw_step = 'draw_maze2_pause0';
    }
  }

  draw_maze2_pause0() {
    this.draw_maze_still();
    if (this.timer.arrived()) {
      array_add(this.now, this.delta);
      array_add(this.next, this.delta);
      array_random(this.random);
      this.target = this.random;
      div_report(this, this.target, 'draw_maze2_step1');
      this.timer.setPeriod(this.step_period);
      this.draw_step = 'draw_maze2_step1';
    }
  }

  draw_maze2_step1() {
    this.draw_maze_progress();
    if (this.timer.arrived()) {
      this.timer.setPeriod(this.pause_period);
      this.draw_step = 'draw_maze2_pause2';
    }
  }

  draw_maze2_pause2() {
    this.draw_maze_still();
    if (this.timer.arrived()) {
      let now_save = this.now;
      this.now = this.target;
      this.target = now_save;
      div_report(this, this.target, 'draw_maze2_step2');
      this.timer.setPeriod(this.step_period);
      this.draw_step = 'draw_maze2_step2';
    }
  }

  draw_maze2_step2() {
    this.draw_maze_progress();
    if (this.timer.arrived()) {
      this.timer.setPeriod(this.pause_period);
      this.draw_step = 'draw_maze2_pause3';
    }
  }

  draw_maze2_pause3() {
    this.draw_maze_still();
    if (this.timer.arrived()) {
      this.now = this.target;
      this.target = this.next;
      div_report(this, this.target, 'draw_maze2_step0');
      this.timer.setPeriod(this.step_period);
      this.draw_step = 'draw_maze2_step0';
    }
  }

  // --
  line_drawLeft(x, y, len, half, angle) {
    this.output.push();
    this.output.translate(x + half, y + half);
    this.output.rotate(angle);
    this.output.line(-half + 0, -half + 0, -half + len, -half + len);
    this.output.pop();
  }

  line_drawRight(x, y, len, half, angle) {
    this.output.push();
    this.output.translate(x + half, y + half);
    this.output.rotate(angle);
    this.output.line(-half + len, -half + 0, -half + 0, -half + len);
    this.output.pop();
  }

  // --
  truchet_drawLeft(x, y, len, half, angle) {
    this.output.push();
    this.output.translate(x + half, y + half);
    this.output.rotate(angle);
    this.output.arc(-half + 0, -half + 0, len, len, 0, d90);
    this.output.arc(-half + len, -half + len, len, len, d180, d270);
    this.output.pop();
  }

  truchet_drawRight(x, y, len, half, angle) {
    this.output.push();
    this.output.translate(x + half, y + half);
    this.output.rotate(angle);
    this.output.arc(-half + len, -half + 0, len, len, d90, d180);
    this.output.arc(-half + 0, -half + len, len, len, d270, d360);
    this.output.pop();
  }

  // --
  make_spiral_pts() {
    this.pts = new SpiralWalker(this).points();
    return this.pts.length;
  }

  make_grid_pts() {
    let pts = [];
    for (let y = 0; y < this.height; y += this.d) {
      for (let x = 0; x < this.width; x += this.d) {
        pts.push([x, y]);
      }
    }
    let n = pts.length;
    let nw = int(this.width / this.d);
    let nh = int(this.height / this.d);
    let half = int(n / 2);
    // console.log('make_grid_pts n', n, 'half', half);
    // console.log('make_grid_pts nw', nw, 'nh', nh);

    // let offset = int(nw / 2) + int(nh / 2) * nw;
    // let npts = [];
    // for (let index = 0; index < n; index++) {
    //   npts.push(pts[(index + offset) % n]);
    // }
    // this.pts = npts;

    this.pts = pts;
    return n;
  }
}

let d90 = HALF_PI;
let d180 = HALF_PI * 2;
let d270 = HALF_PI * 3;
let d360 = HALF_PI * 4;

// https://editor.p5js.org/jht9629-nyu/sketches/fWSv5uzke
// truchet tiles pause copy
