import { a_ } from '../let/a_ui.js';
import { pad_layout_update, ui_refresh, ui_patch_update } from '../core-ui/ui_patch.js';

export function patch_add(aPatch) {
  aPatch.eff_src.ipatch = a_.ui.patches.length;
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
  let eff_src = aPatch.eff_src;
  let ipatch = eff_src.ipatch;
  eff_src.eff_label = a_.effectMetas[effIndex].label;
  a_.ui.patches[ipatch] = { eff_src, eff_inits: {} };
  ui_patch_update(aPatch);
  ui_patch_eff_panes();
}

export function patch_inst_clear() {
  // All patch instances will be re-created on next draw
  a_.patch_instances = [];
}
