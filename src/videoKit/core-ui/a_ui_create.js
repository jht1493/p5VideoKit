import { a_ } from '../let/a_state.js?v={{vers}}';
import { ui_canvas_div, toggleFullScreen } from '../core-ui/ui_canvas.js?v={{vers}}';
import { ui_capture_size } from '../core-ui/ui_capture.js?v={{vers}}';
import { ui_patch_bar, pad_layout_update } from '../core-ui/ui_patch_bar.js?v={{vers}}';
import { ui_div_empty, ui_div_append, ui_save_fn, ui_hide } from '../core-ui/ui_tools.js?v={{vers}}';
import { ui_patch_eff_panes } from '../core-ui/ui_patch_eff.js?v={{vers}}';
import { ui_patch_buttons } from '../core-ui/ui_patch_bar.js?v={{vers}}';
import { ui_live_selection } from '../core-ui/ui_live.js?v={{vers}}';
import { ui_chat_pane } from '../core-ui/ui_chat.js?v={{vers}}';
import { store_restore_from } from '../core/store_url_parse.js?v={{vers}}';
import { reset_video_clear_locals } from '../core/reset_video_clear_locals.js?v={{vers}}';
import { patch_inst_clear } from '../core/patch_inst.js?v={{vers}}';
import { ui_prop_set } from '../core-ui/ui_restore.js?v={{vers}}';
// import { ui_render_size } from '../core-ui/ui_render.js?v={{vers}}';

export function ui_create() {
  ui_top_pane();
  ui_size_pane();
  ui_patch_bar();
  ui_create_comment_field();
  createElement('br');

  ui_patch_eff_panes();
  ui_patch_buttons();
  createElement('br');

  ui_live_selection();
  ui_chat_pane();
  createElement('br');
}

function ui_top_pane() {
  let div = ui_div_empty('itop_bar');
  let html = `
  <button id="ipresent">Present?v={{vers}}</button>
  <button id="ihideui">HideUI</button>
  <button id="ireset">Reset</button>
  <button id="isave">Save</button>
  <button id="ireload">Reload</button>
  <span id="iu"></span>
  <span id="ifps"></span>
  <span id="imsg" style="font-size: 5vw; display: none; float: right"></span>
  <span>
    <span style="float: right; margin-right: 5px">
      <a href="https://github.com/jht1493/p5VideoKit/" target="github" >
        GitHub
      </a>
    </span>
    <span style="float: right; margin-right: 5px">
      [ videoKit
        <a href="./videoKit/settings.html" target="_blank"> Settings </a> 
      ]
    </span>
    <span style="float: right; margin-right: 5px">
      <a href="./gen/settings.html" target="_blank" > Settings </a>
    </span>
  </span>
  `;
  ui_div_append(div, html);

  window.ipresent.addEventListener('mousedown', function () {
    present_action();
  });

  window.ihideui.addEventListener('mousedown', function () {
    ui_hide();
  });

  window.ireset.addEventListener('mousedown', function () {
    reset_video_clear_locals(a_.store_name);
  });

  window.isave.addEventListener('mousedown', function () {
    let fn = ui_save_fn();
    saveCanvas(fn, 'png');
    // save_others(fn);
  });

  window.ireload.addEventListener('mousedown', function () {
    reload_action();
  });

  // init iu element with store_prefix
  {
    let u = a_.store_prefix;
    if (u) u = '(' + u + ')';
    // !!@ ?? textContent vs. innerText
    window.iu.textContent = u;
  }
}

function ui_size_pane() {
  let div = ui_div_empty('isize_bar');
  ui_canvas_div(div);
  ui_capture_size(div);
  // ui_render_size(div);
}

function ui_create_comment_field() {
  let div = ui_div_empty('icomment_bar');
  let html = `
  <input id="icomment_input" value="" type="text" style="width: 80%;">
  `;
  ui_div_append(div, html);

  let val = a_.ui.comment || a_.ui.setting;

  window.icomment_input.value = val;
  window.icomment_input.addEventListener('input', function () {
    let val = this.value;
    // console.log('ui_create_comment_field val', val);
    ui_prop_set('comment', val);
  });
}

function reload_action() {
  let ent = a_.settings.find((ent) => ent.setting === a_.ui.setting);
  console.log('reload_action ent', ent);
  if (!ent) {
    ent = a_.ui;
  }
  store_restore_from(ent);
}

export function ui_present_window() {
  resizeCanvas(windowWidth, windowHeight);
  ui_hide();
  ui_window_refresh();
}

function present_action() {
  toggleFullScreen();
  let delay = 3000;
  setTimeout(ui_present_window, delay);
}

export function ui_window_refresh() {
  pad_layout_update();
  patch_inst_clear();
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
