import { a_ } from '../let/a_ui.js?v={{vers}}';
import { ui_restore_store } from './ui_restore.js?v={{vers}}';
import { init_mediaDivs } from './create_mediaDiv.js?v={{vers}}';
import { create_ui, update_ui } from './create_ui.js?v={{vers}}';
import { media_enum } from './create_mediaDevices.js?v={{vers}}';
import { effectMeta_find, factory_prop_inits } from './effectMeta.js?v={{vers}}';
import { pad_layout_update } from '../core-ui/ui_patch.js?v={{vers}}';
import { image_scaled_pad } from '../util/image.js?v={{vers}}';
import { patch_index1 } from '../core-ui/ui_patch_eff.js?v={{vers}}';

import { PeriodTimer } from '../util/PeriodTimer.js?v={{vers}}';

p5VideoKit.prototype.PeriodTimer = PeriodTimer;

p5VideoKit.prototype.vk_setup = function (effects, settings, resolve) {
  a_.my_canvas = this.my_canvas;
  ui_restore_store(effects, settings, (sizeResult) => {
    console.log('vk_setup sizeResult', sizeResult);
    resizeCanvas(sizeResult.width, sizeResult.height);

    init_mediaDivs();

    create_ui();

    media_enum();

    this.a_initDone = 1;

    resolve();
  });
};

p5VideoKit.prototype.draw = function () {
  // console.log('p5VideoKit draw');
  if (!this.a_initDone) {
    console.log('p5VideoKit draw init not done');
    return;
  }
  this.set_background();
  stroke(255);
  if (!a_.ui.urects_count) {
    console.log('draw a_.ui.urects_count', a_.ui.urects_count);
    pad_layout_update();
  }
  let prior;
  for (let ipatch = 0; ipatch < a_.ui.patches.length; ipatch++) {
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
p5VideoKit.prototype.createEffect = function ({ eff_label, imedia, urect, props, eff_spec }) {
  if (!eff_spec) eff_spec = { eff_label, imedia, urect };
  let media;
  let input;
  media = this.mediaDivAt(imedia);
  if (media) {
    input = media.capture;
  }
  // if (typeof imedia === 'number') {
  //   // select input by number
  //   media = this.mediaDivAt(imedia);
  //   if (media) {
  //     input = media.capture;
  //   }
  // } else {
  //   input = imedia;
  // }
  let effMeta = effectMeta_find(eff_label);
  let defaultProps = factory_prop_inits(effMeta.factory);
  let videoKit = this;
  let init = Object.assign(defaultProps, { videoKit, eff_spec, input, media }, props);
  // !!@ From patch_inst_create
  //     let init = Object.assign({ videoKit, eff_spec, input, media }, eff_props);
  // console.log('createEffect effMeta', effMeta);
  return new effMeta.factory(init);
};

// videoKit.updateEffect(eff, { imedia, urect });
// p5VideoKit.prototype.updateEffect = function (eff, { imedia, urect }) {
//   // console.log('updateEffect eff', eff, 'imedia', imedia, 'urect', urect);
//   let media = this.mediaDivAt(imedia);
//   if (media) {
//     let input = media.capture;
//     eff.media = media;
//     eff.input = input;
//   }
//   eff.eff_spec.urect = urect;
// };

// videoKit.layerCopyInput(layer, { imedia, urect })
// return 1 if input ready
//
p5VideoKit.prototype.layerCopyInput = function (layer, { imedia, urect }) {
  let media = this.mediaDivAt(imedia);
  if (!media || !media.ready('layerCopyInput')) {
    // console.log('layerCopyInput NOT Ready imedia', imedia, 'media', media);
    // console.log('layerCopyInput NOT Ready imedia', imedia);
    return 0;
  }
  let input = media.capture;
  let sx = 0;
  let sy = 0;
  let sw = input.width;
  let sh = input.height;
  let { x0, y0, width, height } = urect;
  // Fill background will top right pixel from input
  layer.copy(input, sx, sy, 1, 1, x0, y0, width, height);
  let dw = height * (sw / sh);
  let x1 = Math.floor(x0 + (width - dw) / 2);
  layer.copy(input, sx, sy, sw, sh, x1, y0, dw, height);
  return 1;
};

// videoKit.layerCopyEffect( layer, eff  )
p5VideoKit.prototype.layerCopyEffect = function (layer, eff) {
  // console.log('layerCopyEffect eff', eff);
  eff.prepareOutput();
  if (!eff.output) return;
  let input = eff.output;
  let sx = 0;
  let sy = 0;
  let sw = input.width;
  let sh = input.height;
  let { x0, y0, width, height } = eff.eff_spec.urect;
  let dw = height * (sw / sh);
  let x1 = Math.floor(x0 + (width - dw) / 2);
  layer.copy(input, sx, sy, sw, sh, x1, y0, dw, height);
};

// p5VideoKit.patch_inst_create(eff_label, imedia, ipatch, eff_spec, eff_props)

// "eff_spec": {
//   "ipatch": 0,
//   "imedia": 0,
//   "eff_label": "image",
//   "urect": {
//     "width": 960,
//     "height": 540,
//     "x0": 0,
//     "y0": 0
//   }

// p5VideoKit.prototype.factoryPropInits = function (eff_label, init_props = {}) {
//   let effMeta = effectMeta_find(eff_label);
//   if (!effMeta) {
//     console.log('factory_prop_inits no effMeta');
//     return init_props;
//   }
//   // console.log('factory_prop_inits effMeta', effMeta);
//   return factory_prop_inits(effMeta.factory, init_props);
// };

// process input --> output
// videoKit.prepareOutput(eff)
p5VideoKit.prototype.prepareOutput = function (eff) {
  eff.prepareOutput();
};

// videoKit.ouputToCanvas( eff  )
p5VideoKit.prototype.ouputToCanvas = function (eff) {
  if (eff.output) {
    image_scaled_pad(eff.output, eff.eff_spec.urect);
  }
};

// let n = videoKit.mediaDivCount()
p5VideoKit.prototype.mediaDivCount = function () {
  return a_.mediaDivs.length;
};

// mediaDiv = videoKit.mediaDeviceAt(index)
p5VideoKit.prototype.mediaDivAt = function (index) {
  return a_.mediaDivs[index];
};

// {
//   "eff_spec": {
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
//   "eff_props": {
//     "factor": 20,
//     "mirror": 0
//   }
// }

p5VideoKit.prototype.draw_patch = function (ipatch, prior) {
  let uiPatch = a_.ui.patches[ipatch];
  // console.log('draw ipatch', ipatch, 'uiPatch', uiPatch);
  let eff_spec = uiPatch.eff_spec;
  let { eff_label, imedia } = eff_spec;
  // if (imedia >= a_.mediaDivs.length) {
  //   console.log('draw_patch zeroing imedia', imedia, 'a_.mediaDivs.length', a_.mediaDivs.length);
  //   imedia = 0;
  // }
  let inst = this.patch_inst_create(eff_label, imedia, ipatch, eff_spec, uiPatch.eff_props);

  if (!inst) return;
  if (eff_spec.ipipe && prior && prior.output) {
    // players must use the current value of .input
    // for pipe to work
    inst.input = prior.output;
  }
  inst.prepareOutput();
  if (!eff_spec.ihide && inst.output) {
    image_scaled_pad(inst.output, eff_spec.urect);
  }
  return inst;
};

p5VideoKit.prototype.set_background = function () {
  let bg = a_.ui.back_color;
  // console.log('set_background a_.ui.back_color', a_.ui.back_color);
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
