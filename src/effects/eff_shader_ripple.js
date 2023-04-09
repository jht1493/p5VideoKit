// WEBGL shader ripple

export default class eff_shader_ripple {
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
        // console.log('setup this', this);
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

        // send a slow frameCount to the shader as a time variable
        this.aShader.setUniform('time', p_.frameCount * 0.01);

        // lets map the mouseX to frequency and mouseY to amplitude
        // try playing with these to get a more or less distorted effect
        // 10 and 0.25 are just magic numbers that I thought looked good
        let freq = p_.map(p_.mouseX, 0, width, 0, 10.0);
        let amp = p_.map(p_.mouseY, 0, height, 0, 0.25);

        // send the two values to the shader
        this.aShader.setUniform('frequency', freq);
        this.aShader.setUniform('amplitude', amp);

        // rect gives us some geometry on the screen
        p_.rect(0, 0, width, height);
      };
    };
    this.p_inst = new p5(skt);
  }
  deinit() {
    // console.log('eff_shader_ripple deinit this.aCanvas', this.aCanvas);
    if (this.aCanvas) {
      this.aCanvas.remove();
    }
  }
}

let a_frag = `
precision mediump float;
// lets grab texcoords just for fun
varying vec2 vTexCoord;
// our texture coming from p5
uniform sampler2D tex0;
uniform float time;
uniform float frequency;
uniform float amplitude;
void main() {
  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = 1.0 - uv;
  // lets create a sine wave to distort our texture coords
  // we will use the built in sin() function in glsl
  // sin() returns the sine of an angle in radians
  // first will multiply our uv * frequency -- frequency will control how many hills and valleys will be in the wave
  // then we add some time to our sine, this will make it move 
  // lastly multiply the whole thing by amplitude -- amplitude controls how tall the hills and valleys are, in this case it will be how much to distort the image
  // *try changing uv.y to uv.x and see what happens
  float sineWave = sin(uv.y * frequency + time) * amplitude;
  // create a vec2 with our sine
  // what happens if you put sineWave in the y slot? in Both slots?
  vec2 distort = vec2(sineWave, 0.0);
  // add the distortion to our texture coordinates
  vec4 tex = texture2D(tex0, uv + distort);
  gl_FragColor = tex;
}
`;

let a_vert = `
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

// in this sketch the camera image will be distorted by using a sine wave function in the shader
// https://github.com/aferriss/p5jsShaderExamples.git
// p5jsShaderExamples/4_image-effects/4-3_sinewave-distort/sketch.js

// https://editor.p5js.org/jht1493/sketches/EuwnL3gxd
// 3d-shader-webcam-shade
