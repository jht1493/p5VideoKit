function ui_capture_size(div) {
  // console.log('ui_capture_size');
  div.child(createSpan(' Capture Size: '));
  let aSel = createSelect();
  div.child(aSel);
  for (let se of a_capture_sizes) {
    aSel.option(se.label);
  }
  aSel.selected(a_ui.capture_size);
  aSel.changed(function () {
    let label = this.value();
    let se = a_capture_sizes_dict[label];
    a_ui_set('capture_size', se.label);
    media_reset();
    ui_reset();
  });
}

let a_capture_sizes_dict;

function ui_capture_init() {
  a_capture_sizes_dict = init_size_in(a_capture_sizes);
}

let a_capture_sizes = [
  {
    width: 320,
    height: 240,
  },
  {
    width: 480,
    height: 270,
  },
  {
    width: 640,
    height: 480,
  },
  {
    width: 960,
    height: 540,
  },
  {
    width: 1920,
    height: 1080,
  },
  {
    width: 20,
    height: 15,
  },
  {
    width: 40,
    height: 30,
  },
  {
    width: 80,
    height: 60,
  },
  {
    width: 160,
    height: 120,
  },
];

function get_capture_size() {
  let se = a_capture_sizes_dict[a_ui.capture_size];
  // console.log('get_capture_size index', a_ui.capture_sizei, 'se', se);
  return se;
}
