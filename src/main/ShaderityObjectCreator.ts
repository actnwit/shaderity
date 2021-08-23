import {ShaderStageStr} from '../types/type';

export default class ShaderityObjectCreator {
	private __shaderStage: ShaderStageStr;
	constructor(shaderStage: ShaderStageStr) {
		this.__shaderStage = shaderStage;
	}
}