let a_livem;

function attach_liveMedia(mediaDiv) {
  console.log('attach_liveMedia mediaDiv=', mediaDiv);
  let type;
  let stream;
  let mediaDevice = mediaDiv.mediaDevice;
  if (mediaDevice) {
    stream = mediaDevice.stream;
    if (!stream) {
      console.log('attach_liveMedia NO stream ent=', ent);
      return;
    }
    type = 'CAPTURE';
  } else if (!a_ui.canvas_data_chk) {
    // no mediaDevice --> canvas
    stream = my_canvas;
    type = 'CANVAS';
  } else {
    // Data only - don't stream out our canvas
    stream = null;
    type = 'DATA';
  }
  let livem = mediaDiv.livem;
  if (livem) {
    console.log('attach_liveMedia livem', livem);
    return;
  }
  // console.log('attach_liveMedia this=', this);
  console.log('attach_liveMedia type=' + type + ' a_ui.room_name=' + a_ui.room_name);
  livem = new p5LiveMedia(this, type, stream, a_ui.room_name);
  if (!a_livem) {
    livem.on('stream', gotStream);
    livem.on('data', gotData);
    livem.on('disconnect', gotDisconnect);
    livem.on('connect', gotConnect);
    a_livem = livem;
    // console.log('attach_liveMedia SET a_livem', a_livem);
  }
  mediaDiv.livem = livem;
}

function detach_livem(mediaDiv) {
  console.log('detach_livem mediaDiv=', mediaDiv);
  if (!mediaDiv) return;
  mediaDiv.livem = null;
}

// For debugging
let otherVideo;

// We got a new stream!
function gotStream(capture, id) {
  console.log('gotStream id', id);
  // This is just like a video/stream from createCapture(VIDEO)
  otherVideo = capture;
  //otherVideo.id and id are the same and unique identifiers
  capture.elt.muted = true;
  let stream = capture.elt.srcObject;
  let deviceId = id;
  let mediaDevice = { deviceId, capture, stream };
  let default_vis = !a_hideui;
  create_mediaDiv(mediaDevice, default_vis);
  ui_refresh();
  console.log('gotStream width', capture.width, 'height', capture.height);
  livem_send('Hello');
  // tile_notify_media_update({ add: id });
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

function livem_send(text) {
  console.log('livem_send text', text);
  if (!a_livem) return;
  let name = a_ui.chat_name;
  let obj = { name, text };
  a_livem.send(JSON.stringify(obj));
}

// https://github.com/vanevery/p5LiveMedia
