const fs = require('fs-extra');
const path = require('path');

// 'let/a_effectMetas.js'
// 'mods'
//
function build_effectMetas(effectMetasPath, effectModPath) {
  //
  if (!fs.existsSync(effectModPath)) {
    console.log('build_effectMetas not effectModPath', effectModPath);
    return;
  }
  const dirs = fs.readdirSync(effectModPath);
  dirs.sort();
  // console.log(dir, files);
  let imparts = [];
  for (let dir of dirs) {
    // dir = eff, eff2
    if (dir.substring(0, 1) == '.') continue;

    let dpath = path.join(effectModPath, dir);
    // dpath = mods/eff
    if (!fs.lstatSync(dpath).isDirectory()) {
      continue;
    }
    const files = fs.readdirSync(dpath);
    if (!files) {
      continue;
    }
    files.sort();
    files.map((ent) => {
      if (ent.endsWith('.js')) {
        let pos = ent.lastIndexOf('.');
        let nent = ent.substring(0, pos);
        imparts.push(dir + '/' + nent);
      }
    });
  }
  // console.log('imparts', imparts);
  let ents = imparts.map((ent) => {
    let pos = ent.indexOf('_');
    let label = ent.substring(pos + 1);
    return `{ label: '${label}', import_path: '${ent}' },`;
  });
  // console.log('ents', ents);
  let str = `// !!@ Generated File
  let a_effectMetas = [
  ${ents.join('\n')}
  ]
  `;
  fs.writeFileSync(effectMetasPath, str);
  console.log('mods', ents.length);
}

module.exports = build_effectMetas;

// EffectRef
// { label, factory, path }

// let a_effectMetas = [
//    { label: 'show', factory: eff_show_pad },
//    { label: 'bestill', import_path: 'eff/eff_bestill' },
// ];
//
