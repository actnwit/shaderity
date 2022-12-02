import { TemplateObject } from '../types/type';
/**
 * This class edits the code property of a shaderity object.
 */
export default class ShaderEditor {
    static _insertDefinition(splittedShaderCode: string[], definition: string): void;
    static _fillTemplate(shaderCode: string, templateObject: TemplateObject): any;
}
