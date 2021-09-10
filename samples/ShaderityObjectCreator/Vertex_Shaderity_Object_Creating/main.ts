import _Shaderity, {
  ShaderAttributeVarType,
  ShaderConstantValueVarTypeES3,
  ShaderUniformVarTypeES3,
  ShaderVaryingVarType,
} from '../../../dist/esm/index';

declare const Shaderity: typeof _Shaderity;
(() => {
  // We can create a glsl shader by using the shaderityObjCreator.createShaderityObject method.
  // The generated shader is composed of the following parts.
  // The smaller the number, the earlier it is written.
  // We can edit each part using the methods written in brackets.

  // 1.  version information (no edit method)
  // 2.  definition of directive (add/removeDefineDirective)
  // 3.  definition of extension (add/removeExtension)
  // 4.  declaration of global Precision (updateGlobalPrecision)
  // 5.  definition of struct (add/removeStructDefinition)
  // 6.  declaration and initializing of global constant value (add/removeGlobalConstantValue)
  // 7.  declaration and initializing of global constant struct value (add/removeGlobalConstantStructValue)
  // 8.  declaration of attribute (add/removeAttributeDeclaration method)
  // 9.  declaration of varying (add/removeVaryingDeclaration method)
  // 10. declaration of output color (updateOutputColorVariableName method)
  // 11. declaration of uniform (add/removeUniformDeclaration method)
  // 12. declaration of uniform struct (add/removeUniformStructDeclaration)
  // 13. declaration of uniform buffer object (add/removeUniformBufferObjectDeclaration)
  // 14. definition of function (add/removeFunctionDefinition)
  // 15. definition of main function (updateMainFunction)

  // where
  //   declaration of attribute is vertex shader only
  //   declaration of output color is fragment shader only

  // The shader code of this sample is based on the RhodoniteTS(https://github.com/actnwit/RhodoniteTS)
  const shaderityObjCreator = Shaderity.createShaderityObjectCreator('vertex');

  // Note: We cannot use global constant values in define directive
  const defineDirectives = [
    'RN_IS_MORPHING',
  ];

  for (const defineDirective of defineDirectives) {
    shaderityObjCreator.addDefineDirective(defineDirective);
  }

  const constantValues: [string, ShaderConstantValueVarTypeES3, number[]][] = [
    ['widthOfDataTexture', 'int', [4096]],
    ['heightOfDataTexture', 'int', [4096]],
  ];

  for (const constantValue of constantValues) {
    shaderityObjCreator.addGlobalConstantValue(constantValue[0], constantValue[1], constantValue[2]);
  }

  const attributes: [string, ShaderAttributeVarType][] = [
    ['a_position', 'vec3'],
    ['a_color', 'vec3'],
    ['a_normal', 'vec3'],
    ['a_instanceID', 'float'],
    ['a_texcoord_0', 'vec2'],
    ['a_texcoord_1', 'vec2'],
    ['a_joint', 'vec4'],
    ['a_weight', 'vec4'],
    ['a_baryCentricCoord', 'vec4'],
    ['a_tangent', 'vec4'],
  ];

  for (const attribute of attributes) {
    shaderityObjCreator.addAttributeDeclaration(attribute[0], attribute[1]);
  }

  const varyings: [string, ShaderVaryingVarType][] = [
    ['v_color', 'vec3'],
    ['v_normal_inWorld', 'vec3'],
    ['v_position_inWorld', 'vec4'],
    ['v_texcoord_0', 'vec2'],
    ['v_texcoord_1', 'vec2'],
    ['v_baryCentricCoord', 'vec3'],
    ['v_tangent_inWorld', 'vec3'],
    ['v_binormal_inWorld', 'vec3'],
  ];

  for (const varying of varyings) {
    shaderityObjCreator.addVaryingDeclaration(varying[0], varying[1]);
  }

  const uniforms: [string, ShaderUniformVarTypeES3][] = [
    ['u_materialSID', 'float'],
    ['u_currentComponentSIDs[13]', 'float'],
    ['u_viewMatrix', 'mat4'],
    ['u_projectionMatrix', 'mat4'],
    ['u_worldMatrix', 'mat4'],
    ['u_normalMatrix', 'mat3'],
    ['u_morphTargetNumber', 'int'],
    ['u_morphWeights[40]', 'float'],
    ['u_dataTextureMorphOffsetPosition[40]', 'int'],
    ['u_dataTexture', 'sampler2D'],
  ];

  for (const uniform of uniforms) {
    shaderityObjCreator.addUniformDeclaration(uniform[0], uniform[1]);
  }

  const getUniformFunctions: string[] = [
    `float get_currentComponentSIDs(float instanceId, int index) {
  float val;
  for (int i = 0; i<13; i++) {
    if (i == index) {
      val = u_currentComponentSIDs[i];
      break;
    }
  }
  return val;
}`,
    `mat4 get_viewMatrix(float instanceId, int index) {
  return u_viewMatrix;
}`,
    `mat4 get_projectionMatrix(float instanceId, int index) {
  return u_projectionMatrix;
}`,
    `mat4 get_worldMatrix(highp float instanceId) {
  return u_worldMatrix;
}`,
    `mat3 get_normalMatrix(const float instanceId) {
  return u_normalMatrix;
}`
  ];

  for (const getUniformFunction of getUniformFunctions) {
    shaderityObjCreator.addFunctionDefinition(getUniformFunction, {dependencyLevel: 0});
  }

  const morphingFunctionA = `#ifdef RN_IS_MORPHING
highp vec4 fetchElement(highp sampler2D tex, int vec4_idx, int texWidth, int texHeight) {
  // This idea from https://qiita.com/YVT/items/c695ab4b3cf7faa93885
  highp vec2 invSize = vec2(1.0 / float(texWidth), 1.0 / float(texHeight));
  highp float t = (float(vec4_idx) + 0.5) * invSize.x;
  highp float x = fract(t);
  highp float y = (floor(t) + 0.5) * invSize.y;
  return texture( tex, vec2(x, y));
}
#endif`;

  const morphingFunctionB = `#ifdef RN_IS_MORPHING
vec3 get_position(float vertexId, vec3 basePosition) {
  vec3 position = basePosition;
  int scalar_idx = 3 * int(vertexId);
  #ifdef GLSL_ES3
    int posIn4bytes = scalar_idx % 4;
  #else
    int posIn4bytes = int(mod(float(scalar_idx), 4.0));
  #endif
  for (int i = 0; i < 41; i++) {
    int basePosIn16bytes = u_dataTextureMorphOffsetPosition[i] + (scalar_idx - posIn4bytes)/4;
    vec3 addPos = vec3(0.0);
    if (posIn4bytes == 0) {
      vec4 val = fetchElement(u_dataTexture, basePosIn16bytes, widthOfDataTexture, heightOfDataTexture);
      addPos = val.xyz;
    }
    else if (posIn4bytes == 1) {
      vec4 val0 = fetchElement(u_dataTexture, basePosIn16bytes, widthOfDataTexture, heightOfDataTexture);
      addPos = vec3(val0.yzw);
    }
    else if (posIn4bytes == 2) {
      vec4 val0 = fetchElement(u_dataTexture, basePosIn16bytes, widthOfDataTexture, heightOfDataTexture);
      vec4 val1 = fetchElement(u_dataTexture, basePosIn16bytes+1, widthOfDataTexture, heightOfDataTexture);
      addPos = vec3(val0.zw, val1.x);
    }
    else if (posIn4bytes == 3) {
      vec4 val0 = fetchElement(u_dataTexture, basePosIn16bytes, widthOfDataTexture, heightOfDataTexture);
      vec4 val1 = fetchElement(u_dataTexture, basePosIn16bytes+1, widthOfDataTexture, heightOfDataTexture);
      addPos = vec3(val0.w, val1.xy);
    }
    position += addPos * u_morphWeights[i];
    if (i == u_morphTargetNumber-1) {
      break;
    }
  }
  return position;
}
#endif`;

  // There is the "fetchElement" method in the morphingFunctionB.
  // The "fetchElement" method is defined in the morphingFunctionA.
  // This means that the morphingFunctionB depends on the morphingFunctionA.
  // So the dependencyLevel of morphingFunctionB needs to be a larger number than the dependencyLevel of morphingFunctionA.
  shaderityObjCreator.addFunctionDefinition(morphingFunctionA, {dependencyLevel: 1});
  shaderityObjCreator.addFunctionDefinition(morphingFunctionB, {dependencyLevel: 2});

  const processGeometryWithMorphingFunction = `void processGeometryWithMorphing(
  const in highp mat4 worldMatrix,
  in mat3 inNormalMatrix,
  out highp mat3 outNormalMatrix,
  in vec3 inPosition_inLocal,
  out vec4 outPosition_inWorld,
  in vec3 inNormal_inLocal,
  out vec3 outNormal_inWorld
) {
  vec3 position_inLocal = inPosition_inLocal;

  #ifdef RN_IS_MORPHING
    if (u_morphTargetNumber != 0) {
      float vertexIdx = a_baryCentricCoord.w;
      position_inLocal = get_position(vertexIdx, inPosition_inLocal);
    }
  #endif

  outNormalMatrix = inNormalMatrix;
  outPosition_inWorld = worldMatrix * vec4(position_inLocal, 1.0);
  outNormal_inWorld = normalize(inNormalMatrix * inNormal_inLocal);
}`;

  shaderityObjCreator.addFunctionDefinition(processGeometryWithMorphingFunction, {dependencyLevel: 3});

  const mainFunction = `void main() {
  float materialSID = u_materialSID;
  float cameraSID = u_currentComponentSIDs[7];

  mat4 worldMatrix = get_worldMatrix(a_instanceID);
  mat4 viewMatrix = get_viewMatrix(cameraSID, 0);
  mat4 projectionMatrix = get_projectionMatrix(cameraSID, 0);
  mat3 normalMatrix = get_normalMatrix(a_instanceID);
  processGeometryWithMorphing(
    worldMatrix,
    normalMatrix,
    normalMatrix,
    a_position,
    v_position_inWorld,
    a_normal,
    v_normal_inWorld
  );

  gl_Position = projectionMatrix * viewMatrix * v_position_inWorld;

  v_color = a_color;
  v_texcoord_0 = a_texcoord_0;
  v_texcoord_1 = a_texcoord_1;
  v_baryCentricCoord = a_baryCentricCoord.xyz;

  #ifdef RN_USE_TANGENT_ATTRIBUTE
    v_tangent_inWorld = normalMatrix * a_tangent.xyz;
    v_binormal_inWorld = cross(v_tangent_inWorld, v_normal_inWorld) * a_tangent.w;
  #endif
}`;

  shaderityObjCreator.updateMainFunction(mainFunction);

  const shaderityObject = shaderityObjCreator.createShaderityObject();
  console.log(shaderityObject.shaderStage);
  console.log(shaderityObject.code);
})();
