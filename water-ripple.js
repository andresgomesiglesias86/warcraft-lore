'use strict';

console.log('WaterRippleImage script loaded');

const VERT = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_blueish;
uniform float u_scale;
uniform float u_illumination;
uniform float u_surface_distortion;
uniform float u_water_distortion;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m;
  m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float surface_noise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 10; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.2;
  }
  return (N.x + N.y + .1);
}

void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;

  float t = .002 * u_time;
  vec3 color = vec3(0.);
  float opacity = 0.;

  float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
  vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

  float surf = surface_noise(surface_noise_uv, t, u_scale);
  surf *= pow(uv.y, .3);
  surf = pow(surf, 2.);

  vec2 img_uv = vUv;
  img_uv -= .5;
  if (u_ratio > u_img_ratio) {
    img_uv.x = img_uv.x * u_ratio / u_img_ratio;
  } else {
    img_uv.y = img_uv.y * u_img_ratio / u_ratio;
  }
  float scale_factor = 1.4;
  img_uv *= scale_factor;
  img_uv += .5;
  img_uv.y = 1. - img_uv.y;

  img_uv += (u_water_distortion * outer_noise);
  img_uv += (u_surface_distortion * surf);

  vec4 img = texture2D(u_image_texture, img_uv);
  img *= (1. + u_illumination * surf);

  color += img.rgb;
  color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surf;
  opacity += img.a;

  float edge_width = .02;
  float edge_alpha = smoothstep(0., edge_width, img_uv.x) * smoothstep(1., 1. - edge_width, img_uv.x);
  edge_alpha *= smoothstep(0., edge_width, img_uv.y) * smoothstep(1., 1. - edge_width, img_uv.y);
  color *= edge_alpha;
  opacity *= edge_alpha;

  gl_FragColor = vec4(color, opacity);
}
`;

function compileShader(gl, src, type) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader compile error: ${info || 'unknown'}`);
  }
  return sh;
}

function createProgram(gl, vs, fs) {
  const v = compileShader(gl, vs, gl.VERTEX_SHADER);
  const f = compileShader(gl, fs, gl.FRAGMENT_SHADER);
  const prog = gl.createProgram();
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(`Program link error: ${info || 'unknown'}`);
  }
  return prog;
}

class WaterRippleImage {
  constructor(canvasSelector, options = {}) {
    this.canvas = document.querySelector(canvasSelector);
    if (!this.canvas) {
      console.error(`Canvas not found: ${canvasSelector}`);
      return;
    }

    this.params = {
      blueish: options.blueish ?? 0.6,
      scale: options.scale ?? 7,
      illumination: options.illumination ?? 0.15,
      surfaceDistortion: options.surfaceDistortion ?? 0.07,
      waterDistortion: options.waterDistortion ?? 0.03,
      src: options.src || 'assets/characters/dark-portal.jpg',
    };

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.gl = null;
    this.program = null;
    this.uniforms = {};
    this.texture = null;
    this.image = null;
    this.animId = null;

    this.init();
  }

  init() {
    console.log('Initializing WaterRippleImage');

    // Force canvas to fill parent
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';

    const gl =
      this.canvas.getContext('webgl', { alpha: true, antialias: true }) ||
      this.canvas.getContext('experimental-webgl');

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    console.log('WebGL context created');
    this.gl = gl;

    try {
      this.program = createProgram(gl, VERT, FRAG);
      console.log('Shader program created');
    } catch (e) {
      console.error('Shader compilation error:', e);
      return;
    }

    gl.useProgram(this.program);

    // Get all uniforms
    const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    console.log('Active uniforms:', uniformCount);

    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(this.program, i);
      if (info) {
        this.uniforms[info.name] = gl.getUniformLocation(this.program, info.name);
      }
    }

    // Setup vertex buffer
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Set initial uniforms
    this.updateUniforms();
    console.log('Uniforms set');

    // Resize and setup listener
    this.resize();
    console.log('Canvas resized to', this.canvas.width, 'x', this.canvas.height);

    window.addEventListener('resize', () => this.resize());

    // Load image
    console.log('Loading image:', this.params.src);
    this.loadImage(this.params.src).catch((e) => console.error('Image load error:', e));

    // Start animation loop
    this.render();
    console.log('Render loop started');
  }

  updateUniforms() {
    const gl = this.gl;
    const u = this.uniforms;
    gl.uniform1f(u['u_blueish'], this.params.blueish);
    gl.uniform1f(u['u_scale'], this.params.scale);
    gl.uniform1f(u['u_illumination'], this.params.illumination);
    gl.uniform1f(u['u_surface_distortion'], this.params.surfaceDistortion);
    gl.uniform1f(u['u_water_distortion'], this.params.waterDistortion);
  }

  setTextureFromImage(image) {
    const gl = this.gl;
    if (this.texture) gl.deleteTexture(this.texture);

    const texture = gl.createTexture();
    this.texture = texture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(this.uniforms['u_image_texture'], 0);

    const imgRatio = image.naturalWidth / image.naturalHeight;
    gl.uniform1f(this.uniforms['u_ratio'], this.canvas.width / this.canvas.height);
    gl.uniform1f(this.uniforms['u_img_ratio'], imgRatio);
  }

  loadImage(srcUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.image = img;
        this.setTextureFromImage(img);
        resolve();
      };
      img.onerror = reject;
      img.src = srcUrl;
    });
  }

  resize() {
    const gl = this.gl;
    // Force to match parent element size
    const parent = this.canvas.parentElement;
    const w = Math.floor((parent.clientWidth || window.innerWidth) * this.dpr);
    const h = Math.floor((parent.clientHeight || window.innerHeight) * this.dpr);

    console.log('Resizing canvas to', w, 'x', h, '(parent:', parent.clientWidth, 'x', parent.clientHeight + ')');

    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms['u_ratio'], this.canvas.width / this.canvas.height);

    if (this.image) {
      const imgRatio = this.image.naturalWidth / this.image.naturalHeight;
      gl.uniform1f(this.uniforms['u_img_ratio'], imgRatio);
    }
  }

  render = () => {
    const gl = this.gl;
    gl.uniform1f(this.uniforms['u_time'], performance.now());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.animId = requestAnimationFrame(this.render);
  };

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const gl = this.gl;
    if (this.texture) gl.deleteTexture(this.texture);
    gl.useProgram(null);
    if (this.program) gl.deleteProgram(this.program);
  }
}

// Export for use
window.WaterRippleImage = WaterRippleImage;
