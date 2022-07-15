import { a_ } from '../let/a_ui.js?v=128';
import { ui_prop_set } from '../core/ui_restore.js?v=128';
import { patch_inst_clear } from '../core/patch_inst.js?v=128';

// a_.mediaDivs = []
// { imedia, mediaDevice, id, label, div, chk, vis, capture, info, ready, livem }
// 0: canvas
// 1: first local device
// 2: livem device for self
// 3: livem device for others ...

export function create_mediaDiv(mediaDevice, options) {
  // let vis_in = !a_.hideui; // default to visible except if ui hidden
  let addSort = options.live;
  let vis_in = 0; // default to not visible, more stable on mobile
  let capture = mediaDevice.capture;
  let id = mediaDevice.deviceId;
  let label = mediaDevice.label;
  if (!label) label = id;
  let imedia = a_.mediaDivs.length;
  let media_state = ui_media_state_default(imedia, vis_in);

  // Can't re-parent capture, so move div before it
  let div = createDiv();
  capture.elt.parentNode.insertBefore(div.elt, capture.elt);

  if (a_.hideui) {
    div.hide();
  }

  let chk = createCheckbox('View', media_state.vis);
  chk.style('display:inline');
  div.child(chk);

  let chk_mute = createCheckbox('Mute', media_state.mute);
  chk_mute.style('display:inline');
  div.child(chk_mute);

  // !!@ find video event change to update width and height in info element
  let info = createSpan();
  div.child(info);

  let ready = function () {
    return capture.loadedmetadata && capture.width > 0 && capture.height > 0;
  };

  let update_info = function () {
    let info = ent.info;
    let capture = ent.capture;
    let label = ent.label;
    if (ent.nlabel) {
      label = '[' + ent.nlabel + '] ' + ent.label;
    }
    info.html(' ' + label + ' width=' + capture.width + ' height=' + capture.height);
    capture.style(ent.media_state.vis ? 'display:inline' : 'display:none');
    capture.elt.muted = ent.media_state.mute;
  };

  let ent = {
    imedia,
    mediaDevice,
    id,
    label,
    div,
    chk,
    media_state,
    capture,
    info,
    ready,
    update_info,
  };

  // place new mediaDiv in right order
  let arr = a_.mediaDivs;
  if (!addSort) {
    // No live media yet, Add at end
    arr.push(ent);
    a_.lastMediaDivIndex = arr.length;
    // console.log('a_.lastMediaDivIndex', a_.lastMediaDivIndex);
  } else {
    // For live media, add the new entry in sort order by id
    //  to keep entries in same order between reloads
    let index = a_.lastMediaDivIndex || 0;
    for (; index < arr.length; index++) {
      if (arr[index].id > id) {
        break;
      }
    }
    arr.splice(index, 0, ent);
    patch_inst_clear();
  }
  // a_.mediaDivs.push(ent);

  update_info();

  chk.changed(function () {
    ent.media_state.vis = this.checked() ? 1 : 0;
    ui_media_state_update(ent.imedia);
    update_info();
  });

  chk_mute.changed(function () {
    ent.media_state.mute = this.checked() ? 1 : 0;
    // console.log(ent.imedia, 'chk_mute.changed ent.capture.elt.muted', ent.capture.elt.muted);
    ent.capture.elt.muted = ent.media_state.mute;
    // console.log(ent.imedia, 'chk_mute.changed ent.media_state.mute', ent.media_state.mute);
    ui_media_state_update(ent.imedia);
  });

  // !!@ causes removeDomElement failure
  // div.child(capture);
}

function find_media_by_id(id) {
  if (!id) return null;
  return a_.mediaDivs.find((item) => item.id === id);
}

function remove_media_by_id(id) {
  a_.mediaDivs = a_.mediaDivs.filter((item) => item.id !== id);
  console.log('remove_media_by_id id=', id);
  // console.log('remove_media_by_id id=', id, 'a_.mediaDivs', a_.mediaDivs);
  // tile_notify_media_update({ remove: id });
}

export function remove_mediaDivs() {
  // Remove all but first
  for (let index = a_.mediaDivs.length - 1; index > 0; index--) {
    let ent = a_.mediaDivs[index];
    remove_mediaDiv(ent.id);
  }
}

export function remove_mediaDiv(id) {
  // console.log('remove_mediaDiv id=', id, !id);
  // Remove the div associated with id
  let ent = find_media_by_id(id);
  console.log('remove_mediaDiv ent', ent);
  if (ent) {
    ent.div.remove();
    ent.capture.remove();
  }
  remove_media_by_id(id);
}

export function attach_media_nlabel(id, nlabel) {
  let ent = a_.mediaDivs.find((item) => item.id === id);
  if (ent) {
    ent.nlabel = nlabel;
    if (ent.update_info) ent.update_info();
  }
}

export function init_mediaDivs() {
  // First media pane is canvas
  a_.mediaDivs = [
    {
      label: 'Canvas',
      capture: a_.my_canvas,
      ready: function () {
        return 1;
      },
    },
  ];
}

// return a reference to mediaDiv_state entry, ui will modify directly
function ui_media_state_default(imedia, vis) {
  let ent = a_.ui.mediaDiv_states[imedia];
  if (ent) {
    ent.vis = ent.vis ? 1 : 0;
    if (typeof ent.mute === 'undefined') ent.mute = 1;
    ent.mute = ent.mute ? 1 : 0;
    return ent;
  }
  let mute = 1;
  ent = { vis, mute };
  a_.ui.mediaDiv_states[imedia] = ent;
  ui_prop_set('mediaDiv_states', a_.ui.mediaDiv_states);
  return ent;
}

// imedia is not used. entire mediaDiv_state is updated to local storage
function ui_media_state_update(imedia) {
  ui_prop_set('mediaDiv_states', a_.ui.mediaDiv_states);
}
