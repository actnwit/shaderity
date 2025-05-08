module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./../../dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Shaderity_1 = __importDefault(__webpack_require__(/*! ./main/Shaderity */ "./src/main/Shaderity.ts"));
exports.default = Shaderity_1.default;


/***/ }),

/***/ "./src/main/PreProcessor.ts":
/*!**********************************!*\
  !*** ./src/main/PreProcessor.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
    static process(splittedLines, startLineStr, endLineStr) {
        const define = /#define[\t ]+(\w+)(?:[\t ]+(\S+))?/;
        const ifdef = /#ifdef[\t ]+(\w+)/;
        const ifndef = /#ifndef[\t ]+(\w+)/;
        const _if = /#if[\t ]+(.+)/;
        const elif = /#elif[\t ]+(.+)/;
        const _else = /#else/;
        const endif = /#endif/;
        const previousOutputStates = [];
        let outputFlg = true;
        const ifdefs = [];
        const ifdefMatched = [];
        const outputLines = [];
        this.definitions.clear();
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
                    isPragma = true;
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
exports.default = PreProcessor;
PreProcessor.definitions = new Map();


/***/ }),

/***/ "./src/main/Reflection.ts":
/*!********************************!*\
  !*** ./src/main/Reflection.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = Reflection;
Reflection.attributeAndVaryingTypeRegExp = /[\t ]+(float|int|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4)[\t ]+(\w+);/;
Reflection.uniformTypeRegExp = /[\t ]+(float|int|vec2|vec3|vec4|mat2|mat3|mat4|ivec2|ivec3|ivec4|sampler2D|samplerCube|sampler3D)[\t ]+(\w+);/;
Reflection.semanticRegExp = /<.*semantic[\t ]*=[\t ]*(\w+).*>/;
;


/***/ }),

/***/ "./src/main/ShaderEditor.ts":
/*!**********************************!*\
  !*** ./src/main/ShaderEditor.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = ShaderEditor;


/***/ }),

/***/ "./src/main/ShaderTransformer.ts":
/*!***************************************!*\
  !*** ./src/main/ShaderTransformer.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = ShaderTransformer;


/***/ }),

/***/ "./src/main/Shaderity.ts":
/*!*******************************!*\
  !*** ./src/main/Shaderity.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    static processPragma(obj, startLineStr, endLineStr) {
        const splittedShaderCode = Utility_1.default._splitByLineFeedCode(obj.code);
        const transformedSplittedShaderCode = PreProcessor_1.default.process(splittedShaderCode, startLineStr, endLineStr);
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
exports.default = Shaderity;


/***/ }),

/***/ "./src/main/ShaderityObjectCreator.ts":
/*!********************************************!*\
  !*** ./src/main/ShaderityObjectCreator.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        ;
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
exports.default = ShaderityObjectCreator;


/***/ }),

/***/ "./src/main/Utility.ts":
/*!*****************************!*\
  !*** ./src/main/Utility.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = Utility;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluL1ByZVByb2Nlc3Nvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9SZWZsZWN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluL1NoYWRlckVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9TaGFkZXJUcmFuc2Zvcm1lci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9TaGFkZXJpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4vU2hhZGVyaXR5T2JqZWN0Q3JlYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9VdGlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsNEdBQXlD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UUFFaEIsTUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0QsSUFBSSxtQkFBbUIsS0FBSyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQzFDLE9BQU8sSUFBSSxDQUFDO1NBQ1o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRCxNQUFNLENBQUMsY0FBYyxDQUNwQixJQUE2RztRQUU3RyxJQUNDLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxLQUFLLGFBQWEsSUFBSSxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxnQkFBZ0I7WUFDbkcsSUFBSSxLQUFLLFlBQVksSUFBSSxJQUFJLEtBQUssY0FBYyxJQUFJLElBQUksS0FBSyxZQUFZLElBQUksSUFBSSxLQUFLLGlCQUFpQjtZQUN2RyxJQUFJLEtBQUssWUFBWSxJQUFJLElBQUksS0FBSyxjQUFjLElBQUksSUFBSSxLQUFLLFlBQVksSUFBSSxJQUFJLEtBQUssaUJBQWlCO1lBQ3ZHLElBQUksS0FBSyxpQkFBaUIsSUFBSSxJQUFJLEtBQUssbUJBQW1CLElBQUksSUFBSSxLQUFLLHNCQUFzQixFQUM1RjtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ1o7YUFBTTtZQUNOLE9BQU8sS0FBSyxDQUFDO1NBQ2I7SUFDRixDQUFDO0NBQ0Q7QUF4RkQsMEJBd0ZDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuLy4uLy4uL2Rpc3QvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IFNoYWRlcml0eSBmcm9tICcuL21haW4vU2hhZGVyaXR5JztcclxuaW1wb3J0IF9TaGFkZXJpdHlPYmplY3RDcmVhdG9yIGZyb20gJy4vbWFpbi9TaGFkZXJpdHlPYmplY3RDcmVhdG9yJztcclxuaW1wb3J0IF9SZWZsZWN0aW9uIGZyb20gJy4vbWFpbi9SZWZsZWN0aW9uJztcclxuXHJcbmltcG9ydCB7XHJcbiAgQXR0cmlidXRlU2VtYW50aWNzIGFzIF9BdHRyaWJ1dGVTZW1hbnRpY3MsXHJcbiAgUmVmbGVjdGlvbkF0dHJpYnV0ZSBhcyBfUmVmbGVjdGlvbkF0dHJpYnV0ZSxcclxuICBSZWZsZWN0aW9uVW5pZm9ybSBhcyBfUmVmbGVjdGlvblVuaWZvcm0sXHJcbiAgUmVmbGVjdGlvblZhcnlpbmcgYXMgX1JlZmxlY3Rpb25WYXJ5aW5nLFxyXG4gIFNoYWRlcml0eU9iamVjdCBhcyBfU2hhZGVyaXR5T2JqZWN0LFxyXG4gIFNoYWRlckV4dGVuc2lvbkJlaGF2aW9yIGFzIF9TaGFkZXJFeHRlbnNpb25CZWhhdmlvcixcclxuICBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyBhcyBfU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMsXHJcbiAgU2hhZGVyUHJlY2lzaW9uT2JqZWN0IGFzIF9TaGFkZXJQcmVjaXNpb25PYmplY3QsXHJcbiAgU2hhZGVyU3RhZ2VTdHIgYXMgX1NoYWRlclN0YWdlU3RyLFxyXG4gIFNoYWRlclByZWNpc2lvblR5cGUgYXMgX1NoYWRlclByZWNpc2lvblR5cGUsXHJcbiAgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSBhcyBfU2hhZGVyQXR0cmlidXRlVmFyVHlwZSxcclxuICBTaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUgYXMgX1NoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSxcclxuICBTaGFkZXJWYXJ5aW5nVmFyVHlwZSBhcyBfU2hhZGVyVmFyeWluZ1ZhclR5cGUsXHJcbiAgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMgYXMgX1NoYWRlclVuaWZvcm1WYXJUeXBlRVMzLFxyXG4gIFNoYWRlclN0cnVjdE1lbWJlck9iamVjdCBhcyBfU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0LFxyXG4gIFNoYWRlclVCT1ZhcmlhYmxlT2JqZWN0IGFzIF9TaGFkZXJVQk9WYXJpYWJsZU9iamVjdCxcclxuICBTaGFkZXJBdHRyaWJ1dGVPYmplY3QgYXMgX1NoYWRlckF0dHJpYnV0ZU9iamVjdCxcclxuICBTaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0IGFzIF9TaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0LFxyXG4gIFNoYWRlckNvbnN0YW50VmFsdWVPYmplY3QgYXMgX1NoYWRlckNvbnN0YW50VmFsdWVPYmplY3QsXHJcbiAgU2hhZGVyRXh0ZW5zaW9uT2JqZWN0IGFzIF9TaGFkZXJFeHRlbnNpb25PYmplY3QsXHJcbiAgU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdCBhcyBfU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdCxcclxuICBTaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0IGFzIF9TaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0LFxyXG4gIFNoYWRlclVuaWZvcm1PYmplY3QgYXMgX1NoYWRlclVuaWZvcm1PYmplY3QsXHJcbiAgU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCBhcyBfU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCxcclxuICBTaGFkZXJWYXJ5aW5nT2JqZWN0IGFzIF9TaGFkZXJWYXJ5aW5nT2JqZWN0LFxyXG4gIFNoYWRlclZlcnNpb24gYXMgX1NoYWRlclZlcnNpb24sXHJcbiAgVGVtcGxhdGVPYmplY3QgYXMgX1RlbXBsYXRlT2JqZWN0LFxyXG4gIFVuaWZvcm1TZW1hbnRpY3MgYXMgX1VuaWZvcm1TZW1hbnRpY3MsXHJcbiAgVmFyVHlwZSBhcyBfVmFyVHlwZSxcclxufSBmcm9tICcuL3R5cGVzL3R5cGUnO1xyXG5cclxuZXhwb3J0IHtcclxuICBTaGFkZXJpdHlPYmplY3RDcmVhdG9yIGFzIF9TaGFkZXJpdHlPYmplY3RDcmVhdG9yLFxyXG4gIFJlZmxlY3Rpb24gYXMgX1JlZmxlY3Rpb24sXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEF0dHJpYnV0ZVNlbWFudGljcyA9IF9BdHRyaWJ1dGVTZW1hbnRpY3M7XHJcbmV4cG9ydCB0eXBlIFJlZmxlY3Rpb25BdHRyaWJ1dGUgPSBfUmVmbGVjdGlvbkF0dHJpYnV0ZTtcclxuZXhwb3J0IHR5cGUgUmVmbGVjdGlvblVuaWZvcm0gPSBfUmVmbGVjdGlvblVuaWZvcm07XHJcbmV4cG9ydCB0eXBlIFJlZmxlY3Rpb25WYXJ5aW5nID0gX1JlZmxlY3Rpb25WYXJ5aW5nO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJpdHlPYmplY3QgPSBfU2hhZGVyaXR5T2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJFeHRlbnNpb25CZWhhdmlvciA9IF9TaGFkZXJFeHRlbnNpb25CZWhhdmlvcjtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgPSBfU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzM7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclByZWNpc2lvbk9iamVjdCA9IF9TaGFkZXJQcmVjaXNpb25PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclN0YWdlU3RyID0gX1NoYWRlclN0YWdlU3RyO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJQcmVjaXNpb25UeXBlID0gX1NoYWRlclByZWNpc2lvblR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgPSBfU2hhZGVyQXR0cmlidXRlVmFyVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlID0gX1NoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmFyeWluZ1ZhclR5cGUgPSBfU2hhZGVyVmFyeWluZ1ZhclR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzID0gX1NoYWRlclVuaWZvcm1WYXJUeXBlRVMzO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3QgPSBfU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVQk9WYXJpYWJsZU9iamVjdCA9IF9TaGFkZXJVQk9WYXJpYWJsZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQXR0cmlidXRlT2JqZWN0ID0gX1NoYWRlckF0dHJpYnV0ZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdCA9IF9TaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0ID0gX1NoYWRlckNvbnN0YW50VmFsdWVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckV4dGVuc2lvbk9iamVjdCA9IF9TaGFkZXJFeHRlbnNpb25PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3QgPSBfU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdCA9IF9TaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVbmlmb3JtT2JqZWN0ID0gX1NoYWRlclVuaWZvcm1PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3QgPSBfU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmFyeWluZ09iamVjdCA9IF9TaGFkZXJWYXJ5aW5nT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJWZXJzaW9uID0gX1NoYWRlclZlcnNpb247XHJcbmV4cG9ydCB0eXBlIFRlbXBsYXRlT2JqZWN0ID0gX1RlbXBsYXRlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBVbmlmb3JtU2VtYW50aWNzID0gX1VuaWZvcm1TZW1hbnRpY3M7XHJcbmV4cG9ydCB0eXBlIFZhclR5cGUgPSBfVmFyVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciA9IF9TaGFkZXJpdHlPYmplY3RDcmVhdG9yO1xyXG5leHBvcnQgdHlwZSBSZWZsZWN0aW9uID0gX1JlZmxlY3Rpb247XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaGFkZXJpdHlcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlUHJvY2Vzc29yIHtcbiAgICBwcml2YXRlIHN0YXRpYyBkZWZpbml0aW9uczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAgIHByaXZhdGUgc3RhdGljIGV2YWx1YXRlQ29uZGl0aW9uKGNvbmRpdGlvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIOaVsOWApOavlOi8g+OBruato+imj+ihqOePvlxuICAgICAgICBjb25zdCBudW1lcmljQ29tcGFyaXNvbiA9IC8oXFx3KylcXHMqKD09fCE9fD58PHw+PXw8PSlcXHMqKFxcZCspL2c7XG4gICAgICAgIC8vIGRlZmluZWQoKeODgeOCp+ODg+OCr+OBruato+imj+ihqOePvlxuICAgICAgICBjb25zdCBkZWZpbmVkQ2hlY2sgPSAvZGVmaW5lZFxccypcXChcXHMqKFxcdyspXFxzKlxcKS9nO1xuICAgICAgICAvLyAhZGVmaW5lZCgp44OB44Kn44OD44Kv44Gu5q2j6KaP6KGo54++XG4gICAgICAgIGNvbnN0IG5vdERlZmluZWRDaGVjayA9IC8hXFxzKmRlZmluZWRcXHMqXFwoXFxzKihcXHcrKVxccypcXCkvZztcblxuICAgICAgICAvLyDmnaHku7blvI/jgpLoqZXkvqHlj6/og73jgarlvaLlvI/jgavlpInmj5tcbiAgICAgICAgbGV0IGV2YWx1YXRhYmxlQ29uZGl0aW9uID0gY29uZGl0aW9uO1xuXG4gICAgICAgIC8vIGRlZmluZWQoKeOBruipleS+oVxuICAgICAgICBldmFsdWF0YWJsZUNvbmRpdGlvbiA9IGV2YWx1YXRhYmxlQ29uZGl0aW9uLnJlcGxhY2UoZGVmaW5lZENoZWNrLCAoXywgbmFtZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbnMuaGFzKG5hbWUpID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gIWRlZmluZWQoKeOBruipleS+oVxuICAgICAgICBldmFsdWF0YWJsZUNvbmRpdGlvbiA9IGV2YWx1YXRhYmxlQ29uZGl0aW9uLnJlcGxhY2Uobm90RGVmaW5lZENoZWNrLCAoXywgbmFtZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbnMuaGFzKG5hbWUpID8gJ2ZhbHNlJyA6ICd0cnVlJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5pWw5YCk5q+U6LyD44Gu6KmV5L6hXG4gICAgICAgIGV2YWx1YXRhYmxlQ29uZGl0aW9uID0gZXZhbHVhdGFibGVDb25kaXRpb24ucmVwbGFjZShudW1lcmljQ29tcGFyaXNvbiwgKG1hdGNoLCB2YXJOYW1lLCBvcGVyYXRvciwgdmFsdWVTdHIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlZmluZWRWYWx1ZSA9IHRoaXMuZGVmaW5pdGlvbnMuZ2V0KHZhck5hbWUpO1xuICAgICAgICAgICAgaWYgKGRlZmluZWRWYWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ2ZhbHNlJztcblxuICAgICAgICAgICAgY29uc3QgdmFsdWUxID0gcGFyc2VJbnQoZGVmaW5lZFZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlMiA9IHBhcnNlSW50KHZhbHVlU3RyKTtcblxuICAgICAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgICAgIGNhc2UgJz09JzogcmV0dXJuIHZhbHVlMSA9PT0gdmFsdWUyID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjYXNlICchPSc6IHJldHVybiB2YWx1ZTEgIT09IHZhbHVlMiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgY2FzZSAnPic6IHJldHVybiB2YWx1ZTEgPiB2YWx1ZTIgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgICAgICAgICAgICAgIGNhc2UgJzwnOiByZXR1cm4gdmFsdWUxIDwgdmFsdWUyID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjYXNlICc+PSc6IHJldHVybiB2YWx1ZTEgPj0gdmFsdWUyID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjYXNlICc8PSc6IHJldHVybiB2YWx1ZTEgPD0gdmFsdWUyID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gJ2ZhbHNlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g6KuW55CG5ryU566X5a2Q44Gu6KmV5L6hXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyDlronlhajjgaroqZXkvqHjga7jgZ/jgoHjgIHmnaHku7blvI/jgpLmpJzoqLxcbiAgICAgICAgICAgIGlmICghL15bYS16QS1aMC05XFxzXFwoXFwpISZ8XSskLy50ZXN0KGV2YWx1YXRhYmxlQ29uZGl0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25kaXRpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6KuW55CG5ryU566X5a2Q44Gu5YmN5b6M44Gr44K544Oa44O844K544KS6L+95YqgXG4gICAgICAgICAgICBldmFsdWF0YWJsZUNvbmRpdGlvbiA9IGV2YWx1YXRhYmxlQ29uZGl0aW9uXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLyYmL2csICcgJiYgJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFx8XFx8L2csICcgfHwgJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvIS9nLCAnICEgJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCAnICcpXG4gICAgICAgICAgICAgICAgLnRyaW0oKTtcblxuICAgICAgICAgICAgLy8gSmF2YVNjcmlwdOOBruirlueQhuW8j+OBqOOBl+OBpuipleS+oVxuICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKGByZXR1cm4gJHtldmFsdWF0YWJsZUNvbmRpdGlvbn1gKSgpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZXZhbHVhdGluZyBjb25kaXRpb246JywgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBwcm9jZXNzKHNwbGl0dGVkTGluZXM6IHN0cmluZ1tdLCBzdGFydExpbmVTdHI/OiBzdHJpbmcsIGVuZExpbmVTdHI/OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IGRlZmluZSA9IC8jZGVmaW5lW1xcdCBdKyhcXHcrKSg/OltcXHQgXSsoXFxTKykpPy87XG4gICAgICAgIGNvbnN0IGlmZGVmID0gLyNpZmRlZltcXHQgXSsoXFx3KykvO1xuICAgICAgICBjb25zdCBpZm5kZWYgPSAvI2lmbmRlZltcXHQgXSsoXFx3KykvO1xuICAgICAgICBjb25zdCBfaWYgPSAvI2lmW1xcdCBdKyguKykvO1xuICAgICAgICBjb25zdCBlbGlmID0gLyNlbGlmW1xcdCBdKyguKykvO1xuICAgICAgICBjb25zdCBfZWxzZSA9IC8jZWxzZS87XG4gICAgICAgIGNvbnN0IGVuZGlmID0gLyNlbmRpZi87XG4gICAgICAgIGNvbnN0IHByZXZpb3VzT3V0cHV0U3RhdGVzOiBib29sZWFuW10gPSBbXTtcbiAgICAgICAgbGV0IG91dHB1dEZsZyA9IHRydWU7XG4gICAgICAgIGNvbnN0IGlmZGVmczogc3RyaW5nW11bXSA9IFtdO1xuICAgICAgICBjb25zdCBpZmRlZk1hdGNoZWQ6IGJvb2xlYW5bXSA9IFtdO1xuICAgICAgICBjb25zdCBvdXRwdXRMaW5lczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICB0aGlzLmRlZmluaXRpb25zLmNsZWFyKCk7XG5cbiAgICAgICAgbGV0IHN0YXJ0TGluZSA9IDA7XG4gICAgICAgIGxldCBlbmRMaW5lID0gc3BsaXR0ZWRMaW5lcy5sZW5ndGg7XG4gICAgICAgIGlmIChzdGFydExpbmVTdHIpIHtcbiAgICAgICAgICAgIHN0YXJ0TGluZSA9IHNwbGl0dGVkTGluZXMuZmluZEluZGV4KGxpbmUgPT4gbGluZS5pbmNsdWRlcyhzdGFydExpbmVTdHIpKTtcbiAgICAgICAgICAgIGlmIChzdGFydExpbmUgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwbGl0dGVkTGluZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZExpbmVTdHIpIHtcbiAgICAgICAgICAgIGVuZExpbmUgPSBzcGxpdHRlZExpbmVzLmZpbmRJbmRleChsaW5lID0+IGxpbmUuaW5jbHVkZXMoZW5kTGluZVN0cikpO1xuICAgICAgICAgICAgaWYgKGVuZExpbmUgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwbGl0dGVkTGluZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydExpbmU7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHNwbGl0dGVkTGluZXNbaV07XG4gICAgICAgICAgICBvdXRwdXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydExpbmU7IGkgPCBlbmRMaW5lOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBzcGxpdHRlZExpbmVzW2ldO1xuICAgICAgICAgICAgbGV0IGlzUHJhZ21hID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHsgLy8gI2RlZmluZVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlID0gbGluZS5tYXRjaChkZWZpbmUpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtfLCBuYW1lLCB2YWx1ZSA9IFwiMVwiXSA9IHJlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmluaXRpb25zLnNldChuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2lmZGVmLCAjaWZuZGVmLCAjaWZcbiAgICAgICAgICAgICAgICBjb25zdCByZUlmZGVmID0gbGluZS5tYXRjaChpZmRlZik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVJZm5kZWYgPSBsaW5lLm1hdGNoKGlmbmRlZik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVJZiA9IGxpbmUubWF0Y2goX2lmKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZUlmZGVmIHx8IHJlSWZuZGVmIHx8IHJlSWYpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNPdXRwdXRTdGF0ZXMucHVzaChvdXRwdXRGbGcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29uZGl0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAocmVJZmRlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uID0gYGRlZmluZWQoJHtyZUlmZGVmWzFdfSlgO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlSWZuZGVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb24gPSBgIWRlZmluZWQoJHtyZUlmbmRlZlsxXX0pYDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZUlmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb24gPSByZUlmWzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWZkZWZzLnB1c2goW2NvbmRpdGlvbl0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dEZsZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gdGhpcy5ldmFsdWF0ZUNvbmRpdGlvbihjb25kaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWZkZWZNYXRjaGVkLnB1c2gob3V0cHV0RmxnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmZGVmTWF0Y2hlZC5wdXNoKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpc1ByYWdtYSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB7IC8vICNlbGlmXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBsaW5lLm1hdGNoKGVsaWYpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHJlWzFdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SWZkZWZzID0gaWZkZWZzW2lmZGVmcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c091dHB1dFN0YXRlc1twcmV2aW91c091dHB1dFN0YXRlcy5sZW5ndGggLSAxXSAmJiAhaWZkZWZNYXRjaGVkW2lmZGVmTWF0Y2hlZC5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gdGhpcy5ldmFsdWF0ZUNvbmRpdGlvbihjb25kaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dEZsZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmZGVmTWF0Y2hlZFtpZmRlZk1hdGNoZWQubGVuZ3RoIC0gMV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudElmZGVmcy5wdXNoKGNvbmRpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2Vsc2VcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IGxpbmUubWF0Y2goX2Vsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c091dHB1dFN0YXRlc1twcmV2aW91c091dHB1dFN0YXRlcy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gIWlmZGVmTWF0Y2hlZFtpZmRlZk1hdGNoZWQubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpc1ByYWdtYSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB7IC8vICNlbmRpZlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlID0gbGluZS5tYXRjaChlbmRpZik7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gcHJldmlvdXNPdXRwdXRTdGF0ZXNbcHJldmlvdXNPdXRwdXRTdGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWZkZWZzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZmRlZk1hdGNoZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzT3V0cHV0U3RhdGVzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG91dHB1dEZsZyAmJiAhaXNQcmFnbWEpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBlbmRMaW5lOyBpIDwgc3BsaXR0ZWRMaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHNwbGl0dGVkTGluZXNbaV07XG4gICAgICAgICAgICBvdXRwdXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXRMaW5lcztcbiAgICB9XG59XG5cbiIsImltcG9ydCB7XG5cdEF0dHJpYnV0ZVNlbWFudGljcyxcblx0UmVmbGVjdGlvbkF0dHJpYnV0ZSxcblx0UmVmbGVjdGlvblVuaWZvcm0sXG5cdFJlZmxlY3Rpb25WYXJ5aW5nLFxuXHRTaGFkZXJTdGFnZVN0cixcblx0VW5pZm9ybVNlbWFudGljcyxcblx0VmFyVHlwZSxcbn0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBnZXRzIHRoZSBhdHRyaWJ1dGUsIHZhcnlpbmcsIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uIGZyb20gdGhlIGNvZGUgcHJvcGVydHkgb2YgYSBzaGFkZXJpdHkgb2JqZWN0LlxuICogVGhlIG1ldGhvZHMgb2YgdGhlIFNoYWRlcml0eSBpbnN0YW5jZSBjcmVhdGUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcy5cbiAqXG4gKiBCZWZvcmUgZ2V0dGluZyB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIGF0dHJpYnV0ZSwgdmFyeWluZywgYW5kIHVuaWZvcm0sIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZmxlY3Rpb24ge1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBhdHRyaWJ1dGVBbmRWYXJ5aW5nVHlwZVJlZ0V4cFxuXHRcdD0gL1tcXHQgXSsoZmxvYXR8aW50fHZlYzJ8dmVjM3x2ZWM0fG1hdDJ8bWF0M3xtYXQ0fGl2ZWMyfGl2ZWMzfGl2ZWM0KVtcXHQgXSsoXFx3Kyk7Lztcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgdW5pZm9ybVR5cGVSZWdFeHBcblx0XHQ9IC9bXFx0IF0rKGZsb2F0fGludHx2ZWMyfHZlYzN8dmVjNHxtYXQyfG1hdDN8bWF0NHxpdmVjMnxpdmVjM3xpdmVjNHxzYW1wbGVyMkR8c2FtcGxlckN1YmV8c2FtcGxlcjNEKVtcXHQgXSsoXFx3Kyk7Lztcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgc2VtYW50aWNSZWdFeHAgPSAvPC4qc2VtYW50aWNbXFx0IF0qPVtcXHQgXSooXFx3KykuKj4vO1xuXG5cdHByaXZhdGUgX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXHRwcml2YXRlIF9fdW5pZm9ybVNlbWFudGljc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdHByaXZhdGUgX19hdHRyaWJ1dGVzOiBSZWZsZWN0aW9uQXR0cmlidXRlW10gPSBbXTtcblx0cHJpdmF0ZSBfX3ZhcnlpbmdzOiBSZWZsZWN0aW9uVmFyeWluZ1tdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtczogUmVmbGVjdGlvblVuaWZvcm1bXSA9IFtdO1xuXG5cdHByaXZhdGUgcmVhZG9ubHkgX19zcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdO1xuXHRwcml2YXRlIHJlYWRvbmx5IF9fc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyO1xuXG5cdGNvbnN0cnVjdG9yKHNwbGl0dGVkU2hhZGVyaXR5U2hhZGVyQ29kZTogc3RyaW5nW10sIHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdHRoaXMuX19zcGxpdHRlZFNoYWRlckNvZGUgPSBzcGxpdHRlZFNoYWRlcml0eVNoYWRlckNvZGU7XG5cdFx0dGhpcy5fX3NoYWRlclN0YWdlID0gc2hhZGVyU3RhZ2U7XG5cdFx0dGhpcy5fX3NldERlZmF1bHRBdHRyaWJ1dGVBbmRVbmlmb3JtU2VtYW50aWNzTWFwKCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhbGwgYXR0cmlidXRlIHZhcmlhYmxlIGluZm9ybWF0aW9uIGluIHRoZSBzaGFkZXIgY29kZS5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIFJlZmxlY3Rpb25BdHRyaWJ1dGUgb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGF0dHJpYnV0ZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19hdHRyaWJ1dGVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYWxsIHZhcnlpbmcgdmFyaWFibGUgaW5mb3JtYXRpb24gaW4gdGhlIHNoYWRlciBjb2RlLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgUmVmbGVjdGlvblZhcnlpbmcgb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHZhcnlpbmdzKCkge1xuXHRcdHJldHVybiB0aGlzLl9fdmFyeWluZ3M7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhbGwgdW5pZm9ybSB2YXJpYWJsZSBpbmZvcm1hdGlvbiBpbiB0aGUgc2hhZGVyIGNvZGUuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBSZWZsZWN0aW9uVW5pZm9ybSBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgdW5pZm9ybXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX191bmlmb3Jtcztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIG5hbWVzIG9mIGFsbCBhdHRyaWJ1dGVzIGluY2x1ZGVkIGluIHRoZSBzaGFkZXIuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBzdHJpbmdcblx0ICovXG5cdHB1YmxpYyBnZXQgYXR0cmlidXRlc05hbWVzKCkge1xuXHRcdHJldHVybiB0aGlzLl9fYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge3JldHVybiBhdHRyaWJ1dGUubmFtZX0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgYXR0cmlidXRlIHNlbWFudGljIChlLmcuICdQT1NJVElPTicpIG9mIGFsbCBhdHRyaWJ1dGVzIGluY2x1ZGVkIGluIHRoZSBzaGFkZXIuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBBdHRyaWJ1dGVTZW1hbnRpY3Mgb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGF0dHJpYnV0ZXNTZW1hbnRpY3MoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7cmV0dXJuIGF0dHJpYnV0ZS5zZW1hbnRpY30pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgdmFyaWFibGUgdHlwZSAoZS5nLiAndmVjNCcpIG9mIGFsbCBhdHRyaWJ1dGVzIGluY2x1ZGVkIGluIHRoZSBzaGFkZXIuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBWYXJUeXBlIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCBhdHRyaWJ1dGVzVHlwZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7cmV0dXJuIGF0dHJpYnV0ZS50eXBlfSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGFuIGF0dHJpYnV0ZVNlbWFudGljcy5cblx0ICogVGhlIGF0dHJpYnV0ZVNlbWFudGljcyBpcyB1c2VkIGluIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljc1xuXHQgKiAoU2VlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgY2xhc3MpXG5cdCAqL1xuXHRwdWJsaWMgYWRkQXR0cmlidXRlU2VtYW50aWNzTWFwKG1hcDogTWFwPHN0cmluZywgc3RyaW5nPikge1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAgPSBuZXcgTWFwKFsuLi50aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLCAuLi5tYXBdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYSB1bmlmb3JtU2VtYW50aWNzLlxuXHQgKiBUaGUgYXR0cmlidXRlU2VtYW50aWNzIGlzIHVzZWQgaW4gdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWNzXG5cdCAqIChTZWUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBjbGFzcylcblx0ICovXG5cdHB1YmxpYyBhZGRVbmlmb3JtU2VtYW50aWNzTWFwKG1hcDogTWFwPHN0cmluZywgc3RyaW5nPikge1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwID0gbmV3IE1hcChbLi4udGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAsIC4uLm1hcF0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhbiBhdHRyaWJ1dGVTZW1hbnRpY3MuXG5cdCAqIFRoZSBhdHRyaWJ1dGVTZW1hbnRpY3MgaXMgdXNlZCBpbiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpY3Ncblx0ICogKFNlZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGNsYXNzKVxuXHQgKi9cblx0cHVibGljIGFkZEF0dHJpYnV0ZVNlbWFudGljcyhrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KGtleSwgdmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhIHVuaWZvcm1TZW1hbnRpY3MuXG5cdCAqIFRoZSBhdHRyaWJ1dGVTZW1hbnRpY3MgaXMgdXNlZCBpbiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpY3Ncblx0ICogKFNlZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGNsYXNzKVxuXHQgKi9cblx0cHVibGljIGFkZFVuaWZvcm1TZW1hbnRpY3Moa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoa2V5LCB2YWx1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSBhdHRyaWJ1dGVTZW1hbnRpY3Ncblx0ICovXG5cdHB1YmxpYyByZXNldEF0dHJpYnV0ZVNlbWFudGljcygpIHtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHVuaWZvcm1TZW1hbnRpY3Ncblx0ICovXG5cdHB1YmxpYyByZXNldFVuaWZvcm1TZW1hbnRpY3MoKSB7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFuYWx5emUgc2hhZGVyIGNvZGUgb2YgdGhlIHNoYWRlcml0eSBhbmQgZ2V0IGluZm9ybWF0aW9uIG9mIGF0dHJpYnV0ZSwgdmFyeWluZyBhbmQgdW5pZm9ybS5cblx0ICogVGhlIGluZm9ybWF0aW9uIGNhbiBiZSByZXRyaWV2ZWQgZnJvbSB0aGUgZ2V0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKlxuXHQgKiBUaGUgc2VtYW50aWMgcHJvcGVydHkgb2YgdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUgaXMgYXNzaWduZWQgdG8gdGhlIHZhbHVlIG9mIHRoZSBzZW1hbnRpYyBpZlxuXHQgKiBpdCBpcyBzcGVjaWZpZWQgaW4gdGhlIGF0dHJpYnV0ZSBsaW5lIG9mIHRoZSBzaGFkZXIgY29kZS4gSWYgbm90LCB0aGUgQXR0cmlidXRlU2VtYW50aWNzTWFwXG5cdCAqIGlzIHNlYXJjaGVkIGZvciBtYXRjaGluZyBzZW1hbnRpY3MsIG9yIFVOS05PV04uIFRoZSBzYW1lIGFwcGxpZXMgdG8gdGhlIHNlbWFudGljIHByb3BlcnR5IG9mXG5cdCAqIFJlZmxlY3Rpb25Vbmlmb3JtLlxuXHQgKi9cblx0cHVibGljIHJlZmxlY3QoKSB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gdGhpcy5fX3NwbGl0dGVkU2hhZGVyQ29kZTtcblx0XHRjb25zdCBzaGFkZXJTdGFnZSA9IHRoaXMuX19zaGFkZXJTdGFnZTtcblxuXHRcdGZvciAoY29uc3Qgc2hhZGVyQ29kZUxpbmUgb2Ygc3BsaXR0ZWRTaGFkZXJDb2RlKSB7XG5cdFx0XHRjb25zdCBpc0F0dHJpYnV0ZUxpbmUgPSB0aGlzLl9fbWF0Y2hBdHRyaWJ1dGUoc2hhZGVyQ29kZUxpbmUsIHNoYWRlclN0YWdlKTtcblx0XHRcdGlmIChpc0F0dHJpYnV0ZUxpbmUpIHtcblx0XHRcdFx0dGhpcy5fX2FkZEF0dHJpYnV0ZShzaGFkZXJDb2RlTGluZSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpc1ZhcnlpbmdMaW5lID0gdGhpcy5fX21hdGNoVmFyeWluZyhzaGFkZXJDb2RlTGluZSwgc2hhZGVyU3RhZ2UpO1xuXHRcdFx0aWYgKGlzVmFyeWluZ0xpbmUpIHtcblx0XHRcdFx0dGhpcy5fX2FkZFZhcnlpbmcoc2hhZGVyQ29kZUxpbmUsIHNoYWRlclN0YWdlKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzVW5pZm9ybUxpbmUgPSBzaGFkZXJDb2RlTGluZS5tYXRjaCgvXig/IVtcXC9dKVtcXHQgXSp1bmlmb3JtW1xcdCBdKy8pO1xuXHRcdFx0aWYgKGlzVW5pZm9ybUxpbmUpIHtcblx0XHRcdFx0dGhpcy5fX2FkZFVuaWZvcm0oc2hhZGVyQ29kZUxpbmUpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9fc2V0RGVmYXVsdEF0dHJpYnV0ZUFuZFVuaWZvcm1TZW1hbnRpY3NNYXAoKSB7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3Bvc2l0aW9uJywgJ1BPU0lUSU9OJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2NvbG9yJCcsICdDT0xPUl8wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2NvbG9yXz8wJywgJ0NPTE9SXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGV4Y29vcmQkJywgJ1RFWENPT1JEXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGV4Y29vcmRfPzAnLCAnVEVYQ09PUkRfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0ZXhjb29yZF8/MScsICdURVhDT09SRF8xJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RleGNvb3JkXz8yJywgJ1RFWENPT1JEXzInKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnbm9ybWFsJywgJ05PUk1BTCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0YW5nZW50JywgJ1RBTkdFTlQnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnam9pbnQkJywgJ0pPSU5UU18wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2JvbmUkJywgJ0pPSU5UU18wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2pvaW50Xz8wJywgJ0pPSU5UU18wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2JvbmVfPzAnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnd2VpZ2h0JCcsICdXRUlHSFRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnd2VpZ2h0Xz8wJywgJ1dFSUdIVFNfMCcpO1xuXG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCd3b3JsZG1hdHJpeCcsICdXb3JsZE1hdHJpeCcpO1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgnbm9ybWFsbWF0cml4JywgJ05vcm1hbE1hdHJpeCcpO1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgndmlld21hdHJpeCcsICdWaWV3TWF0cml4Jyk7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCdwcm9qZWN0aW9ubWF0cml4JywgJ1Byb2plY3Rpb25NYXRyaXgnKTtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ21vZGVsdmlld21hdHJpeCcsICdNb2RlbFZpZXdNYXRyaXgnKTtcblx0fVxuXG5cdHByaXZhdGUgX19tYXRjaEF0dHJpYnV0ZShzaGFkZXJDb2RlTGluZTogc3RyaW5nLCBzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHRpZiAoc2hhZGVyU3RhZ2UgIT09ICd2ZXJ0ZXgnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiBzaGFkZXJDb2RlTGluZS5tYXRjaCgvXig/IVtcXC9dKVtcXHQgXSooYXR0cmlidXRlfGluKVtcXHQgXSsuKzsvKTtcblx0fVxuXG5cdHByaXZhdGUgX19hZGRBdHRyaWJ1dGUoc2hhZGVyQ29kZUxpbmU6IHN0cmluZykge1xuXHRcdGNvbnN0IHJlZmxlY3Rpb25BdHRyaWJ1dGU6IFJlZmxlY3Rpb25BdHRyaWJ1dGUgPSB7XG5cdFx0XHRuYW1lOiAnJyxcblx0XHRcdHR5cGU6ICdmbG9hdCcsXG5cdFx0XHRzZW1hbnRpYzogJ1VOS05PV04nXG5cdFx0fTtcblxuXHRcdGNvbnN0IG1hdGNoVHlwZSA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24uYXR0cmlidXRlQW5kVmFyeWluZ1R5cGVSZWdFeHApO1xuXHRcdGlmIChtYXRjaFR5cGUpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBtYXRjaFR5cGVbMV07XG5cdFx0XHRyZWZsZWN0aW9uQXR0cmlidXRlLnR5cGUgPSB0eXBlIGFzIFZhclR5cGU7XG5cdFx0XHRjb25zdCBuYW1lID0gbWF0Y2hUeXBlWzJdO1xuXHRcdFx0cmVmbGVjdGlvbkF0dHJpYnV0ZS5uYW1lID0gbmFtZTtcblxuXHRcdFx0Y29uc3QgbWF0Y2hTZW1hbnRpYyA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24uc2VtYW50aWNSZWdFeHApXG5cdFx0XHRpZiAobWF0Y2hTZW1hbnRpYykge1xuXHRcdFx0XHRyZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljID0gbWF0Y2hTZW1hbnRpY1sxXSBhcyBBdHRyaWJ1dGVTZW1hbnRpY3M7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgdGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcCkge1xuXHRcdFx0XHRcdGlmIChuYW1lLm1hdGNoKG5ldyBSZWdFeHAoa2V5LCAnaScpKSkge1xuXHRcdFx0XHRcdFx0cmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpYyA9IHZhbHVlIGFzIEF0dHJpYnV0ZVNlbWFudGljcztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZXMucHVzaChyZWZsZWN0aW9uQXR0cmlidXRlKTtcblx0fVxuXG5cdHByaXZhdGUgX19tYXRjaFZhcnlpbmcoc2hhZGVyQ29kZUxpbmU6IHN0cmluZywgc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0aWYgKHNoYWRlclN0YWdlID09PSAndmVydGV4Jykge1xuXHRcdFx0cmV0dXJuIHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKih2YXJ5aW5nfG91dClbXFx0IF0rLis7Lyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBzaGFkZXJDb2RlTGluZS5tYXRjaCgvXig/IVtcXC9dKVtcXHQgXSoodmFyeWluZ3xpbilbXFx0IF0rLis7Lyk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfX2FkZFZhcnlpbmcoc2hhZGVyQ29kZUxpbmU6IHN0cmluZywgc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0Y29uc3QgcmVmbGVjdGlvblZhcnlpbmc6IFJlZmxlY3Rpb25WYXJ5aW5nID0ge1xuXHRcdFx0bmFtZTogJycsXG5cdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0aW5vdXQ6ICdpbidcblx0XHR9O1xuXG5cdFx0Y29uc3QgbWF0Y2hUeXBlID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi5hdHRyaWJ1dGVBbmRWYXJ5aW5nVHlwZVJlZ0V4cCk7XG5cdFx0aWYgKG1hdGNoVHlwZSkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IG1hdGNoVHlwZVsxXTtcblx0XHRcdHJlZmxlY3Rpb25WYXJ5aW5nLnR5cGUgPSB0eXBlIGFzIFZhclR5cGU7XG5cdFx0XHRjb25zdCBuYW1lID0gbWF0Y2hUeXBlWzJdO1xuXHRcdFx0cmVmbGVjdGlvblZhcnlpbmcubmFtZSA9IG5hbWU7XG5cdFx0XHRyZWZsZWN0aW9uVmFyeWluZy5pbm91dCA9IChzaGFkZXJTdGFnZSA9PT0gJ3ZlcnRleCcpID8gJ291dCcgOiAnaW4nO1xuXHRcdH1cblx0XHR0aGlzLl9fdmFyeWluZ3MucHVzaChyZWZsZWN0aW9uVmFyeWluZyk7XG5cdH1cblxuXHRwcml2YXRlIF9fYWRkVW5pZm9ybShzaGFkZXJDb2RlTGluZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgcmVmbGVjdGlvblVuaWZvcm06IFJlZmxlY3Rpb25Vbmlmb3JtID0ge1xuXHRcdFx0bmFtZTogJycsXG5cdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0c2VtYW50aWM6ICdVTktOT1dOJ1xuXHRcdH07XG5cblx0XHRjb25zdCBtYXRjaFR5cGUgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLnVuaWZvcm1UeXBlUmVnRXhwKTtcblx0XHRpZiAobWF0Y2hUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gbWF0Y2hUeXBlWzFdO1xuXHRcdFx0cmVmbGVjdGlvblVuaWZvcm0udHlwZSA9IHR5cGUgYXMgVmFyVHlwZTtcblx0XHRcdGNvbnN0IG5hbWUgPSBtYXRjaFR5cGVbMl07XG5cdFx0XHRyZWZsZWN0aW9uVW5pZm9ybS5uYW1lID0gbmFtZTtcblxuXHRcdFx0Y29uc3QgbWF0Y2hTZW1hbnRpY3MgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLnNlbWFudGljUmVnRXhwKVxuXHRcdFx0aWYgKG1hdGNoU2VtYW50aWNzKSB7XG5cdFx0XHRcdHJlZmxlY3Rpb25Vbmlmb3JtLnNlbWFudGljID0gbWF0Y2hTZW1hbnRpY3NbMV0gYXMgVW5pZm9ybVNlbWFudGljcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiB0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcCkge1xuXHRcdFx0XHRcdGlmIChuYW1lLm1hdGNoKG5ldyBSZWdFeHAoa2V5LCAnaScpKSkge1xuXHRcdFx0XHRcdFx0cmVmbGVjdGlvblVuaWZvcm0uc2VtYW50aWMgPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5fX3VuaWZvcm1zLnB1c2gocmVmbGVjdGlvblVuaWZvcm0pO1xuXHR9XG59OyIsImltcG9ydCB7VGVtcGxhdGVPYmplY3R9IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgZWRpdHMgdGhlIGNvZGUgcHJvcGVydHkgb2YgYSBzaGFkZXJpdHkgb2JqZWN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFkZXJFZGl0b3Ige1xuXHRzdGF0aWMgX2luc2VydERlZmluaXRpb24oc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZGVmaW5pdGlvbjogc3RyaW5nKSB7XG5cdFx0Y29uc3QgZGVmU3RyID0gZGVmaW5pdGlvbi5yZXBsYWNlKC8jZGVmaW5lW1xcdCBdKy8sICcnKTtcblxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZS51bnNoaWZ0KGAjZGVmaW5lICR7ZGVmU3RyfWApO1xuXHR9XG5cblx0c3RhdGljIF9maWxsVGVtcGxhdGUoc2hhZGVyQ29kZTogc3RyaW5nLCB0ZW1wbGF0ZU9iamVjdDogVGVtcGxhdGVPYmplY3QpIHtcblx0XHRjb25zdCB0ZW1wbGF0ZVN0cmluZyA9IHNoYWRlckNvZGUucmVwbGFjZSgvXFwvXFwqW1xcdCBdKnNoYWRlcml0eTpbXFx0IF0qKEB7W1xcdCBdKikoXFxTKykoW1xcdCBdKn0pW1xcdCBdKlxcKlxcLy9nLCAnJHt0aGlzLiQyfScpO1xuXG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IG5ldyBGdW5jdGlvbihcInJldHVybiBgXCIgKyB0ZW1wbGF0ZVN0cmluZyArIFwiYDtcIikuY2FsbCh0ZW1wbGF0ZU9iamVjdCk7XG5cdFx0cmV0dXJuIHJlc3VsdENvZGU7XG5cdH1cbn0iLCJpbXBvcnQge1NoYWRlclZlcnNpb259IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgY29udmVydHMgdGhlIGNvZGUgcHJvcGVydHkgb2YgYSBzaGFkZXJpdHkgb2JqZWN0IHRvIHRoZSBzcGVjaWZpZWQgZm9ybWF0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFkZXJUcmFuc2Zvcm1lciB7XG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIEVTMyBzaGFkZXIgY29kZSB0byBhIEdMU0wgRVMxIHNoYWRlciBjb2RlXG5cdCAqL1xuXHRzdGF0aWMgX3RyYW5zZm9ybVRvR0xTTEVTMShcblx0XHRzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLFxuXHRcdGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4sXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHR0aGlzLl9fY29udmVydE9ySW5zZXJ0VmVyc2lvbkdMU0xFUzEoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fcmVtb3ZlRVMzUXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0dGhpcy5fX2NvbnZlcnRJbihzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdHRoaXMuX19jb252ZXJ0T3V0KHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlciwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0dGhpcy5fX3JlbW92ZVByZWNpc2lvbkZvckVTMyhzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzEoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSA9IHNwbGl0dGVkU2hhZGVyQ29kZTtcblxuXHRcdHJldHVybiB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIEVTMSBzaGFkZXIgY29kZSB0byBhIEdMU0wgRVMzIHNoYWRlciBjb2RlXG5cdCAqL1xuXHRzdGF0aWMgX3RyYW5zZm9ybVRvR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fX2NvbnZlcnRPckluc2VydFZlcnNpb25HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRBdHRyaWJ1dGUoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyKTtcblx0XHR0aGlzLl9fY29udmVydFZhcnlpbmcoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmVDdWJlKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlMkQoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmUyRFByb2Qoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmUzRChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZTNEUHJvZChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlID0gc3BsaXR0ZWRTaGFkZXJDb2RlO1xuXG5cdFx0cmV0dXJuIHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgc2hhZGVyIGNvZGUgdG8gYSBzaGFkZXIgY29kZSBvZiBzcGVjaWZpZWQgR0xTTCB2ZXJzaW9uXG5cdCAqL1xuXHRzdGF0aWMgX3RyYW5zZm9ybVRvKFxuXHRcdHZlcnNpb246IFNoYWRlclZlcnNpb24sXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSxcblx0XHRpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuLFxuXHRcdGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW5cblx0KSB7XG5cdFx0aWYgKHZlcnNpb24ubWF0Y2goL3dlYmdsMnxlczMvaSkpIHtcblx0XHRcdHJldHVybiB0aGlzLl90cmFuc2Zvcm1Ub0dMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyKTtcblx0XHR9IGVsc2UgaWYgKHZlcnNpb24ubWF0Y2goL3dlYmdsMXxlczEvaSkpIHtcblx0XHRcdHJldHVybiB0aGlzLl90cmFuc2Zvcm1Ub0dMU0xFUzEoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5lcnJvcignSW52YWxpZCBWZXJzaW9uJylcblx0XHRcdHJldHVybiBzcGxpdHRlZFNoYWRlckNvZGU7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIElmIHRoZSBmaXJzdCBsaW5lIGNvbnRhaW5zIHZlcnNpb24gaW5mb3JtYXRpb24sIG92ZXJ3cml0ZSB0aGUgZmlyc3QgbGluZSB3aXRoICcjdmVyc2lvbiAxMDAnLlxuXHQgKiBJZiBub3QsIGFkZCAnI3ZlcnNpb24gMTAwJyB0byB0aGUgZmlyc3QgbGluZS5cblx0ICpcblx0ICogTm90ZTogSWYgdGhlIGZpcnN0IGxpbmUgaXMgY29tbWVudGVkIG91dCBhbmQgdGhlIHZlcnNpb24gaW5mb3JtYXRpb24gaXMgd3JpdHRlbiBpbiB0aGUgc2Vjb25kIG9yIGxhdGVyIGxpbmUsXG5cdCAqIHRoZSBhcHByb3ByaWF0ZSB2ZXJzaW9uIGluZm9ybWF0aW9uIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGZpcnN0IGxpbmUgYW5kIHRoZSB1c2VyLWRlZmluZWQgdmVyc2lvbiBpbmZvcm1hdGlvblxuXHQgKiBpbiB0aGUgc2Vjb25kIG9yIGxhdGVyIGxpbmUgd2lsbCBiZSByZW1vdmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0T3JJbnNlcnRWZXJzaW9uR0xTTEVTMShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qI1tcXHQgXSp2ZXJzaW9uW1xcdCBdKy4qLztcblx0XHR0aGlzLl9fcmVtb3ZlRmlyc3RNYXRjaGluZ0xpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcpO1xuXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnVuc2hpZnQoJyN2ZXJzaW9uIDEwMCcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIElmIHRoZSBmaXJzdCBsaW5lIGNvbnRhaW5zIHZlcnNpb24gaW5mb3JtYXRpb24sIG92ZXJ3cml0ZSB0aGUgZmlyc3QgbGluZSB3aXRoICcjdmVyc2lvbiAzMDAgZXMnLlxuXHQgKiBJZiBub3QsIGFkZCAnI3ZlcnNpb24gMzAwIGVzJyB0byB0aGUgZmlyc3QgbGluZS5cblx0ICogSW4gYm90aCBjYXNlcywgJyNkZWZpbmUgR0xTTF9FUzMnIHdpbGwgYmUgaW5zZXJ0ZWQgaW4gdGhlIHNlY29uZCBsaW5lLlxuXHQgKiBVc2UgdGhlICcjZGVmaW5lIEdMU0xfRVMzJyBkaXJlY3RpdmUgaWYgeW91IHdhbnQgdG8gd3JpdGUgYSBzaGFkZXIgY29kZSB0aGF0IHdpbGwgb25seSBydW4gaW4gdGhlIGNhc2Ugb2Ygd2ViZ2wyLlxuXHQgKlxuXHQgKiBOb3RlOiBJZiB0aGUgZmlyc3QgbGluZSBpcyBjb21tZW50ZWQgb3V0IGFuZCB0aGUgdmVyc2lvbiBpbmZvcm1hdGlvbiBpcyB3cml0dGVuIGluIHRoZSBzZWNvbmQgb3IgbGF0ZXIgbGluZSxcblx0ICogdGhlIGFwcHJvcHJpYXRlIHZlcnNpb24gaW5mb3JtYXRpb24gd2lsbCBiZSBhZGRlZCB0byB0aGUgZmlyc3QgbGluZSBhbmQgdGhlIHVzZXItZGVmaW5lZCB2ZXJzaW9uIGluZm9ybWF0aW9uXG5cdCAqIGluIHRoZSBzZWNvbmQgb3IgbGF0ZXIgbGluZSB3aWxsIGJlIHJlbW92ZWQuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRPckluc2VydFZlcnNpb25HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSojW1xcdCBdKnZlcnNpb25bXFx0IF0rLiovO1xuXHRcdHRoaXMuX19yZW1vdmVGaXJzdE1hdGNoaW5nTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZyk7XG5cblx0XHRzcGxpdHRlZFNoYWRlckNvZGUudW5zaGlmdCgnI2RlZmluZSBHTFNMX0VTMycpO1xuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZS51bnNoaWZ0KCcjdmVyc2lvbiAzMDAgZXMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAnaW4nIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzEgcXVhbGlmaWVyKCdhdHRyaWJ1dGUnIG9yICd2YXJ5aW5nJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydEluKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSppbltcXHQgXSsoKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKlxcdytbXFx0IF0qXFx3K1tcXHQgXSo7KS87XG5cblx0XHRsZXQgcmVwbGFjZUZ1bmM7XG5cdFx0aWYgKGlzRnJhZ21lbnRTaGFkZXIpIHtcblx0XHRcdHJlcGxhY2VGdW5jID0gZnVuY3Rpb24gKG1hdGNoOiBzdHJpbmcsIHAxOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuICd2YXJ5aW5nICcgKyBwMTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVwbGFjZUZ1bmMgPSBmdW5jdGlvbiAobWF0Y2g6IHN0cmluZywgcDE6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gJ2F0dHJpYnV0ZSAnICsgcDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCByZXBsYWNlRnVuYyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJvdXRcIiBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCBtb2RpZnkgdGhlIHNoYWRlciBjb2RlLlxuXHQgKiBJZiB0aGUgc2hhZGVyIHN0YWdlIGlzIHZlcnRleCwgdGhlIFwib3V0XCIgcXVhbGlmaWVycyB3aWxsIGJlIHJlcGxhY2VkIGJ5IFwidmFyeWluZ1wiIHF1YWxpZmllci5cblx0ICogSWYgdGhlIHNoYWRlciBzdGFnZSBpcyBmcmFnbWVudCBhbmQgdGhlIHNoYWRlciBoYXMgXCJvdXRcIiBxdWFsaWZpZXJzLCB0aGUgXCJvdXRcIiBxdWFsaWZpZXJzIHdpbGxcblx0ICogYmUgZGVsZXRlZCBhbmQgdGhlIHZhcmlhYmxlIGlzIHVzZWQgdG8gYXNzaWduIGEgdmFsdWUgdG8gZ2xfRnJhZ0NvbG9yLlxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0T3V0KHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRpZiAoaXNGcmFnbWVudFNoYWRlcikge1xuXHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gdGhpcy5fX3JlbW92ZU91dFF1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0aWYgKHZhcmlhYmxlTmFtZSA9PSBudWxsKSB7XG5cdFx0XHRcdC8vIG5vIG91dCBxdWFsaWZpZXJcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9fYWRkR0xGcmFnQ29sb3IodmFyaWFibGVOYW1lLCBzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSpvdXRbXFx0IF0rKChoaWdocHxtZWRpdW1wfGxvd3B8KVtcXHQgXSpcXHcrW1xcdCBdKlxcdytbXFx0IF0qOykvO1xuXHRcdFx0Y29uc3QgcmVwbGFjZUZ1bmMgPSBmdW5jdGlvbiAobWF0Y2g6IHN0cmluZywgcDE6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gJ3ZhcnlpbmcgJyArIHAxO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCByZXBsYWNlRnVuYyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRoaXMgbWV0aG9kIGlzIGEgcGFydCBvZiBfX2NvbnZlcnRPdXQgbWV0aG9kLlxuXHQgKiBUaGlzIG1ldGhvZCBkZWxldGVzIHRoZSBcIm91dFwiIHF1YWxpZmllcnMgYW5kIGFkZHMgdGhlIGxpbmUgZm9yIGFzc2lnbmluZyB0byBnbF9GcmFnQ29sb3IuXG5cdCAqIElmIHRoZSBzaGFkZXIgZG9lcyBub3QgaGF2ZSB0aGUgXCJvdXRcIiBxdWFsaWZpZXJzLCB0aGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcuXG5cdCAqL1xuXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlT3V0UXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSpvdXRbXFx0IF0rKChoaWdocHxtZWRpdW1wfGxvd3B8KVtcXHQgXSpcXHcrW1xcdCBdKihcXHcrKVtcXHQgXSo7KS87XG5cblx0XHRsZXQgdmFyaWFibGVOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IG1hdGNoID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLm1hdGNoKHJlZyk7XG5cdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gbWF0Y2hbMV07XG5cdFx0XHRcdHZhcmlhYmxlTmFtZSA9IG1hdGNoWzNdO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdmFyaWFibGVOYW1lO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19hZGRHTEZyYWdDb2xvcih2YXJpYWJsZU5hbWU6IHN0cmluZywgc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IGNsb3NlQnJhY2tldFJlZyA9IC8oLiopXFx9W1xcblxcdCBdKiQvO1xuXHRcdGNvbnN0IHJldHVyblJlZyA9IC9bXFxuXFx0IF0qcmV0dXJuW1xcblxcdCBdKjsvO1xuXHRcdGNvbnN0IG1haW5GdW5jU3RhcnRSZWcgPSAvKF58Xig/IVtcXC9dKVtcXHRcXG4gXSspdm9pZFtcXHRcXG4gXSttYWluKFtcXHRcXG4gXXxcXCh8JCkvO1xuXHRcdGNvbnN0IGZyYWdDb2xvckNvZGUgPSBgICBnbF9GcmFnQ29sb3IgPSAke3ZhcmlhYmxlTmFtZX07YDtcblxuXHRcdGxldCBzZXRHbEZyYWdDb2xvckluTGFzdExpbmUgPSBmYWxzZTtcblx0XHRmb3IgKGxldCBpID0gc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXHRcdFx0aWYgKCFzZXRHbEZyYWdDb2xvckluTGFzdExpbmUgJiYgbGluZS5tYXRjaChjbG9zZUJyYWNrZXRSZWcpKSB7XG5cdFx0XHRcdC8vIGFkZCBnbF9GcmFnQ29sb3IgdG8gbGFzdCBsaW5lIG9mIG1haW4gZnVuY3Rpb25cblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gbGluZS5yZXBsYWNlKGNsb3NlQnJhY2tldFJlZywgYCQxXFxuJHtmcmFnQ29sb3JDb2RlfVxcbn1cXG5gKTtcblx0XHRcdFx0c2V0R2xGcmFnQ29sb3JJbkxhc3RMaW5lID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGxpbmUubWF0Y2gocmV0dXJuUmVnKSkge1xuXHRcdFx0XHQvLyBhZGQgZ2xfRnJhZ0NvbG9yIGp1c3QgYmVmb3JlIHJldHVyblxuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUuc3BsaWNlKGksIDAsIGZyYWdDb2xvckNvZGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobGluZS5tYXRjaChtYWluRnVuY1N0YXJ0UmVnKSkge1xuXHRcdFx0XHQvLyBhZGQgZ2xfRnJhZ0NvbG9yIG9ubHkgaW4gdGhlIG1haW4gZnVuY3Rpb25cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCFzZXRHbEZyYWdDb2xvckluTGFzdExpbmUpIHtcblx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX3JlbW92ZU91dFF1YWxpZmllcjogTm90IGZvdW5kIHRoZSBjbG9zaW5nIGJyYWNrZXRzIGZvciB0aGUgbWFpbiBmdW5jdGlvbic7XG5cdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBxdWFsaWZpZXIgZm9yIGVzMyBvbmx5IGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVtb3ZlIGl0XG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZUVTM1F1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0dGhpcy5fX3JlbW92ZVZhcnlpbmdRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR0aGlzLl9fcmVtb3ZlTGF5b3V0KHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJmbGF0XCIgYW5kIFwic21vb3RoXCIgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVtb3ZlIGl0XG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZVZhcnlpbmdRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKihmbGF0fHNtb290aClbXFx0IF0qKChpbnxvdXQpW1xcdCBdKy4qKS87XG5cdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fcmVtb3ZlVmFyeWluZ1F1YWxpZmllcjogZ2xzbCBlczEgZG9lcyBub3Qgc3VwcG9ydCBmbGF0IHF1YWxpZmllcic7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLnJlcGxhY2UocmVnLCAobWF0Y2g6IHN0cmluZywgcDE6IHN0cmluZywgcDI6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRpZiAocDEgPT09ICdmbGF0Jykge1xuXHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGkgKyAxLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHRcdHJldHVybiBtYXRjaDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcDI7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJsYXlvdXRcIiBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXRcblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlTGF5b3V0KHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSpsYXlvdXRbXFx0IF0qXFwoW1xcdCBdKmxvY2F0aW9uW1xcdCBdKlxcPVtcXHQgXSpcXGRbXFx0IF0qXFwpW1xcdCBdKy9nO1xuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIFwicHJlY2lzaW9uXCIgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVtb3ZlIGl0IGlmIHRoZSBcInByZWNpc2lvblwiIHF1YWxpZmllciBpcyB2YWxpZCBmb3Igb25seSBHTFNMIEVTM1xuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVQcmVjaXNpb25Gb3JFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKnByZWNpc2lvbltcXHQgXSsoaGlnaHB8bWVkaXVtcHxsb3dwKVtcXHQgXSsoXFx3KylbXFx0IF0qOy87XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgbWF0Y2ggPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ubWF0Y2gocmVnKTtcblx0XHRcdGlmIChtYXRjaCAhPSBudWxsKSB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRtYXRjaFsyXSA9PT0gJ2ludCcgfHxcblx0XHRcdFx0XHRtYXRjaFsyXSA9PT0gJ2Zsb2F0JyB8fFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSAnc2FtcGxlcjJEJyB8fFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSAnc2FtcGxlckN1YmUnXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdC8vIHRoZXNlIHByZWNpc2lvbnMgYXJlIHN1cHBvcnRlZCBpbiBlczFcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJ0ZXh0dXJlXCIgYW5kIFwidGV4dHVyZVByb2pcIiBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZFxuXHQgKiByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMxIG1ldGhvZCgndGV4dHVyZTJEJywgJ3RleHR1cmUyRCcsIGFuZCBzbyBvbilcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmVGdW5jdGlvblRvRVMxKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZ1RleHR1cmVQcm9qID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspdGV4dHVyZVByb2ooTG9kfCkoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlZ1RleHR1cmUgPSBuZXcgUmVnRXhwKGAoJHtzYmx9Kyl0ZXh0dXJlKExvZHwpKCR7c2JsfSspYCwgJ2cnKTtcblxuXHRcdGxldCBhcmd1bWVudFNhbXBsZXJNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG5cdFx0Y29uc3QgdW5pZm9ybVNhbXBsZXJNYXAgPSB0aGlzLl9fY3JlYXRlVW5pZm9ybVNhbXBsZXJNYXAoc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblxuXHRcdFx0Y29uc3QgbWF0Y2hUZXh0dXJlUHJvaiA9IGxpbmUubWF0Y2goL3RleHR1cmVQcm9qKExvZHwpW1xcdCBdKlxcKFtcXHQgXSooXFx3KyksLyk7XG5cdFx0XHRpZiAobWF0Y2hUZXh0dXJlUHJvaikge1xuXHRcdFx0XHRhcmd1bWVudFNhbXBsZXJNYXAgPSBhcmd1bWVudFNhbXBsZXJNYXAgPz8gdGhpcy5fX2NyZWF0ZUFyZ3VtZW50U2FtcGxlck1hcChcblx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUsXG5cdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRlbWJlZEVycm9yc0luT3V0cHV0XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29uc3QgaXNMb2RNZXRob2QgPSBtYXRjaFRleHR1cmVQcm9qWzFdID09PSAnTG9kJztcblx0XHRcdFx0Y29uc3QgZXh0ZW5zaW9uU3RyID0gaXNGcmFnbWVudFNoYWRlciAmJiBpc0xvZE1ldGhvZCA/IGBFWFRgIDogYGA7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlTmFtZSA9IG1hdGNoVGV4dHVyZVByb2pbMl07XG5cdFx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlID0gYXJndW1lbnRTYW1wbGVyTWFwPy5nZXQodmFyaWFibGVOYW1lKSA/PyB1bmlmb3JtU2FtcGxlck1hcC5nZXQodmFyaWFibGVOYW1lKTtcblx0XHRcdFx0aWYgKHNhbXBsZXJUeXBlICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAoc2FtcGxlclR5cGUgPT09ICdzYW1wbGVyMkQnKSB7XG5cdFx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ucmVwbGFjZShyZWdUZXh0dXJlUHJvaiwgYCQxdGV4dHVyZTJEUHJvaiQyJHtleHRlbnNpb25TdHJ9JDNgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fY29udmVydFRleHR1cmVGdW5jdGlvblRvRVMxOiBkbyBub3Qgc3VwcG9ydCAnICsgc2FtcGxlclR5cGUgKyAnIHR5cGUnO1xuXHRcdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG1hdGNoVGV4dHVyZSA9IGxpbmUubWF0Y2goL3RleHR1cmUoTG9kfClbXFx0IF0qXFwoW1xcdCBdKihcXHcrKSwvKTtcblx0XHRcdGlmIChtYXRjaFRleHR1cmUpIHtcblx0XHRcdFx0YXJndW1lbnRTYW1wbGVyTWFwID0gYXJndW1lbnRTYW1wbGVyTWFwID8/IHRoaXMuX19jcmVhdGVBcmd1bWVudFNhbXBsZXJNYXAoXG5cdFx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLFxuXHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0ZW1iZWRFcnJvcnNJbk91dHB1dFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGNvbnN0IGlzTG9kTWV0aG9kID0gbWF0Y2hUZXh0dXJlWzFdID09PSAnTG9kJztcblx0XHRcdFx0Y29uc3QgZXh0ZW5zaW9uU3RyID0gaXNGcmFnbWVudFNoYWRlciAmJiBpc0xvZE1ldGhvZCA/IGBFWFRgIDogYGA7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlTmFtZSA9IG1hdGNoVGV4dHVyZVsyXTtcblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBhcmd1bWVudFNhbXBsZXJNYXA/LmdldCh2YXJpYWJsZU5hbWUpID8/IHVuaWZvcm1TYW1wbGVyTWFwLmdldCh2YXJpYWJsZU5hbWUpO1xuXHRcdFx0XHRpZiAoc2FtcGxlclR5cGUgIT0gbnVsbCkge1xuXHRcdFx0XHRcdGxldCB0ZXh0dXJlRnVuYzogc3RyaW5nO1xuXHRcdFx0XHRcdGlmIChzYW1wbGVyVHlwZSA9PT0gJ3NhbXBsZXIyRCcpIHtcblx0XHRcdFx0XHRcdHRleHR1cmVGdW5jID0gJ3RleHR1cmUyRCc7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzYW1wbGVyVHlwZSA9PT0gJ3NhbXBsZXJDdWJlJykge1xuXHRcdFx0XHRcdFx0dGV4dHVyZUZ1bmMgPSAndGV4dHVyZUN1YmUnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0ZXh0dXJlRnVuYyA9ICcnO1xuXHRcdFx0XHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fY29udmVydFRleHR1cmVGdW5jdGlvblRvRVMxOiBkbyBub3Qgc3VwcG9ydCAnICsgc2FtcGxlclR5cGUgKyAnIHR5cGUnO1xuXHRcdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodGV4dHVyZUZ1bmMgIT09ICcnKSB7XG5cdFx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ucmVwbGFjZShyZWdUZXh0dXJlLCBgJDEke3RleHR1cmVGdW5jfSQyJHtleHRlbnNpb25TdHJ9JDNgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzQmxvY2tFbmQgPSAhIWxpbmUubWF0Y2goL1xcfS8pO1xuXHRcdFx0aWYgKGlzQmxvY2tFbmQpIHtcblx0XHRcdFx0YXJndW1lbnRTYW1wbGVyTWFwID0gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUaGlzIG1ldGhvZCBmaW5kcyB1bmlmb3JtIGRlY2xhcmF0aW9ucyBvZiBzYW1wbGVyIHR5cGVzIGluIHRoZSBzaGFkZXIgYW5kXG5cdCAqIGNyZWF0ZXMgYSBtYXAgd2l0aCB2YXJpYWJsZSBuYW1lcyBhcyBrZXlzIGFuZCB0eXBlcyBhcyB2YWx1ZXMuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NyZWF0ZVVuaWZvcm1TYW1wbGVyTWFwKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRjb25zdCB1bmlmb3JtU2FtcGxlck1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXHRcdFx0Y29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKnVuaWZvcm0qW1xcdCBdKihoaWdocHxtZWRpdW1wfGxvd3B8KVtcXHQgXSooc2FtcGxlclxcdyspW1xcdCBdKyhcXHcrKS8pO1xuXHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlID0gbWF0Y2hbMl07XG5cdFx0XHRcdGNvbnN0IG5hbWUgPSBtYXRjaFszXTtcblx0XHRcdFx0aWYgKHVuaWZvcm1TYW1wbGVyTWFwLmdldChuYW1lKSkge1xuXHRcdFx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX2NyZWF0ZVVuaWZvcm1TYW1wbGVyTWFwOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSc7XG5cdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR1bmlmb3JtU2FtcGxlck1hcC5zZXQobmFtZSwgc2FtcGxlclR5cGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdW5pZm9ybVNhbXBsZXJNYXA7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVGhpcyBtZXRob2QgZmluZHMgc2FtcGxlciB0eXBlcyBmcm9tIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMgYW5kXG5cdCAqIGNyZWF0ZXMgYSBtYXAgd2l0aCB2YXJpYWJsZSBuYW1lcyBhcyBrZXlzIGFuZCB0eXBlcyBhcyB2YWx1ZXMuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NyZWF0ZUFyZ3VtZW50U2FtcGxlck1hcChcblx0XHRzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLFxuXHRcdGxpbmVJbmRleDogbnVtYmVyLFxuXHRcdGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW5cblx0KSB7XG5cdFx0Y29uc3QgYXJndW1lbnRTYW1wbGVyTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IGxpbmVJbmRleDsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cblx0XHRcdGNvbnN0IGlzQmxvY2tTdGFydExpbmUgPSAhIWxpbmUubWF0Y2goL1xcey8pO1xuXHRcdFx0aWYgKCFpc0Jsb2NrU3RhcnRMaW5lKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBicmFja2V0U2VjdGlvbkNvZGUgPSB0aGlzLl9fZ2V0QnJhY2tldFNlY3Rpb24oc3BsaXR0ZWRTaGFkZXJDb2RlLCBpKTtcblxuXHRcdFx0Y29uc3QgaW5uZXJCcmFja2V0U2VjdGlvbkNvZGUgPSBicmFja2V0U2VjdGlvbkNvZGUubWF0Y2goLy4qXFwoKC4qKVxcKS8pPy5bMV07XG5cdFx0XHRpZiAoaW5uZXJCcmFja2V0U2VjdGlvbkNvZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHZhcmlhYmxlQ2FuZGlkYXRlcyA9IGlubmVyQnJhY2tldFNlY3Rpb25Db2RlLnNwbGl0KCcsJyk7XG5cdFx0XHRjb25zdCBzYW1wbGVyVHlwZURlZmluaXRpb25SZWcgPSAvW1xcblxcdCBdKihoaWdocHxtZWRpdW1wfGxvd3B8KVtcXG5cXHQgXSooc2FtcGxlclxcdyspW1xcblxcdCBdKihcXHcrKVtcXG5cXHQgXSovO1xuXG5cdFx0XHRjb25zdCBpc0Z1bmN0aW9uQnJhY2tldCA9ICEhKHZhcmlhYmxlQ2FuZGlkYXRlc1swXS5tYXRjaChzYW1wbGVyVHlwZURlZmluaXRpb25SZWcpID8/IHZhcmlhYmxlQ2FuZGlkYXRlc1swXS5tYXRjaCgvXltcXG5cXHQgXSokLykpO1xuXHRcdFx0aWYgKCFpc0Z1bmN0aW9uQnJhY2tldCkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChjb25zdCB2YXJpYWJsZUNhbmRpZGF0ZSBvZiB2YXJpYWJsZUNhbmRpZGF0ZXMpIHtcblx0XHRcdFx0Y29uc3Qgc2FtcGxlclZhcmlhYmxlTWF0Y2ggPSB2YXJpYWJsZUNhbmRpZGF0ZS5tYXRjaChzYW1wbGVyVHlwZURlZmluaXRpb25SZWcpO1xuXHRcdFx0XHRpZiAoc2FtcGxlclZhcmlhYmxlTWF0Y2ggPT0gbnVsbCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlID0gc2FtcGxlclZhcmlhYmxlTWF0Y2hbMl07XG5cdFx0XHRcdGNvbnN0IG5hbWUgPSBzYW1wbGVyVmFyaWFibGVNYXRjaFszXTtcblx0XHRcdFx0aWYgKGFyZ3VtZW50U2FtcGxlck1hcC5nZXQobmFtZSkpIHtcblx0XHRcdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19jcmVhdGVBcmd1bWVudFNhbXBsZXJNYXA6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lJztcblx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFyZ3VtZW50U2FtcGxlck1hcC5zZXQobmFtZSwgc2FtcGxlclR5cGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJndW1lbnRTYW1wbGVyTWFwO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIHBhcnQgZW5jbG9zZWQgaW4gYnJhY2tldHMoPSAnKCknKS5cblx0ICogRm9yIGV4YW1wbGUsIHlvdSBjYW4gZ2V0IGxpbmVzIHRoYXQgY29udGFpbiBmdW5jdGlvbiBhcmd1bWVudHMsIGNvbmRpdGlvbmFsIGV4cHJlc3Npb25zIGZvciBpZiBzdGF0ZW1lbnRzLCBldGMuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2dldEJyYWNrZXRTZWN0aW9uKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGJyYWNrZXRFbmRJbmRleDogbnVtYmVyKSB7XG5cdFx0bGV0IGJyYWNrZXRTdGFydEluZGV4ID0gMDtcblx0XHRmb3IgKGxldCBqID0gYnJhY2tldEVuZEluZGV4OyBqID49IDA7IGotLSkge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtqXTtcblx0XHRcdGNvbnN0IGlzQnJhY2tldFN0YXJ0TWF0Y2ggPSAhIWxpbmUubWF0Y2goL1xcKC8pO1xuXHRcdFx0aWYgKGlzQnJhY2tldFN0YXJ0TWF0Y2gpIHtcblx0XHRcdFx0YnJhY2tldFN0YXJ0SW5kZXggPSBqO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRsZXQgY29udGFpbkJyYWNrZXRDb2RlID0gJyc7XG5cdFx0Zm9yIChsZXQgaiA9IGJyYWNrZXRTdGFydEluZGV4OyBqIDw9IGJyYWNrZXRFbmRJbmRleDsgaisrKSB7XG5cdFx0XHRjb250YWluQnJhY2tldENvZGUgKz0gc3BsaXR0ZWRTaGFkZXJDb2RlW2pdO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb250YWluQnJhY2tldENvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ2F0dHJpYnV0ZScgcXVhbGlmaWVyIGluIHRoZSB2ZXJ0ZXggc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgcXVhbGlmaWVyKCdpbicpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRBdHRyaWJ1dGUoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbikge1xuXHRcdGlmIChpc0ZyYWdtZW50U2hhZGVyKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qYXR0cmlidXRlW1xcdCBdKy9nO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAnaW4gJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgcmVwbGFjZVN0cik7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3ZhcnlpbmcnIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgcXVhbGlmaWVyKCdpbicgb3IgJ291dCcpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRWYXJ5aW5nKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSp2YXJ5aW5nW1xcdCBdKy9nO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSBpc0ZyYWdtZW50U2hhZGVyID8gJ2luICcgOiAnb3V0ICc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsIHJlcGxhY2VTdHIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlQ3ViZScgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmUnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZUN1YmUoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmVDdWJlKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZTJEJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZScpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlMkQoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmUyRCkoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZSc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmUyRFByb2onIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlUHJvaicpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlMkRQcm9kKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlMkRQcm9qKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlUHJvaic7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmUzRCcgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmUnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZTNEKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlM0QpKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmUnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlM0RQcm9qJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZVByb2onKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZTNEUHJvZChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZTNEUHJvaikoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZVByb2onO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19yZWdTeW1ib2xzKCkge1xuXHRcdHJldHVybiBgWyFcIiMkJSYnKClcXCpcXCtcXC1cXC4sXFwvOjs8PT4/QFxcW1xcXFxcXF1eYCArICdge3x9flxcdFxcbiBdJztcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIF9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgcmVnOiBSZWdFeHAsIHJlcGxhY2VtZW50OiBhbnkpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLnJlcGxhY2UocmVnLCByZXBsYWNlbWVudCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVGaXJzdE1hdGNoaW5nTGluZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCByZWc6IFJlZ0V4cCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLm1hdGNoKHJlZykpIHtcblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnNwbGljZShpLCAxKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19vdXRFcnJvcihcblx0XHRzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLFxuXHRcdGxpbmVJbmRleDogbnVtYmVyLFxuXHRcdGVycm9yTWVzc2FnZTogc3RyaW5nLFxuXHRcdGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW5cblx0KSB7XG5cdFx0aWYgKGVtYmVkRXJyb3JzSW5PdXRwdXQpIHtcblx0XHRcdGNvbnN0IHNoYWRlck91dHB1dE1lc3NhZ2UgPSBgLy8gbGluZSAke2xpbmVJbmRleH06ICR7ZXJyb3JNZXNzYWdlfVxcbmA7XG5cdFx0XHRjb25zdCBjbG9zZUJyYWNrZXRSZWcgPSAvKC4qKVxcfVtcXG5cXHQgXSokLztcblx0XHRcdGZvciAobGV0IGkgPSBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblx0XHRcdFx0aWYgKGxpbmUubWF0Y2goY2xvc2VCcmFja2V0UmVnKSkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9PT0gc2hhZGVyT3V0cHV0TWVzc2FnZSkge1xuXHRcdFx0XHRcdC8vIGF2b2lkIGR1cGxpY2F0ZSBlcnJvciBtZXNzYWdlXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcblx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZS5wdXNoKHNoYWRlck91dHB1dE1lc3NhZ2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcblx0XHR9XG5cdH1cbn1cbiIsImltcG9ydCBSZWZsZWN0aW9uIGZyb20gJy4vUmVmbGVjdGlvbic7XG5pbXBvcnQge1NoYWRlcml0eU9iamVjdCwgU2hhZGVyU3RhZ2VTdHIsIFNoYWRlclZlcnNpb24sIFRlbXBsYXRlT2JqZWN0fSBmcm9tICcuLi90eXBlcy90eXBlJztcbmltcG9ydCBTaGFkZXJUcmFuc2Zvcm1lciBmcm9tICcuL1NoYWRlclRyYW5zZm9ybWVyJztcbmltcG9ydCBTaGFkZXJFZGl0b3IgZnJvbSAnLi9TaGFkZXJFZGl0b3InO1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5JztcbmltcG9ydCBTaGFkZXJpdHlPYmplY3RDcmVhdG9yIGZyb20gJy4vU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcic7XG5pbXBvcnQgUHJlUHJvY2Vzc29yIGZyb20gJy4vUHJlUHJvY2Vzc29yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhZGVyaXR5IHtcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHNoYWRlciB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0LyoqXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMzIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGVcblx0ICogQHBhcmFtIG9iaiBTaGFkZXJpdHkgb2JqZWN0IHRvIHRyYW5zbGF0ZSB0byBnbHNsIGVzMVxuXHQgKiBAcGFyYW0gZW1iZWRFcnJvcnNJbk91dHB1dCBJZiB0cnVlLCB3aGVuIHRoZXJlIGlzIGFuIGVycm9yIGluIHRoZSBjb252ZXJzaW9uLFxuXHQgKiAgICB0aGUgZXJyb3IgYW5kIHRoZSBudW1iZXIgb2YgbGluZXMgYXJlIG91dHB1dCBhdCB0aGUgYm90dG9tIG9mIHRoZSByZXR1cm5cblx0ICogICAgdmFsdWUgU2hhZGVyaXR5T2JqZWN0LmNvZGUuIElmIGZhbHNlLCB0aHJvdyBhbiBlcnJvci5cblx0ICogQHJldHVybnMgU2hhZGVyaXR5T2JqZWN0IHdob3NlIGNvZGUgcHJvcGVydHkgaXMgdGhlIHNoYWRlciBjb2RlIGZvciBHTFNMIEVTMVxuXHQgKi9cblx0cHVibGljIHN0YXRpYyB0cmFuc2Zvcm1Ub0dMU0xFUzEob2JqOiBTaGFkZXJpdHlPYmplY3QsIGVtYmVkRXJyb3JzSW5PdXRwdXQgPSBmYWxzZSkge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGVcblx0XHRcdD0gU2hhZGVyVHJhbnNmb3JtZXIuX3RyYW5zZm9ybVRvR0xTTEVTMShcblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLFxuXHRcdFx0XHRvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHRcdFx0ZW1iZWRFcnJvcnNJbk91dHB1dFxuXHRcdFx0KTtcblx0XHRjb25zdCByZXN1bHRDb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZSh0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IHJlc3VsdENvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH1cblxuXHQvKipcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGUgdG8gYSBHTFNMIEVTMyBzaGFkZXIgY29kZVxuXHQgKi9cblx0cHVibGljIHN0YXRpYyB0cmFuc2Zvcm1Ub0dMU0xFUzMob2JqOiBTaGFkZXJpdHlPYmplY3QpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlXG5cdFx0XHQ9IFNoYWRlclRyYW5zZm9ybWVyLl90cmFuc2Zvcm1Ub0dMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlLCBvYmouaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUodHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0Y29uc3QgcmVzdWx0T2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiByZXN1bHRDb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gcmVzdWx0T2JqO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgc2hhZGVyIGNvZGUgdG8gYSBzaGFkZXIgY29kZSBvZiBzcGVjaWZpZWQgR0xTTCB2ZXJzaW9uXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHRyYW5zZm9ybVRvKHZlcnNpb246IFNoYWRlclZlcnNpb24sIG9iajogU2hhZGVyaXR5T2JqZWN0LCBlbWJlZEVycm9yc0luT3V0cHV0ID0gZmFsc2UpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlXG5cdFx0XHQ9IFNoYWRlclRyYW5zZm9ybWVyLl90cmFuc2Zvcm1Ubyhcblx0XHRcdFx0dmVyc2lvbixcblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLFxuXHRcdFx0XHRvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHRcdFx0ZW1iZWRFcnJvcnNJbk91dHB1dFxuXHRcdFx0KTtcblx0XHRjb25zdCByZXN1bHRDb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZSh0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IHJlc3VsdENvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIHByb2Nlc3NQcmFnbWEob2JqOiBTaGFkZXJpdHlPYmplY3QsIHN0YXJ0TGluZVN0cj86IHN0cmluZywgZW5kTGluZVN0cj86IHN0cmluZykge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGVcblx0XHRcdD0gUHJlUHJvY2Vzc29yLnByb2Nlc3Moc3BsaXR0ZWRTaGFkZXJDb2RlLCBzdGFydExpbmVTdHIsIGVuZExpbmVTdHIpO1xuXG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUodHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0Y29uc3QgcmVzdWx0T2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiByZXN1bHRDb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gcmVzdWx0T2JqO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHNoYWRlcml0eSBvYmplY3QgY3JlYXRpb24gZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gaW5zdGFuY2UgdG8gY3JlYXRlIHNoYWRlcml0eSBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGNyZWF0ZVNoYWRlcml0eU9iamVjdENyZWF0b3Ioc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKTogU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciB7XG5cdFx0cmV0dXJuIG5ldyBTaGFkZXJpdHlPYmplY3RDcmVhdG9yKHNoYWRlclN0YWdlKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBzaGFkZXIgZWRpdCBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0LyoqXG5cdCAqIEZpbmQgdGhlIGZvbGxvd2luZyB0ZW1wbGF0ZSBwYXR0ZXJuIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBrZXkgdG8gdmFsdWVcblx0ICogQHBhcmFtIHRlbXBsYXRlT2JqZWN0IEFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0cmluZyBiZWZvcmUgYW5kIGFmdGVyIHRoZSByZXBsYWNlbWVudFxuXHQgKiBUaGUga2V5IGNhbiBiZSBhIHN0cmluZyBvciBhbiBvYmplY3QuIElmIGFuIG9iamVjdCBpcyB1c2VkIGFzIHRoZSBrZXksXG5cdCAqIHRoZSBrZXkgaW4gdGhlIHBhdHRlcm4gb2Ygc2hhZGVyQ29kZSBtdXN0IGFsc28gbWF0Y2ggdGhlIG9iamVjdC5cblx0ICogRm9yIGV4YW1wbGUsIGlmIHRlbXBsYXRlT2JqZWN0IGlzXG5cdFx0e1xuXHRcdFx0c2FtcGxlIHtcblx0XHRcdFx0c2FtcGxlQTogMFxuXHRcdFx0fVxuXHRcdH1cblx0ICogdGhlbiB0aGUga2V5IGluIGEgc2hhZGVyIGNvZGUgaXMgc2FtcGxlLnNhbXBsZUEuXG5cdCAqL1xuXHQvLyBUaGUgdGVtcGxhdGUgcGF0dGVybiBpc1x0Lyogc2hhZGVyaXR5OiBAe2tleX0gKi9cblx0cHVibGljIHN0YXRpYyBmaWxsVGVtcGxhdGUob2JqOiBTaGFkZXJpdHlPYmplY3QsIGFyZzogVGVtcGxhdGVPYmplY3QpIHtcblx0XHRjb25zdCBjb3B5ID0gdGhpcy5fX2NvcHlTaGFkZXJpdHlPYmplY3Qob2JqKTtcblxuXHRcdGNvcHkuY29kZSA9IFNoYWRlckVkaXRvci5fZmlsbFRlbXBsYXRlKGNvcHkuY29kZSwgYXJnKTtcblxuXHRcdHJldHVybiBjb3B5O1xuXHR9XG5cblx0LyoqXG5cdCAqIEluc2VydCBkZWZpbmUgZGlyZWN0aXZlXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGluc2VydERlZmluaXRpb24ob2JqOiBTaGFkZXJpdHlPYmplY3QsIGRlZmluaXRpb246IHN0cmluZykge1xuXHRcdGNvbnN0IGNvcHkgPSB0aGlzLl9fY29weVNoYWRlcml0eU9iamVjdChvYmopO1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0U2hhZGVyRWRpdG9yLl9pbnNlcnREZWZpbml0aW9uKHNwbGl0dGVkU2hhZGVyQ29kZSwgZGVmaW5pdGlvbik7XG5cdFx0Y29weS5jb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZShzcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0cmV0dXJuIGNvcHk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gcmVmbGVjdGlvbiBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBpbnN0YW5jZSB0byBnZXQgdGhlIGF0dHJpYnV0ZSwgdmFyeWluZywgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24gZnJvbSBhIHNoYWRlciBjb2RlIG9mIHRoZSBzaGFkZXJpdHkuXG5cdCAqIFRvIGdldCB0aGVzZSBpbmZvcm1hdGlvbiwgeW91IG5lZWQgdG8gY2FsbCByZWZsZWN0aW9uLnJlZmxlY3QgbWV0aG9kLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBjcmVhdGVSZWZsZWN0aW9uT2JqZWN0KG9iajogU2hhZGVyaXR5T2JqZWN0KTogUmVmbGVjdGlvbiB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRjb25zdCByZWZsZWN0aW9uID0gbmV3IFJlZmxlY3Rpb24oc3BsaXR0ZWRTaGFkZXJDb2RlLCBvYmouc2hhZGVyU3RhZ2UpO1xuXHRcdHJldHVybiByZWZsZWN0aW9uO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHByaXZhdGUgZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHByaXZhdGUgc3RhdGljIF9fY29weVNoYWRlcml0eU9iamVjdChvYmo6IFNoYWRlcml0eU9iamVjdCkge1xuXHRcdGNvbnN0IGNvcGllZE9iajogU2hhZGVyaXR5T2JqZWN0ID0ge1xuXHRcdFx0Y29kZTogb2JqLmNvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvcGllZE9iajtcblx0fVxufVxuIiwiaW1wb3J0IHtcblx0U2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdCxcblx0U2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3IsXG5cdFNoYWRlckV4dGVuc2lvbk9iamVjdCxcblx0U2hhZGVyaXR5T2JqZWN0LFxuXHRTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyxcblx0U2hhZGVyUHJlY2lzaW9uT2JqZWN0LFxuXHRTaGFkZXJQcmVjaXNpb25PYmplY3RLZXksXG5cdFNoYWRlclN0YWdlU3RyLFxuXHRTaGFkZXJBdHRyaWJ1dGVPYmplY3QsXG5cdFNoYWRlclByZWNpc2lvblR5cGUsXG5cdFNoYWRlckF0dHJpYnV0ZVZhclR5cGUsXG5cdFNoYWRlclZhcnlpbmdPYmplY3QsXG5cdFNoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSxcblx0U2hhZGVyVmFyeWluZ1ZhclR5cGUsXG5cdFNoYWRlclVuaWZvcm1PYmplY3QsXG5cdFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzLFxuXHRTaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0LFxuXHRTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3QsXG5cdFNoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3QsXG5cdFNoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3QsXG5cdFNoYWRlclVuaWZvcm1CdWZmZXJPYmplY3QsXG5cdFNoYWRlclVCT1ZhcmlhYmxlT2JqZWN0LFxuXHRTaGFkZXJGdW5jdGlvbk9iamVjdCxcbn0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgY3JlYXRlcyBhIHNoYWRlcml0eSBvYmplY3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYWRlcml0eU9iamVjdENyZWF0b3Ige1xuXHRwcml2YXRlIF9fc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyO1xuXHRwcml2YXRlIF9fZnVuY3Rpb25JZENvdW50ID0gMDtcblxuXHRwcml2YXRlIF9fZGVmaW5lRGlyZWN0aXZlTmFtZXM6IHN0cmluZ1tdID0gW107XG5cdHByaXZhdGUgX19leHRlbnNpb25zOiBTaGFkZXJFeHRlbnNpb25PYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fZ2xvYmFsUHJlY2lzaW9uOiBTaGFkZXJQcmVjaXNpb25PYmplY3QgPSB7XG5cdFx0aW50OiAnaGlnaHAnLFxuXHRcdGZsb2F0OiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIyRDogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyQ3ViZTogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyM0Q6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjJEQXJyYXk6ICdoaWdocCcsXG5cdFx0aXNhbXBsZXIyRDogJ2hpZ2hwJyxcblx0XHRpc2FtcGxlckN1YmU6ICdoaWdocCcsXG5cdFx0aXNhbXBsZXIzRDogJ2hpZ2hwJyxcblx0XHRpc2FtcGxlcjJEQXJyYXk6ICdoaWdocCcsXG5cdFx0dXNhbXBsZXIyRDogJ2hpZ2hwJyxcblx0XHR1c2FtcGxlckN1YmU6ICdoaWdocCcsXG5cdFx0dXNhbXBsZXIzRDogJ2hpZ2hwJyxcblx0XHR1c2FtcGxlcjJEQXJyYXk6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjJEU2hhZG93OiAnaGlnaHAnLFxuXHRcdHNhbXBsZXJDdWJlU2hhZG93OiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIyREFycmF5U2hhZG93OiAnaGlnaHAnLFxuXHR9O1xuXHRwcml2YXRlIF9fc3RydWN0RGVmaW5pdGlvbnM6IFNoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXM6IFNoYWRlckNvbnN0YW50VmFsdWVPYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXM6IFNoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fYXR0cmlidXRlczogU2hhZGVyQXR0cmlidXRlT2JqZWN0W10gPSBbXTsgLy8gZm9yIHZlcnRleCBzaGFkZXIgb25seVxuXHRwcml2YXRlIF9fdmFyeWluZ3M6IFNoYWRlclZhcnlpbmdPYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fdW5pZm9ybXM6IFNoYWRlclVuaWZvcm1PYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fdW5pZm9ybVN0cnVjdHM6IFNoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fdW5pZm9ybUJ1ZmZlck9iamVjdHM6IFNoYWRlclVuaWZvcm1CdWZmZXJPYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fZnVuY3Rpb25zOiBTaGFkZXJGdW5jdGlvbk9iamVjdFtdW10gPSBbXTsgLy8gZmlyc3QgaW5kZXggcmVwcmVzZW50IGRlcGVuZGVuY3kgbGV2ZWxcblx0cHJpdmF0ZSBfX21haW5GdW5jdGlvbkNvZGU6IHN0cmluZyA9ICd2b2lkIG1haW4oKSB7fSc7XG5cdHByaXZhdGUgX19vdXRwdXRDb2xvclZhcmlhYmxlTmFtZTogc3RyaW5nID0gJ3JlbmRlclRhcmdldDAnOyAvLyBmb3IgZnJhZ21lbnQgc2hhZGVyIG9ubHlcblxuXHRjb25zdHJ1Y3RvcihzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHR0aGlzLl9fc2hhZGVyU3RhZ2UgPSBzaGFkZXJTdGFnZTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBhZGQgcGFyYW1ldGVycyBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHVibGljIGFkZERlZmluZURpcmVjdGl2ZShkZWZpbmVEaXJlY3RpdmVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fZGVmaW5lRGlyZWN0aXZlTmFtZXMuc29tZShuYW1lID0+IG5hbWUgPT09IGRlZmluZURpcmVjdGl2ZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdhZGREZWZpbmVEaXJlY3RpdmU6IHRoaXMgZGVmaW5lIGRpcmVjdGl2ZSBpcyBhbHJlYWR5IHNldCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5wdXNoKGRlZmluZURpcmVjdGl2ZU5hbWUpO1xuXHR9XG5cblx0cHVibGljIGFkZEV4dGVuc2lvbihleHRlbnNpb25OYW1lOiBzdHJpbmcsIGJlaGF2aW9yOiBTaGFkZXJFeHRlbnNpb25CZWhhdmlvciA9ICdlbmFibGUnKSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2V4dGVuc2lvbnMuc29tZShleHRlbnNpb24gPT4gZXh0ZW5zaW9uLmV4dGVuc2lvbk5hbWUgPT09IGV4dGVuc2lvbk5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdhZGRFeHRlbnNpb246IHRoaXMgZXh0ZW5zaW9uIGlzIGFscmVhZHkgc2V0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2V4dGVuc2lvbnMucHVzaCh7XG5cdFx0XHRleHRlbnNpb25OYW1lLFxuXHRcdFx0YmVoYXZpb3Jcblx0XHR9KTtcblx0fVxuXG5cdC8vIG9ubHkgZGVmaW5lIHR5cGVzXG5cdHB1YmxpYyBhZGRTdHJ1Y3REZWZpbml0aW9uKHN0cnVjdE5hbWU6IHN0cmluZywgbWVtYmVyT2JqZWN0czogU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0W10pIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuc29tZShzdHJ1Y3REZWZpbml0aW9uID0+IHN0cnVjdERlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0TmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRTdHJ1Y3REZWZpbml0aW9uOiBkdXBsaWNhdGUgc3RydWN0IHR5cGUgbmFtZSAke3N0cnVjdE5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLnB1c2goe1xuXHRcdFx0c3RydWN0TmFtZSxcblx0XHRcdG1lbWJlck9iamVjdHMsXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkR2xvYmFsQ29uc3RhbnRWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZywgdHlwZTogU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMsIHZhbHVlczogbnVtYmVyW10pIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMuc29tZShnbG9iYWxDb25zdGFudFZhbHVlID0+IGdsb2JhbENvbnN0YW50VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkR2xvYmFsQ29uc3RhbnRWYWx1ZTogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNWYWxpZENvbXBvbmVudE51bWJlciA9IFV0aWxpdHkuX2lzVmFsaWRDb21wb25lbnRDb3VudCh0eXBlLCB2YWx1ZXMpO1xuXHRcdGlmICghaXNWYWxpZENvbXBvbmVudE51bWJlcikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlIGNvbXBvbmVudCBjb3VudCBvZiAke3ZhcmlhYmxlTmFtZX0gaXMgaW52YWxpZGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzSW50VHlwZSA9IFV0aWxpdHkuX2lzSW50VHlwZSh0eXBlKTtcblx0XHRpZiAoaXNJbnRUeXBlKSB7XG5cdFx0XHRjb25zdCBleGlzdE5vbkludGVnZXJWYWx1ZSA9IFNoYWRlcml0eU9iamVjdENyZWF0b3IuX19leGlzdE5vbkludGVnZXJWYWx1ZSh2YWx1ZXMpO1xuXHRcdFx0aWYgKGV4aXN0Tm9uSW50ZWdlclZhbHVlKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgYWRkR2xvYmFsQ29uc3RhbnRWYWx1ZTogbm9uLWludGVnZXIgdmFsdWUgaXMgc2V0IHRvICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHR5cGUsXG5cdFx0XHR2YWx1ZXMsXG5cdFx0fSk7XG5cdH1cblxuXHQvLyBuZWVkIHRvIGRlZmluZSBzdHJ1Y3QgYnkgdGhlIGFkZFN0cnVjdERlZmluaXRpb24gbWV0aG9kXG5cdC8vIHZhbGlkYXRlIHRoYXQgdGhlIGNvcnJlc3BvbmRpbmcgc3RydWN0dXJlIGlzIGRlZmluZWQgYnkgdGhlIF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGUgbWV0aG9kXG5cdHB1YmxpYyBhZGRHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlKHN0cnVjdE5hbWU6IHN0cmluZywgdmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlczoge1trZXlWYXJpYWJsZU5hbWU6IHN0cmluZ106IG51bWJlcltdfSkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5zb21lKHN0cnVjdFZhbHVlID0+IHN0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZEdsb2JhbENvbnN0YW50U3RydWN0VmFsdWU6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHN0cnVjdE5hbWUsXG5cdFx0XHR2YWx1ZXMsXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkQXR0cmlidXRlRGVjbGFyYXRpb24oXG5cdFx0dmFyaWFibGVOYW1lOiBzdHJpbmcsXG5cdFx0dHlwZTogU2hhZGVyQXR0cmlidXRlVmFyVHlwZSxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0cHJlY2lzaW9uPzogU2hhZGVyUHJlY2lzaW9uVHlwZSxcblx0XHRcdGxvY2F0aW9uPzogbnVtYmVyLFxuXHRcdH1cblx0KSB7XG5cdFx0aWYgKHRoaXMuX19zaGFkZXJTdGFnZSAhPT0gJ3ZlcnRleCcpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2FkZEF0dHJpYnV0ZTogdGhpcyBtZXRob2QgaXMgZm9yIHZlcnRleCBzaGFkZXIgb25seScpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19hdHRyaWJ1dGVzLnNvbWUoYXR0cmlidXRlID0+IGF0dHJpYnV0ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRBdHRyaWJ1dGU6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19hdHRyaWJ1dGVzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0dHlwZSxcblx0XHRcdHByZWNpc2lvbjogb3B0aW9ucz8ucHJlY2lzaW9uLFxuXHRcdFx0bG9jYXRpb246IG9wdGlvbnM/LmxvY2F0aW9uLFxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGFkZFZhcnlpbmdEZWNsYXJhdGlvbihcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZyxcblx0XHR0eXBlOiBTaGFkZXJWYXJ5aW5nVmFyVHlwZSxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0cHJlY2lzaW9uPzogU2hhZGVyUHJlY2lzaW9uVHlwZSxcblx0XHRcdGludGVycG9sYXRpb25UeXBlPzogU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlLFxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX3ZhcnlpbmdzLnNvbWUodmFyeWluZyA9PiB2YXJ5aW5nLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFZhcnlpbmc6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzSW50VHlwZSA9IFV0aWxpdHkuX2lzSW50VHlwZSh0eXBlKTtcblx0XHRsZXQgaW50ZXJwb2xhdGlvblR5cGUgPSBvcHRpb25zPy5pbnRlcnBvbGF0aW9uVHlwZTtcblx0XHRpZiAoaXNJbnRUeXBlICYmIGludGVycG9sYXRpb25UeXBlICE9PSAnZmxhdCcpIHtcblx0XHRcdGlmIChpbnRlcnBvbGF0aW9uVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFZhcnlpbmc6IHRoZSBpbnRlcnBvbGF0aW9uVHlwZSBtdXN0IGJlIGZsYXQgZm9yIGludGVnZXIgdHlwZXNgKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBhZGRWYXJ5aW5nOiBzZXQgdGhlIGludGVycG9sYXRpb25UeXBlIG9mIGludGVnZXIgdHlwZXMgdG8gZmxhdCB0byBhdm9pZCBjb21waWxhdGlvbiBlcnJvcmApO1xuXHRcdFx0XHRpbnRlcnBvbGF0aW9uVHlwZSA9ICdmbGF0Jztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fdmFyeWluZ3MucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHR0eXBlLFxuXHRcdFx0cHJlY2lzaW9uOiBvcHRpb25zPy5wcmVjaXNpb24sXG5cdFx0XHRpbnRlcnBvbGF0aW9uVHlwZSxcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRVbmlmb3JtRGVjbGFyYXRpb24oXG5cdFx0dmFyaWFibGVOYW1lOiBzdHJpbmcsXG5cdFx0dHlwZTogU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsXG5cdFx0b3B0aW9ucz86IHtcblx0XHRcdHByZWNpc2lvbj86IFNoYWRlclByZWNpc2lvblR5cGUsXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybXMuc29tZSh1bmlmb3JtID0+IHVuaWZvcm0udmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVW5pZm9ybTogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGUgPT09ICdib29sJyAmJiBvcHRpb25zPy5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0Y29uc29sZS53YXJuKGBhZGRVbmlmb3JtOiByZW1vdmUgdGhlIHNwZWNpZmljYXRpb24gb2YgcHJlY2lzaW9uIGZvciBib29sIHR5cGUgdG8gYXZvaWQgY29tcGlsYXRpb24gZXJyb3JgKTtcblx0XHRcdG9wdGlvbnMucHJlY2lzaW9uID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3Jtcy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHR5cGUsXG5cdFx0XHRwcmVjaXNpb246IG9wdGlvbnM/LnByZWNpc2lvbixcblx0XHR9KTtcblx0fVxuXG5cdC8vIG5lZWQgdG8gZGVmaW5lIHN0cnVjdCBieSB0aGUgYWRkU3RydWN0RGVmaW5pdGlvbiBtZXRob2Rcblx0cHVibGljIGFkZFVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbihcblx0XHRzdHJ1Y3ROYW1lOiBzdHJpbmcsXG5cdFx0dmFyaWFibGVOYW1lOiBzdHJpbmdcblx0KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1TdHJ1Y3RzLnNvbWUodW5pZm9ybVN0cnVjdCA9PiB1bmlmb3JtU3RydWN0LnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbjogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1TdHJ1Y3RzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0c3RydWN0TmFtZSxcblx0XHR9KTtcblx0fVxuXG5cdC8vIGZvciBlczNcblx0cHVibGljIGFkZFVuaWZvcm1CdWZmZXJPYmplY3REZWNsYXJhdGlvbihcblx0XHRibG9ja05hbWU6IHN0cmluZyxcblx0XHR2YXJpYWJsZU9iamVjdHM6IFNoYWRlclVCT1ZhcmlhYmxlT2JqZWN0W10sXG5cdFx0b3B0aW9ucz86IHtcblx0XHRcdGluc3RhbmNlTmFtZT86IFNoYWRlclByZWNpc2lvblR5cGVcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlQmxvY2tOYW1lID1cblx0XHRcdHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cy5zb21lKHVibyA9PiB1Ym8uYmxvY2tOYW1lID09PSBibG9ja05hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZUJsb2NrTmFtZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVW5pZm9ybUJ1ZmZlck9iamVjdERlY2xhcmF0aW9uOiBkdXBsaWNhdGUgYmxvY2sgbmFtZSAke2Jsb2NrTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKGNvbnN0IHVibyBvZiB0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMpIHtcblx0XHRcdGZvciAoY29uc3QgdWJvVmFyaWFibGVPYmplY3Qgb2YgdWJvLnZhcmlhYmxlT2JqZWN0cykge1xuXHRcdFx0XHRmb3IgKGNvbnN0IHZhcmlhYmxlT2JqZWN0IG9mIHZhcmlhYmxlT2JqZWN0cykge1xuXHRcdFx0XHRcdGlmICh1Ym9WYXJpYWJsZU9iamVjdC52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlT2JqZWN0LnZhcmlhYmxlTmFtZSkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVW5pZm9ybUJ1ZmZlck9iamVjdERlY2xhcmF0aW9uOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlT2JqZWN0LnZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMucHVzaCh7XG5cdFx0XHRibG9ja05hbWUsXG5cdFx0XHR2YXJpYWJsZU9iamVjdHMsXG5cdFx0XHRpbnN0YW5jZU5hbWU6IG9wdGlvbnM/Lmluc3RhbmNlTmFtZSxcblx0XHR9KTtcblx0fVxuXG5cdC8vIHRoZSByZXR1cm4gdmFsdWUgSWQgaXMgYSB2YWx1ZSB0byBkZWxldGUgdGhlIGZ1bmN0aW9uXG5cdC8vIHRoZSBtYWluIGZ1bmN0aW9uIGlzIGRlZmluZWQgKHVwZGF0ZWQpIGJ5IHRoZSB1cGRhdGVNYWluRnVuY3Rpb24gbWV0aG9kXG5cdHB1YmxpYyBhZGRGdW5jdGlvbkRlZmluaXRpb24oXG5cdFx0ZnVuY3Rpb25Db2RlOiBzdHJpbmcsXG5cdFx0b3B0aW9ucz86IHtcblx0XHRcdGRlcGVuZGVuY3lMZXZlbD86IG51bWJlclxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgZnVuY3Rpb25JZCA9IHRoaXMuX19mdW5jdGlvbklkQ291bnQrKztcblxuXHRcdGNvbnN0IGRlcGVuZGVuY3lMZXZlbCA9IG9wdGlvbnM/LmRlcGVuZGVuY3lMZXZlbCA/PyAwO1xuXHRcdHRoaXMuX19mdW5jdGlvbnNbZGVwZW5kZW5jeUxldmVsXSA9IHRoaXMuX19mdW5jdGlvbnNbZGVwZW5kZW5jeUxldmVsXSA/PyBbXTtcblx0XHR0aGlzLl9fZnVuY3Rpb25zW2RlcGVuZGVuY3lMZXZlbF0ucHVzaCh7XG5cdFx0XHRmdW5jdGlvbkNvZGUsXG5cdFx0XHRmdW5jdGlvbklkXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb25JZDtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyB1cGRhdGUgcGFyYW1ldGVycyBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHVibGljIHVwZGF0ZUdsb2JhbFByZWNpc2lvbihwcmVjaXNpb246IFNoYWRlclByZWNpc2lvbk9iamVjdCkge1xuXHRcdE9iamVjdC5hc3NpZ24odGhpcy5fX2dsb2JhbFByZWNpc2lvbiwgcHJlY2lzaW9uKTtcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVTdHJ1Y3REZWZpbml0aW9uKHN0cnVjdE5hbWU6IHN0cmluZywgbWVtYmVyT2JqZWN0czogU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0W10pIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLmZpbmRJbmRleChzdHJ1Y3REZWZpbml0aW9uID0+IHN0cnVjdERlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0TmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHVwZGF0ZVN0cnVjdERlZmluaXRpb246IHRoZSBzdHJ1Y3QgdHlwZSBuYW1lICR7c3RydWN0TmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zW21hdGNoZWRJbmRleF0ubWVtYmVyT2JqZWN0cyA9IG1lbWJlck9iamVjdHM7XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZywgdmFsdWVzOiBudW1iZXJbXSkge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMuZmluZEluZGV4KGdsb2JhbENvbnN0YW50VmFsdWUgPT4gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgdXBkYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHR5cGUgPSB0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXNbbWF0Y2hlZEluZGV4XS50eXBlO1xuXG5cdFx0Y29uc3QgaXNWYWxpZENvbXBvbmVudE51bWJlciA9IFV0aWxpdHkuX2lzVmFsaWRDb21wb25lbnRDb3VudCh0eXBlLCB2YWx1ZXMpO1xuXHRcdGlmICghaXNWYWxpZENvbXBvbmVudE51bWJlcikge1xuXHRcdFx0Y29uc29sZS5lcnJvcigndXBkYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlIGNvbXBvbmVudCBjb3VudCBpcyBpbnZhbGlkJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNJbnRUeXBlID0gVXRpbGl0eS5faXNJbnRUeXBlKHR5cGUpO1xuXHRcdGlmIChpc0ludFR5cGUpIHtcblx0XHRcdGNvbnN0IGV4aXN0Tm9uSW50ZWdlclZhbHVlID0gU2hhZGVyaXR5T2JqZWN0Q3JlYXRvci5fX2V4aXN0Tm9uSW50ZWdlclZhbHVlKHZhbHVlcyk7XG5cdFx0XHRpZiAoZXhpc3ROb25JbnRlZ2VyVmFsdWUpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGB1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgJHt2YXJpYWJsZU5hbWV9IGhhcyBhIG5vbi1pbnRlZ2VyIHZhbHVlLmApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlc1ttYXRjaGVkSW5kZXhdLnZhbHVlcyA9IHZhbHVlcztcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCB2YWx1ZXM6IHtba2V5VmFyaWFibGVOYW1lOiBzdHJpbmddOiBudW1iZXJbXX0pIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLmZpbmRJbmRleChzdHJ1Y3RWYWx1ZSA9PiBzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHVwZGF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWU6ICB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzW21hdGNoZWRJbmRleF0udmFsdWVzID0gdmFsdWVzO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZU1haW5GdW5jdGlvbihtYWluRnVuY3Rpb25Db2RlSW5uZXI6IHN0cmluZykge1xuXHRcdHRoaXMuX19tYWluRnVuY3Rpb25Db2RlID0gbWFpbkZ1bmN0aW9uQ29kZUlubmVyO1xuXHR9XG5cblx0Ly8gc3BlY2lmeSB0aGUgbmFtZSBvZiB0aGUgb3V0cHV0IGNvbG9yIHZhcmlhYmxlIGZyb20gdGhlIG1haW4gZnVuY3Rpb24gaW4gdGhlIGZyYWdtZW50IHNoYWRlci5cblx0Ly8gdXNlcnMgaGF2ZSB0byBhc3NpZ24gdGhlIHJlc3VsdCBvZiBmcmFnbWVudCBzaGFkZXIgY2FsY3VsYXRpb24gdG8gdGhpcyB2YXJpYWJsZS5cblx0cHVibGljIHVwZGF0ZU91dHB1dENvbG9yVmFyaWFibGVOYW1lKG91dHB1dENvbG9yVmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRpZiAodGhpcy5fX3NoYWRlclN0YWdlICE9PSAnZnJhZ21lbnQnKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCd1cGRhdGVPdXRwdXRDb2xvclZhcmlhYmxlTmFtZTogdGhpcyBtZXRob2QgaXMgZm9yIGZyYWdtZW50IHNoYWRlciBvbmx5Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKG91dHB1dENvbG9yVmFyaWFibGVOYW1lLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcigndXBkYXRlT3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU6IGludmFsaWQgb3V0Q29sb3JWYXJpYWJsZU5hbWUnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fb3V0cHV0Q29sb3JWYXJpYWJsZU5hbWUgPSBvdXRwdXRDb2xvclZhcmlhYmxlTmFtZTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyByZW1vdmUgcGFyYW1ldGVycyBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHVibGljIHJlbW92ZURlZmluZURpcmVjdGl2ZShkZWZpbmVEaXJlY3RpdmVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPSB0aGlzLl9fZGVmaW5lRGlyZWN0aXZlTmFtZXMuaW5kZXhPZihkZWZpbmVEaXJlY3RpdmVOYW1lKTtcblxuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ3JlbW92ZWREZWZpbmVEaXJlY3RpdmU6IHRoaXMgZGVmaW5lIGRpcmVjdGl2ZSBpcyBub3QgZXhpc3QnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZGVmaW5lRGlyZWN0aXZlTmFtZXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlRXh0ZW5zaW9uKGV4dGVuc2lvbk5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5maW5kSW5kZXgoZXh0ZW5zaW9uID0+IGV4dGVuc2lvbi5leHRlbnNpb25OYW1lID09PSBleHRlbnNpb25OYW1lKTtcblxuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ3JlbW92ZUV4dGVuc2lvbjogdGhpcyBleHRlbnNpb24gaXMgbm90IGV4aXN0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2V4dGVuc2lvbnMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlU3RydWN0RGVmaW5pdGlvbihzdHJ1Y3ROYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLmZpbmRJbmRleChzdHJ1Y3REZWZpbml0aW9uID0+IHN0cnVjdERlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0TmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHJlbW92ZVN0cnVjdERlZmluaXRpb246IHRoZSBzdHJ1Y3QgdHlwZSBuYW1lICR7c3RydWN0TmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZUdsb2JhbENvbnN0YW50VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLmZpbmRJbmRleChnbG9iYWxDb25zdGFudFZhbHVlID0+IGdsb2JhbENvbnN0YW50VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZUdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMuZmluZEluZGV4KHN0cnVjdFZhbHVlID0+IHN0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgdXBkYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZTogIHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlQXR0cmlidXRlRGVjbGFyYXRpb24odmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2F0dHJpYnV0ZXMuZmluZEluZGV4KGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZUF0dHJpYnV0ZTogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19hdHRyaWJ1dGVzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVZhcnlpbmdEZWNsYXJhdGlvbih2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fdmFyeWluZ3MuZmluZEluZGV4KHZhcnlpbmcgPT4gdmFyeWluZy52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlVmFyeWluZzogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX192YXJ5aW5ncy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVVbmlmb3JtRGVjbGFyYXRpb24odmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1zLmZpbmRJbmRleCh1bmlmb3JtID0+IHVuaWZvcm0udmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZVVuaWZvcm06IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX191bmlmb3JtU3RydWN0cy5maW5kSW5kZXgodW5pZm9ybVN0cnVjdCA9PiB1bmlmb3JtU3RydWN0LnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb246IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybVN0cnVjdHMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlVW5pZm9ybUJ1ZmZlck9iamVjdERlY2xhcmF0aW9uKGJsb2NrTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cy5maW5kSW5kZXgodWJvID0+IHViby5ibG9ja05hbWUgPT09IGJsb2NrTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uOiB0aGUgdmFyaWFibGUgbmFtZSAke2Jsb2NrTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZUZ1bmN0aW9uRGVmaW5pdGlvbihmdW5jdGlvbklkOiBudW1iZXIpIHtcblx0XHR0aGlzLl9fZmlsbEVtcHR5RnVuY3Rpb25zKCk7XG5cblx0XHQvLyBpZCBpcyB0b28gc21hbGwgb3IgdG9vIGJpZ1xuXHRcdGlmIChmdW5jdGlvbklkIDwgMCB8fCBmdW5jdGlvbklkID49IHRoaXMuX19mdW5jdGlvbklkQ291bnQpIHtcblx0XHRcdGNvbnNvbGUud2FybigncmVtb3ZlRnVuY3Rpb25EZWZpbml0aW9uOiBpbnZhbGlkIGZ1bmN0aW9uIGlkJylcblx0XHR9XG5cblx0XHRmb3IgKGNvbnN0IGZ1bmN0aW9uT2JqZWN0cyBvZiB0aGlzLl9fZnVuY3Rpb25zKSB7XG5cdFx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0XHRmdW5jdGlvbk9iamVjdHMuZmluZEluZGV4KGZ1bmN0aW9uT2JqZWN0ID0+IGZ1bmN0aW9uT2JqZWN0LmZ1bmN0aW9uSWQgPT09IGZ1bmN0aW9uSWQpO1xuXHRcdFx0aWYgKG1hdGNoZWRJbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0ZnVuY3Rpb25PYmplY3RzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc29sZS53YXJuKGByZW1vdmVGdW5jdGlvbkRlZmluaXRpb246IG5vdCBmb3VuZCB0aGUgZnVuY3Rpb24gb2YgZnVuY3Rpb25JZCAke2Z1bmN0aW9uSWR9YCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gY3JlYXRlIHNoYWRlcml0eSBvYmplY3QgZnVuY3Rpb25cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHVibGljIGNyZWF0ZVNoYWRlcml0eU9iamVjdCgpOiBTaGFkZXJpdHlPYmplY3Qge1xuXHRcdGNvbnN0IHNoYWRlcml0eU9iaiA9IHtcblx0XHRcdGNvZGU6IHRoaXMuX19jcmVhdGVTaGFkZXJDb2RlKCksXG5cdFx0XHRzaGFkZXJTdGFnZTogdGhpcy5fX3NoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogdGhpcy5fX3NoYWRlclN0YWdlID09PSAnZnJhZ21lbnQnLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gc2hhZGVyaXR5T2JqO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHByaXZhdGUgbWV0aG9kc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwcml2YXRlIHN0YXRpYyBfX2V4aXN0Tm9uSW50ZWdlclZhbHVlKHZhbHVlczogbnVtYmVyW10pIHtcblx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuXHRcdFx0aWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gVE9ETzogaW1wbGVtZW50IHNoYWRlciBjb2RlIGltcG9ydCBmZWF0dXJlIChsb3cgcHJpb3JpdHkpXG5cdC8vIHB1YmxpYyBpbXBvcnRTaGFkZXJDb2RlKGNvZGU6IHN0cmluZykge31cblxuXHQvLyBuZWVkIHRvIGFwcGx5IFNoYWRlcml0eS50cmFuc2Zvcm1Ub0dMU0xFUzEsIHRyYW5zZm9ybVRvR0xTTEVTMyBvciB0cmFuc2Zvcm1UbyBtZXRob2Rcblx0cHJpdmF0ZSBfX2NyZWF0ZVNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHR0aGlzLl9fZmlsbEVtcHR5RnVuY3Rpb25zKCk7XG5cblx0XHRjb25zdCBjb2RlXG5cdFx0XHQ9IGAjdmVyc2lvbiAzMDAgZXNcXG5cXG5gXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVEZWZpbmVEaXJlY3RpdmVTaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUV4dGVuc2lvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlR2xvYmFsUHJlY2lzaW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVTdHJ1Y3REZWZpbml0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVHbG9iYWxDb25zdGFudFZhbHVlU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVBdHRyaWJ1dGVEZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlVmFyeWluZ0RlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVPdXRwdXRDb2xvckRlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVVbmlmb3JtRGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlVW5pZm9ybUJ1ZmZlck9iamVjdFNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlRnVuY3Rpb25EZWZpbml0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVNYWluRnVuY3Rpb25EZWZpbml0aW9uU2hhZGVyQ29kZSgpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHRwcml2YXRlIF9fZmlsbEVtcHR5RnVuY3Rpb25zKCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fX2Z1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dGhpcy5fX2Z1bmN0aW9uc1tpXSA9IHRoaXMuX19mdW5jdGlvbnNbaV0gPz8gW107XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZURlZmluZURpcmVjdGl2ZVNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgZGVmaW5lRGlyZWN0aXZlTmFtZSBvZiB0aGlzLl9fZGVmaW5lRGlyZWN0aXZlTmFtZXMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYCNkZWZpbmUgJHtkZWZpbmVEaXJlY3RpdmVOYW1lfVxcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTs7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlRXh0ZW5zaW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBleHRlbnNpb24gb2YgdGhpcy5fX2V4dGVuc2lvbnMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYCNleHRlbnNpb24gJHtleHRlbnNpb24uZXh0ZW5zaW9uTmFtZX06ICR7ZXh0ZW5zaW9uLmJlaGF2aW9yfVxcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdC8vVE9ETzogcmVtb3ZlIG5lZWRsZXNzIHByZWNpc2lvbnNcblx0cHJpdmF0ZSBfX2NyZWF0ZUdsb2JhbFByZWNpc2lvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdHlwZSBpbiB0aGlzLl9fZ2xvYmFsUHJlY2lzaW9uKSB7XG5cdFx0XHRjb25zdCBwcmVjaXNpb25UeXBlID0gdHlwZSBhcyBTaGFkZXJQcmVjaXNpb25PYmplY3RLZXk7XG5cdFx0XHRjb25zdCBwcmVjaXNpb25RdWFsaWZpZXIgPSB0aGlzLl9fZ2xvYmFsUHJlY2lzaW9uW3ByZWNpc2lvblR5cGVdO1xuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGBwcmVjaXNpb24gJHtwcmVjaXNpb25RdWFsaWZpZXJ9ICR7cHJlY2lzaW9uVHlwZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVN0cnVjdERlZmluaXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHN0cnVjdERlZmluaXRpb24gb2YgdGhpcy5fX3N0cnVjdERlZmluaXRpb25zKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGBzdHJ1Y3QgJHtzdHJ1Y3REZWZpbml0aW9uLnN0cnVjdE5hbWV9IHtcXG5gO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZSA9IHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0c1tpXTtcblxuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAgIGA7XG5cdFx0XHRcdGlmICh2YXJpYWJsZS5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dmFyaWFibGUucHJlY2lzaW9ufSBgO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJpYWJsZS50eXBlfSAke3ZhcmlhYmxlLm1lbWJlck5hbWV9O1xcbmA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYH07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUdsb2JhbENvbnN0YW50VmFsdWVTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IGdsb2JhbENvbnN0YW50VmFsdWUgb2YgdGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gZ2xvYmFsQ29uc3RhbnRWYWx1ZS50eXBlO1xuXHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YXJpYWJsZU5hbWU7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IGdsb2JhbENvbnN0YW50VmFsdWUudmFsdWVzO1xuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGBjb25zdCAke3R5cGV9ICR7dmFyaWFibGVOYW1lfSA9ICR7dHlwZX0oYDtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSB2YWx1ZVtpXSArICcsICc7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgPSBzaGFkZXJDb2RlLnJlcGxhY2UoLyxcXHMkLywgJyk7XFxuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBzdHJ1Y3RWYWx1ZSBvZiB0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMpIHtcblx0XHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5maW5kSW5kZXgoZGVmaW5pdGlvbiA9PiBkZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdFZhbHVlLnN0cnVjdE5hbWUpO1xuXHRcdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogdGhlIHN0cnVjdCB0eXBlICR7c3RydWN0VmFsdWUuc3RydWN0TmFtZX0gaXMgbm90IGRlZmluZWRgKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYGNvbnN0ICR7c3RydWN0VmFsdWUuc3RydWN0TmFtZX0gJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9ID0gJHtzdHJ1Y3RWYWx1ZS5zdHJ1Y3ROYW1lfSAoXFxuYDtcblxuXHRcdFx0Y29uc3Qgc3RydWN0RGVmaW5pdGlvbiA9IHRoaXMuX19zdHJ1Y3REZWZpbml0aW9uc1ttYXRjaGVkSW5kZXhdO1xuXHRcdFx0aWYgKHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0cy5sZW5ndGggIT09IE9iamVjdC5rZXlzKHN0cnVjdFZhbHVlLnZhbHVlcykubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6IEludmFsaWQgbnVtYmVyIG9mIHZhcmlhYmxlcyB0aGF0ICR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSBoYXNgKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhhc1NhbXBsZXJUeXBlID1cblx0XHRcdFx0c3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzLnNvbWUobWVtYmVyT2JqZWN0ID0+IFV0aWxpdHkuX2lzU2FtcGxlclR5cGUobWVtYmVyT2JqZWN0LnR5cGUpKTtcblx0XHRcdGlmIChoYXNTYW1wbGVyVHlwZSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiBDb25zdGFudFN0cnVjdFZhbHVlICgke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0pIGNhbm5vdCBoYXZlIHNhbXBsZXIgdHlwZSBwYXJhbWV0ZXJgKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlTmFtZSA9IHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0c1tpXS5tZW1iZXJOYW1lO1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IHN0cnVjdFZhbHVlLnZhbHVlc1t2YXJpYWJsZU5hbWVdXG5cdFx0XHRcdGlmICh2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9IGRvZXMgbm90IGhhdmUgdGhlIHZhbHVlIG9mICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgdHlwZSA9IHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0c1tpXS50eXBlO1xuXHRcdFx0XHRjb25zdCBpc1ZhbGlkQ29tcG9uZW50TnVtYmVyID0gVXRpbGl0eS5faXNWYWxpZENvbXBvbmVudENvdW50KHR5cGUsIHZhbHVlKTtcblx0XHRcdFx0aWYgKCFpc1ZhbGlkQ29tcG9uZW50TnVtYmVyKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogdGhlIGNvbXBvbmVudCBjb3VudCBvZiAke3ZhcmlhYmxlTmFtZX0gaW4gJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9IGlzIGludmFsaWRgKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCAgJHt0eXBlfShgO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0c2hhZGVyQ29kZSArPSB2YWx1ZVtpXSArICcsICc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzaGFkZXJDb2RlID0gc2hhZGVyQ29kZS5yZXBsYWNlKC8sXFxzJC8sICcpLFxcbicpO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlID0gc2hhZGVyQ29kZS5yZXBsYWNlKC8sXFxuJC8sICdcXG4pO1xcbicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlQXR0cmlidXRlRGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IGF0dHJpYnV0ZSBvZiB0aGlzLl9fYXR0cmlidXRlcykge1xuXHRcdFx0aWYgKGF0dHJpYnV0ZS5sb2NhdGlvbiAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYGxheW91dCAobG9jYXRpb24gPSAke2F0dHJpYnV0ZS5sb2NhdGlvbn0pIGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYGluIGA7XG5cblx0XHRcdGlmIChhdHRyaWJ1dGUucHJlY2lzaW9uICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHthdHRyaWJ1dGUucHJlY2lzaW9ufSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGAke2F0dHJpYnV0ZS50eXBlfSAke2F0dHJpYnV0ZS52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVWYXJ5aW5nRGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHZhcnlpbmcgb2YgdGhpcy5fX3ZhcnlpbmdzKSB7XG5cdFx0XHRpZiAodmFyeWluZy5pbnRlcnBvbGF0aW9uVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dmFyeWluZy5pbnRlcnBvbGF0aW9uVHlwZX0gYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSB0aGlzLl9fc2hhZGVyU3RhZ2UgPT0gJ3ZlcnRleCcgPyBgb3V0IGAgOiBgaW4gYDtcblxuXHRcdFx0aWYgKHZhcnlpbmcucHJlY2lzaW9uICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJ5aW5nLnByZWNpc2lvbn0gYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJ5aW5nLnR5cGV9ICR7dmFyeWluZy52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdC8vVE9ETzogdHJhbnNsYXRlIHdoZW4gZ2xzbCBlczFcblx0cHJpdmF0ZSBfX2NyZWF0ZU91dHB1dENvbG9yRGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0aWYgKHRoaXMuX19zaGFkZXJTdGFnZSAhPT0gJ2ZyYWdtZW50Jykge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdHJldHVybiBgbGF5b3V0KGxvY2F0aW9uID0gMCkgb3V0IHZlYzQgJHt0aGlzLl9fb3V0cHV0Q29sb3JWYXJpYWJsZU5hbWV9O1xcblxcbmA7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlVW5pZm9ybURlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB1bmlmb3JtIG9mIHRoaXMuX191bmlmb3Jtcykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgdW5pZm9ybSBgO1xuXG5cdFx0XHRpZiAodW5pZm9ybS5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3VuaWZvcm0ucHJlY2lzaW9ufSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGAke3VuaWZvcm0udHlwZX0gJHt1bmlmb3JtLnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdW5pZm9ybVN0cnVjdCBvZiB0aGlzLl9fdW5pZm9ybVN0cnVjdHMpIHtcblx0XHRcdGNvbnN0IHN0cnVjdE5hbWUgPSB1bmlmb3JtU3RydWN0LnN0cnVjdE5hbWU7XG5cblx0XHRcdGNvbnN0IGV4aXN0U3RydWN0RGVmaW5pdGlvbiA9XG5cdFx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5zb21lKGRlZmluaXRpb24gPT4gZGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRcdGlmICghZXhpc3RTdHJ1Y3REZWZpbml0aW9uKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uU2hhZGVyQ29kZTogdGhlIHN0cnVjdCB0eXBlICR7c3RydWN0TmFtZX0gaXMgbm90IGRlZmluZWRgKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYHVuaWZvcm0gJHtzdHJ1Y3ROYW1lfSAke3VuaWZvcm1TdHJ1Y3QudmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlVW5pZm9ybUJ1ZmZlck9iamVjdFNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdWJvIG9mIHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgbGF5b3V0IChzdGQxNDApIHVuaWZvcm0gJHt1Ym8uYmxvY2tOYW1lfSB7XFxuYDtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB1Ym8udmFyaWFibGVPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlT2JqID0gdWJvLnZhcmlhYmxlT2JqZWN0c1tpXTtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgICAke3ZhcmlhYmxlT2JqLnR5cGV9ICR7dmFyaWFibGVPYmoudmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodWJvLmluc3RhbmNlTmFtZSAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYH0gJHt1Ym8uaW5zdGFuY2VOYW1lfTtcXG5gO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgfTtcXG5gO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlRnVuY3Rpb25EZWZpbml0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9fZnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBmdW5jdGlvbk9iamVjdHMgPSB0aGlzLl9fZnVuY3Rpb25zW2ldO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBmdW5jdGlvbk9iamVjdHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBmdW5jdGlvbk9iamVjdHNbal0uZnVuY3Rpb25Db2RlICsgYFxcbmA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVNYWluRnVuY3Rpb25EZWZpbml0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLl9fbWFpbkZ1bmN0aW9uQ29kZSArIGBcXG5gO1xuXHR9XG59XG4iLCJpbXBvcnQge1NoYWRlckF0dHJpYnV0ZVZhclR5cGUsIFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzLCBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMywgU2hhZGVyVmFyeWluZ1ZhclR5cGV9IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVdGlsaXR5IHtcblx0c3RhdGljIF9zcGxpdEJ5TGluZUZlZWRDb2RlKHNvdXJjZTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHNvdXJjZS5zcGxpdCgvXFxyXFxufFxcbi8pO1xuXHR9XG5cblx0c3RhdGljIF9qb2luU3BsaXR0ZWRMaW5lKHNwbGl0dGVkTGluZTogc3RyaW5nW10pIHtcblx0XHRyZXR1cm4gc3BsaXR0ZWRMaW5lLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0c3RhdGljIF9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc291cmNlOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gc291cmNlID09PSAnJyA/IHNvdXJjZSA6IHNvdXJjZSArICdcXG4nO1xuXHR9XG5cblx0c3RhdGljIF9jb21wb25lbnROdW1iZXIoXG5cdFx0dHlwZTogU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgfCBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlIHwgU2hhZGVyVmFyeWluZ1ZhclR5cGUgfCBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTM1xuXHQpIHtcblx0XHRsZXQgY29tcG9uZW50TnVtYmVyO1xuXHRcdGlmIChcblx0XHRcdHR5cGUgPT09ICdmbG9hdCcgfHwgdHlwZSA9PT0gJ2ludCcgfHwgdHlwZSA9PT0gJ2Jvb2wnIHx8IHR5cGUgPT09ICd1aW50JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3NhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ3NhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAnc2FtcGxlcjNEJyB8fCB0eXBlID09PSAnc2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAnaXNhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICdpc2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAndXNhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICd1c2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAnc2FtcGxlcjJEU2hhZG93JyB8fCB0eXBlID09PSAnc2FtcGxlckN1YmVTaGFkb3cnIHx8IHR5cGUgPT09ICdzYW1wbGVyMkRBcnJheVNoYWRvdydcblx0XHQpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDE7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAndmVjMicgfHwgdHlwZSA9PT0gJ2l2ZWMyJyB8fCB0eXBlID09PSAnYnZlYzInIHx8IHR5cGUgPT09ICd1dmVjMicpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDI7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAndmVjMycgfHwgdHlwZSA9PT0gJ2l2ZWMzJyB8fCB0eXBlID09PSAnYnZlYzMnIHx8IHR5cGUgPT09ICd1dmVjMycpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDM7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAndmVjNCcgfHwgdHlwZSA9PT0gJ2l2ZWM0JyB8fCB0eXBlID09PSAnYnZlYzQnIHx8IHR5cGUgPT09ICd1dmVjNCcgfHwgdHlwZSA9PT0gJ21hdDInIHx8IHR5cGUgPT09ICdtYXQyeDInKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSA0O1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDJ4MycgfHwgdHlwZSA9PT0gJ21hdDN4MicpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDY7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0Mng0JyB8fCB0eXBlID09PSAnbWF0NHgyJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gODtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQzJyB8fCB0eXBlID09PSAnbWF0M3gzJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gOTtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQzeDQnIHx8IHR5cGUgPT09ICdtYXQ0eDMnKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAxMjtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQ0JyB8fCB0eXBlID09PSAnbWF0NHg0Jykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMTY7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHVua25vd24gdHlwZVxuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMDtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1V0aWxpdHkuX2NvbXBvbmVudE51bWJlcjogZGV0ZWN0IHVua25vd24gdHlwZScpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21wb25lbnROdW1iZXI7XG5cdH1cblxuXHRzdGF0aWMgX2lzSW50VHlwZShcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzXG5cdCkge1xuXHRcdGlmIChcblx0XHRcdHR5cGUgPT09ICdpbnQnIHx8IHR5cGUgPT09ICdpdmVjMicgfHwgdHlwZSA9PT0gJ2l2ZWMzJyB8fCB0eXBlID09PSAnaXZlYzQnIHx8XG5cdFx0XHR0eXBlID09PSAndWludCcgfHwgdHlwZSA9PT0gJ3V2ZWMyJyB8fCB0eXBlID09PSAndXZlYzMnIHx8IHR5cGUgPT09ICd1dmVjNCdcblx0XHQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIF9pc1ZhbGlkQ29tcG9uZW50Q291bnQoXG5cdFx0dHlwZTogU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgfCBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlIHwgU2hhZGVyVmFyeWluZ1ZhclR5cGUgfCBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyxcblx0XHR2YWx1ZXM6IG51bWJlcltdXG5cdCkge1xuXHRcdGNvbnN0IHZhbGlkQ29tcG9uZW50Q291bnQgPSBVdGlsaXR5Ll9jb21wb25lbnROdW1iZXIodHlwZSk7XG5cdFx0aWYgKHZhbGlkQ29tcG9uZW50Q291bnQgPT09IHZhbHVlcy5sZW5ndGgpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRzdGF0aWMgX2lzU2FtcGxlclR5cGUoXG5cdFx0dHlwZTogU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgfCBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlIHwgU2hhZGVyVmFyeWluZ1ZhclR5cGUgfCBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTM1xuXHQpIHtcblx0XHRpZiAoXG5cdFx0XHR0eXBlID09PSAnc2FtcGxlcjJEJyB8fCB0eXBlID09PSAnc2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICdzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICdzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICdpc2FtcGxlcjJEJyB8fCB0eXBlID09PSAnaXNhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAnaXNhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICd1c2FtcGxlcjJEJyB8fCB0eXBlID09PSAndXNhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAndXNhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICdzYW1wbGVyMkRTaGFkb3cnIHx8IHR5cGUgPT09ICdzYW1wbGVyQ3ViZVNoYWRvdycgfHwgdHlwZSA9PT0gJ3NhbXBsZXIyREFycmF5U2hhZG93J1xuXHRcdCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=