import pkg from 'fs-extra';
const { existsSync, readdirSync, lstatSync, writeFileSync } = pkg;
import { join } from 'path';

// create listing for dynanmic import of effect modules
//  'videoKit/let/a_effectMetas.js'
// based on js files in mods directory
// mods=videoKit directory for modules
//  videoKit/eff*
//
export default function build_effectMetas(effectMetasPath, src_path, mods) {
  const effectModPath = join(src_path, mods);
  //
  if (!existsSync(effectModPath)) {
    console.log('build_effectMetas not effectModPath', effectModPath);
    return;
  }
  const dirs = readdirSync(effectModPath);
  dirs.sort();
  // console.log(dir, files);
  let imparts = [];
  for (let dir of dirs) {
    // dir = eff, eff2
    if (dir.substring(0, 1) == '.') continue;
    if (!dir.startsWith('eff')) continue;

    let dpath = join(effectModPath, dir);
    // dpath = mods/eff
    if (!lstatSync(dpath).isDirectory()) {
      continue;
    }
    const files = readdirSync(dpath);
    if (!files) {
      continue;
    }
    files.sort();
    files.map((ent) => {
      if (ent.endsWith('.js')) {
        let pos = ent.lastIndexOf('.');
        let nent = ent.substring(0, pos);
        let npos = nent.indexOf('_');
        let label = nent.substring(npos + 1);
        let npath = dir + '/' + ent;
        // imparts.push(dir + '/' + nent);
        imparts.push({ label, npath });
      }
    });
  }
  imparts.sort((item1, item2) => item1.label.localeCompare(item2.label));
  // console.log('imparts', imparts);
  // imparts [ 'eff/eff_bestill',    'eff/eff_bodypix'
  // avoid JSON.stringify to get one per line
  let ents = imparts.map((ent) => {
    let import_path = mods + '/' + ent.npath;
    // let pos = ent.npath.indexOf('_');
    let label = ent.label;
    return `{ label: '${label}', import_path: '${import_path}' },`;
  });
  // console.log('ents', ents);
  let str = `// !!@ Generated File
export let a_effectMetas =  [
${ents.join('\n')}
];
`;
  writeFileSync(effectMetasPath, str);
  console.log(mods + '/effs*', ents.length);
}

// EffectRef
// { label, factory, path }

// let a_effectMetas = [
//    { label: 'show', factory: eff_show_pad },
//    { label: 'bestill', import_path: 'eff/eff_bestill' },
// ];
//
