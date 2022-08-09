export default class eff_text {
  static meta_props = {
    size: [16, 30, 40, 45, 60, 90],
    alpha: [255, 0, 10, 50, 100, 200, 255],
    back_color: ['clear', 'black', 'white', 'gray', 'red', 'green', 'yellow'],
    fore_color: ['black', 'white', 'gray', 'red', 'green', 'yellow', 'rgb(255,255,0)', 'rgb(0,255,255)', '#FFD700'],
    x_margin: [20, 40],
    y_margin: [4, 8, 16],
    _text: [
      'W.E.B Du Bois: "The problem of the 20th Century is the problem of the color-line"',
      'African American Photographs assembled by W.E.B Du Bois for the 1900 Paris Exposition',
      'Photographs of African American ',
      'assembled by W.E.B Du Bois and Thomas J. Calloway',
      'for the 1900 Paris Exposition',
    ],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    this.output.tint(255, this.alpha);
    image_scaled_pad(this.output, this.eff_spec.urect);
    this.output.tint(255);
  }
  init() {
    this.output = createGraphics(this.eff_spec.urect.width, this.eff_spec.urect.height);
    this.draw_text();
  }
  draw_text() {
    let y_marghin = this.y_margin;
    let x_margin = this.x_margin;
    let str = this.text;
    let layer = this.output;
    layer.textSize(this.size);
    let ta = layer.textAscent();
    let td = layer.textDescent();
    let tw = layer.textWidth(str) + x_margin * 2;
    // fill('black');
    let hi = ta + td + y_marghin * 2;
    let cx = (this.eff_spec.urect.width - tw) / 2;
    if (cx < 0) cx = 0;
    let x = this.eff_spec.urect.x0 + cx;
    let y = this.eff_spec.urect.y0 + this.eff_spec.urect.height - hi;
    if (this.back_color === 'clear') {
      layer.clear();
    } else {
      layer.noStroke();
      layer.fill(this.back_color);
      layer.rect(x, y, tw, hi);
    }
    // fill('white');
    x += x_margin;
    y += ta + y_marghin;
    layer.fill(this.fore_color);
    // layer.fill('red');
    layer.text(str, x, y);
    // this.image = layer.get();
    // this.image.mask(this.image);
    // console.log('tw', tw, 'cx', cx);
  }
}
