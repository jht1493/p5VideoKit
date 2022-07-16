import pkg from 'fs-extra';
const { readdirSync } = pkg;
import { join } from 'path';

import { writeSrcBuildFile } from './enum_files.js';

export default function build_webdb(src_path, webdbPath, imagesOutPath) {
  webdbPath = join(src_path, webdbPath);
  // imagesOutPath = join(src_path, imagesOutPath);
  let dirs = readdirSync(webdbPath);
  dirs = dirs.filter((item) => item.substring(0, 1) !== '.');
  dirs.sort();
  // console.log('build_webdb dirs', dirs);

  // let files = [];
  let files = {};
  for (let adir of dirs) {
    // if (adir.substr(0, 1) === '.') continue;
    // console.log('adir', adir);
    const dpath = join(webdbPath, adir);

    let dfiles = readdirSync(dpath);
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

  writeSrcBuildFile(src_path, imagesOutPath, str);
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
