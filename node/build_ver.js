const fs = require('fs-extra');
const path = require('path');
const { enum_files } = require('./enum_files');

const updateBuild = 0;

function get_build_vers(buildnum_path) {
  const str = fs.readFileSync(buildnum_path, 'utf8');
  if (!str) {
    console.log('read failed buildnum_path', buildnum_path);
    return;
  }
  let current = parseFloat(str);
  let next = current + 1;
  // nbuild_ver = 1;
  return { current, next };
}

// build_ver_run(buildnum_path, build_ver, skt_path, buildnum_files);

function build_ver_run(buildnum_path, build_ver, skt_path, buildnum_files) {
  const from_str = '\\?v=' + build_ver.current;
  const to_str = '?v=' + build_ver.next;
  const re = new RegExp(from_str, 'g');
  let nfiles = enum_files(skt_path, buildnum_files);
  // console.log('nfiles', nfiles);
  console.log('build_ver_run nfiles', nfiles.length);
  for (let afile of nfiles) {
    // skip directory enteries
    if (!afile) continue;
    const fpath = path.join(skt_path, afile);
    // if (fs.lstatSync(fpath).isDirectory()) {
    //   continue;
    // }
    const str = fs.readFileSync(fpath, 'utf8');
    if (!str) {
      console.log('read failed fpath', fpath);
      continue;
    }
    const nstr = str.replace(re, to_str);
    if (updateBuild) fs.writeFileSync(fpath, nstr);
  }
  if (updateBuild) fs.writeFileSync(buildnum_path, build_ver.next + '');
  console.log('build_ver.next', build_ver.next);
}

module.exports = { get_build_vers, build_ver_run };
