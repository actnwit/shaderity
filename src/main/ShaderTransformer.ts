import {ShaderVersion} from '../types/type';

/**
 * This class converts the code property of a shaderity object to the specified format.
 */
export default class ShaderTransformer {
	/**
	 * @private
	 * Translate a GLSL ES3 shader code to a GLSL ES1 shader code
	 */
	static _transformToGLSLES1(
		splittedShaderCode: string[],
		isFragmentShader: boolean,
		embedErrorsInOutput: boolean
	) {
		this.__convertOrInsertVersionGLSLES1(splittedShaderCode);
		this.__removeES3Qualifier(splittedShaderCode, embedErrorsInOutput);
		this.__convertIn(splittedShaderCode, isFragmentShader);
		this.__convertOut(splittedShaderCode, isFragmentShader, embedErrorsInOutput);
		this.__removePrecisionForES3(splittedShaderCode);
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
	static _transformTo(
		version: ShaderVersion,
		splittedShaderCode: string[],
		isFragmentShader: boolean,
		embedErrorsInOutput: boolean
	) {
		if (version.match(/webgl2|es3/i)) {
			return this._transformToGLSLES3(splittedShaderCode, isFragmentShader);
		} else if (version.match(/webgl1|es1/i)) {
			return this._transformToGLSLES1(splittedShaderCode, isFragmentShader, embedErrorsInOutput);
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
		const reg = /^(?![\/])[\t ]*#[\t ]*version[\t ]+.*/;
		this.__removeFirstMatchingLine(splittedShaderCode, reg);

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
		const reg = /^(?![\/])[\t ]*#[\t ]*version[\t ]+.*/;
		this.__removeFirstMatchingLine(splittedShaderCode, reg);

		splittedShaderCode.unshift('#define GLSL_ES3');
		splittedShaderCode.unshift('#version 300 es');
	}

	/**
	 * @private
	 * Find the 'in' qualifier in the shader code and replace it with the GLSL ES1 qualifier('attribute' or 'varying')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertIn(splittedShaderCode: string[], isFragmentShader: boolean) {
		const reg = /^(?![\/])[\t ]*in[\t ]+((highp|mediump|lowp|)[\t ]*\w+[\t ]*\w+[\t ]*;)/;

		let replaceFunc;
		if (isFragmentShader) {
			replaceFunc = function (match: string, p1: string) {
				return 'varying ' + p1;
			}
		} else {
			replaceFunc = function (match: string, p1: string) {
				return 'attribute ' + p1;
			}
		}

		this.__replaceLine(splittedShaderCode, reg, replaceFunc);
	}

	/**
	 * @private
	 * Find the "out" qualifier in the shader code and modify the shader code.
	 * If the shader stage is vertex, the "out" qualifiers will be replaced by "varying" qualifier.
	 * If the shader stage is fragment and the shader has "out" qualifiers, the "out" qualifiers will
	 * be deleted and the variable is used to assign a value to gl_FragColor.
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertOut(splittedShaderCode: string[], isFragmentShader: boolean, embedErrorsInOutput: boolean) {
		if (isFragmentShader) {
			this.__removeOutKeywordAndAddGLFragColor(splittedShaderCode, embedErrorsInOutput);
		} else {
			const reg = /^(?![\/])[\t ]*out[\t ]+((highp|mediump|lowp|)[\t ]*\w+[\t ]*\w+[\t ]*;)/;
			const replaceFunc = function (match: string, p1: string) {
				return 'varying ' + p1;
			}
			this.__replaceLine(splittedShaderCode, reg, replaceFunc);
		}
	}

	/**
	 * @private
	 * This method is a part of __convertOut method.
	 * This method deletes the "out" qualifiers and adds the line for assigning to gl_FragColor.
	 * If the shader does not have the "out" qualifiers, this method does nothing.
	 */

	private static __removeOutKeywordAndAddGLFragColor(splittedShaderCode: string[], embedErrorsInOutput: boolean) {
		const reg = /^(?![\/])[\t ]*out[\t ]+((highp|mediump|lowp|)[\t ]*\w+[\t ]*(\w+)[\t ]*;)/;

		let variableName: string | undefined;
		for (let i = 0; i < splittedShaderCode.length; i++) {
			const match = splittedShaderCode[i].match(reg);
			if (match) {
				splittedShaderCode[i] = match[1];
				variableName = match[3];
				break;
			}
		}

		if (variableName == null) {
			// no out variable in the shader
			return;
		}

		const closeBracketReg = /(.*)\}[\n\t ]*$/;

		for (let i = splittedShaderCode.length - 1; i >= 0; i--) {
			const line = splittedShaderCode[i];
			if (line.match(closeBracketReg)) {
				const fragColorCode = `  gl_FragColor = ${variableName};`;
				splittedShaderCode[i] = line.replace(closeBracketReg, `$1\n${fragColorCode}\n}\n`);
				return;
			}
		}

		const errorMessage = '__removeOutKeywordAndAddGLFragColor: Not found the closing brackets for the main function';
		this.__outError(splittedShaderCode, splittedShaderCode.length, errorMessage, embedErrorsInOutput);
	}

	/**
	 * @private
	 * Find the qualifier for es3 only in the shader code and remove it
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __removeES3Qualifier(splittedShaderCode: string[], embedErrorsInOutput: boolean) {
		this.__removeVaryingQualifier(splittedShaderCode, embedErrorsInOutput);
		this.__removeLayout(splittedShaderCode);
	}

	/**
	 * @private
	 * Find the "flat" and "smooth" qualifier in the shader code and remove it
	 */
	private static __removeVaryingQualifier(splittedShaderCode: string[], embedErrorsInOutput: boolean) {
		const reg = /^(?![\/])[\t ]*(flat|smooth)[\t ]*((in|out)[\t ]+.*)/;
		const errorMessage = '__removeVaryingQualifier: glsl es1 does not support flat qualifier';

		for (let i = 0; i < splittedShaderCode.length; i++) {
			splittedShaderCode[i] = splittedShaderCode[i].replace(reg, (match: string, p1: string, p2: string) => {
				if (p1 === 'flat') {
					this.__outError(splittedShaderCode, i + 1, errorMessage, embedErrorsInOutput);
					return match;
				}
				return p2;
			});
		}
	}

	/**
	 * @private
	 * Find the "layout" qualifier in the shader code and remove it
	 */
	private static __removeLayout(splittedShaderCode: string[]) {
		const reg = /^(?![\/])[\t ]*layout[\t ]*\([\t ]*location[\t ]*\=[\t ]*\d[\t ]*\)[\t ]+/g;
		this.__replaceLine(splittedShaderCode, reg, '');
	}

	/**
	 * @private
	 * Find the "precision" qualifier in the shader code and remove it if the "precision" qualifier is valid for only GLSL ES3
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __removePrecisionForES3(splittedShaderCode: string[]) {
		const reg = /^(?![\/])[\t ]*precision[\t ]+(highp|mediump|lowp)[\t ]+(\w+)[\t ]*;/;

		for (let i = 0; i < splittedShaderCode.length; i++) {
			const match = splittedShaderCode[i].match(reg);
			if (match != null) {
				if (
					match[2] === 'int' ||
					match[2] === 'float' ||
					match[2] === 'sampler2D' ||
					match[2] === 'samplerCube'
				) {
					// these precisions are supported in es1
					continue;
				} else {
					splittedShaderCode.splice(i--, 1);
				}
			}
		}
	}

	/**
	 * @private
	 * Find the "texture" and "textureProj" method in the shader code and
	 * replace it with the GLSL ES1 method('texture2D', 'texture2D', and so on)
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTextureFunctionToES1(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const regTextureProj = new RegExp(`(${sbl}+)textureProj(Lod|)(${sbl}+)`, 'g');
		const regTexture = new RegExp(`(${sbl}+)texture(Lod|)(${sbl}+)`, 'g');

		let argumentSamplerMap: Map<string, string> | undefined;
		const uniformSamplerMap = this.__createUniformSamplerMap(splittedShaderCode);
		for (let i = 0; i < splittedShaderCode.length; i++) {
			const line = splittedShaderCode[i];

			const matchTextureProj = line.match(/textureProj(Lod|)[\t ]*\([\t ]*(\w+),/);
			if (matchTextureProj) {
				argumentSamplerMap = argumentSamplerMap ?? this.__createArgumentSamplerMap(splittedShaderCode, i);

				const variableName = matchTextureProj[2];
				const samplerType = argumentSamplerMap?.get(variableName) ?? uniformSamplerMap.get(variableName);
				if (samplerType != null) {
					let textureFunc: string;
					if (samplerType === 'sampler2D') {
						textureFunc = 'texture2DProj';
					} else {
						textureFunc = '';
						console.error('__convertTextureFunctionToES1: do not support ' + samplerType + ' type');
					}

					if (textureFunc !== '') {
						splittedShaderCode[i] = splittedShaderCode[i].replace(regTextureProj, '$1' + textureFunc + '$2$3');
					}
				}
				continue;
			}


			const matchTexture = line.match(/texture(Lod|)[\t ]*\([\t ]*(\w+),/);
			if (matchTexture) {
				argumentSamplerMap = argumentSamplerMap ?? this.__createArgumentSamplerMap(splittedShaderCode, i);

				const variableName = matchTexture[2];
				const samplerType = argumentSamplerMap?.get(variableName) ?? uniformSamplerMap.get(variableName);
				if (samplerType != null) {
					let textureFunc: string;
					if (samplerType === 'sampler2D') {
						textureFunc = 'texture2D';
					} else if (samplerType === 'samplerCube') {
						textureFunc = 'textureCube';
					} else {
						textureFunc = '';
						console.error('__convertTextureFunctionToES1: do not support ' + samplerType + ' type');
					}

					if (textureFunc !== '') {
						splittedShaderCode[i] = splittedShaderCode[i].replace(regTexture, '$1' + textureFunc + '$2$3');
					}
				}
				continue;
			}

			const isBlockEnd = !!line.match(/\}/);
			if (isBlockEnd) {
				argumentSamplerMap = undefined;
			}
		}
	}

	/**
	 * @private
	 * This method finds uniform declarations of sampler types in the shader and
	 * creates a map with variable names as keys and types as values.
	 */
	private static __createUniformSamplerMap(splittedShaderCode: string[]) {
		const uniformSamplerMap: Map<string, string> = new Map();

		for (const line of splittedShaderCode) {
			const match = line.match(/^(?![\/])[\t ]*uniform*[\t ]*(highp|mediump|lowp|)[\t ]*(sampler\w+)[\t ]+(\w+)/);
			if (match) {
				const samplerType = match[2];
				const name = match[3];
				if (uniformSamplerMap.get(name)) {
					console.error('__createUniformSamplerMap: duplicate variable name');
				}
				uniformSamplerMap.set(name, samplerType);
			}
		}
		return uniformSamplerMap;
	}

	/**
	 * @private
	 * This method finds sampler types from the function arguments and
	 * creates a map with variable names as keys and types as values.
	 */
	private static __createArgumentSamplerMap(splittedShaderCode: string[], lineIndex: number) {
		const argumentSamplerMap: Map<string, string> = new Map();

		for (let i = lineIndex; i >= 0; i--) {
			const line = splittedShaderCode[i];

			const isBlockStartLine = !!line.match(/\{/);
			if (!isBlockStartLine) {
				continue;
			}

			const bracketSectionCode = this.__getBracketSection(splittedShaderCode, i);

			const innerBracketSectionCode = bracketSectionCode.match(/.*\((.*)\)/)?.[1];
			if (innerBracketSectionCode == null) {
				return;
			}

			const variableCandidates = innerBracketSectionCode.split(',');
			const samplerTypeDefinitionReg = /[\n\t ]*(highp|mediump|lowp|)[\n\t ]*(sampler\w+)[\n\t ]*(\w+)[\n\t ]*/;

			const isFunctionBracket = !!(variableCandidates[0].match(samplerTypeDefinitionReg) ?? variableCandidates[0].match(/^[\n\t ]*$/));
			if (!isFunctionBracket) {
				continue;
			}

			for (const variableCandidate of variableCandidates) {
				const samplerVariableMatch = variableCandidate.match(samplerTypeDefinitionReg);
				if (samplerVariableMatch == null) {
					continue;
				}
				const samplerType = samplerVariableMatch[2];
				const name = samplerVariableMatch[3];
				if (argumentSamplerMap.get(name)) {
					console.error('__createArgumentSamplerMap: duplicate variable name');
				}
				argumentSamplerMap.set(name, samplerType);
			}

			break;
		}

		return argumentSamplerMap;
	}

	/**
	 * @private
	 * This method returns the part enclosed in brackets(= '()').
	 * For example, you can get lines that contain function arguments, conditional expressions for if statements, etc.
	 */
	private static __getBracketSection(splittedShaderCode: string[], bracketEndIndex: number) {
		let bracketStartIndex = 0;
		for (let j = bracketEndIndex; j >= 0; j--) {
			const line = splittedShaderCode[j];
			const isBracketStartMatch = !!line.match(/\(/);
			if (isBracketStartMatch) {
				bracketStartIndex = j;
				break;
			}
		}

		let containBracketCode = '';
		for (let j = bracketStartIndex; j <= bracketEndIndex; j++) {
			containBracketCode += splittedShaderCode[j];
		}

		return containBracketCode;
	}

	/**
	 * @private
	 * Find the 'attribute' qualifier in the vertex shader code and replace it with the GLSL ES3 qualifier('in')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertAttribute(splittedShaderCode: string[], isFragmentShader: boolean) {
		if (isFragmentShader) {
			return;
		}

		const reg = /^(?![\/])[\t ]*attribute[\t ]+/g;
		const replaceStr = 'in ';

		this.__replaceLine(splittedShaderCode, reg, replaceStr);
	}

	/**
	 * @private
	 * Find the 'varying' qualifier in the shader code and replace it with the GLSL ES3 qualifier('in' or 'out')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertVarying(splittedShaderCode: string[], isFragmentShader: boolean) {
		const reg = /^(?![\/])[\t ]*varying[\t ]+/g;
		const replaceStr = isFragmentShader ? 'in ' : 'out ';

		this.__replaceLine(splittedShaderCode, reg, replaceStr);
	}

	/**
	 * @private
	 * Find the 'textureCube' method in the shader code and replace it with the GLSL ES3 method('texture')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTextureCube(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(textureCube)(${sbl}+)`, 'g');
		const replaceStr = 'texture';

		this.__replaceLine(splittedShaderCode, reg, '$1' + replaceStr + '$3');
	}

	/**
	 * @private
	 * Find the 'texture2D' method in the shader code and replace it with the GLSL ES3 method('texture')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTexture2D(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture2D)(${sbl}+)`, 'g');
		const replaceStr = 'texture';

		this.__replaceLine(splittedShaderCode, reg, '$1' + replaceStr + '$3');
	}

	/**
	 * @private
	 * Find the 'texture2DProj' method in the shader code and replace it with the GLSL ES3 method('textureProj')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTexture2DProd(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture2DProj)(${sbl}+)`, 'g');
		const replaceStr = 'textureProj';

		this.__replaceLine(splittedShaderCode, reg, '$1' + replaceStr + '$3');
	}

	/**
	 * @private
	 * Find the 'texture3D' method in the shader code and replace it with the GLSL ES3 method('texture')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTexture3D(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture3D)(${sbl}+)`, 'g');
		const replaceStr = 'texture';

		this.__replaceLine(splittedShaderCode, reg, '$1' + replaceStr + '$3');
	}

	/**
	 * @private
	 * Find the 'texture3DProj' method in the shader code and replace it with the GLSL ES3 method('textureProj')
	 * This method directly replace the elements of the splittedShaderCode variable.
	 */
	private static __convertTexture3DProd(splittedShaderCode: string[]) {
		const sbl = this.__regSymbols();
		const reg = new RegExp(`(${sbl}+)(texture3DProj)(${sbl}+)`, 'g');
		const replaceStr = 'textureProj';

		this.__replaceLine(splittedShaderCode, reg, '$1' + replaceStr + '$3');
	}

	private static __regSymbols() {
		return `[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^` + '`{|}~\t\n ]';
	}

	private static __replaceLine(splittedShaderCode: string[], reg: RegExp, replacement: any) {
		for (let i = 0; i < splittedShaderCode.length; i++) {
			splittedShaderCode[i] = splittedShaderCode[i].replace(reg, replacement);
		}
	}

	private static __removeFirstMatchingLine(splittedShaderCode: string[], reg: RegExp) {
		for (let i = 0; i < splittedShaderCode.length; i++) {
			if (splittedShaderCode[i].match(reg)) {
				splittedShaderCode.splice(i, 1);
				break;
			}
		}
	}

	private static __outError(
		splittedShaderCode: string[],
		lineIndex: number,
		errorMessage: string,
		embedErrorsInOutput: boolean
	) {
		if (embedErrorsInOutput) {
			const shaderOutputMessage = `// line ${lineIndex}: ${errorMessage}\n`;
			const closeBracketReg = /(.*)\}[\n\t ]*$/;
			for (let i = splittedShaderCode.length - 1; i >= 0; i--) {
				const line = splittedShaderCode[i];
				if (line.match(closeBracketReg)) {
					break;
				}

				if (splittedShaderCode[i] === shaderOutputMessage) {
					// avoid duplicate error message
					return;
				}
			}

			console.error(errorMessage);
			splittedShaderCode.push(shaderOutputMessage);
		} else {
			throw new Error(errorMessage);
		}
	}
}
