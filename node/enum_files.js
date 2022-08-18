import pkg from 'fs-extra';
const { lstatSync, readdirSync, writeFileSync } = pkg;
import { join } from 'path';

// list all non-directories in a list of files
export function enum_files(root_path, files) {
  // Make a copy of the array of files to list
  // this array will expand with directory contents
  files = files.concat();
  let nfiles = [];
  // console.log('files', files);
  // console.log('files.length', files.length);
  for (let index = 0; index < files.length; index++) {
    let afile = files[index];
    if (!afile) {
      nfiles.push(null);
      continue;
    }
    // console.log('afile', afile);
    if (afile.substring(0, 1) == '.' && !afile.substring(0, 2) == './') continue;
    const fpath = join(root_path, afile);
    // console.log('fpath', fpath);
    if (!lstatSync(fpath).isDirectory()) {
      // Add simple files to nfiles array
      nfiles.push(afile);
      continue;
    }
    // Entry is a directory
    // Add directory contents to files array
    let dfiles = readdirSync(fpath);
    if (!dfiles) {
      console.log('readdirSync no files', fpath);
      continue;
    }
    // Mark a break between directories
    files.push(null);
    for (let dfile of dfiles) {
      if (dfile.substring(0, 1) == '.') continue;
      let nfile = join(afile, dfile);
      files.push(nfile);
    }
  }
  return nfiles;
}

export function writeBuildFile(src_path, afile, str) {
  const buildpath = join(src_path, '../build', afile);
  writeFileSync(buildpath, str);
}

export function writeSrcBuildFile(src_path, afile, str) {
  const apath = join(src_path, afile);
  const buildpath = join(src_path, '../build', afile);
  writeFileSync(apath, str);
  writeFileSync(buildpath, str);
}
