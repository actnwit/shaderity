const Shaderity = require('../dist/index').default;
const simpleFragment = require('../dist/index_test').simpleFragment;
const simpleVertex = require('../dist/index_test').simpleVertex;
const textureFragmentES1 = require('../dist/index_test').textureFragmentES1;
const textureFragmentES3 = require('../dist/index_test').textureFragmentES3;
const dynamicTemplateFragment = require('../dist/index_test').dynamicTemplateFragment;
const insertDefinitionVertex = require('../dist/index_test').insertDefinitionVertex;
const reflectionVertex = require('../dist/index_test').reflectionVertex;

test('detect shader stage correctly', async () => {
  const shaderity = Shaderity.getInstance();
  expect(simpleFragment.shaderStage).toBe('fragment');
  expect(shaderity.isFragmentShader(simpleFragment)).toBe(true);
});

test('convert to ES1 correctly (fragment)', async () => {
  const shaderity = Shaderity.getInstance();
  expect(shaderity.transformToGLSLES1(simpleFragment).code).toBe(`precision mediump float;

varying vec4 vColor;
varying vec4 vTexcoord;

void main() {
  gl_FlagColor = vColor;
}
`);
});

test('convert to ES1 correctly (vertex)', async () => {
  const shaderity = Shaderity.getInstance();
  expect(shaderity.transformToGLSLES1(simpleVertex).code).toBe(`attribute vec3 position;
attribute vec4 color;
uniform mat4 matrix;
varying vec4 vColor;

void main (void) {
  vColor = color;
  gl_Position = matrix * position;
}
`);
});

test('convert to ES3 correctly (texture)', async () => {
  const shaderity = Shaderity.getInstance();
  expect(shaderity.transformToGLSLES3(textureFragmentES1).code).toBe(`in vec2 v_texcoord;
in vec3 v_texcoord3;
uniform sampler2D u_texture;
uniform samplerCube u_textureCube;

void main (void) {
  gl_FragColor = texture(u_texture, v_texcoord);
  gl_FragColor = texture(u_textureCube, v_texcoord3);
  gl_FragColor = textureProj(u_texture, v_texcoord);
}
`);
});

test('convert to ES1 correctly (texture)', async () => {
  const shaderity = Shaderity.getInstance();
  expect(shaderity.transformTo('WebGL1', textureFragmentES3).code).toBe(`varying vec2 v_texcoord;
varying vec3 v_texcoord3;
uniform sampler2D u_texture;
uniform samplerCube u_textureCube;

void main (void) {
  gl_FragColor = texture2D(u_texture, v_texcoord);
  gl_FragColor = textureCube(u_textureCube, v_texcoord3);
  gl_FragColor = texture2DProj(u_texture, v_texcoord);
}
`);
});

test('test dynamic template', async () => {
  const shaderity = Shaderity.getInstance();
  expect(shaderity.fillTemplate(dynamicTemplateFragment, {
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

test('test insert definition', async () => {
  const shaderity = Shaderity.getInstance();
  expect(shaderity.insertDefinition(insertDefinitionVertex, 'GLSL_ES3').code).toBe(`#define GLSL_ES3
in vec3 position;

void main (void) {
  gl_Position = vec4(position, 1.0);
}
`);
});

test('test attribute variable reflection', async () => {
  const shaderity = Shaderity.getInstance();
  const reflection = shaderity.reflect(reflectionVertex);
  expect(reflection.attributes[0]).toStrictEqual(
    {
      name: 'a_position',
      type: 'vec3',
      semantic: 'POSITION'
    }
    );
  expect(reflection.attributes[1]).toStrictEqual(
    {
      name: 'a_uv',
      type: 'vec2',
      semantic: 'TEXCOORD_0'
    }
    );
});

test('test varying variable reflection', async () => {
  const shaderity = Shaderity.getInstance();
  const reflection = shaderity.reflect(reflectionVertex);
  expect(reflection.varyings[0]).toStrictEqual(
    {
      name: 'v_position',
      type: 'vec3',
      inout: 'out'
    }
    );
});

test('test uniform variable reflection', async () => {
  const shaderity = Shaderity.getInstance();
  const reflection = shaderity.reflect(reflectionVertex);
  expect(reflection.uniforms[0]).toStrictEqual(
    {
      name: 'u_worldMatrix',
      type: 'vec4',
      semantic: 'WorldMatrix'
    }
    );
  expect(reflection.uniforms[1]).toStrictEqual(
    {
      name: 'u_texture',
      type: 'sampler2D',
      semantic: 'DataTexture'
    }
    );
});
