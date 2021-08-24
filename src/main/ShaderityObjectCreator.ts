import {
	ShaderExtensionBehavior,
	ShaderExtensionObject,
	ShaderityObject,
	ShaderPrecisionObject,
	ShaderStageStr
} from '../types/type';
import Utility from './Utility';

/**
 * This class creates a shaderity object.
 */
export default class ShaderityObjectCreator {
	private __shaderStage: ShaderStageStr;

	private __defineDirectiveNames: string[] = [];
	private __extensions: ShaderExtensionObject[] = [];
	private __globalPrecision: ShaderPrecisionObject = {
		int: 'highp',
		float: 'highp',
		sampler2D: 'highp',
		samplerCube: 'highp',
		sampler3D: 'highp',
		sampler2DArray: 'highp',
		isampler2D: 'highp',
		isamplerCube: 'highp',
		isampler3D: 'highp',
		isampler2DArray: 'highp',
		usampler2D: 'highp',
		usamplerCube: 'highp',
		usampler3D: 'highp',
		usampler2DArray: 'highp',
		sampler2DShadow: 'highp',
		samplerCubeShadow: 'highp',
		sampler2DArrayShadow: 'highp',
	};
	// global constant value
	// attribute declaration (for vertex shader)
	// varying declaration
	// uniform declaration
	// uniform structure declaration
	// functions
	// main function

	constructor(shaderStage: ShaderStageStr) {
		this.__shaderStage = shaderStage;
	}

	public addDefineDirective(defineDirectiveName: string) {
		const isDuplicate =
			this.__defineDirectiveNames.some(name => name === defineDirectiveName);
		if (isDuplicate) {
			console.warn('addDefineDirective: this define directive is already set');
			return;
		}

		this.__defineDirectiveNames.push(defineDirectiveName);
	}

	public removeDefineDirective(defineDirectiveName: string) {
		const matchedIndex = this.__defineDirectiveNames.indexOf(defineDirectiveName);

		if (matchedIndex === -1) {
			console.warn('removedDefineDirective: this define directive is not exist');
			return;
		}

		this.__defineDirectiveNames.splice(matchedIndex, 1);
	}

	public addExtension(extensionName: string, behavior: ShaderExtensionBehavior = 'require') {
		const isDuplicate =
			this.__extensions.some(extension => extension.extensionName === extensionName);
		if (isDuplicate) {
			console.warn('addExtension: this extension is already set');
			return;
		}

		this.__extensions.push({
			extensionName,
			behavior
		});
	}

	public removeExtension(extensionName: string) {
		const matchedIndex =
			this.__extensions.findIndex(extension => extension.extensionName === extensionName);

		if (matchedIndex === -1) {
			console.warn('removeExtension: this extension is not exist');
			return;
		}

		this.__extensions.splice(matchedIndex, 1);
	}

	public createShaderityObject(): ShaderityObject {
		const shaderityObj = {
			code: this.__createShaderCode(),
			shaderStage: this.__shaderStage,
			isFragmentShader: this.__shaderStage === 'fragment',
		};

		return shaderityObj;
	}

	// TODO: implement shader code import feature (low priority)
	// public importShaderCode(code: string) {}

	private __createShaderCode(): string {
		// TODO: now implementing
		const code
			= this.__createDefineDirectiveShaderCode()
			+ this.__createExtensionShaderCode();

		return code;
	}

	private __createDefineDirectiveShaderCode(): string {
		let shaderCode = '';
		for (const defineDirectiveName of this.__defineDirectiveNames) {
			shaderCode += `#define ${defineDirectiveName}\n`;
		}

		return Utility._addLineFeedCodeIfNotNullString(shaderCode);;
	}

	private __createExtensionShaderCode(): string {
		let shaderCode = '';
		for (const extension of this.__extensions) {
			shaderCode += `#extension ${extension.extensionName}: ${extension.behavior}\n`;
		}

		return Utility._addLineFeedCodeIfNotNullString(shaderCode);
	}
}
