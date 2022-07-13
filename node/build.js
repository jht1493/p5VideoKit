// const fs = require('fs-extra');
const path = require('path');

const { get_build_vers, build_ver_run } = require('./build_ver');
// const build_index = require('./build_index');
const build_webdb = require('./build_webdb');
const build_settings = require('./build_settings');
const build_effectMetas = require('./build_effectMetas');

// source files that will have ?v=<buildnumber> updated
const buildnum_files = ['./index.html', './videoKit/'];

const root_path = path.join(__dirname, '..');
const src_path = path.join(root_path, 'src');
const buildnum_path = path.join(src_path, 'build_ver.txt');
let build_ver = get_build_vers(buildnum_path);

const webdbPath = path.join(src_path, 'external/media/webdb');
const imagesOutPath = path.join(src_path, 'videoKit/let/a_images.js');
// build_webdb(webdbPath, imagesOutPath);

const settingsPartialPath = 'settings';
const settingMetasPath = path.join(src_path, 'videoKit/let/a_settingMetas.js');
build_settings(src_path, settingsPartialPath, 'baked', settingMetasPath);

build_ver_run(buildnum_path, build_ver, src_path, buildnum_files);

// build_index(src_path, 'index.html', build_ver.next);

const effectMetasPath = path.join(src_path, 'videoKit/let/a_effectMetas.js');
build_effectMetas(effectMetasPath, src_path, 'videoKit');
