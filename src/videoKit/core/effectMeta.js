import { a_ } from '../let/a_ui.js?v=118';

let a_effectMetaDict;
let a_import_err;

export function effectMeta_init(donef) {
  a_effectMetaDict = {};
  let imports = [];
  let index = 0;
  for (let effMeta of a_.effectMetas) {
    a_effectMetaDict[effMeta.label] = effMeta;
    effMeta.index = index;
    if (!effMeta.factory) {
      imports.push(effectMeta_import(effMeta));
    }
    index++;
  }
  Promise.allSettled(imports).then(donef);
}

export function effectMeta_import(effMeta) {
  let inpath = '../../' + effMeta.import_path;
  // console.log('effectMeta_import', inpath);
  return new Promise((resolve, reject) => {
    import(inpath + '?v=118')
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

export function effectMeta_find(label) {
  if (!label) {
    console.log('effectMeta_find no label', label);
    label = 'show';
    // return a_.effectMetas[0];
  }
  let effMeta = a_effectMetaDict[label];
  if (!effMeta) {
    console.log('effectMeta_find label not found', label);
    effMeta = a_.effectMetas[0];
  }
  return effMeta;
}

export function factory_prop_inits(factory, init_props = {}) {
  let dict = factory.meta_props;
  // console.log('factory_prop_inits dict', dict);
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
  // console.log('factory_prop_inits inits', inits);
  return inits;
}
