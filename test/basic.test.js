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
  expect(Shaderity.transformTo('glsl es1', textureFuncFragmentES3).code).toBe(`#version 100
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
  const reflection = Shaderity.createReflectionObject(reflectionVertexES1);
  reflection.reflect();
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
  const reflection = Shaderity.createReflectionObject(reflectionVertexES1);
  reflection.reflect();
  expect(reflection.varyings[0]).toStrictEqual({
    name: 'v_position',
    type: 'vec3',
    inout: 'out'
  });
});

test('test uniform variable reflection (ES1)', async() => {
  const reflection = Shaderity.createReflectionObject(reflectionVertexES1);
  reflection.reflect();
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
  const reflection = Shaderity.createReflectionObject(reflectionVertexES3);
  reflection.reflect();
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
  const reflection = Shaderity.createReflectionObject(shaderityObject);
  reflection.reflect();
  expect(reflection.uniforms[1]).toStrictEqual({
    name: 'u_textureCube',
    type: 'samplerCube',
    semantic: 'UNKNOWN'
  });
});

test('test addDefineDirective method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addDefineDirective('testA');
  shaderityObjectCreator.addDefineDirective('testB B');
  shaderityObjectCreator.addDefineDirective('testC_c C');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`#define testA
#define testB B
#define testC_c C

precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

`);
});

test('test removeDefineDirective method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addDefineDirective('testA');
  shaderityObjectCreator.addDefineDirective('testB B');
  shaderityObjectCreator.addDefineDirective('testC_c C');
  shaderityObjectCreator.removeDefineDirective('testB B');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`#define testA
#define testC_c C

precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

`);
});

test('test addExtension method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addExtension('GL_OES_standard_derivatives', 'enable');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`#extension GL_OES_standard_derivatives: enable

precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

`);
});

test('test removeExtension method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addExtension('GL_OES_standard_derivatives', 'enable');
  shaderityObjectCreator.removeExtension('GL_OES_standard_derivatives', 'enable');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

`);
});

test('test updateGlobalPrecision method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.updateGlobalPrecision({
    int: 'mediump',
    float: 'lowp',
  });

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision mediump int;
precision lowp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

`);
});

test('test addGlobalConstantValue method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addGlobalConstantValue('testInt', 'int', [-2.0]);
  shaderityObjectCreator.addGlobalConstantValue('testFloat', 'float', [0.3]);
  shaderityObjectCreator.addGlobalConstantValue('testMat', 'mat2', [-10, -50.10, 3, 3.7]);
  shaderityObjectCreator.addGlobalConstantValue('testVec', 'vec4', [20.0, 1.57, -3, -10.0]);
  shaderityObjectCreator.addGlobalConstantValue('testIVec', 'ivec3', [-7, 4.0, 5]);

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

const int testInt = int(-2);
const float testFloat = float(0.3);
const mat2 testMat = mat2(-10, -50.1, 3, 3.7);
const vec4 testVec = vec4(20, 1.57, -3, -10);
const ivec3 testIVec = ivec3(-7, 4, 5);

`);
});

test('test updateGlobalConstantValue method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addGlobalConstantValue('testInt', 'int', [-2.0]);
  shaderityObjectCreator.addGlobalConstantValue('testFloat', 'float', [0.3]);
  shaderityObjectCreator.addGlobalConstantValue('testMat', 'mat2', [-10, -50.10, 3, 3.7]);
  shaderityObjectCreator.addGlobalConstantValue('testVec', 'vec4', [20.0, 1.57, -3, -10.0]);
  shaderityObjectCreator.addGlobalConstantValue('testIVec', 'ivec3', [-7, 4.0, 5]);

  shaderityObjectCreator.updateGlobalConstantValue('testFloat', [-0.35]);

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

const int testInt = int(-2);
const float testFloat = float(-0.35);
const mat2 testMat = mat2(-10, -50.1, 3, 3.7);
const vec4 testVec = vec4(20, 1.57, -3, -10);
const ivec3 testIVec = ivec3(-7, 4, 5);

`);
});

test('test removeGlobalConstantValue method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addGlobalConstantValue('testInt', 'int', [-2.0]);
  shaderityObjectCreator.addGlobalConstantValue('testFloat', 'float', [0.3]);
  shaderityObjectCreator.addGlobalConstantValue('testMat', 'mat2', [-10, -50.10, 3, 3.7]);
  shaderityObjectCreator.addGlobalConstantValue('testVec', 'vec4', [20.0, 1.57, -3, -10.0]);
  shaderityObjectCreator.addGlobalConstantValue('testIVec', 'ivec3', [-7, 4.0, 5]);

  shaderityObjectCreator.removeGlobalConstantValue('testFloat');
  shaderityObjectCreator.removeGlobalConstantValue('testVec');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

const int testInt = int(-2);
const mat2 testMat = mat2(-10, -50.1, 3, 3.7);
const ivec3 testIVec = ivec3(-7, 4, 5);

`);
});

test('test addAttribute method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addAttributeDeclaration('a_testA', 'float');
  shaderityObjectCreator.addAttributeDeclaration('a_testB', 'vec3', {});
  shaderityObjectCreator.addAttributeDeclaration('a_testC', 'mat4', { precision: 'mediump' });
  shaderityObjectCreator.addAttributeDeclaration('a_testD', 'ivec4', { location: 0 });
  shaderityObjectCreator.addAttributeDeclaration('a_testE', 'int', { location: 1, precision: 'lowp' });

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

in float a_testA;
in vec3 a_testB;
in mediump mat4 a_testC;
layout (location = 0) in ivec4 a_testD;
layout (location = 1) in lowp int a_testE;

`);
});

test('test removeAttribute method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addAttributeDeclaration('a_testA', 'float');
  shaderityObjectCreator.addAttributeDeclaration('a_testB', 'vec3', {});
  shaderityObjectCreator.addAttributeDeclaration('a_testC', 'mat4', { precision: 'mediump' });
  shaderityObjectCreator.addAttributeDeclaration('a_testD', 'ivec4', { location: 0 });
  shaderityObjectCreator.addAttributeDeclaration('a_testE', 'int', { location: 1, precision: 'lowp' });

  shaderityObjectCreator.removeAttributeDeclaration('a_testC');
  shaderityObjectCreator.removeAttributeDeclaration('a_testE');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

in float a_testA;
in vec3 a_testB;
layout (location = 0) in ivec4 a_testD;

`);
});

test('test addVarying method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addVaryingDeclaration('v_testA', 'float');
  shaderityObjectCreator.addVaryingDeclaration('v_testB', 'vec3', {});
  shaderityObjectCreator.addVaryingDeclaration('v_testC', 'mat4', { precision: 'mediump' });
  shaderityObjectCreator.addVaryingDeclaration('v_testD', 'ivec4', { interpolationType: 'flat' });
  shaderityObjectCreator.addVaryingDeclaration('v_testE', 'mat2', { interpolationType: 'smooth', precision: 'lowp' });

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

out float v_testA;
out vec3 v_testB;
out mediump mat4 v_testC;
flat out ivec4 v_testD;
smooth out lowp mat2 v_testE;

`);
});

test('test removeVarying method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addVaryingDeclaration('v_testA', 'float');
  shaderityObjectCreator.addVaryingDeclaration('v_testB', 'vec3', {});
  shaderityObjectCreator.addVaryingDeclaration('v_testC', 'mat4', { precision: 'mediump' });
  shaderityObjectCreator.addVaryingDeclaration('v_testD', 'ivec4', { interpolationType: 'flat' });
  shaderityObjectCreator.addVaryingDeclaration('v_testE', 'mat2', { interpolationType: 'smooth', precision: 'lowp' });

  shaderityObjectCreator.removeVaryingDeclaration('v_testB');
  shaderityObjectCreator.removeVaryingDeclaration('v_testD');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

out float v_testA;
out mediump mat4 v_testC;
smooth out lowp mat2 v_testE;

`);
});

test('test addVarying method for fragment shader in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('fragment');
  shaderityObjectCreator.addVaryingDeclaration('v_testA', 'float');
  shaderityObjectCreator.addVaryingDeclaration('v_testB', 'vec3', {});
  shaderityObjectCreator.addVaryingDeclaration('v_testC', 'mat4', { precision: 'mediump' });
  shaderityObjectCreator.addVaryingDeclaration('v_testD', 'ivec4', { interpolationType: 'flat' });
  shaderityObjectCreator.addVaryingDeclaration('v_testE', 'mat2', { interpolationType: 'smooth', precision: 'lowp' });

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

in float v_testA;
in vec3 v_testB;
in mediump mat4 v_testC;
flat in ivec4 v_testD;
smooth in lowp mat2 v_testE;

`);
});

test('test addUniform method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addUniformDeclaration('u_testA', 'mat4x2');
  shaderityObjectCreator.addUniformDeclaration('u_testB', 'uvec3', {});
  shaderityObjectCreator.addUniformDeclaration('u_testC', 'sampler2D', { precision: 'lowp' });
  shaderityObjectCreator.addUniformDeclaration('u_testD', 'sampler2DArray', {});

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

uniform mat4x2 u_testA;
uniform uvec3 u_testB;
uniform lowp sampler2D u_testC;
uniform sampler2DArray u_testD;

`);
});

test('test removeUniform method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addUniformDeclaration('u_testA', 'mat4x2');
  shaderityObjectCreator.addUniformDeclaration('u_testB', 'uvec3', {});
  shaderityObjectCreator.addUniformDeclaration('u_testC', 'sampler2D', { precision: 'lowp' });
  shaderityObjectCreator.addUniformDeclaration('u_testD', 'sampler2DArray', {});

  shaderityObjectCreator.removeUniformDeclaration('u_testA');
  shaderityObjectCreator.removeUniformDeclaration('u_testC');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toStrictEqual(`precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

uniform uvec3 u_testB;
uniform sampler2DArray u_testD;

`);
});
