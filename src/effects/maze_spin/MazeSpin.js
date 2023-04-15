// maze with rotating transition

import SpiralWalker from './SpiralWalker.js?v={{vers}}';
import SecondsTimer from './SecondsTimer.js?v={{vers}}';
import { report_1ofn, div_report } from './report.js?v={{vers}}';
import { array_zero, array_add, array_random } from './array.js?v={{vers}}';

export default class MazeSpin {
  // this.ncells
  // this.width = this.width
  // this.height = this.height
  // this.strokeWeight = 0.5;
  // this.delta = 1;
  // this.step_period = 1.0;
  // this.pause_period = 1.0; // 0.5;
  // this.do_random = 0;
  // this.do_spiral
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
    this.draw_step = 'draw_maze_step';

    report_1ofn(this);
    div_report(this, this.target, 'setup');
  }

  prepareOutput() {
    // console.log('MazeSpin prepareOutput');

    this[this.draw_step]();
  }

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

  draw_maze() {
    this.output.background(220);
    let tangle = HALF_PI * this.timer.progress();
    let half = this.d / 2;
    for (let index = 0; index < this.pts.length; index++) {
      let [x, y] = this.pts[index];
      let now = this.now[index];
      let target = this.target[index];
      let angle = now == target ? 0 : tangle;
      if (now) {
        this.drawLeft(x, y, this.d, half, angle);
      } else {
        this.drawRight(x, y, this.d, half, angle);
      }
    }
  }

  draw_maze_step() {
    this.draw_maze();

    if (this.timer.arrived()) {
      array_add(this.now, this.delta);
      array_add(this.next, this.delta);

      if (!this.do_random) {
        div_report(this, this.target, 'draw_maze_step');
      }

      this.timer.setPeriod(this.pause_period);

      this.draw_step = 'draw_maze_pause';
    }
  }

  draw_maze_pause() {
    if (this.timer.arrived()) {
      this.timer.setPeriod(this.step_period);

      this.draw_step = this.do_random ? 'draw_maze_random' : 'draw_maze_step';
    }
  }

  draw_maze_random() {
    array_random(this.random);
    this.target = this.random;

    div_report(this, this.target, 'draw_maze_random');

    this.timer.setPeriod(this.step_period);

    this.draw_step = 'draw_maze_random_step';
  }

  draw_maze_random_step() {
    this.draw_maze();

    if (this.timer.arrived()) {
      let now_save = this.now;
      this.now = this.target;
      this.target = now_save;

      // div_report(this, this.target, 'draw_maze_random_step');

      this.timer.setPeriod(this.pause_period);

      this.draw_step = 'draw_maze_random_pause';
    }
  }

  draw_maze_random_pause() {
    if (this.timer.arrived()) {
      this.timer.setPeriod(this.step_period);

      this.draw_step = 'draw_maze_random_pause_step';
    }
  }

  draw_maze_random_pause_step() {
    this.draw_maze();

    if (this.timer.arrived()) {
      this.now = this.target;
      this.target = this.next;

      div_report(this, this.target, 'draw_maze_random_pause_step');

      this.timer.setPeriod(this.pause_period);

      this.draw_step = 'draw_maze_random_pause2';
    }
  }

  draw_maze_random_pause2() {
    if (this.timer.arrived()) {
      this.timer.setPeriod(this.step_period);

      this.draw_step = 'draw_maze_step';
    }
  }

  drawLeft(x, y, len, half, angle) {
    this.output.push();
    this.output.translate(x + half, y + half);
    this.output.rotate(angle);
    this.output.line(-half + 0, -half + 0, -half + len, -half + len);
    this.output.pop();
  }

  drawRight(x, y, len, half, angle) {
    this.output.push();
    this.output.translate(x + half, y + half);
    this.output.rotate(angle);
    this.output.line(-half + len, -half + 0, -half + 0, -half + len);
    this.output.pop();
  }
}
