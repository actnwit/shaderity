import {ShaderAttributeVarType, ShaderConstantValueVarTypeES3} from '../types/type';

export default class Utility {
	static _splitByLineFeedCode(source: string) {
		return source.split(/\r\n|\n/);
	}

	static _joinSplittedLine(splittedLine: string[]) {
		return splittedLine.join('\n');
	}

	static _addLineFeedCodeIfNotNullString(source: string) {
		return source === '' ? source : source + '\n';
	}

	static _componentNumber(
		type: ShaderConstantValueVarTypeES3 | ShaderAttributeVarType
	) {
		let componentNumber;
		if (type === 'float' || type === 'int' || type === 'bool' || type === 'uint') {
			componentNumber = 1;
		} else if (type === 'vec2' || type === 'ivec2' || type === 'bvec2' || type === 'uvec2') {
			componentNumber = 2;
		} else if (type === 'vec3' || type === 'ivec3' || type === 'bvec3' || type === 'uvec3') {
			componentNumber = 3;
		} else if (type === 'vec4' || type === 'ivec4' || type === 'bvec4' || type === 'uvec4' || type === 'mat2' || type === 'mat2x2') {
			componentNumber = 4;
		} else if (type === 'mat2x3' || type === 'mat3x2') {
			componentNumber = 6;
		} else if (type === 'mat2x4' || type === 'mat4x2') {
			componentNumber = 8;
		} else if (type === 'mat3' || type === 'mat3x3') {
			componentNumber = 9;
		} else if (type === 'mat3x4' || type === 'mat4x3') {
			componentNumber = 12;
		} else if (type === 'mat4' || type === 'mat4x4') {
			componentNumber = 16;
		} else {
			// unknown type
			componentNumber = 0;
			console.error('Utility._componentNumber: detect unknown type');
		}

		return componentNumber;
	}

	static _isIntType(
		type: ShaderConstantValueVarTypeES3 | ShaderAttributeVarType
	) {
		if (
			type === 'int' || type === 'ivec2' || type === 'ivec3' || type === 'ivec4' ||
			type === 'uint' || type === 'uvec2' || type === 'uvec3' || type === 'uvec4'
		) {
			return true;
		} else {
			return false;
		}
	}

	static _isValidComponentCount(type: ShaderConstantValueVarTypeES3, values: number[]) {
		const validComponentCount = Utility._componentNumber(type);
		if (validComponentCount === values.length) {
			return true;
		}
		return false;
	}
}
