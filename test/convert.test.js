const Shaderity = require('../dist/esm/index').default;
const simpleFragment = require('../dist/index_test').simpleFragment;
const simpleVertex = require('../dist/index_test').simpleVertex;
const textureFragmentES1 = require('../dist/index_test').textureFragmentES1;
const textureFragmentES3 = require('../dist/index_test').textureFragmentES3;
const textureFuncFragmentES3 = require('../dist/index_test').textureFuncFragmentES3;
const textureFuncVertexES3 = require('../dist/index_test').textureFuncVertexES3;
const textureFuncComplicatedES3Shader = require('../dist/index_test').textureFuncComplicatedES3Shader;

test('convert to ES1 correctly (fragment)', async() => {
  expect(Shaderity.transformToGLSLES1(simpleFragment).code).toBe(`#version 100
precision mediump float;

varying vec4 vColor;
varying vec4 vTexcoord;

void main() {
  gl_FlagColor = vColor;
}
`);
});

test('convert to ES1 correctly (vertex)', async() => {
  expect(Shaderity.transformToGLSLES1(simpleVertex).code).toBe(`#version 100
attribute vec3 position;
attribute vec4 color;
uniform mat4 matrix;
varying vec4 vColor;

void main () {
  vColor = color;
  gl_Position = matrix * position;
}
`);
});

test('convert to ES3 correctly (texture)', async() => {
  expect(Shaderity.transformToGLSLES3(textureFragmentES1).code).toBe(`#version 300 es
#define GLSL_ES3
// texture_es1.frag

in vec2 v_texcoord;
in vec3 v_texcoord3;
uniform sampler2D u_texture;
uniform sampler3D u_texture_3D;
uniform samplerCube u_textureCube;

void main () {
  gl_FragColor = texture(u_texture, v_texcoord);
  gl_FragColor = texture(u_textureCube, v_texcoord3);
  gl_FragColor = textureProj(u_texture, v_texcoord);
  gl_FragColor = texture(u_texture_3D, v_texcoord);
  gl_FragColor = textureProj(u_texture_3D, v_texcoord);
}
`);
});

test('convert to ES1 correctly (texture)', async() => {
  expect(Shaderity.transformTo('WebGL1', textureFragmentES3).code).toBe(`#version 100

varying vec2 v_texcoord;
varying vec3 v_texcoord3;
uniform sampler2D u_texture;
uniform samplerCube u_textureCube;

void main () {
  gl_FragColor = texture2D(u_texture, v_texcoord);
  gl_FragColor = textureCube(u_textureCube, v_texcoord3);
  gl_FragColor = texture2DProj(u_texture, v_texcoord);
}
`);
});

test('convert to ES1 correctly (texture 2)', async() => {
  expect(Shaderity.transformTo('glsl es1', textureFuncFragmentES3).code).toBe(`#version 100
varying vec2 v_texcoord;
varying vec3 v_texcoord3;
uniform sampler2D texture1;
uniform samplerCube texture2;
uniform mediump samplerCube texture3;

void fetch(
  samplerCube texture1,
  sampler2D texture2
) {
  gl_FragColor = texture2D(texture2, v_texcoord);
  gl_FragColor = textureCube(texture1, v_texcoord3);
  gl_FragColor = textureCube(texture3, v_texcoord3);
  gl_FragColor = texture2DProj(texture2, v_texcoord);
}

void fetch2(
  samplerCube texture2,
  // sampler2D texture1
) {
  gl_FragColor = texture2D(texture1, v_texcoord);
  gl_FragColor = textureCube(texture2, v_texcoord3);
  gl_FragColor = texture2DProj(texture1, v_texcoord);
}

void main () {
  fetch(texture2, texture1);
  fetch2(texture2, texture1);
}
`);
});

test('convert to ES1 correctly (texture 3)', async() => {
  expect(Shaderity.transformTo('glsl es1', textureFuncVertexES3).code).toBe(`#version 100
attribute vec2 a_texcoord;
attribute vec3 a_texcoord3;
uniform sampler2D texture1;
uniform samplerCube texture2;
uniform mediump samplerCube texture3;

void fetch(
  samplerCube texture1,
  sampler2D texture2
) {
  gl_FragColor = texture2DLod(texture2, a_texcoord);
  gl_FragColor = textureCubeLod(texture1, a_texcoord3);
  gl_FragColor = textureCube(texture3, a_texcoord3);
  gl_FragColor = texture2DProj(texture2, a_texcoord);
}

void fetch2(
  samplerCube texture2,
  // sampler2D texture1
) {
  gl_FragColor = texture2D(texture1, a_texcoord);
  gl_FragColor = textureCube(texture2, a_texcoord3);
  gl_FragColor = texture2DProj(texture1, a_texcoord);
}

void main () {
  fetch(texture2, texture1);
  fetch2(texture2, texture1);
}
`);
});

test('convert to ES1 correctly (texture 4)', async() => {
  expect(Shaderity.transformTo('glsl es1', textureFuncComplicatedES3Shader).code).toBe(`#version 100
precision highp float;

varying vec2 v_texcoord2;
varying vec3 v_texcoord3;
uniform sampler2D texture1;
uniform samplerCube texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform sampler2D texture5;

void fetch(
  mediump samplerCube texture1,
  sampler2D texture2,
  out samplerCube texture3
) {
  texture3 = texture1;

  texture2D(texture2, v_texcoord2);
  textureCube(texture1, v_texcoord3);
  texture2DProj(texture2, v_texcoord3);

  for(float i = 0.0; i < 5.0; i++) {

  }

  textureCubeLodEXT(texture1, v_texcoord3, 0.0);
  texture2D(texture2, v_texcoord2);
  textureCube(texture1, v_texcoord3);
  texture2DProj(texture2, v_texcoord3);
  texture2DProjLodEXT(texture2, v_texcoord3, 0.0);
}

void fetch2(
  samplerCube texture2,
  in samplerCube texture4,
  const in samplerCube texture5
) {
  texture2D(texture1, v_texcoord2);
  textureCube(texture2, v_texcoord3);
  texture2DProj(texture1, v_texcoord3);

  if(true) {
  }

  bool test = true;

  if(test) {
  }

  texture2DLodEXT(texture1, v_texcoord2, 0.0);
  texture2D(texture1, v_texcoord2);
  textureCube(texture2, v_texcoord3);
  texture2DProj(texture1, v_texcoord3);

  texture2D(texture3, v_texcoord3);
  textureCube(texture4, v_texcoord3);
  textureCube(texture5, v_texcoord3);
}

void main () {
  fetch(texture2, texture1);
  fetch2(texture2);
}
`);
});
