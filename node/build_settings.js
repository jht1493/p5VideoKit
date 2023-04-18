import { parse } from 'path';

import { enum_files, writeSrcBuildFile } from './enum_files.js';

// { src_path, settings, settingIndexPath, settingMetasPath, indexPrefix }
export default function build_settings(args) {
  //

  let { src_path, settings, settingIndexPath, settingMetasPath, indexPrefix } = args;

  args.files = enum_files(src_path, [settings]);

  gen_a_settingMetas(src_path, settingMetasPath, args);

  gen_settings_index(src_path, settingIndexPath, indexPrefix, args);
}

function gen_a_settingMetas(src_path, settingMetasPath, args) {
  //
  let files = args.files.concat();
  files.sort();
  // console.log('files', files);
  let settingMetas = [];
  for (let afile of files) {
    if (!afile) continue;
    const fparts = parse(afile);
    // console.log('fparts', fparts);
    if (fparts.ext !== '.json') continue;
    let label = fparts.name;
    let import_path = afile;
    let mstr = `{ label: '${label}', import_path: '${import_path}' },`;

    settingMetas.push(mstr);
  }
  // { label: '2x2', import_path: 'settings/_menu/-2x2.json', menu: 1  },
  let strm = `// !!@ Generated File
export let a_settingMetas = [
${settingMetas.join('\n')}
];
`;
  if (settingMetasPath) {
    writeSrcBuildFile(src_path, settingMetasPath, strm);
    console.log('settingMetas.length', settingMetas.length);
  }

  args.metas = settingMetas;
}

function gen_settings_index(src_path, settingIndexPath, indexPrefix, args) {
  // console.log('gen_settings_index files', files);
  let files = args.files;
  console.log('gen_settings_index files', files.length);
  let uindex = 0;
  files = files.map((file) => {
    if (!file) return '<br/>';
    uindex++;
    // return `<a href="${indexPrefix}?u=${uindex}&d=${file}" target="settings">${file}</><br>`;
    return `<a href="${indexPrefix}?u=${uindex}&d=${file}" target="settings-${uindex}">${file}</><br>`;
  });
  let str = `<!DOCTYPE html>
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
