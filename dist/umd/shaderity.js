(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Shaderity"] = factory();
	else
		root["Shaderity"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Shaderity_1 = __importDefault(__webpack_require__(/*! ./main/Shaderity */ "./src/main/Shaderity.ts"));
exports["default"] = Shaderity_1.default;


/***/ }),

/***/ "./src/main/PreProcessor.ts":
/*!**********************************!*\
  !*** ./src/main/PreProcessor.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class PreProcessor {
    static evaluateCondition(condition) {
        // 数値比較の正規表現
        const numericComparison = /(\w+)\s*(==|!=|>|<|>=|<=)\s*(\d+)/g;
        // defined()チェックの正規表現
        const definedCheck = /defined\s*\(\s*(\w+)\s*\)/g;
        // !defined()チェックの正規表現
        const notDefinedCheck = /!\s*defined\s*\(\s*(\w+)\s*\)/g;
        // 条件式を評価可能な形式に変換
        let evaluatableCondition = condition;
        // defined()の評価
        evaluatableCondition = evaluatableCondition.replace(definedCheck, (_, name) => {
            return this.definitions.has(name) ? 'true' : 'false';
        });
        // !defined()の評価
        evaluatableCondition = evaluatableCondition.replace(notDefinedCheck, (_, name) => {
            return this.definitions.has(name) ? 'false' : 'true';
        });
        // 数値比較の評価
        evaluatableCondition = evaluatableCondition.replace(numericComparison, (match, varName, operator, valueStr) => {
            const definedValue = this.definitions.get(varName);
            if (definedValue === undefined)
                return 'false';
            const value1 = parseInt(definedValue);
            const value2 = parseInt(valueStr);
            switch (operator) {
                case '==': return value1 === value2 ? 'true' : 'false';
                case '!=': return value1 !== value2 ? 'true' : 'false';
                case '>': return value1 > value2 ? 'true' : 'false';
                case '<': return value1 < value2 ? 'true' : 'false';
                case '>=': return value1 >= value2 ? 'true' : 'false';
                case '<=': return value1 <= value2 ? 'true' : 'false';
                default: return 'false';
            }
        });
        // 論理演算子の評価
        try {
            // 安全な評価のため、条件式を検証
            if (!/^[a-zA-Z0-9\s\(\)!&|]+$/.test(evaluatableCondition)) {
                throw new Error('Invalid condition');
            }
            // 論理演算子の前後にスペースを追加
            evaluatableCondition = evaluatableCondition
                .replace(/&&/g, ' && ')
                .replace(/\|\|/g, ' || ')
                .replace(/!/g, ' ! ')
                .replace(/\s+/g, ' ')
                .trim();
            // JavaScriptの論理式として評価
            return Function(`return ${evaluatableCondition}`)();
        }
        catch (error) {
            console.error('Error evaluating condition:', error);
            return false;
        }
    }
    static process(splittedLines, remainDefine, definitions = [], startLineStr, endLineStr) {
        const define = /#define[\t ]+(\w+)(?:[\t ]+(\S+))?/;
        const ifdef = /#ifdef[\t ]+(\w+)/;
        const ifndef = /#ifndef[\t ]+(\w+)/;
        const _if = /#if(?:\s+|(?=\())(.*)/;
        const elif = /#elif(?:\s+|(?=\())(.*)/;
        const _else = /#else/;
        const endif = /#endif/;
        const previousOutputStates = [];
        let outputFlg = true;
        const ifdefs = [];
        const ifdefMatched = [];
        const outputLines = [];
        this.definitions.clear();
        for (const definition of definitions) {
            this.definitions.set(definition, "1");
        }
        let startLine = 0;
        let endLine = splittedLines.length;
        if (startLineStr) {
            startLine = splittedLines.findIndex(line => line.includes(startLineStr));
            if (startLine === -1) {
                return splittedLines;
            }
        }
        if (endLineStr) {
            endLine = splittedLines.findIndex(line => line.includes(endLineStr));
            if (endLine === -1) {
                return splittedLines;
            }
        }
        for (let i = 0; i < startLine; i++) {
            const line = splittedLines[i];
            outputLines.push(line);
        }
        for (let i = startLine; i < endLine; i++) {
            const line = splittedLines[i];
            let isPragma = false;
            { // #define
                const re = line.match(define);
                if (re != null) {
                    const [_, name, value = "1"] = re;
                    this.definitions.set(name, value);
                    if (!remainDefine) {
                        isPragma = true;
                    }
                }
            }
            { // #ifdef, #ifndef, #if
                const reIfdef = line.match(ifdef);
                const reIfndef = line.match(ifndef);
                const reIf = line.match(_if);
                if (reIfdef || reIfndef || reIf) {
                    previousOutputStates.push(outputFlg);
                    let condition = '';
                    if (reIfdef) {
                        condition = `defined(${reIfdef[1]})`;
                    }
                    else if (reIfndef) {
                        condition = `!defined(${reIfndef[1]})`;
                    }
                    else if (reIf) {
                        condition = reIf[1];
                    }
                    ifdefs.push([condition]);
                    if (outputFlg) {
                        outputFlg = this.evaluateCondition(condition);
                        ifdefMatched.push(outputFlg);
                    }
                    else {
                        ifdefMatched.push(false);
                    }
                    isPragma = true;
                }
            }
            { // #elif
                const re = line.match(elif);
                if (re != null) {
                    const condition = re[1];
                    const currentIfdefs = ifdefs[ifdefs.length - 1];
                    if (previousOutputStates[previousOutputStates.length - 1] && !ifdefMatched[ifdefMatched.length - 1]) {
                        outputFlg = this.evaluateCondition(condition);
                        if (outputFlg) {
                            ifdefMatched[ifdefMatched.length - 1] = true;
                        }
                    }
                    else {
                        outputFlg = false;
                    }
                    currentIfdefs.push(condition);
                    isPragma = true;
                }
            }
            { // #else
                const re = line.match(_else);
                if (re != null) {
                    if (previousOutputStates[previousOutputStates.length - 1]) {
                        outputFlg = !ifdefMatched[ifdefMatched.length - 1];
                    }
                    else {
                        outputFlg = false;
                    }
                    isPragma = true;
                }
            }
            { // #endif
                const re = line.match(endif);
                if (re != null) {
                    outputFlg = previousOutputStates[previousOutputStates.length - 1];
                    isPragma = true;
                    ifdefs.pop();
                    ifdefMatched.pop();
                    previousOutputStates.pop();
                }
            }
            if (outputFlg && !isPragma) {
                outputLines.push(line);
            }
        }
        for (let i = endLine; i < splittedLines.length; i++) {
            const line = splittedLines[i];
            outputLines.push(line);
        }
        return outputLines;
    }
}
PreProcessor.definitions = new Map();
exports["default"] = PreProcessor;


/***/ }),

/***/ "./src/main/Reflection.ts":
/*!********************************!*\
  !*** ./src/main/Reflection.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * This class gets the attribute, varying, and uniform information from the code property of a shaderity object.
 * The methods of the Shaderity instance create an instance of this class.
 *
 * Before getting the information of the attribute, varying, and uniform, you need to call the reflect method of this instance.
 */
class Reflection {
    constructor(splittedShaderityShaderCode, shaderStage) {
        this.__attributeSemanticsMap = new Map();
        this.__uniformSemanticsMap = new Map();
        this.__attributes = [];
        this.__varyings = [];
        this.__uniforms = [];
        this.__splittedShaderCode = splittedShaderityShaderCode;
        this.__shaderStage = shaderStage;
        this.__setDefaultAttributeAndUniformSemanticsMap();
    }
    /**
     * Gets all attribute variable information in the shader code.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of ReflectionAttribute object
     */
    get attributes() {
        return this.__attributes;
    }
    /**
     * Gets all varying variable information in the shader code.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of ReflectionVarying object
     */
    get varyings() {
        return this.__varyings;
    }
    /**
     * Gets all uniform variable information in the shader code.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of ReflectionUniform object
     */
    get uniforms() {
        return this.__uniforms;
    }
    /**
     * Get the names of all attributes included in the shader.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of string
     */
    get attributesNames() {
        return this.__attributes.map((attribute) => { return attribute.name; });
    }
    /**
     * Get the attribute semantic (e.g. 'POSITION') of all attributes included in the shader.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of AttributeSemantics object
     */
    get attributesSemantics() {
        return this.__attributes.map((attribute) => { return attribute.semantic; });
    }
    /**
     * Get the variable type (e.g. 'vec4') of all attributes included in the shader.
     * Before calling this method, you need to call the reflect method of this instance.
     * @returns Array of VarType object
     */
    get attributesTypes() {
        return this.__attributes.map((attribute) => { return attribute.type; });
    }
    /**
     * Add an attributeSemantics.
     * The attributeSemantics is used in the ReflectionAttribute.semantics
     * (See reflect method of this class)
     */
    addAttributeSemanticsMap(map) {
        this.__attributeSemanticsMap = new Map([...this.__attributeSemanticsMap, ...map]);
    }
    /**
     * Add a uniformSemantics.
     * The attributeSemantics is used in the ReflectionAttribute.semantics
     * (See reflect method of this class)
     */
    addUniformSemanticsMap(map) {
        this.__uniformSemanticsMap = new Map([...this.__uniformSemanticsMap, ...map]);
    }
    /**
     * Add an attributeSemantics.
     * The attributeSemantics is used in the ReflectionAttribute.semantics
     * (See reflect method of this class)
     */
    addAttributeSemantics(key, value) {
        this.__attributeSemanticsMap.set(key, value);
    }
    /**
     * Add a uniformSemantics.
     * The attributeSemantics is used in the ReflectionAttribute.semantics
     * (See reflect method of this class)
     */
    addUniformSemantics(key, value) {
        this.__uniformSemanticsMap.set(key, value);
    }
    /**
     * Initialize attributeSemantics
     */
    resetAttributeSemantics() {
        this.__attributeSemanticsMap = new Map();
    }
    /**
     * Initialize uniformSemantics
     */
    resetUniformSemantics() {
        this.__uniformSemanticsMap = new Map();
    }
    /**
     * Analyze shader code of the shaderity and get information of attribute, varying and uniform.
     * The information can be retrieved from the get method of this instance.
     *
     * The semantic property of the ReflectionAttribute is assigned to the value of the semantic if
     * it is specified in the attribute line of the shader code. If not, the AttributeSemanticsMap
     * is searched for matching semantics, or UNKNOWN. The same applies to the semantic property of
     * ReflectionUniform.
     */
    reflect() {
        const splittedShaderCode = this.__splittedShaderCode;
        const shaderStage = this.__shaderStage;
        for (const shaderCodeLine of splittedShaderCode) {
            const isAttributeLine = this.__matchAttribute(shaderCodeLine, shaderStage);
            if (isAttributeLine) {
                this.__addAttribute(shaderCodeLine);
                continue;
            }
            const isVaryingLine = this.__matchVarying(shaderCodeLine, shaderStage);
            if (isVaryingLine) {
                this.__addVarying(shaderCodeLine, shaderStage);
                continue;
            }
            const isUniformLine = shaderCodeLine.match(/^(?![\/])[\t ]*uniform[\t ]+/);
            if (isUniformLine) {
                this.__addUniform(shaderCodeLine);
                continue;
            }
        }
    }
    __setDefaultAttributeAndUniformSemanticsMap() {
        this.__attributeSemanticsMap.set('position', 'POSITION');
        this.__attributeSemanticsMap.set('color$', 'COLOR_0');
        this.__attributeSemanticsMap.set('color_?0', 'COLOR_0');
        this.__attributeSemanticsMap.set('texcoord$', 'TEXCOORD_0');
        this.__attributeSemanticsMap.set('texcoord_?0', 'TEXCOORD_0');
        this.__attributeSemanticsMap.set('texcoord_?1', 'TEXCOORD_1');
        this.__attributeSemanticsMap.set('texcoord_?2', 'TEXCOORD_2');
        this.__attributeSemanticsMap.set('normal', 'NORMAL');
        this.__attributeSemanticsMap.set('tangent', 'TANGENT');
        this.__attributeSemanticsMap.set('joint$', 'JOINTS_0');
        this.__attributeSemanticsMap.set('bone$', 'JOINTS_0');
        this.__attributeSemanticsMap.set('joint_?0', 'JOINTS_0');
        this.__attributeSemanticsMap.set('bone_?0', 'JOINTS_0');
        this.__attributeSemanticsMap.set('weight$', 'WEIGHTS_0');
        this.__attributeSemanticsMap.set('weight_?0', 'WEIGHTS_0');
        this.__uniformSemanticsMap.set('worldmatrix', 'WorldMatrix');
        this.__uniformSemanticsMap.set('normalmatrix', 'NormalMatrix');
        this.__uniformSemanticsMap.set('viewmatrix', 'ViewMatrix');
        this.__uniformSemanticsMap.set('projectionmatrix', 'ProjectionMatrix');
        this.__uniformSemanticsMap.set('modelviewmatrix', 'ModelViewMatrix');
    }
    __matchAttribute(shaderCodeLine, shaderStage) {
        if (shaderStage !== 'vertex') {
            return false;
        }
        return shaderCodeLine.match(/^(?![\/])[\t ]*(attribute|in)[\t ]+.+;/);
    }
    __addAttribute(shaderCodeLine) {
        const reflectionAttribute = {
            name: '',
            type: 'float',
            semantic: 'UNKNOWN'
        };
        const matchType = shaderCodeLine.match(Reflection.attributeAndVaryingTypeRegExp);
        if (matchType) {
            const type = matchType[1];
            reflectionAttribute.type = type;
            const name = matchType[2];
            reflectionAttribute.name = name;
            const matchSemantic = shaderCodeLine.match(Reflection.semanticRegExp);
            if (matchSemantic) {
                reflectionAttribute.semantic = matchSemantic[1];
            }
            else {
                for (let [key, value] of this.__attributeSemanticsMap) {
                    if (name.match(new RegExp(key, 'i'))) {
                        reflectionAttribute.semantic = value;
                    }
                }
            }
        }
        this.__attributes.push(reflectionAttribute);
    }
    __matchVarying(shaderCodeLine, shaderStage) {
        if (shaderStage === 'vertex') {
            return shaderCodeLine.match(/^(?![\/])[\t ]*(varying|out)[\t ]+.+;/);
        }
        else {
            return shaderCodeLine.match(/^(?![\/])[\t ]*(varying|in)[\t ]+.+;/);
        }
    }
    __addVarying(shaderCodeLine, shaderStage) {
        const reflectionVarying = {
            name: '',
            type: 'float',
            inout: 'in'
        };
        const matchType = shaderCodeLine.match(Reflection.attributeAndVaryingTypeRegExp);
        if (matchType) {
            const type = matchType[1];
            reflectionVarying.type = type;
            const name = matchType[2];
            reflectionVarying.name = name;
            reflectionVarying.inout = (shaderStage === 'vertex') ? 'out' : 'in';
        }
        this.__varyings.push(reflectionVarying);
    }
    __addUniform(shaderCodeLine) {
        const reflectionUniform = {
            name: '',
            type: 'float',
            semantic: 'UNKNOWN'
        };
        const matchType = shaderCodeLine.match(Reflection.uniformTypeRegExp);
        if (matchType) {
            const type = matchType[1];
            reflectionUniform.type = type;
            const name = matchType[2];
            reflectionUniform.name = name;
            const matchSemantics = shaderCodeLine.match(Reflection.semanticRegExp);
            if (matchSemantics) {
                reflectionUniform.semantic = matchSemantics[1];
            }
            else {
                for (let [key, value] of this.__uniformSemanticsMap) {
                    if (name.match(new RegExp(key, 'i'))) {
                        reflectionUniform.semantic = value;
                    }
                }
            }
        }
        this.__uniforms.push(reflectionUniform);
    }
}
Reflection.attributeAndVaryingTypeRegExp = /[\t ]+(float|int|uint|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4|uvec2|uvec3|uvec4)[\t ]+(\w+);/;
Reflection.uniformTypeRegExp = /[\t ]+(float|int|uint|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4|uvec2|uvec3|uvec4|sampler2D|samplerCube|sampler3D)[\t ]+(\w+);/;
Reflection.semanticRegExp = /<.*semantic[\t ]*=[\t ]*(\w+).*>/;
exports["default"] = Reflection;
;


/***/ }),

/***/ "./src/main/ShaderEditor.ts":
/*!**********************************!*\
  !*** ./src/main/ShaderEditor.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * This class edits the code property of a shaderity object.
 */
class ShaderEditor {
    static _insertDefinition(splittedShaderCode, definition) {
        const defStr = definition.replace(/#define[\t ]+/, '');
        splittedShaderCode.unshift(`#define ${defStr}`);
    }
    static _fillTemplate(shaderCode, templateObject) {
        const templateString = shaderCode.replace(/\/\*[\t ]*shaderity:[\t ]*(@{[\t ]*)(\S+)([\t ]*})[\t ]*\*\//g, '${this.$2}');
        const resultCode = new Function("return `" + templateString + "`;").call(templateObject);
        return resultCode;
    }
}
exports["default"] = ShaderEditor;


/***/ }),

/***/ "./src/main/ShaderTransformer.ts":
/*!***************************************!*\
  !*** ./src/main/ShaderTransformer.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * This class converts the code property of a shaderity object to the specified format.
 */
class ShaderTransformer {
    /**
     * @private
     * Translate a GLSL ES3 shader code to a GLSL ES1 shader code
     */
    static _transformToGLSLES1(splittedShaderCode, isFragmentShader, embedErrorsInOutput) {
        this.__convertOrInsertVersionGLSLES1(splittedShaderCode);
        this.__removeES3Qualifier(splittedShaderCode, embedErrorsInOutput);
        this.__convertIn(splittedShaderCode, isFragmentShader);
        this.__convertOut(splittedShaderCode, isFragmentShader, embedErrorsInOutput);
        this.__removePrecisionForES3(splittedShaderCode);
        this.__convertTextureFunctionToES1(splittedShaderCode, isFragmentShader, embedErrorsInOutput);
        const transformedSplittedShaderCode = splittedShaderCode;
        return transformedSplittedShaderCode;
    }
    /**
     * @private
     * Translate a GLSL ES1 shader code to a GLSL ES3 shader code
     */
    static _transformToGLSLES3(splittedShaderCode, isFragmentShader) {
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
    static _transformTo(version, splittedShaderCode, isFragmentShader, embedErrorsInOutput) {
        if (version.match(/webgl2|es3/i)) {
            return this._transformToGLSLES3(splittedShaderCode, isFragmentShader);
        }
        else if (version.match(/webgl1|es1/i)) {
            return this._transformToGLSLES1(splittedShaderCode, isFragmentShader, embedErrorsInOutput);
        }
        else {
            console.error('Invalid Version');
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
    static __convertOrInsertVersionGLSLES1(splittedShaderCode) {
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
    static __convertOrInsertVersionGLSLES3(splittedShaderCode) {
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
    static __convertIn(splittedShaderCode, isFragmentShader) {
        const reg = /^(?![\/])[\t ]*in[\t ]+((highp|mediump|lowp|)[\t ]*\w+[\t ]*\w+[\t ]*;)/;
        let replaceFunc;
        if (isFragmentShader) {
            replaceFunc = function (match, p1) {
                return 'varying ' + p1;
            };
        }
        else {
            replaceFunc = function (match, p1) {
                return 'attribute ' + p1;
            };
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
    static __convertOut(splittedShaderCode, isFragmentShader, embedErrorsInOutput) {
        if (isFragmentShader) {
            const variableName = this.__removeOutQualifier(splittedShaderCode, embedErrorsInOutput);
            if (variableName == null) {
                // no out qualifier
                return;
            }
            this.__addGLFragColor(variableName, splittedShaderCode, embedErrorsInOutput);
        }
        else {
            const reg = /^(?![\/])[\t ]*out[\t ]+((highp|mediump|lowp|)[\t ]*\w+[\t ]*\w+[\t ]*;)/;
            const replaceFunc = function (match, p1) {
                return 'varying ' + p1;
            };
            this.__replaceLine(splittedShaderCode, reg, replaceFunc);
        }
    }
    /**
     * @private
     * This method is a part of __convertOut method.
     * This method deletes the "out" qualifiers and adds the line for assigning to gl_FragColor.
     * If the shader does not have the "out" qualifiers, this method does nothing.
     */
    static __removeOutQualifier(splittedShaderCode, embedErrorsInOutput) {
        const reg = /^(?![\/])[\t ]*out[\t ]+((highp|mediump|lowp|)[\t ]*\w+[\t ]*(\w+)[\t ]*;)/;
        let variableName;
        for (let i = 0; i < splittedShaderCode.length; i++) {
            const match = splittedShaderCode[i].match(reg);
            if (match) {
                splittedShaderCode[i] = match[1];
                variableName = match[3];
                break;
            }
        }
        return variableName;
    }
    static __addGLFragColor(variableName, splittedShaderCode, embedErrorsInOutput) {
        const closeBracketReg = /(.*)\}[\n\t ]*$/;
        const returnReg = /[\n\t ]*return[\n\t ]*;/;
        const mainFuncStartReg = /(^|^(?![\/])[\t\n ]+)void[\t\n ]+main([\t\n ]|\(|$)/;
        const fragColorCode = `  gl_FragColor = ${variableName};`;
        let setGlFragColorInLastLine = false;
        for (let i = splittedShaderCode.length - 1; i >= 0; i--) {
            const line = splittedShaderCode[i];
            if (!setGlFragColorInLastLine && line.match(closeBracketReg)) {
                // add gl_FragColor to last line of main function
                splittedShaderCode[i] = line.replace(closeBracketReg, `$1\n${fragColorCode}\n}\n`);
                setGlFragColorInLastLine = true;
            }
            if (line.match(returnReg)) {
                // add gl_FragColor just before return
                splittedShaderCode.splice(i, 0, fragColorCode);
            }
            if (line.match(mainFuncStartReg)) {
                // add gl_FragColor only in the main function
                break;
            }
        }
        if (!setGlFragColorInLastLine) {
            const errorMessage = '__removeOutQualifier: Not found the closing brackets for the main function';
            this.__outError(splittedShaderCode, splittedShaderCode.length, errorMessage, embedErrorsInOutput);
        }
    }
    /**
     * @private
     * Find the qualifier for es3 only in the shader code and remove it
     * This method directly replace the elements of the splittedShaderCode variable.
     */
    static __removeES3Qualifier(splittedShaderCode, embedErrorsInOutput) {
        this.__removeVaryingQualifier(splittedShaderCode, embedErrorsInOutput);
        this.__removeLayout(splittedShaderCode);
    }
    /**
     * @private
     * Find the "flat" and "smooth" qualifier in the shader code and remove it
     */
    static __removeVaryingQualifier(splittedShaderCode, embedErrorsInOutput) {
        const reg = /^(?![\/])[\t ]*(flat|smooth)[\t ]*((in|out)[\t ]+.*)/;
        const errorMessage = '__removeVaryingQualifier: glsl es1 does not support flat qualifier';
        for (let i = 0; i < splittedShaderCode.length; i++) {
            splittedShaderCode[i] = splittedShaderCode[i].replace(reg, (match, p1, p2) => {
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
    static __removeLayout(splittedShaderCode) {
        const reg = /^(?![\/])[\t ]*layout[\t ]*\([\t ]*location[\t ]*\=[\t ]*\d[\t ]*\)[\t ]+/g;
        this.__replaceLine(splittedShaderCode, reg, '');
    }
    /**
     * @private
     * Find the "precision" qualifier in the shader code and remove it if the "precision" qualifier is valid for only GLSL ES3
     * This method directly replace the elements of the splittedShaderCode variable.
     */
    static __removePrecisionForES3(splittedShaderCode) {
        const reg = /^(?![\/])[\t ]*precision[\t ]+(highp|mediump|lowp)[\t ]+(\w+)[\t ]*;/;
        for (let i = 0; i < splittedShaderCode.length; i++) {
            const match = splittedShaderCode[i].match(reg);
            if (match != null) {
                if (match[2] === 'int' ||
                    match[2] === 'float' ||
                    match[2] === 'sampler2D' ||
                    match[2] === 'samplerCube') {
                    // these precisions are supported in es1
                    continue;
                }
                else {
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
    static __convertTextureFunctionToES1(splittedShaderCode, isFragmentShader, embedErrorsInOutput) {
        var _a, _b;
        const sbl = this.__regSymbols();
        const regTextureProj = new RegExp(`(${sbl}+)textureProj(Lod|)(${sbl}+)`, 'g');
        const regTexture = new RegExp(`(${sbl}+)texture(Lod|)(${sbl}+)`, 'g');
        let argumentSamplerMap;
        const uniformSamplerMap = this.__createUniformSamplerMap(splittedShaderCode, embedErrorsInOutput);
        for (let i = 0; i < splittedShaderCode.length; i++) {
            const line = splittedShaderCode[i];
            const matchTextureProj = line.match(/textureProj(Lod|)[\t ]*\([\t ]*(\w+),/);
            if (matchTextureProj) {
                argumentSamplerMap = argumentSamplerMap !== null && argumentSamplerMap !== void 0 ? argumentSamplerMap : this.__createArgumentSamplerMap(splittedShaderCode, i, embedErrorsInOutput);
                const isLodMethod = matchTextureProj[1] === 'Lod';
                const extensionStr = isFragmentShader && isLodMethod ? `EXT` : ``;
                const variableName = matchTextureProj[2];
                const samplerType = (_a = argumentSamplerMap === null || argumentSamplerMap === void 0 ? void 0 : argumentSamplerMap.get(variableName)) !== null && _a !== void 0 ? _a : uniformSamplerMap.get(variableName);
                if (samplerType != null) {
                    if (samplerType === 'sampler2D') {
                        splittedShaderCode[i] = splittedShaderCode[i].replace(regTextureProj, `$1texture2DProj$2${extensionStr}$3`);
                    }
                    else {
                        const errorMessage = '__convertTextureFunctionToES1: do not support ' + samplerType + ' type';
                        this.__outError(splittedShaderCode, i, errorMessage, embedErrorsInOutput);
                    }
                }
                continue;
            }
            const matchTexture = line.match(/texture(Lod|)[\t ]*\([\t ]*(\w+),/);
            if (matchTexture) {
                argumentSamplerMap = argumentSamplerMap !== null && argumentSamplerMap !== void 0 ? argumentSamplerMap : this.__createArgumentSamplerMap(splittedShaderCode, i, embedErrorsInOutput);
                const isLodMethod = matchTexture[1] === 'Lod';
                const extensionStr = isFragmentShader && isLodMethod ? `EXT` : ``;
                const variableName = matchTexture[2];
                const samplerType = (_b = argumentSamplerMap === null || argumentSamplerMap === void 0 ? void 0 : argumentSamplerMap.get(variableName)) !== null && _b !== void 0 ? _b : uniformSamplerMap.get(variableName);
                if (samplerType != null) {
                    let textureFunc;
                    if (samplerType === 'sampler2D') {
                        textureFunc = 'texture2D';
                    }
                    else if (samplerType === 'samplerCube') {
                        textureFunc = 'textureCube';
                    }
                    else {
                        textureFunc = '';
                        const errorMessage = '__convertTextureFunctionToES1: do not support ' + samplerType + ' type';
                        this.__outError(splittedShaderCode, i, errorMessage, embedErrorsInOutput);
                    }
                    if (textureFunc !== '') {
                        splittedShaderCode[i] = splittedShaderCode[i].replace(regTexture, `$1${textureFunc}$2${extensionStr}$3`);
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
    static __createUniformSamplerMap(splittedShaderCode, embedErrorsInOutput) {
        const uniformSamplerMap = new Map();
        for (let i = 0; i < splittedShaderCode.length; i++) {
            const line = splittedShaderCode[i];
            const match = line.match(/^(?![\/])[\t ]*uniform*[\t ]*(highp|mediump|lowp|)[\t ]*(sampler\w+)[\t ]+(\w+)/);
            if (match) {
                const samplerType = match[2];
                const name = match[3];
                if (uniformSamplerMap.get(name)) {
                    const errorMessage = '__createUniformSamplerMap: duplicate variable name';
                    this.__outError(splittedShaderCode, i, errorMessage, embedErrorsInOutput);
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
    static __createArgumentSamplerMap(splittedShaderCode, lineIndex, embedErrorsInOutput) {
        var _a, _b;
        const argumentSamplerMap = new Map();
        for (let i = lineIndex; i >= 0; i--) {
            const line = splittedShaderCode[i];
            const isBlockStartLine = !!line.match(/\{/);
            if (!isBlockStartLine) {
                continue;
            }
            const bracketSectionCode = this.__getBracketSection(splittedShaderCode, i);
            const innerBracketSectionCode = (_a = bracketSectionCode.match(/.*\((.*)\)/)) === null || _a === void 0 ? void 0 : _a[1];
            if (innerBracketSectionCode == null) {
                return;
            }
            const variableCandidates = innerBracketSectionCode.split(',');
            const samplerTypeDefinitionReg = /[\n\t ]*(highp|mediump|lowp|)[\n\t ]*(sampler\w+)[\n\t ]*(\w+)[\n\t ]*/;
            const isFunctionBracket = !!((_b = variableCandidates[0].match(samplerTypeDefinitionReg)) !== null && _b !== void 0 ? _b : variableCandidates[0].match(/^[\n\t ]*$/));
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
                    const errorMessage = '__createArgumentSamplerMap: duplicate variable name';
                    this.__outError(splittedShaderCode, i, errorMessage, embedErrorsInOutput);
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
    static __getBracketSection(splittedShaderCode, bracketEndIndex) {
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
    static __convertAttribute(splittedShaderCode, isFragmentShader) {
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
    static __convertVarying(splittedShaderCode, isFragmentShader) {
        const reg = /^(?![\/])[\t ]*varying[\t ]+/g;
        const replaceStr = isFragmentShader ? 'in ' : 'out ';
        this.__replaceLine(splittedShaderCode, reg, replaceStr);
    }
    /**
     * @private
     * Find the 'textureCube' method in the shader code and replace it with the GLSL ES3 method('texture')
     * This method directly replace the elements of the splittedShaderCode variable.
     */
    static __convertTextureCube(splittedShaderCode) {
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
    static __convertTexture2D(splittedShaderCode) {
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
    static __convertTexture2DProd(splittedShaderCode) {
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
    static __convertTexture3D(splittedShaderCode) {
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
    static __convertTexture3DProd(splittedShaderCode) {
        const sbl = this.__regSymbols();
        const reg = new RegExp(`(${sbl}+)(texture3DProj)(${sbl}+)`, 'g');
        const replaceStr = 'textureProj';
        this.__replaceLine(splittedShaderCode, reg, '$1' + replaceStr + '$3');
    }
    static __regSymbols() {
        return `[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^` + '`{|}~\t\n ]';
    }
    static __replaceLine(splittedShaderCode, reg, replacement) {
        for (let i = 0; i < splittedShaderCode.length; i++) {
            splittedShaderCode[i] = splittedShaderCode[i].replace(reg, replacement);
        }
    }
    static __removeFirstMatchingLine(splittedShaderCode, reg) {
        for (let i = 0; i < splittedShaderCode.length; i++) {
            if (splittedShaderCode[i].match(reg)) {
                splittedShaderCode.splice(i, 1);
                break;
            }
        }
    }
    static __outError(splittedShaderCode, lineIndex, errorMessage, embedErrorsInOutput) {
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
        }
        else {
            throw new Error(errorMessage);
        }
    }
}
exports["default"] = ShaderTransformer;


/***/ }),

/***/ "./src/main/Shaderity.ts":
/*!*******************************!*\
  !*** ./src/main/Shaderity.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Reflection_1 = __importDefault(__webpack_require__(/*! ./Reflection */ "./src/main/Reflection.ts"));
const ShaderTransformer_1 = __importDefault(__webpack_require__(/*! ./ShaderTransformer */ "./src/main/ShaderTransformer.ts"));
const ShaderEditor_1 = __importDefault(__webpack_require__(/*! ./ShaderEditor */ "./src/main/ShaderEditor.ts"));
const Utility_1 = __importDefault(__webpack_require__(/*! ./Utility */ "./src/main/Utility.ts"));
const ShaderityObjectCreator_1 = __importDefault(__webpack_require__(/*! ./ShaderityObjectCreator */ "./src/main/ShaderityObjectCreator.ts"));
const PreProcessor_1 = __importDefault(__webpack_require__(/*! ./PreProcessor */ "./src/main/PreProcessor.ts"));
class Shaderity {
    // =========================================================================================================
    // shader transformation functions
    // =========================================================================================================
    /**
     * Translate a GLSL ES3 shader code to a GLSL ES1 shader code
     * @param obj Shaderity object to translate to glsl es1
     * @param embedErrorsInOutput If true, when there is an error in the conversion,
     *    the error and the number of lines are output at the bottom of the return
     *    value ShaderityObject.code. If false, throw an error.
     * @returns ShaderityObject whose code property is the shader code for GLSL ES1
     */
    static transformToGLSLES1(obj, embedErrorsInOutput = false) {
        const splittedShaderCode = Utility_1.default._splitByLineFeedCode(obj.code);
        const transformedSplittedShaderCode = ShaderTransformer_1.default._transformToGLSLES1(splittedShaderCode, obj.isFragmentShader, embedErrorsInOutput);
        const resultCode = Utility_1.default._joinSplittedLine(transformedSplittedShaderCode);
        const resultObj = {
            code: resultCode,
            shaderStage: obj.shaderStage,
            isFragmentShader: obj.isFragmentShader,
        };
        return resultObj;
    }
    /**
     * Translate a GLSL ES1 shader code to a GLSL ES3 shader code
     */
    static transformToGLSLES3(obj) {
        const splittedShaderCode = Utility_1.default._splitByLineFeedCode(obj.code);
        const transformedSplittedShaderCode = ShaderTransformer_1.default._transformToGLSLES3(splittedShaderCode, obj.isFragmentShader);
        const resultCode = Utility_1.default._joinSplittedLine(transformedSplittedShaderCode);
        const resultObj = {
            code: resultCode,
            shaderStage: obj.shaderStage,
            isFragmentShader: obj.isFragmentShader,
        };
        return resultObj;
    }
    /**
     * Translate a GLSL shader code to a shader code of specified GLSL version
     */
    static transformTo(version, obj, embedErrorsInOutput = false) {
        const splittedShaderCode = Utility_1.default._splitByLineFeedCode(obj.code);
        const transformedSplittedShaderCode = ShaderTransformer_1.default._transformTo(version, splittedShaderCode, obj.isFragmentShader, embedErrorsInOutput);
        const resultCode = Utility_1.default._joinSplittedLine(transformedSplittedShaderCode);
        const resultObj = {
            code: resultCode,
            shaderStage: obj.shaderStage,
            isFragmentShader: obj.isFragmentShader,
        };
        return resultObj;
    }
    static processPragma(obj, remainDefine, definitions = [], startLineStr, endLineStr) {
        const splittedShaderCode = Utility_1.default._splitByLineFeedCode(obj.code);
        const transformedSplittedShaderCode = PreProcessor_1.default.process(splittedShaderCode, remainDefine, definitions, startLineStr, endLineStr);
        const resultCode = Utility_1.default._joinSplittedLine(transformedSplittedShaderCode);
        const resultObj = {
            code: resultCode,
            shaderStage: obj.shaderStage,
            isFragmentShader: obj.isFragmentShader,
        };
        return resultObj;
    }
    // =========================================================================================================
    // shaderity object creation functions
    // =========================================================================================================
    /**
     * Create an instance to create shaderity object.
     */
    static createShaderityObjectCreator(shaderStage) {
        return new ShaderityObjectCreator_1.default(shaderStage);
    }
    // =========================================================================================================
    // shader edit functions
    // =========================================================================================================
    /**
     * Find the following template pattern in the shader code and replace key to value
     * @param templateObject An object that represents the string before and after the replacement
     * The key can be a string or an object. If an object is used as the key,
     * the key in the pattern of shaderCode must also match the object.
     * For example, if templateObject is
        {
            sample {
                sampleA: 0
            }
        }
     * then the key in a shader code is sample.sampleA.
     */
    // The template pattern is	/* shaderity: @{key} */
    static fillTemplate(obj, arg) {
        const copy = this.__copyShaderityObject(obj);
        copy.code = ShaderEditor_1.default._fillTemplate(copy.code, arg);
        return copy;
    }
    /**
     * Insert define directive
     */
    static insertDefinition(obj, definition) {
        const copy = this.__copyShaderityObject(obj);
        const splittedShaderCode = Utility_1.default._splitByLineFeedCode(obj.code);
        ShaderEditor_1.default._insertDefinition(splittedShaderCode, definition);
        copy.code = Utility_1.default._joinSplittedLine(splittedShaderCode);
        return copy;
    }
    // =========================================================================================================
    // reflection functions
    // =========================================================================================================
    /**
     * Create an instance to get the attribute, varying, and uniform information from a shader code of the shaderity.
     * To get these information, you need to call reflection.reflect method.
     */
    static createReflectionObject(obj) {
        const splittedShaderCode = Utility_1.default._splitByLineFeedCode(obj.code);
        const reflection = new Reflection_1.default(splittedShaderCode, obj.shaderStage);
        return reflection;
    }
    // =========================================================================================================
    // private functions
    // =========================================================================================================
    static __copyShaderityObject(obj) {
        const copiedObj = {
            code: obj.code,
            shaderStage: obj.shaderStage,
            isFragmentShader: obj.isFragmentShader,
        };
        return copiedObj;
    }
}
exports["default"] = Shaderity;


/***/ }),

/***/ "./src/main/ShaderityObjectCreator.ts":
/*!********************************************!*\
  !*** ./src/main/ShaderityObjectCreator.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Utility_1 = __importDefault(__webpack_require__(/*! ./Utility */ "./src/main/Utility.ts"));
/**
 * This class creates a shaderity object.
 */
class ShaderityObjectCreator {
    constructor(shaderStage) {
        this.__functionIdCount = 0;
        this.__defineDirectiveNames = [];
        this.__extensions = [];
        this.__globalPrecision = {
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
        this.__structDefinitions = [];
        this.__globalConstantValues = [];
        this.__globalConstantStructValues = [];
        this.__attributes = []; // for vertex shader only
        this.__varyings = [];
        this.__uniforms = [];
        this.__uniformStructs = [];
        this.__uniformBufferObjects = [];
        this.__functions = []; // first index represent dependency level
        this.__mainFunctionCode = 'void main() {}';
        this.__outputColorVariableName = 'renderTarget0'; // for fragment shader only
        this.__shaderStage = shaderStage;
    }
    // =========================================================================================================
    // add parameters functions
    // =========================================================================================================
    addDefineDirective(defineDirectiveName) {
        const isDuplicate = this.__defineDirectiveNames.some(name => name === defineDirectiveName);
        if (isDuplicate) {
            console.warn('addDefineDirective: this define directive is already set');
            return;
        }
        this.__defineDirectiveNames.push(defineDirectiveName);
    }
    addExtension(extensionName, behavior = 'enable') {
        const isDuplicate = this.__extensions.some(extension => extension.extensionName === extensionName);
        if (isDuplicate) {
            console.warn('addExtension: this extension is already set');
            return;
        }
        this.__extensions.push({
            extensionName,
            behavior
        });
    }
    // only define types
    addStructDefinition(structName, memberObjects) {
        const isDuplicate = this.__structDefinitions.some(structDefinition => structDefinition.structName === structName);
        if (isDuplicate) {
            console.error(`addStructDefinition: duplicate struct type name ${structName}`);
            return;
        }
        this.__structDefinitions.push({
            structName,
            memberObjects,
        });
    }
    addGlobalConstantValue(variableName, type, values) {
        const isDuplicate = this.__globalConstantValues.some(globalConstantValue => globalConstantValue.variableName === variableName);
        if (isDuplicate) {
            console.error(`addGlobalConstantValue: duplicate variable name ${variableName}`);
            return;
        }
        const isValidComponentNumber = Utility_1.default._isValidComponentCount(type, values);
        if (!isValidComponentNumber) {
            console.error(`addGlobalConstantValue: the component count of ${variableName} is invalid`);
            return;
        }
        const isIntType = Utility_1.default._isIntType(type);
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
    // need to define struct by the addStructDefinition method
    // validate that the corresponding structure is defined by the __createGlobalConstantStructValueShaderCode method
    addGlobalConstantStructValue(structName, variableName, values) {
        const isDuplicate = this.__globalConstantStructValues.some(structValue => structValue.variableName === variableName);
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
    addAttributeDeclaration(variableName, type, options) {
        if (this.__shaderStage !== 'vertex') {
            console.error('addAttribute: this method is for vertex shader only');
            return;
        }
        const isDuplicate = this.__attributes.some(attribute => attribute.variableName === variableName);
        if (isDuplicate) {
            console.error(`addAttribute: duplicate variable name ${variableName}`);
            return;
        }
        this.__attributes.push({
            variableName,
            type,
            precision: options === null || options === void 0 ? void 0 : options.precision,
            location: options === null || options === void 0 ? void 0 : options.location,
        });
    }
    addVaryingDeclaration(variableName, type, options) {
        const isDuplicate = this.__varyings.some(varying => varying.variableName === variableName);
        if (isDuplicate) {
            console.error(`addVarying: duplicate variable name ${variableName}`);
            return;
        }
        const isIntType = Utility_1.default._isIntType(type);
        let interpolationType = options === null || options === void 0 ? void 0 : options.interpolationType;
        if (isIntType && interpolationType !== 'flat') {
            if (interpolationType != null) {
                console.error(`addVarying: the interpolationType must be flat for integer types`);
                return;
            }
            else {
                console.warn(`addVarying: set the interpolationType of integer types to flat to avoid compilation error`);
                interpolationType = 'flat';
            }
        }
        this.__varyings.push({
            variableName,
            type,
            precision: options === null || options === void 0 ? void 0 : options.precision,
            interpolationType,
        });
    }
    addUniformDeclaration(variableName, type, options) {
        const isDuplicate = this.__uniforms.some(uniform => uniform.variableName === variableName);
        if (isDuplicate) {
            console.error(`addUniform: duplicate variable name ${variableName}`);
            return;
        }
        if (type === 'bool' && (options === null || options === void 0 ? void 0 : options.precision) != null) {
            console.warn(`addUniform: remove the specification of precision for bool type to avoid compilation error`);
            options.precision = undefined;
        }
        this.__uniforms.push({
            variableName,
            type,
            precision: options === null || options === void 0 ? void 0 : options.precision,
        });
    }
    // need to define struct by the addStructDefinition method
    addUniformStructDeclaration(structName, variableName) {
        const isDuplicate = this.__uniformStructs.some(uniformStruct => uniformStruct.variableName === variableName);
        if (isDuplicate) {
            console.error(`addUniformStructDeclaration: duplicate variable name ${variableName}`);
            return;
        }
        this.__uniformStructs.push({
            variableName,
            structName,
        });
    }
    // for es3
    addUniformBufferObjectDeclaration(blockName, variableObjects, options) {
        const isDuplicateBlockName = this.__uniformBufferObjects.some(ubo => ubo.blockName === blockName);
        if (isDuplicateBlockName) {
            console.error(`addUniformBufferObjectDeclaration: duplicate block name ${blockName}`);
            return;
        }
        for (const ubo of this.__uniformBufferObjects) {
            for (const uboVariableObject of ubo.variableObjects) {
                for (const variableObject of variableObjects) {
                    if (uboVariableObject.variableName === variableObject.variableName) {
                        console.error(`addUniformBufferObjectDeclaration: duplicate variable name ${variableObject.variableName}`);
                        return;
                    }
                }
            }
        }
        this.__uniformBufferObjects.push({
            blockName,
            variableObjects,
            instanceName: options === null || options === void 0 ? void 0 : options.instanceName,
        });
    }
    // the return value Id is a value to delete the function
    // the main function is defined (updated) by the updateMainFunction method
    addFunctionDefinition(functionCode, options) {
        var _a, _b;
        const functionId = this.__functionIdCount++;
        const dependencyLevel = (_a = options === null || options === void 0 ? void 0 : options.dependencyLevel) !== null && _a !== void 0 ? _a : 0;
        this.__functions[dependencyLevel] = (_b = this.__functions[dependencyLevel]) !== null && _b !== void 0 ? _b : [];
        this.__functions[dependencyLevel].push({
            functionCode,
            functionId
        });
        return functionId;
    }
    // =========================================================================================================
    // update parameters functions
    // =========================================================================================================
    updateGlobalPrecision(precision) {
        Object.assign(this.__globalPrecision, precision);
    }
    updateStructDefinition(structName, memberObjects) {
        const matchedIndex = this.__structDefinitions.findIndex(structDefinition => structDefinition.structName === structName);
        if (matchedIndex === -1) {
            console.error(`updateStructDefinition: the struct type name ${structName} is not exist`);
            return;
        }
        this.__structDefinitions[matchedIndex].memberObjects = memberObjects;
    }
    updateGlobalConstantValue(variableName, values) {
        const matchedIndex = this.__globalConstantValues.findIndex(globalConstantValue => globalConstantValue.variableName === variableName);
        if (matchedIndex === -1) {
            console.warn(`updateGlobalConstantValue: the variable name ${variableName} is not exist`);
            return;
        }
        const type = this.__globalConstantValues[matchedIndex].type;
        const isValidComponentNumber = Utility_1.default._isValidComponentCount(type, values);
        if (!isValidComponentNumber) {
            console.error('updateGlobalConstantValue: the component count is invalid');
            return;
        }
        const isIntType = Utility_1.default._isIntType(type);
        if (isIntType) {
            const existNonIntegerValue = ShaderityObjectCreator.__existNonIntegerValue(values);
            if (existNonIntegerValue) {
                console.warn(`updateGlobalConstantValue: the ${variableName} has a non-integer value.`);
            }
        }
        this.__globalConstantValues[matchedIndex].values = values;
    }
    updateGlobalConstantStructValue(variableName, values) {
        const matchedIndex = this.__globalConstantStructValues.findIndex(structValue => structValue.variableName === variableName);
        if (matchedIndex === -1) {
            console.error(`updateGlobalConstantStructValue:  the variable name ${variableName} is not exist`);
            return;
        }
        this.__globalConstantStructValues[matchedIndex].values = values;
    }
    updateMainFunction(mainFunctionCodeInner) {
        this.__mainFunctionCode = mainFunctionCodeInner;
    }
    // specify the name of the output color variable from the main function in the fragment shader.
    // users have to assign the result of fragment shader calculation to this variable.
    updateOutputColorVariableName(outputColorVariableName) {
        if (this.__shaderStage !== 'fragment') {
            console.error('updateOutputColorVariableName: this method is for fragment shader only');
            return;
        }
        if (outputColorVariableName.length === 0) {
            console.error('updateOutputColorVariableName: invalid outColorVariableName');
            return;
        }
        this.__outputColorVariableName = outputColorVariableName;
    }
    // =========================================================================================================
    // remove parameters functions
    // =========================================================================================================
    removeDefineDirective(defineDirectiveName) {
        const matchedIndex = this.__defineDirectiveNames.indexOf(defineDirectiveName);
        if (matchedIndex === -1) {
            console.warn('removedDefineDirective: this define directive is not exist');
            return;
        }
        this.__defineDirectiveNames.splice(matchedIndex, 1);
    }
    removeExtension(extensionName) {
        const matchedIndex = this.__extensions.findIndex(extension => extension.extensionName === extensionName);
        if (matchedIndex === -1) {
            console.warn('removeExtension: this extension is not exist');
            return;
        }
        this.__extensions.splice(matchedIndex, 1);
    }
    removeStructDefinition(structName) {
        const matchedIndex = this.__structDefinitions.findIndex(structDefinition => structDefinition.structName === structName);
        if (matchedIndex === -1) {
            console.error(`removeStructDefinition: the struct type name ${structName} is not exist`);
            return;
        }
        this.__structDefinitions.splice(matchedIndex, 1);
    }
    removeGlobalConstantValue(variableName) {
        const matchedIndex = this.__globalConstantValues.findIndex(globalConstantValue => globalConstantValue.variableName === variableName);
        if (matchedIndex === -1) {
            console.warn(`removeGlobalConstantValue: the variable name ${variableName} is not exist`);
            return;
        }
        this.__globalConstantValues.splice(matchedIndex, 1);
    }
    removeGlobalConstantStructValue(variableName) {
        const matchedIndex = this.__globalConstantStructValues.findIndex(structValue => structValue.variableName === variableName);
        if (matchedIndex === -1) {
            console.error(`updateGlobalConstantStructValue:  the variable name ${variableName} is not exist`);
            return;
        }
        this.__globalConstantStructValues.splice(matchedIndex, 1);
    }
    removeAttributeDeclaration(variableName) {
        const matchedIndex = this.__attributes.findIndex(attribute => attribute.variableName === variableName);
        if (matchedIndex === -1) {
            console.warn(`removeAttribute: the variable name ${variableName} is not exist`);
            return;
        }
        this.__attributes.splice(matchedIndex, 1);
    }
    removeVaryingDeclaration(variableName) {
        const matchedIndex = this.__varyings.findIndex(varying => varying.variableName === variableName);
        if (matchedIndex === -1) {
            console.warn(`removeVarying: the variable name ${variableName} is not exist`);
            return;
        }
        this.__varyings.splice(matchedIndex, 1);
    }
    removeUniformDeclaration(variableName) {
        const matchedIndex = this.__uniforms.findIndex(uniform => uniform.variableName === variableName);
        if (matchedIndex === -1) {
            console.warn(`removeUniform: the variable name ${variableName} is not exist`);
            return;
        }
        this.__uniforms.splice(matchedIndex, 1);
    }
    removeUniformStructDeclaration(variableName) {
        const matchedIndex = this.__uniformStructs.findIndex(uniformStruct => uniformStruct.variableName === variableName);
        if (matchedIndex === -1) {
            console.warn(`removeUniformStructDeclaration: the variable name ${variableName} is not exist`);
            return;
        }
        this.__uniformStructs.splice(matchedIndex, 1);
    }
    removeUniformBufferObjectDeclaration(blockName) {
        const matchedIndex = this.__uniformBufferObjects.findIndex(ubo => ubo.blockName === blockName);
        if (matchedIndex === -1) {
            console.warn(`removeUniformStructDeclaration: the variable name ${blockName} is not exist`);
            return;
        }
        this.__uniformBufferObjects.splice(matchedIndex, 1);
    }
    removeFunctionDefinition(functionId) {
        this.__fillEmptyFunctions();
        // id is too small or too big
        if (functionId < 0 || functionId >= this.__functionIdCount) {
            console.warn('removeFunctionDefinition: invalid function id');
        }
        for (const functionObjects of this.__functions) {
            const matchedIndex = functionObjects.findIndex(functionObject => functionObject.functionId === functionId);
            if (matchedIndex !== -1) {
                functionObjects.splice(matchedIndex, 1);
                return;
            }
        }
        console.warn(`removeFunctionDefinition: not found the function of functionId ${functionId}`);
    }
    // =========================================================================================================
    // create shaderity object function
    // =========================================================================================================
    createShaderityObject() {
        const shaderityObj = {
            code: this.__createShaderCode(),
            shaderStage: this.__shaderStage,
            isFragmentShader: this.__shaderStage === 'fragment',
        };
        return shaderityObj;
    }
    // =========================================================================================================
    // private methods
    // =========================================================================================================
    static __existNonIntegerValue(values) {
        for (const value of values) {
            if (!Number.isInteger(value)) {
                return true;
            }
        }
        return false;
    }
    // TODO: implement shader code import feature (low priority)
    // public importShaderCode(code: string) {}
    // need to apply Shaderity.transformToGLSLES1, transformToGLSLES3 or transformTo method
    __createShaderCode() {
        this.__fillEmptyFunctions();
        const code = `#version 300 es\n\n`
            + this.__createDefineDirectiveShaderCode()
            + this.__createExtensionShaderCode()
            + this.__createGlobalPrecisionShaderCode()
            + this.__createStructDefinitionShaderCode()
            + this.__createGlobalConstantValueShaderCode()
            + this.__createGlobalConstantStructValueShaderCode()
            + this.__createAttributeDeclarationShaderCode()
            + this.__createVaryingDeclarationShaderCode()
            + this.__createOutputColorDeclarationShaderCode()
            + this.__createUniformDeclarationShaderCode()
            + this.__createUniformStructDeclarationShaderCode()
            + this.__createUniformBufferObjectShaderCode()
            + this.__createFunctionDefinitionShaderCode()
            + this.__createMainFunctionDefinitionShaderCode();
        return code;
    }
    __fillEmptyFunctions() {
        var _a;
        for (let i = 0; i < this.__functions.length; i++) {
            this.__functions[i] = (_a = this.__functions[i]) !== null && _a !== void 0 ? _a : [];
        }
    }
    __createDefineDirectiveShaderCode() {
        let shaderCode = '';
        for (const defineDirectiveName of this.__defineDirectiveNames) {
            shaderCode += `#define ${defineDirectiveName}\n`;
        }
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
        // removed by dead control flow

    }
    __createExtensionShaderCode() {
        let shaderCode = '';
        for (const extension of this.__extensions) {
            shaderCode += `#extension ${extension.extensionName}: ${extension.behavior}\n`;
        }
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    //TODO: remove needless precisions
    __createGlobalPrecisionShaderCode() {
        let shaderCode = '';
        for (const type in this.__globalPrecision) {
            const precisionType = type;
            const precisionQualifier = this.__globalPrecision[precisionType];
            shaderCode += `precision ${precisionQualifier} ${precisionType};\n`;
        }
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    __createStructDefinitionShaderCode() {
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
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    __createGlobalConstantValueShaderCode() {
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
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    __createGlobalConstantStructValueShaderCode() {
        let shaderCode = '';
        for (const structValue of this.__globalConstantStructValues) {
            const matchedIndex = this.__structDefinitions.findIndex(definition => definition.structName === structValue.structName);
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
            const hasSamplerType = structDefinition.memberObjects.some(memberObject => Utility_1.default._isSamplerType(memberObject.type));
            if (hasSamplerType) {
                console.error(`__createGlobalConstantStructValueShaderCode: ConstantStructValue (${structValue.variableName}) cannot have sampler type parameter`);
                continue;
            }
            for (let i = 0; i < structDefinition.memberObjects.length; i++) {
                const variableName = structDefinition.memberObjects[i].memberName;
                const value = structValue.values[variableName];
                if (value == null) {
                    console.error(`__createGlobalConstantStructValueShaderCode: ${structValue.variableName} does not have the value of ${variableName}`);
                    continue;
                }
                const type = structDefinition.memberObjects[i].type;
                const isValidComponentNumber = Utility_1.default._isValidComponentCount(type, value);
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
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    __createAttributeDeclarationShaderCode() {
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
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    __createVaryingDeclarationShaderCode() {
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
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    //TODO: translate when glsl es1
    __createOutputColorDeclarationShaderCode() {
        if (this.__shaderStage !== 'fragment') {
            return '';
        }
        return `layout(location = 0) out vec4 ${this.__outputColorVariableName};\n\n`;
    }
    __createUniformDeclarationShaderCode() {
        let shaderCode = '';
        for (const uniform of this.__uniforms) {
            shaderCode += `uniform `;
            if (uniform.precision != null) {
                shaderCode += `${uniform.precision} `;
            }
            shaderCode += `${uniform.type} ${uniform.variableName};\n`;
        }
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    __createUniformStructDeclarationShaderCode() {
        let shaderCode = '';
        for (const uniformStruct of this.__uniformStructs) {
            const structName = uniformStruct.structName;
            const existStructDefinition = this.__structDefinitions.some(definition => definition.structName === structName);
            if (!existStructDefinition) {
                console.error(`__createUniformStructDeclarationShaderCode: the struct type ${structName} is not defined`);
                continue;
            }
            shaderCode += `uniform ${structName} ${uniformStruct.variableName};\n`;
        }
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    __createUniformBufferObjectShaderCode() {
        let shaderCode = '';
        for (const ubo of this.__uniformBufferObjects) {
            shaderCode += `layout (std140) uniform ${ubo.blockName} {\n`;
            for (let i = 0; i < ubo.variableObjects.length; i++) {
                const variableObj = ubo.variableObjects[i];
                shaderCode += `  ${variableObj.type} ${variableObj.variableName};\n`;
            }
            if (ubo.instanceName != null) {
                shaderCode += `} ${ubo.instanceName};\n`;
            }
            else {
                shaderCode += `};\n`;
            }
        }
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    __createFunctionDefinitionShaderCode() {
        let shaderCode = '';
        for (let i = 0; i < this.__functions.length; i++) {
            const functionObjects = this.__functions[i];
            for (let j = 0; j < functionObjects.length; j++) {
                shaderCode += functionObjects[j].functionCode + `\n`;
            }
        }
        return Utility_1.default._addLineFeedCodeIfNotNullString(shaderCode);
    }
    __createMainFunctionDefinitionShaderCode() {
        return this.__mainFunctionCode + `\n`;
    }
}
exports["default"] = ShaderityObjectCreator;


/***/ }),

/***/ "./src/main/Utility.ts":
/*!*****************************!*\
  !*** ./src/main/Utility.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Utility {
    static _splitByLineFeedCode(source) {
        return source.split(/\r\n|\n/);
    }
    static _joinSplittedLine(splittedLine) {
        return splittedLine.join('\n');
    }
    static _addLineFeedCodeIfNotNullString(source) {
        return source === '' ? source : source + '\n';
    }
    static _componentNumber(type) {
        let componentNumber;
        if (type === 'float' || type === 'int' || type === 'bool' || type === 'uint' ||
            type === 'sampler2D' || type === 'samplerCube' || type === 'sampler3D' || type === 'sampler2DArray' ||
            type === 'isampler2D' || type === 'isamplerCube' || type === 'isampler3D' || type === 'isampler2DArray' ||
            type === 'usampler2D' || type === 'usamplerCube' || type === 'usampler3D' || type === 'usampler2DArray' ||
            type === 'sampler2DShadow' || type === 'samplerCubeShadow' || type === 'sampler2DArrayShadow') {
            componentNumber = 1;
        }
        else if (type === 'vec2' || type === 'ivec2' || type === 'bvec2' || type === 'uvec2') {
            componentNumber = 2;
        }
        else if (type === 'vec3' || type === 'ivec3' || type === 'bvec3' || type === 'uvec3') {
            componentNumber = 3;
        }
        else if (type === 'vec4' || type === 'ivec4' || type === 'bvec4' || type === 'uvec4' || type === 'mat2' || type === 'mat2x2') {
            componentNumber = 4;
        }
        else if (type === 'mat2x3' || type === 'mat3x2') {
            componentNumber = 6;
        }
        else if (type === 'mat2x4' || type === 'mat4x2') {
            componentNumber = 8;
        }
        else if (type === 'mat3' || type === 'mat3x3') {
            componentNumber = 9;
        }
        else if (type === 'mat3x4' || type === 'mat4x3') {
            componentNumber = 12;
        }
        else if (type === 'mat4' || type === 'mat4x4') {
            componentNumber = 16;
        }
        else {
            // unknown type
            componentNumber = 0;
            console.error('Utility._componentNumber: detect unknown type');
        }
        return componentNumber;
    }
    static _isIntType(type) {
        if (type === 'int' || type === 'ivec2' || type === 'ivec3' || type === 'ivec4' ||
            type === 'uint' || type === 'uvec2' || type === 'uvec3' || type === 'uvec4') {
            return true;
        }
        else {
            return false;
        }
    }
    static _isValidComponentCount(type, values) {
        const validComponentCount = Utility._componentNumber(type);
        if (validComponentCount === values.length) {
            return true;
        }
        return false;
    }
    static _isSamplerType(type) {
        if (type === 'sampler2D' || type === 'samplerCube' || type === 'sampler3D' || type === 'sampler2DArray' ||
            type === 'isampler2D' || type === 'isamplerCube' || type === 'isampler3D' || type === 'isampler2DArray' ||
            type === 'usampler2D' || type === 'usamplerCube' || type === 'usampler3D' || type === 'usampler2DArray' ||
            type === 'sampler2DShadow' || type === 'samplerCubeShadow' || type === 'sampler2DArrayShadow') {
            return true;
        }
        else {
            return false;
        }
    }
}
exports["default"] = Utility;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q2xELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyx1QkFB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SSxLQUFLLFlBQVksSUFBSSxJQUFJLEtBQUssY0FBYyxJQUFJLElBQUksS0FBSyxZQUFZLElBQUksSUFBSSxLQUFLLGlCQUFpQjtZQUN2RyxJQUFJLEtBQUssaUJBQWlCLElBQUksSUFBSSxLQUFLLG1CQUFtQixJQUFJLElBQUksS0FBSyxzQkFBc0IsRUFDNUYsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQzthQUFNLENBQUM7WUFDUCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7SUFDRixDQUFDO0NBQ0Q7QUF4RkQsNkJBd0ZDOzs7Ozs7O1VDMUZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TaGFkZXJpdHkvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1NoYWRlcml0eS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9TaGFkZXJpdHkvLi9zcmMvbWFpbi9QcmVQcm9jZXNzb3IudHMiLCJ3ZWJwYWNrOi8vU2hhZGVyaXR5Ly4vc3JjL21haW4vUmVmbGVjdGlvbi50cyIsIndlYnBhY2s6Ly9TaGFkZXJpdHkvLi9zcmMvbWFpbi9TaGFkZXJFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vU2hhZGVyaXR5Ly4vc3JjL21haW4vU2hhZGVyVHJhbnNmb3JtZXIudHMiLCJ3ZWJwYWNrOi8vU2hhZGVyaXR5Ly4vc3JjL21haW4vU2hhZGVyaXR5LnRzIiwid2VicGFjazovL1NoYWRlcml0eS8uL3NyYy9tYWluL1NoYWRlcml0eU9iamVjdENyZWF0b3IudHMiLCJ3ZWJwYWNrOi8vU2hhZGVyaXR5Ly4vc3JjL21haW4vVXRpbGl0eS50cyIsIndlYnBhY2s6Ly9TaGFkZXJpdHkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vU2hhZGVyaXR5L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vU2hhZGVyaXR5L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9TaGFkZXJpdHkvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlNoYWRlcml0eVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTaGFkZXJpdHlcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiaW1wb3J0IFNoYWRlcml0eSBmcm9tICcuL21haW4vU2hhZGVyaXR5JztcclxuaW1wb3J0IF9TaGFkZXJpdHlPYmplY3RDcmVhdG9yIGZyb20gJy4vbWFpbi9TaGFkZXJpdHlPYmplY3RDcmVhdG9yJztcclxuaW1wb3J0IF9SZWZsZWN0aW9uIGZyb20gJy4vbWFpbi9SZWZsZWN0aW9uJztcclxuXHJcbmltcG9ydCB7XHJcbiAgQXR0cmlidXRlU2VtYW50aWNzIGFzIF9BdHRyaWJ1dGVTZW1hbnRpY3MsXHJcbiAgUmVmbGVjdGlvbkF0dHJpYnV0ZSBhcyBfUmVmbGVjdGlvbkF0dHJpYnV0ZSxcclxuICBSZWZsZWN0aW9uVW5pZm9ybSBhcyBfUmVmbGVjdGlvblVuaWZvcm0sXHJcbiAgUmVmbGVjdGlvblZhcnlpbmcgYXMgX1JlZmxlY3Rpb25WYXJ5aW5nLFxyXG4gIFNoYWRlcml0eU9iamVjdCBhcyBfU2hhZGVyaXR5T2JqZWN0LFxyXG4gIFNoYWRlckV4dGVuc2lvbkJlaGF2aW9yIGFzIF9TaGFkZXJFeHRlbnNpb25CZWhhdmlvcixcclxuICBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyBhcyBfU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMsXHJcbiAgU2hhZGVyUHJlY2lzaW9uT2JqZWN0IGFzIF9TaGFkZXJQcmVjaXNpb25PYmplY3QsXHJcbiAgU2hhZGVyU3RhZ2VTdHIgYXMgX1NoYWRlclN0YWdlU3RyLFxyXG4gIFNoYWRlclByZWNpc2lvblR5cGUgYXMgX1NoYWRlclByZWNpc2lvblR5cGUsXHJcbiAgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSBhcyBfU2hhZGVyQXR0cmlidXRlVmFyVHlwZSxcclxuICBTaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUgYXMgX1NoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSxcclxuICBTaGFkZXJWYXJ5aW5nVmFyVHlwZSBhcyBfU2hhZGVyVmFyeWluZ1ZhclR5cGUsXHJcbiAgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMgYXMgX1NoYWRlclVuaWZvcm1WYXJUeXBlRVMzLFxyXG4gIFNoYWRlclN0cnVjdE1lbWJlck9iamVjdCBhcyBfU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0LFxyXG4gIFNoYWRlclVCT1ZhcmlhYmxlT2JqZWN0IGFzIF9TaGFkZXJVQk9WYXJpYWJsZU9iamVjdCxcclxuICBTaGFkZXJBdHRyaWJ1dGVPYmplY3QgYXMgX1NoYWRlckF0dHJpYnV0ZU9iamVjdCxcclxuICBTaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0IGFzIF9TaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0LFxyXG4gIFNoYWRlckNvbnN0YW50VmFsdWVPYmplY3QgYXMgX1NoYWRlckNvbnN0YW50VmFsdWVPYmplY3QsXHJcbiAgU2hhZGVyRXh0ZW5zaW9uT2JqZWN0IGFzIF9TaGFkZXJFeHRlbnNpb25PYmplY3QsXHJcbiAgU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdCBhcyBfU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdCxcclxuICBTaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0IGFzIF9TaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0LFxyXG4gIFNoYWRlclVuaWZvcm1PYmplY3QgYXMgX1NoYWRlclVuaWZvcm1PYmplY3QsXHJcbiAgU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCBhcyBfU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCxcclxuICBTaGFkZXJWYXJ5aW5nT2JqZWN0IGFzIF9TaGFkZXJWYXJ5aW5nT2JqZWN0LFxyXG4gIFNoYWRlclZlcnNpb24gYXMgX1NoYWRlclZlcnNpb24sXHJcbiAgVGVtcGxhdGVPYmplY3QgYXMgX1RlbXBsYXRlT2JqZWN0LFxyXG4gIFVuaWZvcm1TZW1hbnRpY3MgYXMgX1VuaWZvcm1TZW1hbnRpY3MsXHJcbiAgVmFyVHlwZSBhcyBfVmFyVHlwZSxcclxufSBmcm9tICcuL3R5cGVzL3R5cGUnO1xyXG5cclxuZXhwb3J0IHtcclxuICBTaGFkZXJpdHlPYmplY3RDcmVhdG9yIGFzIF9TaGFkZXJpdHlPYmplY3RDcmVhdG9yLFxyXG4gIFJlZmxlY3Rpb24gYXMgX1JlZmxlY3Rpb24sXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEF0dHJpYnV0ZVNlbWFudGljcyA9IF9BdHRyaWJ1dGVTZW1hbnRpY3M7XHJcbmV4cG9ydCB0eXBlIFJlZmxlY3Rpb25BdHRyaWJ1dGUgPSBfUmVmbGVjdGlvbkF0dHJpYnV0ZTtcclxuZXhwb3J0IHR5cGUgUmVmbGVjdGlvblVuaWZvcm0gPSBfUmVmbGVjdGlvblVuaWZvcm07XHJcbmV4cG9ydCB0eXBlIFJlZmxlY3Rpb25WYXJ5aW5nID0gX1JlZmxlY3Rpb25WYXJ5aW5nO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJpdHlPYmplY3QgPSBfU2hhZGVyaXR5T2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJFeHRlbnNpb25CZWhhdmlvciA9IF9TaGFkZXJFeHRlbnNpb25CZWhhdmlvcjtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgPSBfU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzM7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclByZWNpc2lvbk9iamVjdCA9IF9TaGFkZXJQcmVjaXNpb25PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclN0YWdlU3RyID0gX1NoYWRlclN0YWdlU3RyO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJQcmVjaXNpb25UeXBlID0gX1NoYWRlclByZWNpc2lvblR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgPSBfU2hhZGVyQXR0cmlidXRlVmFyVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlID0gX1NoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmFyeWluZ1ZhclR5cGUgPSBfU2hhZGVyVmFyeWluZ1ZhclR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzID0gX1NoYWRlclVuaWZvcm1WYXJUeXBlRVMzO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3QgPSBfU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVQk9WYXJpYWJsZU9iamVjdCA9IF9TaGFkZXJVQk9WYXJpYWJsZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQXR0cmlidXRlT2JqZWN0ID0gX1NoYWRlckF0dHJpYnV0ZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdCA9IF9TaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0ID0gX1NoYWRlckNvbnN0YW50VmFsdWVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckV4dGVuc2lvbk9iamVjdCA9IF9TaGFkZXJFeHRlbnNpb25PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3QgPSBfU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdCA9IF9TaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVbmlmb3JtT2JqZWN0ID0gX1NoYWRlclVuaWZvcm1PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3QgPSBfU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmFyeWluZ09iamVjdCA9IF9TaGFkZXJWYXJ5aW5nT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJWZXJzaW9uID0gX1NoYWRlclZlcnNpb247XHJcbmV4cG9ydCB0eXBlIFRlbXBsYXRlT2JqZWN0ID0gX1RlbXBsYXRlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBVbmlmb3JtU2VtYW50aWNzID0gX1VuaWZvcm1TZW1hbnRpY3M7XHJcbmV4cG9ydCB0eXBlIFZhclR5cGUgPSBfVmFyVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciA9IF9TaGFkZXJpdHlPYmplY3RDcmVhdG9yO1xyXG5leHBvcnQgdHlwZSBSZWZsZWN0aW9uID0gX1JlZmxlY3Rpb247XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaGFkZXJpdHlcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlUHJvY2Vzc29yIHtcbiAgICBwcml2YXRlIHN0YXRpYyBkZWZpbml0aW9uczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAgIHByaXZhdGUgc3RhdGljIGV2YWx1YXRlQ29uZGl0aW9uKGNvbmRpdGlvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIOaVsOWApOavlOi8g+OBruato+imj+ihqOePvlxuICAgICAgICBjb25zdCBudW1lcmljQ29tcGFyaXNvbiA9IC8oXFx3KylcXHMqKD09fCE9fD58PHw+PXw8PSlcXHMqKFxcZCspL2c7XG4gICAgICAgIC8vIGRlZmluZWQoKeODgeOCp+ODg+OCr+OBruato+imj+ihqOePvlxuICAgICAgICBjb25zdCBkZWZpbmVkQ2hlY2sgPSAvZGVmaW5lZFxccypcXChcXHMqKFxcdyspXFxzKlxcKS9nO1xuICAgICAgICAvLyAhZGVmaW5lZCgp44OB44Kn44OD44Kv44Gu5q2j6KaP6KGo54++XG4gICAgICAgIGNvbnN0IG5vdERlZmluZWRDaGVjayA9IC8hXFxzKmRlZmluZWRcXHMqXFwoXFxzKihcXHcrKVxccypcXCkvZztcblxuICAgICAgICAvLyDmnaHku7blvI/jgpLoqZXkvqHlj6/og73jgarlvaLlvI/jgavlpInmj5tcbiAgICAgICAgbGV0IGV2YWx1YXRhYmxlQ29uZGl0aW9uID0gY29uZGl0aW9uO1xuXG4gICAgICAgIC8vIGRlZmluZWQoKeOBruipleS+oVxuICAgICAgICBldmFsdWF0YWJsZUNvbmRpdGlvbiA9IGV2YWx1YXRhYmxlQ29uZGl0aW9uLnJlcGxhY2UoZGVmaW5lZENoZWNrLCAoXywgbmFtZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbnMuaGFzKG5hbWUpID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIWRlZmluZWQoKeOBruipleS+oVxuICAgICAgICBldmFsdWF0YWJsZUNvbmRpdGlvbiA9IGV2YWx1YXRhYmxlQ29uZGl0aW9uLnJlcGxhY2Uobm90RGVmaW5lZENoZWNrLCAoXywgbmFtZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbnMuaGFzKG5hbWUpID8gJ2ZhbHNlJyA6ICd0cnVlJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5pWw5YCk5q+U6LyD44Gu6KmV5L6hXG4gICAgICAgIGV2YWx1YXRhYmxlQ29uZGl0aW9uID0gZXZhbHVhdGFibGVDb25kaXRpb24ucmVwbGFjZShudW1lcmljQ29tcGFyaXNvbiwgKG1hdGNoLCB2YXJOYW1lLCBvcGVyYXRvciwgdmFsdWVTdHIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlZmluZWRWYWx1ZSA9IHRoaXMuZGVmaW5pdGlvbnMuZ2V0KHZhck5hbWUpO1xuICAgICAgICAgICAgaWYgKGRlZmluZWRWYWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ2ZhbHNlJztcblxuICAgICAgICAgICAgY29uc3QgdmFsdWUxID0gcGFyc2VJbnQoZGVmaW5lZFZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlMiA9IHBhcnNlSW50KHZhbHVlU3RyKTtcblxuICAgICAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgICAgIGNhc2UgJz09JzogcmV0dXJuIHZhbHVlMSA9PT0gdmFsdWUyID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjYXNlICchPSc6IHJldHVybiB2YWx1ZTEgIT09IHZhbHVlMiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgY2FzZSAnPic6IHJldHVybiB2YWx1ZTEgPiB2YWx1ZTIgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgICAgICAgICAgICAgIGNhc2UgJzwnOiByZXR1cm4gdmFsdWUxIDwgdmFsdWUyID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjYXNlICc+PSc6IHJldHVybiB2YWx1ZTEgPj0gdmFsdWUyID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjYXNlICc8PSc6IHJldHVybiB2YWx1ZTEgPD0gdmFsdWUyID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gJ2ZhbHNlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g6KuW55CG5ryU566X5a2Q44Gu6KmV5L6hXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDlronlhajjgaroqZXkvqHjga7jgZ/jgoHjgIHmnaHku7blvI/jgpLmpJzoqLxcbiAgICAgICAgICAgIGlmICghL15bYS16QS1aMC05XFxzXFwoXFwpISZ8XSskLy50ZXN0KGV2YWx1YXRhYmxlQ29uZGl0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25kaXRpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6KuW55CG5ryU566X5a2Q44Gu5YmN5b6M44Gr44K544Oa44O844K544KS6L+95YqgXG4gICAgICAgICAgICBldmFsdWF0YWJsZUNvbmRpdGlvbiA9IGV2YWx1YXRhYmxlQ29uZGl0aW9uXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLyYmL2csICcgJiYgJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFx8XFx8L2csICcgfHwgJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvIS9nLCAnICEgJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCAnICcpXG4gICAgICAgICAgICAgICAgLnRyaW0oKTtcblxuICAgICAgICAgICAgLy8gSmF2YVNjcmlwdOOBruirlueQhuW8j+OBqOOBl+OBpuipleS+oVxuICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKGByZXR1cm4gJHtldmFsdWF0YWJsZUNvbmRpdGlvbn1gKSgpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZXZhbHVhdGluZyBjb25kaXRpb246JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBwcm9jZXNzKHNwbGl0dGVkTGluZXM6IHN0cmluZ1tdLCByZW1haW5EZWZpbmU6IGJvb2xlYW4sIGRlZmluaXRpb25zOiBzdHJpbmdbXSA9IFtdLCBzdGFydExpbmVTdHI/OiBzdHJpbmcsIGVuZExpbmVTdHI/OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IGRlZmluZSA9IC8jZGVmaW5lW1xcdCBdKyhcXHcrKSg/OltcXHQgXSsoXFxTKykpPy87XG4gICAgICAgIGNvbnN0IGlmZGVmID0gLyNpZmRlZltcXHQgXSsoXFx3KykvO1xuICAgICAgICBjb25zdCBpZm5kZWYgPSAvI2lmbmRlZltcXHQgXSsoXFx3KykvO1xuICAgICAgICBjb25zdCBfaWYgPSAvI2lmKD86XFxzK3woPz1cXCgpKSguKikvO1xuICAgICAgICBjb25zdCBlbGlmID0gLyNlbGlmKD86XFxzK3woPz1cXCgpKSguKikvO1xuICAgICAgICBjb25zdCBfZWxzZSA9IC8jZWxzZS87XG4gICAgICAgIGNvbnN0IGVuZGlmID0gLyNlbmRpZi87XG4gICAgICAgIGNvbnN0IHByZXZpb3VzT3V0cHV0U3RhdGVzOiBib29sZWFuW10gPSBbXTtcbiAgICAgICAgbGV0IG91dHB1dEZsZyA9IHRydWU7XG4gICAgICAgIGNvbnN0IGlmZGVmczogc3RyaW5nW11bXSA9IFtdO1xuICAgICAgICBjb25zdCBpZmRlZk1hdGNoZWQ6IGJvb2xlYW5bXSA9IFtdO1xuICAgICAgICBjb25zdCBvdXRwdXRMaW5lczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICB0aGlzLmRlZmluaXRpb25zLmNsZWFyKCk7XG4gICAgICAgIGZvciAoY29uc3QgZGVmaW5pdGlvbiBvZiBkZWZpbml0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5kZWZpbml0aW9ucy5zZXQoZGVmaW5pdGlvbiwgXCIxXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHN0YXJ0TGluZSA9IDA7XG4gICAgICAgIGxldCBlbmRMaW5lID0gc3BsaXR0ZWRMaW5lcy5sZW5ndGg7XG4gICAgICAgIGlmIChzdGFydExpbmVTdHIpIHtcbiAgICAgICAgICAgIHN0YXJ0TGluZSA9IHNwbGl0dGVkTGluZXMuZmluZEluZGV4KGxpbmUgPT4gbGluZS5pbmNsdWRlcyhzdGFydExpbmVTdHIpKTtcbiAgICAgICAgICAgIGlmIChzdGFydExpbmUgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwbGl0dGVkTGluZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZExpbmVTdHIpIHtcbiAgICAgICAgICAgIGVuZExpbmUgPSBzcGxpdHRlZExpbmVzLmZpbmRJbmRleChsaW5lID0+IGxpbmUuaW5jbHVkZXMoZW5kTGluZVN0cikpO1xuICAgICAgICAgICAgaWYgKGVuZExpbmUgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwbGl0dGVkTGluZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydExpbmU7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHNwbGl0dGVkTGluZXNbaV07XG4gICAgICAgICAgICBvdXRwdXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydExpbmU7IGkgPCBlbmRMaW5lOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBzcGxpdHRlZExpbmVzW2ldO1xuICAgICAgICAgICAgbGV0IGlzUHJhZ21hID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHsgLy8gI2RlZmluZVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlID0gbGluZS5tYXRjaChkZWZpbmUpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtfLCBuYW1lLCB2YWx1ZSA9IFwiMVwiXSA9IHJlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmluaXRpb25zLnNldChuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVtYWluRGVmaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ByYWdtYSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2lmZGVmLCAjaWZuZGVmLCAjaWZcbiAgICAgICAgICAgICAgICBjb25zdCByZUlmZGVmID0gbGluZS5tYXRjaChpZmRlZik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVJZm5kZWYgPSBsaW5lLm1hdGNoKGlmbmRlZik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVJZiA9IGxpbmUubWF0Y2goX2lmKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZUlmZGVmIHx8IHJlSWZuZGVmIHx8IHJlSWYpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNPdXRwdXRTdGF0ZXMucHVzaChvdXRwdXRGbGcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29uZGl0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAocmVJZmRlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uID0gYGRlZmluZWQoJHtyZUlmZGVmWzFdfSlgO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlSWZuZGVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb24gPSBgIWRlZmluZWQoJHtyZUlmbmRlZlsxXX0pYDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZUlmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb24gPSByZUlmWzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWZkZWZzLnB1c2goW2NvbmRpdGlvbl0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dEZsZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gdGhpcy5ldmFsdWF0ZUNvbmRpdGlvbihjb25kaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWZkZWZNYXRjaGVkLnB1c2gob3V0cHV0RmxnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmZGVmTWF0Y2hlZC5wdXNoKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpc1ByYWdtYSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB7IC8vICNlbGlmXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBsaW5lLm1hdGNoKGVsaWYpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHJlWzFdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SWZkZWZzID0gaWZkZWZzW2lmZGVmcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c091dHB1dFN0YXRlc1twcmV2aW91c091dHB1dFN0YXRlcy5sZW5ndGggLSAxXSAmJiAhaWZkZWZNYXRjaGVkW2lmZGVmTWF0Y2hlZC5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gdGhpcy5ldmFsdWF0ZUNvbmRpdGlvbihjb25kaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dEZsZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmZGVmTWF0Y2hlZFtpZmRlZk1hdGNoZWQubGVuZ3RoIC0gMV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudElmZGVmcy5wdXNoKGNvbmRpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2Vsc2VcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IGxpbmUubWF0Y2goX2Vsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c091dHB1dFN0YXRlc1twcmV2aW91c091dHB1dFN0YXRlcy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gIWlmZGVmTWF0Y2hlZFtpZmRlZk1hdGNoZWQubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpc1ByYWdtYSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB7IC8vICNlbmRpZlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlID0gbGluZS5tYXRjaChlbmRpZik7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gcHJldmlvdXNPdXRwdXRTdGF0ZXNbcHJldmlvdXNPdXRwdXRTdGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWZkZWZzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZmRlZk1hdGNoZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzT3V0cHV0U3RhdGVzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG91dHB1dEZsZyAmJiAhaXNQcmFnbWEpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBlbmRMaW5lOyBpIDwgc3BsaXR0ZWRMaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHNwbGl0dGVkTGluZXNbaV07XG4gICAgICAgICAgICBvdXRwdXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXRMaW5lcztcbiAgICB9XG59XG5cbiIsImltcG9ydCB7XG5cdEF0dHJpYnV0ZVNlbWFudGljcyxcblx0UmVmbGVjdGlvbkF0dHJpYnV0ZSxcblx0UmVmbGVjdGlvblVuaWZvcm0sXG5cdFJlZmxlY3Rpb25WYXJ5aW5nLFxuXHRTaGFkZXJTdGFnZVN0cixcblx0VW5pZm9ybVNlbWFudGljcyxcblx0VmFyVHlwZSxcbn0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBnZXRzIHRoZSBhdHRyaWJ1dGUsIHZhcnlpbmcsIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uIGZyb20gdGhlIGNvZGUgcHJvcGVydHkgb2YgYSBzaGFkZXJpdHkgb2JqZWN0LlxuICogVGhlIG1ldGhvZHMgb2YgdGhlIFNoYWRlcml0eSBpbnN0YW5jZSBjcmVhdGUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcy5cbiAqXG4gKiBCZWZvcmUgZ2V0dGluZyB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIGF0dHJpYnV0ZSwgdmFyeWluZywgYW5kIHVuaWZvcm0sIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZmxlY3Rpb24ge1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBhdHRyaWJ1dGVBbmRWYXJ5aW5nVHlwZVJlZ0V4cFxuXHRcdD0gL1tcXHQgXSsoZmxvYXR8aW50fHVpbnR8dmVjMnx2ZWMzfHZlYzR8bWF0MnxtYXQzfG1hdDR8aXZlYzJ8aXZlYzN8aXZlYzR8dXZlYzJ8dXZlYzN8dXZlYzQpW1xcdCBdKyhcXHcrKTsvO1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSB1bmlmb3JtVHlwZVJlZ0V4cFxuXHRcdD0gL1tcXHQgXSsoZmxvYXR8aW50fHVpbnR8dmVjMnx2ZWMzfHZlYzR8bWF0MnxtYXQzfG1hdDR8aXZlYzJ8aXZlYzN8aXZlYzR8dXZlYzJ8dXZlYzN8dXZlYzR8c2FtcGxlcjJEfHNhbXBsZXJDdWJlfHNhbXBsZXIzRClbXFx0IF0rKFxcdyspOy87XG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHNlbWFudGljUmVnRXhwID0gLzwuKnNlbWFudGljW1xcdCBdKj1bXFx0IF0qKFxcdyspLio+LztcblxuXHRwcml2YXRlIF9fYXR0cmlidXRlU2VtYW50aWNzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1TZW1hbnRpY3NNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXHRwcml2YXRlIF9fYXR0cmlidXRlczogUmVmbGVjdGlvbkF0dHJpYnV0ZVtdID0gW107XG5cdHByaXZhdGUgX192YXJ5aW5nczogUmVmbGVjdGlvblZhcnlpbmdbXSA9IFtdO1xuXHRwcml2YXRlIF9fdW5pZm9ybXM6IFJlZmxlY3Rpb25Vbmlmb3JtW10gPSBbXTtcblxuXHRwcml2YXRlIHJlYWRvbmx5IF9fc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXTtcblx0cHJpdmF0ZSByZWFkb25seSBfX3NoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cjtcblxuXHRjb25zdHJ1Y3RvcihzcGxpdHRlZFNoYWRlcml0eVNoYWRlckNvZGU6IHN0cmluZ1tdLCBzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHR0aGlzLl9fc3BsaXR0ZWRTaGFkZXJDb2RlID0gc3BsaXR0ZWRTaGFkZXJpdHlTaGFkZXJDb2RlO1xuXHRcdHRoaXMuX19zaGFkZXJTdGFnZSA9IHNoYWRlclN0YWdlO1xuXHRcdHRoaXMuX19zZXREZWZhdWx0QXR0cmlidXRlQW5kVW5pZm9ybVNlbWFudGljc01hcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYWxsIGF0dHJpYnV0ZSB2YXJpYWJsZSBpbmZvcm1hdGlvbiBpbiB0aGUgc2hhZGVyIGNvZGUuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBSZWZsZWN0aW9uQXR0cmlidXRlIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCBhdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiB0aGlzLl9fYXR0cmlidXRlcztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFsbCB2YXJ5aW5nIHZhcmlhYmxlIGluZm9ybWF0aW9uIGluIHRoZSBzaGFkZXIgY29kZS5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIFJlZmxlY3Rpb25WYXJ5aW5nIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCB2YXJ5aW5ncygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX3ZhcnlpbmdzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYWxsIHVuaWZvcm0gdmFyaWFibGUgaW5mb3JtYXRpb24gaW4gdGhlIHNoYWRlciBjb2RlLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgUmVmbGVjdGlvblVuaWZvcm0gb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHVuaWZvcm1zKCkge1xuXHRcdHJldHVybiB0aGlzLl9fdW5pZm9ybXM7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBuYW1lcyBvZiBhbGwgYXR0cmlidXRlcyBpbmNsdWRlZCBpbiB0aGUgc2hhZGVyLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2Ygc3RyaW5nXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGF0dHJpYnV0ZXNOYW1lcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtyZXR1cm4gYXR0cmlidXRlLm5hbWV9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIGF0dHJpYnV0ZSBzZW1hbnRpYyAoZS5nLiAnUE9TSVRJT04nKSBvZiBhbGwgYXR0cmlidXRlcyBpbmNsdWRlZCBpbiB0aGUgc2hhZGVyLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgQXR0cmlidXRlU2VtYW50aWNzIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCBhdHRyaWJ1dGVzU2VtYW50aWNzKCkge1xuXHRcdHJldHVybiB0aGlzLl9fYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge3JldHVybiBhdHRyaWJ1dGUuc2VtYW50aWN9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIHZhcmlhYmxlIHR5cGUgKGUuZy4gJ3ZlYzQnKSBvZiBhbGwgYXR0cmlidXRlcyBpbmNsdWRlZCBpbiB0aGUgc2hhZGVyLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgVmFyVHlwZSBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgYXR0cmlidXRlc1R5cGVzKCkge1xuXHRcdHJldHVybiB0aGlzLl9fYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge3JldHVybiBhdHRyaWJ1dGUudHlwZX0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhbiBhdHRyaWJ1dGVTZW1hbnRpY3MuXG5cdCAqIFRoZSBhdHRyaWJ1dGVTZW1hbnRpY3MgaXMgdXNlZCBpbiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpY3Ncblx0ICogKFNlZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGNsYXNzKVxuXHQgKi9cblx0cHVibGljIGFkZEF0dHJpYnV0ZVNlbWFudGljc01hcChtYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4pIHtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwID0gbmV3IE1hcChbLi4udGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcCwgLi4ubWFwXSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGEgdW5pZm9ybVNlbWFudGljcy5cblx0ICogVGhlIGF0dHJpYnV0ZVNlbWFudGljcyBpcyB1c2VkIGluIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljc1xuXHQgKiAoU2VlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgY2xhc3MpXG5cdCAqL1xuXHRwdWJsaWMgYWRkVW5pZm9ybVNlbWFudGljc01hcChtYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4pIHtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcCA9IG5ldyBNYXAoWy4uLnRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLCAuLi5tYXBdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYW4gYXR0cmlidXRlU2VtYW50aWNzLlxuXHQgKiBUaGUgYXR0cmlidXRlU2VtYW50aWNzIGlzIHVzZWQgaW4gdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWNzXG5cdCAqIChTZWUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBjbGFzcylcblx0ICovXG5cdHB1YmxpYyBhZGRBdHRyaWJ1dGVTZW1hbnRpY3Moa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldChrZXksIHZhbHVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYSB1bmlmb3JtU2VtYW50aWNzLlxuXHQgKiBUaGUgYXR0cmlidXRlU2VtYW50aWNzIGlzIHVzZWQgaW4gdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWNzXG5cdCAqIChTZWUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBjbGFzcylcblx0ICovXG5cdHB1YmxpYyBhZGRVbmlmb3JtU2VtYW50aWNzKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KGtleSwgdmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgYXR0cmlidXRlU2VtYW50aWNzXG5cdCAqL1xuXHRwdWJsaWMgcmVzZXRBdHRyaWJ1dGVTZW1hbnRpY3MoKSB7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB1bmlmb3JtU2VtYW50aWNzXG5cdCAqL1xuXHRwdWJsaWMgcmVzZXRVbmlmb3JtU2VtYW50aWNzKCkge1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBbmFseXplIHNoYWRlciBjb2RlIG9mIHRoZSBzaGFkZXJpdHkgYW5kIGdldCBpbmZvcm1hdGlvbiBvZiBhdHRyaWJ1dGUsIHZhcnlpbmcgYW5kIHVuaWZvcm0uXG5cdCAqIFRoZSBpbmZvcm1hdGlvbiBjYW4gYmUgcmV0cmlldmVkIGZyb20gdGhlIGdldCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICpcblx0ICogVGhlIHNlbWFudGljIHByb3BlcnR5IG9mIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlIGlzIGFzc2lnbmVkIHRvIHRoZSB2YWx1ZSBvZiB0aGUgc2VtYW50aWMgaWZcblx0ICogaXQgaXMgc3BlY2lmaWVkIGluIHRoZSBhdHRyaWJ1dGUgbGluZSBvZiB0aGUgc2hhZGVyIGNvZGUuIElmIG5vdCwgdGhlIEF0dHJpYnV0ZVNlbWFudGljc01hcFxuXHQgKiBpcyBzZWFyY2hlZCBmb3IgbWF0Y2hpbmcgc2VtYW50aWNzLCBvciBVTktOT1dOLiBUaGUgc2FtZSBhcHBsaWVzIHRvIHRoZSBzZW1hbnRpYyBwcm9wZXJ0eSBvZlxuXHQgKiBSZWZsZWN0aW9uVW5pZm9ybS5cblx0ICovXG5cdHB1YmxpYyByZWZsZWN0KCkge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IHRoaXMuX19zcGxpdHRlZFNoYWRlckNvZGU7XG5cdFx0Y29uc3Qgc2hhZGVyU3RhZ2UgPSB0aGlzLl9fc2hhZGVyU3RhZ2U7XG5cblx0XHRmb3IgKGNvbnN0IHNoYWRlckNvZGVMaW5lIG9mIHNwbGl0dGVkU2hhZGVyQ29kZSkge1xuXHRcdFx0Y29uc3QgaXNBdHRyaWJ1dGVMaW5lID0gdGhpcy5fX21hdGNoQXR0cmlidXRlKHNoYWRlckNvZGVMaW5lLCBzaGFkZXJTdGFnZSk7XG5cdFx0XHRpZiAoaXNBdHRyaWJ1dGVMaW5lKSB7XG5cdFx0XHRcdHRoaXMuX19hZGRBdHRyaWJ1dGUoc2hhZGVyQ29kZUxpbmUpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaXNWYXJ5aW5nTGluZSA9IHRoaXMuX19tYXRjaFZhcnlpbmcoc2hhZGVyQ29kZUxpbmUsIHNoYWRlclN0YWdlKTtcblx0XHRcdGlmIChpc1ZhcnlpbmdMaW5lKSB7XG5cdFx0XHRcdHRoaXMuX19hZGRWYXJ5aW5nKHNoYWRlckNvZGVMaW5lLCBzaGFkZXJTdGFnZSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpc1VuaWZvcm1MaW5lID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qdW5pZm9ybVtcXHQgXSsvKTtcblx0XHRcdGlmIChpc1VuaWZvcm1MaW5lKSB7XG5cdFx0XHRcdHRoaXMuX19hZGRVbmlmb3JtKHNoYWRlckNvZGVMaW5lKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfX3NldERlZmF1bHRBdHRyaWJ1dGVBbmRVbmlmb3JtU2VtYW50aWNzTWFwKCkge1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdwb3NpdGlvbicsICdQT1NJVElPTicpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdjb2xvciQnLCAnQ09MT1JfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdjb2xvcl8/MCcsICdDT0xPUl8wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RleGNvb3JkJCcsICdURVhDT09SRF8wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RleGNvb3JkXz8wJywgJ1RFWENPT1JEXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGV4Y29vcmRfPzEnLCAnVEVYQ09PUkRfMScpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0ZXhjb29yZF8/MicsICdURVhDT09SRF8yJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ25vcm1hbCcsICdOT1JNQUwnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGFuZ2VudCcsICdUQU5HRU5UJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2pvaW50JCcsICdKT0lOVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdib25lJCcsICdKT0lOVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdqb2ludF8/MCcsICdKT0lOVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdib25lXz8wJywgJ0pPSU5UU18wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3dlaWdodCQnLCAnV0VJR0hUU18wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3dlaWdodF8/MCcsICdXRUlHSFRTXzAnKTtcblxuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgnd29ybGRtYXRyaXgnLCAnV29ybGRNYXRyaXgnKTtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ25vcm1hbG1hdHJpeCcsICdOb3JtYWxNYXRyaXgnKTtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ3ZpZXdtYXRyaXgnLCAnVmlld01hdHJpeCcpO1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgncHJvamVjdGlvbm1hdHJpeCcsICdQcm9qZWN0aW9uTWF0cml4Jyk7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCdtb2RlbHZpZXdtYXRyaXgnLCAnTW9kZWxWaWV3TWF0cml4Jyk7XG5cdH1cblxuXHRwcml2YXRlIF9fbWF0Y2hBdHRyaWJ1dGUoc2hhZGVyQ29kZUxpbmU6IHN0cmluZywgc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0aWYgKHNoYWRlclN0YWdlICE9PSAndmVydGV4Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gc2hhZGVyQ29kZUxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qKGF0dHJpYnV0ZXxpbilbXFx0IF0rLis7Lyk7XG5cdH1cblxuXHRwcml2YXRlIF9fYWRkQXR0cmlidXRlKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcpIHtcblx0XHRjb25zdCByZWZsZWN0aW9uQXR0cmlidXRlOiBSZWZsZWN0aW9uQXR0cmlidXRlID0ge1xuXHRcdFx0bmFtZTogJycsXG5cdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0c2VtYW50aWM6ICdVTktOT1dOJ1xuXHRcdH07XG5cblx0XHRjb25zdCBtYXRjaFR5cGUgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLmF0dHJpYnV0ZUFuZFZhcnlpbmdUeXBlUmVnRXhwKTtcblx0XHRpZiAobWF0Y2hUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gbWF0Y2hUeXBlWzFdO1xuXHRcdFx0cmVmbGVjdGlvbkF0dHJpYnV0ZS50eXBlID0gdHlwZSBhcyBWYXJUeXBlO1xuXHRcdFx0Y29uc3QgbmFtZSA9IG1hdGNoVHlwZVsyXTtcblx0XHRcdHJlZmxlY3Rpb25BdHRyaWJ1dGUubmFtZSA9IG5hbWU7XG5cblx0XHRcdGNvbnN0IG1hdGNoU2VtYW50aWMgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLnNlbWFudGljUmVnRXhwKVxuXHRcdFx0aWYgKG1hdGNoU2VtYW50aWMpIHtcblx0XHRcdFx0cmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpYyA9IG1hdGNoU2VtYW50aWNbMV0gYXMgQXR0cmlidXRlU2VtYW50aWNzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXApIHtcblx0XHRcdFx0XHRpZiAobmFtZS5tYXRjaChuZXcgUmVnRXhwKGtleSwgJ2knKSkpIHtcblx0XHRcdFx0XHRcdHJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWMgPSB2YWx1ZSBhcyBBdHRyaWJ1dGVTZW1hbnRpY3M7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuX19hdHRyaWJ1dGVzLnB1c2gocmVmbGVjdGlvbkF0dHJpYnV0ZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fbWF0Y2hWYXJ5aW5nKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcsIHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdGlmIChzaGFkZXJTdGFnZSA9PT0gJ3ZlcnRleCcpIHtcblx0XHRcdHJldHVybiBzaGFkZXJDb2RlTGluZS5tYXRjaCgvXig/IVtcXC9dKVtcXHQgXSoodmFyeWluZ3xvdXQpW1xcdCBdKy4rOy8pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gc2hhZGVyQ29kZUxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qKHZhcnlpbmd8aW4pW1xcdCBdKy4rOy8pO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX19hZGRWYXJ5aW5nKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcsIHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdGNvbnN0IHJlZmxlY3Rpb25WYXJ5aW5nOiBSZWZsZWN0aW9uVmFyeWluZyA9IHtcblx0XHRcdG5hbWU6ICcnLFxuXHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdGlub3V0OiAnaW4nXG5cdFx0fTtcblxuXHRcdGNvbnN0IG1hdGNoVHlwZSA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24uYXR0cmlidXRlQW5kVmFyeWluZ1R5cGVSZWdFeHApO1xuXHRcdGlmIChtYXRjaFR5cGUpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBtYXRjaFR5cGVbMV07XG5cdFx0XHRyZWZsZWN0aW9uVmFyeWluZy50eXBlID0gdHlwZSBhcyBWYXJUeXBlO1xuXHRcdFx0Y29uc3QgbmFtZSA9IG1hdGNoVHlwZVsyXTtcblx0XHRcdHJlZmxlY3Rpb25WYXJ5aW5nLm5hbWUgPSBuYW1lO1xuXHRcdFx0cmVmbGVjdGlvblZhcnlpbmcuaW5vdXQgPSAoc2hhZGVyU3RhZ2UgPT09ICd2ZXJ0ZXgnKSA/ICdvdXQnIDogJ2luJztcblx0XHR9XG5cdFx0dGhpcy5fX3ZhcnlpbmdzLnB1c2gocmVmbGVjdGlvblZhcnlpbmcpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2FkZFVuaWZvcm0oc2hhZGVyQ29kZUxpbmU6IHN0cmluZykge1xuXHRcdGNvbnN0IHJlZmxlY3Rpb25Vbmlmb3JtOiBSZWZsZWN0aW9uVW5pZm9ybSA9IHtcblx0XHRcdG5hbWU6ICcnLFxuXHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdHNlbWFudGljOiAnVU5LTk9XTidcblx0XHR9O1xuXG5cdFx0Y29uc3QgbWF0Y2hUeXBlID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi51bmlmb3JtVHlwZVJlZ0V4cCk7XG5cdFx0aWYgKG1hdGNoVHlwZSkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IG1hdGNoVHlwZVsxXTtcblx0XHRcdHJlZmxlY3Rpb25Vbmlmb3JtLnR5cGUgPSB0eXBlIGFzIFZhclR5cGU7XG5cdFx0XHRjb25zdCBuYW1lID0gbWF0Y2hUeXBlWzJdO1xuXHRcdFx0cmVmbGVjdGlvblVuaWZvcm0ubmFtZSA9IG5hbWU7XG5cblx0XHRcdGNvbnN0IG1hdGNoU2VtYW50aWNzID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi5zZW1hbnRpY1JlZ0V4cClcblx0XHRcdGlmIChtYXRjaFNlbWFudGljcykge1xuXHRcdFx0XHRyZWZsZWN0aW9uVW5pZm9ybS5zZW1hbnRpYyA9IG1hdGNoU2VtYW50aWNzWzFdIGFzIFVuaWZvcm1TZW1hbnRpY3M7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgdGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXApIHtcblx0XHRcdFx0XHRpZiAobmFtZS5tYXRjaChuZXcgUmVnRXhwKGtleSwgJ2knKSkpIHtcblx0XHRcdFx0XHRcdHJlZmxlY3Rpb25Vbmlmb3JtLnNlbWFudGljID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuX191bmlmb3Jtcy5wdXNoKHJlZmxlY3Rpb25Vbmlmb3JtKTtcblx0fVxufTsiLCJpbXBvcnQge1RlbXBsYXRlT2JqZWN0fSBmcm9tICcuLi90eXBlcy90eXBlJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGVkaXRzIHRoZSBjb2RlIHByb3BlcnR5IG9mIGEgc2hhZGVyaXR5IG9iamVjdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhZGVyRWRpdG9yIHtcblx0c3RhdGljIF9pbnNlcnREZWZpbml0aW9uKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGRlZmluaXRpb246IHN0cmluZykge1xuXHRcdGNvbnN0IGRlZlN0ciA9IGRlZmluaXRpb24ucmVwbGFjZSgvI2RlZmluZVtcXHQgXSsvLCAnJyk7XG5cblx0XHRzcGxpdHRlZFNoYWRlckNvZGUudW5zaGlmdChgI2RlZmluZSAke2RlZlN0cn1gKTtcblx0fVxuXG5cdHN0YXRpYyBfZmlsbFRlbXBsYXRlKHNoYWRlckNvZGU6IHN0cmluZywgdGVtcGxhdGVPYmplY3Q6IFRlbXBsYXRlT2JqZWN0KSB7XG5cdFx0Y29uc3QgdGVtcGxhdGVTdHJpbmcgPSBzaGFkZXJDb2RlLnJlcGxhY2UoL1xcL1xcKltcXHQgXSpzaGFkZXJpdHk6W1xcdCBdKihAe1tcXHQgXSopKFxcUyspKFtcXHQgXSp9KVtcXHQgXSpcXCpcXC8vZywgJyR7dGhpcy4kMn0nKTtcblxuXHRcdGNvbnN0IHJlc3VsdENvZGUgPSBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gYFwiICsgdGVtcGxhdGVTdHJpbmcgKyBcImA7XCIpLmNhbGwodGVtcGxhdGVPYmplY3QpO1xuXHRcdHJldHVybiByZXN1bHRDb2RlO1xuXHR9XG59IiwiaW1wb3J0IHtTaGFkZXJWZXJzaW9ufSBmcm9tICcuLi90eXBlcy90eXBlJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGNvbnZlcnRzIHRoZSBjb2RlIHByb3BlcnR5IG9mIGEgc2hhZGVyaXR5IG9iamVjdCB0byB0aGUgc3BlY2lmaWVkIGZvcm1hdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhZGVyVHJhbnNmb3JtZXIge1xuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBFUzMgc2hhZGVyIGNvZGUgdG8gYSBHTFNMIEVTMSBzaGFkZXIgY29kZVxuXHQgKi9cblx0c3RhdGljIF90cmFuc2Zvcm1Ub0dMU0xFUzEoXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSxcblx0XHRpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuLFxuXHRcdGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW5cblx0KSB7XG5cdFx0dGhpcy5fX2NvbnZlcnRPckluc2VydFZlcnNpb25HTFNMRVMxKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX3JlbW92ZUVTM1F1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdHRoaXMuX19jb252ZXJ0SW4oc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyKTtcblx0XHR0aGlzLl9fY29udmVydE91dChzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdHRoaXMuX19yZW1vdmVQcmVjaXNpb25Gb3JFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmVGdW5jdGlvblRvRVMxKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlciwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUgPSBzcGxpdHRlZFNoYWRlckNvZGU7XG5cblx0XHRyZXR1cm4gdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGUgdG8gYSBHTFNMIEVTMyBzaGFkZXIgY29kZVxuXHQgKi9cblx0c3RhdGljIF90cmFuc2Zvcm1Ub0dMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbikge1xuXHRcdHRoaXMuX19jb252ZXJ0T3JJbnNlcnRWZXJzaW9uR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0QXR0cmlidXRlKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0dGhpcy5fX2NvbnZlcnRWYXJ5aW5nKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlQ3ViZShzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZTJEKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlMkRQcm9kKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlM0Qoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmUzRFByb2Qoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSA9IHNwbGl0dGVkU2hhZGVyQ29kZTtcblxuXHRcdHJldHVybiB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIHNoYWRlciBjb2RlIHRvIGEgc2hhZGVyIGNvZGUgb2Ygc3BlY2lmaWVkIEdMU0wgdmVyc2lvblxuXHQgKi9cblx0c3RhdGljIF90cmFuc2Zvcm1Ubyhcblx0XHR2ZXJzaW9uOiBTaGFkZXJWZXJzaW9uLFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0aXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbixcblx0XHRlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuXG5cdCkge1xuXHRcdGlmICh2ZXJzaW9uLm1hdGNoKC93ZWJnbDJ8ZXMzL2kpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdHJhbnNmb3JtVG9HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0fSBlbHNlIGlmICh2ZXJzaW9uLm1hdGNoKC93ZWJnbDF8ZXMxL2kpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdHJhbnNmb3JtVG9HTFNMRVMxKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlciwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgVmVyc2lvbicpXG5cdFx0XHRyZXR1cm4gc3BsaXR0ZWRTaGFkZXJDb2RlO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBJZiB0aGUgZmlyc3QgbGluZSBjb250YWlucyB2ZXJzaW9uIGluZm9ybWF0aW9uLCBvdmVyd3JpdGUgdGhlIGZpcnN0IGxpbmUgd2l0aCAnI3ZlcnNpb24gMTAwJy5cblx0ICogSWYgbm90LCBhZGQgJyN2ZXJzaW9uIDEwMCcgdG8gdGhlIGZpcnN0IGxpbmUuXG5cdCAqXG5cdCAqIE5vdGU6IElmIHRoZSBmaXJzdCBsaW5lIGlzIGNvbW1lbnRlZCBvdXQgYW5kIHRoZSB2ZXJzaW9uIGluZm9ybWF0aW9uIGlzIHdyaXR0ZW4gaW4gdGhlIHNlY29uZCBvciBsYXRlciBsaW5lLFxuXHQgKiB0aGUgYXBwcm9wcmlhdGUgdmVyc2lvbiBpbmZvcm1hdGlvbiB3aWxsIGJlIGFkZGVkIHRvIHRoZSBmaXJzdCBsaW5lIGFuZCB0aGUgdXNlci1kZWZpbmVkIHZlcnNpb24gaW5mb3JtYXRpb25cblx0ICogaW4gdGhlIHNlY29uZCBvciBsYXRlciBsaW5lIHdpbGwgYmUgcmVtb3ZlZC5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydE9ySW5zZXJ0VmVyc2lvbkdMU0xFUzEoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKiNbXFx0IF0qdmVyc2lvbltcXHQgXSsuKi87XG5cdFx0dGhpcy5fX3JlbW92ZUZpcnN0TWF0Y2hpbmdMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnKTtcblxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZS51bnNoaWZ0KCcjdmVyc2lvbiAxMDAnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBJZiB0aGUgZmlyc3QgbGluZSBjb250YWlucyB2ZXJzaW9uIGluZm9ybWF0aW9uLCBvdmVyd3JpdGUgdGhlIGZpcnN0IGxpbmUgd2l0aCAnI3ZlcnNpb24gMzAwIGVzJy5cblx0ICogSWYgbm90LCBhZGQgJyN2ZXJzaW9uIDMwMCBlcycgdG8gdGhlIGZpcnN0IGxpbmUuXG5cdCAqIEluIGJvdGggY2FzZXMsICcjZGVmaW5lIEdMU0xfRVMzJyB3aWxsIGJlIGluc2VydGVkIGluIHRoZSBzZWNvbmQgbGluZS5cblx0ICogVXNlIHRoZSAnI2RlZmluZSBHTFNMX0VTMycgZGlyZWN0aXZlIGlmIHlvdSB3YW50IHRvIHdyaXRlIGEgc2hhZGVyIGNvZGUgdGhhdCB3aWxsIG9ubHkgcnVuIGluIHRoZSBjYXNlIG9mIHdlYmdsMi5cblx0ICpcblx0ICogTm90ZTogSWYgdGhlIGZpcnN0IGxpbmUgaXMgY29tbWVudGVkIG91dCBhbmQgdGhlIHZlcnNpb24gaW5mb3JtYXRpb24gaXMgd3JpdHRlbiBpbiB0aGUgc2Vjb25kIG9yIGxhdGVyIGxpbmUsXG5cdCAqIHRoZSBhcHByb3ByaWF0ZSB2ZXJzaW9uIGluZm9ybWF0aW9uIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGZpcnN0IGxpbmUgYW5kIHRoZSB1c2VyLWRlZmluZWQgdmVyc2lvbiBpbmZvcm1hdGlvblxuXHQgKiBpbiB0aGUgc2Vjb25kIG9yIGxhdGVyIGxpbmUgd2lsbCBiZSByZW1vdmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0T3JJbnNlcnRWZXJzaW9uR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qI1tcXHQgXSp2ZXJzaW9uW1xcdCBdKy4qLztcblx0XHR0aGlzLl9fcmVtb3ZlRmlyc3RNYXRjaGluZ0xpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcpO1xuXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnVuc2hpZnQoJyNkZWZpbmUgR0xTTF9FUzMnKTtcblx0XHRzcGxpdHRlZFNoYWRlckNvZGUudW5zaGlmdCgnI3ZlcnNpb24gMzAwIGVzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ2luJyBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMxIHF1YWxpZmllcignYXR0cmlidXRlJyBvciAndmFyeWluZycpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRJbihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qaW5bXFx0IF0rKChoaWdocHxtZWRpdW1wfGxvd3B8KVtcXHQgXSpcXHcrW1xcdCBdKlxcdytbXFx0IF0qOykvO1xuXG5cdFx0bGV0IHJlcGxhY2VGdW5jO1xuXHRcdGlmIChpc0ZyYWdtZW50U2hhZGVyKSB7XG5cdFx0XHRyZXBsYWNlRnVuYyA9IGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiAndmFyeWluZyAnICsgcDE7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlcGxhY2VGdW5jID0gZnVuY3Rpb24gKG1hdGNoOiBzdHJpbmcsIHAxOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuICdhdHRyaWJ1dGUgJyArIHAxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgcmVwbGFjZUZ1bmMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIFwib3V0XCIgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgbW9kaWZ5IHRoZSBzaGFkZXIgY29kZS5cblx0ICogSWYgdGhlIHNoYWRlciBzdGFnZSBpcyB2ZXJ0ZXgsIHRoZSBcIm91dFwiIHF1YWxpZmllcnMgd2lsbCBiZSByZXBsYWNlZCBieSBcInZhcnlpbmdcIiBxdWFsaWZpZXIuXG5cdCAqIElmIHRoZSBzaGFkZXIgc3RhZ2UgaXMgZnJhZ21lbnQgYW5kIHRoZSBzaGFkZXIgaGFzIFwib3V0XCIgcXVhbGlmaWVycywgdGhlIFwib3V0XCIgcXVhbGlmaWVycyB3aWxsXG5cdCAqIGJlIGRlbGV0ZWQgYW5kIHRoZSB2YXJpYWJsZSBpcyB1c2VkIHRvIGFzc2lnbiBhIHZhbHVlIHRvIGdsX0ZyYWdDb2xvci5cblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydE91dChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0aWYgKGlzRnJhZ21lbnRTaGFkZXIpIHtcblx0XHRcdGNvbnN0IHZhcmlhYmxlTmFtZSA9IHRoaXMuX19yZW1vdmVPdXRRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdGlmICh2YXJpYWJsZU5hbWUgPT0gbnVsbCkge1xuXHRcdFx0XHQvLyBubyBvdXQgcXVhbGlmaWVyXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fX2FkZEdMRnJhZ0NvbG9yKHZhcmlhYmxlTmFtZSwgc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qb3V0W1xcdCBdKygoaGlnaHB8bWVkaXVtcHxsb3dwfClbXFx0IF0qXFx3K1tcXHQgXSpcXHcrW1xcdCBdKjspLztcblx0XHRcdGNvbnN0IHJlcGxhY2VGdW5jID0gZnVuY3Rpb24gKG1hdGNoOiBzdHJpbmcsIHAxOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuICd2YXJ5aW5nICcgKyBwMTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgcmVwbGFjZUZ1bmMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUaGlzIG1ldGhvZCBpcyBhIHBhcnQgb2YgX19jb252ZXJ0T3V0IG1ldGhvZC5cblx0ICogVGhpcyBtZXRob2QgZGVsZXRlcyB0aGUgXCJvdXRcIiBxdWFsaWZpZXJzIGFuZCBhZGRzIHRoZSBsaW5lIGZvciBhc3NpZ25pbmcgdG8gZ2xfRnJhZ0NvbG9yLlxuXHQgKiBJZiB0aGUgc2hhZGVyIGRvZXMgbm90IGhhdmUgdGhlIFwib3V0XCIgcXVhbGlmaWVycywgdGhpcyBtZXRob2QgZG9lcyBub3RoaW5nLlxuXHQgKi9cblxuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZU91dFF1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qb3V0W1xcdCBdKygoaGlnaHB8bWVkaXVtcHxsb3dwfClbXFx0IF0qXFx3K1tcXHQgXSooXFx3KylbXFx0IF0qOykvO1xuXG5cdFx0bGV0IHZhcmlhYmxlTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBtYXRjaCA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5tYXRjaChyZWcpO1xuXHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IG1hdGNoWzFdO1xuXHRcdFx0XHR2YXJpYWJsZU5hbWUgPSBtYXRjaFszXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhcmlhYmxlTmFtZTtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIF9fYWRkR0xGcmFnQ29sb3IodmFyaWFibGVOYW1lOiBzdHJpbmcsIHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRjb25zdCBjbG9zZUJyYWNrZXRSZWcgPSAvKC4qKVxcfVtcXG5cXHQgXSokLztcblx0XHRjb25zdCByZXR1cm5SZWcgPSAvW1xcblxcdCBdKnJldHVybltcXG5cXHQgXSo7Lztcblx0XHRjb25zdCBtYWluRnVuY1N0YXJ0UmVnID0gLyhefF4oPyFbXFwvXSlbXFx0XFxuIF0rKXZvaWRbXFx0XFxuIF0rbWFpbihbXFx0XFxuIF18XFwofCQpLztcblx0XHRjb25zdCBmcmFnQ29sb3JDb2RlID0gYCAgZ2xfRnJhZ0NvbG9yID0gJHt2YXJpYWJsZU5hbWV9O2A7XG5cblx0XHRsZXQgc2V0R2xGcmFnQ29sb3JJbkxhc3RMaW5lID0gZmFsc2U7XG5cdFx0Zm9yIChsZXQgaSA9IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblx0XHRcdGlmICghc2V0R2xGcmFnQ29sb3JJbkxhc3RMaW5lICYmIGxpbmUubWF0Y2goY2xvc2VCcmFja2V0UmVnKSkge1xuXHRcdFx0XHQvLyBhZGQgZ2xfRnJhZ0NvbG9yIHRvIGxhc3QgbGluZSBvZiBtYWluIGZ1bmN0aW9uXG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IGxpbmUucmVwbGFjZShjbG9zZUJyYWNrZXRSZWcsIGAkMVxcbiR7ZnJhZ0NvbG9yQ29kZX1cXG59XFxuYCk7XG5cdFx0XHRcdHNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChsaW5lLm1hdGNoKHJldHVyblJlZykpIHtcblx0XHRcdFx0Ly8gYWRkIGdsX0ZyYWdDb2xvciBqdXN0IGJlZm9yZSByZXR1cm5cblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnNwbGljZShpLCAwLCBmcmFnQ29sb3JDb2RlKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGxpbmUubWF0Y2gobWFpbkZ1bmNTdGFydFJlZykpIHtcblx0XHRcdFx0Ly8gYWRkIGdsX0ZyYWdDb2xvciBvbmx5IGluIHRoZSBtYWluIGZ1bmN0aW9uXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICghc2V0R2xGcmFnQ29sb3JJbkxhc3RMaW5lKSB7XG5cdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19yZW1vdmVPdXRRdWFsaWZpZXI6IE5vdCBmb3VuZCB0aGUgY2xvc2luZyBicmFja2V0cyBmb3IgdGhlIG1haW4gZnVuY3Rpb24nO1xuXHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aCwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgcXVhbGlmaWVyIGZvciBlczMgb25seSBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlbW92ZSBpdFxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVFUzNRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdHRoaXMuX19yZW1vdmVWYXJ5aW5nUXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0dGhpcy5fX3JlbW92ZUxheW91dChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIFwiZmxhdFwiIGFuZCBcInNtb290aFwiIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlbW92ZSBpdFxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVWYXJ5aW5nUXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSooZmxhdHxzbW9vdGgpW1xcdCBdKigoaW58b3V0KVtcXHQgXSsuKikvO1xuXHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX3JlbW92ZVZhcnlpbmdRdWFsaWZpZXI6IGdsc2wgZXMxIGRvZXMgbm90IHN1cHBvcnQgZmxhdCBxdWFsaWZpZXInO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5yZXBsYWNlKHJlZywgKG1hdGNoOiBzdHJpbmcsIHAxOiBzdHJpbmcsIHAyOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0aWYgKHAxID09PSAnZmxhdCcpIHtcblx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpICsgMSwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHAyO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIFwibGF5b3V0XCIgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVtb3ZlIGl0XG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZUxheW91dChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qbGF5b3V0W1xcdCBdKlxcKFtcXHQgXSpsb2NhdGlvbltcXHQgXSpcXD1bXFx0IF0qXFxkW1xcdCBdKlxcKVtcXHQgXSsvZztcblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcInByZWNpc2lvblwiIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlbW92ZSBpdCBpZiB0aGUgXCJwcmVjaXNpb25cIiBxdWFsaWZpZXIgaXMgdmFsaWQgZm9yIG9ubHkgR0xTTCBFUzNcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlUHJlY2lzaW9uRm9yRVMzKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSpwcmVjaXNpb25bXFx0IF0rKGhpZ2hwfG1lZGl1bXB8bG93cClbXFx0IF0rKFxcdyspW1xcdCBdKjsvO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IG1hdGNoID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLm1hdGNoKHJlZyk7XG5cdFx0XHRpZiAobWF0Y2ggIT0gbnVsbCkge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0bWF0Y2hbMl0gPT09ICdpbnQnIHx8XG5cdFx0XHRcdFx0bWF0Y2hbMl0gPT09ICdmbG9hdCcgfHxcblx0XHRcdFx0XHRtYXRjaFsyXSA9PT0gJ3NhbXBsZXIyRCcgfHxcblx0XHRcdFx0XHRtYXRjaFsyXSA9PT0gJ3NhbXBsZXJDdWJlJ1xuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHQvLyB0aGVzZSBwcmVjaXNpb25zIGFyZSBzdXBwb3J0ZWQgaW4gZXMxXG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnNwbGljZShpLS0sIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIFwidGV4dHVyZVwiIGFuZCBcInRleHR1cmVQcm9qXCIgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmRcblx0ICogcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMSBtZXRob2QoJ3RleHR1cmUyRCcsICd0ZXh0dXJlMkQnLCBhbmQgc28gb24pXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlRnVuY3Rpb25Ub0VTMShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWdUZXh0dXJlUHJvaiA9IG5ldyBSZWdFeHAoYCgke3NibH0rKXRleHR1cmVQcm9qKExvZHwpKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZWdUZXh0dXJlID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspdGV4dHVyZShMb2R8KSgke3NibH0rKWAsICdnJyk7XG5cblx0XHRsZXQgYXJndW1lbnRTYW1wbGVyTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkO1xuXHRcdGNvbnN0IHVuaWZvcm1TYW1wbGVyTWFwID0gdGhpcy5fX2NyZWF0ZVVuaWZvcm1TYW1wbGVyTWFwKHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cblx0XHRcdGNvbnN0IG1hdGNoVGV4dHVyZVByb2ogPSBsaW5lLm1hdGNoKC90ZXh0dXJlUHJvaihMb2R8KVtcXHQgXSpcXChbXFx0IF0qKFxcdyspLC8pO1xuXHRcdFx0aWYgKG1hdGNoVGV4dHVyZVByb2opIHtcblx0XHRcdFx0YXJndW1lbnRTYW1wbGVyTWFwID0gYXJndW1lbnRTYW1wbGVyTWFwID8/IHRoaXMuX19jcmVhdGVBcmd1bWVudFNhbXBsZXJNYXAoXG5cdFx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLFxuXHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0ZW1iZWRFcnJvcnNJbk91dHB1dFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGNvbnN0IGlzTG9kTWV0aG9kID0gbWF0Y2hUZXh0dXJlUHJvalsxXSA9PT0gJ0xvZCc7XG5cdFx0XHRcdGNvbnN0IGV4dGVuc2lvblN0ciA9IGlzRnJhZ21lbnRTaGFkZXIgJiYgaXNMb2RNZXRob2QgPyBgRVhUYCA6IGBgO1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSBtYXRjaFRleHR1cmVQcm9qWzJdO1xuXHRcdFx0XHRjb25zdCBzYW1wbGVyVHlwZSA9IGFyZ3VtZW50U2FtcGxlck1hcD8uZ2V0KHZhcmlhYmxlTmFtZSkgPz8gdW5pZm9ybVNhbXBsZXJNYXAuZ2V0KHZhcmlhYmxlTmFtZSk7XG5cdFx0XHRcdGlmIChzYW1wbGVyVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKHNhbXBsZXJUeXBlID09PSAnc2FtcGxlcjJEJykge1xuXHRcdFx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLnJlcGxhY2UocmVnVGV4dHVyZVByb2osIGAkMXRleHR1cmUyRFByb2okMiR7ZXh0ZW5zaW9uU3RyfSQzYCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX2NvbnZlcnRUZXh0dXJlRnVuY3Rpb25Ub0VTMTogZG8gbm90IHN1cHBvcnQgJyArIHNhbXBsZXJUeXBlICsgJyB0eXBlJztcblx0XHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGksIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBtYXRjaFRleHR1cmUgPSBsaW5lLm1hdGNoKC90ZXh0dXJlKExvZHwpW1xcdCBdKlxcKFtcXHQgXSooXFx3KyksLyk7XG5cdFx0XHRpZiAobWF0Y2hUZXh0dXJlKSB7XG5cdFx0XHRcdGFyZ3VtZW50U2FtcGxlck1hcCA9IGFyZ3VtZW50U2FtcGxlck1hcCA/PyB0aGlzLl9fY3JlYXRlQXJndW1lbnRTYW1wbGVyTWFwKFxuXHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZSxcblx0XHRcdFx0XHRpLFxuXHRcdFx0XHRcdGVtYmVkRXJyb3JzSW5PdXRwdXRcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRjb25zdCBpc0xvZE1ldGhvZCA9IG1hdGNoVGV4dHVyZVsxXSA9PT0gJ0xvZCc7XG5cdFx0XHRcdGNvbnN0IGV4dGVuc2lvblN0ciA9IGlzRnJhZ21lbnRTaGFkZXIgJiYgaXNMb2RNZXRob2QgPyBgRVhUYCA6IGBgO1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSBtYXRjaFRleHR1cmVbMl07XG5cdFx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlID0gYXJndW1lbnRTYW1wbGVyTWFwPy5nZXQodmFyaWFibGVOYW1lKSA/PyB1bmlmb3JtU2FtcGxlck1hcC5nZXQodmFyaWFibGVOYW1lKTtcblx0XHRcdFx0aWYgKHNhbXBsZXJUeXBlICE9IG51bGwpIHtcblx0XHRcdFx0XHRsZXQgdGV4dHVyZUZ1bmM6IHN0cmluZztcblx0XHRcdFx0XHRpZiAoc2FtcGxlclR5cGUgPT09ICdzYW1wbGVyMkQnKSB7XG5cdFx0XHRcdFx0XHR0ZXh0dXJlRnVuYyA9ICd0ZXh0dXJlMkQnO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc2FtcGxlclR5cGUgPT09ICdzYW1wbGVyQ3ViZScpIHtcblx0XHRcdFx0XHRcdHRleHR1cmVGdW5jID0gJ3RleHR1cmVDdWJlJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGV4dHVyZUZ1bmMgPSAnJztcblx0XHRcdFx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX2NvbnZlcnRUZXh0dXJlRnVuY3Rpb25Ub0VTMTogZG8gbm90IHN1cHBvcnQgJyArIHNhbXBsZXJUeXBlICsgJyB0eXBlJztcblx0XHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGksIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHRleHR1cmVGdW5jICE9PSAnJykge1xuXHRcdFx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLnJlcGxhY2UocmVnVGV4dHVyZSwgYCQxJHt0ZXh0dXJlRnVuY30kMiR7ZXh0ZW5zaW9uU3RyfSQzYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpc0Jsb2NrRW5kID0gISFsaW5lLm1hdGNoKC9cXH0vKTtcblx0XHRcdGlmIChpc0Jsb2NrRW5kKSB7XG5cdFx0XHRcdGFyZ3VtZW50U2FtcGxlck1hcCA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVGhpcyBtZXRob2QgZmluZHMgdW5pZm9ybSBkZWNsYXJhdGlvbnMgb2Ygc2FtcGxlciB0eXBlcyBpbiB0aGUgc2hhZGVyIGFuZFxuXHQgKiBjcmVhdGVzIGEgbWFwIHdpdGggdmFyaWFibGUgbmFtZXMgYXMga2V5cyBhbmQgdHlwZXMgYXMgdmFsdWVzLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jcmVhdGVVbmlmb3JtU2FtcGxlck1hcChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgdW5pZm9ybVNhbXBsZXJNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblx0XHRcdGNvbnN0IG1hdGNoID0gbGluZS5tYXRjaCgvXig/IVtcXC9dKVtcXHQgXSp1bmlmb3JtKltcXHQgXSooaGlnaHB8bWVkaXVtcHxsb3dwfClbXFx0IF0qKHNhbXBsZXJcXHcrKVtcXHQgXSsoXFx3KykvKTtcblx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRjb25zdCBzYW1wbGVyVHlwZSA9IG1hdGNoWzJdO1xuXHRcdFx0XHRjb25zdCBuYW1lID0gbWF0Y2hbM107XG5cdFx0XHRcdGlmICh1bmlmb3JtU2FtcGxlck1hcC5nZXQobmFtZSkpIHtcblx0XHRcdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19jcmVhdGVVbmlmb3JtU2FtcGxlck1hcDogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUnO1xuXHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGksIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dW5pZm9ybVNhbXBsZXJNYXAuc2V0KG5hbWUsIHNhbXBsZXJUeXBlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHVuaWZvcm1TYW1wbGVyTWFwO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRoaXMgbWV0aG9kIGZpbmRzIHNhbXBsZXIgdHlwZXMgZnJvbSB0aGUgZnVuY3Rpb24gYXJndW1lbnRzIGFuZFxuXHQgKiBjcmVhdGVzIGEgbWFwIHdpdGggdmFyaWFibGUgbmFtZXMgYXMga2V5cyBhbmQgdHlwZXMgYXMgdmFsdWVzLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jcmVhdGVBcmd1bWVudFNhbXBsZXJNYXAoXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSxcblx0XHRsaW5lSW5kZXg6IG51bWJlcixcblx0XHRlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuXG5cdCkge1xuXHRcdGNvbnN0IGFyZ3VtZW50U2FtcGxlck1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuXHRcdGZvciAobGV0IGkgPSBsaW5lSW5kZXg7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXG5cdFx0XHRjb25zdCBpc0Jsb2NrU3RhcnRMaW5lID0gISFsaW5lLm1hdGNoKC9cXHsvKTtcblx0XHRcdGlmICghaXNCbG9ja1N0YXJ0TGluZSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYnJhY2tldFNlY3Rpb25Db2RlID0gdGhpcy5fX2dldEJyYWNrZXRTZWN0aW9uKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSk7XG5cblx0XHRcdGNvbnN0IGlubmVyQnJhY2tldFNlY3Rpb25Db2RlID0gYnJhY2tldFNlY3Rpb25Db2RlLm1hdGNoKC8uKlxcKCguKilcXCkvKT8uWzFdO1xuXHRcdFx0aWYgKGlubmVyQnJhY2tldFNlY3Rpb25Db2RlID09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB2YXJpYWJsZUNhbmRpZGF0ZXMgPSBpbm5lckJyYWNrZXRTZWN0aW9uQ29kZS5zcGxpdCgnLCcpO1xuXHRcdFx0Y29uc3Qgc2FtcGxlclR5cGVEZWZpbml0aW9uUmVnID0gL1tcXG5cXHQgXSooaGlnaHB8bWVkaXVtcHxsb3dwfClbXFxuXFx0IF0qKHNhbXBsZXJcXHcrKVtcXG5cXHQgXSooXFx3KylbXFxuXFx0IF0qLztcblxuXHRcdFx0Y29uc3QgaXNGdW5jdGlvbkJyYWNrZXQgPSAhISh2YXJpYWJsZUNhbmRpZGF0ZXNbMF0ubWF0Y2goc2FtcGxlclR5cGVEZWZpbml0aW9uUmVnKSA/PyB2YXJpYWJsZUNhbmRpZGF0ZXNbMF0ubWF0Y2goL15bXFxuXFx0IF0qJC8pKTtcblx0XHRcdGlmICghaXNGdW5jdGlvbkJyYWNrZXQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoY29uc3QgdmFyaWFibGVDYW5kaWRhdGUgb2YgdmFyaWFibGVDYW5kaWRhdGVzKSB7XG5cdFx0XHRcdGNvbnN0IHNhbXBsZXJWYXJpYWJsZU1hdGNoID0gdmFyaWFibGVDYW5kaWRhdGUubWF0Y2goc2FtcGxlclR5cGVEZWZpbml0aW9uUmVnKTtcblx0XHRcdFx0aWYgKHNhbXBsZXJWYXJpYWJsZU1hdGNoID09IG51bGwpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBzYW1wbGVyVHlwZSA9IHNhbXBsZXJWYXJpYWJsZU1hdGNoWzJdO1xuXHRcdFx0XHRjb25zdCBuYW1lID0gc2FtcGxlclZhcmlhYmxlTWF0Y2hbM107XG5cdFx0XHRcdGlmIChhcmd1bWVudFNhbXBsZXJNYXAuZ2V0KG5hbWUpKSB7XG5cdFx0XHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fY3JlYXRlQXJndW1lbnRTYW1wbGVyTWFwOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSc7XG5cdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhcmd1bWVudFNhbXBsZXJNYXAuc2V0KG5hbWUsIHNhbXBsZXJUeXBlKTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyZ3VtZW50U2FtcGxlck1hcDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBwYXJ0IGVuY2xvc2VkIGluIGJyYWNrZXRzKD0gJygpJykuXG5cdCAqIEZvciBleGFtcGxlLCB5b3UgY2FuIGdldCBsaW5lcyB0aGF0IGNvbnRhaW4gZnVuY3Rpb24gYXJndW1lbnRzLCBjb25kaXRpb25hbCBleHByZXNzaW9ucyBmb3IgaWYgc3RhdGVtZW50cywgZXRjLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19nZXRCcmFja2V0U2VjdGlvbihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBicmFja2V0RW5kSW5kZXg6IG51bWJlcikge1xuXHRcdGxldCBicmFja2V0U3RhcnRJbmRleCA9IDA7XG5cdFx0Zm9yIChsZXQgaiA9IGJyYWNrZXRFbmRJbmRleDsgaiA+PSAwOyBqLS0pIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbal07XG5cdFx0XHRjb25zdCBpc0JyYWNrZXRTdGFydE1hdGNoID0gISFsaW5lLm1hdGNoKC9cXCgvKTtcblx0XHRcdGlmIChpc0JyYWNrZXRTdGFydE1hdGNoKSB7XG5cdFx0XHRcdGJyYWNrZXRTdGFydEluZGV4ID0gajtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IGNvbnRhaW5CcmFja2V0Q29kZSA9ICcnO1xuXHRcdGZvciAobGV0IGogPSBicmFja2V0U3RhcnRJbmRleDsgaiA8PSBicmFja2V0RW5kSW5kZXg7IGorKykge1xuXHRcdFx0Y29udGFpbkJyYWNrZXRDb2RlICs9IHNwbGl0dGVkU2hhZGVyQ29kZVtqXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29udGFpbkJyYWNrZXRDb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICdhdHRyaWJ1dGUnIHF1YWxpZmllciBpbiB0aGUgdmVydGV4IHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIHF1YWxpZmllcignaW4nKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0QXR0cmlidXRlKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4pIHtcblx0XHRpZiAoaXNGcmFnbWVudFNoYWRlcikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKmF0dHJpYnV0ZVtcXHQgXSsvZztcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ2luICc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsIHJlcGxhY2VTdHIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd2YXJ5aW5nJyBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIHF1YWxpZmllcignaW4nIG9yICdvdXQnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VmFyeWluZyhzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qdmFyeWluZ1tcXHQgXSsvZztcblx0XHRjb25zdCByZXBsYWNlU3RyID0gaXNGcmFnbWVudFNoYWRlciA/ICdpbiAnIDogJ291dCAnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCByZXBsYWNlU3RyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZUN1YmUnIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmVDdWJlKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlQ3ViZSkoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZSc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmUyRCcgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmUnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZTJEKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlMkQpKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmUnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlMkRQcm9qJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZVByb2onKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZTJEUHJvZChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZTJEUHJvaikoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZVByb2onO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlM0QnIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmUzRChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZTNEKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZTNEUHJvaicgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmVQcm9qJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmUzRFByb2Qoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmUzRFByb2opKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmVQcm9qJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIF9fcmVnU3ltYm9scygpIHtcblx0XHRyZXR1cm4gYFshXCIjJCUmJygpXFwqXFwrXFwtXFwuLFxcLzo7PD0+P0BcXFtcXFxcXFxdXmAgKyAnYHt8fX5cXHRcXG4gXSc7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIHJlZzogUmVnRXhwLCByZXBsYWNlbWVudDogYW55KSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5yZXBsYWNlKHJlZywgcmVwbGFjZW1lbnQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlRmlyc3RNYXRjaGluZ0xpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgcmVnOiBSZWdFeHApIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5tYXRjaChyZWcpKSB7XG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIF9fb3V0RXJyb3IoXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSxcblx0XHRsaW5lSW5kZXg6IG51bWJlcixcblx0XHRlcnJvck1lc3NhZ2U6IHN0cmluZyxcblx0XHRlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuXG5cdCkge1xuXHRcdGlmIChlbWJlZEVycm9yc0luT3V0cHV0KSB7XG5cdFx0XHRjb25zdCBzaGFkZXJPdXRwdXRNZXNzYWdlID0gYC8vIGxpbmUgJHtsaW5lSW5kZXh9OiAke2Vycm9yTWVzc2FnZX1cXG5gO1xuXHRcdFx0Y29uc3QgY2xvc2VCcmFja2V0UmVnID0gLyguKilcXH1bXFxuXFx0IF0qJC87XG5cdFx0XHRmb3IgKGxldCBpID0gc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cdFx0XHRcdGlmIChsaW5lLm1hdGNoKGNsb3NlQnJhY2tldFJlZykpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzcGxpdHRlZFNoYWRlckNvZGVbaV0gPT09IHNoYWRlck91dHB1dE1lc3NhZ2UpIHtcblx0XHRcdFx0XHQvLyBhdm9pZCBkdXBsaWNhdGUgZXJyb3IgbWVzc2FnZVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZSk7XG5cdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUucHVzaChzaGFkZXJPdXRwdXRNZXNzYWdlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG5cdFx0fVxuXHR9XG59XG4iLCJpbXBvcnQgUmVmbGVjdGlvbiBmcm9tICcuL1JlZmxlY3Rpb24nO1xuaW1wb3J0IHtTaGFkZXJpdHlPYmplY3QsIFNoYWRlclN0YWdlU3RyLCBTaGFkZXJWZXJzaW9uLCBUZW1wbGF0ZU9iamVjdH0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5pbXBvcnQgU2hhZGVyVHJhbnNmb3JtZXIgZnJvbSAnLi9TaGFkZXJUcmFuc2Zvcm1lcic7XG5pbXBvcnQgU2hhZGVyRWRpdG9yIGZyb20gJy4vU2hhZGVyRWRpdG9yJztcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSc7XG5pbXBvcnQgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciBmcm9tICcuL1NoYWRlcml0eU9iamVjdENyZWF0b3InO1xuaW1wb3J0IFByZVByb2Nlc3NvciBmcm9tICcuL1ByZVByb2Nlc3Nvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYWRlcml0eSB7XG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBzaGFkZXIgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8qKlxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIEVTMyBzaGFkZXIgY29kZSB0byBhIEdMU0wgRVMxIHNoYWRlciBjb2RlXG5cdCAqIEBwYXJhbSBvYmogU2hhZGVyaXR5IG9iamVjdCB0byB0cmFuc2xhdGUgdG8gZ2xzbCBlczFcblx0ICogQHBhcmFtIGVtYmVkRXJyb3JzSW5PdXRwdXQgSWYgdHJ1ZSwgd2hlbiB0aGVyZSBpcyBhbiBlcnJvciBpbiB0aGUgY29udmVyc2lvbixcblx0ICogICAgdGhlIGVycm9yIGFuZCB0aGUgbnVtYmVyIG9mIGxpbmVzIGFyZSBvdXRwdXQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgcmV0dXJuXG5cdCAqICAgIHZhbHVlIFNoYWRlcml0eU9iamVjdC5jb2RlLiBJZiBmYWxzZSwgdGhyb3cgYW4gZXJyb3IuXG5cdCAqIEByZXR1cm5zIFNoYWRlcml0eU9iamVjdCB3aG9zZSBjb2RlIHByb3BlcnR5IGlzIHRoZSBzaGFkZXIgY29kZSBmb3IgR0xTTCBFUzFcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtVG9HTFNMRVMxKG9iajogU2hhZGVyaXR5T2JqZWN0LCBlbWJlZEVycm9yc0luT3V0cHV0ID0gZmFsc2UpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlXG5cdFx0XHQ9IFNoYWRlclRyYW5zZm9ybWVyLl90cmFuc2Zvcm1Ub0dMU0xFUzEoXG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZSxcblx0XHRcdFx0b2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0XHRcdGVtYmVkRXJyb3JzSW5PdXRwdXRcblx0XHRcdCk7XG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUodHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0Y29uc3QgcmVzdWx0T2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiByZXN1bHRDb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gcmVzdWx0T2JqO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMxIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzMgc2hhZGVyIGNvZGVcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtVG9HTFNMRVMzKG9iajogU2hhZGVyaXR5T2JqZWN0KSB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZVxuXHRcdFx0PSBTaGFkZXJUcmFuc2Zvcm1lci5fdHJhbnNmb3JtVG9HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZSwgb2JqLmlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdGNvbnN0IHJlc3VsdENvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdGNvbnN0IHJlc3VsdE9iajogU2hhZGVyaXR5T2JqZWN0ID0ge1xuXHRcdFx0Y29kZTogcmVzdWx0Q29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHJlc3VsdE9iajtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIHNoYWRlciBjb2RlIHRvIGEgc2hhZGVyIGNvZGUgb2Ygc3BlY2lmaWVkIEdMU0wgdmVyc2lvblxuXHQgKi9cblx0cHVibGljIHN0YXRpYyB0cmFuc2Zvcm1Ubyh2ZXJzaW9uOiBTaGFkZXJWZXJzaW9uLCBvYmo6IFNoYWRlcml0eU9iamVjdCwgZW1iZWRFcnJvcnNJbk91dHB1dCA9IGZhbHNlKSB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZVxuXHRcdFx0PSBTaGFkZXJUcmFuc2Zvcm1lci5fdHJhbnNmb3JtVG8oXG5cdFx0XHRcdHZlcnNpb24sXG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZSxcblx0XHRcdFx0b2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0XHRcdGVtYmVkRXJyb3JzSW5PdXRwdXRcblx0XHRcdCk7XG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUodHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0Y29uc3QgcmVzdWx0T2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiByZXN1bHRDb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gcmVzdWx0T2JqO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBwcm9jZXNzUHJhZ21hKG9iajogU2hhZGVyaXR5T2JqZWN0LCByZW1haW5EZWZpbmU6IGJvb2xlYW4sIGRlZmluaXRpb25zOiBzdHJpbmdbXSA9IFtdLCBzdGFydExpbmVTdHI/OiBzdHJpbmcsIGVuZExpbmVTdHI/OiBzdHJpbmcpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlXG5cdFx0XHQ9IFByZVByb2Nlc3Nvci5wcm9jZXNzKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVtYWluRGVmaW5lLCBkZWZpbml0aW9ucywgc3RhcnRMaW5lU3RyLCBlbmRMaW5lU3RyKTtcblxuXHRcdGNvbnN0IHJlc3VsdENvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdGNvbnN0IHJlc3VsdE9iajogU2hhZGVyaXR5T2JqZWN0ID0ge1xuXHRcdFx0Y29kZTogcmVzdWx0Q29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHJlc3VsdE9iajtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBzaGFkZXJpdHkgb2JqZWN0IGNyZWF0aW9uIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcblx0ICogQ3JlYXRlIGFuIGluc3RhbmNlIHRvIGNyZWF0ZSBzaGFkZXJpdHkgb2JqZWN0LlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBjcmVhdGVTaGFkZXJpdHlPYmplY3RDcmVhdG9yKHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cik6IFNoYWRlcml0eU9iamVjdENyZWF0b3Ige1xuXHRcdHJldHVybiBuZXcgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcihzaGFkZXJTdGFnZSk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gc2hhZGVyIGVkaXQgZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8qKlxuXHQgKiBGaW5kIHRoZSBmb2xsb3dpbmcgdGVtcGxhdGUgcGF0dGVybiBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2Uga2V5IHRvIHZhbHVlXG5cdCAqIEBwYXJhbSB0ZW1wbGF0ZU9iamVjdCBBbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBzdHJpbmcgYmVmb3JlIGFuZCBhZnRlciB0aGUgcmVwbGFjZW1lbnRcblx0ICogVGhlIGtleSBjYW4gYmUgYSBzdHJpbmcgb3IgYW4gb2JqZWN0LiBJZiBhbiBvYmplY3QgaXMgdXNlZCBhcyB0aGUga2V5LFxuXHQgKiB0aGUga2V5IGluIHRoZSBwYXR0ZXJuIG9mIHNoYWRlckNvZGUgbXVzdCBhbHNvIG1hdGNoIHRoZSBvYmplY3QuXG5cdCAqIEZvciBleGFtcGxlLCBpZiB0ZW1wbGF0ZU9iamVjdCBpc1xuXHRcdHtcblx0XHRcdHNhbXBsZSB7XG5cdFx0XHRcdHNhbXBsZUE6IDBcblx0XHRcdH1cblx0XHR9XG5cdCAqIHRoZW4gdGhlIGtleSBpbiBhIHNoYWRlciBjb2RlIGlzIHNhbXBsZS5zYW1wbGVBLlxuXHQgKi9cblx0Ly8gVGhlIHRlbXBsYXRlIHBhdHRlcm4gaXNcdC8qIHNoYWRlcml0eTogQHtrZXl9ICovXG5cdHB1YmxpYyBzdGF0aWMgZmlsbFRlbXBsYXRlKG9iajogU2hhZGVyaXR5T2JqZWN0LCBhcmc6IFRlbXBsYXRlT2JqZWN0KSB7XG5cdFx0Y29uc3QgY29weSA9IHRoaXMuX19jb3B5U2hhZGVyaXR5T2JqZWN0KG9iaik7XG5cblx0XHRjb3B5LmNvZGUgPSBTaGFkZXJFZGl0b3IuX2ZpbGxUZW1wbGF0ZShjb3B5LmNvZGUsIGFyZyk7XG5cblx0XHRyZXR1cm4gY29weTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbnNlcnQgZGVmaW5lIGRpcmVjdGl2ZVxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBpbnNlcnREZWZpbml0aW9uKG9iajogU2hhZGVyaXR5T2JqZWN0LCBkZWZpbml0aW9uOiBzdHJpbmcpIHtcblx0XHRjb25zdCBjb3B5ID0gdGhpcy5fX2NvcHlTaGFkZXJpdHlPYmplY3Qob2JqKTtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdFNoYWRlckVkaXRvci5faW5zZXJ0RGVmaW5pdGlvbihzcGxpdHRlZFNoYWRlckNvZGUsIGRlZmluaXRpb24pO1xuXHRcdGNvcHkuY29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdHJldHVybiBjb3B5O1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHJlZmxlY3Rpb24gZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gaW5zdGFuY2UgdG8gZ2V0IHRoZSBhdHRyaWJ1dGUsIHZhcnlpbmcsIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uIGZyb20gYSBzaGFkZXIgY29kZSBvZiB0aGUgc2hhZGVyaXR5LlxuXHQgKiBUbyBnZXQgdGhlc2UgaW5mb3JtYXRpb24sIHlvdSBuZWVkIHRvIGNhbGwgcmVmbGVjdGlvbi5yZWZsZWN0IG1ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgY3JlYXRlUmVmbGVjdGlvbk9iamVjdChvYmo6IFNoYWRlcml0eU9iamVjdCk6IFJlZmxlY3Rpb24ge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgcmVmbGVjdGlvbiA9IG5ldyBSZWZsZWN0aW9uKHNwbGl0dGVkU2hhZGVyQ29kZSwgb2JqLnNoYWRlclN0YWdlKTtcblx0XHRyZXR1cm4gcmVmbGVjdGlvbjtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBwcml2YXRlIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwcml2YXRlIHN0YXRpYyBfX2NvcHlTaGFkZXJpdHlPYmplY3Qob2JqOiBTaGFkZXJpdHlPYmplY3QpIHtcblx0XHRjb25zdCBjb3BpZWRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IG9iai5jb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH1cblxuXHRcdHJldHVybiBjb3BpZWRPYmo7XG5cdH1cbn1cbiIsImltcG9ydCB7XG5cdFNoYWRlckNvbnN0YW50VmFsdWVPYmplY3QsXG5cdFNoYWRlckV4dGVuc2lvbkJlaGF2aW9yLFxuXHRTaGFkZXJFeHRlbnNpb25PYmplY3QsXG5cdFNoYWRlcml0eU9iamVjdCxcblx0U2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMsXG5cdFNoYWRlclByZWNpc2lvbk9iamVjdCxcblx0U2hhZGVyUHJlY2lzaW9uT2JqZWN0S2V5LFxuXHRTaGFkZXJTdGFnZVN0cixcblx0U2hhZGVyQXR0cmlidXRlT2JqZWN0LFxuXHRTaGFkZXJQcmVjaXNpb25UeXBlLFxuXHRTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlLFxuXHRTaGFkZXJWYXJ5aW5nT2JqZWN0LFxuXHRTaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUsXG5cdFNoYWRlclZhcnlpbmdWYXJUeXBlLFxuXHRTaGFkZXJVbmlmb3JtT2JqZWN0LFxuXHRTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyxcblx0U2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdCxcblx0U2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0LFxuXHRTaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0LFxuXHRTaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0LFxuXHRTaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0LFxuXHRTaGFkZXJVQk9WYXJpYWJsZU9iamVjdCxcblx0U2hhZGVyRnVuY3Rpb25PYmplY3QsXG59IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5JztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGNyZWF0ZXMgYSBzaGFkZXJpdHkgb2JqZWN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFkZXJpdHlPYmplY3RDcmVhdG9yIHtcblx0cHJpdmF0ZSBfX3NoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cjtcblx0cHJpdmF0ZSBfX2Z1bmN0aW9uSWRDb3VudCA9IDA7XG5cblx0cHJpdmF0ZSBfX2RlZmluZURpcmVjdGl2ZU5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuXHRwcml2YXRlIF9fZXh0ZW5zaW9uczogU2hhZGVyRXh0ZW5zaW9uT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX2dsb2JhbFByZWNpc2lvbjogU2hhZGVyUHJlY2lzaW9uT2JqZWN0ID0ge1xuXHRcdGludDogJ2hpZ2hwJyxcblx0XHRmbG9hdDogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyMkQ6ICdoaWdocCcsXG5cdFx0c2FtcGxlckN1YmU6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjNEOiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIyREFycmF5OiAnaGlnaHAnLFxuXHRcdGlzYW1wbGVyMkQ6ICdoaWdocCcsXG5cdFx0aXNhbXBsZXJDdWJlOiAnaGlnaHAnLFxuXHRcdGlzYW1wbGVyM0Q6ICdoaWdocCcsXG5cdFx0aXNhbXBsZXIyREFycmF5OiAnaGlnaHAnLFxuXHRcdHVzYW1wbGVyMkQ6ICdoaWdocCcsXG5cdFx0dXNhbXBsZXJDdWJlOiAnaGlnaHAnLFxuXHRcdHVzYW1wbGVyM0Q6ICdoaWdocCcsXG5cdFx0dXNhbXBsZXIyREFycmF5OiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIyRFNoYWRvdzogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyQ3ViZVNoYWRvdzogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyMkRBcnJheVNoYWRvdzogJ2hpZ2hwJyxcblx0fTtcblx0cHJpdmF0ZSBfX3N0cnVjdERlZmluaXRpb25zOiBTaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX2dsb2JhbENvbnN0YW50VmFsdWVzOiBTaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzOiBTaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX2F0dHJpYnV0ZXM6IFNoYWRlckF0dHJpYnV0ZU9iamVjdFtdID0gW107IC8vIGZvciB2ZXJ0ZXggc2hhZGVyIG9ubHlcblx0cHJpdmF0ZSBfX3ZhcnlpbmdzOiBTaGFkZXJWYXJ5aW5nT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1zOiBTaGFkZXJVbmlmb3JtT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1TdHJ1Y3RzOiBTaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1CdWZmZXJPYmplY3RzOiBTaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX2Z1bmN0aW9uczogU2hhZGVyRnVuY3Rpb25PYmplY3RbXVtdID0gW107IC8vIGZpcnN0IGluZGV4IHJlcHJlc2VudCBkZXBlbmRlbmN5IGxldmVsXG5cdHByaXZhdGUgX19tYWluRnVuY3Rpb25Db2RlOiBzdHJpbmcgPSAndm9pZCBtYWluKCkge30nO1xuXHRwcml2YXRlIF9fb3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU6IHN0cmluZyA9ICdyZW5kZXJUYXJnZXQwJzsgLy8gZm9yIGZyYWdtZW50IHNoYWRlciBvbmx5XG5cblx0Y29uc3RydWN0b3Ioc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0dGhpcy5fX3NoYWRlclN0YWdlID0gc2hhZGVyU3RhZ2U7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gYWRkIHBhcmFtZXRlcnMgZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHB1YmxpYyBhZGREZWZpbmVEaXJlY3RpdmUoZGVmaW5lRGlyZWN0aXZlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzLnNvbWUobmFtZSA9PiBuYW1lID09PSBkZWZpbmVEaXJlY3RpdmVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUud2FybignYWRkRGVmaW5lRGlyZWN0aXZlOiB0aGlzIGRlZmluZSBkaXJlY3RpdmUgaXMgYWxyZWFkeSBzZXQnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZGVmaW5lRGlyZWN0aXZlTmFtZXMucHVzaChkZWZpbmVEaXJlY3RpdmVOYW1lKTtcblx0fVxuXG5cdHB1YmxpYyBhZGRFeHRlbnNpb24oZXh0ZW5zaW9uTmFtZTogc3RyaW5nLCBiZWhhdmlvcjogU2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3IgPSAnZW5hYmxlJykge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19leHRlbnNpb25zLnNvbWUoZXh0ZW5zaW9uID0+IGV4dGVuc2lvbi5leHRlbnNpb25OYW1lID09PSBleHRlbnNpb25OYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUud2FybignYWRkRXh0ZW5zaW9uOiB0aGlzIGV4dGVuc2lvbiBpcyBhbHJlYWR5IHNldCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19leHRlbnNpb25zLnB1c2goe1xuXHRcdFx0ZXh0ZW5zaW9uTmFtZSxcblx0XHRcdGJlaGF2aW9yXG5cdFx0fSk7XG5cdH1cblxuXHQvLyBvbmx5IGRlZmluZSB0eXBlc1xuXHRwdWJsaWMgYWRkU3RydWN0RGVmaW5pdGlvbihzdHJ1Y3ROYW1lOiBzdHJpbmcsIG1lbWJlck9iamVjdHM6IFNoYWRlclN0cnVjdE1lbWJlck9iamVjdFtdKSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLnNvbWUoc3RydWN0RGVmaW5pdGlvbiA9PiBzdHJ1Y3REZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdE5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkU3RydWN0RGVmaW5pdGlvbjogZHVwbGljYXRlIHN0cnVjdCB0eXBlIG5hbWUgJHtzdHJ1Y3ROYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5wdXNoKHtcblx0XHRcdHN0cnVjdE5hbWUsXG5cdFx0XHRtZW1iZXJPYmplY3RzLFxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGFkZEdsb2JhbENvbnN0YW50VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzLCB2YWx1ZXM6IG51bWJlcltdKSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLnNvbWUoZ2xvYmFsQ29uc3RhbnRWYWx1ZSA9PiBnbG9iYWxDb25zdGFudFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZEdsb2JhbENvbnN0YW50VmFsdWU6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzVmFsaWRDb21wb25lbnROdW1iZXIgPSBVdGlsaXR5Ll9pc1ZhbGlkQ29tcG9uZW50Q291bnQodHlwZSwgdmFsdWVzKTtcblx0XHRpZiAoIWlzVmFsaWRDb21wb25lbnROdW1iZXIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZEdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSBjb21wb25lbnQgY291bnQgb2YgJHt2YXJpYWJsZU5hbWV9IGlzIGludmFsaWRgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc0ludFR5cGUgPSBVdGlsaXR5Ll9pc0ludFR5cGUodHlwZSk7XG5cdFx0aWYgKGlzSW50VHlwZSkge1xuXHRcdFx0Y29uc3QgZXhpc3ROb25JbnRlZ2VyVmFsdWUgPSBTaGFkZXJpdHlPYmplY3RDcmVhdG9yLl9fZXhpc3ROb25JbnRlZ2VyVmFsdWUodmFsdWVzKTtcblx0XHRcdGlmIChleGlzdE5vbkludGVnZXJWYWx1ZSkge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYGFkZEdsb2JhbENvbnN0YW50VmFsdWU6IG5vbi1pbnRlZ2VyIHZhbHVlIGlzIHNldCB0byAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHR0eXBlLFxuXHRcdFx0dmFsdWVzLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gbmVlZCB0byBkZWZpbmUgc3RydWN0IGJ5IHRoZSBhZGRTdHJ1Y3REZWZpbml0aW9uIG1ldGhvZFxuXHQvLyB2YWxpZGF0ZSB0aGF0IHRoZSBjb3JyZXNwb25kaW5nIHN0cnVjdHVyZSBpcyBkZWZpbmVkIGJ5IHRoZSBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlIG1ldGhvZFxuXHRwdWJsaWMgYWRkR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZShzdHJ1Y3ROYW1lOiBzdHJpbmcsIHZhcmlhYmxlTmFtZTogc3RyaW5nLCB2YWx1ZXM6IHtba2V5VmFyaWFibGVOYW1lOiBzdHJpbmddOiBudW1iZXJbXX0pIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMuc29tZShzdHJ1Y3RWYWx1ZSA9PiBzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHRzdHJ1Y3ROYW1lLFxuXHRcdFx0dmFsdWVzLFxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGFkZEF0dHJpYnV0ZURlY2xhcmF0aW9uKFxuXHRcdHZhcmlhYmxlTmFtZTogc3RyaW5nLFxuXHRcdHR5cGU6IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUsXG5cdFx0b3B0aW9ucz86IHtcblx0XHRcdHByZWNpc2lvbj86IFNoYWRlclByZWNpc2lvblR5cGUsXG5cdFx0XHRsb2NhdGlvbj86IG51bWJlcixcblx0XHR9XG5cdCkge1xuXHRcdGlmICh0aGlzLl9fc2hhZGVyU3RhZ2UgIT09ICd2ZXJ0ZXgnKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdhZGRBdHRyaWJ1dGU6IHRoaXMgbWV0aG9kIGlzIGZvciB2ZXJ0ZXggc2hhZGVyIG9ubHknKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fYXR0cmlidXRlcy5zb21lKGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkQXR0cmlidXRlOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fYXR0cmlidXRlcy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHR5cGUsXG5cdFx0XHRwcmVjaXNpb246IG9wdGlvbnM/LnByZWNpc2lvbixcblx0XHRcdGxvY2F0aW9uOiBvcHRpb25zPy5sb2NhdGlvbixcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRWYXJ5aW5nRGVjbGFyYXRpb24oXG5cdFx0dmFyaWFibGVOYW1lOiBzdHJpbmcsXG5cdFx0dHlwZTogU2hhZGVyVmFyeWluZ1ZhclR5cGUsXG5cdFx0b3B0aW9ucz86IHtcblx0XHRcdHByZWNpc2lvbj86IFNoYWRlclByZWNpc2lvblR5cGUsXG5cdFx0XHRpbnRlcnBvbGF0aW9uVHlwZT86IFNoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSxcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX192YXJ5aW5ncy5zb21lKHZhcnlpbmcgPT4gdmFyeWluZy52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRWYXJ5aW5nOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc0ludFR5cGUgPSBVdGlsaXR5Ll9pc0ludFR5cGUodHlwZSk7XG5cdFx0bGV0IGludGVycG9sYXRpb25UeXBlID0gb3B0aW9ucz8uaW50ZXJwb2xhdGlvblR5cGU7XG5cdFx0aWYgKGlzSW50VHlwZSAmJiBpbnRlcnBvbGF0aW9uVHlwZSAhPT0gJ2ZsYXQnKSB7XG5cdFx0XHRpZiAoaW50ZXJwb2xhdGlvblR5cGUgIT0gbnVsbCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBhZGRWYXJ5aW5nOiB0aGUgaW50ZXJwb2xhdGlvblR5cGUgbXVzdCBiZSBmbGF0IGZvciBpbnRlZ2VyIHR5cGVzYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgYWRkVmFyeWluZzogc2V0IHRoZSBpbnRlcnBvbGF0aW9uVHlwZSBvZiBpbnRlZ2VyIHR5cGVzIHRvIGZsYXQgdG8gYXZvaWQgY29tcGlsYXRpb24gZXJyb3JgKTtcblx0XHRcdFx0aW50ZXJwb2xhdGlvblR5cGUgPSAnZmxhdCc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3ZhcnlpbmdzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0dHlwZSxcblx0XHRcdHByZWNpc2lvbjogb3B0aW9ucz8ucHJlY2lzaW9uLFxuXHRcdFx0aW50ZXJwb2xhdGlvblR5cGUsXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkVW5pZm9ybURlY2xhcmF0aW9uKFxuXHRcdHZhcmlhYmxlTmFtZTogc3RyaW5nLFxuXHRcdHR5cGU6IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRwcmVjaXNpb24/OiBTaGFkZXJQcmVjaXNpb25UeXBlLFxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1zLnNvbWUodW5pZm9ybSA9PiB1bmlmb3JtLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFVuaWZvcm06IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlID09PSAnYm9vbCcgJiYgb3B0aW9ucz8ucHJlY2lzaW9uICE9IG51bGwpIHtcblx0XHRcdGNvbnNvbGUud2FybihgYWRkVW5pZm9ybTogcmVtb3ZlIHRoZSBzcGVjaWZpY2F0aW9uIG9mIHByZWNpc2lvbiBmb3IgYm9vbCB0eXBlIHRvIGF2b2lkIGNvbXBpbGF0aW9uIGVycm9yYCk7XG5cdFx0XHRvcHRpb25zLnByZWNpc2lvbiA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybXMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHR0eXBlLFxuXHRcdFx0cHJlY2lzaW9uOiBvcHRpb25zPy5wcmVjaXNpb24sXG5cdFx0fSk7XG5cdH1cblxuXHQvLyBuZWVkIHRvIGRlZmluZSBzdHJ1Y3QgYnkgdGhlIGFkZFN0cnVjdERlZmluaXRpb24gbWV0aG9kXG5cdHB1YmxpYyBhZGRVbmlmb3JtU3RydWN0RGVjbGFyYXRpb24oXG5cdFx0c3RydWN0TmFtZTogc3RyaW5nLFxuXHRcdHZhcmlhYmxlTmFtZTogc3RyaW5nXG5cdCkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX191bmlmb3JtU3RydWN0cy5zb21lKHVuaWZvcm1TdHJ1Y3QgPT4gdW5pZm9ybVN0cnVjdC52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtU3RydWN0RGVjbGFyYXRpb246IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3JtU3RydWN0cy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHN0cnVjdE5hbWUsXG5cdFx0fSk7XG5cdH1cblxuXHQvLyBmb3IgZXMzXG5cdHB1YmxpYyBhZGRVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb24oXG5cdFx0YmxvY2tOYW1lOiBzdHJpbmcsXG5cdFx0dmFyaWFibGVPYmplY3RzOiBTaGFkZXJVQk9WYXJpYWJsZU9iamVjdFtdLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRpbnN0YW5jZU5hbWU/OiBTaGFkZXJQcmVjaXNpb25UeXBlXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZUJsb2NrTmFtZSA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMuc29tZSh1Ym8gPT4gdWJvLmJsb2NrTmFtZSA9PT0gYmxvY2tOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGVCbG9ja05hbWUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFVuaWZvcm1CdWZmZXJPYmplY3REZWNsYXJhdGlvbjogZHVwbGljYXRlIGJsb2NrIG5hbWUgJHtibG9ja05hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCB1Ym8gb2YgdGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzKSB7XG5cdFx0XHRmb3IgKGNvbnN0IHVib1ZhcmlhYmxlT2JqZWN0IG9mIHViby52YXJpYWJsZU9iamVjdHMpIHtcblx0XHRcdFx0Zm9yIChjb25zdCB2YXJpYWJsZU9iamVjdCBvZiB2YXJpYWJsZU9iamVjdHMpIHtcblx0XHRcdFx0XHRpZiAodWJvVmFyaWFibGVPYmplY3QudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU9iamVjdC52YXJpYWJsZU5hbWUpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFVuaWZvcm1CdWZmZXJPYmplY3REZWNsYXJhdGlvbjogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU9iamVjdC52YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzLnB1c2goe1xuXHRcdFx0YmxvY2tOYW1lLFxuXHRcdFx0dmFyaWFibGVPYmplY3RzLFxuXHRcdFx0aW5zdGFuY2VOYW1lOiBvcHRpb25zPy5pbnN0YW5jZU5hbWUsXG5cdFx0fSk7XG5cdH1cblxuXHQvLyB0aGUgcmV0dXJuIHZhbHVlIElkIGlzIGEgdmFsdWUgdG8gZGVsZXRlIHRoZSBmdW5jdGlvblxuXHQvLyB0aGUgbWFpbiBmdW5jdGlvbiBpcyBkZWZpbmVkICh1cGRhdGVkKSBieSB0aGUgdXBkYXRlTWFpbkZ1bmN0aW9uIG1ldGhvZFxuXHRwdWJsaWMgYWRkRnVuY3Rpb25EZWZpbml0aW9uKFxuXHRcdGZ1bmN0aW9uQ29kZTogc3RyaW5nLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRkZXBlbmRlbmN5TGV2ZWw/OiBudW1iZXJcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IGZ1bmN0aW9uSWQgPSB0aGlzLl9fZnVuY3Rpb25JZENvdW50Kys7XG5cblx0XHRjb25zdCBkZXBlbmRlbmN5TGV2ZWwgPSBvcHRpb25zPy5kZXBlbmRlbmN5TGV2ZWwgPz8gMDtcblx0XHR0aGlzLl9fZnVuY3Rpb25zW2RlcGVuZGVuY3lMZXZlbF0gPSB0aGlzLl9fZnVuY3Rpb25zW2RlcGVuZGVuY3lMZXZlbF0gPz8gW107XG5cdFx0dGhpcy5fX2Z1bmN0aW9uc1tkZXBlbmRlbmN5TGV2ZWxdLnB1c2goe1xuXHRcdFx0ZnVuY3Rpb25Db2RlLFxuXHRcdFx0ZnVuY3Rpb25JZFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uSWQ7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gdXBkYXRlIHBhcmFtZXRlcnMgZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHB1YmxpYyB1cGRhdGVHbG9iYWxQcmVjaXNpb24ocHJlY2lzaW9uOiBTaGFkZXJQcmVjaXNpb25PYmplY3QpIHtcblx0XHRPYmplY3QuYXNzaWduKHRoaXMuX19nbG9iYWxQcmVjaXNpb24sIHByZWNpc2lvbik7XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlU3RydWN0RGVmaW5pdGlvbihzdHJ1Y3ROYW1lOiBzdHJpbmcsIG1lbWJlck9iamVjdHM6IFNoYWRlclN0cnVjdE1lbWJlck9iamVjdFtdKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5maW5kSW5kZXgoc3RydWN0RGVmaW5pdGlvbiA9PiBzdHJ1Y3REZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdE5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGB1cGRhdGVTdHJ1Y3REZWZpbml0aW9uOiB0aGUgc3RydWN0IHR5cGUgbmFtZSAke3N0cnVjdE5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9uc1ttYXRjaGVkSW5kZXhdLm1lbWJlck9iamVjdHMgPSBtZW1iZXJPYmplY3RzO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZUdsb2JhbENvbnN0YW50VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlczogbnVtYmVyW10pIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLmZpbmRJbmRleChnbG9iYWxDb25zdGFudFZhbHVlID0+IGdsb2JhbENvbnN0YW50VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHVwZGF0ZUdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0eXBlID0gdGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzW21hdGNoZWRJbmRleF0udHlwZTtcblxuXHRcdGNvbnN0IGlzVmFsaWRDb21wb25lbnROdW1iZXIgPSBVdGlsaXR5Ll9pc1ZhbGlkQ29tcG9uZW50Q291bnQodHlwZSwgdmFsdWVzKTtcblx0XHRpZiAoIWlzVmFsaWRDb21wb25lbnROdW1iZXIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ3VwZGF0ZUdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSBjb21wb25lbnQgY291bnQgaXMgaW52YWxpZCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzSW50VHlwZSA9IFV0aWxpdHkuX2lzSW50VHlwZSh0eXBlKTtcblx0XHRpZiAoaXNJbnRUeXBlKSB7XG5cdFx0XHRjb25zdCBleGlzdE5vbkludGVnZXJWYWx1ZSA9IFNoYWRlcml0eU9iamVjdENyZWF0b3IuX19leGlzdE5vbkludGVnZXJWYWx1ZSh2YWx1ZXMpO1xuXHRcdFx0aWYgKGV4aXN0Tm9uSW50ZWdlclZhbHVlKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgdXBkYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlICR7dmFyaWFibGVOYW1lfSBoYXMgYSBub24taW50ZWdlciB2YWx1ZS5gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXNbbWF0Y2hlZEluZGV4XS52YWx1ZXMgPSB2YWx1ZXM7XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZywgdmFsdWVzOiB7W2tleVZhcmlhYmxlTmFtZTogc3RyaW5nXTogbnVtYmVyW119KSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5maW5kSW5kZXgoc3RydWN0VmFsdWUgPT4gc3RydWN0VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGB1cGRhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlOiAgdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlc1ttYXRjaGVkSW5kZXhdLnZhbHVlcyA9IHZhbHVlcztcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVNYWluRnVuY3Rpb24obWFpbkZ1bmN0aW9uQ29kZUlubmVyOiBzdHJpbmcpIHtcblx0XHR0aGlzLl9fbWFpbkZ1bmN0aW9uQ29kZSA9IG1haW5GdW5jdGlvbkNvZGVJbm5lcjtcblx0fVxuXG5cdC8vIHNwZWNpZnkgdGhlIG5hbWUgb2YgdGhlIG91dHB1dCBjb2xvciB2YXJpYWJsZSBmcm9tIHRoZSBtYWluIGZ1bmN0aW9uIGluIHRoZSBmcmFnbWVudCBzaGFkZXIuXG5cdC8vIHVzZXJzIGhhdmUgdG8gYXNzaWduIHRoZSByZXN1bHQgb2YgZnJhZ21lbnQgc2hhZGVyIGNhbGN1bGF0aW9uIHRvIHRoaXMgdmFyaWFibGUuXG5cdHB1YmxpYyB1cGRhdGVPdXRwdXRDb2xvclZhcmlhYmxlTmFtZShvdXRwdXRDb2xvclZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0aWYgKHRoaXMuX19zaGFkZXJTdGFnZSAhPT0gJ2ZyYWdtZW50Jykge1xuXHRcdFx0Y29uc29sZS5lcnJvcigndXBkYXRlT3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU6IHRoaXMgbWV0aG9kIGlzIGZvciBmcmFnbWVudCBzaGFkZXIgb25seScpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChvdXRwdXRDb2xvclZhcmlhYmxlTmFtZS5sZW5ndGggPT09IDApIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ3VwZGF0ZU91dHB1dENvbG9yVmFyaWFibGVOYW1lOiBpbnZhbGlkIG91dENvbG9yVmFyaWFibGVOYW1lJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX291dHB1dENvbG9yVmFyaWFibGVOYW1lID0gb3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gcmVtb3ZlIHBhcmFtZXRlcnMgZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHB1YmxpYyByZW1vdmVEZWZpbmVEaXJlY3RpdmUoZGVmaW5lRGlyZWN0aXZlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID0gdGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzLmluZGV4T2YoZGVmaW5lRGlyZWN0aXZlTmFtZSk7XG5cblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdyZW1vdmVkRGVmaW5lRGlyZWN0aXZlOiB0aGlzIGRlZmluZSBkaXJlY3RpdmUgaXMgbm90IGV4aXN0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZUV4dGVuc2lvbihleHRlbnNpb25OYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2V4dGVuc2lvbnMuZmluZEluZGV4KGV4dGVuc2lvbiA9PiBleHRlbnNpb24uZXh0ZW5zaW9uTmFtZSA9PT0gZXh0ZW5zaW9uTmFtZSk7XG5cblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdyZW1vdmVFeHRlbnNpb246IHRoaXMgZXh0ZW5zaW9uIGlzIG5vdCBleGlzdCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19leHRlbnNpb25zLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVN0cnVjdERlZmluaXRpb24oc3RydWN0TmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5maW5kSW5kZXgoc3RydWN0RGVmaW5pdGlvbiA9PiBzdHJ1Y3REZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdE5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGByZW1vdmVTdHJ1Y3REZWZpbml0aW9uOiB0aGUgc3RydWN0IHR5cGUgbmFtZSAke3N0cnVjdE5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVHbG9iYWxDb25zdGFudFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5maW5kSW5kZXgoZ2xvYmFsQ29uc3RhbnRWYWx1ZSA9PiBnbG9iYWxDb25zdGFudFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLmZpbmRJbmRleChzdHJ1Y3RWYWx1ZSA9PiBzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHVwZGF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWU6ICB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZUF0dHJpYnV0ZURlY2xhcmF0aW9uKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19hdHRyaWJ1dGVzLmZpbmRJbmRleChhdHRyaWJ1dGUgPT4gYXR0cmlidXRlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVBdHRyaWJ1dGU6IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fYXR0cmlidXRlcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVWYXJ5aW5nRGVjbGFyYXRpb24odmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3ZhcnlpbmdzLmZpbmRJbmRleCh2YXJ5aW5nID0+IHZhcnlpbmcudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZVZhcnlpbmc6IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdmFyeWluZ3Muc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlVW5pZm9ybURlY2xhcmF0aW9uKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX191bmlmb3Jtcy5maW5kSW5kZXgodW5pZm9ybSA9PiB1bmlmb3JtLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVVbmlmb3JtOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1zLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbih2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybVN0cnVjdHMuZmluZEluZGV4KHVuaWZvcm1TdHJ1Y3QgPT4gdW5pZm9ybVN0cnVjdC52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1TdHJ1Y3RzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVVuaWZvcm1CdWZmZXJPYmplY3REZWNsYXJhdGlvbihibG9ja05hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMuZmluZEluZGV4KHVibyA9PiB1Ym8uYmxvY2tOYW1lID09PSBibG9ja05hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbjogdGhlIHZhcmlhYmxlIG5hbWUgJHtibG9ja05hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVGdW5jdGlvbkRlZmluaXRpb24oZnVuY3Rpb25JZDogbnVtYmVyKSB7XG5cdFx0dGhpcy5fX2ZpbGxFbXB0eUZ1bmN0aW9ucygpO1xuXG5cdFx0Ly8gaWQgaXMgdG9vIHNtYWxsIG9yIHRvbyBiaWdcblx0XHRpZiAoZnVuY3Rpb25JZCA8IDAgfHwgZnVuY3Rpb25JZCA+PSB0aGlzLl9fZnVuY3Rpb25JZENvdW50KSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ3JlbW92ZUZ1bmN0aW9uRGVmaW5pdGlvbjogaW52YWxpZCBmdW5jdGlvbiBpZCcpXG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBmdW5jdGlvbk9iamVjdHMgb2YgdGhpcy5fX2Z1bmN0aW9ucykge1xuXHRcdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdFx0ZnVuY3Rpb25PYmplY3RzLmZpbmRJbmRleChmdW5jdGlvbk9iamVjdCA9PiBmdW5jdGlvbk9iamVjdC5mdW5jdGlvbklkID09PSBmdW5jdGlvbklkKTtcblx0XHRcdGlmIChtYXRjaGVkSW5kZXggIT09IC0xKSB7XG5cdFx0XHRcdGZ1bmN0aW9uT2JqZWN0cy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnNvbGUud2FybihgcmVtb3ZlRnVuY3Rpb25EZWZpbml0aW9uOiBub3QgZm91bmQgdGhlIGZ1bmN0aW9uIG9mIGZ1bmN0aW9uSWQgJHtmdW5jdGlvbklkfWApO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIGNyZWF0ZSBzaGFkZXJpdHkgb2JqZWN0IGZ1bmN0aW9uXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHB1YmxpYyBjcmVhdGVTaGFkZXJpdHlPYmplY3QoKTogU2hhZGVyaXR5T2JqZWN0IHtcblx0XHRjb25zdCBzaGFkZXJpdHlPYmogPSB7XG5cdFx0XHRjb2RlOiB0aGlzLl9fY3JlYXRlU2hhZGVyQ29kZSgpLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IHRoaXMuX19zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IHRoaXMuX19zaGFkZXJTdGFnZSA9PT0gJ2ZyYWdtZW50Jyxcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHNoYWRlcml0eU9iajtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBwcml2YXRlIG1ldGhvZHNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19leGlzdE5vbkludGVnZXJWYWx1ZSh2YWx1ZXM6IG51bWJlcltdKSB7XG5cdFx0Zm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcblx0XHRcdGlmICghTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIFRPRE86IGltcGxlbWVudCBzaGFkZXIgY29kZSBpbXBvcnQgZmVhdHVyZSAobG93IHByaW9yaXR5KVxuXHQvLyBwdWJsaWMgaW1wb3J0U2hhZGVyQ29kZShjb2RlOiBzdHJpbmcpIHt9XG5cblx0Ly8gbmVlZCB0byBhcHBseSBTaGFkZXJpdHkudHJhbnNmb3JtVG9HTFNMRVMxLCB0cmFuc2Zvcm1Ub0dMU0xFUzMgb3IgdHJhbnNmb3JtVG8gbWV0aG9kXG5cdHByaXZhdGUgX19jcmVhdGVTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0dGhpcy5fX2ZpbGxFbXB0eUZ1bmN0aW9ucygpO1xuXG5cdFx0Y29uc3QgY29kZVxuXHRcdFx0PSBgI3ZlcnNpb24gMzAwIGVzXFxuXFxuYFxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlRGVmaW5lRGlyZWN0aXZlU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVFeHRlbnNpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUdsb2JhbFByZWNpc2lvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlU3RydWN0RGVmaW5pdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZVNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlQXR0cmlidXRlRGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVZhcnlpbmdEZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlT3V0cHV0Q29sb3JEZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlVW5pZm9ybURlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVVuaWZvcm1CdWZmZXJPYmplY3RTaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUZ1bmN0aW9uRGVmaW5pdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlTWFpbkZ1bmN0aW9uRGVmaW5pdGlvblNoYWRlckNvZGUoKTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2ZpbGxFbXB0eUZ1bmN0aW9ucygpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX19mdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRoaXMuX19mdW5jdGlvbnNbaV0gPSB0aGlzLl9fZnVuY3Rpb25zW2ldID8/IFtdO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVEZWZpbmVEaXJlY3RpdmVTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IGRlZmluZURpcmVjdGl2ZU5hbWUgb2YgdGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGAjZGVmaW5lICR7ZGVmaW5lRGlyZWN0aXZlTmFtZX1cXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7O1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUV4dGVuc2lvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgZXh0ZW5zaW9uIG9mIHRoaXMuX19leHRlbnNpb25zKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGAjZXh0ZW5zaW9uICR7ZXh0ZW5zaW9uLmV4dGVuc2lvbk5hbWV9OiAke2V4dGVuc2lvbi5iZWhhdmlvcn1cXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHQvL1RPRE86IHJlbW92ZSBuZWVkbGVzcyBwcmVjaXNpb25zXG5cdHByaXZhdGUgX19jcmVhdGVHbG9iYWxQcmVjaXNpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHR5cGUgaW4gdGhpcy5fX2dsb2JhbFByZWNpc2lvbikge1xuXHRcdFx0Y29uc3QgcHJlY2lzaW9uVHlwZSA9IHR5cGUgYXMgU2hhZGVyUHJlY2lzaW9uT2JqZWN0S2V5O1xuXHRcdFx0Y29uc3QgcHJlY2lzaW9uUXVhbGlmaWVyID0gdGhpcy5fX2dsb2JhbFByZWNpc2lvbltwcmVjaXNpb25UeXBlXTtcblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgcHJlY2lzaW9uICR7cHJlY2lzaW9uUXVhbGlmaWVyfSAke3ByZWNpc2lvblR5cGV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVTdHJ1Y3REZWZpbml0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBzdHJ1Y3REZWZpbml0aW9uIG9mIHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgc3RydWN0ICR7c3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lfSB7XFxuYDtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGUgPSBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHNbaV07XG5cblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgICBgO1xuXHRcdFx0XHRpZiAodmFyaWFibGUucHJlY2lzaW9uICE9IG51bGwpIHtcblx0XHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcmlhYmxlLnByZWNpc2lvbn0gYDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dmFyaWFibGUudHlwZX0gJHt2YXJpYWJsZS5tZW1iZXJOYW1lfTtcXG5gO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGB9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVHbG9iYWxDb25zdGFudFZhbHVlU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBnbG9iYWxDb25zdGFudFZhbHVlIG9mIHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcykge1xuXHRcdFx0Y29uc3QgdHlwZSA9IGdsb2JhbENvbnN0YW50VmFsdWUudHlwZTtcblx0XHRcdGNvbnN0IHZhcmlhYmxlTmFtZSA9IGdsb2JhbENvbnN0YW50VmFsdWUudmFyaWFibGVOYW1lO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBnbG9iYWxDb25zdGFudFZhbHVlLnZhbHVlcztcblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgY29uc3QgJHt0eXBlfSAke3ZhcmlhYmxlTmFtZX0gPSAke3R5cGV9KGA7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gdmFsdWVbaV0gKyAnLCAnO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlID0gc2hhZGVyQ29kZS5yZXBsYWNlKC8sXFxzJC8sICcpO1xcbicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3Qgc3RydWN0VmFsdWUgb2YgdGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzKSB7XG5cdFx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuZmluZEluZGV4KGRlZmluaXRpb24gPT4gZGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3RWYWx1ZS5zdHJ1Y3ROYW1lKTtcblx0XHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6IHRoZSBzdHJ1Y3QgdHlwZSAke3N0cnVjdFZhbHVlLnN0cnVjdE5hbWV9IGlzIG5vdCBkZWZpbmVkYCk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGBjb25zdCAke3N0cnVjdFZhbHVlLnN0cnVjdE5hbWV9ICR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSA9ICR7c3RydWN0VmFsdWUuc3RydWN0TmFtZX0gKFxcbmA7XG5cblx0XHRcdGNvbnN0IHN0cnVjdERlZmluaXRpb24gPSB0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnNbbWF0Y2hlZEluZGV4XTtcblx0XHRcdGlmIChzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHMubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhzdHJ1Y3RWYWx1ZS52YWx1ZXMpLmxlbmd0aCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiBJbnZhbGlkIG51bWJlciBvZiB2YXJpYWJsZXMgdGhhdCAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gaGFzYCk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBoYXNTYW1wbGVyVHlwZSA9XG5cdFx0XHRcdHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0cy5zb21lKG1lbWJlck9iamVjdCA9PiBVdGlsaXR5Ll9pc1NhbXBsZXJUeXBlKG1lbWJlck9iamVjdC50eXBlKSk7XG5cdFx0XHRpZiAoaGFzU2FtcGxlclR5cGUpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogQ29uc3RhbnRTdHJ1Y3RWYWx1ZSAoJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9KSBjYW5ub3QgaGF2ZSBzYW1wbGVyIHR5cGUgcGFyYW1ldGVyYCk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHNbaV0ubWVtYmVyTmFtZTtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBzdHJ1Y3RWYWx1ZS52YWx1ZXNbdmFyaWFibGVOYW1lXVxuXHRcdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6ICR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSBkb2VzIG5vdCBoYXZlIHRoZSB2YWx1ZSBvZiAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHR5cGUgPSBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHNbaV0udHlwZTtcblx0XHRcdFx0Y29uc3QgaXNWYWxpZENvbXBvbmVudE51bWJlciA9IFV0aWxpdHkuX2lzVmFsaWRDb21wb25lbnRDb3VudCh0eXBlLCB2YWx1ZSk7XG5cdFx0XHRcdGlmICghaXNWYWxpZENvbXBvbmVudE51bWJlcikge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6IHRoZSBjb21wb25lbnQgY291bnQgb2YgJHt2YXJpYWJsZU5hbWV9IGluICR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSBpcyBpbnZhbGlkYCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAgICR7dHlwZX0oYDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHNoYWRlckNvZGUgKz0gdmFsdWVbaV0gKyAnLCAnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2hhZGVyQ29kZSA9IHNoYWRlckNvZGUucmVwbGFjZSgvLFxccyQvLCAnKSxcXG4nKTtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSA9IHNoYWRlckNvZGUucmVwbGFjZSgvLFxcbiQvLCAnXFxuKTtcXG4nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUF0dHJpYnV0ZURlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgdGhpcy5fX2F0dHJpYnV0ZXMpIHtcblx0XHRcdGlmIChhdHRyaWJ1dGUubG9jYXRpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGBsYXlvdXQgKGxvY2F0aW9uID0gJHthdHRyaWJ1dGUubG9jYXRpb259KSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGBpbiBgO1xuXG5cdFx0XHRpZiAoYXR0cmlidXRlLnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7YXR0cmlidXRlLnByZWNpc2lvbn0gYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgJHthdHRyaWJ1dGUudHlwZX0gJHthdHRyaWJ1dGUudmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlVmFyeWluZ0RlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB2YXJ5aW5nIG9mIHRoaXMuX192YXJ5aW5ncykge1xuXHRcdFx0aWYgKHZhcnlpbmcuaW50ZXJwb2xhdGlvblR5cGUgIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcnlpbmcuaW50ZXJwb2xhdGlvblR5cGV9IGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gdGhpcy5fX3NoYWRlclN0YWdlID09ICd2ZXJ0ZXgnID8gYG91dCBgIDogYGluIGA7XG5cblx0XHRcdGlmICh2YXJ5aW5nLnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dmFyeWluZy5wcmVjaXNpb259IGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dmFyeWluZy50eXBlfSAke3ZhcnlpbmcudmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHQvL1RPRE86IHRyYW5zbGF0ZSB3aGVuIGdsc2wgZXMxXG5cdHByaXZhdGUgX19jcmVhdGVPdXRwdXRDb2xvckRlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGlmICh0aGlzLl9fc2hhZGVyU3RhZ2UgIT09ICdmcmFnbWVudCcpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRyZXR1cm4gYGxheW91dChsb2NhdGlvbiA9IDApIG91dCB2ZWM0ICR7dGhpcy5fX291dHB1dENvbG9yVmFyaWFibGVOYW1lfTtcXG5cXG5gO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVVuaWZvcm1EZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdW5pZm9ybSBvZiB0aGlzLl9fdW5pZm9ybXMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYHVuaWZvcm0gYDtcblxuXHRcdFx0aWYgKHVuaWZvcm0ucHJlY2lzaW9uICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt1bmlmb3JtLnByZWNpc2lvbn0gYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgJHt1bmlmb3JtLnR5cGV9ICR7dW5pZm9ybS52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHVuaWZvcm1TdHJ1Y3Qgb2YgdGhpcy5fX3VuaWZvcm1TdHJ1Y3RzKSB7XG5cdFx0XHRjb25zdCBzdHJ1Y3ROYW1lID0gdW5pZm9ybVN0cnVjdC5zdHJ1Y3ROYW1lO1xuXG5cdFx0XHRjb25zdCBleGlzdFN0cnVjdERlZmluaXRpb24gPVxuXHRcdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuc29tZShkZWZpbml0aW9uID0+IGRlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0TmFtZSk7XG5cdFx0XHRpZiAoIWV4aXN0U3RydWN0RGVmaW5pdGlvbikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvblNoYWRlckNvZGU6IHRoZSBzdHJ1Y3QgdHlwZSAke3N0cnVjdE5hbWV9IGlzIG5vdCBkZWZpbmVkYCk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGB1bmlmb3JtICR7c3RydWN0TmFtZX0gJHt1bmlmb3JtU3RydWN0LnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVVuaWZvcm1CdWZmZXJPYmplY3RTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHVibyBvZiB0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYGxheW91dCAoc3RkMTQwKSB1bmlmb3JtICR7dWJvLmJsb2NrTmFtZX0ge1xcbmA7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdWJvLnZhcmlhYmxlT2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZU9iaiA9IHViby52YXJpYWJsZU9iamVjdHNbaV07XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCAgJHt2YXJpYWJsZU9iai50eXBlfSAke3ZhcmlhYmxlT2JqLnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHViby5pbnN0YW5jZU5hbWUgIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGB9ICR7dWJvLmluc3RhbmNlTmFtZX07XFxuYDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYH07XFxuYDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUZ1bmN0aW9uRGVmaW5pdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fX2Z1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgZnVuY3Rpb25PYmplY3RzID0gdGhpcy5fX2Z1bmN0aW9uc1tpXTtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgZnVuY3Rpb25PYmplY3RzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gZnVuY3Rpb25PYmplY3RzW2pdLmZ1bmN0aW9uQ29kZSArIGBcXG5gO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlTWFpbkZ1bmN0aW9uRGVmaW5pdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5fX21haW5GdW5jdGlvbkNvZGUgKyBgXFxuYDtcblx0fVxufVxuIiwiaW1wb3J0IHtTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlLCBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMywgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsIFNoYWRlclZhcnlpbmdWYXJUeXBlfSBmcm9tICcuLi90eXBlcy90eXBlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbGl0eSB7XG5cdHN0YXRpYyBfc3BsaXRCeUxpbmVGZWVkQ29kZShzb3VyY2U6IHN0cmluZykge1xuXHRcdHJldHVybiBzb3VyY2Uuc3BsaXQoL1xcclxcbnxcXG4vKTtcblx0fVxuXG5cdHN0YXRpYyBfam9pblNwbGl0dGVkTGluZShzcGxpdHRlZExpbmU6IHN0cmluZ1tdKSB7XG5cdFx0cmV0dXJuIHNwbGl0dGVkTGluZS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHN0YXRpYyBfYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNvdXJjZTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHNvdXJjZSA9PT0gJycgPyBzb3VyY2UgOiBzb3VyY2UgKyAnXFxuJztcblx0fVxuXG5cdHN0YXRpYyBfY29tcG9uZW50TnVtYmVyKFxuXHRcdHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIHwgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSB8IFNoYWRlclZhcnlpbmdWYXJUeXBlIHwgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzNcblx0KSB7XG5cdFx0bGV0IGNvbXBvbmVudE51bWJlcjtcblx0XHRpZiAoXG5cdFx0XHR0eXBlID09PSAnZmxvYXQnIHx8IHR5cGUgPT09ICdpbnQnIHx8IHR5cGUgPT09ICdib29sJyB8fCB0eXBlID09PSAndWludCcgfHxcblx0XHRcdHR5cGUgPT09ICdzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICdzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ3NhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ3NhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ2lzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICdpc2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICdpc2FtcGxlcjNEJyB8fCB0eXBlID09PSAnaXNhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3VzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICd1c2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICd1c2FtcGxlcjNEJyB8fCB0eXBlID09PSAndXNhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3NhbXBsZXIyRFNoYWRvdycgfHwgdHlwZSA9PT0gJ3NhbXBsZXJDdWJlU2hhZG93JyB8fCB0eXBlID09PSAnc2FtcGxlcjJEQXJyYXlTaGFkb3cnXG5cdFx0KSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAxO1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3ZlYzInIHx8IHR5cGUgPT09ICdpdmVjMicgfHwgdHlwZSA9PT0gJ2J2ZWMyJyB8fCB0eXBlID09PSAndXZlYzInKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAyO1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3ZlYzMnIHx8IHR5cGUgPT09ICdpdmVjMycgfHwgdHlwZSA9PT0gJ2J2ZWMzJyB8fCB0eXBlID09PSAndXZlYzMnKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAzO1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3ZlYzQnIHx8IHR5cGUgPT09ICdpdmVjNCcgfHwgdHlwZSA9PT0gJ2J2ZWM0JyB8fCB0eXBlID09PSAndXZlYzQnIHx8IHR5cGUgPT09ICdtYXQyJyB8fCB0eXBlID09PSAnbWF0MngyJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gNDtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQyeDMnIHx8IHR5cGUgPT09ICdtYXQzeDInKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSA2O1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDJ4NCcgfHwgdHlwZSA9PT0gJ21hdDR4MicpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDg7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0MycgfHwgdHlwZSA9PT0gJ21hdDN4MycpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDk7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0M3g0JyB8fCB0eXBlID09PSAnbWF0NHgzJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMTI7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0NCcgfHwgdHlwZSA9PT0gJ21hdDR4NCcpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDE2O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyB1bmtub3duIHR5cGVcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDA7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdVdGlsaXR5Ll9jb21wb25lbnROdW1iZXI6IGRldGVjdCB1bmtub3duIHR5cGUnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29tcG9uZW50TnVtYmVyO1xuXHR9XG5cblx0c3RhdGljIF9pc0ludFR5cGUoXG5cdFx0dHlwZTogU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgfCBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlIHwgU2hhZGVyVmFyeWluZ1ZhclR5cGUgfCBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTM1xuXHQpIHtcblx0XHRpZiAoXG5cdFx0XHR0eXBlID09PSAnaW50JyB8fCB0eXBlID09PSAnaXZlYzInIHx8IHR5cGUgPT09ICdpdmVjMycgfHwgdHlwZSA9PT0gJ2l2ZWM0JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3VpbnQnIHx8IHR5cGUgPT09ICd1dmVjMicgfHwgdHlwZSA9PT0gJ3V2ZWMzJyB8fCB0eXBlID09PSAndXZlYzQnXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyBfaXNWYWxpZENvbXBvbmVudENvdW50KFxuXHRcdHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIHwgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSB8IFNoYWRlclZhcnlpbmdWYXJUeXBlIHwgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsXG5cdFx0dmFsdWVzOiBudW1iZXJbXVxuXHQpIHtcblx0XHRjb25zdCB2YWxpZENvbXBvbmVudENvdW50ID0gVXRpbGl0eS5fY29tcG9uZW50TnVtYmVyKHR5cGUpO1xuXHRcdGlmICh2YWxpZENvbXBvbmVudENvdW50ID09PSB2YWx1ZXMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0c3RhdGljIF9pc1NhbXBsZXJUeXBlKFxuXHRcdHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIHwgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSB8IFNoYWRlclZhcnlpbmdWYXJUeXBlIHwgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzNcblx0KSB7XG5cdFx0aWYgKFxuXHRcdFx0dHlwZSA9PT0gJ3NhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ3NhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAnc2FtcGxlcjNEJyB8fCB0eXBlID09PSAnc2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAnaXNhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICdpc2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAndXNhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICd1c2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAnc2FtcGxlcjJEU2hhZG93JyB8fCB0eXBlID09PSAnc2FtcGxlckN1YmVTaGFkb3cnIHx8IHR5cGUgPT09ICdzYW1wbGVyMkRBcnJheVNoYWRvdydcblx0XHQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9