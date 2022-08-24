import { a_ } from '../let/a_ui.js?v={{vers}}';
import { ui_prop_set } from '../core/ui_restore.js?v={{vers}}';

export function ui_div_append(div, str) {
  let ndiv = document.createElement('div');
  // window.ndiv = ndiv;
  ndiv.innerHTML = str;
  let childNodes = ndiv.childNodes.values();
  let narr = [];
  // Must make a copy since appendChild will remove child from childNodes
  for (let child of childNodes) {
    narr.push(child);
  }
  // Append all children of ndiv to div
  for (let child of narr) {
    div.elt.appendChild(child);
  }
}

// Create empty div or empty it if already exists
export function ui_div_empty(id) {
  let div = select('#' + id);
  // console.log('ui_device_selection div', div);
  if (!div) {
    div = createDiv().id(id);
  } else {
    let children = div.child();
    for (let index = children.length - 1; index >= 0; index--) {
      let elm = children[index];
      elm.remove();
    }
  }
  return div;
}

export function ui_hide() {
  a_.my_canvas.elt.style.cursor = 'none';
  let m = select('main').elt;
  while (m.nextSibling) {
    // elt.nodeName VIDEO
    if (m.nextSibling.nodeName === 'VIDEO') {
      m = m.nextSibling;
    } else {
      m.nextSibling.remove();
    }
  }
}

let a_back_color_options = [200, 0, 1, 50, 100, 200, 255, -1];

export function ui_backcolor(div) {
  div.child(createSpan(' Back: '));
  let aSel = createSelect();
  div.child(aSel);
  let back_colors = a_back_color_options;
  for (let index = 0; index < back_colors.length; index++) {
    aSel.option(back_colors[index]);
  }
  aSel.selected(a_.ui.back_color);
  aSel.changed(function () {
    let valu = parseFloat(this.value());
    ui_prop_set('back_color', valu);
  });
}

// Return date stamped file name based on first patch name
export function ui_save_fn() {
  // "2021-04-25T14:44:31.227Z"
  let saveName = a_.ui.comment || a_.ui.setting || 'videoKit';
  saveName = saveName.substring(0, 32);
  let dt = new Date().toISOString().substring(0, 10);
  let fn = saveName + '_' + dt;
  return fn;
}
