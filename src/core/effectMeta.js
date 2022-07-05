let a_effectMetas_dict;
let a_import_err;

function effectMeta_init(done) {
  a_effectMetas_dict = {};
  let imports = [];
  let index = 0;
  for (let effRef of a_effectMetas) {
    a_effectMetas_dict[effRef.label] = effRef;
    effRef.index = index;
    if (!effRef.factory) {
      imports.push(effectMeta_import(effRef));
    }
    index++;
  }
  Promise.allSettled(imports).then(done);
}

function effectMeta_import(effRef) {
  let inpath = '../mods/' + effRef.import_path + '.js';
  // console.log('effectMeta_import', inpath);
  return new Promise((resolve, reject) => {
    import(inpath)
      .then((module) => {
        // console.log('effectMeta_import module', module, '\n effRef.import_path', effRef.import_path);
        // console.log('effRef.import_path', effRef.import_path);
        effRef.factory = module.default;
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
    return a_effectMetas[0];
  }
  let effRef = a_effectMetas_dict[label];
  if (!effRef) {
    console.log('effectMeta_find label not found', label);
    effRef = a_effectMetas[0];
  }
  return effRef;
}
