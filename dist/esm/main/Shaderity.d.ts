import Reflection from './Reflection';
import { ShaderityObject, ShaderStageStr, ShaderVersion, TemplateObject } from '../types/type';
import ShaderityObjectCreator from './ShaderityObjectCreator';
export default class Shaderity {
    /**
     * Translate a GLSL ES3 shader code to a GLSL ES1 shader code
     * @param obj Shaderity object to translate to glsl es1
     * @param embedErrorsInOutput If true, when there is an error in the conversion,
     *    the error and the number of lines are output at the bottom of the return
     *    value ShaderityObject.code. If false, throw an error.
     * @returns ShaderityObject whose code property is the shader code for GLSL ES1
     */
    static transformToGLSLES1(obj: ShaderityObject, embedErrorsInOutput?: boolean): ShaderityObject;
    /**
     * Translate a GLSL ES1 shader code to a GLSL ES3 shader code
     */
    static transformToGLSLES3(obj: ShaderityObject): ShaderityObject;
    /**
     * Translate a GLSL shader code to a shader code of specified GLSL version
     */
    static transformTo(version: ShaderVersion, obj: ShaderityObject, embedErrorsInOutput?: boolean): ShaderityObject;
    static processPragma(obj: ShaderityObject): ShaderityObject;
    /**
     * Create an instance to create shaderity object.
     */
    static createShaderityObjectCreator(shaderStage: ShaderStageStr): ShaderityObjectCreator;
    /**
     * Find the following template pattern in the shader code and replace key to value
     * @param templateObject An object that represents the string before and after the replacement
     * The key can be a string or an object. If an object is used as the key,
     * the key in the pattern of shaderCode must also match the object.
     * For example, if templateObject is
        {
            sample {
                sampleA: 0
            }
        }
     * then the key in a shader code is sample.sampleA.
     */
    static fillTemplate(obj: ShaderityObject, arg: TemplateObject): ShaderityObject;
    /**
     * Insert define directive
     */
    static insertDefinition(obj: ShaderityObject, definition: string): ShaderityObject;
    /**
     * Create an instance to get the attribute, varying, and uniform information from a shader code of the shaderity.
     * To get these information, you need to call reflection.reflect method.
     */
    static createReflectionObject(obj: ShaderityObject): Reflection;
    private static __copyShaderityObject;
}
