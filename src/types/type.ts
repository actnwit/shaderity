
export type ShaderStageStr = 'vertex' | 'fragment';

export type ShaderityObject = {
	code: string,
	shaderStage: ShaderStageStr,
	isFragmentShader: boolean
};

export type VarType = 'unknown' | 'float' | 'int' |
	'vec2' | 'vec3' | 'vec4' |
	'mat2' | 'mat3' | 'mat4' |
	'ivec2' | 'ivec3' | 'ivec4' | 'sampler2D' | 'sampler3D' | 'samplerCube';

export type AttributeSemantics = 'POSITION' | 'COLOR_0' | 'NORMAL' | 'TANGENT' | 'TEXCOORD_0' | 'TEXCOORD_1' | 'JOINTS_0' | 'WEIGHTS_0' | 'UNKNOWN';
export type UniformSemantics = 'UNKNOWN';

export type ReflectionAttribute = {
	name: string,
	type: VarType,
	semantic: AttributeSemantics
};

export type ReflectionUniform = {
	name: string,
	type: string,
	semantic: string
}

export type ReflectionVarying = {
	name: string,
	inout: "in" | "out",
	type: VarType
}

export type TemplateObject = {
	[key: string]: string | TemplateObject
};

export type ShaderVersion = 'webgl1' | 'webgl2' | 'es1' | 'es3' | 'glsl es1' | 'glsl es3';

export type ShaderExtensionBehavior = 'enable' | 'require' | 'warn' | 'disable';

export type ShaderExtensionObject = {
	extensionName: string, // e.g. GL_OES_standard_derivatives
	behavior: ShaderExtensionBehavior,
};

export type ShaderPrecisionType = 'highp' | 'mediump' | 'lowp';

export type ShaderPrecisionObjectKey =
	'int' |
	'float' |
	'sampler2D' |
	'samplerCube' |
	'sampler3D' |
	'sampler2DArray' |
	'isampler2D' |
	'isamplerCube' |
	'isampler3D' |
	'isampler2DArray' |
	'usampler2D' |
	'usamplerCube' |
	'usampler3D' |
	'usampler2DArray' |
	'sampler2DShadow' |
	'samplerCubeShadow' |
	'sampler2DArrayShadow';

export type ShaderPrecisionObject = {
	int?: ShaderPrecisionType,
	float?: ShaderPrecisionType,
	sampler2D?: ShaderPrecisionType,
	samplerCube?: ShaderPrecisionType,
	sampler3D?: ShaderPrecisionType, // for es3
	sampler2DArray?: ShaderPrecisionType, // for es3
	isampler2D?: ShaderPrecisionType, // for es3
	isamplerCube?: ShaderPrecisionType, // for es3
	isampler3D?: ShaderPrecisionType, // for es3
	isampler2DArray?: ShaderPrecisionType, // for es3
	usampler2D?: ShaderPrecisionType, // for es3
	usamplerCube?: ShaderPrecisionType, // for es3
	usampler3D?: ShaderPrecisionType, // for es3
	usampler2DArray?: ShaderPrecisionType, // for es3
	sampler2DShadow?: ShaderPrecisionType, // for es3
	samplerCubeShadow?: ShaderPrecisionType, // for es3
	sampler2DArrayShadow?: ShaderPrecisionType, // for es3
};

export type ShaderStructMemberObject = {
	memberName: string,
	type: ShaderUniformVarTypeES3,
	precision?: ShaderPrecisionType,
}

export type ShaderStructDefinitionObject = {
	structName: string,
	memberObjects: ShaderStructMemberObject[],
}

export type ShaderConstantValueVarTypeES1 =
	'float' | 'vec2' | 'vec3' | 'vec4' |
	'int' | 'ivec2' | 'ivec3' | 'ivec4' |
	'bool' | 'bvec2' | 'bvec3' | 'bvec4' |
	'mat2' | 'mat3' | 'mat4';

export type ShaderConstantValueVarTypeES3 =
	'float' | 'vec2' | 'vec3' | 'vec4' |
	'int' | 'ivec2' | 'ivec3' | 'ivec4' |
	'bool' | 'bvec2' | 'bvec3' | 'bvec4' |
	'uint' | 'uvec2' | 'uvec3' | 'uvec4' |
	'mat2' | 'mat3' | 'mat4' |
	'mat2x2' | 'mat2x3' | 'mat2x4' |
	'mat3x2' | 'mat3x3' | 'mat3x4' |
	'mat4x2' | 'mat4x3' | 'mat4x4';

export type ShaderConstantValueObject = {
	variableName: string,
	type: ShaderConstantValueVarTypeES3,
	values: number[],
};

export type ShaderAttributeVarType =
	'float' | 'vec2' | 'vec3' | 'vec4' |
	'int' | 'ivec2' | 'ivec3' | 'ivec4' |
	'mat2' | 'mat3' | 'mat4';

export type ShaderAttributeObject = {
	variableName: string,
	type: ShaderAttributeVarType,
	precision?: ShaderPrecisionType,
	location?: number, // for es3
};

export type ShaderVaryingInterpolationType =
	'flat' | 'smooth';

export type ShaderVaryingVarType = ShaderAttributeVarType;

export type ShaderVaryingObject = {
	variableName: string,
	type: ShaderVaryingVarType,
	precision?: ShaderPrecisionType,
	interpolationType?: ShaderVaryingInterpolationType // for es3
};

export type ShaderUniformVarTypeES1 =
	'float' | 'vec2' | 'vec3' | 'vec4' |
	'int' | 'ivec2' | 'ivec3' | 'ivec4' |
	'bool' | 'bvec2' | 'bvec3' | 'bvec4' |
	'mat2' | 'mat3' | 'mat4' |
	'sampler2D' | 'samplerCube';

export type ShaderUniformVarTypeES3 =
	'float' | 'vec2' | 'vec3' | 'vec4' |
	'int' | 'ivec2' | 'ivec3' | 'ivec4' |
	'bool' | 'bvec2' | 'bvec3' | 'bvec4' |
	'uint' | 'uvec2' | 'uvec3' | 'uvec4' |
	'mat2' | 'mat3' | 'mat4' |
	'mat2x2' | 'mat2x3' | 'mat2x4' |
	'mat3x2' | 'mat3x3' | 'mat3x4' |
	'mat4x2' | 'mat4x3' | 'mat4x4' |
	'sampler2D' | 'samplerCube' | 'sampler3D' | 'sampler2DArray' |
	'isampler2D' | 'isamplerCube' | 'isampler3D' | 'isampler2DArray' |
	'usampler2D' | 'usamplerCube' | 'usampler3D' | 'usampler2DArray' |
	'sampler2DShadow' | 'samplerCubeShadow' | 'sampler2DArrayShadow';

export type ShaderUniformObject = {
	variableName: string,
	type: ShaderUniformVarTypeES3,
	precision?: ShaderPrecisionType,
};
