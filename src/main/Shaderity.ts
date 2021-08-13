import Reflection from './Reflection';
import {ShaderityObject} from '../types/type';

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

	private _replaceRow(inout_splitedSource: string[], inReg: RegExp, inAsES1: any) {
		for (let i = 0; i < inout_splitedSource.length; i++) {
			inout_splitedSource[i] = inout_splitedSource[i].replace(inReg, inAsES1);
		}
	}

	private _convertIn(obj: ShaderityObject, inout_splitedSource: string[]) {
		const inReg = /^(?![\/])[\t ]*in[\t ]+(\w+[\t ]*\w+[\t ]*;)/;
		let inAsES1 = function (match: string, p1: string) {
			return 'attribute ' + p1;
		}
		if (this.isFragmentShader(obj)) {
			inAsES1 = function (match: string, p1: string) {
				return 'varying ' + p1;
			}
		}

		this._replaceRow(inout_splitedSource, inReg, inAsES1);

		return inout_splitedSource;
	}


	private _convertOut(obj: ShaderityObject, inout_splitedSource: string[]) {
		const inReg = /^(?![\/])[\t ]*out[\t ]+(\w+[\t ]*\w+[\t ]*;)/;
		let inAsES1 = function (match: string, p1: string) {
			return 'varying ' + p1;
		}

		this._replaceRow(inout_splitedSource, inReg, inAsES1);

		return inout_splitedSource;
	}

	private _createUniformSamplerMap(inout_splitedSource: string[], row_i: number) {
		const uniformSamplerMap = new Map();

		for (let i = 0; i < row_i; i++) {
			const row = inout_splitedSource[i];
			const match = row.match(/^(?![\/])[\t ]*\w*[\t ]*(sampler\w+)[\t ]+(\w+)/);
			if (match) {
				const samplerType = match[1];
				const name = match[2];
				uniformSamplerMap.set(name, samplerType);
			}
		}
		return uniformSamplerMap;
	}

	private _convertAttribute(obj: ShaderityObject, inout_splitedSource: string[]) {
		const inReg = /^(?![\/])[\t ]*attribute[\t ]+/g;
		let inAsES3 = 'in ';

		this._replaceRow(inout_splitedSource, inReg, inAsES3);

		return inout_splitedSource;
	}

	private _convertVarying(obj: ShaderityObject, inout_splitedSource: string[]) {
		const inReg = /^(?![\/])[\t ]*varying[\t ]+/g;
		let inAsES3 = 'out ';

		if (this.isFragmentShader(obj)) {
			inAsES3 = 'in ';
		}

		this._replaceRow(inout_splitedSource, inReg, inAsES3);

		return inout_splitedSource;
	}

	private _removeLayout(obj: ShaderityObject, inout_splitedSource: string[]) {
		const inReg = /^(?![\/])[\t ]*layout[\t ]*\([\t ]*location[\t ]*\=[\t ]*\d[\t ]*\)[\t ]+/g;
		this._replaceRow(inout_splitedSource, inReg, '');

		return inout_splitedSource;
	}

	private _regSymbols() {
		return `[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^` + '`{|}~\t\n ]';
	}

	private _convertTexture2D(obj: ShaderityObject, inout_splitedSource: string[]) {
		const sbl = this._regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture2D)(${sbl}+)`, 'g');
		let inAsES3 = 'texture';

		this._replaceRow(inout_splitedSource, reg, '$1' + inAsES3 + '$3');

		return inout_splitedSource;
	}

	private _convertTextureCube(obj: ShaderityObject, inout_splitedSource: string[]) {
		const sbl = this._regSymbols();
		const reg = new RegExp(`(${sbl}+)(textureCube)(${sbl}+)`, 'g');
		let inAsES3 = 'texture';

		this._replaceRow(inout_splitedSource, reg, '$1' + inAsES3 + '$3');

		return inout_splitedSource;
	}

	private _convertTexture2DProd(obj: ShaderityObject, inout_splitedSource: string[]) {
		const sbl = this._regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture2DProj)(${sbl}+)`, 'g');
		let inAsES3 = 'textureProj';

		this._replaceRow(inout_splitedSource, reg, '$1' + inAsES3 + '$3');

		return inout_splitedSource;
	}


	copyShaderityObject(obj: ShaderityObject) {
		const copiedObj: ShaderityObject = {
			code: obj.code,
			shaderStage: obj.shaderStage
		}

		return copiedObj;
	}

	_convertTextureFunctionToES1(inout_splitedSource: string[]) {
		const sbl = this._regSymbols();

		for (let i = 0; i < inout_splitedSource.length; i++) {
			const row = inout_splitedSource[i];

			let reg = new RegExp(`(${sbl}+)(textureProj)(${sbl}+)`, 'g');
			let match = row.match(/textureProj[\t ]*\([\t ]*(\w+),/);
			if (match) {
				const name = match[1];
				const uniformSamplerMap = this._createUniformSamplerMap(inout_splitedSource, i);
				const samplerType = uniformSamplerMap.get(name);
				if (samplerType != null) {
					let textureFunc = '';
					switch (samplerType) {
						case 'sampler2D': textureFunc = 'texture2DProj'; break;
						case 'sampler3D': textureFunc = 'texture3DProj'; break;
						default: console.log('not found');
					}
					inout_splitedSource[i] = inout_splitedSource[i].replace(reg, '$1' + textureFunc + '$3');
				}
				continue;
			}

			reg = new RegExp(`(${sbl}+)(texture)(${sbl}+)`, 'g');
			match = row.match(/texture[\t ]*\([\t ]*(\w+),/);
			if (match) {
				const name = match[1];
				const uniformSamplerMap = this._createUniformSamplerMap(inout_splitedSource, i);
				const samplerType = uniformSamplerMap.get(name);
				if (samplerType != null) {
					let textureFunc = '';
					switch (samplerType) {
						case 'sampler2D': textureFunc = 'texture2D'; break;
						case 'sampler3D': textureFunc = 'texture3D'; break;
						case 'samplerCube': textureFunc = 'textureCube'; break;
						default: console.log('not found');
					}
					inout_splitedSource[i] = inout_splitedSource[i].replace(reg, '$1' + textureFunc + '$3');
				}
			}
		}

		return inout_splitedSource;
	}

	transformToGLSLES1(obj: ShaderityObject) {
		const copy = this.copyShaderityObject(obj);

		let splittedShaderCode = this._splitByLineFeedCode(obj.code);

		this._convertIn(obj, splittedShaderCode);
		this._convertOut(obj, splittedShaderCode);
		this._removeLayout(obj, splittedShaderCode);

		splittedShaderCode = this._convertTextureFunctionToES1(splittedShaderCode);

		copy.code = this._joinSplitedRow(splittedShaderCode);

		return copy;
	}

	transformToGLSLES3(obj: ShaderityObject) {
		const copy = this.copyShaderityObject(obj);

		const splittedShaderCode = this._splitByLineFeedCode(obj.code);

		this._convertAttribute(obj, splittedShaderCode);
		this._convertVarying(obj, splittedShaderCode);
		this._convertTexture2D(obj, splittedShaderCode);
		this._convertTextureCube(obj, splittedShaderCode);
		this._convertTexture2DProd(obj, splittedShaderCode);

		copy.code = this._joinSplitedRow(splittedShaderCode);

		return copy;
	}

	transformTo(version: string, obj: ShaderityObject) {
		if (version.match(/webgl2|es3/i)) {
			return this.transformToGLSLES3(obj);
		} else if (version.match(/webgl1|es1/i)) {
			return this.transformToGLSLES1(obj);
		} else {
			console.error('Invalid Version')
			return obj;
		}
	}

	private _splitByLineFeedCode(source: string) {
		return source.split(/\r\n|\n/);
	}

	private _joinSplitedRow(splitedRow: string[]) {
		return splitedRow.join('\n');
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

		copy.code = this._joinSplitedRow(splittedShaderCode);

		return copy;
	}

	reflect(obj: ShaderityObject): Reflection {
		const splittedShaderCode = this._splitByLineFeedCode(obj.code);
		const shaderStage = obj.shaderStage;

		const reflection = new Reflection(splittedShaderCode, shaderStage);
		reflection.reflect();
		return reflection;
	}

	private _defineGLSLES3() {

	}
}
