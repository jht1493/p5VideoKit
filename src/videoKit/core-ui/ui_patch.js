import { a_ } from '../let/a_ui.js?v=120';
import { ui_div_empty, ui_backcolor } from '../util/ui_base.js?v=120';
import { ui_patch_eff_panes } from '../core-ui/ui_patch_eff.js?v=120';
import { ui_live_selection } from '../core-ui/ui_live.js?v=120';
import { PadLayout } from '../util/PadLayout.js?v=120';
import { ui_prop_set } from '../core/ui_restore.js?v=120';
import { store_restore_from } from '../core/store_url_parse.js?v=120';
import { str_to_width_height } from '../core-ui/ui_canvas.js?v=120';
import { store_export_json, store_export_url } from '../core/store_url_parse.js?v=120';
import { patch_add } from '../core/patch_inst.js?v=120';
import { patch_inst_clear } from '../core/patch_inst.js?v=120';

export function ui_patch_layout() {
  let div = ui_div_empty('ipatch_layout');
  div.child(createSpan('Layout: '));
  {
    let aSel = createSelect();
    div.child(aSel);
    aSel.option('Single');
    aSel.option('2x1');
    aSel.option('2x2');
    aSel.option('2x3');
    aSel.option('3x2');
    aSel.option('3x3');
    aSel.option('3x1');
    aSel.option('4x4');
    aSel.selected(a_.ui.patch_layout);
    aSel.changed(function () {
      let val = this.value();
      // console.log('ui_patch_layout', val);
      ui_prop_set('patch_layout', val);
      pad_layout_update();
      patch_inst_clear();
    });
  }
  ui_backcolor(div);

  div.child(createSpan(' Store: '));
  {
    let aSel = createSelect();
    div.child(aSel);
    aSel.option('Store-A');
    aSel.option('Store-B');
    aSel.option('Store-C');
    aSel.option('Store-D');
    aSel.selected(a_.store_name);
    aSel.changed(function () {
      let val = this.value();
      store_name_update(val);
    });
  }
  {
    let aBtn = createButton('Export').mousePressed(function () {
      store_export_json();
    });
    div.child(aBtn);
  }
  {
    let aBtn = createButton('URL').mousePressed(function () {
      store_export_url();
    });
    div.child(aBtn);
  }
  div.child(createSpan(' Setting: '));
  {
    let aSel = createSelect();
    div.child(aSel);
    // console.log('a_.ui.setting', a_.ui.setting);
    let sii = 0;
    for (let ii = 0; ii < a_.settings.length; ii++) {
      let ent = a_.settings[ii];
      aSel.option(ent.setting, ii);
      // console.log('ii', ii, 'label', ent.label);
      if (ent.setting === a_.ui.setting) {
        sii = ii;
      }
    }
    aSel.selected(sii);
    aSel.changed(function () {
      let ii = parseFloat(this.value());
      let ent = a_.settings[ii];
      store_restore_from(ent);
    });
  }
}

export function ui_patch_buttons() {
  createButton('Add Patch').mousePressed(function () {
    let newPatch = { eff_spec: { ipatch: 0, imedia: 1, eff_label: 'show' } };
    patch_add(newPatch);
  });
  // createButton('Remove Patch').mousePressed(function () {
  //   patch_remove_last();
  // });
  createElement('br');
}

// Rebuild dynamic elements of ui
export function ui_refresh() {
  if (a_.hideui) return;
  ui_live_selection();
  ui_patch_eff_panes();
}

// Write out all patches to local storage
function ui_patch_save_all() {
  ui_prop_set('patches', a_.ui.patches);
}

// Write out all patches to local storage
// and reset given patch
export function ui_patch_update(aPatch) {
  // console.log('ui_patch_update');
  ui_prop_set('patches', a_.ui.patches);
  if (!aPatch) return;
  let ipatch = aPatch.eff_spec.ipatch;
  // console.log('ui_patch_update ipatch', ipatch);
  let inst = a_.patch_instances[ipatch];
  // console.log('ui_patch_update inst', inst);
  if (inst && inst.remove_eff) {
    inst.remove_eff();
  }
  a_.patch_instances[ipatch] = null;
}

export function pad_layout_update() {
  let layout;
  // console.log('pad_layout_update a_.ui.canvas_resize_ref |' + a_.ui.canvas_resize_ref + '|');
  if (a_.ui.canvas_resize_ref) {
    pads_resize_set_scale();
  } else {
    if (a_.ui.urects_lock) {
      console.log('pad_layout_update a_.ui.urects_lock');
      return;
    }
    layout = new PadLayout();
  }
  let urects_count = 0;
  let urect;
  for (let ipatch = 0; ipatch < a_.ui.patches.length; ipatch++) {
    let uiPatch = a_.ui.patches[ipatch];
    if (uiPatch) {
      let eff_spec = uiPatch.eff_spec;
      if (eff_spec.ipatch != ipatch) {
        // ipatch change due to deletes
        console.log('!!@ eff_spec.ipatch', eff_spec.ipatch, 'ipatch', ipatch);
        eff_spec.ipatch = ipatch;
      }
      if (layout) {
        urect = layout.next();
      } else if (eff_spec.urect_ref) {
        urect = Object.assign({}, eff_spec.urect_ref);
        console.log('pad_layout_ assign pad', JSON.stringify(urect));
        pads_resize_pad(urect);
      } else {
        // !!@ Error no urects_ref
        console.log('!!@ pad_layout_update urects_ref missing ipatch', ipatch, 'uiPatch', JSON.stringify(uiPatch));
      }
      eff_spec.urect = urect;
      urects_count++;
    }
    // console.log('pad_layout_update uiPatch', JSON.stringify(uiPatch));
  }
  ui_prop_set('patches', a_.ui.patches);
  ui_prop_set('urects_count', urects_count);
  // pads_resize_save();
}

function pads_resize_set_scale() {
  let refsz = str_to_width_height(a_.ui.canvas_resize_ref);
  let tosz = str_to_width_height(a_.ui.canvas_size);
  a_.ui.urects_scale = tosz.width / refsz.width;
  console.log('pads_resize_set_scale a_.ui.canvas_resize_ref', a_.ui.canvas_resize_ref);
  console.log('pads_resize_set_scale a_.ui.canvas_size', a_.ui.canvas_size);
  console.log('pads_resize_set_scale urects_scale', a_.ui.urects_scale);
}

function pads_resize_pad(urect) {
  for (let prop in urect) {
    urect[prop] = Math.floor(urect[prop] * a_.ui.urects_scale);
  }
}
