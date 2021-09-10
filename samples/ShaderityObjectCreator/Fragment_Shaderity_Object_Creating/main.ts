import _Shaderity, {
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
  const shaderityObjCreator = Shaderity.createShaderityObjectCreator('fragment');

  // Note: We cannot use global constant values in define directive
  const defineDirectives = [
    'WEBGL1_EXT_SHADER_TEXTURE_LOD',
    'RN_IS_SUPPORTING_STANDARD_DERIVATIVES',
    'RN_USE_NORMAL_TEXTURE',
    'RN_IS_LIGHTING',
    'RN_IS_ALPHAMODE_OPAQUE',
    'EPSILON 0.0000001',
    'saturateEpsilonToOne(x) clamp(x, EPSILON, 1.0)',
  ];

  for (const defineDirective of defineDirectives) {
    shaderityObjCreator.addDefineDirective(defineDirective);
  }

  const extensions = [
    'GL_EXT_shader_texture_lod',
    'GL_OES_standard_derivatives',
  ];

  for (const extension of extensions) {
    shaderityObjCreator.addExtension(extension);
  }

  const constantValues: [string, ShaderConstantValueVarTypeES3, number[]][] = [
    ['M_PI', 'float', [3.141592653589793]],
    ['c_MinRoughness', 'float', [0.04]],
  ];

  for (const constantValue of constantValues) {
    shaderityObjCreator.addGlobalConstantValue(constantValue[0], constantValue[1], constantValue[2]);
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

  shaderityObjCreator.updateOutputColorVariableName('rt0');

  const uniforms: [string, ShaderUniformVarTypeES3][] = [
    ['u_isOutputHDR', 'bool'],
    ['u_makeOutputSrgb', 'bool'],
    ['u_baseColorTexcoordIndex', 'int'],
    ['u_metallicRoughnessTexcoordIndex', 'int'],
    ['u_occlusionTexcoordIndex', 'int'],
    ['u_emissiveTexcoordIndex', 'int'],
    ['u_normalTexcoordIndex', 'int'],
    ['u_lightNumber', 'int'],
    ['u_materialSID', 'float'],
    ['u_baseColorTextureRotation', 'float'],
    ['u_metallicRoughnessTextureRotation', 'float'],
    ['u_occlusionStrength', 'float'],
    ['u_normalTextureRotation', 'float'],
    ['u_normalScale', 'float'],
    ['u_currentComponentSIDs[13]', 'float'],
    ['u_hdriFormat', 'ivec2'],
    ['u_metallicRoughnessFactor', 'vec2'],
    ['u_wireframe', 'vec3'],
    ['u_viewPosition', 'vec3'],
    ['u_baseColorFactor', 'vec4'],
    ['u_iblParameter', 'vec4'],
    ['u_baseColorTextureTransform', 'vec4'],
    ['u_metallicRoughnessTextureTransform', 'vec4'],
    ['u_normalTextureTransform', 'vec4'],
    ['u_lightPosition[4]', 'vec4'],
    ['u_lightDirection[4]', 'vec4'],
    ['u_lightIntensity[4]', 'vec4'],
    ['u_normalTexture', 'sampler2D'],
    ['u_baseColorTexture', 'sampler2D'],
    ['u_metallicRoughnessTexture', 'sampler2D'],
    ['u_occlusionTexture', 'sampler2D'],
    ['u_emissiveTexture', 'sampler2D'],
    ['u_diffuseEnvTexture', 'samplerCube'],
    ['u_specularEnvTexture', 'samplerCube'],
  ];

  for (const uniform of uniforms) {
    shaderityObjCreator.addUniformDeclaration(uniform[0], uniform[1]);
  }

  // HACK: we can set more than one functions at once by addFunctionDefinition method
  const getUniformFunctions: string = `bool get_isOutputHDR(float instanceId, int index) {
  return u_isOutputHDR;
}
bool get_makeOutputSrgb(float instanceId, int index) {
  return u_makeOutputSrgb;
}
int get_baseColorTexcoordIndex(float instanceId, int index) {
  return u_baseColorTexcoordIndex;
}
int get_metallicRoughnessTexcoordIndex(float instanceId, int index) {
  return u_metallicRoughnessTexcoordIndex;
}
int get_occlusionTexcoordIndex(float instanceId, int index) {
  return u_occlusionTexcoordIndex;
}
int get_emissiveTexcoordIndex(float instanceId, int index) {
  return u_emissiveTexcoordIndex;
}
int get_normalTexcoordIndex(float instanceId, int index) {
  return u_normalTexcoordIndex;
}
int get_lightNumber(float instanceId, int index) {
  return u_lightNumber;
}
float get_baseColorTextureRotation(float instanceId, int index) {
  return u_baseColorTextureRotation;
}
float get_metallicRoughnessTextureRotation(float instanceId, int index) {
  return u_metallicRoughnessTextureRotation;
}
float get_occlusionStrength(float instanceId, int index) {
  return u_occlusionStrength;
}
float get_normalTextureRotation(float instanceId, int index) {
  return u_normalTextureRotation;
}
float get_normalScale(float instanceId, int index) {
  return u_normalScale;
}
float get_currentComponentSIDs(float instanceId, int index) {
  float val;
  for (int i = 0; i<13; i++) {
    if (i == index) {
      val = u_currentComponentSIDs[i];
      break;
    }
  }
  return val;
}
ivec2 get_hdriFormat(float instanceId, int index) {
  return u_hdriFormat;
}
vec2 get_metallicRoughnessFactor(float instanceId, int index) {
  return u_metallicRoughnessFactor;
}
vec3 get_wireframe(float instanceId, int index) {
  return u_wireframe;
}
vec3 get_viewPosition(float instanceId, int index) {
  return u_viewPosition;
}
vec4 get_baseColorFactor(float instanceId, int index) {
  return u_baseColorFactor;
}
vec4 get_iblParameter(float instanceId, int index) {
  return u_iblParameter;
}
vec4 get_baseColorTextureTransform(float instanceId, int index) {
  return u_baseColorTextureTransform;
}
vec4 get_metallicRoughnessTextureTransform(float instanceId, int index) {
  return u_metallicRoughnessTextureTransform;
}
vec4 get_normalTextureTransform(float instanceId, int index) {
  return u_normalTextureTransform;
}
vec4 get_lightPosition(float instanceId, int index) {
  vec4 val;
  for (int i = 0; i<4; i++) {
    if (i == index) {
      val = u_lightPosition[i];
      break;
    }
  }
  return val;
}
vec4 get_lightDirection(float instanceId, int index) {
  vec4 val;
  for (int i = 0; i<4; i++) {
    if (i == index) {
      val = u_lightDirection[i];
      break;
    }
  }
  return val;
}
vec4 get_lightIntensity(float instanceId, int index) {
  vec4 val;
  for (int i = 0; i<4; i++) {
    if (i == index) {
      val = u_lightIntensity[i];
      break;
    }
  }
  return val;
}`;

  const uvTransformFunction: string = `vec2 uvTransform(vec2 scale, vec2 offset, float rotation, vec2 uv) {
  mat3 translationMat = mat3(1, 0, 0, 0, 1, 0, offset.x, offset.y, 1);
  mat3 rotationMat = mat3(
    cos(rotation), -sin(rotation), 0,
    sin(rotation), cos(rotation), 0,
    0, 0, 1
  );
  mat3 scaleMat = mat3(scale.x, 0, 0, 0, scale.y, 0, 0, 0, 1);
  mat3 matrix = translationMat * rotationMat * scaleMat;
  vec2 uvTransformed = ( matrix * vec3(uv.xy, 1) ).xy;
  return uvTransformed;
}`;

  const getTexcoordFunction: string = `vec2 getTexcoord(int texcoordIndex) {
  vec2 texcoord;
  if(texcoordIndex == 1) {
    texcoord = v_texcoord_1;
  } else {
    texcoord = v_texcoord_0;
  }
  return texcoord;
}`;

  const calcNormalFunction: string = `#ifdef RN_USE_TANGENT_ATTRIBUTE
	vec3 perturb_normal(vec3 normal_inWorld, vec3 viewVector, vec2 texcoord, vec3 normalTex) {
		vec3 tangent_inWorld = normalize(v_tangent_inWorld);
		vec3 binormal_inWorld = normalize(v_binormal_inWorld);
		mat3 tbnMat_tangent_to_world = mat3(tangent_inWorld, binormal_inWorld, normal_inWorld);
		return normalize(tbnMat_tangent_to_world * normalTex);
	}
#else
	#ifdef RN_IS_SUPPORTING_STANDARD_DERIVATIVES
		// This is based on http://www.thetenthplanet.de/archives/1180
		mat3 cotangent_frame(vec3 normal_inWorld, vec3 position, vec2 uv) {
			uv = gl_FrontFacing ? uv : -uv;

			// get edge vectors of the pixel triangle
			vec3 dp1 = dFdx(position);
			vec3 dp2 = dFdy(position);
			vec2 duv1 = dFdx(uv);
			vec2 duv2 = dFdy(uv);

			// solve the linear system
			vec3 dp2perp = cross(dp2, normal_inWorld);
			vec3 dp1perp = cross(normal_inWorld, dp1);
			vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;
			vec3 bitangent = dp2perp * duv1.y + dp1perp * duv2.y;
			bitangent *= -1.0;

			// construct a scale-invariant frame
			float invMat = inversesqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));
			return mat3(tangent * invMat, bitangent * invMat, normal_inWorld);
		}
		vec3 perturb_normal(vec3 normal_inWorld, vec3 viewVector, vec2 texcoord, vec3 normalTex) {
			mat3 tbnMat_tangent_to_world = cotangent_frame(normal_inWorld, -viewVector, texcoord);
			return normalize(tbnMat_tangent_to_world * normalTex);
		}
	#else
		vec3 perturb_normal(vec3 normal_inWorld, vec3 viewVector, vec2 texcoord, vec3 normalTex) {
			return normal_inWorld;
		}
	#endif
#endif`;

  const wireFrameFunction = `float edge_ratio(vec3 bary3, float wireframeWidthInner, float wireframeWidthRelativeScale) {
vec3 d = fwidth(bary3);
vec3 x = bary3 + vec3(1.0 - wireframeWidthInner) * d;
vec3 a3 = smoothstep(vec3(0.0), d, x);
float factor = min(min(a3.x, a3.y), a3.z);
return clamp((1.0 - factor), 0.0, 1.0);
}`;

  const gammaCorrectionFunctions: string = `vec3 srgbToLinear(vec3 srgbColor) {
return pow(srgbColor, vec3(2.2));
}
vec3 linearToSrgb(vec3 linearColor) {
return pow(linearColor, vec3(1.0/2.2));
}`;

  shaderityObjCreator.addFunctionDefinition(getUniformFunctions);
  shaderityObjCreator.addFunctionDefinition(uvTransformFunction);
  shaderityObjCreator.addFunctionDefinition(getTexcoordFunction);
  shaderityObjCreator.addFunctionDefinition(calcNormalFunction);
  shaderityObjCreator.addFunctionDefinition(wireFrameFunction);
  shaderityObjCreator.addFunctionDefinition(gammaCorrectionFunctions);

  const pbrBasicFunctions: string = `// this is from https://www.unrealengine.com/blog/physically-based-shading-on-mobile
vec3 envBRDFApprox( vec3 F0, float Roughness, float NoV) {
  const vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);
  const vec4 c1 = vec4(1, 0.0425, 1.04, -0.04);
  vec4 r = Roughness * c0 + c1;
  float a004 = min( r.x * r.x, exp2( -9.28 * NoV ) ) * r.x + r.y;
  vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
  return F0 * AB.x + AB.y;
}
// GGX NDF
float d_ggx(float NH, float alphaRoughness) {
  float roughnessSqr = alphaRoughness * alphaRoughness;
  float f = (roughnessSqr - 1.0) * NH * NH + 1.0;
  return roughnessSqr / (M_PI * f * f);
}
// The code from https://google.github.io/filament/Filament.html#listing_approximatedspecularv
// The idea is from [Heitz14] Eric Heitz. 2014. Understanding the Masking-Shadowing Function in Microfacet-Based BRDFs.
float v_SmithGGXCorrelated(float NL, float NV, float alphaRoughness) {
  float a2 = alphaRoughness * alphaRoughness;
  float GGXV = NL * sqrt(NV * NV * (1.0 - a2) + a2);
  float GGXL = NV * sqrt(NL * NL * (1.0 - a2) + a2);
  return 0.5 / (GGXV + GGXL);
}
// The Schlick Approximation to Fresnel
vec3 fresnel(vec3 f0, float VH) {
	return vec3(f0) + (vec3(1.0) - f0) * pow(1.0 - VH, 5.0);
}
vec3 diffuse_brdf(vec3 albedo) {
	return albedo / M_PI;
}
vec3 fresnelSchlickRoughness(vec3 F0, float cosTheta, float roughness) {
	return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
}`;

  const pbrFunctions: string = `vec3 cook_torrance_specular_brdf(float NH, float NL, float NV, vec3 F, float alphaRoughness) {
  float D = d_ggx(NH, alphaRoughness);
  float V = v_SmithGGXCorrelated(NL, NV, alphaRoughness);
  return vec3(D) * vec3(V) * F;
}
vec3 IBLContribution(float materialSID, vec3 normal_inWorld, float NV, vec3 viewDirection, vec3 albedo, vec3 F0, float userRoughness) {
  vec4 iblParameter = get_iblParameter(materialSID, 0);
  float rot = iblParameter.w + 3.1415;
  mat3 rotEnvMatrix = mat3(cos(rot), 0.0, -sin(rot), 0.0, 1.0, 0.0, sin(rot), 0.0, cos(rot));
  vec3 normal_forEnv = rotEnvMatrix * normal_inWorld;
  normal_forEnv.x *= -1.0;
  vec4 diffuseTexel = texture(u_diffuseEnvTexture, normal_forEnv);
  ivec2 hdriFormat = get_hdriFormat(materialSID, 0);
  vec3 diffuseLight;
  if (hdriFormat.x == 0) {
    // LDR_SRGB
    diffuseLight = srgbToLinear(diffuseTexel.rgb);
  } else if (hdriFormat.x == 3) {
    // RGBE
    diffuseLight = diffuseTexel.rgb * pow(2.0, diffuseTexel.a*255.0-128.0);
  } else {
    diffuseLight = diffuseTexel.rgb;
  }
  float mipCount = iblParameter.x;
  float lod = (userRoughness * (mipCount - 1.0));
  vec3 reflection = rotEnvMatrix * reflect(-viewDirection, normal_inWorld);
  reflection.x *= -1.0;
  #ifdef WEBGL1_EXT_SHADER_TEXTURE_LOD
    vec4 specularTexel = textureLod(u_specularEnvTexture, reflection, lod);
  #else
    vec4 specularTexel = texture(u_specularEnvTexture, reflection);
  #endif

  vec3 specularLight;
  if (hdriFormat.y == 0) {
    // LDR_SRGB
    specularLight = srgbToLinear(specularTexel.rgb);
  } else if (hdriFormat.y == 3) {
    // RGBE
    specularLight = specularTexel.rgb * pow(2.0, specularTexel.a*255.0-128.0);
  } else {
    specularLight = specularTexel.rgb;
  }
  vec3 kS = fresnelSchlickRoughness(F0, NV, userRoughness);
  vec3 kD = 1.0 - kS;
  vec3 diffuse = diffuseLight * albedo * kD;

  vec3 specular = specularLight * envBRDFApprox(F0, userRoughness, NV);
  float IBLDiffuseContribution = iblParameter.y;
  float IBLSpecularContribution = iblParameter.z;
  diffuse *= IBLDiffuseContribution;
  specular *= IBLSpecularContribution;
  return diffuse + specular;
}`

  shaderityObjCreator.addFunctionDefinition(pbrBasicFunctions, {dependencyLevel: 0});
  shaderityObjCreator.addFunctionDefinition(pbrFunctions, {dependencyLevel: 1});

  const mainFunction = `void main () {
  float materialSID = u_materialSID;
  int lightNumber = 0;
  #ifdef RN_IS_LIGHTING
    lightNumber = get_lightNumber(0.0, 0);
  #endif

  // View vector
  float cameraSID = u_currentComponentSIDs[7];
  vec3 viewPosition = get_viewPosition(cameraSID, 0);
  vec3 viewVector = viewPosition - v_position_inWorld.xyz;

  // Normal
  vec3 normal_inWorld = normalize(v_normal_inWorld);
  #ifdef RN_USE_NORMAL_TEXTURE
    vec4 normalTextureTransform = get_normalTextureTransform(materialSID, 0);
    float normalTextureRotation = get_normalTextureRotation(materialSID, 0);
    int normalTexcoordIndex = get_normalTexcoordIndex(materialSID, 0);
    vec2 normalTexcoord = getTexcoord(normalTexcoordIndex);
    vec2 normalTexUv = uvTransform(normalTextureTransform.xy, normalTextureTransform.zw, normalTextureRotation, normalTexcoord);
    vec3 normalTexValue = texture2D(u_normalTexture, normalTexUv).xyz;
    if(normalTexValue.b >= 128.0 / 255.0) {
      // normal texture is existence
      vec3 normalTex = normalTexValue * 2.0 - 1.0;
      float normalScale = get_normalScale(materialSID, 0);
      vec3 scaledNormal = normalize(normalTex * vec3(normalScale, normalScale, 1.0));
      normal_inWorld = perturb_normal(normal_inWorld, viewVector, normalTexUv, scaledNormal);
    }
  #endif

  // BaseColorFactor
  vec3 baseColor = vec3(0.0, 0.0, 0.0);
  float alpha = 1.0;
  vec4 baseColorFactor = get_baseColorFactor(materialSID, 0);
  if (v_color != baseColor && baseColorFactor.rgb != baseColor) {
    baseColor = v_color * baseColorFactor.rgb;
    alpha = baseColorFactor.a;
  }
  else if (v_color == baseColor) {
    baseColor = baseColorFactor.rgb;
    alpha = baseColorFactor.a;
  }
  else if (baseColorFactor.rgb == baseColor) {
    baseColor = v_color;
  }
  else {
    baseColor = vec3(1.0, 1.0, 1.0);
  }
  // BaseColor (take account for BaseColorTexture)
  vec4 baseColorTextureTransform = get_baseColorTextureTransform(materialSID, 0);
  float baseColorTextureRotation = get_baseColorTextureRotation(materialSID, 0);
  int baseColorTexcoordIndex = get_baseColorTexcoordIndex(materialSID, 0);
  vec2 baseColorTexcoord = getTexcoord(baseColorTexcoordIndex);
  vec2 baseColorTexUv = uvTransform(baseColorTextureTransform.xy, baseColorTextureTransform.zw, baseColorTextureRotation, baseColorTexcoord);
  vec4 textureColor = texture2D(u_baseColorTexture, baseColorTexUv);
  baseColor *= srgbToLinear(textureColor.rgb);
  alpha *= textureColor.a;

  #ifdef RN_IS_ALPHAMODE_MASK
    float alphaCutoff = get_alphaCutoff(materialSID, 0);
    if (alpha < alphaCutoff) {
      discard;
    }
  #endif

  #ifdef RN_IS_LIGHTING
    // Metallic & Roughness
    vec2 metallicRoughnessFactor = get_metallicRoughnessFactor(materialSID, 0);
    float userRoughness = metallicRoughnessFactor.y;
    float metallic = metallicRoughnessFactor.x;
    vec4 metallicRoughnessTextureTransform = get_metallicRoughnessTextureTransform(materialSID, 0);
    float metallicRoughnessTextureRotation = get_metallicRoughnessTextureRotation(materialSID, 0);
    int metallicRoughnessTexcoordIndex = get_metallicRoughnessTexcoordIndex(materialSID, 0);
    vec2 metallicRoughnessTexcoord = getTexcoord(metallicRoughnessTexcoordIndex);
    vec2 metallicRoughnessTexUv = uvTransform(metallicRoughnessTextureTransform.xy, metallicRoughnessTextureTransform.zw, metallicRoughnessTextureRotation, metallicRoughnessTexcoord);
    vec4 ormTexel = texture2D(u_metallicRoughnessTexture, metallicRoughnessTexUv);
    userRoughness = ormTexel.g * userRoughness;
    metallic = ormTexel.b * metallic;
    userRoughness = clamp(userRoughness, c_MinRoughness, 1.0);
    metallic = clamp(metallic, 0.0, 1.0);
    float alphaRoughness = userRoughness * userRoughness;

    // F0
    vec3 diffuseMatAverageF0 = vec3(0.04);
    vec3 F0 = mix(diffuseMatAverageF0, baseColor.rgb, metallic);

    // Albedo
    vec3 albedo = baseColor.rgb * (vec3(1.0) - diffuseMatAverageF0);
    albedo.rgb *= (1.0 - metallic);

    // View direction
    vec3 viewDirection = normalize(viewVector);

    // NV
    float NV = dot(normal_inWorld, viewDirection);
    float satNV = saturateEpsilonToOne(NV);
    rt0 = vec4(0.0, 0.0, 0.0, alpha);

    // Lighting
    vec3 diffuse = vec3(0.0, 0.0, 0.0);
    for (int i = 0; i < 4; i++) {
      if (i >= lightNumber) {
          break;
      }

      // Light
      vec4 gotLightDirection = get_lightDirection(0.0, i);
      vec4 gotLightPosition = get_lightPosition(0.0, i);
      vec4 gotLightIntensity = get_lightIntensity(0.0, i);
      vec3 lightDirection = gotLightDirection.xyz;
      vec3 lightIntensity = gotLightIntensity.xyz;
      vec3 lightPosition = gotLightPosition.xyz;
      float lightType = gotLightPosition.w;
      float spotCosCutoff = gotLightDirection.w;
      float spotExponent = gotLightIntensity.w;

      if (0.75 < lightType) {
        // is pointlight or spotlight
        lightDirection = normalize(lightPosition.xyz - v_position_inWorld.xyz);
      }
      float spotEffect = 1.0;
      if (lightType > 1.75) {
        // is spotlight
        spotEffect = dot(gotLightDirection.xyz, lightDirection);
        if (spotEffect > spotCosCutoff) {
          spotEffect = pow(spotEffect, spotExponent);
        }
        else {
          spotEffect = 0.0;
        }
      }

      // IncidentLight
      vec3 incidentLight = spotEffect * lightIntensity.xyz;
      incidentLight *= M_PI;

      // Fresnel
      vec3 halfVector = normalize(lightDirection + viewDirection);
      float VH = dot(viewDirection, halfVector);
      vec3 F = fresnel(F0, VH);

      // Diffuse
      vec3 diffuseContrib = (vec3(1.0) - F) * diffuse_brdf(albedo);

      // Specular
      float NH = dot(normal_inWorld, halfVector);
      float satNH = saturateEpsilonToOne(NH);
      float NL = dot(normal_inWorld, lightDirection);
      float satNL = saturateEpsilonToOne(NL);
      vec3 specularContrib = cook_torrance_specular_brdf(satNH, satNL, satNV, F, alphaRoughness);
      vec3 diffuseAndSpecular = (diffuseContrib + specularContrib) * vec3(satNL) * incidentLight.rgb;
      rt0.xyz += diffuseAndSpecular;
    }

    vec3 ibl = IBLContribution(materialSID, normal_inWorld, satNV, viewDirection, albedo, F0, userRoughness);
    int occlusionTexcoordIndex = get_occlusionTexcoordIndex(materialSID, 0);
    vec2 occlusionTexcoord = getTexcoord(occlusionTexcoordIndex);
    float occlusion = texture2D(u_occlusionTexture, occlusionTexcoord).r;
    float occlusionStrength = get_occlusionStrength(materialSID, 0);

    // Occlution to Indirect Lights
    rt0.xyz += mix(ibl, ibl * occlusion, occlusionStrength);
  #else
    rt0 = vec4(baseColor, alpha);
  #endif

  // Emissive
  int emissiveTexcoordIndex = get_emissiveTexcoordIndex(materialSID, 0);
  vec2 emissiveTexcoord = getTexcoord(emissiveTexcoordIndex);
  vec3 emissive = srgbToLinear(texture2D(u_emissiveTexture, emissiveTexcoord).xyz);
  rt0.xyz += emissive;
  bool isOutputHDR = get_isOutputHDR(materialSID, 0);
  if(isOutputHDR) {
    return;
  }

  #ifdef RN_IS_ALPHAMODE_OPAQUE
    rt0.a = 1.0;
  #elif defined(RN_IS_ALPHAMODE_MASK)
    rt0.a = 1.0;
  #endif

  // Wireframe
  float threshold = 0.001;
  vec3 wireframe = get_wireframe(materialSID, 0);
  float wireframeWidthInner = wireframe.z;
  float wireframeWidthRelativeScale = 1.0;
  if (wireframe.x > 0.5 && wireframe.y < 0.5) {
    rt0.a = 0.0;
  }
  vec4 wireframeResult = rt0;
  vec4 wireframeColor = vec4(0.2, 0.75, 0.0, 1.0);
  float edgeRatio = edge_ratio(v_baryCentricCoord, wireframeWidthInner, wireframeWidthRelativeScale);
  float edgeRatioModified = mix(step(threshold, edgeRatio), clamp(edgeRatio*4.0, 0.0, 1.0), wireframeWidthInner / wireframeWidthRelativeScale/4.0);

  wireframeResult.rgb = wireframeColor.rgb * edgeRatioModified + rt0.rgb * (1.0 - edgeRatioModified);
  wireframeResult.a = max(rt0.a, wireframeColor.a * mix(edgeRatioModified, pow(edgeRatioModified, 100.0), wireframeWidthInner / wireframeWidthRelativeScale/1.0));
  if (wireframe.x > 0.5) {
    rt0 = wireframeResult;
    if (wireframe.y < 0.5 && rt0.a == 0.0) {
      discard;
    }
  }
  float makeOutputSrgb = float(get_makeOutputSrgb(materialSID, 0));
  rt0.rgb = mix(rt0.rgb, linearToSrgb(rt0.rgb), makeOutputSrgb);
}`;

  shaderityObjCreator.updateMainFunction(mainFunction);

  const shaderityObject = shaderityObjCreator.createShaderityObject();
  console.log(shaderityObject.shaderStage);
  console.log(shaderityObject.code);
})();
