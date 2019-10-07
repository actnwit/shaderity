const simpleFragment = require('../dist/index_test').simpleFragment;
const Shaderity = require('../dist/index').default;

test('detect shader stage correctly', async () => {
  const shaderity = Shaderity.getInstance();
  expect(simpleFragment.shaderStage).toBe('fragment');
  expect(shaderity.isFragmentShader(simpleFragment)).toBe(true);
});

test('convert to ES3 correctly', async () => {
  const shaderity = Shaderity.getInstance();
  expect(shaderity.transform(simpleFragment).code).toBe(`precision mediump float;

varying vec4 vColor;
varying vec4 vTexcoord;

void main() {
  gl_FlagColor = vColor;
}
`);
});
