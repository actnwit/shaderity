import { ShaderAttributeVarType, ShaderConstantValueVarTypeES3, ShaderUniformVarTypeES3, ShaderVaryingVarType } from '../types/type';
export default class Utility {
    static _splitByLineFeedCode(source: string): string[];
    static _joinSplittedLine(splittedLine: string[]): string;
    static _addLineFeedCodeIfNotNullString(source: string): string;
    static _componentNumber(type: ShaderConstantValueVarTypeES3 | ShaderAttributeVarType | ShaderVaryingVarType | ShaderUniformVarTypeES3): number;
    static _isIntType(type: ShaderConstantValueVarTypeES3 | ShaderAttributeVarType | ShaderVaryingVarType | ShaderUniformVarTypeES3): boolean;
    static _isValidComponentCount(type: ShaderConstantValueVarTypeES3 | ShaderAttributeVarType | ShaderVaryingVarType | ShaderUniformVarTypeES3, values: number[]): boolean;
    static _isSamplerType(type: ShaderConstantValueVarTypeES3 | ShaderAttributeVarType | ShaderVaryingVarType | ShaderUniformVarTypeES3): boolean;
}
