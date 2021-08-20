import Reflection from './Reflection';
import {ShaderityObject, TemplateObject} from '../types/type';
import ShaderTransformer from './ShaderTransformer';
import ShaderEditor from './ShaderEditor';

export default class Shaderity {
	// =========================================================================================================
	// shader transformation functions
	// =========================================================================================================
	static transformToGLSLES1(obj: ShaderityObject) {
		const splittedShaderCode = this.__splitByLineFeedCode(obj.code);

		const transformedSplittedShaderCode
			= ShaderTransformer._transformToGLSLES1(splittedShaderCode, obj.isFragmentShader);
		const resultCode = this.__joinSplittedLine(transformedSplittedShaderCode);

		const resultObj: ShaderityObject = {
			code: resultCode,
			shaderStage: obj.shaderStage,
			isFragmentShader: obj.isFragmentShader,
		};

		return resultObj;
	}

	static transformToGLSLES3(obj: ShaderityObject) {
		const splittedShaderCode = this.__splitByLineFeedCode(obj.code);

		const transformedSplittedShaderCode
			= ShaderTransformer._transformToGLSLES3(splittedShaderCode, obj.isFragmentShader);
		const resultCode = this.__joinSplittedLine(transformedSplittedShaderCode);

		const resultObj: ShaderityObject = {
			code: resultCode,
			shaderStage: obj.shaderStage,
			isFragmentShader: obj.isFragmentShader,
		};

		return resultObj;
	}

	static transformTo(version: string, obj: ShaderityObject) {
		const splittedShaderCode = this.__splitByLineFeedCode(obj.code);

		const transformedSplittedShaderCode
			= ShaderTransformer._transformTo(version, splittedShaderCode, obj.isFragmentShader);
		const resultCode = this.__joinSplittedLine(transformedSplittedShaderCode);

		const resultObj: ShaderityObject = {
			code: resultCode,
			shaderStage: obj.shaderStage,
			isFragmentShader: obj.isFragmentShader,
		};

		return resultObj;
	}

	// =========================================================================================================
	// shader edit functions
	// =========================================================================================================
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
	static fillTemplate(obj: ShaderityObject, arg: TemplateObject) {
		const copy = this.__copyShaderityObject(obj);

		copy.code = ShaderEditor._fillTemplate(copy.code, arg);

		return copy;
	}

	static insertDefinition(obj: ShaderityObject, definition: string) {
		const copy = this.__copyShaderityObject(obj);
		const splittedShaderCode = this.__splitByLineFeedCode(obj.code);

		ShaderEditor._insertDefinition(splittedShaderCode, definition);
		copy.code = this.__joinSplittedLine(splittedShaderCode);

		return copy;
	}

	// =========================================================================================================
	// reflection functions
	// =========================================================================================================
	static reflect(obj: ShaderityObject): Reflection {
		const splittedShaderCode = this.__splitByLineFeedCode(obj.code);
		const shaderStage = obj.shaderStage;

		const reflection = new Reflection(splittedShaderCode, shaderStage);
		reflection.reflect();
		return reflection;
	}

	static createReflectionObject(obj: ShaderityObject): Reflection {
		const splittedShaderCode = this.__splitByLineFeedCode(obj.code);
		const shaderStage = obj.shaderStage;

		const reflection = new Reflection(splittedShaderCode, shaderStage);
		return reflection;
	}

	// =========================================================================================================
	// private functions
	// =========================================================================================================
	private static __copyShaderityObject(obj: ShaderityObject) {
		const copiedObj: ShaderityObject = {
			code: obj.code,
			shaderStage: obj.shaderStage,
			isFragmentShader: obj.isFragmentShader,
		}

		return copiedObj;
	}

	private static __splitByLineFeedCode(source: string) {
		return source.split(/\r\n|\n/);
	}

	private static __joinSplittedLine(splittedLine: string[]) {
		return splittedLine.join('\n');
	}
}
