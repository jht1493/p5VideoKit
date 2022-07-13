const fs = require('fs-extra');
const path = require('path');

// const settingsPartialPath = 'settings';
// const settingMetasPath = path.join(src_path, 'videoKit/let/a_settingMetas.js');

function build_settings(src_path, settingsPartialPath, baked, settingMetasPath) {
  // Generate a_settingMetas.js
  gen_a_settingMetas(src_path, settingsPartialPath, baked, settingMetasPath);
}

function gen_a_settingMetas(src_path, settingsPartialPath, baked, settingMetasPath) {
  const settingsPath = path.join(src_path, settingsPartialPath, baked);
  const files = fs.readdirSync(settingsPath);
  files.sort();
  // console.log('files', files);
  let settingMetas = [];
  for (let afile of files) {
    const fparts = path.parse(afile);
    // console.log('fparts', fparts);
    if (fparts.ext !== '.json') continue;
    const fpath = path.join(settingsPath, afile);
    // console.log('afile', afile);
    let label = fparts.name;
    let import_path = settingsPartialPath + '/' + baked + '/' + afile;
    let mstr = `{ label: '${label}', import_path: '${import_path}' },`;
    settingMetas.push(mstr);
  }

  // { label: '2x2', import_path: 'settings/_menu/-2x2.json', menu: 1  },
  let strm = `// !!@ Generated File
export let a_settingMetas = [
${settingMetas.join('\n')}
];
`;
  fs.writeFileSync(settingMetasPath, strm);
  console.log('settingMetas.length', settingMetas.length);
}

module.exports = build_settings;
