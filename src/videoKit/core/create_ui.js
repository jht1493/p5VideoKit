import { a_ } from '../let/a_ui.js?v={{vers}}';
import { ui_canvas_div, toggleFullScreen } from '../core-ui/ui_canvas.js?v={{vers}}';
import { ui_capture_size } from '../core-ui/ui_capture.js?v={{vers}}';
import { ui_render_size } from '../core-ui/ui_render.js?v={{vers}}';
import { ui_patch_layout, pad_layout_update } from '../core-ui/ui_patch.js?v={{vers}}';
import { ui_div_empty } from '../util/ui_base.js?v={{vers}}';
import { ui_patch_eff_panes } from '../core-ui/ui_patch_eff.js?v={{vers}}';
import { ui_patch_buttons } from '../core-ui/ui_patch.js?v={{vers}}';
import { ui_live_selection } from '../core-ui/ui_live.js?v={{vers}}';
import { ui_chat_pane } from '../core-ui/ui_chat.js?v={{vers}}';
import { store_restore_from } from '../core/store_url_parse.js?v={{vers}}';
import { reset_video_clear_locals } from '../core/reset_video_clear_locals.js?v={{vers}}';
import { patch_inst_clear } from '../core/patch_inst.js?v={{vers}}';
import { ui_prop_set } from '../core/ui_restore.js?v={{vers}}';

export function create_ui() {
  ui_top_pane();
  ui_size_pane();
  ui_patch_layout();
  ui_create_comment_field();
  createElement('br');
  ui_patch_eff_panes();
  ui_patch_buttons();
  createElement('br');
  ui_live_selection();
  ui_chat_pane();
  createElement('br');
}

function ui_create_comment_field() {
  let div = ui_div_empty('icomment');
  let val = a_.ui.comment;
  if (!val) val = a_.ui.setting;
  // console.log('ui_create_comment_field val init', val);
  let elm = createInput(val).input(function () {
    let val = this.value();
    ui_prop_set('comment', val);
    // console.log('ui_create_comment_field val', val);
  });
  // elm.style('width', '615px');
  elm.style('width', '80%');
  div.child(elm);
}

function ui_top_pane() {
  // createSpan(a_.app_ver);
  createButton(a_.app_ver).mousePressed(function () {
    present_action();
  });
  createButton('HideUI').mousePressed(function () {
    ui_hide();
  });
  createButton('Reset').mousePressed(function () {
    reset_video_clear_locals(a_.store_name);
  });
  // createButton('Save').mousePressed(function () {
  //   let fn = ui_save_fn();
  //   saveCanvas(fn, 'png');
  //   save_others(fn);
  // });
  createButton('Save').mousePressed(function () {
    let fn = ui_save_fn();
    saveCanvas(fn, 'png');
  });
  createButton('Reload').mousePressed(function () {
    reload_action();
  });
  // createButton('Clear').mousePressed(function () {
  //   patch_inst_clear();
  // });
  {
    // console.log('a_.store_prefix', a_.store_prefix);
    let u = a_.store_prefix;
    if (u) u = '(' + u + ')';
    createSpan().id('iu').html(u);
  }
  {
    createSpan().id('ifps');
    let imsg = createSpan().id('imsg');
    // imsg.style('fontSize', 'x-large');
    imsg.style('font-size', '5vw');
    imsg.style('display:none');
  }
  {
    let span = createSpan(' ');
    let gith = createA('https://github.com/jht1493/p5VideoKit/', ' GitHub ', 'github');
    gith.style('float', 'right'); // float: right
    gith.style('margin-right', '5px'); // float: right
    span.child(gith);
    let setn = createA('./settings.html', ' Settings ', '_blank');
    setn.style('float', 'right'); // float: right
    setn.style('margin-right', '5px'); // float: right
    span.child(setn);
  }
}

// Can't move window across monitors
// let myWindow;
// function openWin() {
//   myWindow = window.open('', 'myWindow', 'width=200, height=100');
//   // myWindow.document.write("<p>This is 'myWindow'</p>");
// }
// function moveWin(xpos) {
//   // myWindow.moveTo(xpos, 0);
//   myWindow.moveBy(xpos, 0);
//   myWindow.focus();
// }

function reload_action() {
  let ent = a_.settings.find((ent) => ent.setting === a_.ui.setting);
  console.log('reload_action ent', ent);
  if (!ent) {
    ent = a_.ui;
  }
  store_restore_from(ent);
}

function ui_present_window() {
  resizeCanvas(windowWidth, windowHeight);
  ui_hide();
  ui_window_refresh();
}

function present_action() {
  toggleFullScreen();
  let delay = 3000;
  setTimeout(ui_present_window, delay);
}

function ui_hide() {
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

export function ui_window_refresh() {
  pad_layout_update();
  patch_inst_clear();
}

function ui_size_pane() {
  let div = ui_div_empty('size_pane');
  ui_canvas_div(div);
  ui_capture_size(div);
  // ui_render_size(div);
}

let a_ifps;

export function update_ui() {
  if (!a_ifps) {
    a_ifps = select('#ifps');
  }
  if (a_ifps) {
    a_ifps.html(' [fps=' + round(frameRate(), 2) + '] ');
  }
}

export function ui_message(msg) {
  let imsg = select('#imsg');
  if (!imsg) return;
  if (msg) {
    msg = ' [ ' + msg + ' ] ';
  }
  imsg.html(msg);
  imsg.style(msg ? 'display:inline' : 'display:none');
}

// Return date stamped file name based on first patch name
function ui_save_fn() {
  // "2021-04-25T14:44:31.227Z"
  let saveName = a_.ui.setting || 'dice_face';
  let dt = new Date().toISOString().substring(0, 10);
  let fn = saveName + '_' + dt;
  return fn;
}
