import Reflection from './Reflection';
import {ShaderityObject} from '../types/type';
import ShaderTransformer from './ShaderTransformer';

export default class Shaderity {
	private static __instance: Shaderity;

	static getInstance(): Shaderity {
		if (!this.__instance) {
			this.__instance = new Shaderity();
		}
		return this.__instance;
	}

	isVertexShader(obj: ShaderityObject) {
		if (obj.shaderStage === 'vertex') {
			return true;
		} else {
			return false;
		}
	}

	isFragmentShader(obj: ShaderityObject) {
		if (obj.shaderStage === 'fragment' || obj.shaderStage === 'pixel') {
			return true;
		} else {
			return false;
		}
	}

	isPixelShader(obj: ShaderityObject) {
		return this.isFragmentShader(obj);
	}

	copyShaderityObject(obj: ShaderityObject) {
		const copiedObj: ShaderityObject = {
			code: obj.code,
			shaderStage: obj.shaderStage
		}

		return copiedObj;
	}

	transformToGLSLES1(obj: ShaderityObject) {
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);
		const isFragmentShader = this.isFragmentShader(obj);

		const transformedSplittedShaderCode
			= ShaderTransformer._transformToGLSLES1(splittedShaderCode, isFragmentShader);
		const resultCode = this._joinSplittedRow(transformedSplittedShaderCode);

		const resultObj: ShaderityObject = {
			code: resultCode,
			shaderStage: obj.shaderStage,
		};

		return resultObj;
	}

	transformToGLSLES3(obj: ShaderityObject) {
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);

		const isFragmentShader = this.isFragmentShader(obj);
		const transformedSplittedShaderCode
			= ShaderTransformer._transformToGLSLES3(splittedShaderCode, isFragmentShader);
		const resultCode = this._joinSplittedRow(transformedSplittedShaderCode);

		const resultObj: ShaderityObject = {
			code: resultCode,
			shaderStage: obj.shaderStage,
		};

		return resultObj;
	}

	transformTo(version: string, obj: ShaderityObject) {
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);

		const isFragmentShader = this.isFragmentShader(obj);
		const transformedSplittedShaderCode
			= ShaderTransformer._transformTo(version, splittedShaderCode, isFragmentShader);
		const resultCode = this._joinSplittedRow(transformedSplittedShaderCode);

		const resultObj: ShaderityObject = {
			code: resultCode,
			shaderStage: obj.shaderStage,
		};

		return resultObj;
	}

	private _splitByLineFeedCode(source: string) {
		return source.split(/\r\n|\n/);
	}

	private _joinSplittedRow(splittedRow: string[]) {
		return splittedRow.join('\n');
	}

	/**
	 * Fill arguments into template shader text in ShaderityObject.
	 * @param obj a shaderity object
	 * @returns a copied and processed shaderity object
	 */
	fillTemplate(obj: ShaderityObject, arg: {[s: string]: any}) {
		const copy = this.copyShaderityObject(obj);


		const templateString = obj.code.replace(/\/\*[\t ]*shaderity:[\t ]*(@{[\t ]*)(\S+)([\t ]*})[\t ]*\*\//g, '${this.$2}');


		const fillTemplate = function (templateString: string, arg: {[s: string]: any}) {
			return new Function("return `" + templateString + "`;").call(arg);
		}
		copy.code = fillTemplate(templateString, arg);

		return copy;
	}

	insertDefinition(obj: ShaderityObject, definition: string) {
		const copy = this.copyShaderityObject(obj);
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);

		const defStr = definition.replace(/#define[\t ]+/, '');

		splittedShaderCode.unshift(`#define ${defStr}`);

		copy.code = this._joinSplittedRow(splittedShaderCode);

		return copy;
	}

	reflect(obj: ShaderityObject): Reflection {
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);
		const shaderStage = obj.shaderStage;

		const reflection = new Reflection(splittedShaderCode, shaderStage);
		reflection.reflect();
		return reflection;
	}

	createReflectionObject(obj: ShaderityObject): Reflection {
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);
		const shaderStage = obj.shaderStage;

		const reflection = new Reflection(splittedShaderCode, shaderStage);
		return reflection;
	}
}
