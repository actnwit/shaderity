import {TemplateObject} from '../types/type';

/**
 * This class edits the code property of a shaderity object.
 */
export default class ShaderEditor {
	static _insertDefinition(splittedShaderCode: string[], definition: string) {
		const defStr = definition.replace(/#define[\t ]+/, '');

		splittedShaderCode.unshift(`#define ${defStr}`);
	}

	static _fillTemplate(shaderCode: string, templateObject: TemplateObject) {
		const templateString = shaderCode.replace(/\/\*[\t ]*shaderity:[\t ]*(@{[\t ]*)(\S+)([\t ]*})[\t ]*\*\//g, '${this.$2}');

		const resultCode = new Function("return `" + templateString + "`;").call(templateObject);
		return resultCode;
	}
}