import _Shaderity from '../../../dist/esm/index';

declare const Shaderity: typeof _Shaderity;
(async () => {
  fetch('./shaderSample.vert')
    .then(response => response.json())
    .then((shaderityObjectES3) => {
      const shaderityObjectES1 = Shaderity.transformToGLSLES1(shaderityObjectES3);
      console.log(shaderityObjectES1.code);
    });
})();
