const Shaderity = require('../dist/esm/index').default;
const layoutUniformFragmentES3 = require('../dist/index_test').layoutUniformFragmentES3;
const precisionES3 = require('../dist/index_test').precisionES3;
const attributeAndVaryingPrecisionES3 = require('../dist/index_test').attributeAndVaryingPrecisionES3;
const layoutAttributeES3 = require('../dist/index_test').layoutAttributeES3;
const outToGlFragColorES3 = require('../dist/index_test').outToGlFragColorES3;
const outQualifierFragmentES3 = require('../dist/index_test').outQualifierFragmentES3;

test('insertGlFragColor', async() => {
  expect(Shaderity.transformTo('WebGL1', outQualifierFragmentES3).code).toBe(`#version 100
vec4 rt0;

void main () {
  if(false){
  gl_FragColor = rt0;
    return;
  }

  gl_FragColor = rt0;
}

`);
});

test('test removing `layout(location = x)` from ES3 shader to ES1 shader', async() => {
  const shaderityObject = Shaderity.transformToGLSLES1(layoutUniformFragmentES3);
  expect(shaderityObject.code).toBe(
    `#version 100
varying vec2 v_texcoord;
varying vec3 v_texcoord3;
uniform sampler2D u_texture;
uniform samplerCube u_textureCube;


void main () {
  gl_FragColor = texture2D(u_texture, v_texcoord);
  gl_FragColor = textureCube(u_textureCube, v_texcoord3);
  gl_FragColor = texture2DProj(u_texture, v_texcoord);
}
`
  );
  const reflection = Shaderity.createReflectionObject(shaderityObject);
  reflection.reflect();
  expect(reflection.uniforms[1]).toStrictEqual({
    name: 'u_textureCube',
    type: 'samplerCube',
    semantic: 'UNKNOWN'
  });
});

test('test global precision translation from ES3 shader to ES1 shader', async() => {
  const shaderityObject = Shaderity.transformToGLSLES1(precisionES3);
  expect(shaderityObject.code).toBe(`#version 100

precision mediump int;
precision lowp float;
precision highp sampler2D;
precision highp samplerCube;

void main() {}
`);
});

test('test attribute and varying precision translation from ES3 shader to ES1 shader', async() => {
  const shaderityObject = Shaderity.transformToGLSLES1(attributeAndVaryingPrecisionES3);
  expect(shaderityObject.code).toBe(`#version 100
attribute float a_testA;
attribute lowp float a_testB;

varying float v_testA;
varying lowp float v_testB;

void main() {}
`);
});

test('test attribute and varying precision translation from ES3 shader to ES1 shader', async() => {
  const shaderityObject = Shaderity.transformToGLSLES1(attributeAndVaryingPrecisionES3);
  expect(shaderityObject.code).toBe(
    `#version 100
attribute float a_testA;
attribute lowp float a_testB;

varying float v_testA;
varying lowp float v_testB;

void main() {}
`);
});

test('test layout precision translation from ES3 shader to ES1 shader', async() => {
  const shaderityObject = Shaderity.transformToGLSLES1(layoutAttributeES3);
  expect(shaderityObject.code).toBe(
    `#version 100
attribute float a_testA;
attribute lowp vec2 a_testB;
attribute float a_testC;
attribute lowp vec2 a_testD;

void main () {}
`
  );
});

test('test create gl_FragColor from out qualifier', async() => {
  const shaderityObject = Shaderity.transformToGLSLES1(outToGlFragColorES3);
  expect(shaderityObject.code).toBe(`#version 100

vec4 renderTarget0;

void main() {
  gl_FragColor = renderTarget0;
}
`);
});
