import _Shaderity from '../../../dist/esm/index';

declare const Shaderity: typeof _Shaderity;
(async () => {
  const shaderityObjCreator = Shaderity.createShaderityObjectCreator('vertex');

  const shaderityObject = shaderityObjCreator.createShaderityObject();
  console.log(shaderityObject.shaderStage)
  console.log(shaderityObject.code)
})();
