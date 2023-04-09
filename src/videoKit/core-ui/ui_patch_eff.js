import { a_ } from '../let/a_state.js?v={{vers}}';
import { ui_div_empty } from '../core-ui/ui_tools.js?v={{vers}}';
import { effectMeta_find } from '../core/effectMeta.js?v={{vers}}';
import { ui_patch_update } from '../core-ui/ui_patch_bar.js?v={{vers}}';
import { patch_remove_ipatch, patch_update_effIndex } from '../core/patch_inst.js?v={{vers}}';
import { patch_create_other } from '../core-ui/ui_patch_create.js?v={{vers}}';

export function ui_patch_eff_panes() {
  let droot = ui_div_empty('ipatch_eff');
  for (let ipatch = 0; ipatch < a_.ui.patches.length; ipatch++) {
    create_patch(ipatch);
  }

  function create_patch(ipatch) {
    let div = ui_div_empty('patch_' + ipatch);
    droot.child(div);

    let aPatch = a_.ui.patches[ipatch];
    if (!aPatch.eff_props) {
      aPatch.eff_props = {};
    }
    // a_.ui.patches: [{ eff_spec: { ipatch: 0, imedia: 1, eff_label: 'show' } }],

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
      let chk = createCheckbox(label, aPatch.eff_spec[prop]);
      div.child(chk);
      chk.style('display:inline');
      chk.changed(function () {
        let state = this.checked() ? 1 : 0;
        aPatch.eff_spec[prop] = state;
        ui_patch_update(aPatch);
      });
    }

    function create_patch_selection() {
      let span = createSpan(`Effect${ipatch + 1}: `);
      div.child(span);
      let aSel = createSelect();
      div.child(aSel);
      let lastGroup;
      for (let ii = 0; ii < a_.effectMetas.length; ii++) {
        let ent = a_.effectMetas[ii];
        // console.log('ent', ent);
        let ui_label = ent.ui_label || 'import/';
        let label = ent.label;
        let parts = ui_label.split('/');
        let newGroup = parts[0];
        if (lastGroup !== newGroup) {
          aSel.option('-------- ' + newGroup, -1);
        }
        lastGroup = newGroup;
        aSel.option(label, ii);
      }
      let effIndex = effectMeta_find(aPatch.eff_spec.eff_label).index;
      aSel.selected(effIndex);
      aSel.changed(function () {
        let effIndex = parseFloat(this.value());
        if (effIndex >= 0) {
          patch_update_effIndex(aPatch, effIndex);
        }
      });
    }

    function create_media_selection() {
      // let span = createSpan(` Device${ipatch}: `);
      let span = createSpan(` Source: `);
      div.child(span);
      let aSel = createSelect();
      div.child(aSel);
      for (let ii = 0; ii < a_.mediaDivs.length; ii++) {
        aSel.option(a_.mediaDivs[ii].label, ii);
      }
      aSel.selected(aPatch.eff_spec.imedia);
      aSel.changed(function () {
        let ii = this.value();
        aPatch.eff_spec.imedia = parseFloat(ii);
        ui_patch_update(aPatch);
      });
    }

    function create_settings() {
      // console.log('create_settings aPatch', aPatch);
      let effMeta = effectMeta_find(aPatch.eff_spec.eff_label);
      if (effMeta.factory) {
        create_ui_for_meta(effMeta.factory.meta_props);
      } else {
        console.log('create_settings MISSING factory effMeta', effMeta);
      }

      // Get props for imported module via import_factory
      // if (aPatch.import_factory) {
      //   create_ui_for_meta(aPatch.import_factory.meta_props);
      // }
      div_break(div);
      div_break(div);
    }

    function create_ui_for_meta(meta) {
      if (Array.isArray(meta)) {
        create_ui_for_meta_arr(meta);
      } else {
        create_ui_for_meta_dict(meta);
      }
    }

    function create_ui_for_meta_arr(arr) {
      let issueBreak = 1;
      for (let ent of arr) {
        if (issueBreak) {
          div_break(div);
        }
        let prop = ent.prop;
        issueBreak = patch_create_other(aPatch, div, prop, ent, issueBreak);
      }
    }

    function create_ui_for_meta_dict(dict) {
      let issueBreak = 1;
      for (let prop in dict) {
        // eg. items = factor: [10, 50, 100 ... ]
        let items = dict[prop];
        if (prop.substring(0, 1) === '_') {
          prop = prop.substring(1);
          issueBreak = 1;
        }
        if (issueBreak) {
          div_break(div);
        }
        if (Array.isArray(items)) {
          // eg. items = factor: [10, 50, 100 ... ]
          patch_create_selection(aPatch, div, prop, items, issueBreak);
          issueBreak = 0;
        } else {
          // eg: _next: { button: next_action }
          issueBreak = patch_create_other(aPatch, div, prop, items, issueBreak);
        }
      }
    }
  }
}

function patch_create_selection(aPatch, div, prop, arr, issueBreak, defaultLabel) {
  // console.log('patch_create_selection prop', prop, 'arr', arr);
  let label = defaultLabel || prop;
  let span = createSpan(` ${label}:`);
  div.child(span);
  if (issueBreak) {
    span.style('margin-left', '10px');
  }
  let aSel = createSelect();
  div.child(aSel);
  for (let ii = 0; ii < arr.length; ii++) {
    aSel.option(arr[ii]);
  }
  // Get prop value or use issueBreak in arr as default if missing
  let aVal = aPatch.eff_props[prop];
  if (aVal === undefined) {
    aVal = arr[0];
    aPatch.eff_props[prop] = aVal;
  }
  let isNum = typeof aVal === 'number';
  // console.log('patch_create_selection prop', prop, 'aVal', aVal, 'isNum', isNum);
  aSel.selected(aVal);
  aSel.changed(function () {
    let aVal = this.value();
    if (isNum) aVal = parseFloat(aVal);
    aPatch.eff_props[prop] = aVal;
    ui_patch_update(aPatch);
  });
  return aSel;
}

export function patch_index1(ind) {
  return a_.patch_instances[ind - 1];
}

export function div_break(div) {
  div.child(createElement('br'));
}
