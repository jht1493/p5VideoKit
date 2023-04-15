// create points for a spiral from the center

export default class SpiralWalker {
  //
  // { width: 600, height: 400, d: 10 }
  constructor(props) {
    Object.assign(this, props);
  }
  points() {
    // start with single pixel box in the center
    // Left Top Right Bottom
    this.L = this.width / 2;
    this.T = this.height / 2;
    this.R = this.L;
    this.B = this.T;

    let nw = this.width / this.d;
    let nh = this.height / this.d;
    let n = nw * nh;
    // console.log('SpiralWalker nw', nw, 'mh', nh, 'n', n);

    this.offset = nw & 1 ? -this.d / 2 : 0;
    this.px = this.L;
    this.py = this.T;

    this.grow_box();

    this.pts = [];
    let d = this.d;

    let more = 1;
    while (more) {
      // move up out of box
      this.nx = this.px;
      this.ny = this.py - d;
      this.my_line({ dx: 0, dy: 0 });

      // move right
      this.nx = this.px + d;
      while (this.nx < this.R) {
        this.my_line({ dx: d, dy: 0 });
      }
      this.nx -= d;

      // move down
      this.ny += d;
      while (this.ny < this.B) {
        this.my_line({ dx: 0, dy: d });
      }
      this.ny -= d;

      // move left
      this.nx = this.px - d;
      while (this.nx > this.L) {
        this.my_line({ dx: -d, dy: 0 });
      }
      this.nx += d;

      // move up
      this.ny -= d;
      while (this.ny > this.T) {
        this.my_line({ dx: 0, dy: -d });
      }
      this.ny += d;

      this.grow_box();

      let morex = this.px >= 0 && this.px < this.width;
      let morey = this.py >= 0 && this.py < this.height;
      more = morex || morey;
      // more = morex && morey;
    }
    // console.log(this.pts)

    // first element repeated for length > 1
    if (this.pts.length > 1) this.pts.splice(0, 1);

    // console.log('SpiralWalker this.pts.length', this.pts.length);

    return this.pts;
  }

  my_line({ dx, dy }) {
    let x = this.nx;
    let y = this.ny;
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      x += this.offset;
      y += this.offset;
      this.pts.push([x, y]);
    }
    // line(this.nx, this.ny, this.px, this.py);
    this.px = this.nx;
    this.py = this.ny;
    this.nx += dx;
    this.ny += dy;
  }

  grow_box() {
    this.L -= this.d;
    this.R += this.d;
    this.T -= this.d;
    this.B += this.d;
  }
}
