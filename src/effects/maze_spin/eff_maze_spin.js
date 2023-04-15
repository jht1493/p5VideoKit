// maze with rotating transition

import MazeSpin from './MazeSpin.js?v={{vers}}';

export default class eff_maze_spin {
  static meta_props = [
    // { prop: 'num_prop', label: 'prop1', selection: [0, 1] },
    { prop: 'ncells', selection: [9, 13, 15, 31, 63] },
    { prop: 'strokeWeight', selection: [0.5, 0.25, 0.33, 0.66, 0.75] },
    { prop: 'delta', selection: [1, -1] },
    { prop: 'do_spiral', selection: [1, 0] },
    { prop: 'do_random', selection: [1, 0, 2] },
    // do_random=0 bounce to sequential mazes
    // do_random=1 cycle sequential to random maze
    // do_random=2 to bounce between random maze
    { prop: 'do_report', selection: [0, 1, 2, 3, 4, 6, 8] },
    {},
    { prop: 'step_period', selection: [1.0, 0, 0.25, 0.5, 2.0, 3.0, 4.0] },
    { prop: 'pause_period', selection: [1.0, 0, 0.25, 0.5, 2.0, 3.0, 4.0] },
    { prop: 'video_color', selection: [0, 1] },
  ];

  constructor(props) {
    //
    Object.assign(this, props);
    // console.log('eff_maze_spin props', props);
    // console.log('eff_maze_spin meta_props', eff_maze_spin.meta_props);

    let my = {
      input: this.input,
      width: this.input.width,
      height: this.input.height,
      // ncells: this.ncells,
      // strokeWeight: this.strokeWeight,
      // delta: this.delta,
      // step_period: this.step_period,
      // pause_period: this.pause_period,
      // do_spiral: this.do_spiral,
      // do_random: this.do_random,
      // do_report: this.do_report,
    };
    for (const ent of eff_maze_spin.meta_props) {
      my[ent.prop] = this[ent.prop];
    }
    console.log('eff_maze_spin my', my);

    this.mazeSpin = new MazeSpin(my);

    this.output = this.mazeSpin.output;
  }
  prepareOutput() {
    //
    this.mazeSpin.prepareOutput();
  }
}

// https://editor.p5js.org/jht9629-gmail/sketches/IagYeywkY
// maze tiles bits
// state machine using function references - my.draw_step
// timing using SecondsTimer

// https://editor.p5js.org/jht9629-gmail/sketches/abgeEnTyf
// maze tiles count

// https://editor.p5js.org/jht9629-gmail/sketches/i2hCaC36l
// maze tiles pause

// https://editor.p5js.org/jht9629-gmail/sketches/LnPplI2CR
// truchet tiles pause

// https://editor.p5js.org/jht9629-gmail/sketches/EfQDCJ5aR
// truchet tiles array

// https://editor.p5js.org/jht9629-nyu/sketches/5TSs5XB6o
// truchet tiles rotate

// https://editor.p5js.org/jht9629-nyu/sketches/1CpIVSqp_d
// truchet tiles re-factored

// https://editor.p5js.org/jht9629-nyu/sketches/lBrb1cBQ7
// truchet tiles copy

// https://editor.p5js.org/ambikajo/sketches/cKu3Gn0Po
// truchet tiles by ambikajo
