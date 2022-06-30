const fs = require('fs-extra');
const path = require('path');

function build_settings(settingsPath, settingsOutPath) {
  const files = fs.readdirSync(settingsPath);
  files.sort();
  // console.log('files', files);
  let settings = [{ setting: '' }];
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
    delete ent.setting;
    ent = Object.assign({ setting: fparts.name }, ent);
    settings.push(ent);
  }
  let str = 'let a_settings = ';
  str += JSON.stringify(settings, null, 2);
  fs.writeFileSync(settingsOutPath, str);
  console.log('settings.length', settings.length);
}

module.exports = build_settings;
