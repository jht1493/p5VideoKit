import { a_ } from '../let/a_ui.js?v=112';
import { create_mediaDiv, remove_mediaDiv } from '../core/create_mediaDiv.js?v=112';
import { ui_refresh } from '../core-ui/ui_patch.js?v=112';
import { ui_chat_receive } from '../core-ui/ui_chat.js?v=112';

// let a_livem;

export function liveMedia_attach(mediaDiv) {
  // console.log('liveMedia_attach mediaDiv=', mediaDiv);
  let type;
  let stream;
  let mediaDevice = mediaDiv.mediaDevice;
  if (mediaDevice) {
    stream = mediaDevice.stream;
    if (!stream) {
      console.log('liveMedia_attach NO stream mediaDiv=', mediaDiv);
      return;
    }
    type = 'CAPTURE';
  } else if (!a_.ui.canvas_data_chk) {
    // no mediaDevice --> canvas
    stream = a_.my_canvas;
    type = 'CANVAS';
  } else {
    // Data only - don't stream out our canvas
    stream = null;
    type = 'DATA';
  }
  let livem = mediaDiv.livem;
  if (livem) {
    console.log('liveMedia_attach livem', livem);
    return;
  }
  // console.log('liveMedia_attach this=', this);
  // console.log('liveMedia_attach type=' + type + ' a_.ui.room_name=' + a_.ui.room_name);
  // this is nulll in modules
  let nthis = this || window;
  // console.log('liveMedia_attach this', this, 'nthis', nthis);
  livem = new p5LiveMedia(nthis, type, stream, a_.ui.room_name);
  if (!a_.livem) {
    livem.on('stream', gotStream);
    livem.on('data', gotData);
    livem.on('disconnect', gotDisconnect);
    livem.on('connect', gotConnect);
    a_.livem = livem;
    // console.log('liveMedia_attach SET a_.livem', a_.livem);
  }
  mediaDiv.livem = livem;
}

export function liveMedia_detach(mediaDiv) {
  console.log('liveMedia_detach mediaDiv=', mediaDiv);
  if (!mediaDiv) return;
  mediaDiv.livem = null;
}

// For debugging
let otherVideo;

// We got a new stream!
function gotStream(capture, id) {
  console.log('gotStream id', id);
  console.log('gotStream width', capture.width, 'height', capture.height);
  // This is just like a video/stream from createCapture(VIDEO)
  otherVideo = capture;
  //otherVideo.id and id are the same and unique identifiers
  capture.elt.muted = true;
  let stream = capture.elt.srcObject;
  let deviceId = id;
  let mediaDevice = { deviceId, capture, stream };
  let default_vis = !a_.hideui;
  create_mediaDiv(mediaDevice, default_vis, 1);
  ui_refresh();
  // livem_send('Hello');
}

// loadedmetadata

function gotData(theData, id) {
  console.log('gotData theData', theData, 'id', id);
  ui_chat_receive(theData, id);
}

function gotDisconnect(id) {
  console.log('gotDisconnect id', id);
  ui_chat_receive('', id);
  remove_mediaDiv(id);
}

function gotConnect(id) {
  console.log('gotConnect id', id);
}

export function livem_send(text) {
  console.log('livem_send text', text);
  if (!a_.livem) return;
  let name = a_.ui.chat_name;
  let obj = { name, text };
  a_.livem.send(JSON.stringify(obj));
}

// https://github.com/vanevery/p5LiveMedia
