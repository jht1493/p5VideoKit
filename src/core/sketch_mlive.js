let a_livem;

function attach_livem(ent) {
  console.log('attach_livem ent=', ent);
  let type;
  let stream;
  let device = ent.device;
  if (device) {
    stream = device.stream;
    if (!stream) {
      console.log('attach_livem NO stream ent=', ent);
      return;
    }
    type = 'CAPTURE';
  } else if (!a_ui.canvas_data_chk) {
    // no device --> canvas
    stream = my_canvas;
    type = 'CANVAS';
  } else {
    // Data only - don't stream out our canvas
    stream = null;
    type = 'DATA';
  }
  let livem = ent.livem;
  if (livem) {
    console.log('attach_livem livem', livem);
    return;
  }
  // console.log('attach_livem this=', this);
  console.log('attach_livem type=' + type + ' a_ui.room_name=' + a_ui.room_name);
  livem = new p5LiveMedia(this, type, stream, a_ui.room_name);
  if (!a_livem) {
    livem.on('stream', gotStream);
    livem.on('data', gotData);
    livem.on('disconnect', gotDisconnect);
    livem.on('connect', gotConnect);
    a_livem = livem;
    // console.log('attach_livem SET a_livem', a_livem);
  }
  ent.livem = livem;
}

function detach_livem(ent) {
  console.log('detach_livem ent=', ent);
  if (!ent) return;
  ent.livem = null;
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
  let device = { deviceId, capture, stream };
  let default_vis = !a_hideui;
  create_media_pane(device, default_vis);
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
  remove_media_pane(id);
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
