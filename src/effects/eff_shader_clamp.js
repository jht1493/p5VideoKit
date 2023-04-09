// WEBGL shader clamping rgb

export default class eff_shader_clamp {
  static meta_props = {};
  constructor(props) {
    Object.assign(this, props);
    // console.log('eff_shader_clamp props', props);
    // let { width, height } = this.input;
    // this.output = createGraphics(width, height);
    // console.log('eff_shader_clamp constructor width, height', width, height);
    this.init();
  }
  prepareOutput() {
    // console.log('eff_shader_clamp prepareOutput');
    // !!@ WEBGL canvas is not layer to 2D canvas
  }
  init() {
    let { width, height } = this.input;
    let urect = this.eff_spec.urect;
    width = Math.min(width, urect.width);
    height = Math.min(height, urect.height);
    const skt = (p_) => {
      p_.setup = () => {
        // shaders require WEBGL mode to work
        this.aCanvas = p_.createCanvas(width, height, WEBGL);
        this.aShader = p_.createShader(a_vert, a_frag);
        this.aCanvas.position(urect.x0, urect.y0);
      };
      p_.draw = () => {
        // shader() sets the active shader with our shader
        p_.shader(this.aShader);

        // passing cam as a texture
        this.aShader.setUniform('tex0', this.input);

        // rect gives us some geometry on the screen
        p_.rect(0, 0, width, height);
      };
    };
    this.p_inst = new p5(skt);
  }
  deinit() {
    if (this.aCanvas) {
      this.aCanvas.remove();
    }
  }
}

let a_frag = `
// casey conchinha - @kcconch ( https://github.com/kcconch )
// louise lessel - @louiselessel ( https://github.com/louiselessel )
// more p5.js + shader examples: https://itp-xstory.github.io/p5js-shaders/
precision mediump float;
// grab texcoords from vert shader
varying vec2 vTexCoord;
// our texture coming from p5
uniform sampler2D tex0;
void main() {
    vec2 uv = vTexCoord;
    // the texture is loaded upside down and backwards by default so lets flip it
    uv.y = 1.0 - uv.y;
    vec4 tex = texture2D(tex0, uv);
    float gray = (tex.r + tex.g + tex.b) / 3.0;
    float res = 20.0;
    float scl = res / (10.0);
    float threshR = (fract(floor(tex.r*res)/scl)*scl) * gray ;
    float threshG = (fract(floor(tex.g*res)/scl)*scl) * gray ;
    float threshB = (fract(floor(tex.b*res)/scl)*scl) * gray ;
    vec3 thresh = vec3(threshR, threshG, threshB);
    // render the output
    gl_FragColor = vec4(thresh, 1.0);
}
`;

let a_vert = `
// vert file and comments from adam ferriss
// https://github.com/aferriss/p5jsShaderExamples
// our vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;
// lets get texcoords just for fun!
varying vec2 vTexCoord;
void main() {
    // copy the texcoords
    vTexCoord = aTexCoord;
    // copy the position data into a vec4, using 1.0 as the w component
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    // send the vertex information on to the fragment shader
    gl_Position = positionVec4;
}
`;

// https://editor.p5js.org/jht1493/sketches/EuwnL3gxd
// 3d-shader-webcam-shade

// https://editor.p5js.org/jht1493/sketches/xQ1qbzSxv
// 3d-shader-using-webcam

// https://p5js.org/examples/3d-shader-using-webcam.html

// https://github.com/processing/p5.js-website/tree/main/src/data/examples/assets
