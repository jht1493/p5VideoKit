import pkg from 'fs-extra';
const { existsSync, readdirSync, lstatSync } = pkg;
import { join } from 'path';

import { writeSrcBuildFile } from './enum_files.js';

// create listing for dynanmic import of effect modules
//  'videoKit/let/a_effectMetas.js'
// based on js files in mods directory
// mods=videoKit/effects directory for modules
//
export default function build_effectMetas(src_path, effectMetasPath, mods) {
  const effectModPath = join(src_path, mods);
  //
  if (!existsSync(effectModPath)) {
    console.log('build_effectMetas not effectModPath', effectModPath);
    return;
  }
  const dirs = readdirSync(effectModPath);
  // dirs.sort();
  // console.log(dir, files);
  let imparts = [];
  for (let dir of dirs) {
    // dir = aset
    if (dir.substring(0, 1) == '.') continue;
    // if (!dir.startsWith('eff')) continue;

    let dpath = join(effectModPath, dir);
    // dpath = videoKit/effects/aset
    if (!lstatSync(dpath).isDirectory()) {
      continue;
    }
    const files = readdirSync(dpath);
    if (!files) {
      continue;
    }
    // files.sort();
    files.map((ent) => {
      if (ent.endsWith('.js')) {
        let pos = ent.lastIndexOf('.');
        let nent = ent.substring(0, pos);
        let npos = nent.indexOf('_');
        let label = nent.substring(npos + 1);
        let npath = dir + '/' + ent;
        let ui_label = dir + '/' + label;
        // npath=aset/eff_bestill.js
        imparts.push({ label, npath, ui_label });
      }
    });
  }
  imparts.sort((item1, item2) => item1.ui_label.localeCompare(item2.ui_label));
  // console.log('imparts', imparts);
  // imparts [ 'eff/eff_bestill',    'eff/eff_bodypix'
  // avoid JSON.stringify to get one per line
  let ents = imparts.map((ent) => {
    let import_path = mods + '/' + ent.npath;
    // let pos = ent.npath.indexOf('_');
    let { label, ui_label } = ent;
    return `{ label: '${label}', import_path: '${import_path}', ui_label: '${ui_label}'},`;
  });
  // console.log('ents', ents);
  let str = `// !!@ Generated File
export let a_effectMetas =  [
${ents.join('\n')}
];
`;
  writeSrcBuildFile(src_path, effectMetasPath, str);
  console.log(mods + '/effs*', ents.length);
}

// EffectRef
// { label, factory, path }

// let a_effectMetas = [
//    { label: 'show', factory: eff_show_pad },
//    { label: 'bestill', import_path: 'eff/eff_bestill' },
// ];
//
