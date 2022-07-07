const fs = require('fs-extra');
const path = require('path');

// build_settings(src_path, settingsPartialPath, settingsOutPath, settingMetasPath);
// function build_settings(settingsPath, settingsOutPath, settingMetasPath) {

function build_settings(src_path, settingsPartialPath, settingsOutPath, settingMetasPath) {
  const settingsPath = path.join(src_path, settingsPartialPath);
  const files = fs.readdirSync(settingsPath);
  files.sort();
  // console.log('files', files);
  let settings = [{ setting: '' }];
  let settingMetas = [];
  for (let afile of files) {
    const fparts = path.parse(afile);
    // console.log('fparts', fparts);
    if (fparts.ext !== '.json') continue;
    const fpath = path.join(settingsPath, afile);
    // console.log('afile', afile);
    // console.log(afile);
    const str = fs.readFileSync(fpath, 'utf8');
    if (!str) {
      console.log('read failed fpath', fpath);
      continue;
    }
    let ent = JSON.parse(str);
    if (!ent) {
      console.log('parse failed fpath', fpath, 'str', str);
      continue;
    }
    // console.log('ent', ent);
    // delete and add to ensure setting appears at the begining
    let label = fparts.name;
    delete ent.setting;
    ent = Object.assign({ setting: label }, ent);
    settings.push(ent);

    let import_path = settingsPartialPath + '/' + afile;
    let mstr = `{ label: '${label}', import_path: '${import_path}' },`;
    settingMetas.push(mstr);
  }
  let str = 'let a_settings = ';
  str += JSON.stringify(settings, null, 2);
  fs.writeFileSync(settingsOutPath, str);
  console.log('settings.length', settings.length);

  // { label: '2x2', import_path: 'settings/_menu/-2x2.json', menu: 1  },
  let strm = `// !!@ Generated File
let a_settingMetas = [
${settingMetas.join('\n')}
]`;
  fs.writeFileSync(settingMetasPath, strm);
  console.log('settingMetas.length', settingMetas.length);
}

module.exports = build_settings;
