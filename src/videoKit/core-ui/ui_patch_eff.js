import { a_ } from '../let/a_ui.js?v={{vers}}';
import { ui_div_empty } from '../util/ui_base.js?v={{vers}}';
import { effectMeta_find } from '../core/effectMeta.js?v={{vers}}';
import { ui_patch_update } from '../core-ui/ui_patch.js?v={{vers}}';
import { patch_remove_ipatch, patch_update_effIndex } from '../core/patch_inst.js?v={{vers}}';

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
      let span = createSpan(`Patch${ipatch + 1}: `);
      div.child(span);
      let aSel = createSelect();
      div.child(aSel);
      for (let ii = 0; ii < a_.effectMetas.length; ii++) {
        aSel.option(a_.effectMetas[ii].label, ii);
      }
      let effIndex = effectMeta_find(aPatch.eff_spec.eff_label).index;
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
      create_selections_for_dict(effMeta.factory.meta_props);

      // Get props for imported module via import_factory
      if (aPatch.import_factory) {
        create_selections_for_dict(aPatch.import_factory.meta_props);
      }
      div_break(div);
      div_break(div);
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
        div_break(div);
      }
      for (let iprop in items) {
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
        } else if (iprop === 'text_input') {
          let oldVal = aPatch.eff_props[prop];
          if (oldVal === undefined) {
            oldVal = '' + item;
            aPatch.eff_props[prop] = oldVal;
          }
          let elm = createInput(oldVal).input(function () {
            let aVal = this.value();
            console.log('text_input ' + aVal);
            aPatch.eff_props[prop] = aVal;
            ui_patch_update(aPatch);
          });
          div.child(elm);
        } else if (iprop === 'message') {
          // div.child(createSpan(` ${prop}: ${item}`));
          div.child(createSpan(` ${item}`));
        } else {
          console.log('create_other !!@ Unkown type=' + iprop);
        }
      }
    }

    function button_action(item, aPatch) {
      let inst = a_.patch_instances[aPatch.eff_spec.ipatch];
      item(inst, aPatch);
    }

    function create_selection(prop, arr, first) {
      // console.log('create_selection prop', prop, 'arr', arr);
      if (first) {
        div_break(div);
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
      let aVal = aPatch.eff_props[prop];
      if (aVal === undefined) {
        aVal = arr[0];
        aPatch.eff_props[prop] = aVal;
      }
      let isNum = typeof aVal === 'number';
      // console.log('create_selection prop', prop, 'aVal', aVal, 'isNum', isNum);
      aSel.selected(aVal);
      aSel.changed(function () {
        let aVal = this.value();
        if (isNum) aVal = parseFloat(aVal);
        aPatch.eff_props[prop] = aVal;
        ui_patch_update(aPatch);
      });
    }
  }
}

export function patch_index1(ind) {
  return a_.patch_instances[ind - 1];
}

function div_break(div) {
  div.child(createElement('br'));
}
