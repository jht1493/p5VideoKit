function ui_render(div) {
  // console.log('ui_canvas');
  render_size();

  function render_size() {
    div.child(createSpan(' Render Size: '));
    let aSel = createSelect();
    div.child(aSel);
    for (let se of a_render_sizes) {
      aSel.option(se.label);
    }
    aSel.selected(a_ui.render_size);
    aSel.changed(function () {
      let label = this.value();
      let se = a_render_sizes_dict[label];
      a_ui_set('render_size', se.label);
      // resizeCanvas(se.width, se.height);
      // ui_window_refresh();
    });
  }
}

let a_render_sizes_dict;

function ui_render_init() {
  a_render_sizes_dict = init_size_in(a_render_sizes);
}

function render_size_default() {
  let sz = a_render_sizes_dict[a_ui.render_size];
  // console.log('render_sizei index', a_ui.render_sizei, 'size', sz);
  if (sz) return sz;
  return a_render_sizes[0];
}

let a_render_sizes = [
  {
    label: 'Canvas',
  },
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
];
