// const fs = require('fs-extra');
const path = require('path');

const { get_build_nums, build_num_run } = require('./build_num');
const build_index = require('./build_index');
const build_webdb = require('./build_webdb');
const build_settings = require('./build_settings');

// source files that will have ?v=<buildnumber> updated
const buildnum_files = ['./index.html', './let/a_ui.js'];

const root_path = path.join(__dirname, '..');
const src_path = path.join(root_path, 'src');
const buildnum_path = path.join(src_path, 'build_num.txt');

let build_num = get_build_nums(buildnum_path);

const webdbPath = path.join(src_path, 'external/media/webdb');
const imagesOutPath = path.join(src_path, 'let/a_images.js');

// build_webdb(webdbPath, imagesOutPath);

const settingsPath = path.join(root_path, 'settings/_menu');
const settingsOutPath = path.join(src_path, 'let/a_settings.js');

build_settings(settingsPath, settingsOutPath);

build_num_run(buildnum_path, build_num, src_path, buildnum_files);

build_index(src_path, 'index.html', build_num.next);
