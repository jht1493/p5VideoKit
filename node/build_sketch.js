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
  const ppath = join(src_path, sketchSavedPath);
  writeFileSync(ppath, str);

  str = str_replace(str, 'effects: [\n', ']', effectsMetas);
  str = str_replace(str, 'settings: [\n', ']', settingMetas);

  writeFileSync(fpath, str);
}

//   effects: [
// ]

// settings: [
// ]

function str_replace(str, prefix, suffix, ents) {
  let ipos = str.indexOf(prefix);
  let iend = str.indexOf(suffix, ipos);
  // console.log('str_replace prefix|', prefix, '| ipos', ipos, 'iend', iend);
  ipos += prefix.length;
  str = str.substring(0, ipos) + ents.join('\n') + '\n' + str.substring(iend);
  return str;
}
