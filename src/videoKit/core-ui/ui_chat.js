import { a_ } from '../let/a_ui.js?v=128';
import { ui_prop_set } from '../core/ui_restore.js?v=128';
import { attach_media_nlabel } from '../core/create_mediaDiv.js?v=128';
import { livem_send } from '../core/liveMedia_attach.js?v=128';

export function ui_chat_pane() {
  // ichat_blk
  let blk = createSpan('').id('ichat_blk');
  blk.style(a_.ui.live_chk ? 'display:inline' : 'display:none');
  let elm;
  elm = createSpan(' Chat name: ');
  blk.child(elm);
  elm = createInput(a_.ui.chat_name).input(function () {
    ui_prop_set('chat_name', this.value());
  });
  blk.child(elm);
  elm = createButton('Send').mousePressed(function () {
    let str = select('#ichat_msg').value();
    livem_send(str);
    select('#ichat_log').html('me: ' + str + '<br/>', true);
  });
  blk.child(elm);
  elm = createButton('Clear').mousePressed(function () {
    select('#ichat_msg').value('');
    select('#ichat_log').html('');
  });
  blk.child(elm);

  elm = createElement('br');
  blk.child(elm);
  // ichat_msg
  elm = createInput('')
    .id('ichat_msg')
    .input(function () {
      console.log('ichat_msg ' + this.value());
      ui_prop_set('chat_text', this.value());
    });
  blk.child(elm);
  select('#ichat_msg').style('width', '80%');
  // ichat_log
  elm = createDiv().id('ichat_log');
  blk.child(elm);
  a_chat_log = elm;
}

let a_chat_log;

export function ui_chat_receive(str, id) {
  // console.log('ui_chat_receive', str);
  let obj = { name: id, text: 'Bye' };
  if (str) {
    obj = JSON.parse(str);
    if (!obj) return;
  }
  let { name, text } = obj;
  if (!text) text = '';
  if (name === a_.ui.chat_name) {
    name += '-' + id;
  }
  a_chat_log.html(name + ': ' + text + '<br/>', true);
  attach_media_nlabel(id, name);
  // !!@ tile: Hello restart
  if (name === 'tile' && text === 'restart') {
    window.location.reload();
  }
}
