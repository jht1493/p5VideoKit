const fs = require('fs-extra');
const path = require('path');

function build_webdb(webdbPath, imagesOutPath) {
  let dirs = fs.readdirSync(webdbPath);
  dirs = dirs.filter((item) => item.substr(0, 1) !== '.');
  dirs.sort();
  // console.log('build_webdb dirs', dirs);

  // let files = [];
  let files = {};
  for (let adir of dirs) {
    // if (adir.substr(0, 1) === '.') continue;
    // console.log('adir', adir);
    const dpath = path.join(webdbPath, adir);

    let dfiles = fs.readdirSync(dpath);
    dfiles = dfiles.filter(filter_out_json);
    // (item) => item.substr(0, 1) !== '.' && item.substr(3, 5) !== '.json'
    dfiles.sort();

    console.log('build_webdb adir', adir, 'n', dfiles.length);

    // console.log('build_webdb files', files);
    // files.push(dfiles.map((item) => path.join(adir, item)));
    files[adir] = dfiles;
  }
  // files = files.flat();

  files.fmfm = interleave(files, 'fema', 'male');

  let str = 'let a_images = ';
  str += JSON.stringify(files, null, 2);

  fs.writeFileSync(imagesOutPath, str);
}

function filter_out_json(item) {
  if (item.substr(0, 1) == '.') return false;
  let lindex = item.lastIndexOf('.');
  if (lindex < 0) return false;
  if (item.substr(lindex, 5) == '.json') return false;
  return true;
}

function interleave(files, aprop, bprop) {
  let aitems = files[aprop];
  let bitems = files[bprop];
  let arr = [];
  let n = Math.max(aitems.length, bitems.length);
  for (i = 0; i < n; i++) {
    let a = aitems[i % aitems.length];
    let b = bitems[i % bitems.length];
    arr.push('../' + aprop + '/' + a, '../' + bprop + '/' + b);
  }
  return arr;
}

module.exports = build_webdb;
