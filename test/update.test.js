const Shaderity = require('../dist/esm/index').default;

test('test updateMainFunction method in ShaderityObjectCreator', async() => {
  const mainFunction = `void main() {
  renderTarget0 = vec4(0.5, 0.5, 0.5, 1.0);
}`;

  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('fragment');
  shaderityObjectCreator.updateMainFunction(mainFunction);

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toBe(`#version 300 es

precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

layout(location = 0) out vec4 renderTarget0;

void main() {
  renderTarget0 = vec4(0.5, 0.5, 0.5, 1.0);
}
`);
});

test('test updateOutputColorVariableName method in ShaderityObjectCreator', async() => {
  const mainFunction = `void main() {
  rt0 = vec4(0.5, 0.5, 0.5, 1.0);
}`;

  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('fragment');
  shaderityObjectCreator.updateMainFunction(mainFunction);
  shaderityObjectCreator.updateOutputColorVariableName('rt0');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toBe(`#version 300 es

precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

layout(location = 0) out vec4 rt0;

void main() {
  rt0 = vec4(0.5, 0.5, 0.5, 1.0);
}
`);
});

test('test updateGlobalConstantStructValue method in ShaderityObjectCreator', async() => {
  const shaderStructVariableObjectsA = [{
      memberName: 'varA',
      type: 'float',
      precision: 'lowp',
    },
    {
      memberName: 'varB',
      type: 'mat2',
    },
  ];

  const shaderStructVariableObjectsB = [{
      memberName: 'varA',
      type: 'float',
    },
    {
      memberName: 'varB',
      type: 'isampler2D',
      precision: 'highp',
    },
    {
      memberName: 'varC',
      type: 'sampler3D',
      precision: 'mediump',
    },
  ];

  const structValueA = {
    varA: [1.0],
    varB: [1.3, 2, -5.1, -10.0],
  };

  const structValueB = {
    varA: [-10.0],
    varB: [13.1, -22.1, 1.4, 5],
  };

  const structValueC = {
    varA: [10.0],
    varB: [13.1, -22.1, 1.4, 5],
  };

  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addStructDefinition('testStructA', shaderStructVariableObjectsA);
  shaderityObjectCreator.addStructDefinition('testStructB', shaderStructVariableObjectsB);

  shaderityObjectCreator.addGlobalConstantStructValue('testStructA', 'structVarA', structValueA);
  shaderityObjectCreator.addGlobalConstantStructValue('testStructA', 'structVarB', structValueB);

  shaderityObjectCreator.updateGlobalConstantStructValue('structVarB', structValueC);

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toBe(`#version 300 es

precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

struct testStructA {
  lowp float varA;
  mat2 varB;
};
struct testStructB {
  float varA;
  highp isampler2D varB;
  mediump sampler3D varC;
};

const testStructA structVarA = testStructA (
  float(1),
  mat2(1.3, 2, -5.1, -10)
);
const testStructA structVarB = testStructA (
  float(10),
  mat2(13.1, -22.1, 1.4, 5)
);

void main() {}
`);
});

test('test updateGlobalConstantValue method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addGlobalConstantValue('testInt', 'int', [-2.0]);
  shaderityObjectCreator.addGlobalConstantValue('testFloat', 'float', [0.3]);
  shaderityObjectCreator.addGlobalConstantValue('testMat', 'mat2', [-10, -50.10, 3, 3.7]);
  shaderityObjectCreator.addGlobalConstantValue('testVec', 'vec4', [20.0, 1.57, -3, -10.0]);
  shaderityObjectCreator.addGlobalConstantValue('testIVec', 'ivec3', [-7, 4.0, 5]);

  shaderityObjectCreator.updateGlobalConstantValue('testFloat', [-0.35]);

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toBe(`#version 300 es

precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

const int testInt = int(-2);
const float testFloat = float(-0.35);
const mat2 testMat = mat2(-10, -50.1, 3, 3.7);
const vec4 testVec = vec4(20, 1.57, -3, -10);
const ivec3 testIVec = ivec3(-7, 4, 5);

void main() {}
`);
});

test('test updateGlobalPrecision method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.updateGlobalPrecision({
    int: 'mediump',
    float: 'lowp',
  });

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toBe(`#version 300 es

precision mediump int;
precision lowp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

void main() {}
`);
});

test('test updateGlobalPrecision method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.updateGlobalPrecision({
    int: 'mediump',
    float: 'lowp',
  });

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toBe(`#version 300 es

precision mediump int;
precision lowp float;
precision highp sampler2D;
precision highp samplerCube;
precision highp sampler3D;
precision highp sampler2DArray;
precision highp isampler2D;
precision highp isamplerCube;
precision highp isampler3D;
precision highp isampler2DArray;
precision highp usampler2D;
precision highp usamplerCube;
precision highp usampler3D;
precision highp usampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;

void main() {}
`);
});