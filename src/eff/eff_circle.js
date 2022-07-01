class eff_circle {
  static meta_props = {
    per_frame: [5, 10, 50, 100, 200, 1000],
    ntry: [50, 100, 200, 500, 1000, 2000],
    period: [0, 1, 2, 5, 10, 20, 30, 60],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    image_copy(this.src, this.input);
    this.period_timer.check(() => {
      this.output.clear();
    });
    this.draw_circles();
  }
  init() {
    this.period_timer = new period_timer(this.period);
    this.src = createImage(this.input.width, this.input.height);
    this.output = createGraphics(this.input.width, this.input.height);
    this.circles = [];
    this.output.noStroke();
  }
  draw_circles() {
    // All the circles
    let circles = this.circles;
    for (var i = 0; i < circles.length; i++) {
      var c = circles[i];
      c.show();
      // Is it a growing one?
      if (c.growing) {
        c.grow();
        // Does it overlap any previous circles?
        for (var j = 0; j < circles.length; j++) {
          var other = circles[j];
          if (other != c) {
            var d = dist(c.x, c.y, other.x, other.y);
            if (d - 1 < c.r + other.r) {
              c.growing = false;
            }
          }
        }
        // Is it stuck to an edge?
        if (c.growing) {
          c.growing = !c.edges();
        }
      }
    }
    // Try to make a certain number of new circles each frame
    let target = this.per_frame;
    // How many
    var count = 0;
    // Try N times
    for (var i = 0; i < this.ntry; i++) {
      if (this.addCircle()) {
        count++;
      }
      // We made enough
      if (count == target) {
        break;
      }
    }
    // We can't make any more
    if (count < 1) {
      // noLoop();
      //console.log('finished');
      this.circles = [];
      // this.output.clear();
    }
  }
  // Add one circle
  addCircle() {
    let circles = this.circles;
    let output = this.output;
    let width = output.width;
    let height = output.height;
    // Here's a new circle
    var newCircle = new Circle(random(width), random(height), 1);
    newCircle.eff = this;
    // Is it in an ok spot?
    for (var i = 0; i < circles.length; i++) {
      var other = circles[i];
      var d = dist(newCircle.x, newCircle.y, other.x, other.y);
      if (d < other.r + 4) {
        newCircle = undefined;
        break;
      }
    }
    // If it is, add it
    if (newCircle) {
      circles.push(newCircle);
      return true;
    } else {
      return false;
    }
  }
}

// Circle object
class Circle {
  constructor(x, y, r) {
    this.growing = true;
    this.x = x;
    this.y = y;
    this.r = r;
  }
  // Check stuck to an edge
  edges() {
    let output = this.eff.output;
    let width = output.width;
    let height = output.height;
    return this.r > width - this.x || this.r > this.x || this.r > height - this.y || this.r > this.y;
  }
  // Grow
  grow() {
    this.r += 0.5;
  }
  // Show
  show() {
    // noFill();
    // strokeWeight(1.5);
    // stroke(255, 0, 175, 225);
    let output = this.eff.output;
    let src = this.eff.src;
    let col = src.get(this.x, this.y);
    output.fill(col);
    output.ellipse(this.x, this.y, this.r * 2);
  }
}

// https://editor.p5js.org/jht1493/sketches/uQPlEmzD4
// Circle Packing Data Visualization
