const fs = require('fs-extra');
const path = require('path');

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
  let nfiles = expand_dirs(skt_path, buildnum_files);
  // console.log('nfiles', nfiles);
  console.log('build_ver_run nfiles', nfiles.length);
  for (let afile of nfiles) {
    if (!afile) continue;
    const fpath = path.join(skt_path, afile);
    if (fs.lstatSync(fpath).isDirectory()) {
      continue;
    }
    const str = fs.readFileSync(fpath, 'utf8');
    if (!str) {
      console.log('read failed fpath', fpath);
      continue;
    }
    const nstr = str.replace(re, to_str);
    fs.writeFileSync(fpath, nstr);
  }
  fs.writeFileSync(buildnum_path, build_ver.next + '');
  console.log('build_ver.next', build_ver.next);
}

function expand_dirs(root_path, files) {
  files = files.concat();
  // console.log('files', files);
  // console.log('files.length', files.length);
  for (let index = 0; index < files.length; index++) {
    let afile = files[index];
    // console.log('afile', afile);
    if (afile.substring(0, 1) == '.' && !afile.substring(0, 2) == './') continue;
    const fpath = path.join(root_path, afile);
    // console.log('fpath', fpath);
    if (!fs.lstatSync(fpath).isDirectory()) {
      continue;
    }
    files[index] = null; // remove directory
    let dfiles = fs.readdirSync(fpath);
    if (!dfiles) {
      console.log('readdirSync no files', fpath);
      continue;
    }
    for (let dfile of dfiles) {
      if (dfile.substring(0, 1) == '.') continue;
      let nfile = path.join(afile, dfile);
      files.push(nfile);
    }
  }
  return files;
}

module.exports = { get_build_vers, build_ver_run };
