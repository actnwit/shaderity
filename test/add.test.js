const Shaderity = require('../dist/esm/index').default;
test('test addFunctionDefinition method in ShaderityObjectCreator', async() => {
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

  // shaderityObjectCreator.removeFunctionDefinition(funcIdE);
  // shaderityObjectCreator.removeFunctionDefinition(funcIdD);

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
vec3 subtract(vec3 vecA, vec3 vecB) {
  return vecA - vecB;
}
vec2 linear(vec2 vecA, vec2 vecB, float coefficientA, float coefficientB) {
  return add(coefficientA * vecA, coefficientB * vecB);
}
vec3 linear(vec3 vecA, vec3 vecB, float coefficientA, float coefficientB) {
  return add(coefficientA * vecA, coefficientB * vecB);
}

void main() {}
`);
});

test('test addUniformBufferObjectDeclaration method in ShaderityObjectCreator', async() => {
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
layout (std140) uniform testInterfaceBlockB {
  int testVarC;
  vec4 testVarD;
} instanceB;
layout (std140) uniform testInterfaceBlockC {
  vec4 testVarE[4096];
};

void main() {}
`);
});

test('test addUniformStructDeclaration method in ShaderityObjectCreator', async() => {
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
uniform testStructA testStructUniformA1;
uniform testStructB testStructUniformB;

void main() {}
`);
});

test('test addUniform method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addUniformDeclaration('u_testA', 'mat4x2');
  shaderityObjectCreator.addUniformDeclaration('u_testB', 'uvec3', {});
  shaderityObjectCreator.addUniformDeclaration('u_testC', 'sampler2D', { precision: 'lowp' });
  shaderityObjectCreator.addUniformDeclaration('u_testD', 'sampler2DArray', {});

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

uniform mat4x2 u_testA;
uniform uvec3 u_testB;
uniform lowp sampler2D u_testC;
uniform sampler2DArray u_testD;

void main() {}
`);
});


test('test addVarying method for fragment shader in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('fragment');
  shaderityObjectCreator.addVaryingDeclaration('v_testA', 'float');
  shaderityObjectCreator.addVaryingDeclaration('v_testB', 'vec3', {});
  shaderityObjectCreator.addVaryingDeclaration('v_testC', 'mat4', { precision: 'mediump' });
  shaderityObjectCreator.addVaryingDeclaration('v_testD', 'ivec4', { interpolationType: 'flat' });
  shaderityObjectCreator.addVaryingDeclaration('v_testE', 'mat2', { interpolationType: 'smooth', precision: 'lowp' });

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

in float v_testA;
in vec3 v_testB;
in mediump mat4 v_testC;
flat in ivec4 v_testD;
smooth in lowp mat2 v_testE;

layout(location = 0) out vec4 renderTarget0;

void main() {}
`);
});

test('test addVarying method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addVaryingDeclaration('v_testA', 'float');
  shaderityObjectCreator.addVaryingDeclaration('v_testB', 'vec3', {});
  shaderityObjectCreator.addVaryingDeclaration('v_testC', 'mat4', { precision: 'mediump' });
  shaderityObjectCreator.addVaryingDeclaration('v_testD', 'ivec4', { interpolationType: 'flat' });
  shaderityObjectCreator.addVaryingDeclaration('v_testE', 'mat2', { interpolationType: 'smooth', precision: 'lowp' });

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
out vec3 v_testB;
out mediump mat4 v_testC;
flat out ivec4 v_testD;
smooth out lowp mat2 v_testE;

void main() {}
`);
});

test('test addAttribute method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addAttributeDeclaration('a_testA', 'float');
  shaderityObjectCreator.addAttributeDeclaration('a_testB', 'vec3', {});
  shaderityObjectCreator.addAttributeDeclaration('a_testC', 'mat4', { precision: 'mediump' });
  shaderityObjectCreator.addAttributeDeclaration('a_testD', 'ivec4', { location: 0 });
  shaderityObjectCreator.addAttributeDeclaration('a_testE', 'int', { location: 1, precision: 'lowp' });

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
in mediump mat4 a_testC;
layout (location = 0) in ivec4 a_testD;
layout (location = 1) in lowp int a_testE;

void main() {}
`);
});

test('test addGlobalConstantStructValue method in ShaderityObjectCreator', async() => {
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
  float(-10),
  mat2(13.1, -22.1, 1.4, 5)
);

void main() {}
`);
});

test('test addGlobalConstantValue method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addGlobalConstantValue('testInt', 'int', [-2.0]);
  shaderityObjectCreator.addGlobalConstantValue('testFloat', 'float', [0.3]);
  shaderityObjectCreator.addGlobalConstantValue('testMat', 'mat2', [-10, -50.10, 3, 3.7]);
  shaderityObjectCreator.addGlobalConstantValue('testVec', 'vec4', [20.0, 1.57, -3, -10.0]);
  shaderityObjectCreator.addGlobalConstantValue('testIVec', 'ivec3', [-7, 4.0, 5]);

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
const float testFloat = float(0.3);
const mat2 testMat = mat2(-10, -50.1, 3, 3.7);
const vec4 testVec = vec4(20, 1.57, -3, -10);
const ivec3 testIVec = ivec3(-7, 4, 5);

void main() {}
`);
});

test('test addStructDefinition method in ShaderityObjectCreator', async() => {
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

  const shaderStructVariableObjectsC = [{
      memberName: 'varA',
      type: 'float',
    },
    {
      memberName: 'varB',
      type: 'int',
    },
  ];

  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addStructDefinition('testStructA', shaderStructVariableObjectsA);
  shaderityObjectCreator.addStructDefinition('testStructB', shaderStructVariableObjectsB);

  shaderityObjectCreator.updateStructDefinition('testStructB', shaderStructVariableObjectsC);

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
  lowp mat2x4 varA;
  samplerCubeShadow varB;
};
struct testStructB {
  float varA;
  int varB;
};

void main() {}
`);
});
test('test addStructDefinition method in ShaderityObjectCreator', async() => {
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
  lowp mat2x4 varA;
  samplerCubeShadow varB;
};
struct testStructB {
  float varA;
  highp isampler2D varB;
  mediump sampler3D varC;
};

void main() {}
`);
});

test('test addExtension method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addExtension('GL_OES_standard_derivatives', 'enable');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toBe(`#version 300 es

#extension GL_OES_standard_derivatives: enable

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

test('test addDefineDirective method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addDefineDirective('testA');
  shaderityObjectCreator.addDefineDirective('testB B');
  shaderityObjectCreator.addDefineDirective('testC_c C');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toBe(`#version 300 es

#define testA
#define testB B
#define testC_c C

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

test('test addExtension method in ShaderityObjectCreator', async() => {
  const shaderityObjectCreator = Shaderity.createShaderityObjectCreator('vertex');
  shaderityObjectCreator.addExtension('GL_OES_standard_derivatives', 'enable');

  const resultShaderityObj = shaderityObjectCreator.createShaderityObject();
  expect(resultShaderityObj.code).toBe(`#version 300 es

#extension GL_OES_standard_derivatives: enable

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
