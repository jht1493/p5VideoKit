import { a_ } from '../let/a_ui.js?v={{vers}}';
import { create_mediaDiv, remove_mediaDivs } from '../core/create_mediaDiv.js?v={{vers}}';
import { get_capture_size } from '../core-ui/ui_capture.js?v={{vers}}';
import { livem_restore } from '../core-ui/ui_live.js?v={{vers}}';
import { ui_refresh } from '../core-ui/ui_patch.js?v={{vers}}';

export let a_mediaDevices = [];

// mediaDevice
//  { label, deviceId, capture, stream }

function create_mediaDevices() {
  for (let mediaDevice of a_mediaDevices) {
    init_device_capture(mediaDevice);
    create_mediaDiv(mediaDevice, { live: 0 });
  }
  ui_refresh();

  function init_device_capture(mediaDevice) {
    let vcap = {
      audio: true,
      video: {
        deviceId: { exact: mediaDevice.deviceId },
      },
    };
    let dim = get_capture_size();
    if (dim) {
      vcap.video.width = { exact: dim.width };
      vcap.video.height = { exact: dim.height };
    }
    let capture = createCapture(vcap, function (stream) {
      mediaDevice.stream = stream;
      livem_restore();
    });
    capture.elt.muted = true;
    mediaDevice.capture = capture;
  }
}

export function media_enum() {
  a_mediaDevices = [];
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
          a_mediaDevices.push({ label, deviceId });
        }
      });
      // console.log('a_mediaDevices', a_mediaDevices);
      create_mediaDevices();
    })
    .catch(function (err) {
      console.log(err.name + ': ' + err.message);
    });
}

export function media_reset() {
  console.log('media_reset');
  remove_mediaDivs();
  media_enum();
}

// Save image of each media device = camera or live stream
function save_others(fn) {
  // a_.ui.patches.imedia
  let imd = {};
  for (let ent of a_.ui.patches) {
    let imedia = ent.eff_spec.imedia;
    if (imd[imedia]) {
      continue;
    }
    imd[imedia] = true;
    save_other(fn, imedia);
  }
}

function save_other(fn, imedia) {
  console.log('save_other idev', imedia);
  let vent = a_.mediaDivs[imedia];
  if (!vent) return;
  let vin = vent.capture;
  if (!vin) return;
  let img = vin.get();
  image_scaled(img);
  saveCanvas(fn + '_v' + imedia, 'png');
}
