class eff_delaunay {
  static meta_props = {
    dcell: [50, 5, 10, 20, 30, 40, 50, 100],
    period: [30, 0, 0.5, 1, 2, 5, 10, 20, 30, 60],
    type: ['triangle', 'rect', 'circle', 'ellipse'],
    alpha: [255, 230, 180, 100, 10, 5, 2, 1],
    gray: [0, 1],
    // rate: ['frame', 'line', 'ncell']
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    image_copy(this.img, this.input);
    while (!this.draw_step()) {}
    this.period_timer.check(() => {
      this.output.clear();
      this.init_points();
    });
  }
  init() {
    this.period_timer = new period_timer(this.period);
    let w = this.input.width;
    let h = this.input.height;
    if (!this.img) this.img = createImage(w, h);
    if (!this.output) this.output = createGraphics(w, h);
    this.output.noStroke();
    this.index = 0;
    this.cindex = 2;
    this.init_points(this);
  }
  init_points() {
    let w = this.input.width;
    let h = this.input.height;
    let points = [];
    let n = this.dcell * this.dcell;
    for (let i = 0; i < n; i++) {
      let x1 = Math.floor(random(0, w));
      let y1 = Math.floor(random(0, h));
      points.push([x1, y1]);
    }
    points.push([0, 0]);
    points.push([w, 0]);
    points.push([0, h]);
    points.push([w, h]);
    let delaunay = new Delaunay(points);
    this.points = delaunay.triangulate();
    switch (this.type) {
      case 'circle':
        this.drawf = this.draw_circle;
        break;
      case 'ellipse':
        this.drawf = this.draw_ellipse;
        break;
      case 'rect':
        this.drawf = this.draw_rect;
        break;
      default:
        this.drawf = this.draw_triangle;
        break;
    }
  }
  draw_step() {
    let layer = this.output;
    let img = this.img;
    let points = this.points;
    let [x1, y1] = points[this.index];
    let [x2, y2] = points[this.index + 1];
    let [x3, y3] = points[this.index + 2];
    let [x, y] = points[this.index + this.cindex];
    let col = img.get(x, y);
    col[3] = this.alpha;
    if (this.gray) {
      let avg = (col[0] + col[1] + col[3]) / 3;
      col[0] = avg;
      col[1] = avg;
      col[2] = avg;
    }
    layer.fill(col);
    this.drawf(layer, x1, y1, x2, y2, x3, y3);
    this.index = (this.index + 3) % points.length;
    if (this.index == 0) {
      return 1;
    }
    return 0;
  }
  draw_circle(layer, x1, y1, x2, y2, x3, y3) {
    let xt = min(x1, x2, x3);
    let yt = min(y1, y2, y2);
    let xb = max(x1, x2, x3);
    let yb = max(y1, y2, y3);
    let dx = xb - xt;
    let dy = yb - yt;
    let d = max(dx, dy);
    layer.circle(xt + dx / 2, yt + dy / 2, d);
  }
  draw_ellipse(layer, x1, y1, x2, y2, x3, y3) {
    let xt = min(x1, x2, x3);
    let yt = min(y1, y2, y2);
    let xb = max(x1, x2, x3);
    let yb = max(y1, y2, y3);
    let dx = xb - xt;
    let dy = yb - yt;
    layer.ellipse(xt + dx / 2, yt + dy / 2, dx, dy);
  }
  draw_rect(layer, x1, y1, x2, y2, x3, y3) {
    let xt = min(x1, x2, x3);
    let yt = min(y1, y2, y2);
    let xb = max(x1, x2, x3);
    let yb = max(y1, y2, y3);
    layer.rect(xt, yt, xb - xt, yb - yt);
  }
  draw_triangle(layer, x1, y1, x2, y2, x3, y3) {
    layer.triangle(x1, y1, x2, y2, x3, y3);
  }
}
