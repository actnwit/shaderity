import Reflection from './Reflection';
import {ShaderityObject, TemplateObject} from '../types/type';
import ShaderTransformer from './ShaderTransformer';
import ShaderEditor from './ShaderEditor';

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
		if (obj.shaderStage === 'fragment') {
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
			shaderStage: obj.shaderStage,
			isFragmentShader: obj.isFragmentShader,
		}

		return copiedObj;
	}

	transformToGLSLES1(obj: ShaderityObject) {
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);
		const isFragmentShader = this.isFragmentShader(obj);

		const transformedSplittedShaderCode
			= ShaderTransformer._transformToGLSLES1(splittedShaderCode, isFragmentShader);
		const resultCode = this._joinSplittedLine(transformedSplittedShaderCode);

		const resultObj: ShaderityObject = {
			code: resultCode,
			shaderStage: obj.shaderStage,
			isFragmentShader: obj.isFragmentShader,
		};

		return resultObj;
	}

	transformToGLSLES3(obj: ShaderityObject) {
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);

		const isFragmentShader = this.isFragmentShader(obj);
		const transformedSplittedShaderCode
			= ShaderTransformer._transformToGLSLES3(splittedShaderCode, isFragmentShader);
		const resultCode = this._joinSplittedLine(transformedSplittedShaderCode);

		const resultObj: ShaderityObject = {
			code: resultCode,
			shaderStage: obj.shaderStage,
			isFragmentShader: obj.isFragmentShader,
		};

		return resultObj;
	}

	transformTo(version: string, obj: ShaderityObject) {
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);

		const isFragmentShader = this.isFragmentShader(obj);
		const transformedSplittedShaderCode
			= ShaderTransformer._transformTo(version, splittedShaderCode, isFragmentShader);
		const resultCode = this._joinSplittedLine(transformedSplittedShaderCode);

		const resultObj: ShaderityObject = {
			code: resultCode,
			shaderStage: obj.shaderStage,
			isFragmentShader: obj.isFragmentShader,
		};

		return resultObj;
	}

	private _splitByLineFeedCode(source: string) {
		return source.split(/\r\n|\n/);
	}

	private _joinSplittedLine(splittedLine: string[]) {
		return splittedLine.join('\n');
	}

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
	// The template pattern is	/* shaderity: @{key} */
	fillTemplate(obj: ShaderityObject, arg: TemplateObject) {
		const copy = this.copyShaderityObject(obj);

		copy.code = ShaderEditor._fillTemplate(copy.code, arg);

		return copy;
	}

	insertDefinition(obj: ShaderityObject, definition: string) {
		const copy = this.copyShaderityObject(obj);
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);

		ShaderEditor._insertDefinition(splittedShaderCode, definition);
		copy.code = this._joinSplittedLine(splittedShaderCode);

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
