export default class ShaderEditor {
	static _insertDefinition(splittedShaderCode: string[], definition: string) {
		const defStr = definition.replace(/#define[\t ]+/, '');

		splittedShaderCode.unshift(`#define ${defStr}`);
	}

	static _fillTemplate(shaderCode: string, arg: {[s: string]: any}) {
		const templateString = shaderCode.replace(/\/\*[\t ]*shaderity:[\t ]*(@{[\t ]*)(\S+)([\t ]*})[\t ]*\*\//g, '${this.$2}');

		const resultCode = new Function("return `" + templateString + "`;").call(arg);
		return resultCode;
	}
}