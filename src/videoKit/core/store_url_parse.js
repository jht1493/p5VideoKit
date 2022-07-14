import { a_ } from '../let/a_ui.js?v=124';
import { pad_layout_update } from '../core-ui/ui_patch.js?v=124';
import { ui_prop_set } from '../core/ui_restore.js?v=124';

// Are we setting up store from our url query?
// url parm
//  a = gather settings from param itself
//  u = store prefix
//  s = settings name, also hide ui by default
//  al/d = settings from json file
//  h = 0/1, explicit setting for hide ui
//
export function store_url_parse(urlResult) {
  let uiSet = 0;
  let settings;
  let loc = window.location.href;
  let ind = loc.indexOf('?');
  if (ind >= 0) {
    let query = loc.substring(ind + 1);
    // console.log('store_url_parse query', query);
    let params = params_query(query);
    // console.log('store_url_parse params', params);
    // settings encoded as json string, if present return true to avoid other settings init
    let a_str = params['a'];
    if (a_str) {
      uiSet = url_a_restore(a_str);
    }
    let u_str = params['u'];
    if (u_str) {
      a_.store_prefix = u_str;
      // console.log('a_.store_prefix', a_s.tore_prefix);
    }
    let s_str = params['s'];
    if (s_str) {
      console.log('store_url_parse s_str', s_str);
      let ent = a_.settings.find((ent) => ent.setting === s_str);
      settings = ent;
      console.log('store_url_parse settings', settings);
      a_.hideui = 1;
    }
    let h_str = params['h'];
    if (h_str) {
      a_.hideui = parseFloat(h_str);
    }
    let c_str = params['c'];
    if (c_str) {
      a_.chat_name = c_str;
    }
    // ?d=settings-sound/face-graph.json
    // ?d=settings-sound/face-posenet.json
    let d_str = params['al'] || params['d'];
    if (d_str) {
      if (d_str.startsWith('settings/')) {
        d_str = d_str.substring('settings/'.length);
      }
      let url = './settings/' + d_str;
      loadJSON(
        url,
        (settings) => {
          // console.log('d_str settings', settings);
          if (!settings.setting) {
            settings.setting = d_str;
          }
          urlResult({ uiSet, settings });
        },
        (err) => {
          console.log('loadJSON err', err);
          urlResult({ uiSet });
        }
      );
      return;
    }
  }
  urlResult({ uiSet, settings });
}

function url_a_restore(str) {
  // decode not Needed
  // str = decodeURIComponent(str);
  if (str) {
    // console.log('store_url_parse str');
    // console.log(str);
    let ui = JSON.parse(str);
    if (!ui) {
      // console.log('store_url_parse parse failed');
    } else {
      // console.log('store_url_parse ui', ui);
      a_.ui = ui;
      // Reflect url parameters in local storage
      for (let prop in a_.ui) {
        ui_prop_set(prop, a_.ui[prop]);
      }
      return 1;
    }
  }
  return 0;
}

export function location_noquery() {
  let loc = window.location.href;
  let ii = loc.indexOf('?');
  if (ii >= 0) {
    loc = loc.substring(0, ii);
  }
  return loc;
}

// Return current location a_.store_prefix
function location_url() {
  let loc = location_noquery();
  loc += '?';
  if (a_.store_prefix) {
    let ustr = encodeURIComponent(a_.store_prefix);
    loc += 'u=' + ustr + '&';
  }
  return loc;
}

export function store_export_json() {
  store_export(0);
}
export function store_export_url() {
  store_export(1);
}

function store_export(updateUrl) {
  pad_layout_update();
  let fn = a_.ui.setting || 'setting';
  saveJSON(a_.ui, fn);
  let str = JSON.stringify(a_.ui);
  // console.log('store_export str');
  // console.log(str);
  str = encodeURIComponent(str);
  let loc = location_url();
  loc += 'a=' + str;
  // console.log('loc', loc);
  if (updateUrl) {
    window.location = loc;
  }
}

export function store_name_restore() {
  let nstore = localStorage.getItem('a_.store_name');
  if (nstore) a_.store_name = nstore;
}

function store_name_update(name) {
  console.log('store_name_update', name);
  localStorage.setItem('a_.store_name', name);
  let loc = location_url();
  window.location = loc;
}

export function store_restore_from(ent) {
  console.log('store_restore_from ent', ent);
  store_restore_ent(ent);
  let loc = location_url();
  console.log('store_restore_from loc', loc);
  window.location = loc;
}

function store_restore_ent(ent) {
  // store_restore_create_eff_spec(ent);
  if (a_.canvas_size_lock) {
    // Canvas size is locked
    // Save reference pad per patch before we save in local storage
    for (let patch of ent.patches) {
      patch.eff_spec.urect_ref = Object.assign({}, patch.eff_spec.urect);
    }
  }
  // Save settings to local storage
  for (let prop in ent) {
    let nprop = prop;
    if (a_.canvas_size_lock) {
      if (prop === 'canvas_size') {
        // ui.canvas_size is replaced by a_.ui.canvas_resize_ref
        // to enable scaling relative to original canvas size
        nprop = 'canvas_resize_ref';
      } else if (prop === 'canvas_resize_ref') {
        continue;
      }
    }
    ui_prop_set(nprop, ent[prop]);
  }
  if (a_.canvas_size_lock) {
    // Force pad_layout_update
    ui_prop_set('urects_count', 0);
  } else {
    // Canvas is not locked
    // clear a_.ui.canvas_resize_ref to prevent scaling
    ui_prop_set('canvas_resize_ref', '');
  }
}

// "patches": [
//   {
//     "eff_spec": {
//       "ipatch": 0,
//       "imedia": 1,
//       "eff_label": "bestill",
//       "urect": {
//         "width": 1920,
//         "height": 1080,
//         "x0": 0,
//         "y0": 0
//       }
//     },
//     "eff_props": {
//       "factor": 200,
//       "mirror": 0
//     }
//   }
// ],

// let eff_spec_props = {
//   ipatch: 1,
//   imedia: 1,
//   eff_label: 1,
//   pad: 1,
//   urects_ref: 1,
//   ihide: 1,
//   ipipe: 1,
// };

// function store_restore_create_eff_spec(ent) {
//   // For prior version of patches recode to { src, eff }
//   let npatches = [];
//   for (let patch of ent.patches) {
//     if (patch.eff_spec) continue;
//     let eff_spec = {};
//     let eff = {};
//     for (let prop in patch) {
//       if (prop === 'ieff') continue;
//       if (eff_spec_props[prop]) {
//         eff_spec[prop] = patch[prop];
//       } else {
//         eff[prop] = patch[prop];
//       }
//     }
//     npatches.push({ eff_spec, eff });
//   }
//   if (npatches.length > 0) {
//     ent.patches = npatches;
//   }
// }

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

function params_query(query) {
  // eg. query='abc=foo&def=%5Basf%5D&xyz=5'
  // params={abc: "foo", def: "[asf]", xyz: "5"}
  const urlParams = new URLSearchParams(query);
  const params = Object.fromEntries(urlParams);
  return params;
}
