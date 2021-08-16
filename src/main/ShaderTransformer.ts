export default class ShaderTransformer {
	static _transformToGLSLES1(splittedShaderCode: string[], isFragmentShader: boolean) {
		this.__convertIn(splittedShaderCode, isFragmentShader);
		this.__convertOut(splittedShaderCode);
		this.__removeLayout(splittedShaderCode);
		this.__convertTextureFunctionToES1(splittedShaderCode);
		const transformedSplittedShaderCode = splittedShaderCode;

		return transformedSplittedShaderCode;
	}

	static _transformToGLSLES3(splittedShaderCode: string[], isFragmentShader: boolean) {
		this.__convertAttribute(splittedShaderCode, isFragmentShader);
		this.__convertVarying(splittedShaderCode, isFragmentShader);
		this.__convertTexture2D(splittedShaderCode);
		this.__convertTextureCube(splittedShaderCode);
		this.__convertTexture2DProd(splittedShaderCode);
		const transformedSplittedShaderCode = splittedShaderCode;

		return transformedSplittedShaderCode;
	}

	static _transformTo(version: string, splittedShaderCode: string[], isFragmentShader: boolean) {
		if (version.match(/webgl2|es3/i)) {
			return this._transformToGLSLES3(splittedShaderCode, isFragmentShader);
		} else if (version.match(/webgl1|es1/i)) {
			return this._transformToGLSLES1(splittedShaderCode, isFragmentShader);
		} else {
			console.error('Invalid Version')
			return splittedShaderCode;
		}
	}

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

		this.__replaceRow(splittedShaderCode, inReg, inAsES1);
	}


	private static __convertOut(splittedShaderCode: string[]) {
		const inReg = /^(?![\/])[\t ]*out[\t ]+(\w+[\t ]*\w+[\t ]*;)/;
		const inAsES1 = function (match: string, p1: string) {
			return 'varying ' + p1;
		}

		this.__replaceRow(splittedShaderCode, inReg, inAsES1);
	}

	private static __removeLayout(splittedShaderCode: string[]) {
		const inReg = /^(?![\/])[\t ]*layout[\t ]*\([\t ]*location[\t ]*\=[\t ]*\d[\t ]*\)[\t ]+/g;
		this.__replaceRow(splittedShaderCode, inReg, '');
	}

	private static __convertTextureFunctionToES1(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();

		for (let i = 0; i < splittedShaderCode.length; i++) {
			const row = splittedShaderCode[i];

			let reg = new RegExp(`(${sbl}+)(textureProj)(${sbl}+)`, 'g');
			let match = row.match(/textureProj[\t ]*\([\t ]*(\w+),/);
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
			match = row.match(/texture[\t ]*\([\t ]*(\w+),/);
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

	private static __createUniformSamplerMap(splittedShaderCode: string[], row_i: number) {
		const uniformSamplerMap = new Map();

		for (let i = 0; i < row_i; i++) {
			const row = splittedShaderCode[i];
			const match = row.match(/^(?![\/])[\t ]*\w*[\t ]*(sampler\w+)[\t ]+(\w+)/);
			if (match) {
				const samplerType = match[1];
				const name = match[2];
				uniformSamplerMap.set(name, samplerType);
			}
		}
		return uniformSamplerMap;
	}

	private static __convertAttribute(splittedShaderCode: string[], isFragmentShader: boolean) {
		if (isFragmentShader) {
			return;
		}

		const inReg = /^(?![\/])[\t ]*attribute[\t ]+/g;
		const inAsES3 = 'in ';

		this.__replaceRow(splittedShaderCode, inReg, inAsES3);
	}

	private static __convertVarying(splittedShaderCode: string[], isFragmentShader: boolean) {
		const inReg = /^(?![\/])[\t ]*varying[\t ]+/g;
		const inAsES3 = isFragmentShader ? 'in ' : 'out ';

		this.__replaceRow(splittedShaderCode, inReg, inAsES3);
	}

	private static __convertTextureCube(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(textureCube)(${sbl}+)`, 'g');
		const inAsES3 = 'texture';

		this.__replaceRow(splittedShaderCode, reg, '$1' + inAsES3 + '$3');
	}

	private static __convertTexture2D(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture2D)(${sbl}+)`, 'g');
		const inAsES3 = 'texture';

		this.__replaceRow(splittedShaderCode, reg, '$1' + inAsES3 + '$3');
	}

	private static __convertTexture2DProd(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture2DProj)(${sbl}+)`, 'g');
		const inAsES3 = 'textureProj';

		this.__replaceRow(splittedShaderCode, reg, '$1' + inAsES3 + '$3');
	}

	private static __regSymbols() {
		return `[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^` + '`{|}~\t\n ]';
	}

	private static __replaceRow(splittedShaderCode: string[], inReg: RegExp, inAsES1: any) {
		for (let i = 0; i < splittedShaderCode.length; i++) {
			splittedShaderCode[i] = splittedShaderCode[i].replace(inReg, inAsES1);
		}
	}
}