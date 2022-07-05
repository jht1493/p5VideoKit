function ui_patch_eff_panes() {
  let droot = ui_div_empty('ipatch_eff');
  for (let ipatch = 0; ipatch < a_ui.patches.length; ipatch++) {
    create_patch(ipatch);
  }

  function create_patch(ipatch) {
    let div = ui_div_empty('patch_' + ipatch);
    droot.child(div);
    let aPatch = a_ui.patches[ipatch];
    // a_ui.patches: [{ imedia: 1, ifactory: 0, ipatch: 0 }],

    create_patch_selection();

    create_media_selection();

    create_checkbox('pipe', 'ipipe');

    create_checkbox('hide', 'ihide');

    create_remove_patch();

    create_settings();

    function create_remove_patch() {
      let btn = createButton('Remove').mousePressed(function () {
        patch_remove_ipatch(ipatch);
      });
      div.child(btn);
    }

    function create_checkbox(label, prop) {
      let chk = createCheckbox(label, aPatch.eff_src[prop]);
      div.child(chk);
      chk.style('display:inline');
      chk.changed(function () {
        let state = this.checked() ? 1 : 0;
        aPatch.eff_src[prop] = state;
        ui_patch_update(aPatch);
      });
    }

    function create_patch_selection() {
      let span = createSpan(`Patch${ipatch + 1}: `);
      div.child(span);
      let aSel = createSelect();
      div.child(aSel);
      for (let ii = 0; ii < a_effectMetas.length; ii++) {
        aSel.option(a_effectMetas[ii].label, ii);
      }
      let effIndex = effectMeta_find(aPatch.eff_src.eff_label).index;
      aSel.selected(effIndex);
      aSel.changed(function () {
        let effIndex = parseFloat(this.value());
        patch_update_effIndex(aPatch, effIndex);
      });
    }

    function create_media_selection() {
      // let span = createSpan(` Device${ipatch}: `);
      let span = createSpan(` Source: `);
      div.child(span);
      let aSel = createSelect();
      div.child(aSel);
      for (let ii = 0; ii < a_mediaDivs.length; ii++) {
        aSel.option(a_mediaDivs[ii].label, ii);
      }
      aSel.selected(aPatch.eff_src.imedia);
      aSel.changed(function () {
        let ii = this.value();
        aPatch.eff_src.imedia = parseFloat(ii);
        ui_patch_update(aPatch);
      });
    }

    function create_settings() {
      // console.log('create_settings aPatch', aPatch);
      let effMeta = effectMeta_find(aPatch.eff_src.eff_label);
      create_selections_for_dict(effMeta.factory.meta_props);
      div.child(createElement('br'));
      div.child(createElement('br'));
    }

    function create_selections_for_dict(dict) {
      let first = 1;
      for (let prop in dict) {
        // eg. items = factor: [10, 50, 100 ... ]
        let items = dict[prop];
        if (prop.substring(0, 1) === '_') {
          prop = prop.substring(1);
          first = 1;
        }
        if (Array.isArray(items)) {
          // eg. items = factor: [10, 50, 100 ... ]
          create_selection(prop, items, first);
        } else {
          // eg: _next: { button: next_action }
          create_other(prop, items, first);
        }
        first = 0;
      }
    }

    function create_other(prop, items, first) {
      // console.log('create_other prop', prop, 'items', items, 'first', first);
      if (first) {
        div.child(createElement('br'));
      }
      for (iprop in items) {
        let item = items[iprop];
        // console.log('create_other iprop', iprop, 'item', item);
        if (iprop === 'button') {
          div.child(createSpan(' '));
          let btn = createButton(prop).mousePressed(function () {
            button_action(item, aPatch);
          });
          div.child(btn);
          if (first) {
            btn.style('margin-left', '10px');
          }
        } else {
          console.log('create_other !!@ Unkown type=' + iprop);
        }
      }
    }

    function button_action(item, aPatch) {
      let inst = a_patch_instances[aPatch.eff_src.ipatch];
      item(inst, aPatch);
    }

    function create_selection(prop, arr, first) {
      // console.log('create_selection prop', prop, 'arr', arr);
      if (first) {
        div.child(createElement('br'));
      }
      let span = createSpan(` ${prop}:`);
      div.child(span);
      if (first) {
        span.style('margin-left', '10px');
      }
      let aSel = createSelect();
      div.child(aSel);
      for (let ii = 0; ii < arr.length; ii++) {
        aSel.option(arr[ii]);
      }
      // Get prop value or use first in arr as default if missing
      if (!aPatch.eff_inits) {
        aPatch.eff_inits = {};
      }
      let aVal = aPatch.eff_inits[prop];
      if (aVal === undefined) {
        aVal = arr[0];
        aPatch.eff_inits[prop] = aVal;
      }
      let isNum = typeof aVal === 'number';
      // console.log('create_selection prop', prop, 'aVal', aVal, 'isNum', isNum);
      aSel.selected(aVal);
      aSel.changed(function () {
        let aVal = this.value();
        if (isNum) aVal = parseFloat(aVal);
        aPatch.eff_inits[prop] = aVal;
        ui_patch_update(aPatch);
      });
    }
  }
}

function patch_add(aPatch) {
  aPatch.eff_src.ipatch = a_ui.patches.length;
  a_ui.patches.push(aPatch);
  ui_patch_update(aPatch);
  ui_refresh();
  pad_layout_update();
}

function patch_remove_ipatch(ipatch) {
  patch_remove_at(ipatch);
}

// Remove patch by index
function patch_remove_at(ipatch) {
  // Don't delete first patch
  // if (ipatch === 0) {
  //   return;
  // }
  a_ui.patches.splice(ipatch, 1);
  a_patch_instances.splice(ipatch, 1);
  ui_div_empty('patch_' + ipatch);
  ui_patch_update();
  ui_refresh();
  pad_layout_update();
}

// Remove the last patch
function patch_remove_last() {
  let ipatch = a_ui.patches.length - 1;
  patch_remove_at(ipatch);
}

function patch_update_effIndex(aPatch, effIndex) {
  let eff_src = aPatch.eff_src;
  let ipatch = eff_src.ipatch;
  eff_src.eff_label = a_effectMetas[effIndex].label;
  a_ui.patches[ipatch] = { eff_src, eff_inits: {} };
  ui_patch_update(aPatch);
  ui_patch_eff_panes();
}

function patch_index1(ind) {
  return a_patch_instances[ind - 1];
}
