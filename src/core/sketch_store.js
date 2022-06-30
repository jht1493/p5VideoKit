// Restore a_ui settings from local storage
// function ui_restore(isize) {
function ui_restore(sizeResult) {
  ui_capture_init();
  ui_canvas_init();
  store_name_restore();
  store_url_parse((urlResult) => {
    if (!urlResult.uiSet) {
      store_restore_ver();
      store_restore_canvas_lock();
      store_restore_a_ui(urlResult.settings);
    }
    sizeResult(canvas_size_default());
  });
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
  a_ui.pads_count = 0;
  a_ui.pads_lock = 0;
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
