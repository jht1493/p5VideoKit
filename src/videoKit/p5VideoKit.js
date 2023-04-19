// p5VideoKit main class
//  Must be include in html as
//    <script src="videoKit/p5VideoKit.js?v=94"></script>
//

class p5VideoKit {
  //
  // let effects = [
  //   { label: 'example', import_path: 'module/eff_example', menu: 1 },

  constructor(config, p5_instance = p5.instance) {
    // console.log('p5VideoKit p5_instance', p5_instance);
    // To work in p5 instance mode we need to use this.p5_instance on all p5 globals
    //
    this.room_name_prefix = '';
    // this.room_name_prefix = 'dev-';
    if (!p5_instance) {
      console.log('p5VideoKit !!@ no p5_instance');
    }
    this.p5_instance = p5_instance;
    this.my_canvas = p5_instance._renderer;
    if (!this.my_canvas) {
      console.log('p5VideoKit !!@ no my_canvas');
    }
    this.init(config).then(() => {
      console.log('videoKit.init done');

      // Report startup lapse time
      let init_lapse = window.performance.now() - dice.startTime;
      dice.dapi('stats', { init_lapse });
      //
    });
  }

  init({ effects, settings }) {
    let inpath = './core/a_main.js?v={{vers}}';
    return new Promise((resolve, reject) => {
      import(inpath)
        .then((module) => {
          // console.log('p5VideoKit module', module);
          this.vk_setup(effects, settings, resolve);
        })
        .catch((err) => {
          console.log('p5VideoKit err', err, '\n inpath', inpath);
          reject();
        });
    });
  }

  draw() {
    console.log('p5VideoKit draw stub');
  }
}

var dice = { warning: 1 };

dice.dapi = function (arg, arg2, result) {
  if (dice.debug) console.log('dice arg=' + arg + ' arg2=' + JSON.stringify(arg2));
  var opt = arg;
  if (typeof arg2 != 'undefined') {
    opt = {};
    opt[arg] = arg2;
  }
  if (typeof result == 'string') {
    opt._result_str = result;
  } else if (typeof result == 'function') {
    var rtag = dice.result_rtag + '';
    opt._result_rtag = rtag;
    dice.result_rtag++;
    dice.result_funcs[rtag] = result;
  }
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.dice) {
    window.webkit.messageHandlers.dice.postMessage(opt);
  } else {
    if (dice.warning) {
      console.log('dice opt=' + JSON.stringify(opt));
    }
  }
};
dice.result_funcs = {};
dice.result_rtag = 1;
dice.result_rvalue = function (rtag, value) {
  var func = dice.result_funcs[rtag];
  if (func) {
    delete dice.result_funcs[rtag];
    func(value);
  } else {
    console.log('dice.result_rvalue missing rtag=' + rtag);
  }
};

dice.startTime = window.performance.now();
