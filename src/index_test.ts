import simpleFragmentShader from '../assets/simple.frag';

export default function simpleFragment() {
  return simpleFragmentShader;

  // return 5;
}


// console.log(simpleFragmentShader);
global._test = {};
global._test.simpleFragment = simpleFragmentShader;

