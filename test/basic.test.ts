import '../dist/shaderity_test.js';

test('detect shader stage correctly', async () => {
  expect(global._test.simpleFragment.shaderStage).toBe('fragment');
});
