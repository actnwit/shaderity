import {simpleFragment} from '../dist/index_test.js';
import Shaderity from '../src/index';

test('detect shader stage correctly', async () => {
  const shaderity = Shaderity.getInstance();
  expect(simpleFragment.shaderStage).toBe('fragment');
  expect(shaderity.isFragmentShader(simpleFragment)).toBe(true);
});

// test('convert to ES3 correctly', async () => {
//   const shaderity = Shaderity.getInstance();
//   console.log(shaderity.transform(simpleFragment).code);
//   expect(shaderity.transform(simpleFragment)).toBe(true);
// });
