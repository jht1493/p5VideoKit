import pkg from 'fs-extra';
const { readFileSync, writeFileSync } = pkg;
import { join } from 'path';
import enum_files from './enum_files.js';

let updateBuild = 0;

export function set_updateBuild(flag) {
  updateBuild = flag;
}

export function get_build_vers(buildnum_path) {
  const str = readFileSync(buildnum_path, 'utf8');
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

export function build_ver_run(buildnum_path, build_ver, skt_path, buildnum_files) {
  const from_str = '\\?v=' + build_ver.current;
  const to_str = '?v=' + build_ver.next;
  const re = new RegExp(from_str, 'g');
  let nfiles = enum_files(skt_path, buildnum_files);
  // console.log('nfiles', nfiles);
  console.log('build_ver_run nfiles', nfiles.length);
  for (let afile of nfiles) {
    // skip directory enteries
    if (!afile) continue;
    const fpath = join(skt_path, afile);
    // if (fs.lstatSync(fpath).isDirectory()) {
    //   continue;
    // }
    const str = readFileSync(fpath, 'utf8');
    if (!str) {
      console.log('read failed fpath', fpath);
      continue;
    }
    const nstr = str.replace(re, to_str);
    if (updateBuild) writeFileSync(fpath, nstr);
  }
  if (updateBuild) writeFileSync(buildnum_path, build_ver.next + '');
  console.log('build_ver.next', build_ver.next);
}
