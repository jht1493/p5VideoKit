let my_canvas;

p5.disableFriendlyErrors = true; // disables FES

function setup() {
  // pixelDensity(1); // does not appear to affect live media
  // let sz = ui_restore();
  my_canvas = createCanvas(100, 100);

  ui_restore((sizeResult) => {
    console.log('setup sizeResult', sizeResult);
    resizeCanvas(sizeResult.width, sizeResult.height);

    init_media_panes();

    create_ui();

    media_enum();
  });
}

function draw() {
  set_background();
  stroke(255);
  if (!a_ui.pads_count) {
    console.log('draw a_ui.pads_count', a_ui.pads_count);
    pad_layout_update();
  }
  let prior;
  for (let ipatch = 0; ipatch < a_ui.patches.length; ipatch++) {
    prior = draw_patch(ipatch, prior);
  }
  update_ui();
}

function draw_patch(ipatch, prior) {
  let uiPatch = a_ui.patches[ipatch];
  // console.log('draw ipatch', ipatch, 'uiPatch', uiPatch);
  let isrc = uiPatch.isrc;
  let { effect, imedia } = isrc;
  let aeff = effect_label(effect);
  let media = a_media_panes[imedia];
  if (!media) {
    // console.log('NO media imedia', imedia);
  } else if (!media.ready()) {
    console.log('NOT media.ready imedia', imedia);
    let inst = a_patch_instances[ipatch];
    // console.log('NOT media.ready inst', inst);
    if (inst && inst.livem_step) {
      console.log('livem_step imedia', imedia);
      inst.livem_step();
    }
    return;
  }
  let inst = a_patch_instances[ipatch];
  if (!inst) {
    if (!media) {
      console.log('NO media for init imedia', imedia);
      return;
    }
    let input = media.capture;
    let init = { isrc, input, media };
    init = Object.assign(init, uiPatch.eff);
    inst = new aeff.eff(init);
    a_patch_instances[ipatch] = inst;
    mouse_event_check(inst);
  } else if (media) {
    // !!@ for tile - seek media up to date for live device connect/disconnect
    inst.media = media;
    inst.input = media.capture;
  }
  if (isrc.ipipe && prior && prior.output) {
    // players must use the current value of .input
    // for pipe to work
    inst.input = prior.output;
  }
  inst.render();
  if (!isrc.ihide && inst.output) {
    image_scaled_pad(inst.output, isrc.pad);
  }
  return inst;
}

function set_background() {
  let bg = a_ui.back_color;
  // console.log('set_background a_ui.back_color', a_ui.back_color);
  if (!bg) {
    clear();
    return;
  }
  if (bg < 0) {
    let src = patch_index1(-bg);
    if (src && src.avg_color) {
      bg = src.avg_color;
    }
  }
  background(bg);
}

function mouse_event_check(inst) {
  if (inst.mouseDragged) {
    mouseDragged_inst = inst;
  }
  if (inst.mouseReleased) {
    mouseReleased_inst = inst;
  }
}
let mouseDragged_inst;
function mouseDragged() {
  if (mouseDragged_inst) {
    mouseDragged_inst.mouseDragged();
  }
}
let mouseReleased_inst;
function mouseReleased() {
  if (mouseReleased_inst) {
    mouseReleased_inst.mouseReleased();
  }
}

// https://editor.p5js.org/jht1493/sketches/9AlTdNafC
// p5LiveMedia video dice twins mir

// https://editor.p5js.org/jht1493/sketches/NPAHU279L
// p5LiveMedia video dice twins

// https://editor.p5js.org/jht1493/sketches/0Oj2yPY7P
// p5LiveMedia video dice 1

// https://editor.p5js.org/shawn/sketches/jZQ64AMJc
// p5LiveMedia Test Video
// https://github.com/vanevery/p5LiveMedia
