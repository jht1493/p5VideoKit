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
    return a_effectMetas[0];
  }
  let effMeta = a_effectMetas_dict[label];
  if (!effMeta) {
    console.log('effectMeta_find label not found', label);
    effMeta = a_effectMetas[0];
  }
  return effMeta;
}
