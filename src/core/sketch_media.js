let a_media_devices = [];
// { label, deviceId, capture, stream }

// let default_vis = 1;

function create_media_devices() {
  let default_vis = !a_hideui;
  for (let ent of a_media_devices) {
    init_device_capture(ent);
    create_media_pane(ent, default_vis);
  }
  ui_refresh();

  function init_device_capture(ent) {
    let vcap = {
      audio: true,
      video: {
        deviceId: { exact: ent.deviceId },
      },
    };
    let dim = get_capture_size();
    if (dim) {
      vcap.video.width = { exact: dim.width };
      vcap.video.height = { exact: dim.height };
    }
    // console.log('create_ent vcap', vcap);
    let capture = createCapture(vcap, function (stream) {
      // console.log('create_ent stream', stream);
      ent.stream = stream;
      // ent.ready = 1;
      // console.log('create_ent ent', ent);
      livem_restore();
    });
    // console.log('create_ent capture', capture);
    capture.elt.muted = true;
    ent.capture = capture;
  }
}

function media_enum() {
  a_media_devices = [];
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('enumerateDevices() not supported.');
    return;
  }
  // List cameras and microphones.
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        // console.log('device', device);
        // console.log(
        //   device.kind + ': ' + device.label + ' id=|' + device.deviceId + '|'
        // );
        if (device.kind == 'videoinput') {
          // console.log('media_enumdevice.deviceId=' + device.deviceId);
          console.log('media_enum label=' + device.label);
          let { label, deviceId } = device;
          if (!deviceId) {
            label = 'No-id-' + random();
          }
          a_media_devices.push({ label, deviceId });
        }
      });
      // console.log('a_media_devices', a_media_devices);
      create_media_devices();
    })
    .catch(function (err) {
      console.log(err.name + ': ' + err.message);
    });
}

function media_reset() {
  console.log('media_reset');
  remove_media_panes();
  media_enum();
}

function save_others(fn) {
  // a_ui.patches.imedia
  let imd = {};
  for (let ent of a_ui.patches) {
    let imedia = ent.isrc.imedia;
    if (imd[imedia]) {
      continue;
    }
    imd[imedia] = true;
    save_other(fn, imedia);
  }
}

function save_other(fn, imedia) {
  console.log('save_other idev', imedia);
  let vent = a_media_panes[imedia];
  if (!vent) return;
  let vin = vent.capture;
  if (!vin) return;
  let img = vin.get();
  image_scaled(img);
  saveCanvas(fn + '_v' + imedia, 'png');
}
