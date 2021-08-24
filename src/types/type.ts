
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