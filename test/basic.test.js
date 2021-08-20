const Shaderity = require('../dist/index').default;
const simpleFragment = require('../dist/index_test').simpleFragment;
const simpleVertex = require('../dist/index_test').simpleVertex;
const textureFragmentES1 = require('../dist/index_test').textureFragmentES1;
const textureFragmentES3 = require('../dist/index_test').textureFragmentES3;
const textureFuncFragmentES3 = require('../dist/index_test').textureFuncFragmentES3;
const dynamicTemplateFragment = require('../dist/index_test').dynamicTemplateFragment;
const insertDefinitionVertex = require('../dist/index_test').insertDefinitionVertex;
const reflectionVertexES1 = require('../dist/index_test').reflectionVertexES1;
const reflectionVertexES3 = require('../dist/index_test').reflectionVertexES3;
const layoutUniformFragmentES3 = require('../dist/index_test').layoutUniformFragmentES3;


test('detect shader stage correctly', async() => {
  expect(simpleFragment.shaderStage).toBe('fragment');
  expect(simpleFragment.isFragmentShader).toBe(true);
});

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

void main (void) {
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

void main (void) {
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
uniform sampler3D u_texture_3D;
uniform samplerCube u_textureCube;

void main (void) {
  gl_FragColor = texture2D(u_texture, v_texcoord);
  gl_FragColor = textureCube(u_textureCube, v_texcoord3);
  gl_FragColor = texture2DProj(u_texture, v_texcoord);
  gl_FragColor = texture3D(u_texture_3D, v_texcoord);
  gl_FragColor = texture3DProj(u_texture_3D, v_texcoord);
}
`);
});

test('convert to ES1 correctly (texture 2)', async() => {
  expect(Shaderity.transformTo('WebGL1', textureFuncFragmentES3).code).toBe(`#version 100
varying vec2 v_texcoord;
varying vec3 v_texcoord3;
uniform sampler2D texture1;
uniform samplerCube texture2;

void fetch(
  samplerCube texture1,
  sampler2D texture2
) {
  gl_FragColor = texture2D(texture2, v_texcoord);
  gl_FragColor = textureCube(texture1, v_texcoord3);
  gl_FragColor = texture2DProj(texture2, v_texcoord);
}

void fetch2(
  samplerCube texture2,
  sampler2D texture1
) {
  gl_FragColor = texture2D(texture1, v_texcoord);
  gl_FragColor = textureCube(texture2, v_texcoord3);
  gl_FragColor = texture2DProj(texture1, v_texcoord);
}

void main (void) {
  fetch(texture2, texture1);
  fetch2(texture2, texture1);
}
`);
});

test('test dynamic template', async() => {
  expect(Shaderity.fillTemplate(dynamicTemplateFragment, {
    var_a: `Line1
Line2
Line3`,
    var_b: 'foo'
  }).code).toBe(`precision mediump float;

in vec4 vColor;

Line1
Line2
Line3
foo

void main() {
  gl_FlagColor = zero_one(vColor);
}
`);
});

test('test insert definition', async() => {
  expect(Shaderity.insertDefinition(insertDefinitionVertex, 'GLSL_ES3').code).toBe(`#define GLSL_ES3
in vec3 position;

void main (void) {
  gl_Position = vec4(position, 1.0);
}
`);
});

test('test attribute variable reflection (ES1)', async() => {
  const reflection = Shaderity.reflect(reflectionVertexES1);
  expect(reflection.attributes[0]).toStrictEqual({
    name: 'a_position',
    type: 'vec3',
    semantic: 'POSITION'
  });
  expect(reflection.attributes[1]).toStrictEqual({
    name: 'a_uv',
    type: 'vec2',
    semantic: 'TEXCOORD_0'
  });
});

test('test varying variable reflection (ES1)', async() => {
  const reflection = Shaderity.reflect(reflectionVertexES1);
  expect(reflection.varyings[0]).toStrictEqual({
    name: 'v_position',
    type: 'vec3',
    inout: 'out'
  });
});

test('test uniform variable reflection (ES1)', async() => {
  const reflection = Shaderity.reflect(reflectionVertexES1);
  expect(reflection.uniforms[0]).toStrictEqual({
    name: 'u_worldMatrix',
    type: 'vec4',
    semantic: 'WorldMatrix'
  });
  expect(reflection.uniforms[1]).toStrictEqual({
    name: 'u_texture',
    type: 'sampler2D',
    semantic: 'DataTexture'
  });
});

test('test attribute variable reflection (ES3)', async() => {
  const reflection = Shaderity.reflect(reflectionVertexES3);
  expect(reflection.attributes[0]).toStrictEqual({
    name: 'a_position',
    type: 'vec3',
    semantic: 'POSITION'
  });
  expect(reflection.attributes[1]).toStrictEqual({
    name: 'a_uv',
    type: 'vec2',
    semantic: 'TEXCOORD_0'
  });
});

test('test removing `layout(location = x)` from ES3 shader to ES1 shader', async() => {
  const shaderityObject = Shaderity.transformToGLSLES1(layoutUniformFragmentES3);
  expect(shaderityObject.code).toBe(
    `#version 100
varying vec2 v_texcoord;
varying vec3 v_texcoord3;
uniform sampler2D u_texture;
uniform samplerCube u_textureCube;


void main (void) {
  gl_FragColor = texture2D(u_texture, v_texcoord);
  gl_FragColor = textureCube(u_textureCube, v_texcoord3);
  gl_FragColor = texture2DProj(u_texture, v_texcoord);
}
`
  );
  const layoutUniform = Shaderity.reflect(shaderityObject);
  expect(layoutUniform.uniforms[1]).toStrictEqual({
    name: 'u_textureCube',
    type: 'samplerCube',
    semantic: 'UNKNOWN'
  });
});
