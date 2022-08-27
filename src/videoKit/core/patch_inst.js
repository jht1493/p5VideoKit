import { a_ } from '../let/a_state.js?v={{vers}}';
import { pad_layout_update, ui_refresh, ui_patch_update } from '../core-ui/ui_patch_bar.js?v={{vers}}';
import { ui_div_empty } from '../core-ui/ui_tools.js?v={{vers}}';
import { ui_patch_eff_panes } from '../core-ui/ui_patch_eff.js?v={{vers}}';
import { effectMeta_find } from './effectMeta.js?v={{vers}}';

p5VideoKit.prototype.patch_inst_create = function (eff_label, imedia, ipatch, eff_spec, eff_props) {
  let effMeta = effectMeta_find(eff_label);
  let media = a_.mediaDivs[imedia];
  if (!media) {
    // console.log('NO media imedia', imedia);
  } else if (!media.ready('patch_inst')) {
    // if (!media.notReadyWarningIssued) {
    //   console.log('imedia', imedia, 'NOT media.ready');
    //   media.notReadyWarningIssued = 1;
    // }
    let inst = a_.patch_instances[ipatch];
    // console.log('NOT media.ready inst', inst);
    if (inst && inst.livem_step) {
      console.log('livem_step imedia', imedia);
      inst.livem_step();
    }
    return;
  }
  // else if (media.notReadyWarningIssued) {
  //   console.log('imedia', imedia, 'media.ready');
  //   media.notReadyWarningIssued = 0;
  // }
  let inst = a_.patch_instances[ipatch];
  if (!inst) {
    if (!media) {
      // console.log('NO media for init imedia', imedia);
      return;
    }
    // !!@ TODO replace with createEffect
    let input = media.capture;
    let videoKit = this;
    let init = Object.assign({ videoKit, eff_spec, input, media }, eff_props);
    inst = new effMeta.factory(init);
    a_.patch_instances[ipatch] = inst;
    this.mouse_event_check(inst);
  } else if (media) {
    // !!@ for tile - seek media up to date for live device connect/disconnect
    inst.media = media;
    inst.input = media.capture;
  }
  return inst;
};

// p5VideoKit.prototype.createEffect = function ({ eff_label, imedia, urect, props, eff_spec }) {

export function patch_add(aPatch) {
  aPatch.eff_spec.ipatch = a_.ui.patches.length;
  a_.ui.patches.push(aPatch);
  ui_patch_update(aPatch);
  ui_refresh();
  pad_layout_update();
}

export function patch_remove_ipatch(ipatch) {
  patch_remove_at(ipatch);
}

// Remove patch by index
function patch_remove_at(ipatch) {
  // Don't delete first patch
  // if (ipatch === 0) {
  //   return;
  // }
  patch_inst_update(ipatch);
  a_.ui.patches.splice(ipatch, 1);
  a_.patch_instances.splice(ipatch, 1);
  ui_div_empty('patch_' + ipatch);
  ui_patch_update();
  ui_refresh();
  pad_layout_update();
}

// Remove the last patch
function patch_remove_last() {
  let ipatch = a_.ui.patches.length - 1;
  patch_remove_at(ipatch);
}

export function patch_update_effIndex(aPatch, effIndex) {
  let eff_spec = aPatch.eff_spec;
  let ipatch = eff_spec.ipatch;
  eff_spec.eff_label = a_.effectMetas[effIndex].label;
  a_.ui.patches[ipatch] = { eff_spec, eff_props: {} };
  ui_patch_update(aPatch);
  ui_patch_eff_panes();
}

export function patch_inst_clear() {
  // All patch instances will be re-created on next draw
  for (let ipatch = 0; ipatch < a_.patch_instances.length; ipatch++) {
    patch_inst_update(ipatch);
  }
  a_.patch_instances = [];
}

export function patch_inst_update(ipatch) {
  let inst = a_.patch_instances[ipatch];
  // console.log('ui_patch_update inst', inst);
  // Clean up old instance before it's zaped
  patch_inst_deinit(inst);
}

export function patch_inst_deinit(inst) {
  if (!inst) return;
  if (inst.deinit) {
    inst.deinit();
  } else if (inst.output && inst.output.remove) {
    console.log('patch_inst_deinit REMOVING inst.output', inst.output);
    inst.output.remove();
  }
}
