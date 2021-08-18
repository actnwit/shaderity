export type ShaderStageStr = 'vertex' | 'fragment' | 'pixel'

export type ShaderityObject = {
	code: string,
	shaderStage: ShaderStageStr
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
