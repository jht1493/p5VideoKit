//

class p5VideoKit {
  //
  constructor(p5_inst = p5.instance) {
    // console.log('p5VideoKit p5_inst', p5_inst);
    // To work in p5 instance mode we need to use this.p0 on all globals
    //
    this.p0 = p5_inst;
    vk_setup();
  }

  draw() {
    // console.log('p5VideoKit draw');
    if (!a_initDone) return;
    vk_draw();
  }

  // let n = videoKit.mediaDivCount()
  mediaDivCount() {
    return a_mediaDivs.length;
  }

  // mediaDiv = videoKit.mediaDeviceAt(index)
  mediaDivAt(index) {
    return a_mediaDivs[index];
  }

  // {
  //   "eff_src": {
  //     "ipatch": 2,
  //     "imedia": 0,
  //     "eff_label": "bestill",
  //     "urect": {
  //       "width": 1920,
  //       "height": 1080,
  //       "x0": 0,
  //       "y0": 0
  //     }
  //   },
  //   "eff_inits": {
  //     "factor": 20,
  //     "mirror": 0
  //   }
  // }

  // let eff = videoKit.createEffect( 'bestill', 1, urect, {factor: 20} )
  //
  createEffect(eff_label, imedia, urect, props) {
    let eff_src = { urect };
    let media = this.mediaDivAt(imedia);
    let input = media.capture;
    let init = Object.assign({ eff_src, input, media }, props);
    let effRef = effectMeta_find(eff_label);
    return new effRef.factory(init);
  }

  // process input --> output
  // videoKit.prepareOutput(eff)
  prepareOutput(eff) {
    eff.render();
  }

  // videoKit.imageToCanvas( eff  )
  imageToCanvas(eff) {
    image_scaled_pad(eff.output, eff.eff_src.urect);
  }
}

let a_initDone = 0;

function vk_setup() {
  ui_restore((sizeResult) => {
    console.log('vk_setup sizeResult', sizeResult);
    resizeCanvas(sizeResult.width, sizeResult.height);

    init_mediaDivs();

    create_ui();

    media_enum();

    a_initDone = 1;
  });
}

function vk_draw() {
  set_background();
  stroke(255);
  if (!a_ui.urects_count) {
    console.log('draw a_ui.urects_count', a_ui.urects_count);
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
  let aeff = effectMeta_find(eff_label);
  let media = a_mediaDivs[imedia];
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
    image_scaled_pad(inst.output, eff_src.urect);
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
