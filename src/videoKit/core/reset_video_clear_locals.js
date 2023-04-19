import { ui_message } from '../core-ui/a_ui_create.js?v={{vers}}';
import { location_noquery } from '../core/store_url_parse.js?v={{vers}}';

// On first use in browser sometimes camera permissions
// are not requested and no video is displayed.
// This simple use of createCapture appears to trigger permissions
let myVideo;
export function reset_video_clear_locals(storen) {
  ui_message('Resetting Configuration', { initTimer: 1 });
  localStorage.clear();
  if (storen) {
    localStorage.setItem('a_.store_name', storen);
  }
  let vconstraints = {
    video: true,
  };
  myVideo = createCapture(vconstraints, function (stream) {
    console.log('reset_video_clear_locals create_video stream', stream);
  });
  console.log('reset_video_clear_locals create_video myVideo', myVideo);
  myVideo.muted = true;
  function wait_reload() {
    let delay = 2000;
    // let delay = 1000;
    function func() {
      let nref = (random() + '').substring(2);
      nref = location_noquery() + '?v=' + nref;
      // ui_message('');
      window.location = nref;
      // console.log('nref', nref);
    }
    setTimeout(func, delay);
  }
  function alert_reload() {
    window.alert('reloading page');
    let nref = document.location.href + '?v=' + random();
    window.location.href = nref;
  }
  wait_reload();
}
