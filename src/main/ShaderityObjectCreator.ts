import {ShaderityObject, ShaderStageStr} from '../types/type';

export default class ShaderityObjectCreator {
	private __shaderStage: ShaderStageStr;

	constructor(shaderStage: ShaderStageStr) {
		this.__shaderStage = shaderStage;
	}

	public createShaderityObject(): ShaderityObject {
		const shaderityObj = {
			code: this.__createShaderCode(),
			shaderStage: this.__shaderStage,
			isFragmentShader: this.__shaderStage === 'fragment',
		};

		return shaderityObj;
	}

	private __createShaderCode(): string {
		// TODO: implementation
		return '';
	}
}