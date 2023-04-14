// const fs = require('fs-extra');
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { get_build_vers, build_ver_run, set_updateBuild } from './build_ver.js';

for (let index = 0; index < process.argv.length; index++) {
  // console.log(index, process.argv[index]);
  let val = process.argv[index];
  if (val == '--prod') {
    set_updateBuild(1);
  } else if (val == '--dev') {
    set_updateBuild(0);
  }
}

// const build_index = require('./build_index');
import build_webdb from './build_webdb.js';
import build_settings from './build_settings.js';
import build_effectMetas from './build_effectMetas.js';

// source files that will have ?v=<buildnumber> updated
const buildnum_files = ['./index.html', './videoKit/'];

const root_path = join(__dirname, '..');
const src_path = join(root_path, 'src');
const buildnum_path = 'gen/build_ver.txt';
let build_ver = get_build_vers(src_path, buildnum_path);

const webdbPath = 'external/media/webdb';
const imagesOutPath = 'videoKit/let/a_images.js';
build_webdb(src_path, webdbPath, imagesOutPath);

{
  const settingIndexPath = 'videoKit/settings.html';
  const settingMetasPath = 'videoKit/let/a_settingMetas.js';
  build_settings(src_path, 'videoKit/settings', settingIndexPath, settingMetasPath, '../index.html');
}

{
  const settingIndexPath = './gen/settings.html';
  const settingMetasPath = './gen/settings.js';
  build_settings(src_path, 'settings', settingIndexPath, settingMetasPath, '../index.html');
}

{
  const effectMetasPath = 'videoKit/let/a_effectMetas.js';
  build_effectMetas(src_path, effectMetasPath, 'videoKit/effects');
}

{
  const effectMetasPath = './gen/effects.js';
  build_effectMetas(src_path, effectMetasPath, 'effects');
}

build_ver_run(src_path, buildnum_path, build_ver, buildnum_files);
