let a_media_panes = [];
// { imedia, device, id, label, div, chk, vis, capture, info, ready }
// 0: canvas
// 1: first local device
// 2: livem device for self
// 3: livem device for others ...

function create_media_pane(device, vis_in) {
  let capture = device.capture;
  let id = device.deviceId;
  let label = device.label;
  if (!label) label = id;
  let imedia = a_media_panes.length;
  let vis = ui_media_default_vis(imedia, vis_in);

  // Can't re-parent capture, so move div before it
  let div = createDiv();
  capture.elt.parentNode.insertBefore(div.elt, capture.elt);

  if (a_hideui) {
    div.hide();
  }

  let chk = createCheckbox('View', vis);
  chk.style('display:inline');
  div.child(chk);

  // !!@ find video event change to update width and height in info element
  let info = createSpan();
  div.child(info);

  function ready() {
    return capture.loadedmetadata;
  }

  let ent = {
    imedia,
    device,
    id,
    label,
    div,
    chk,
    vis,
    capture,
    info,
    ready,
    update_info,
  };
  a_media_panes.push(ent);

  function update_info() {
    let info = ent.info;
    let capture = ent.capture;
    let label = ent.label;
    if (ent.nlabel) {
      label = '[' + ent.nlabel + '] ' + ent.label;
    }
    info.html(' ' + label + ' width=' + capture.width + ' height=' + capture.height);
    capture.style(ent.vis ? 'display:inline' : 'display:none');
  }
  update_info();

  chk.changed(function () {
    ent.vis = this.checked();
    ui_media_update_vis(ent.imedia, ent.vis);
    update_info();
    // capture.style(ent.vis ? 'display:inline' : 'display:none');
    // console.log('capture width', capture.width, 'height', capture.height);
  });
  // !!@ causes removeDomElement failure
  // div.child(capture);
}

function find_media_by_id(id) {
  if (!id) return null;
  return a_media_panes.find((item) => item.id === id);
}

function remove_media_by_id(id) {
  a_media_panes = a_media_panes.filter((item) => item.id !== id);
  console.log('remove_media_by_id id=', id);
  // console.log('remove_media_by_id id=', id, 'a_media_panes', a_media_panes);
  // tile_notify_media_update({ remove: id });
}

function remove_media_panes() {
  // Remove all but first
  for (let index = a_media_panes.length - 1; index > 0; index--) {
    let ent = a_media_panes[index];
    remove_media_pane(ent.id);
  }
}

function remove_media_pane(id) {
  // console.log('remove_media_pane id=', id, !id);
  // Remove the div associated with id
  let ent = find_media_by_id(id);
  console.log('remove_media_pane ent', ent);
  if (ent) {
    ent.div.remove();
    ent.capture.remove();
  }
  remove_media_by_id(id);
}

function attach_media_nlabel(id, nlabel) {
  let ent = a_media_panes.find((item) => item.id === id);
  if (ent) {
    ent.nlabel = nlabel;
    if (ent.update_info) ent.update_info();
  }
}

function init_media_panes() {
  // First media pane is canvas
  a_media_panes = [
    {
      label: 'Canvas',
      capture: my_canvas,
      ready: function () {
        return 1;
      },
    },
  ];
}

function ui_media_default_vis(imedia, vis) {
  // let vis = default_vis;
  let ent = a_ui.medias[imedia];
  if (ent) {
    return ent.vis;
  }
  a_ui.medias[imedia] = { vis };
  a_ui_set('medias', a_ui.medias);
  return vis;
}

function ui_media_update_vis(imedia, vis) {
  a_ui.medias[imedia].vis = vis;
  a_ui_set('medias', a_ui.medias);
}
