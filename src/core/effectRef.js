let a_effectRefs_dict;
let a_import_err;

function effectRef_init(done) {
  a_effectRefs_dict = {};
  let imports = [];
  let index = 0;
  for (let effRef of a_effectRefs) {
    a_effectRefs_dict[effRef.label] = effRef;
    effRef.index = index;
    if (!effRef.factory) {
      imports.push(effectRef_import(effRef));
    }
    index++;
  }
  Promise.allSettled(imports).then(done);
}

function effectRef_import(effRef) {
  let inpath = '../mods/' + effRef.import_path + '.js';
  // console.log('effectRef_import', inpath);
  return new Promise((resolve, reject) => {
    import(inpath)
      .then((module) => {
        // console.log('effectRef_import module', module, '\n effRef.import_path', effRef.import_path);
        console.log('effRef.import_path', effRef.import_path);
        effRef.factory = module.default;
        resolve();
      })
      .catch((err) => {
        console.log('effectRef_import err', err, '\n inpath', inpath);
        a_import_err = err;
        reject();
      });
  });
}

function effectRef_find(label) {
  if (!label) {
    return a_effectRefs[0];
  }
  let effRef = a_effectRefs_dict[label];
  if (!effRef) {
    console.log('effectRef_find label not found', label);
    effRef = a_effectRefs[0];
  }
  return effRef;
}
