export declare type ShaderStageStr = 'vertex' | 'fragment';
export declare type ShaderityObject = {
    code: string;
    shaderStage: ShaderStageStr;
    isFragmentShader: boolean;
};
export declare type VarType = 'unknown' | 'float' | 'int' | 'vec2' | 'vec3' | 'vec4' | 'mat2' | 'mat3' | 'mat4' | 'ivec2' | 'ivec3' | 'ivec4' | 'sampler2D' | 'sampler3D' | 'samplerCube';
export declare type AttributeSemantics = 'POSITION' | 'COLOR_0' | 'NORMAL' | 'TANGENT' | 'TEXCOORD_0' | 'TEXCOORD_1' | 'JOINTS_0' | 'WEIGHTS_0' | 'UNKNOWN';
export declare type UniformSemantics = 'UNKNOWN';
export declare type ReflectionAttribute = {
    name: string;
    type: VarType;
    semantic: AttributeSemantics;
};
export declare type ReflectionUniform = {
    name: string;
    type: string;
    semantic: string;
};
export declare type ReflectionVarying = {
    name: string;
    inout: "in" | "out";
    type: VarType;
};
export declare type TemplateObject = {
    [key: string]: string | TemplateObject;
};
export declare type ShaderVersion = 'webgl1' | 'webgl2' | 'es1' | 'es3' | 'glsl es1' | 'glsl es3';
export declare type ShaderExtensionBehavior = 'enable' | 'require' | 'warn' | 'disable';
export declare type ShaderExtensionObject = {
    extensionName: string;
    behavior: ShaderExtensionBehavior;
};
export declare type ShaderPrecisionType = 'highp' | 'mediump' | 'lowp';
export declare type ShaderPrecisionObjectKey = 'int' | 'float' | 'sampler2D' | 'samplerCube' | 'sampler3D' | 'sampler2DArray' | 'isampler2D' | 'isamplerCube' | 'isampler3D' | 'isampler2DArray' | 'usampler2D' | 'usamplerCube' | 'usampler3D' | 'usampler2DArray' | 'sampler2DShadow' | 'samplerCubeShadow' | 'sampler2DArrayShadow';
export declare type ShaderPrecisionObject = {
    int?: ShaderPrecisionType;
    float?: ShaderPrecisionType;
    sampler2D?: ShaderPrecisionType;
    samplerCube?: ShaderPrecisionType;
    sampler3D?: ShaderPrecisionType;
    sampler2DArray?: ShaderPrecisionType;
    isampler2D?: ShaderPrecisionType;
    isamplerCube?: ShaderPrecisionType;
    isampler3D?: ShaderPrecisionType;
    isampler2DArray?: ShaderPrecisionType;
    usampler2D?: ShaderPrecisionType;
    usamplerCube?: ShaderPrecisionType;
    usampler3D?: ShaderPrecisionType;
    usampler2DArray?: ShaderPrecisionType;
    sampler2DShadow?: ShaderPrecisionType;
    samplerCubeShadow?: ShaderPrecisionType;
    sampler2DArrayShadow?: ShaderPrecisionType;
};
export declare type ShaderStructMemberObject = {
    memberName: string;
    type: ShaderUniformVarTypeES3;
    precision?: ShaderPrecisionType;
};
export declare type ShaderStructDefinitionObject = {
    structName: string;
    memberObjects: ShaderStructMemberObject[];
};
export declare type ShaderConstantValueVarTypeES1 = 'float' | 'vec2' | 'vec3' | 'vec4' | 'int' | 'ivec2' | 'ivec3' | 'ivec4' | 'bool' | 'bvec2' | 'bvec3' | 'bvec4' | 'mat2' | 'mat3' | 'mat4';
export declare type ShaderConstantValueVarTypeES3 = 'float' | 'vec2' | 'vec3' | 'vec4' | 'int' | 'ivec2' | 'ivec3' | 'ivec4' | 'bool' | 'bvec2' | 'bvec3' | 'bvec4' | 'uint' | 'uvec2' | 'uvec3' | 'uvec4' | 'mat2' | 'mat3' | 'mat4' | 'mat2x2' | 'mat2x3' | 'mat2x4' | 'mat3x2' | 'mat3x3' | 'mat3x4' | 'mat4x2' | 'mat4x3' | 'mat4x4';
export declare type ShaderConstantValueObject = {
    variableName: string;
    type: ShaderConstantValueVarTypeES3;
    values: number[];
};
export declare type ShaderConstantStructValueObject = {
    structName: string;
    variableName: string;
    values: {
        [memberName: string]: number[];
    };
};
export declare type ShaderAttributeVarType = 'float' | 'vec2' | 'vec3' | 'vec4' | 'int' | 'ivec2' | 'ivec3' | 'ivec4' | 'mat2' | 'mat3' | 'mat4';
export declare type ShaderAttributeObject = {
    variableName: string;
    type: ShaderAttributeVarType;
    precision?: ShaderPrecisionType;
    location?: number;
};
export declare type ShaderVaryingInterpolationType = 'flat' | 'smooth';
export declare type ShaderVaryingVarType = ShaderAttributeVarType;
export declare type ShaderVaryingObject = {
    variableName: string;
    type: ShaderVaryingVarType;
    precision?: ShaderPrecisionType;
    interpolationType?: ShaderVaryingInterpolationType;
};
export declare type ShaderUniformVarTypeES1 = 'float' | 'vec2' | 'vec3' | 'vec4' | 'int' | 'ivec2' | 'ivec3' | 'ivec4' | 'bool' | 'bvec2' | 'bvec3' | 'bvec4' | 'mat2' | 'mat3' | 'mat4' | 'sampler2D' | 'samplerCube';
export declare type ShaderUniformVarTypeES3 = 'float' | 'vec2' | 'vec3' | 'vec4' | 'int' | 'ivec2' | 'ivec3' | 'ivec4' | 'bool' | 'bvec2' | 'bvec3' | 'bvec4' | 'uint' | 'uvec2' | 'uvec3' | 'uvec4' | 'mat2' | 'mat3' | 'mat4' | 'mat2x2' | 'mat2x3' | 'mat2x4' | 'mat3x2' | 'mat3x3' | 'mat3x4' | 'mat4x2' | 'mat4x3' | 'mat4x4' | 'sampler2D' | 'samplerCube' | 'sampler3D' | 'sampler2DArray' | 'isampler2D' | 'isamplerCube' | 'isampler3D' | 'isampler2DArray' | 'usampler2D' | 'usamplerCube' | 'usampler3D' | 'usampler2DArray' | 'sampler2DShadow' | 'samplerCubeShadow' | 'sampler2DArrayShadow';
export declare type ShaderUniformObject = {
    variableName: string;
    type: ShaderUniformVarTypeES3;
    precision?: ShaderPrecisionType;
};
export declare type ShaderUniformStructObject = {
    structName: string;
    variableName: string;
};
export declare type ShaderUBOVarType = ShaderConstantValueVarTypeES3;
export declare type ShaderUBOVariableObject = {
    type: ShaderUBOVarType;
    variableName: string;
};
export declare type ShaderUniformBufferObject = {
    blockName: string;
    variableObjects: ShaderUBOVariableObject[];
    instanceName?: string;
};
export declare type ShaderFunctionObject = {
    functionId: number;
    functionCode: string;
};
