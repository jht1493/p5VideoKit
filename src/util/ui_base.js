let ui_show_ids = {};

function ui_show_num(label, num) {
  num = round(num, 2);
  ui_show_text(label, ' [' + label + ' ' + num + ']');
}

function ui_show_text(label, text) {
  let ilabel = 'i_' + label;
  let item = ui_show_ids[ilabel];
  if (!item) {
    item = select('#' + ilabel);
    ui_show_ids[ilabel] = item;
  }
  // console.log('ui_show_text ilabel='+ilabel+' item='+item)
  if (item && item.html) {
    item.html(text);
  }
}

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
  ui_canvas(div);
  // ui_capture_size(div);
  // ui_backcolor(div);
}

let a_back_color_options = [200, 0, 50, 100, 200, 255, -1];

function ui_backcolor(div) {
  div.child(createSpan(' Back: '));
  let aSel = createSelect();
  div.child(aSel);
  let back_colors = a_back_color_options;
  for (let index = 0; index < back_colors.length; index++) {
    aSel.option(back_colors[index]);
  }
  aSel.selected(a_ui.back_color);
  aSel.changed(function () {
    let valu = parseFloat(this.value());
    a_ui_set('back_color', valu);
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
  let saveName = a_ui.setting || 'dice_face';
  let dt = new Date().toISOString().substring(0, 10);
  let fn = saveName + '_' + dt;
  return fn;
}

// Create empty div or empty it if already exists
function ui_div_empty(id) {
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
