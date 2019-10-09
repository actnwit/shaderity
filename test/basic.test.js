const simpleFragment = require('../dist/index_test').simpleFragment;
const simpleVertex = require('../dist/index_test').simpleVertex;
const Shaderity = require('../dist/index').default;

test('detect shader stage correctly', async () => {
  const shaderity = Shaderity.getInstance();
  expect(simpleFragment.shaderStage).toBe('fragment');
  expect(shaderity.isFragmentShader(simpleFragment)).toBe(true);
});

test('convert to ES3 correctly', async () => {
  const shaderity = Shaderity.getInstance();
  expect(shaderity.transformToGLSLES1(simpleFragment).code).toBe(`precision mediump float;

varying vec4 vColor;
varying vec4 vTexcoord;

void main() {
  gl_FlagColor = vColor;
}
`);
});

test('convert to ES3 correctly 2', async () => {
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
