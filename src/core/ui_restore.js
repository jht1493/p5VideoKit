// Restore a_ui settings from local storage
function ui_restore(sizeResult) {
  let start = window.performance.now();
  effectMeta_init(() => {
    ui_capture_init();
    ui_canvas_init();
    ui_render_init();
    store_name_restore();
    store_url_parse((urlResult) => {
      if (!urlResult.uiSet) {
        store_restore_ver();
        store_restore_canvas_lock();
        store_restore_a_ui(urlResult.settings);
      }
      ui_restore_imports(start, sizeResult);
    });
  });
}

function ui_restore_imports(start, sizeResult) {
  ui_load_imports_patches(() => {
    sizeResult(canvas_size_default());

    let lapse = window.performance.now() - start;
    console.log('ui_restore lapse', lapse);
  });
}

function ui_load_imports_patches(done) {
  let imports = [];
  for (let patch of a_ui.patches) {
    if (patch.eff_src.eff_label === 'import') {
      imports.push(patch_import(patch));
    }
  }
  Promise.allSettled(imports).then(done);
}

function patch_import(patch) {
  let npath = patch.eff_inits.path;
  if (!npath) return;
  let inpath = '../' + npath;
  if (!inpath.endsWith('.js')) {
    inpath += '.js';
  }
  console.log('patch_import inpath', inpath);
  return new Promise((resolve, reject) => {
    import(inpath)
      .then((module) => {
        // console.log('patch_import module', module, '\n inpath', inpath);
        // console.log('patch_import inpath', inpath);
        patch.import_factory = module.default;
        resolve();
      })
      .catch((err) => {
        console.log('patch_import err', err, '\n inpath', inpath);
        a_import_err = err;
        patch.import_factory = eff_import_failed;
        reject();
      });
  });
}

class eff_import_failed {
  static meta_props = {
    err: {
      message: 'import not found',
    },
  };
  constructor(props) {
    Object.assign(this, props);
  }
  render() {}
}

function store_restore_canvas_lock() {
  let val = store_get('a_canvas_size_lock');
  if (val) {
    a_canvas_size_lock = parseFloat(val);
  }
}

function store_restore_a_ui(settings) {
  console.log('store_restore_a_ui settings', settings);
  // Force pads to be re-calculated
  a_ui.urects_count = 0;
  a_ui.urects_lock = 0;
  if (settings) {
    store_restore_settings(settings);
  } else {
    store_restore_store_get();
  }
  if (a_chat_name) {
    a_ui.chat_name = a_chat_name;
  }
}

function store_restore_settings(settings) {
  a_ui = settings;
  if (a_hideui) {
    let delay = 3000;
    setTimeout(ui_present_window, delay);
  }
}

function store_restore_store_get() {
  for (prop in a_ui) {
    let valu = store_get('a_ui_' + prop);
    if (valu !== null) {
      valu = JSON.parse(valu);
      if (Array.isArray(valu)) {
        valu = valu[0];
        a_ui[prop] = valu;
      } else {
        console.log('a_ui_restore skipping prop=' + prop + ' valu=' + valu);
      }
      // console.log('a_ui_restore prop', prop, 'valu', valu);
    }
  }
}

function store_restore_ver() {
  let ver = store_get('a_store_ver');
  if (ver !== a_store_ver) {
    console.log('a_ui_restore reset ver=' + ver);
    store_set('a_store_ver', a_store_ver);
    // Version diff, clear out all properties
    for (prop in a_ui) {
      store_remove(prop);
    }
  }
}

// Set a ui property that's stored into local storage
function a_ui_set(prop, value) {
  a_ui[prop] = value;
  let str = JSON.stringify([value]);
  store_set('a_ui_' + prop, str);
}

// Get or set a ui property that's stored into local storage
function a_ui_ref(prop, value) {
  if (value === undefined) {
    return a_ui[prop];
  } else {
    a_ui[prop] = value;
    let str = JSON.stringify([value]);
    store_set('a_ui_' + prop, str);
  }
}

// Return prefixed property name
// eg.
function store_ref(prop) {
  // Store-A
  // 0123456
  return a_store_prefix + a_store_name.substring(6, 7) + prop.substring(1);
}

function store_set(prop, value) {
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
