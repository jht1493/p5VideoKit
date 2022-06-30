function ui_patch_layout() {
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
    aSel.selected(a_ui.patch_layout);
    aSel.changed(function () {
      let val = this.value();
      // console.log('ui_patch_layout', val);
      a_ui_set('patch_layout', val);
      pad_layout_update();
      ui_reset();
    });
  }
  div.child(createSpan(' Store: '));
  {
    let aSel = createSelect();
    div.child(aSel);
    aSel.option('Store-A');
    aSel.option('Store-B');
    aSel.option('Store-C');
    aSel.option('Store-D');
    aSel.selected(a_store_name);
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
    // console.log('a_ui.setting', a_ui.setting);
    let sii = 0;
    for (let ii = 0; ii < a_settings.length; ii++) {
      let ent = a_settings[ii];
      aSel.option(ent.setting, ii);
      // console.log('ii', ii, 'label', ent.label);
      if (ent.setting === a_ui.setting) {
        sii = ii;
      }
    }
    aSel.selected(sii);
    aSel.changed(function () {
      let ii = parseFloat(this.value());
      let ent = a_settings[ii];
      store_restore_from(ent);
    });
  }
  createElement('br');
}

function ui_patch_buttons() {
  createButton('Add Patch').mousePressed(function () {
    let newPatch = { isrc: { ipatch: 0, imedia: 1, effect: 'show' } };
    patch_add(newPatch);
  });
  createButton('Remove Patch').mousePressed(function () {
    patch_remove_last();
  });
  createElement('br');
}

// Rebuild dynamic elements of ui
function ui_refresh() {
  if (a_hideui) return;
  ui_live_selection();
  ui_patch_eff_panes();
}

// Write out all patches to local storage
function ui_patch_save_all() {
  a_ui_set('patches', a_ui.patches);
}

// Write out all patches to local storage
// and reset given patch
function ui_patch_update(aPatch) {
  // console.log('ui_patch_update');
  a_ui_set('patches', a_ui.patches);
  if (!aPatch) return;
  let ipatch = aPatch.isrc.ipatch;
  // console.log('ui_patch_update ipatch', ipatch);
  let inst = a_patch_instances[ipatch];
  // console.log('ui_patch_update inst', inst);
  if (inst && inst.remove_eff) {
    inst.remove_eff();
  }
  a_patch_instances[ipatch] = null;
}

function pad_layout_update() {
  let layout;
  console.log('pad_layout_update a_ui.canvas_resize_ref |' + a_ui.canvas_resize_ref + '|');
  if (a_ui.canvas_resize_ref) {
    pads_resize_set_scale();
  } else {
    if (a_ui.pads_lock) {
      console.log('pad_layout_update a_ui.pads_lock');
      return;
    }
    layout = new pad_layout();
  }
  let pads_count = 0;
  let pad;
  for (let ipatch = 0; ipatch < a_ui.patches.length; ipatch++) {
    let uiPatch = a_ui.patches[ipatch];
    if (uiPatch) {
      let isrc = uiPatch.isrc;
      if (layout) {
        pad = layout.next();
      } else if (isrc.pad_ref) {
        pad = Object.assign({}, isrc.pad_ref);
        console.log('pad_layout_ assign pad', JSON.stringify(pad));
        pads_resize_pad(pad);
      } else {
        // !!@ Error no pad_ref
        console.log('!!@ pad_layout_update pad_ref missing ipatch', ipatch, 'uiPatch', JSON.stringify(uiPatch));
      }
      isrc.pad = pad;
      pads_count++;
    }
    // console.log('pad_layout_update uiPatch', JSON.stringify(uiPatch));
  }
  a_ui_set('patches', a_ui.patches);
  a_ui_set('pads_count', pads_count);
  // pads_resize_save();
}

function pads_resize_set_scale() {
  let refsz = str_to_width_height(a_ui.canvas_resize_ref);
  let tosz = str_to_width_height(a_ui.canvas_size);
  a_ui.pads_scale = tosz.width / refsz.width;
  console.log('pads_resize_set_scale a_ui.canvas_resize_ref', a_ui.canvas_resize_ref);
  console.log('pads_resize_set_scale a_ui.canvas_size', a_ui.canvas_size);
  console.log('pads_resize_set_scale pads_scale', a_ui.pads_scale);
}

function pads_resize_pad(pad) {
  for (let prop in pad) {
    pad[prop] = Math.floor(pad[prop] * a_ui.pads_scale);
  }
}
