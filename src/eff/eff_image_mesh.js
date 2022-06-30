class eff_image_mesh {
  static meta_props = {
    image_patch: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    align: ['center', 'left', 'right', 'none'],
    alpha: [255, 230, 180, 100, 10],
    mar_h: [0, 0, 2, 5, 10],
    draw: ['mesh', 'dots', 'rects', 'tris', 'crop'],
    slen: [5, 1, 2, 3, 4, 5, 10],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    //
    let nthis = patch_index1(this.image_patch);
    // console.log('eff_image_mesh nthis.predictions', nthis.predictions);
    // console.log('eff_image_mesh nthis.img', nthis.img);
    if (nthis && nthis.predictions && nthis.img) {
      this.ddraw = this.draw;
      let layer = this.output;
      layer.clear();
      layer.noStroke();
      // layer.strokeWeight(0);
      face_mesh_draw(this, nthis.img, nthis.predictions);
    }
  }
  init() {
    this.from = 0; // Only use first face detected
    this.to = 1;
    this.avg_color = [255, 255, 255, 255];
    this.output = createGraphics(this.isrc.pad.width, this.isrc.pad.height);
  }
}
