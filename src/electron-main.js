//
// Run p5VideoKet as electron process to allow for restart

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const root_index_path = 'src/index.html';

function print_process_argv() {
  process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  });
}
// print_process_argv();
// 0: /Users/jht/Documents/projects/repo/p5-projects/skt/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron
// 1: electron-main
// 2: --screen
// 3: 2

// ./node_modules/.bin/electron electron-main --screen 2 --restart_time 18:09:00

let opt = {};

function parse_argv(argv) {
  for (let index = 2; index < argv.length; index++) {
    let val = argv[index];
    switch (val) {
      case '--restart_time':
        opt.restart_time = argv[index + 1];
        index++;
        break;
      case '--restart_period':
        opt.restart_period = argv[index + 1];
        index++;
        break;
      case '--u':
        opt.u = argv[index + 1];
        index++;
        break;
      case '--s':
        // select settings and hide ui
        // set a_settings_pending
        opt.s = argv[index + 1];
        index++;
        break;
      case '--debug':
        opt.debug = true;
        break;
      case '--full':
        opt.fullScreen = true;
        break;
      case '--screen':
        opt.index = argv[index + 1];
        index++;
        break;
      default:
        console.log('Unknown arg val', val);
        break;
    }
  }
}
parse_argv(process.argv);

console.log('opt', opt);

let mainWindow;
let download_path = path.resolve(process.env.HOME, 'Downloads');
console.log('download_path', download_path);

app.whenReady().then(() => {
  // path.join(__dirname, 'preload.js'),

  // We cannot require the screen module until the
  // app is ready
  const { screen } = require('electron');

  const screens = screen.getAllDisplays();
  let index = opt.index || '1';
  index = parseFloat(index) - 1;
  if (index < 0) index = 0;
  if (index >= screens.length) index = screens.length - 1;
  const primaryDisplay = screens[index];
  const { x, y, width, height } = primaryDisplay.workArea;

  // console.log('index', index);
  // console.log('primaryDisplay', primaryDisplay);

  // Create a window that fills the sceen's available work area.
  // const primaryDisplay = screen.getPrimaryDisplay();
  // const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      // preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (opt.debug) {
    mainWindow.webContents.openDevTools();
  }

  opt.u = opt.u || '';
  opt.s = opt.s || '';
  const url_options = { query: { u: opt.u, s: opt.s } };
  mainWindow.loadFile(root_index_path, url_options);

  // mainWindow.fullScreen = opt.fullScreen;
  setTimeout(function () {
    mainWindow.fullScreen = opt.fullScreen;
  }, 10 * 1000);

  setup_download();

  setup_restart();

  // console.log('main screen', screen);
  // console.log('main screens', screens);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// --restart_period n
function setup_restart() {
  let per;

  if (opt.restart_period) {
    per = parse_period(opt.restart_period);
  } else if (opt.restart_time) {
    per = parse_restart_time(opt.restart_time);
  }
  // console.log('setup_restart per=' + per);
  // Seconds to milliseconds
  per = per * 1000;
  if (1) {
    setTimeout(function () {
      console.log('setTimeout app.relaunch ');
      app.relaunch();
      app.exit(0);
    }, per);
  }
}

function parse_period(period_str) {
  // hh:mm:ss
  // mm:ss
  // ss
  let arr = period_str.split(':').map(parseFloat);
  if (arr.length == 1) {
    arr[2] = arr[0];
    arr[1] = 0;
    arr[0] = 0;
  } else if (arr.length == 2) {
    arr[2] = arr[1];
    arr[1] = arr[0];
    arr[0] = 0;
  }
  let secs = (arr[0] * 60 + arr[1]) * 60 + arr[2];
  // console.log('parse_period arr', arr);
  // console.log('parse_period secs', secs);
  return secs;
}

function parse_restart_time(restart_time) {
  // hh:mm:ss
  // let arr = restart_time.split(':').map(parseFloat);
  // console.log('parse_restart_time arr', arr);
  // let secs = (arr[0] * 60 + arr[1]) * 60 + arr[2];
  let secs = parse_period(restart_time);
  console.log('parse_restart_time secs', secs);
  let d = new Date();
  // console.log('parse_restart_time d.getHours()', d.getHours());
  // console.log('parse_restart_time d.getMinutes()', d.getMinutes());
  // console.log('parse_restart_time d.getSeconds()', d.getSeconds());
  let nsecs = (d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds();
  console.log('parse_restart_time nsecs', nsecs);
  let m = 24 * 60 * 60;
  // console.log('parse_restart_time m', m);
  let per = (secs - nsecs + m) % m;
  console.log('parse_restart_time per', per);
  return per;
}

function setup_download() {
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    let fn = item.getFilename();
    // console.log('fn', fn);
    let dpath = next_download_filename(fn);
    // let dpath = path.join(download_path, fn);
    console.log('dpath', dpath);
    item.setSavePath(dpath);
    // item.setSavePath('/tmp/save.png');
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused');
        } else {
          // console.log(`Received bytes: ${item.getReceivedBytes()}`);
        }
      }
    });
    item.once('done', (event, state) => {
      if (state === 'completed') {
        // console.log('Download successfully');
      } else {
        console.log(`Download failed: ${state}`);
      }
    });
  });
}

function next_download_filename(fn) {
  let pfile = path.parse(fn);
  let { name, ext } = pfile;
  let dpath;
  let count = 1;
  for (;;) {
    dpath = path.join(download_path, fn);
    if (fs.existsSync(dpath)) {
      fn = name + '-' + count + ext;
      count++;
    } else {
      return dpath;
    }
  }
}

// Retrieve information about screen size, displays, cursor position, etc.
// For more info, see:
// https://electronjs.org/docs/api/screen
