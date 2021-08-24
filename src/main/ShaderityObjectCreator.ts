import {
	ShaderConstantValueObject,
	ShaderExtensionBehavior,
	ShaderExtensionObject,
	ShaderityObject,
	ShaderConstantValueVarTypeES3,
	ShaderPrecisionObject,
	ShaderPrecisionObjectKey,
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
	private __globalConstantValues: ShaderConstantValueObject[] = [];
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

	public updateGlobalPrecision(precision: ShaderPrecisionObject) {
		Object.assign(this.__globalPrecision, precision);
	}

	public addGlobalConstantValue(variableName: string, type: ShaderConstantValueVarTypeES3, values: number[]) {
		const isDuplicate =
			this.__globalConstantValues.some(globalConstantValue => globalConstantValue.variableName === variableName);
		if (isDuplicate) {
			console.error(`addGlobalConstantValue: duplicate variable name ${variableName}`);
			return;
		}

		const isValidComponentNumber = Utility._isValidComponentCount(type, values);
		if (!isValidComponentNumber) {
			console.error(`addGlobalConstantValue: the component count of ${variableName} is invalid`);
			return;
		}

		const isIntType = Utility._isIntType(type);
		if (isIntType) {
			const existNonIntegerValue = ShaderityObjectCreator.__existNonIntegerValue(values);
			if (existNonIntegerValue) {
				console.warn(`addGlobalConstantValue: non-integer value is set to ${variableName}`);
			}
		}

		this.__globalConstantValues.push({
			variableName,
			type,
			values,
		});
	}

	public updateGlobalConstantValue(variableName: string, values: number[]) {
		const matchedIndex =
			this.__globalConstantValues.findIndex(globalConstantValue => globalConstantValue.variableName === variableName);
		if (matchedIndex === -1) {
			console.warn(`updateGlobalConstantValue: the variable name ${variableName} is not exist`);
			return;
		}

		const type = this.__globalConstantValues[matchedIndex].type;

		const isValidComponentNumber = Utility._isValidComponentCount(type, values);
		if (!isValidComponentNumber) {
			console.error('updateGlobalConstantValue: the component count is invalid');
			return;
		}

		const isIntType = Utility._isIntType(type);
		if (isIntType) {
			const existNonIntegerValue = ShaderityObjectCreator.__existNonIntegerValue(values);
			if (existNonIntegerValue) {
				console.warn(`updateGlobalConstantValue: the ${variableName} has a non-integer value.`);
			}
		}

		this.__globalConstantValues[matchedIndex].values = values;
	}

	public removeGlobalConstantValue(variableName: string) {
		const matchedIndex =
			this.__globalConstantValues.findIndex(globalConstantValue => globalConstantValue.variableName === variableName);
		if (matchedIndex === -1) {
			console.warn(`removeGlobalConstantValue: the variable name ${variableName} is not exist`);
			return;
		}

		this.__globalConstantValues.splice(matchedIndex, 1);
	}

	public createShaderityObject(): ShaderityObject {
		const shaderityObj = {
			code: this.__createShaderCode(),
			shaderStage: this.__shaderStage,
			isFragmentShader: this.__shaderStage === 'fragment',
		};

		return shaderityObj;
	}

	private static __existNonIntegerValue(values: number[]) {
		for (const value of values) {
			if (!Number.isInteger(value)) {
				return true;
			}
		}
		return false;
	}

	// TODO: implement shader code import feature (low priority)
	// public importShaderCode(code: string) {}

	private __createShaderCode(): string {
		// TODO: now implementing
		const code
			= this.__createDefineDirectiveShaderCode()
			+ this.__createExtensionShaderCode()
			+ this.__createGlobalPrecisionShaderCode();

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

	//TODO: remove needless precisions
	private __createGlobalPrecisionShaderCode(): string {
		let shaderCode = '';
		for (const type in this.__globalPrecision) {
			const precisionType = type as ShaderPrecisionObjectKey;
			const precisionQualifier = this.__globalPrecision[precisionType];

			shaderCode += `precision ${precisionQualifier} ${precisionType};\n`;
		}

		return Utility._addLineFeedCodeIfNotNullString(shaderCode);
	}
}

