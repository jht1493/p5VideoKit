import { join, parse } from 'path';
import pkg from 'fs-extra';
const { readFileSync, writeFileSync } = pkg;

// { sketchPath, sketchSavedPath, effectsMetas, settingMetas };
export default function build_sketch(args) {
  console.log('build_sketch ');
  // console.log('build_sketch args', args);

  let { src_path, sketchPath, sketchSavedPath, effectsMetas, settingMetas } = args;

  const fpath = join(src_path, sketchPath);
  let str = readFileSync(fpath, 'utf8');
  if (!str) {
    console.log('read failed fpath', fpath);
    return;
  }
  str = str_replace(str, 'effects: [\n', ']', effectsMetas);
  str = str_replace(str, 'settings: [\n', ']', settingMetas);

  const ppath = join(src_path, sketchSavedPath);
  writeFileSync(ppath, str);
}

//   effects: [
// ]

// settings: [
// ]

function str_replace(str, prefix, suffix, ents) {
  let ipos = str.indexOf(prefix);
  let iend = str.indexOf(suffix, ipos);
  if (ipos < 0 || iend < 0) {
    console.log('build_sketch MISSING prefix', prefix, 'suffix', suffix);
  }
  // console.log('str_replace prefix|', prefix, '| ipos', ipos, 'iend', iend);
  ipos += prefix.length;
  str = str.substring(0, ipos) + ents.join('\n') + '\n' + str.substring(iend);
  return str;
}
