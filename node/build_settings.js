import pkg from 'fs-extra';
const { readdirSync } = pkg;
import { join, parse } from 'path';

import { enum_files, writeSrcBuildFile } from './enum_files.js';

// const settingMetasPath = join(src_path, 'videoKit/let/a_settingMetas.js');
// const settingIndexPath = join(src_path, 'settings.html');

export default function build_settings(src_path, settings, baked, settingMetasPath, settingIndexPath) {
  // settingMetasPath = join(src_path, settingMetasPath);
  // settingIndexPath = join(src_path, settingIndexPath);
  //
  // Generate a_settingMetas.js
  gen_a_settingMetas(src_path, settings, baked, settingMetasPath);

  gen_settings_index(src_path, settings, settingIndexPath);
}

function gen_settings_index(src_path, settings, settingIndexPath) {
  let files = enum_files(src_path, [settings]);
  // console.log('gen_settings_index files', files);
  console.log('gen_settings_index files', files.length);

  let uindex = 0;
  files = files.map((file) => {
    if (!file) return '<br/>';
    uindex++;
    return `<a href="./index.html?u=${uindex}&d=${file}" target="settings">${file}</><br>`;
  });

  let str = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
${files.join('\n')}
  </body>
</html>
`;

  writeSrcBuildFile(src_path, settingIndexPath, str);
}

function gen_a_settingMetas(src_path, settings, baked, settingMetasPath) {
  const settingsPath = join(src_path, settings, baked);
  const files = readdirSync(settingsPath);
  files.sort();
  // console.log('files', files);
  let settingMetas = [];
  for (let afile of files) {
    const fparts = parse(afile);
    // console.log('fparts', fparts);
    if (fparts.ext !== '.json') continue;
    const fpath = join(settingsPath, afile);
    // console.log('afile', afile);
    let label = fparts.name;
    // let import_path = settings + '/' + baked + '/' + afile;
    let import_path = join(settings, baked, afile);
    let mstr = `{ label: '${label}', import_path: '${import_path}' },`;
    settingMetas.push(mstr);
  }

  // { label: '2x2', import_path: 'settings/_menu/-2x2.json', menu: 1  },
  let strm = `// !!@ Generated File
export let a_settingMetas = [
${settingMetas.join('\n')}
];
`;
  writeSrcBuildFile(src_path, settingMetasPath, strm);
  console.log('settingMetas.length', settingMetas.length);
}
