//

class p5VideoKit {
  //
  constructor(p5_inst = p5.instance) {
    console.log('p5VideoKit p5_inst', p5_inst);
    vk_setup();
  }

  draw() {
    // console.log('p5VideoKit draw');
    vk_draw();
  }
}

function vk_setup() {
  ui_restore((sizeResult) => {
    console.log('vk_setup sizeResult', sizeResult);
    resizeCanvas(sizeResult.width, sizeResult.height);

    init_media_panes();

    create_ui();

    media_enum();
  });
}

function vk_draw() {
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
  let eff_src = uiPatch.eff_src;
  let { eff_label, imedia } = eff_src;
  let aeff = effectFind(eff_label);
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
    let init = { eff_src, input, media };
    init = Object.assign(init, uiPatch.eff_inits);
    inst = new aeff.factory(init);
    a_patch_instances[ipatch] = inst;
    mouse_event_check(inst);
  } else if (media) {
    // !!@ for tile - seek media up to date for live device connect/disconnect
    inst.media = media;
    inst.input = media.capture;
  }
  if (eff_src.ipipe && prior && prior.output) {
    // players must use the current value of .input
    // for pipe to work
    inst.input = prior.output;
  }
  inst.render();
  if (!eff_src.ihide && inst.output) {
    image_scaled_pad(inst.output, eff_src.pad);
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
