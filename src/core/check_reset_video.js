// On first use in browser sometimes camera permissions
// are not requested and no video is displayed.
// This simple use of createCapture appears to trigger permissions
let myVideo;
function check_reset_video() {
  ui_message('Resetting Configuration');
  localStorage.clear();
  let vconstraints = {
    video: true,
  };
  myVideo = createCapture(vconstraints, function (stream) {
    console.log('create_video stream', stream);
  });
  console.log('create_video myVideo', myVideo);
  myVideo.muted = true;
  function wait_reload() {
    // let delay = 5000;
    let delay = 2000;
    function func() {
      let nref = (random() + '').substring(2);
      nref = location_noquery() + '?v=' + nref;
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
