const fs = require('fs-extra');
const path = require('path');

// for dice_face/index.html
// Replace
//  <!-- @include_src src/util -->
// with expanded references to .js files
//  <script src="lib/delaunay.js?v=371"></script>
//

const patStart = '<!-- @include_src ';
const patEnd = ' -->';

const genStart = '<!-- @generated_start -->\n';
const genEnd = '<!-- @generated_end -->\n';

function build_index(index_root_path, index_file, nbuild_num) {
  // console.log('index_root_path', index_root_path, 'nbuild_num', nbuild_num);
  const fpath = path.join(index_root_path, index_file);
  let str = fs.readFileSync(fpath, 'utf8');
  if (!str) {
    console.log('read failed fpath', fpath);
    return;
  }
  // console.log('str.length', str.length);

  // Find all include_src folder names
  let startIndex = 0;
  let dirs = [];
  for (;;) {
    let nextIndex = str.indexOf(patStart, startIndex);
    if (nextIndex < 0) {
      break;
    }
    let dirStart = nextIndex + patStart.length;
    let endIndex = str.indexOf(patEnd, dirStart);
    let dir = str.substring(dirStart, endIndex);
    dirs.push(dir);
    startIndex = endIndex;
  }
  console.log('dirs', dirs + '');

  // find all .js files in folders
  let incFiles = [];
  for (let dir of dirs) {
    const fpath = path.join(index_root_path, dir);
    if (fs.existsSync(fpath)) {
      const files = fs.readdirSync(fpath);
      files.sort();
      // console.log(dir, files);
      for (let file of files) {
        if (path.extname(file) == '.js') {
          let nfile = path.join(dir, file);
          incFiles.push(nfile);
        }
      }
    } else {
      console.log('build_index no path', fpath);
    }
  }

  // console.log('incFiles', incFiles);
  let tagEnd = '?v=' + nbuild_num + '"></script>';
  incFiles = incFiles.map((ent) => {
    return '<script src="' + ent + tagEnd;
  });

  // console.log('incFiles', incFiles);
  let incStr = incFiles.join('\n') + '\n';

  let gstart = str.indexOf(genStart);
  let gend = str.indexOf(genEnd);
  if (gstart < 0 || gend < 0) {
    console.log('no generated_start/end', gstart, gend);
    return;
  }

  str = str.substring(0, gstart + genStart.length) + incStr + str.substring(gend);

  fs.writeFileSync(fpath, str);

  // console.log('str', str);
}

module.exports = build_index;
