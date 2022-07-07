//

class p5VideoKit {
  //
  constructor(p5_inst = p5.instance) {
    // console.log('p5VideoKit p5_inst', p5_inst);
    // To work in p5 instance mode we need to use this.p0 on all globals
    //
    this.p0 = p5_inst;
    this.vk_setup();
  }
}

p5VideoKit.prototype.draw = function () {
  // console.log('p5VideoKit draw');
  if (!this.a_initDone) return;
  this.vk_draw();
};

p5VideoKit.prototype.vk_setup = function () {
  ui_restore((sizeResult) => {
    console.log('vk_setup sizeResult', sizeResult);
    resizeCanvas(sizeResult.width, sizeResult.height);

    init_mediaDivs();

    create_ui();

    media_enum();

    this.a_initDone = 1;
  });
};

p5VideoKit.prototype.vk_draw = function () {
  this.set_background();
  stroke(255);
  if (!a_ui.urects_count) {
    console.log('draw a_ui.urects_count', a_ui.urects_count);
    pad_layout_update();
  }
  let prior;
  for (let ipatch = 0; ipatch < a_ui.patches.length; ipatch++) {
    prior = this.draw_patch(ipatch, prior);
  }
  update_ui();
};

// "urect": {
//   "width": 1920,
//   "height": 1080,
//   "x0": 0,
//   "y0": 0
// }

// let eff = videoKit.createEffect( 'bestill', 1, urect, {factor: 20} )
//  imedia is mediaDiv indext or effect.output
p5VideoKit.prototype.createEffect = function (eff_label, imedia, urect, props) {
  let eff_src = { urect };
  let media;
  let input;
  if (typeof imedia === 'number') {
    // select inpu by number
    media = this.mediaDivAt(imedia);
    input = media.capture;
  } else {
    input = imedia;
  }
  let init = Object.assign({ eff_src, input, media }, props);
  let effMeta = effectMeta_find(eff_label);
  // console.log('createEffect effMeta', effMeta);
  return new effMeta.factory(init);
};

p5VideoKit.prototype.factoryPropInits = function (eff_label, init_props = {}) {
  let effMeta = effectMeta_find(eff_label);
  if (!effMeta) {
    console.log('factory_prop_inits no effMeta');
    return init_props;
  }
  // console.log('factory_prop_inits effMeta', effMeta);
  return factory_prop_inits(effMeta.factory, init_props);
};

// process input --> output
// videoKit.prepareOutput(eff)
p5VideoKit.prototype.prepareOutput = function (eff) {
  eff.prepareOutput();
};

// videoKit.imageToCanvas( eff  )
p5VideoKit.prototype.imageToCanvas = function (eff) {
  if (eff.output) {
    image_scaled_pad(eff.output, eff.eff_src.urect);
  }
};

// let n = videoKit.mediaDivCount()
p5VideoKit.prototype.mediaDivCount = function () {
  return a_mediaDivs.length;
};

// mediaDiv = videoKit.mediaDeviceAt(index)
p5VideoKit.prototype.mediaDivAt = function (index) {
  return a_mediaDivs[index];
};

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

p5VideoKit.prototype.draw_patch = function (ipatch, prior) {
  let uiPatch = a_ui.patches[ipatch];
  // console.log('draw ipatch', ipatch, 'uiPatch', uiPatch);
  let eff_src = uiPatch.eff_src;
  let { eff_label, imedia } = eff_src;
  let effMeta = effectMeta_find(eff_label);
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
    let videoKit = this;
    let init = { videoKit, eff_src, input, media };
    init = Object.assign(init, uiPatch.eff_inits);
    inst = new effMeta.factory(init);
    a_patch_instances[ipatch] = inst;
    this.mouse_event_check(inst);
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
  inst.prepareOutput();
  if (!eff_src.ihide && inst.output) {
    image_scaled_pad(inst.output, eff_src.urect);
  }
  return inst;
};

p5VideoKit.prototype.set_background = function () {
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
};

p5VideoKit.prototype.mouse_event_check = function (inst) {
  if (inst.mouseDragged) {
    this.mouseDragged_inst = inst;
  }
  if (inst.mouseReleased) {
    this.mouseReleased_inst = inst;
  }
};

p5VideoKit.prototype.mouseDragged = function () {
  if (this.mouseDragged_inst) {
    this.mouseDragged_inst.mouseDragged();
  }
};

p5VideoKit.prototype.mouseReleased = function () {
  if (this.mouseReleased_inst) {
    this.mouseReleased_inst.mouseReleased();
  }
};
