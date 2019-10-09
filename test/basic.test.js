const Shaderity = require('../dist/index').default;
const simpleFragment = require('../dist/index_test').simpleFragment;
const simpleVertex = require('../dist/index_test').simpleVertex;
const textureFragment = require('../dist/index_test').textureFragment;

test('detect shader stage correctly', async () => {
  const shaderity = Shaderity.getInstance();
  expect(simpleFragment.shaderStage).toBe('fragment');
  expect(shaderity.isFragmentShader(simpleFragment)).toBe(true);
});

test('convert to ES3 correctly (fragment)', async () => {
  const shaderity = Shaderity.getInstance();
  expect(shaderity.transformToGLSLES1(simpleFragment).code).toBe(`precision mediump float;

varying vec4 vColor;
varying vec4 vTexcoord;

void main() {
  gl_FlagColor = vColor;
}
`);
});

test('convert to ES3 correctly (vertex)', async () => {
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
  expect(shaderity.transformToGLSLES3(textureFragment).code).toBe(`in vec2 v_texcoord;
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
