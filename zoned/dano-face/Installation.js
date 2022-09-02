let vectorPositions = [];
let poseResults = { x: 0, y: 0, radius: 10, headAngle: 0 };
let positionBetweenVectors = 0.5;
let settlingInterval;
let accumulatedConfidence = 0;
let video;
var flippedVideo;

let circleMask;
let poseNet;
let speed = 0.001;
let extraRotate = 0;
let ageVector;

let a_dim = 200;

/*
function preload(){
 ageVector = loadJSON("./file.json");
}
*/

function setup() {
  console.log(ageVector);

  //    createCanvas(1580,820);
  createCanvas(1920, 1080);
  let captureConstraints = allowCameraSelection(640, 480);
  video = createCapture(captureConstraints, videoLoaded);
  circleMask = createGraphics(100, 100);
  circleMask.ellipseMode(CENTER);
  circleMask.clear(); //clear the mask
  circleMask.fill(0, 255, 0, 255); //set alpha of mask
  circleMask.noStroke();
  circleMask.ellipse(50, 50, 50, 50); //use nose pos to draw alpha
  flippedVideo = pg = createGraphics(a_dim, a_dim);

  let model = new rw.HostedModel({
    url: 'https://stylegan2-7694fe98.hosted-models.runwayml.cloud/v1/',
    token: 'g/YBslj6S5eCne661wNO2Q==',
  });
  let spacing = width / 3;
  //   let spacing = 1600 / 3;
  vectorPositions['Left'] = new VectorPosition('Left', model, spacing - 512, 0);
  vectorPositions['Right'] = new VectorPosition('Right', model, 3 * spacing - 512, 0);

  let v0 = nj.array(vectorPositions['Left'].localVector);
  let v1 = nj.array(vectorPositions['Right'].localVector);
  let currentVector = v0
    .multiply(1 - positionBetweenVectors)
    .add(v1.multiply(positionBetweenVectors))
    .tolist(); // createRandomVector();
  vectorPositions['Middle'] = new VectorPosition('Middle', model, 2 * spacing - 512, 0, currentVector);
  //setInterval(prepareForWait, 15*60*1000);
}

function prepareForWait() {
  vectorPositions['Middle'].firstTime = true;
  console.log('GAN May Have Gone To Sleep');
}

function videoLoaded() {
  // Create a new poseNet method
  let posNetOptions = {
    architecture: 'MobileNetV1',
    imageScaleFactor: 0.3,
    outputStride: 16,
    flipHorizontal: false,
    minConfidence: 0.5,
    maxPoseDetections: 1,
    scoreThreshold: 0.5,
    nmsRadius: 20,
    detectionType: 'single',
    inputResolution: 513,
    multiplier: 0.75,
    quantBytes: 2,
  };

  poseNet = ml5.poseNet(video, posNetOptions, modelLoaded);
  poseNet.on('pose', gotPos);
  video.hide();
}

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}
// Listen to new 'pose' events
function gotPos(poses) {
  let thisNose = poses[0].pose.nose;
  //console.log(thisNose.confidence);
  if (thisNose.confidence > 0.7) {
    accumulatedConfidence++;
    if (accumulatedConfidence > 50) {
      let xDiff = poses[0].pose.leftEye.x - poses[0].pose.rightEye.x;
      let yDiff = poses[0].pose.leftEye.y - poses[0].pose.rightEye.y;

      let headAngle = Math.atan2(yDiff, xDiff);

      let handToNose = dist(
        poses[0].pose.leftWrist.x,
        poses[0].pose.leftWrist.y,
        poses[0].pose.nose.x,
        poses[0].pose.nose.y
      );
      if (handToNose < 30) location.reload(true);

      poseResults.y = thisNose.y;
      poseResults.x = thisNose.x;
      poseResults.y = thisNose.y;
      poseResults.radius = xDiff;
      poseResults.headAngle = headAngle;

      if (headAngle > 0.3) {
        reactToTilt(1);
      } else if (headAngle < -0.3) {
        reactToTilt(-1);
      } else {
        speed = Math.max(0.001, speed - 0.001);
        extraRotate = 0;
      }
    }
  } else {
    accumulatedConfidence = 0;
  }
}

function reactToTilt(dir) {
  if (vectorPositions['Middle'].getStage() == 'OK') {
    positionBetweenVectors += speed * -dir;
    extraRotate = speed * -dir * 15;
    positionBetweenVectors = Math.max(positionBetweenVectors, 0);
    positionBetweenVectors = Math.min(positionBetweenVectors, 1);
    clearTimeout(settlingInterval);
    settlingInterval = setTimeout(newPlace, 1000);
    speed = Math.min(0.05, speed + 0.001);
  }
}

function newPlace() {
  if (positionBetweenVectors == 1.0) {
    console.log('reverse right');
    vectorPositions['Left'].firstTime = true;
    vectorPositions['Right'].firstTime = true;
    vectorPositions['Left'].setMyVector(vectorPositions['Right'].localVector);

    vectorPositions['Right'].setMyVector(createRandomVector());

    positionBetweenVectors = 0.1;
  } else if (positionBetweenVectors == 0.0) {
    console.log('reverse left');
    vectorPositions['Left'].firstTime = true;
    vectorPositions['Right'].firstTime = true;
    vectorPositions['Right'].setMyVector(vectorPositions['Left'].localVector);
    vectorPositions['Left'].setMyVector(createRandomVector());
    positionBetweenVectors = 0.9;
  }

  let v0 = nj.array(vectorPositions['Left'].localVector);
  let v1 = nj.array(vectorPositions['Right'].localVector);
  let currentVector = v0
    .multiply(1 - positionBetweenVectors)
    .add(v1.multiply(positionBetweenVectors))
    .tolist(); // createRandomVector();

  vectorPositions['Middle'].setMyVector(currentVector);
}

function draw() {
  // background(0);
  for (positions in vectorPositions) {
    thisPosition = vectorPositions[positions];
    thisPosition.drawIt();
  }
  noStroke();
  fill(0, 0, 0);
  rect(0, 512, width, height - 512);
  let fontsize = 24;
  textSize(fontsize);
  fill(255, 255, 255);
  textFont('Georgia');
  let tilt_prompt = ' Tilt Your Head ';
  let tw = textWidth(tilt_prompt + '  >'); //+  " →"

  let dx = width * positionBetweenVectors - 50; //Number: the x-coordinate of the destination rectangle in which to draw the source image
  let dy = height - 250; //Number: the y-coordinate of the destination rectangle in which to draw the source image
  let dWidth = a_dim; //Number: the width of the destination rectangle
  let dHeight = a_dim; //Number: the height of the destination rectangle
  let sx = poseResults.x - poseResults.radius * 4; //Number: the x-coordinate of the subsection of the source image to draw into the destination rectangle
  let sy = poseResults.y - poseResults.radius * 4; //Number: the y-coordinate of the subsection of the source image to draw into the destination rectangle
  let sWidth = poseResults.radius * 8; //Number: the width of the subsection of the source image to draw into the destination rectangle (Optional)
  let sHeight = poseResults.radius * 8; //Number: the height of the subsection of the source image to draw into the destination rectangle (Optional)

  flippedVideo.push();
  flippedVideo.translate(100, 100);

  flippedVideo.rotate(extraRotate);
  flippedVideo.translate(-100, -100);
  flippedVideo.translate(a_dim, 0);

  flippedVideo.scale(-1, 1);

  var masked;
  //( masked = sourceImage.get()).mask(maskImage);
  // (flippedVideo.get()).mask(circleMask);

  flippedVideo.image(video, 0, 0, dWidth, dHeight, sx, sy, sWidth, sHeight);

  flippedVideo.pop();
  //
  (masked = flippedVideo.get()).mask(circleMask);

  image(masked, dx, dy, dWidth, dHeight);

  if (vectorPositions['Middle'].stage == 'ASKING') {
    text('      Waiting    ', dx - tw, dy + dHeight / 2 + fontsize / 2);
    text('      Waiting    ', dx + dWidth, dy + dHeight / 2 + fontsize / 2);
  } else {
    text('< ' + tilt_prompt, dx - tw, dy + dHeight / 2 + fontsize / 2); //"← "
    text(tilt_prompt + ' >', dx + dWidth, dy + dHeight / 2 + fontsize / 2); // " →"
  }
}

///move people around and tell them about
document.addEventListener('keydown', onDocumentKeyDown, false);
function onDocumentKeyDown(e) {
  clearTimeout(settlingInterval);
  if (e.key == 'ArrowUp' || e.key == 'w') {
    positionBetweenVectors -= 0.01;
  } else if (e.key == 'ArrowDown' || e.key == 's') {
    positionBetweenVectors += 0.01;
  }

  //settlingInterval = setTimeout(newPlace, 3000);
  /*
    let mid = nj.array(vectorPositions['Middle'].localVector);
    let currentVector;
   
    //for(var i = 0; i < 18; i++){
        let ageVec   = nj.array(ageVector[1] );
        mid = (mid.add(ageVec.multiply(positionBetweenVectors)));  // createRandomVector();
     //   }
    vectorPositions['Middle'].setMyVector(mid.tolist());
    */
}

class VectorPosition {
  constructor(name, model, x, y, initialVector) {
    this.firstTime = true;
    this.name = name;
    this.model = model;
    this.x = x;
    this.y = y;
    this.fader;
    this.graphics = createGraphics(512, 512);
    this.oldImage = createImage(512, 512);
    this.newImage = createImage(512, 512);
    this.myBlend = 0;
    this.stage = 'ASKING';
    if (initialVector) {
      this.localVector = initialVector;
    } else {
      this.localVector = createRandomVector();
    }
    this.setMyVector();
  }

  drawIt() {
    if (this.stage == 'ASKING') {
      if (this.firstTime) {
        fill(255, 255, 255);
        textSize(18);
        let tw = textWidth('Warming Up The GAN, Can Take A Few Minutes');
        text('Warming Up The GAN, Can Take A Few Minutes', this.x + (512 - tw) / 2, this.y + a_dim);
        this.firstTime = false;
      }
    } else if (this.stage == 'LOADED') {
      //this.graphics.image(this.oldImage,0,0,512,512);
      // this.graphics.tint(255, this.myBlend);
      // this.graphics.tint(0, 0, 204);
      this.graphics.image(this.newImage, 0, 0, 512, 512);
      push();
      tint(255, this.myBlend);
      image(this.graphics, this.x, this.y, 512, 512);
      pop();
    } else if (this.stage == 'OK') {
      image(this.oldImage, this.x, this.y, 512, 512);
    }
  }

  setMyVector(vector) {
    if (vector) this.localVector = vector;
    this.talkToRunway(this.localVector);
  }

  getStage() {
    return this.stage;
  }

  fadeIn(person) {
    if (person.myBlend <= 250) {
      person.myBlend += 10;
    } else {
      person.stage = 'OK';
      person.oldImage = person.newImage;
      clearInterval(person.fader);
    }
  }

  talkToRunway(vector) {
    console.log('askit');
    this.stage = 'ASKING';
    const data = {
      z: vector,
      truncation: 0.7,
    };
    this.model.query(data).then((outputs) => {
      console.log('got reply');

      const { image } = outputs;
      this.newImage = createImg(image, 'alterego', 'anonymous', this.loaded(this));
      this.newImage.hide();
    });
  }
  loaded(person) {
    person.stage = 'LOADED';
    person.myBlend = 0;
    this.fader = setInterval(function () {
      person.fadeIn(person);
    }, 5);
  }
}

function createRandomVector() {
  const vector = [];
  for (let i = 0; i < 512; i++) {
    vector[i] = random(-1, 1);
  }
  return vector;
}

function allowCameraSelection(w, h) {
  //This whole thing is to build a pulldown menu for selecting between cameras

  //manual alternative to all of this pull down stuff:
  //type this in the console and unfold resulst to find the device id of your preferredwebcam, put in sourced id below
  //navigator.mediaDevices.enumerateDevices()

  //default settings
  let videoOptions = {
    audio: false,
    video: {
      width: w,
      height: h,
    },
  };

  let preferredCam = localStorage.getItem('preferredCam');
  //if you changed it in the past and stored setting
  if (preferredCam) {
    videoOptions = {
      audio: false,
      video: {
        width: w,
        height: h,
        sourceId: preferredCam,
      },
    };
  }
  //create a pulldown menu for picking source
  navigator.mediaDevices.enumerateDevices().then(function (d) {
    sel = createSelect();
    sel.position(100, 520);
    if (keyIsPressed !== true) sel.hide();
    for (var i = 0; i < d.length; i++) {
      if (d[i].kind == 'videoinput') {
        let label = d[i].label;
        let ending = label.indexOf('(');
        if (ending == -1) ending = label.length;
        label = label.substring(0, ending);
        sel.option(label, d[i].deviceId);
      }
      if (preferredCam) sel.selected(preferredCam);
    }
    sel.changed(function () {
      let item = sel.value();
      localStorage.setItem('preferredCam', item);
      videoOptions = {
        video: {
          optional: [
            {
              sourceId: item,
            },
          ],
        },
      };
      video.remove();
      video = createCapture(videoOptions, VIDEO);
      video.hide();
      console.log('Preferred Camera', videoOptions);
    });
  });

  return videoOptions;
}
