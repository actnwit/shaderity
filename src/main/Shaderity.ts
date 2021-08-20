import Reflection from './Reflection';
import {ShaderityObject, ShaderVersion, TemplateObject} from '../types/type';
import ShaderTransformer from './ShaderTransformer';
import ShaderEditor from './ShaderEditor';

export default class Shaderity {
	// =========================================================================================================
	// shader transformation functions
	// =========================================================================================================

	/**
	 * Translate a GLSL ES3 shader code to a GLSL ES1 shader code
	 */
	public static transformToGLSLES1(obj: ShaderityObject) {
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

	/**
	 * Translate a GLSL ES1 shader code to a GLSL ES3 shader code
	 */
	public static transformToGLSLES3(obj: ShaderityObject) {
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

	/**
	 * Translate a GLSL shader code to a shader code of specified GLSL version
	 */
	public static transformTo(version: ShaderVersion, obj: ShaderityObject) {
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
	public static fillTemplate(obj: ShaderityObject, arg: TemplateObject) {
		const copy = this.__copyShaderityObject(obj);

		copy.code = ShaderEditor._fillTemplate(copy.code, arg);

		return copy;
	}

	/**
	 * Insert define directive
	 */
	public static insertDefinition(obj: ShaderityObject, definition: string) {
		const copy = this.__copyShaderityObject(obj);
		const splittedShaderCode = this.__splitByLineFeedCode(obj.code);

		ShaderEditor._insertDefinition(splittedShaderCode, definition);
		copy.code = this.__joinSplittedLine(splittedShaderCode);

		return copy;
	}

	// =========================================================================================================
	// reflection functions
	// =========================================================================================================

	/**
	 * Create an instance to get the attribute, varying, and uniform information from a shader code of the shaderity.
	 * To get these information, you need to call reflection.reflect method.
	 */
	public static createReflectionObject(obj: ShaderityObject): Reflection {
		const splittedShaderCode = this.__splitByLineFeedCode(obj.code);

		const reflection = new Reflection(splittedShaderCode, obj.shaderStage);
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
