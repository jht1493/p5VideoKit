import pkg from 'fs-extra';
const { existsSync } = pkg;
import { join, parse } from 'path';
import { enum_files, writeSrcBuildFile } from './enum_files.js';

// create listing for dynanmic import of effect modules
//  'videoKit/let/a_effectMetas.js'
// based on js files in mods directory
// mods=videoKit/effects directory for modules
//
export default function build_effectMetas(args) {
  let { src_path, effectMetasPath, mods } = args;
  const effectModPath = join(src_path, mods);
  //
  if (!existsSync(effectModPath)) {
    console.log('build_effectMetas not effectModPath', effectModPath);
    return;
  }
  let files = enum_files(src_path, [mods]);

  let imports = [];

  for (let ent of files) {
    // console.log('build_effectMetas ent', ent);
    if (!ent) continue;
    const fparts = parse(ent);
    if (fparts.ext !== '.js') continue;
    if (!fparts.name.startsWith('eff_')) continue;

    // eff_name --> name
    let label = fparts.name;
    let npos = label.indexOf('_');
    label = label.substring(npos + 1);

    let ui_label = label;
    let import_path = ent;

    imports.push({ label, import_path, ui_label });
  }

  imports.sort((item1, item2) => item1.ui_label.localeCompare(item2.ui_label));

  // console.log('imports', imports);
  // imports [ 'eff/eff_bestill',    'eff/eff_bodypix'
  // avoid JSON.stringify to get one per line
  let ents = imports.map((ent) => {
    // let import_path = mods + '/' + ent.npath;
    // let pos = ent.npath.indexOf('_');
    let { label, ui_label, import_path } = ent;
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

  args.metas = ents;
}

// EffectRef
// { label, factory, path }

// let a_effectMetas = [
//    { label: 'show', factory: eff_show_pad },
//    { label: 'bestill', import_path: 'eff/eff_bestill' },
// ];
//
