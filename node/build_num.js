const fs = require('fs-extra');
const path = require('path');

function get_build_nums(buildnum_path) {
  const str = fs.readFileSync(buildnum_path, 'utf8');
  if (!str) {
    console.log('read failed buildnum_path', buildnum_path);
    return;
  }
  let current = parseFloat(str);
  let next = current + 1;
  // nbuild_num = 1;
  return { current, next };
}

// build_num_run(buildnum_path, build_num, skt_path, buildnum_files);

function build_num_run(buildnum_path, build_num, skt_path, buildnum_files) {
  const from_str = '\\?v=' + build_num.current;
  const to_str = '?v=' + build_num.next;
  const re = new RegExp(from_str, 'g');
  for (let afile of buildnum_files) {
    const fpath = path.join(skt_path, afile);
    const str = fs.readFileSync(fpath, 'utf8');
    if (!str) {
      console.log('read failed fpath', fpath);
      continue;
    }
    const nstr = str.replace(re, to_str);
    fs.writeFileSync(fpath, nstr);
  }
  fs.writeFileSync(buildnum_path, build_num.next + '');
  console.log('build_num.next', build_num.next);
}

module.exports = { get_build_nums, build_num_run };
