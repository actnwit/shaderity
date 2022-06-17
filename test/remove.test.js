const Shaderity = require('../dist/esm/index').default;
const smoothVaryingES3 = require('../dist/index_test').smoothVaryingES3;

test('test remove smooth qualifier', async() => {
  const shaderityObject = Shaderity.transformToGLSLES1(smoothVaryingES3);
  expect(shaderityObject.code).toBe(`#version 100

precision highp int;
precision highp float;
precision highp sampler2D;
precision highp samplerCube;

varying float v_testA;
varying lowp mat2 v_testB;

void main() {}
`);
});


test('test removeExtension method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addExtension('GL_OES_standard_derivatives', 'enable');
  shaderityObjectCreator.removeExtension('GL_OES_standard_derivatives', 'enable');

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

void main() {}
`);
});


test('test removeStructDefinition method in ShaderityObjectCreator', async() => {
  const shaderStructVariableObjectsA = [{
      memberName: 'varA',
      type: 'mat2x4',
      precision: 'lowp',
    },
    {
      memberName: 'varB',
      type: 'samplerCubeShadow',
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


  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addStructDefinition('testStructA', shaderStructVariableObjectsA);
  shaderityObjectCreator.addStructDefinition('testStructB', shaderStructVariableObjectsB);

  shaderityObjectCreator.removeStructDefinition('testStructA');

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

struct testStructB {
  float varA;
  highp isampler2D varB;
  mediump sampler3D varC;
};

void main() {}
`);
});


test('test removeGlobalConstantValue method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addGlobalConstantValue('testInt', 'int', [-2.0]);
  shaderityObjectCreator.addGlobalConstantValue('testFloat', 'float', [0.3]);
  shaderityObjectCreator.addGlobalConstantValue('testMat', 'mat2', [-10, -50.10, 3, 3.7]);
  shaderityObjectCreator.addGlobalConstantValue('testVec', 'vec4', [20.0, 1.57, -3, -10.0]);
  shaderityObjectCreator.addGlobalConstantValue('testIVec', 'ivec3', [-7, 4.0, 5]);

  shaderityObjectCreator.removeGlobalConstantValue('testFloat');
  shaderityObjectCreator.removeGlobalConstantValue('testVec');

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
const mat2 testMat = mat2(-10, -50.1, 3, 3.7);
const ivec3 testIVec = ivec3(-7, 4, 5);

void main() {}
`);
});


test('test removeGlobalConstantStructValue method in ShaderityObjectCreator', async() => {
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

  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addStructDefinition('testStructA', shaderStructVariableObjectsA);
  shaderityObjectCreator.addStructDefinition('testStructB', shaderStructVariableObjectsB);

  shaderityObjectCreator.addGlobalConstantStructValue('testStructA', 'structVarA', structValueA);
  shaderityObjectCreator.addGlobalConstantStructValue('testStructA', 'structVarB', structValueB);

  shaderityObjectCreator.removeGlobalConstantStructValue('structVarA');

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

const testStructA structVarB = testStructA (
  float(-10),
  mat2(13.1, -22.1, 1.4, 5)
);

void main() {}
`);
});

test('test removeAttribute method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addAttributeDeclaration('a_testA', 'float');
  shaderityObjectCreator.addAttributeDeclaration('a_testB', 'vec3', {});
  shaderityObjectCreator.addAttributeDeclaration('a_testC', 'mat4', { precision: 'mediump' });
  shaderityObjectCreator.addAttributeDeclaration('a_testD', 'ivec4', { location: 0 });
  shaderityObjectCreator.addAttributeDeclaration('a_testE', 'int', { location: 1, precision: 'lowp' });

  shaderityObjectCreator.removeAttributeDeclaration('a_testC');
  shaderityObjectCreator.removeAttributeDeclaration('a_testE');

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

in float a_testA;
in vec3 a_testB;
layout (location = 0) in ivec4 a_testD;

void main() {}
`);
});

test('test removeVarying method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addVaryingDeclaration('v_testA', 'float');
  shaderityObjectCreator.addVaryingDeclaration('v_testB', 'vec3', {});
  shaderityObjectCreator.addVaryingDeclaration('v_testC', 'mat4', { precision: 'mediump' });
  shaderityObjectCreator.addVaryingDeclaration('v_testD', 'ivec4', { interpolationType: 'flat' });
  shaderityObjectCreator.addVaryingDeclaration('v_testE', 'mat2', { interpolationType: 'smooth', precision: 'lowp' });

  shaderityObjectCreator.removeVaryingDeclaration('v_testB');
  shaderityObjectCreator.removeVaryingDeclaration('v_testD');

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

out float v_testA;
out mediump mat4 v_testC;
smooth out lowp mat2 v_testE;

void main() {}
`);
});


test('test removeUniform method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addUniformDeclaration('u_testA', 'mat4x2');
  shaderityObjectCreator.addUniformDeclaration('u_testB', 'uvec3', {});
  shaderityObjectCreator.addUniformDeclaration('u_testC', 'sampler2D', { precision: 'lowp' });
  shaderityObjectCreator.addUniformDeclaration('u_testD', 'sampler2DArray', {});

  shaderityObjectCreator.removeUniformDeclaration('u_testA');
  shaderityObjectCreator.removeUniformDeclaration('u_testC');

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

uniform uvec3 u_testB;
uniform sampler2DArray u_testD;

void main() {}
`);
});


test('test removeUniformStructDeclaration method in ShaderityObjectCreator', async() => {
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

  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addStructDefinition('testStructA', shaderStructVariableObjectsA);
  shaderityObjectCreator.addStructDefinition('testStructB', shaderStructVariableObjectsB);

  shaderityObjectCreator.addUniformStructDeclaration('testStructA', 'testStructUniformA0');
  shaderityObjectCreator.addUniformStructDeclaration('testStructA', 'testStructUniformA1');
  shaderityObjectCreator.addUniformStructDeclaration('testStructB', 'testStructUniformB');

  shaderityObjectCreator.removeUniformStructDeclaration('testStructUniformA1');

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

uniform testStructA testStructUniformA0;
uniform testStructB testStructUniformB;

void main() {}
`);
});


test('test removeUniformBufferObjectDeclaration method in ShaderityObjectCreator', async() => {
  const uboVariableObjectA = {
    type: 'mat4x3',
    variableName: 'testVarA',
  };
  const uboVariableObjectB = {
    type: 'uvec2',
    variableName: 'testVarB',
  };
  const uboVariableObjectC = {
    type: 'int',
    variableName: 'testVarC',
  };
  const uboVariableObjectD = {
    type: 'vec4',
    variableName: 'testVarD',
  };
  const uboVariableObjectE = {
    type: 'vec4',
    variableName: 'testVarE[4096]',
  };

  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addUniformBufferObjectDeclaration('testInterfaceBlockA', [uboVariableObjectA, uboVariableObjectB]);
  shaderityObjectCreator.addUniformBufferObjectDeclaration('testInterfaceBlockB', [uboVariableObjectC, uboVariableObjectD], { instanceName: 'instanceB' });
  shaderityObjectCreator.addUniformBufferObjectDeclaration('testInterfaceBlockC', [uboVariableObjectE]);

  shaderityObjectCreator.removeUniformBufferObjectDeclaration('testInterfaceBlockB');

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

layout (std140) uniform testInterfaceBlockA {
  mat4x3 testVarA;
  uvec2 testVarB;
};
layout (std140) uniform testInterfaceBlockC {
  vec4 testVarE[4096];
};

void main() {}
`);
});


test('test removeFunctionDefinition method in ShaderityObjectCreator', async() => {
  const funcA = `vec3 add(vec3 vecA, vec3 vecB) {
  return vecA + vecB;
}`;

  const funcB = `vec2 add(vec2 vecA, vec2 vecB) {
  return vecA + vecB;
}`;

  const funcC = `vec3 linear(vec3 vecA, vec3 vecB, float coefficientA, float coefficientB) {
  return add(coefficientA * vecA, coefficientB * vecB);
}`;

  const funcD = `vec2 linear(vec2 vecA, vec2 vecB, float coefficientA, float coefficientB) {
  return add(coefficientA * vecA, coefficientB * vecB);
}`;

  const funcE = `vec3 subtract(vec3 vecA, vec3 vecB) {
  return vecA - vecB;
}`;

  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  const functionIdA = shaderityObjectCreator.addFunctionDefinition(funcA, { dependencyLevel: 1 });
  const functionIdB = shaderityObjectCreator.addFunctionDefinition(funcB);
  const functionIdC = shaderityObjectCreator.addFunctionDefinition(funcC, { dependencyLevel: 4 });
  const functionIdD = shaderityObjectCreator.addFunctionDefinition(funcD, { dependencyLevel: 3 });
  const functionIdE = shaderityObjectCreator.addFunctionDefinition(funcE, { dependencyLevel: 1 });

  shaderityObjectCreator.removeFunctionDefinition(functionIdE);
  shaderityObjectCreator.removeFunctionDefinition(functionIdD);

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

vec2 add(vec2 vecA, vec2 vecB) {
  return vecA + vecB;
}
vec3 add(vec3 vecA, vec3 vecB) {
  return vecA + vecB;
}
vec3 linear(vec3 vecA, vec3 vecB, float coefficientA, float coefficientB) {
  return add(coefficientA * vecA, coefficientB * vecB);
}

void main() {}
`);
});
