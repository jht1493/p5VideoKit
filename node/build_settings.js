import pkg from 'fs-extra';
const { readdirSync, writeFileSync } = pkg;
import { join, parse } from 'path';

// const settingsPartialPath = 'settings';
// const settingMetasPath = path.join(src_path, 'videoKit/let/a_settingMetas.js');

export default function build_settings(src_path, settings, baked, settingMetasPath, settingIndexPath) {
  // Generate a_settingMetas.js
  gen_a_settingMetas(src_path, settings, baked, settingMetasPath);

  gen_settings_index();
}

function gen_settings_index() {
  //
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
  writeFileSync(settingMetasPath, strm);
  console.log('settingMetas.length', settingMetas.length);
}
