let a_effectMetas_dict;
let a_import_err;

function effectMeta_init(done) {
  a_effectMetas_dict = {};
  let imports = [];
  let index = 0;
  for (let effMeta of a_effectMetas) {
    a_effectMetas_dict[effMeta.label] = effMeta;
    effMeta.index = index;
    if (!effMeta.factory) {
      imports.push(effectMeta_import(effMeta));
    }
    index++;
  }
  Promise.allSettled(imports).then(done);
}

function effectMeta_import(effMeta) {
  let inpath = '../mods/' + effMeta.import_path + '.js';
  // console.log('effectMeta_import', inpath);
  return new Promise((resolve, reject) => {
    import(inpath)
      .then((module) => {
        // console.log('effectMeta_import module', module, '\n effMeta.import_path', effMeta.import_path);
        // console.log('effMeta.import_path', effMeta.import_path);
        effMeta.factory = module.default;
        resolve();
      })
      .catch((err) => {
        console.log('effectMeta_import err', err, '\n inpath', inpath);
        a_import_err = err;
        reject();
      });
  });
}

function effectMeta_find(label) {
  if (!label) {
    console.log('effectMeta_find no label', label);
    return a_effectMetas[0];
  }
  let effMeta = a_effectMetas_dict[label];
  if (!effMeta) {
    console.log('effectMeta_find label not found', label);
    effMeta = a_effectMetas[0];
  }
  return effMeta;
}

function factory_prop_inits(factory, init_props) {
  let dict = factory.meta_props;
  let inits = Object.assign({}, init_props);
  for (let prop in dict) {
    // eg. items = factor: [10, 50, 100 ... ]
    let items = dict[prop];
    if (prop.substring(0, 1) === '_') {
      prop = prop.substring(1);
    }
    if (Array.isArray(items)) {
      // eg. items = factor: [10, 50, 100 ... ]
      inits[prop] = items[0];
    } else {
      // eg: _next: { button: next_action }
    }
  }
  return inits;
}
