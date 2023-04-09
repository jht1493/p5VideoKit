import { a_ } from '../let/a_state.js?v={{vers}}';
import { ui_patch_update } from '../core-ui/ui_patch_bar.js?v={{vers}}';
import { div_break } from '../core-ui/ui_patch_eff.js?v={{vers}}';
// static meta_props = {

// style:
// text_input:
// message:
// button:
// slider:

// { button: next_action }

// message_prop1: {
//   message: 'An example effect',
// },

// text_prop: {
//   text_input: 'Hello world!',
// },

// _movie_url: {
//   style: 'width:80%',
//   // text_input: './external/media/webdb/jht/IMG_4491.JPEG',
//   text_input: './external/media/p5VideoKit-gallery-yoyo/live_gallery',
// },

// slider1_prop: {
//   style: 'width:20%',
//   slider: { min: 0, max: 100 },
// },

// {
//   prop: 'num_prop2',
//   label: 'prop2',
//   selection: ['red', 'green', 'yellow'],
// };

export function patch_create_other(aPatch, div, prop, items, issueBreak) {
  console.log('create_other prop', prop, 'items', items);
  let ent = { aPatch, div, prop };
  for (let iprop in items) {
    let item = items[iprop];
    ent.item = item;
    // console.log('create_other iprop', iprop, 'item', item);
    switch (iprop) {
      case 'style':
        ent.defaultStyle = item;
        break;
      case 'label':
        ent.defaultLabel = item;
        break;
      case 'button':
        ent.div.child(createSpan(' '));
        let label = ent.defaultLabel || prop;
        ent.elm = createButton(label).mousePressed(function () {
          button_action(item, aPatch);
        });
        ent.div.child(ent.elm);
        break;
      case 'textInput':
      case 'text_input': // legacy
        create_textInput(ent);
        break;
      case 'span':
      case 'message': // legacy
        ent.elm = createSpan(` ${item}`);
        ent.div.child(ent.elm);
        break;
      case 'slider':
        create_slider(ent);
        break;
      case 'selection':
        create_selection(ent);
        break;
      case 'prop':
        break;
      default:
        console.log('create_other !!@ Unkown type=' + iprop);
        break;
    }
  }
  if (ent.elm) {
    if (issueBreak) {
      let firstElm = ent.labelSpan || ent.elm;
      firstElm.style('margin-left:10px');
    }
    if (ent.defaultStyle) {
      ent.elm.style(ent.defaultStyle);
    }
    return 0; // no break
  } else {
    // div_break(div);
    return 1; // issueBreak
  }
}

function create_default_label(ent) {
  let { div, prop, defaultLabel } = ent;
  defaultLabel = defaultLabel || prop;
  if (defaultLabel) {
    let span = createSpan(` ${defaultLabel}:`);
    div.child(span);
    ent.labelSpan = span;
  }
}

function create_textInput(ent) {
  console.log('createTextInput ent', ent);
  let { item, aPatch, div, prop } = ent;
  create_default_label(ent);
  let oldVal = aPatch.eff_props[prop];
  if (oldVal === undefined) {
    oldVal = '' + item;
    aPatch.eff_props[prop] = oldVal;
  }
  ent.elm = createInput(oldVal).input(function () {
    let aVal = this.value();
    console.log('text_input ' + aVal);
    aPatch.eff_props[prop] = aVal;
    ui_patch_update(aPatch);
  });
  ent.div.child(ent.elm);
}

function create_selection(ent) {
  console.log('create_selection ent', ent);
  let { item, aPatch, div, prop } = ent;
  create_default_label(ent);
  let arr = item;
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
  console.log('patch_create_selection prop', prop, 'aVal', aVal, 'isNum', isNum);
  if (aVal === null) {
    aVal = '';
  }
  aSel.selected(aVal);
  aSel.changed(function () {
    let aVal = this.value();
    if (isNum) aVal = parseFloat(aVal);
    aPatch.eff_props[prop] = aVal;
    ui_patch_update(aPatch);
  });
  ent.elm = aSel;
}

// ent = { aPatch, div, prop, item };
// item = {min: 0, max: 100}
function create_slider(ent) {
  console.log('create_slider ent', ent);
  let { item, aPatch, div, prop } = ent;
  create_default_label(ent);
  let min = item.min || 0;
  let max = item.max || 1.0;
  let step = item.step || 0; // could be undefined
  let oldVal = aPatch.eff_props[prop];
  console.log('create_slider oldVal', oldVal);
  if (oldVal === undefined) {
    oldVal = min + (max - min) / 2;
    aPatch.eff_props[prop] = oldVal + '';
  }
  let valSpan = createSpan(formatNumber(oldVal));
  // console.log('create_slider valSpan', valSpan);
  // createSlider(min, max, [value], [step])
  ent.elm = createSlider(min, max, oldVal, step).input(function () {
    let aVal = this.value();
    // console.log('create_slider aVal ' + aVal);
    // let oldVal = aPatch.eff_props[prop];
    // console.log('create_slider input oldVal', oldVal);
    // console.log('create_slider input valSpan', valSpan);
    // console.log('create_slider input valSpan.elt.innerHtml', valSpan.elt.innerHtml);

    aPatch.eff_props[prop] = aVal;
    ui_patch_update(aPatch);

    valSpan.elt.innerHTML = formatNumber(aVal) + '';
  });
  div.child(ent.elm);
  div.child(valSpan);
}

function formatNumber(num) {
  let prec = 1000;
  return int(num * prec) / prec;
}

function button_action(item, aPatch) {
  let inst = a_.patch_instances[aPatch.eff_spec.ipatch];
  item(inst, aPatch);
}
