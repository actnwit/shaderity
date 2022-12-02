import { ShaderExtensionBehavior, ShaderityObject, ShaderConstantValueVarTypeES3, ShaderPrecisionObject, ShaderStageStr, ShaderPrecisionType, ShaderAttributeVarType, ShaderVaryingInterpolationType, ShaderVaryingVarType, ShaderUniformVarTypeES3, ShaderStructMemberObject, ShaderUBOVariableObject } from '../types/type';
/**
 * This class creates a shaderity object.
 */
export default class ShaderityObjectCreator {
    private __shaderStage;
    private __functionIdCount;
    private __defineDirectiveNames;
    private __extensions;
    private __globalPrecision;
    private __structDefinitions;
    private __globalConstantValues;
    private __globalConstantStructValues;
    private __attributes;
    private __varyings;
    private __uniforms;
    private __uniformStructs;
    private __uniformBufferObjects;
    private __functions;
    private __mainFunctionCode;
    private __outputColorVariableName;
    constructor(shaderStage: ShaderStageStr);
    addDefineDirective(defineDirectiveName: string): void;
    addExtension(extensionName: string, behavior?: ShaderExtensionBehavior): void;
    addStructDefinition(structName: string, memberObjects: ShaderStructMemberObject[]): void;
    addGlobalConstantValue(variableName: string, type: ShaderConstantValueVarTypeES3, values: number[]): void;
    addGlobalConstantStructValue(structName: string, variableName: string, values: {
        [keyVariableName: string]: number[];
    }): void;
    addAttributeDeclaration(variableName: string, type: ShaderAttributeVarType, options?: {
        precision?: ShaderPrecisionType;
        location?: number;
    }): void;
    addVaryingDeclaration(variableName: string, type: ShaderVaryingVarType, options?: {
        precision?: ShaderPrecisionType;
        interpolationType?: ShaderVaryingInterpolationType;
    }): void;
    addUniformDeclaration(variableName: string, type: ShaderUniformVarTypeES3, options?: {
        precision?: ShaderPrecisionType;
    }): void;
    addUniformStructDeclaration(structName: string, variableName: string): void;
    addUniformBufferObjectDeclaration(blockName: string, variableObjects: ShaderUBOVariableObject[], options?: {
        instanceName?: ShaderPrecisionType;
    }): void;
    addFunctionDefinition(functionCode: string, options?: {
        dependencyLevel?: number;
    }): number;
    updateGlobalPrecision(precision: ShaderPrecisionObject): void;
    updateStructDefinition(structName: string, memberObjects: ShaderStructMemberObject[]): void;
    updateGlobalConstantValue(variableName: string, values: number[]): void;
    updateGlobalConstantStructValue(variableName: string, values: {
        [keyVariableName: string]: number[];
    }): void;
    updateMainFunction(mainFunctionCodeInner: string): void;
    updateOutputColorVariableName(outputColorVariableName: string): void;
    removeDefineDirective(defineDirectiveName: string): void;
    removeExtension(extensionName: string): void;
    removeStructDefinition(structName: string): void;
    removeGlobalConstantValue(variableName: string): void;
    removeGlobalConstantStructValue(variableName: string): void;
    removeAttributeDeclaration(variableName: string): void;
    removeVaryingDeclaration(variableName: string): void;
    removeUniformDeclaration(variableName: string): void;
    removeUniformStructDeclaration(variableName: string): void;
    removeUniformBufferObjectDeclaration(blockName: string): void;
    removeFunctionDefinition(functionId: number): void;
    createShaderityObject(): ShaderityObject;
    private static __existNonIntegerValue;
    private __createShaderCode;
    private __fillEmptyFunctions;
    private __createDefineDirectiveShaderCode;
    private __createExtensionShaderCode;
    private __createGlobalPrecisionShaderCode;
    private __createStructDefinitionShaderCode;
    private __createGlobalConstantValueShaderCode;
    private __createGlobalConstantStructValueShaderCode;
    private __createAttributeDeclarationShaderCode;
    private __createVaryingDeclarationShaderCode;
    private __createOutputColorDeclarationShaderCode;
    private __createUniformDeclarationShaderCode;
    private __createUniformStructDeclarationShaderCode;
    private __createUniformBufferObjectShaderCode;
    private __createFunctionDefinitionShaderCode;
    private __createMainFunctionDefinitionShaderCode;
}
