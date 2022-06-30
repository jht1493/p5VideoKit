class eff_pose_net {
  static meta_props = {
    alpha: [255, 230, 180, 100, 10],
    ndetect: [4, 1, 2, 3],
    figure_color: [0, 1],
    stroke_weight: [0, 1, 2, 4, 8],
    _points: [0, 1],
    points_size: [10, 20, 30, 40],
    points_color_offset: [0, 1, 2, 3],
    _skel: [0, 1],
    skel_weight: [1, 5, 10, 20],
    skel_color_offset: [0, 1, 2, 3],
    hflip: [1, 0],
    show_head: [1, 0],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init(this);
  }
  render() {
    if (this.poseNet) {
      this.poseNet.video = this.video;
    }
    a_poses = this.poses;
    if (this.points) this.drawKeypoints(this.poses);
    if (this.skel) this.drawSkeleton(this.poses);
    this.drawFigure(this.poses);
  }
  init() {
    this.video = this.input.elt;
    this.poses = [];

    if (this.figure_color) {
      // Copy of input for getting color
      let w = this.input.width;
      let h = this.input.height;
      this.img = createImage(w, h);
      this.init_input = this.input;
    }

    ui_message('loading model...');
    let options = { flipHorizontal: this.hflip, maxPoseDetections: this.ndetect };
    this.poseNet = ml5.poseNet(this.video, options, function () {
      // console.log('eff_pose_net Model ready!');
      ui_message('');
    });
    this.poseNet.on('pose', (results) => {
      // console.log('eff_pose_net pose results.length', results.length);
      this.poses = results;
    });
  }
  drawFigure(poses) {
    if (this.figure_color) {
      image_copy(this.img, this.init_input);
    }
    // noFill();
    strokeWeight(this.stroke_weight);
    let pad = this.isrc.pad;
    // let w = pad.width;
    let h = pad.height;
    this.px0 = pad.x0;
    this.py0 = pad.y0;
    this.r1 = h / this.input.height;
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i].pose;

      let cols = dot_colors[i % dot_colors.length];
      let colf;
      if (this.figure_color) {
        let x1 = pose.nose.x;
        let y1 = pose.nose.y;
        if (this.hflip) {
          x1 = this.img.width - x1;
        }
        colf = this.img.get(x1, y1);
      } else {
        colf = cols;
      }
      cols[3] = this.alpha;
      colf[3] = this.alpha;
      stroke(cols);
      fill(colf);

      this.draw_pose(pose);
    }
  }
  draw_pose(pose) {
    this.draw_top(pose);
    this.draw_torso(pose);
  }
  draw_top(pose) {
    let { px0, py0, r1 } = this;

    let x1 = pose.rightShoulder.x * r1 + px0;
    let y1 = pose.rightShoulder.y * r1 + py0;
    let x2 = pose.leftShoulder.x * r1 + px0;
    let y2 = pose.leftShoulder.y * r1 + py0;

    let x0 = pose.nose.x * r1 + px0;
    let y0 = pose.nose.y * r1 + py0;

    let dx = x2 - x1;
    let dy = y2 - y1;
    // + Math.PI needed for flipHorizontal: 1
    let a = atan2(dy, dx);
    if (this.hflip) a += Math.PI;

    let x3 = x1 + dx / 2;
    let y3 = y1 + dy / 2;

    let fh = dist(x3, y3, x0, y0);
    let fw = (pose.rightEar.x - pose.leftEar.x) * r1;
    let w = fw / 8;
    let h = fh / 2;

    push();
    translate(x3, y3);
    rotate(a);

    if (this.show_head) {
      ellipse(0, -2 * h, fw, fh);
    }

    let x4 = 0 - w;
    let y4 = 0 - h;
    let x5 = 0 + w;
    let y5 = 0 - h;
    let x6 = 0 - 2 * w;
    let y6 = 0;
    let x7 = 0 + 2 * w;
    let y7 = 0;
    quad(x4, y4, x5, y5, x7, y7, x6, y6);

    pop();

    this.w = w;
    this.h = h;
  }
  draw_torso(pose) {
    let { px0, py0, r1, h } = this;
    let x1 = pose.rightShoulder.x * r1 + px0;
    let y1 = pose.rightShoulder.y * r1 + py0;
    let x2 = pose.leftShoulder.x * r1 + px0;
    let y2 = pose.leftShoulder.y * r1 + py0;
    let x3 = pose.leftHip.x * r1 + px0;
    let y3 = pose.leftHip.y * r1 + py0;
    let x4 = pose.rightHip.x * r1 + px0;
    let y4 = pose.rightHip.y * r1 + py0;
    let x5 = x4 + (x3 - x4) / 6;
    let y5 = y1 + ((y4 - y1) * 2) / 3;
    let x6 = x3 - (x3 - x4) / 6;
    let y6 = y2 + ((y3 - y2) * 2) / 3;
    // quad(x1, y1, x2, y2, x3, y3, x4, y4);
    quad(x1, y1, x2, y2, x6, y6, x5, y5);
    quad(x5, y5, x6, y6, x3, y3, x4, y4);

    // Arms
    this.draw_limb(pose.rightElbow, pose.rightWrist, x1, y1, h);
    this.draw_limb(pose.leftElbow, pose.leftWrist, x2, y2, h);

    // Legs
    let hh = h / 2;
    let hhy = hh;
    if (!this.hflip) hh = -hh;
    this.draw_limb(pose.rightKnee, pose.rightAnkle, x4 - hh, y4 - hhy, h);
    this.draw_limb(pose.leftKnee, pose.leftAnkle, x3 + hh, y3 - hhy, h);
  }
  draw_limb(elbow, wrist, x2, y2, h) {
    let { px0, py0, r1 } = this;
    let x1 = elbow.x * r1 + px0;
    let y1 = elbow.y * r1 + py0;
    let hh = h / 2;
    y2 += hh;
    // circle(x2, y2, h);
    let dx = x2 - x1;
    let dy = y2 - y1;
    let r = hh;
    let a = atan2(dy, dx);
    let x3 = x2 + r * cos(a - HALF_PI);
    let y3 = y2 + r * sin(a - HALF_PI);
    let x4 = x2 + r * cos(a + HALF_PI);
    let y4 = y2 + r * sin(a + HALF_PI);
    r = hh / 2;
    let x5 = x1 + r * cos(a - HALF_PI);
    let y5 = y1 + r * sin(a - HALF_PI);
    let x6 = x1 + r * cos(a + HALF_PI);
    let y6 = y1 + r * sin(a + HALF_PI);
    quad(x3, y3, x4, y4, x6, y6, x5, y5);
    this.draw_fore_limb(wrist, x1, y1, r);

    circle(x2, y2, h);
  }
  draw_fore_limb(wrist, x1, y1, r) {
    let { px0, py0, r1 } = this;
    let x0 = wrist.x * r1 + px0;
    let y0 = wrist.y * r1 + py0;
    // circle(x1, y1, r * 2);
    let dx = x1 - x0;
    let dy = y1 - y0;
    let a = atan2(dy, dx);
    let x3 = x1 + r * cos(a - HALF_PI);
    let y3 = y1 + r * sin(a - HALF_PI);
    let x4 = x1 + r * cos(a + HALF_PI);
    let y4 = y1 + r * sin(a + HALF_PI);
    let x5 = x0 + r * cos(a - HALF_PI);
    let y5 = y0 + r * sin(a - HALF_PI);
    let x6 = x0 + r * cos(a + HALF_PI);
    let y6 = y0 + r * sin(a + HALF_PI);
    quad(x3, y3, x4, y4, x6, y6, x5, y5);
    // circle(x0, y0, r * 2);
    this.draw_hand_foot(x0, y0, r, a);

    circle(x0, y0, r * 2);
    circle(x1, y1, r * 2);
  }
  draw_hand_foot(x0, y0, r, a) {
    // r = r * 0.75;
    let x2 = x0 - 1 * r * cos(a);
    let y2 = y0 - 1 * r * sin(a);
    let x1 = x0 - 3 * r * cos(a);
    let y1 = y0 - 3 * r * sin(a);
    let r1 = r * 0.75;
    let x3 = x2 + r1 * cos(a - HALF_PI);
    let y3 = y2 + r1 * sin(a - HALF_PI);
    let x4 = x2 + r1 * cos(a + HALF_PI);
    let y4 = y2 + r1 * sin(a + HALF_PI);
    let r2 = r * 1.5;
    let x5 = x1 + r2 * cos(a - HALF_PI);
    let y5 = y1 + r2 * sin(a - HALF_PI);
    let x6 = x1 + r2 * cos(a + HALF_PI);
    let y6 = y1 + r2 * sin(a + HALF_PI);
    quad(x3, y3, x4, y4, x6, y6, x5, y5);
  }
  drawKeypoints(poses) {
    // fill('yellow');
    noStroke();
    let pad = this.isrc.pad;
    // let w = pad.width;
    let h = pad.height;
    let px0 = pad.x0;
    let py0 = pad.y0;
    let r1 = h / this.input.height;
    let len = this.points_size;
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let ii = i + this.points_color_offset;
      let col = dot_colors[ii % dot_colors.length];
      col[3] = this.alpha;
      fill(col);
      let pose = poses[i].pose;
      for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.keypoints[j];
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
          // ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
          let { x, y } = keypoint.position;
          x = x * r1 + px0;
          y = y * r1 + py0;
          ellipse(x, y, len, len);
        }
      }
    }
  }
  drawSkeleton(poses) {
    strokeWeight(this.skel_weight);
    // stroke('red');
    let pad = this.isrc.pad;
    // let w = pad.width;
    let h = pad.height;
    let px0 = pad.x0;
    let py0 = pad.y0;
    let r1 = h / this.input.height;
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
      // For every skeleton, loop through all body connections
      let ii = i + this.skel_color_offset;
      let col = dot_colors[ii % dot_colors.length];
      col[3] = this.alpha;
      stroke(col);
      let skeleton = poses[i].skeleton;
      for (let j = 0; j < skeleton.length; j++) {
        let skel = skeleton[j];
        let partA = skel[0].position;
        let partB = skel[1].position;
        let x1 = partA.x;
        let y1 = partA.y;
        let x2 = partB.x;
        let y2 = partB.y;
        x1 = x1 * r1 + px0;
        y1 = y1 * r1 + py0;
        x2 = x2 * r1 + px0;
        y2 = y2 * r1 + py0;
        line(x1, y1, x2, y2);
      }
    }
  }
}

let a_alpha = 255; // will be overriden by meta_props
let dot_colors = [
  [0, 0, 0, a_alpha],
  [255, 255, 0, a_alpha],
  [255, 0, 0, a_alpha],
  [0, 255, 0, a_alpha],
];

// For debugging
let a_poses;

// https://learn.ml5js.org/#/reference/posenet
// https://editor.p5js.org/ml5/sketches/PoseNet_webcam
