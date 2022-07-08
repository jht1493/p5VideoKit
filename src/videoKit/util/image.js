function image_copy(image, src) {
  image.copy(src, 0, 0, src.width, src.height, 0, 0, image.width, image.height);
}
// image.copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)

// Copy the pixels from src to dest.
// Use when src has alpha that you want to preserve in dest
function image_move(dest, src) {
  dest.loadPixels();
  src.loadPixels();
  let dpixels = dest.pixels;
  let spixels = src.pixels;
  let n = dpixels.length;
  if (n != spixels.length) {
    console.log('image_move !!@ lengths differ', n, spixels.length);
    return;
  }
  while (n-- > 0) dpixels[n] = spixels[n];
  dest.updatePixels();
}

function image_scaled(img) {
  let w = width;
  let h = height;
  let w2 = img.width;
  let h2 = img.height;
  let hw = h2 / w2;
  if (hw < 1) {
    h = w * hw;
  } else {
    w = h / hw;
  }
  image(img, 0, 0, w, h, 0, 0, w2, h2);
}

export function image_scaled_pad(img, urect, flush_right) {
  if (!urect) urect = { width, height, x0: 0, y0: 0 };
  let pw = urect.width;
  let ph = urect.height;
  let iw = img.width;
  let ih = img.height;
  let rr = ih / iw;
  if (ph == ih) {
    // If pad height matches image don't scale - for data-posenet
  } else if (rr < 1) {
    ph = pw * rr;
  } else {
    pw = ph / rr;
  }
  // console.log('urect.width', urect.width, 'iw', iw, 'ih', ih, 'pw', pw, 'ph', ph);
  let dx = urect.x0;
  let dy = urect.y0;
  if (flush_right) {
    dx = dx + (urect.width - pw) / 2;
  }
  image(img, dx, dy, pw, ph, 0, 0, iw, ih);
}

function layer_image_scaled_pad(layer, img, urect, align_center) {
  if (!img) return;
  if (!urect) urect = { width, height, x0: 0, y0: 0 };
  let pw = urect.width;
  let ph = urect.height;
  let iw = img.width;
  let ih = img.height;
  let rr = ih / iw;
  let dx = 0;
  let dy = 0;
  if (rr < 1) {
    ph = pw * rr;
    if (align_center) {
      dy = dy + (urect.height - ph) / 2;
    }
  } else {
    pw = ph / rr;
    if (align_center) {
      dx = dx + (urect.width - pw) / 2;
    }
  }
  // console.log('layer iw', iw, 'ih', ih, 'pw', pw, 'ph', ph);
  layer.clear();
  layer.image(img, dx, dy, pw, ph, 0, 0, iw, ih);
}

function image_scaled_pad_source(img, urect, src) {
  console.log('image_scaled_pad_source src', JSON.stringify(src));
  if (!urect) urect = { width, height, x0: 0, y0: 0 };
  let pw = urect.width;
  let ph = urect.height;
  let iw = img.width;
  let ih = img.height;
  let rr = ih / iw;
  if (rr < 1) {
    ph = pw * rr;
  } else {
    pw = ph / rr;
  }
  let dx = urect.x0;
  let dy = urect.y0;
  let sx = src.x;
  let sy = src.y;
  let sw = src.width;
  let sh = src.height;
  image(img, dx, dy, pw, ph, sx, sy, sw, sh);
}

// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight])
