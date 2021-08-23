import {ShaderVersion} from '../types/type';

/**
 * This class converts the code property of a shaderity object to the specified format.
 */
export default class ShaderTransformer {
	/**
	 * @private
	 * Translate a GLSL ES3 shader code to a GLSL ES1 shader code
	 */
	static _transformToGLSLES1(splittedShaderCode: string[], isFragmentShader: boolean) {
		this.__convertOrInsertVersionGLSLES1(splittedShaderCode);
		this.__convertIn(splittedShaderCode, isFragmentShader);
		this.__convertOut(splittedShaderCode);
		this.__removeLayout(splittedShaderCode);
		this.__convertTextureFunctionToES1(splittedShaderCode);
		const transformedSplittedShaderCode = splittedShaderCode;

		return transformedSplittedShaderCode;
	}

	/**
	 * @private
	 * Translate a GLSL ES1 shader code to a GLSL ES3 shader code
	 */
	static _transformToGLSLES3(splittedShaderCode: string[], isFragmentShader: boolean) {
		this.__convertOrInsertVersionGLSLES3(splittedShaderCode);
		this.__convertAttribute(splittedShaderCode, isFragmentShader);
		this.__convertVarying(splittedShaderCode, isFragmentShader);
		this.__convertTextureCube(splittedShaderCode);
		this.__convertTexture2D(splittedShaderCode);
		this.__convertTexture2DProd(splittedShaderCode);
		this.__convertTexture3D(splittedShaderCode);
		this.__convertTexture3DProd(splittedShaderCode);
		const transformedSplittedShaderCode = splittedShaderCode;

		return transformedSplittedShaderCode;
	}

	/**
	 * @private
	 * Translate a GLSL shader code to a shader code of specified GLSL version
	 */
	static _transformTo(version: ShaderVersion, splittedShaderCode: string[], isFragmentShader: boolean) {
		if (version.match(/webgl2|es3/i)) {
			return this._transformToGLSLES3(splittedShaderCode, isFragmentShader);
		} else if (version.match(/webgl1|es1/i)) {
			return this._transformToGLSLES1(splittedShaderCode, isFragmentShader);
		} else {
			console.error('Invalid Version')
			return splittedShaderCode;
		}
	}

	/**
	 * @private
	 * If the first line contains version information, overwrite the first line with '#version 100'.
	 * If not, add '#version 100' to the first line.
	 *
	 * Note: If the first line is commented out and the version information is written in the second or later line,
	 * the appropriate version information will be added to the first line and the user-defined version information
	 * in the second or later line will be removed.
	 */
	private static __convertOrInsertVersionGLSLES1(splittedShaderCode: string[]) {
		const inReg = /^(?![\/])[\t ]*#[\t ]*version[\t ]+.*/;
		this.__removeFirstMatchingLine(splittedShaderCode, inReg);

		splittedShaderCode.unshift('#version 100');
	}

	/**
	 * @private
	 * If the first line contains version information, overwrite the first line with '#version 300 es'.
	 * If not, add '#version 300 es' to the first line.
	 * In both cases, '#define GLSL_ES3' will be inserted in the second line.
	 * Use the '#define GLSL_ES3' directive if you want to write a shader code that will only run in the case of webgl2.
	 *
   * Note: If the first line is commented out and the version information is written in the second or later line,
	 * the appropriate version information will be added to the first line and the user-defined version information
	 * in the second or later line will be removed.
	 */
	private static __convertOrInsertVersionGLSLES3(splittedShaderCode: string[]) {
		const inReg = /^(?![\/])[\t ]*#[\t ]*version[\t ]+.*/;
		this.__removeFirstMatchingLine(splittedShaderCode, inReg);

		splittedShaderCode.unshift('#define GLSL_ES3');
		splittedShaderCode.unshift('#version 300 es');
	}

	/**
	 * @private
	 * Find the 'in' modifier in the shader code and replace it with the GLSL ES1 modifier('attribute' or 'varying')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertIn(splittedShaderCode: string[], isFragmentShader: boolean) {
		const inReg = /^(?![\/])[\t ]*in[\t ]+(\w+[\t ]*\w+[\t ]*;)/;

		// inAsES1 is used as the second argument to the String.prototype.replace method.
		let inAsES1;
		if (isFragmentShader) {
			inAsES1 = function (match: string, p1: string) {
				return 'varying ' + p1;
			}
		} else {
			inAsES1 = function (match: string, p1: string) {
				return 'attribute ' + p1;
			}
		}

		this.__replaceLine(splittedShaderCode, inReg, inAsES1);
	}

	/**
	 * @private
	 * Find the "out" modifier in the shader code and replace it with the GLSL ES1 modifier('varying')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertOut(splittedShaderCode: string[]) {
		const inReg = /^(?![\/])[\t ]*out[\t ]+(\w+[\t ]*\w+[\t ]*;)/;
		const inAsES1 = function (match: string, p1: string) {
			return 'varying ' + p1;
		}

		this.__replaceLine(splittedShaderCode, inReg, inAsES1);
	}

	/**
	 * @private
	 * Find the "layout" modifier in the shader code and remove it
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __removeLayout(splittedShaderCode: string[]) {
		const inReg = /^(?![\/])[\t ]*layout[\t ]*\([\t ]*location[\t ]*\=[\t ]*\d[\t ]*\)[\t ]+/g;
		this.__replaceLine(splittedShaderCode, inReg, '');
	}

	/**
	 * @private
	 * Find the "texture" and "textureProj" method in the shader code and
	 * replace it with the GLSL ES1 method('texture2D', 'texture2D', and so on)
	 * This method directly replace the elements of the splittedShaderCode variable.
	 *
	 * TODO: fix algorithm of type inference
	 */
	private static __convertTextureFunctionToES1(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();

		for (let i = 0; i < splittedShaderCode.length; i++) {
			const line = splittedShaderCode[i];

			let reg = new RegExp(`(${sbl}+)(textureProj)(${sbl}+)`, 'g');
			let match = line.match(/textureProj[\t ]*\([\t ]*(\w+),/);
			if (match) {
				const name = match[1];
				const uniformSamplerMap = this.__createUniformSamplerMap(splittedShaderCode, i);
				const samplerType = uniformSamplerMap.get(name);
				if (samplerType != null) {
					let textureFunc: string;
					switch (samplerType) {
						case 'sampler2D':
							textureFunc = 'texture2DProj';
							break;
						case 'sampler3D':
							textureFunc = 'texture3DProj';
							break;
						default:
							textureFunc = '';
							console.log('not found');
					}
					splittedShaderCode[i] = splittedShaderCode[i].replace(reg, '$1' + textureFunc + '$3');
				}
				continue;
			}

			reg = new RegExp(`(${sbl}+)(texture)(${sbl}+)`, 'g');
			match = line.match(/texture[\t ]*\([\t ]*(\w+),/);
			if (match) {
				const name = match[1];
				const uniformSamplerMap = this.__createUniformSamplerMap(splittedShaderCode, i);
				const samplerType = uniformSamplerMap.get(name);
				if (samplerType != null) {
					let textureFunc: string;
					switch (samplerType) {
						case 'sampler2D':
							textureFunc = 'texture2D';
							break;
						case 'sampler3D':
							textureFunc = 'texture3D';
							break;
						case 'samplerCube':
							textureFunc = 'textureCube';
							break;
						default:
							textureFunc = '';
							console.log('not found');
					}
					splittedShaderCode[i] = splittedShaderCode[i].replace(reg, '$1' + textureFunc + '$3');
				}
			}
		}
	}

	private static __createUniformSamplerMap(splittedShaderCode: string[], line_i: number) {
		const uniformSamplerMap = new Map();

		for (let i = 0; i < line_i; i++) {
			const line = splittedShaderCode[i];
			const match = line.match(/^(?![\/])[\t ]*\w*[\t ]*(sampler\w+)[\t ]+(\w+)/);
			if (match) {
				const samplerType = match[1];
				const name = match[2];
				uniformSamplerMap.set(name, samplerType);
			}
		}
		return uniformSamplerMap;
	}

	/**
	 * @private
	 * Find the 'attribute' modifier in the vertex shader code and replace it with the GLSL ES3 modifier('in')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertAttribute(splittedShaderCode: string[], isFragmentShader: boolean) {
		if (isFragmentShader) {
			return;
		}

		const inReg = /^(?![\/])[\t ]*attribute[\t ]+/g;
		const inAsES3 = 'in ';

		this.__replaceLine(splittedShaderCode, inReg, inAsES3);
	}

	/**
	 * @private
	 * Find the 'varying' modifier in the shader code and replace it with the GLSL ES3 modifier('in' or 'out')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertVarying(splittedShaderCode: string[], isFragmentShader: boolean) {
		const inReg = /^(?![\/])[\t ]*varying[\t ]+/g;
		const inAsES3 = isFragmentShader ? 'in ' : 'out ';

		this.__replaceLine(splittedShaderCode, inReg, inAsES3);
	}

	/**
	 * @private
	 * Find the 'textureCube' method in the shader code and replace it with the GLSL ES3 method('texture')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTextureCube(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(textureCube)(${sbl}+)`, 'g');
		const inAsES3 = 'texture';

		this.__replaceLine(splittedShaderCode, reg, '$1' + inAsES3 + '$3');
	}

	/**
	 * @private
	 * Find the 'texture2D' method in the shader code and replace it with the GLSL ES3 method('texture')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTexture2D(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture2D)(${sbl}+)`, 'g');
		const inAsES3 = 'texture';

		this.__replaceLine(splittedShaderCode, reg, '$1' + inAsES3 + '$3');
	}

	/**
	 * @private
	 * Find the 'texture2DProj' method in the shader code and replace it with the GLSL ES3 method('textureProj')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTexture2DProd(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture2DProj)(${sbl}+)`, 'g');
		const inAsES3 = 'textureProj';

		this.__replaceLine(splittedShaderCode, reg, '$1' + inAsES3 + '$3');
	}

	/**
	 * @private
	 * Find the 'texture3D' method in the shader code and replace it with the GLSL ES3 method('texture')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTexture3D(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture3D)(${sbl}+)`, 'g');
		const inAsES3 = 'texture';

		this.__replaceLine(splittedShaderCode, reg, '$1' + inAsES3 + '$3');
	}

	/**
	 * @private
	 * Find the 'texture3DProj' method in the shader code and replace it with the GLSL ES3 method('textureProj')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTexture3DProd(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture3DProj)(${sbl}+)`, 'g');
		const inAsES3 = 'textureProj';

		this.__replaceLine(splittedShaderCode, reg, '$1' + inAsES3 + '$3');
	}

	private static __regSymbols() {
		return `[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^` + '`{|}~\t\n ]';
	}

	private static __replaceLine(splittedShaderCode: string[], inReg: RegExp, inAsES1: any) {
		for (let i = 0; i < splittedShaderCode.length; i++) {
			splittedShaderCode[i] = splittedShaderCode[i].replace(inReg, inAsES1);
		}
	}

	private static __removeFirstMatchingLine(splittedShaderCode: string[], inReg: RegExp) {
		for (let i = 0; i < splittedShaderCode.length; i++) {
			if (splittedShaderCode[i].match(inReg)) {
				splittedShaderCode.splice(i, 1);
				break;
			}
		}
	}
}