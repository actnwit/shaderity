import { AttributeSemantics, ReflectionAttribute, ReflectionUniform, ReflectionVarying, ShaderStageStr, VarType } from '../types/type';
/**
 * This class gets the attribute, varying, and uniform information from the code property of a shaderity object.
 * The methods of the Shaderity instance create an instance of this class.
 *
 * Before getting the information of the attribute, varying, and uniform, you need to call the reflect method of this instance.
 */
export default class Reflection {
    private static readonly attributeAndVaryingTypeRegExp;
    private static readonly uniformTypeRegExp;
    private static readonly semanticRegExp;
    private __attributeSemanticsMap;
    private __uniformSemanticsMap;
    private __attributes;
    private __varyings;
    private __uniforms;
    private readonly __splittedShaderCode;
    private readonly __shaderStage;
    constructor(splittedShaderityShaderCode: string[], shaderStage: ShaderStageStr);
    /**
     * Gets all attribute variable information in the shader code.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of ReflectionAttribute object
     */
    get attributes(): ReflectionAttribute[];
    /**
     * Gets all varying variable information in the shader code.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of ReflectionVarying object
     */
    get varyings(): ReflectionVarying[];
    /**
     * Gets all uniform variable information in the shader code.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of ReflectionUniform object
     */
    get uniforms(): ReflectionUniform[];
    /**
     * Get the names of all attributes included in the shader.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of string
     */
    get attributesNames(): string[];
    /**
     * Get the attribute semantic (e.g. 'POSITION') of all attributes included in the shader.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of AttributeSemantics object
     */
    get attributesSemantics(): AttributeSemantics[];
    /**
     * Get the variable type (e.g. 'vec4') of all attributes included in the shader.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of VarType object
     */
    get attributesTypes(): VarType[];
    /**
     * Add an attributeSemantics.
     * The attributeSemantics is used in the ReflectionAttribute.semantics
     * (See reflect method of this class)
     */
    addAttributeSemanticsMap(map: Map<string, string>): void;
    /**
     * Add a uniformSemantics.
     * The attributeSemantics is used in the ReflectionAttribute.semantics
     * (See reflect method of this class)
     */
    addUniformSemanticsMap(map: Map<string, string>): void;
    /**
     * Add an attributeSemantics.
     * The attributeSemantics is used in the ReflectionAttribute.semantics
     * (See reflect method of this class)
     */
    addAttributeSemantics(key: string, value: string): void;
    /**
     * Add a uniformSemantics.
     * The attributeSemantics is used in the ReflectionAttribute.semantics
     * (See reflect method of this class)
     */
    addUniformSemantics(key: string, value: string): void;
    /**
     * Initialize attributeSemantics
     */
    resetAttributeSemantics(): void;
    /**
     * Initialize uniformSemantics
     */
    resetUniformSemantics(): void;
    /**
     * Analyze shader code of the shaderity and get information of attribute, varying and uniform.
     * The information can be retrieved from the get method of this instance.
     *
     * The semantic property of the ReflectionAttribute is assigned to the value of the semantic if
     * it is specified in the attribute line of the shader code. If not, the AttributeSemanticsMap
     * is searched for matching semantics, or UNKNOWN. The same applies to the semantic property of
     * ReflectionUniform.
     */
    reflect(): void;
    private __setDefaultAttributeAndUniformSemanticsMap;
    private __matchAttribute;
    private __addAttribute;
    private __matchVarying;
    private __addVarying;
    private __addUniform;
}
