import { a_ } from '../let/a_ui.js';
import { a_effectMetas } from '../let/a_effectMetas.js';
import { a_settingMetas } from '../let/a_settingMetas.js';
import { effectMeta_init } from '../core/effectMeta.js';
import { ui_capture_init } from '../core-ui/ui_capture.js';
import { ui_canvas_init } from '../core-ui/ui_canvas.js';
import { ui_render_size_init } from '../core-ui/ui_render.js';
import { store_name_restore, store_url_parse } from '../core/store_url_parse.js';
import { canvas_size_default } from '../core-ui/ui_canvas.js';

//
// let effects = [
//   { label: 'example', import_path: 'module/eff_example', menu: 1 },

// Restore a_.ui settings from local storage
export function ui_restore(effects, settings, sizeResult) {
  let start = window.performance.now();

  a_effectMetas.value = effects.concat(a_effectMetas.value);
  a_settingMetas.value = settings.concat(a_settingMetas.value);

  effectMeta_init(() => {
    settingMetas_init(() => {
      ui_capture_init();
      ui_canvas_init();
      ui_render_size_init();
      store_name_restore();
      store_url_parse((urlResult) => {
        if (!urlResult.uiSet) {
          store_restore_ver();
          store_restore_canvas_lock();
          store_restore_ui(urlResult.settings);
        }
        // ui_restore_imports(start, sizeResult);
        sizeResult(canvas_size_default());

        let lapse = window.performance.now() - start;
        console.log('ui_restore lapse', lapse);
      });
    });
  });
}

function settingMetas_init(donef) {
  a_.settings = [{ setting: '' }];
  let imports = [];
  let index = 0;
  for (let sete of a_settingMetas.value) {
    imports.push(setting_import(sete, index));
    index++;
  }
  // console.log('settingMetas_init imports', imports);
  Promise.allSettled(imports).then(() => {
    donef();
  });
}

// set = { label: '0-club', import_path: 'settings/baked/0-club.json' }
//
function setting_import(sete, index) {
  let url = './' + sete.import_path;
  // console.log('setting_import url', url);
  return new Promise((resolve, reject) => {
    loadJSON(
      url,
      (setting) => {
        // console.log('setting_import setting', setting);
        setting.setting = sete.label;
        a_.settings[index] = setting;
        resolve();
      },
      (err) => {
        console.log('setting_import error url', url, 'error', err);
        reject(err);
      }
    );
  });
}

function store_restore_canvas_lock() {
  let val = store_get('a_.canvas_size_lock');
  if (val) {
    a_.canvas_size_lock = parseFloat(val);
  }
}

function store_restore_ui(settings) {
  console.log('store_restore_ui settings', settings);
  // Force pads to be re-calculated
  a_.ui.urects_count = 0;
  a_.ui.urects_lock = 0;
  if (settings) {
    store_restore_settings(settings);
  } else {
    store_restore_store_get();
  }
  if (a_.chat_name) {
    a_.ui.chat_name = a_.chat_name;
  }
}

function store_restore_settings(settings) {
  a_.ui = settings;
  if (a_.hideui) {
    let delay = 3000;
    setTimeout(ui_present_window, delay);
  }
}

function store_restore_store_get() {
  for (let prop in a_.ui) {
    let valu = store_get('a_.ui_' + prop);
    if (valu !== null) {
      valu = JSON.parse(valu);
      if (Array.isArray(valu)) {
        valu = valu[0];
        a_.ui[prop] = valu;
      } else {
        console.log('store_restore_store_get skipping prop=' + prop + ' valu=' + valu);
      }
      // console.log('store_restore_store_get prop', prop, 'valu', valu);
    }
  }
}

function store_restore_ver() {
  let ver = store_get('a_.store_ver');
  if (ver !== a_.store_ver) {
    console.log('store_restore_ver reset ver=' + ver);
    store_set('a_.store_ver', a_.store_ver);
    // Version diff, clear out all properties
    for (let prop in a_.ui) {
      store_remove(prop);
    }
  }
}

// Set a ui property that's stored into local storage
export function ui_prop_set(prop, value) {
  a_.ui[prop] = value;
  let str = JSON.stringify([value]);
  store_set('a_.ui_' + prop, str);
}

// Get or set a ui property that's stored into local storage
function ui_prop_ref(prop, value) {
  if (value === undefined) {
    return a_.ui[prop];
  } else {
    a_.ui[prop] = value;
    let str = JSON.stringify([value]);
    store_set('a_.ui_' + prop, str);
  }
}

// Return prefixed property name
// eg.
function store_ref(prop) {
  // Store-A
  // 0123456
  return a_.store_prefix + a_.store_name.substring(6, 7) + prop.substring(1);
}

export function store_set(prop, value) {
  localStorage.setItem(store_ref(prop), value);
}

function store_get(prop) {
  return localStorage.getItem(store_ref(prop));
}

function store_remove(prop) {
  return localStorage.removeItem(store_ref(prop));
}

function store_clear_all() {
  localStorage.clear();
}
