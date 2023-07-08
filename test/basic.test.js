const Shaderity = require('../dist/esm/index').default;
const simpleFragment = require('../dist/index_test').simpleFragment;
const dynamicTemplateFragment = require('../dist/index_test').dynamicTemplateFragment;
const insertDefinitionVertex = require('../dist/index_test').insertDefinitionVertex;
const reflectionVertexES1 = require('../dist/index_test').reflectionVertexES1;
const reflectionVertexES3 = require('../dist/index_test').reflectionVertexES3;


test('detect shader stage correctly', async() => {
  expect(simpleFragment.shaderStage).toBe('fragment');
  expect(simpleFragment.isFragmentShader).toBe(true);
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

void main () {
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

test('test varying variable reflection (ES3)', async() => {
  const reflection = Shaderity.createReflectionObject(reflectionVertexES3);
  reflection.reflect();
  expect(reflection.varyings[0]).toStrictEqual({
    name: 'v_position',
    type: 'vec3',
    inout: 'out'
  });
});
