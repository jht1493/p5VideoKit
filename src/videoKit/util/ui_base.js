import { a_ } from '../let/a_ui.js?v=119';
import { ui_canvas_div } from '../core-ui/ui_canvas.js?v=119';
import { ui_prop_set } from '../core/ui_restore.js?v=119';

function ui_hide() {
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

function ui_size_pane() {
  let div = ui_div_empty('size_pane');
  ui_canvas_div(div);
}

let a_back_color_options = [200, 0, 50, 100, 200, 255, -1];

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

function ui_message(msg) {
  if (msg) {
    msg = ' [ ' + msg + ' ] ';
  }
  select('#imsg').html(msg);
}

// Return date stamped file name based on first patch name
function ui_save_fn() {
  // "2021-04-25T14:44:31.227Z"
  let saveName = a_.ui.setting || 'dice_face';
  let dt = new Date().toISOString().substring(0, 10);
  let fn = saveName + '_' + dt;
  return fn;
}

// Create empty div or empty it if already exists
export function ui_div_empty(id) {
  let div = select('#' + id);
  // console.log('ui_device_selection div', div);
  if (!div) {
    div = createDiv().id(id);
  } else {
    let children = div.child();
    for (let ii = children.length - 1; ii >= 0; ii--) {
      let elm = children[ii];
      elm.remove();
    }
  }
  return div;
}
