import {
	ShaderConstantValueObject,
	ShaderExtensionBehavior,
	ShaderExtensionObject,
	ShaderityObject,
	ShaderConstantValueVarTypeES3,
	ShaderPrecisionObject,
	ShaderPrecisionObjectKey,
	ShaderStageStr,
	ShaderAttributeObject,
	ShaderPrecisionType,
	ShaderAttributeVarType,
	ShaderVaryingObject,
	ShaderVaryingInterpolationType,
	ShaderVaryingVarType,
	ShaderUniformObject,
	ShaderUniformVarTypeES3,
	ShaderStructDefinitionObject,
	ShaderStructMemberObject,
	ShaderConstantStructValueObject,
	ShaderUniformStructObject,
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
	private __structDefinitions: ShaderStructDefinitionObject[] = [];
	private __globalConstantValues: ShaderConstantValueObject[] = [];
	private __globalConstantStructValues: ShaderConstantStructValueObject[] = [];
	private __attributes: ShaderAttributeObject[] = []; // for vertex shader only
	private __varyings: ShaderVaryingObject[] = [];
	private __uniforms: ShaderUniformObject[] = [];
	private __uniformStructs: ShaderUniformStructObject[] = [];

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

	// only define types
	public addStructDefinition(structName: string, memberObjects: ShaderStructMemberObject[]) {
		const isDuplicate =
			this.__structDefinitions.some(structDefinition => structDefinition.structName === structName);
		if (isDuplicate) {
			console.error(`addStructDefinition: duplicate struct type name ${structName}`);
			return;
		}

		this.__structDefinitions.push({
			structName,
			memberObjects,
		});
	}

	public updateStructDefinition(structName: string, memberObjects: ShaderStructMemberObject[]) {
		const matchedIndex =
			this.__structDefinitions.findIndex(structDefinition => structDefinition.structName === structName);
		if (matchedIndex === -1) {
			console.error(`updateStructDefinition: the struct type name ${structName} is not exist`);
			return;
		}

		this.__structDefinitions[matchedIndex].memberObjects = memberObjects;
	}

	public removeStructDefinition(structName: string) {
		const matchedIndex =
			this.__structDefinitions.findIndex(structDefinition => structDefinition.structName === structName);
		if (matchedIndex === -1) {
			console.error(`removeStructDefinition: the struct type name ${structName} is not exist`);
			return;
		}

		this.__structDefinitions.splice(matchedIndex, 1);
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

	// need to define struct by the addStructDefinition method
	// validate that the corresponding structure is defined by the __createGlobalConstantStructValueShaderCode method
	public addGlobalConstantStructValue(structName: string, variableName: string, values: {[keyVariableName: string]: number[]}) {
		const isDuplicate =
			this.__globalConstantStructValues.some(structValue => structValue.variableName === variableName);
		if (isDuplicate) {
			console.error(`addGlobalConstantStructValue: duplicate variable name ${variableName}`);
			return;
		}

		this.__globalConstantStructValues.push({
			variableName,
			structName,
			values,
		});
	}

	public updateGlobalConstantStructValue(variableName: string, values: {[keyVariableName: string]: number[]}) {
		const matchedIndex =
			this.__globalConstantStructValues.findIndex(structValue => structValue.variableName === variableName);
		if (matchedIndex === -1) {
			console.error(`updateGlobalConstantStructValue:  the variable name ${variableName} is not exist`);
			return;
		}

		this.__globalConstantStructValues[matchedIndex].values = values;
	}

	public removeGlobalConstantStructValue(variableName: string) {
		const matchedIndex =
			this.__globalConstantStructValues.findIndex(structValue => structValue.variableName === variableName);
		if (matchedIndex === -1) {
			console.error(`updateGlobalConstantStructValue:  the variable name ${variableName} is not exist`);
			return;
		}

		this.__globalConstantStructValues.splice(matchedIndex, 1);
	}

	public addAttributeDeclaration(
		variableName: string,
		type: ShaderAttributeVarType,
		options?: {
			precision?: ShaderPrecisionType,
			location?: number,
		}
	) {
		if (this.__shaderStage !== 'vertex') {
			console.error('addAttribute: this method is for vertex shader only');
			return;
		}

		const isDuplicate =
			this.__attributes.some(attribute => attribute.variableName === variableName);
		if (isDuplicate) {
			console.error(`addAttribute: duplicate variable name ${variableName}`);
			return;
		}

		this.__attributes.push({
			variableName,
			type,
			precision: options?.precision,
			location: options?.location,
		});
	}

	public removeAttributeDeclaration(variableName: string) {
		const matchedIndex =
			this.__attributes.findIndex(attribute => attribute.variableName === variableName);
		if (matchedIndex === -1) {
			console.warn(`removeAttribute: the variable name ${variableName} is not exist`);
			return;
		}

		this.__attributes.splice(matchedIndex, 1);
	}

	public addVaryingDeclaration(
		variableName: string,
		type: ShaderVaryingVarType,
		options?: {
			precision?: ShaderPrecisionType,
			interpolationType?: ShaderVaryingInterpolationType,
		}
	) {
		const isDuplicate =
			this.__varyings.some(varying => varying.variableName === variableName);
		if (isDuplicate) {
			console.error(`addVarying: duplicate variable name ${variableName}`);
			return;
		}

		const isIntType = Utility._isIntType(type);
		let interpolationType = options?.interpolationType;
		if (isIntType && interpolationType !== 'flat') {
			if (interpolationType != null) {
				console.error(`addVarying: the interpolationType must be flat for integer types`);
				return;
			} else {
				console.warn(`addVarying: set the interpolationType of integer types to flat to avoid compilation error`);
				interpolationType = 'flat';
			}
		}

		this.__varyings.push({
			variableName,
			type,
			precision: options?.precision,
			interpolationType,
		});
	}

	public removeVaryingDeclaration(variableName: string) {
		const matchedIndex =
			this.__varyings.findIndex(varying => varying.variableName === variableName);
		if (matchedIndex === -1) {
			console.warn(`removeVarying: the variable name ${variableName} is not exist`);
			return;
		}

		this.__varyings.splice(matchedIndex, 1);
	}

	public addUniformDeclaration(
		variableName: string,
		type: ShaderUniformVarTypeES3,
		options?: {
			precision?: ShaderPrecisionType,
		}
	) {
		const isDuplicate =
			this.__uniforms.some(uniform => uniform.variableName === variableName);
		if (isDuplicate) {
			console.error(`addUniform: duplicate variable name ${variableName}`);
			return;
		}

		if (type === 'bool' && options?.precision != null) {
			console.warn(`addUniform: remove the specification of precision for bool type to avoid compilation error`);
			options.precision = undefined;
		}

		this.__uniforms.push({
			variableName,
			type,
			precision: options?.precision,
		});
	}

	public removeUniformDeclaration(variableName: string) {
		const matchedIndex =
			this.__uniforms.findIndex(uniform => uniform.variableName === variableName);
		if (matchedIndex === -1) {
			console.warn(`removeUniform: the variable name ${variableName} is not exist`);
			return;
		}

		this.__uniforms.splice(matchedIndex, 1);
	}

	// need to define struct by the addStructDefinition method
	public addUniformStructDeclaration(
		structName: string,
		variableName: string
	) {
		const isDuplicate =
			this.__uniformStructs.some(uniformStruct => uniformStruct.variableName === variableName);
		if (isDuplicate) {
			console.error(`addUniformStructDeclaration: duplicate variable name ${variableName}`);
			return;
		}

		this.__uniformStructs.push({
			variableName,
			structName,
		});
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
			+ this.__createGlobalPrecisionShaderCode()
			+ this.__createStructDefinitionShaderCode()
			+ this.__createGlobalConstantValueShaderCode()
			+ this.__createGlobalConstantStructValueShaderCode()
			+ this.__createAttributeDeclarationShaderCode()
			+ this.__createVaryingDeclarationShaderCode()
			+ this.__createUniformDeclarationShaderCode();

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

	private __createStructDefinitionShaderCode(): string {
		let shaderCode = '';
		for (const structDefinition of this.__structDefinitions) {
			shaderCode += `struct ${structDefinition.structName} {\n`;

			for (let i = 0; i < structDefinition.memberObjects.length; i++) {
				const variable = structDefinition.memberObjects[i];

				shaderCode += `  `;
				if (variable.precision != null) {
					shaderCode += `${variable.precision} `;
				}

				shaderCode += `${variable.type} ${variable.memberName};\n`;
			}

			shaderCode += `};\n`;
		}

		return Utility._addLineFeedCodeIfNotNullString(shaderCode);
	}

	private __createGlobalConstantValueShaderCode(): string {
		let shaderCode = '';
		for (const globalConstantValue of this.__globalConstantValues) {
			const type = globalConstantValue.type;
			const variableName = globalConstantValue.variableName;
			const value = globalConstantValue.values;

			shaderCode += `const ${type} ${variableName} = ${type}(`;
			for (let i = 0; i < value.length; i++) {
				shaderCode += value[i] + ', ';
			}

			shaderCode = shaderCode.replace(/,\s$/, ');\n');
		}

		return Utility._addLineFeedCodeIfNotNullString(shaderCode);
	}

	private __createGlobalConstantStructValueShaderCode(): string {
		let shaderCode = '';
		for (const structValue of this.__globalConstantStructValues) {
			const matchedIndex =
				this.__structDefinitions.findIndex(definition => definition.structName === structValue.structName);
			if (matchedIndex === -1) {
				console.error(`__createGlobalConstantStructValueShaderCode: the struct type ${structValue.structName} is not defined`);
				continue;
			}

			shaderCode += `const ${structValue.structName} ${structValue.variableName} = ${structValue.structName} (\n`;

			const structDefinition = this.__structDefinitions[matchedIndex];
			if (structDefinition.memberObjects.length !== Object.keys(structValue.values).length) {
				console.error(`__createGlobalConstantStructValueShaderCode: Invalid number of variables that ${structValue.variableName} has`);
				continue;
			}

			const hasSamplerType =
				structDefinition.memberObjects.some(memberObject => Utility._isSamplerType(memberObject.type));
			if (hasSamplerType) {
				console.error(`__createGlobalConstantStructValueShaderCode: ConstantStructValue (${structValue.variableName}) cannot have sampler type parameter`);
				continue;
			}

			for (let i = 0; i < structDefinition.memberObjects.length; i++) {
				const variableName = structDefinition.memberObjects[i].memberName;
				const value = structValue.values[variableName]
				if (value == null) {
					console.error(`__createGlobalConstantStructValueShaderCode: ${structValue.variableName} does not have the value of ${variableName}`);
					continue;
				}

				const type = structDefinition.memberObjects[i].type;
				const isValidComponentNumber = Utility._isValidComponentCount(type, value);
				if (!isValidComponentNumber) {
					console.error(`__createGlobalConstantStructValueShaderCode: the component count of ${variableName} in ${structValue.variableName} is invalid`);
					continue;
				}

				shaderCode += `  ${type}(`;
				for (let i = 0; i < value.length; i++) {
					shaderCode += value[i] + ', ';
				}

				shaderCode = shaderCode.replace(/,\s$/, '),\n');
			}

			shaderCode = shaderCode.replace(/,\n$/, '\n);\n');
		}

		return Utility._addLineFeedCodeIfNotNullString(shaderCode);
	}

	private __createAttributeDeclarationShaderCode(): string {
		let shaderCode = '';
		for (const attribute of this.__attributes) {
			if (attribute.location != null) {
				shaderCode += `layout (location = ${attribute.location}) `;
			}

			shaderCode += `in `;

			if (attribute.precision != null) {
				shaderCode += `${attribute.precision} `;
			}

			shaderCode += `${attribute.type} ${attribute.variableName};\n`;
		}

		return Utility._addLineFeedCodeIfNotNullString(shaderCode);
	}

	private __createVaryingDeclarationShaderCode(): string {
		let shaderCode = '';
		for (const varying of this.__varyings) {
			if (varying.interpolationType != null) {
				shaderCode += `${varying.interpolationType} `;
			}

			shaderCode += this.__shaderStage == 'vertex' ? `out ` : `in `;

			if (varying.precision != null) {
				shaderCode += `${varying.precision} `;
			}

			shaderCode += `${varying.type} ${varying.variableName};\n`;
		}

		return Utility._addLineFeedCodeIfNotNullString(shaderCode);
	}

	private __createUniformDeclarationShaderCode(): string {
		let shaderCode = '';
		for (const uniform of this.__uniforms) {
			shaderCode += `uniform `;

			if (uniform.precision != null) {
				shaderCode += `${uniform.precision} `;
			}

			shaderCode += `${uniform.type} ${uniform.variableName};\n`;
		}

		return Utility._addLineFeedCodeIfNotNullString(shaderCode);
	}
}
