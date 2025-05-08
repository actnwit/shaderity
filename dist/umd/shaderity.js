(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Shaderity"] = factory();
	else
		root["Shaderity"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
                startLine = 0;
            }
        }
        if (endLineStr) {
            endLine = splittedLines.findIndex(line => line.includes(endLineStr));
            if (endLine === -1) {
                endLine = splittedLines.length;
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

/******/ })["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TaGFkZXJpdHkvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1NoYWRlcml0eS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9TaGFkZXJpdHkvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vU2hhZGVyaXR5Ly4vc3JjL21haW4vUHJlUHJvY2Vzc29yLnRzIiwid2VicGFjazovL1NoYWRlcml0eS8uL3NyYy9tYWluL1JlZmxlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vU2hhZGVyaXR5Ly4vc3JjL21haW4vU2hhZGVyRWRpdG9yLnRzIiwid2VicGFjazovL1NoYWRlcml0eS8uL3NyYy9tYWluL1NoYWRlclRyYW5zZm9ybWVyLnRzIiwid2VicGFjazovL1NoYWRlcml0eS8uL3NyYy9tYWluL1NoYWRlcml0eS50cyIsIndlYnBhY2s6Ly9TaGFkZXJpdHkvLi9zcmMvbWFpbi9TaGFkZXJpdHlPYmplY3RDcmVhdG9yLnRzIiwid2VicGFjazovL1NoYWRlcml0eS8uL3NyYy9tYWluL1V0aWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87UUNWQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5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QUFJLElBQUksS0FBSyxPQUFPO1lBQzFFLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLE9BQU8sSUFBSSxJQUFJLEtBQUssT0FBTyxJQUFJLElBQUksS0FBSyxPQUFPLEVBQzFFO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDWjthQUFNO1lBQ04sT0FBTyxLQUFLLENBQUM7U0FDYjtJQUNGLENBQUM7SUFFRCxNQUFNLENBQUMsc0JBQXNCLENBQzVCLElBQTZHLEVBQzdHLE1BQWdCO1FBRWhCLE1BQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNELElBQUksbUJBQW1CLEtBQUssTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUMxQyxPQUFPLElBQUksQ0FBQztTQUNaO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDO0lBRUQsTUFBTSxDQUFDLGNBQWMsQ0FDcEIsSUFBNkc7UUFFN0csSUFDQyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxhQUFhLElBQUksSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLEtBQUssZ0JBQWdCO1lBQ25HLElBQUksS0FBSyxZQUFZLElBQUksSUFBSSxLQUFLLGNBQWMsSUFBSSxJQUFJLEtBQUssWUFBWSxJQUFJLElBQUksS0FBSyxpQkFBaUI7WUFDdkcsSUFBSSxLQUFLLFlBQVksSUFBSSxJQUFJLEtBQUssY0FBYyxJQUFJLElBQUksS0FBSyxZQUFZLElBQUksSUFBSSxLQUFLLGlCQUFpQjtZQUN2RyxJQUFJLEtBQUssaUJBQWlCLElBQUksSUFBSSxLQUFLLG1CQUFtQixJQUFJLElBQUksS0FBSyxzQkFBc0IsRUFDNUY7WUFDRCxPQUFPLElBQUksQ0FBQztTQUNaO2FBQU07WUFDTixPQUFPLEtBQUssQ0FBQztTQUNiO0lBQ0YsQ0FBQztDQUNEO0FBeEZELDBCQXdGQyIsImZpbGUiOiJzaGFkZXJpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJTaGFkZXJpdHlcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiU2hhZGVyaXR5XCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vLi4vLi4vZGlzdC9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgU2hhZGVyaXR5IGZyb20gJy4vbWFpbi9TaGFkZXJpdHknO1xyXG5pbXBvcnQgX1NoYWRlcml0eU9iamVjdENyZWF0b3IgZnJvbSAnLi9tYWluL1NoYWRlcml0eU9iamVjdENyZWF0b3InO1xyXG5pbXBvcnQgX1JlZmxlY3Rpb24gZnJvbSAnLi9tYWluL1JlZmxlY3Rpb24nO1xyXG5cclxuaW1wb3J0IHtcclxuICBBdHRyaWJ1dGVTZW1hbnRpY3MgYXMgX0F0dHJpYnV0ZVNlbWFudGljcyxcclxuICBSZWZsZWN0aW9uQXR0cmlidXRlIGFzIF9SZWZsZWN0aW9uQXR0cmlidXRlLFxyXG4gIFJlZmxlY3Rpb25Vbmlmb3JtIGFzIF9SZWZsZWN0aW9uVW5pZm9ybSxcclxuICBSZWZsZWN0aW9uVmFyeWluZyBhcyBfUmVmbGVjdGlvblZhcnlpbmcsXHJcbiAgU2hhZGVyaXR5T2JqZWN0IGFzIF9TaGFkZXJpdHlPYmplY3QsXHJcbiAgU2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3IgYXMgX1NoYWRlckV4dGVuc2lvbkJlaGF2aW9yLFxyXG4gIFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIGFzIF9TaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyxcclxuICBTaGFkZXJQcmVjaXNpb25PYmplY3QgYXMgX1NoYWRlclByZWNpc2lvbk9iamVjdCxcclxuICBTaGFkZXJTdGFnZVN0ciBhcyBfU2hhZGVyU3RhZ2VTdHIsXHJcbiAgU2hhZGVyUHJlY2lzaW9uVHlwZSBhcyBfU2hhZGVyUHJlY2lzaW9uVHlwZSxcclxuICBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlIGFzIF9TaGFkZXJBdHRyaWJ1dGVWYXJUeXBlLFxyXG4gIFNoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSBhcyBfU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlLFxyXG4gIFNoYWRlclZhcnlpbmdWYXJUeXBlIGFzIF9TaGFkZXJWYXJ5aW5nVmFyVHlwZSxcclxuICBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyBhcyBfU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsXHJcbiAgU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0IGFzIF9TaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3QsXHJcbiAgU2hhZGVyVUJPVmFyaWFibGVPYmplY3QgYXMgX1NoYWRlclVCT1ZhcmlhYmxlT2JqZWN0LFxyXG4gIFNoYWRlckF0dHJpYnV0ZU9iamVjdCBhcyBfU2hhZGVyQXR0cmlidXRlT2JqZWN0LFxyXG4gIFNoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3QgYXMgX1NoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3QsXHJcbiAgU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdCBhcyBfU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdCxcclxuICBTaGFkZXJFeHRlbnNpb25PYmplY3QgYXMgX1NoYWRlckV4dGVuc2lvbk9iamVjdCxcclxuICBTaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0IGFzIF9TaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0LFxyXG4gIFNoYWRlclVuaWZvcm1CdWZmZXJPYmplY3QgYXMgX1NoYWRlclVuaWZvcm1CdWZmZXJPYmplY3QsXHJcbiAgU2hhZGVyVW5pZm9ybU9iamVjdCBhcyBfU2hhZGVyVW5pZm9ybU9iamVjdCxcclxuICBTaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0IGFzIF9TaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0LFxyXG4gIFNoYWRlclZhcnlpbmdPYmplY3QgYXMgX1NoYWRlclZhcnlpbmdPYmplY3QsXHJcbiAgU2hhZGVyVmVyc2lvbiBhcyBfU2hhZGVyVmVyc2lvbixcclxuICBUZW1wbGF0ZU9iamVjdCBhcyBfVGVtcGxhdGVPYmplY3QsXHJcbiAgVW5pZm9ybVNlbWFudGljcyBhcyBfVW5pZm9ybVNlbWFudGljcyxcclxuICBWYXJUeXBlIGFzIF9WYXJUeXBlLFxyXG59IGZyb20gJy4vdHlwZXMvdHlwZSc7XHJcblxyXG5leHBvcnQge1xyXG4gIFNoYWRlcml0eU9iamVjdENyZWF0b3IgYXMgX1NoYWRlcml0eU9iamVjdENyZWF0b3IsXHJcbiAgUmVmbGVjdGlvbiBhcyBfUmVmbGVjdGlvbixcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQXR0cmlidXRlU2VtYW50aWNzID0gX0F0dHJpYnV0ZVNlbWFudGljcztcclxuZXhwb3J0IHR5cGUgUmVmbGVjdGlvbkF0dHJpYnV0ZSA9IF9SZWZsZWN0aW9uQXR0cmlidXRlO1xyXG5leHBvcnQgdHlwZSBSZWZsZWN0aW9uVW5pZm9ybSA9IF9SZWZsZWN0aW9uVW5pZm9ybTtcclxuZXhwb3J0IHR5cGUgUmVmbGVjdGlvblZhcnlpbmcgPSBfUmVmbGVjdGlvblZhcnlpbmc7XHJcbmV4cG9ydCB0eXBlIFNoYWRlcml0eU9iamVjdCA9IF9TaGFkZXJpdHlPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckV4dGVuc2lvbkJlaGF2aW9yID0gX1NoYWRlckV4dGVuc2lvbkJlaGF2aW9yO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyA9IF9TaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMztcclxuZXhwb3J0IHR5cGUgU2hhZGVyUHJlY2lzaW9uT2JqZWN0ID0gX1NoYWRlclByZWNpc2lvbk9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyU3RhZ2VTdHIgPSBfU2hhZGVyU3RhZ2VTdHI7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclByZWNpc2lvblR5cGUgPSBfU2hhZGVyUHJlY2lzaW9uVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSA9IF9TaGFkZXJBdHRyaWJ1dGVWYXJUeXBlO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUgPSBfU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJWYXJ5aW5nVmFyVHlwZSA9IF9TaGFkZXJWYXJ5aW5nVmFyVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMgPSBfU2hhZGVyVW5pZm9ybVZhclR5cGVFUzM7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclN0cnVjdE1lbWJlck9iamVjdCA9IF9TaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVCT1ZhcmlhYmxlT2JqZWN0ID0gX1NoYWRlclVCT1ZhcmlhYmxlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJBdHRyaWJ1dGVPYmplY3QgPSBfU2hhZGVyQXR0cmlidXRlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0ID0gX1NoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckNvbnN0YW50VmFsdWVPYmplY3QgPSBfU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyRXh0ZW5zaW9uT2JqZWN0ID0gX1NoYWRlckV4dGVuc2lvbk9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdCA9IF9TaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0ID0gX1NoYWRlclVuaWZvcm1CdWZmZXJPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVuaWZvcm1PYmplY3QgPSBfU2hhZGVyVW5pZm9ybU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCA9IF9TaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJWYXJ5aW5nT2JqZWN0ID0gX1NoYWRlclZhcnlpbmdPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclZlcnNpb24gPSBfU2hhZGVyVmVyc2lvbjtcclxuZXhwb3J0IHR5cGUgVGVtcGxhdGVPYmplY3QgPSBfVGVtcGxhdGVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFVuaWZvcm1TZW1hbnRpY3MgPSBfVW5pZm9ybVNlbWFudGljcztcclxuZXhwb3J0IHR5cGUgVmFyVHlwZSA9IF9WYXJUeXBlO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJpdHlPYmplY3RDcmVhdG9yID0gX1NoYWRlcml0eU9iamVjdENyZWF0b3I7XHJcbmV4cG9ydCB0eXBlIFJlZmxlY3Rpb24gPSBfUmVmbGVjdGlvbjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNoYWRlcml0eVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVQcm9jZXNzb3Ige1xuICAgIHByaXZhdGUgc3RhdGljIGRlZmluaXRpb25zOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZXZhbHVhdGVDb25kaXRpb24oY29uZGl0aW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgLy8g5pWw5YCk5q+U6LyD44Gu5q2j6KaP6KGo54++XG4gICAgICAgIGNvbnN0IG51bWVyaWNDb21wYXJpc29uID0gLyhcXHcrKVxccyooPT18IT18Pnw8fD49fDw9KVxccyooXFxkKykvZztcbiAgICAgICAgLy8gZGVmaW5lZCgp44OB44Kn44OD44Kv44Gu5q2j6KaP6KGo54++XG4gICAgICAgIGNvbnN0IGRlZmluZWRDaGVjayA9IC9kZWZpbmVkXFxzKlxcKFxccyooXFx3KylcXHMqXFwpL2c7XG4gICAgICAgIC8vICFkZWZpbmVkKCnjg4Hjgqfjg4Pjgq/jga7mraPopo/ooajnj75cbiAgICAgICAgY29uc3Qgbm90RGVmaW5lZENoZWNrID0gLyFcXHMqZGVmaW5lZFxccypcXChcXHMqKFxcdyspXFxzKlxcKS9nO1xuXG4gICAgICAgIC8vIOadoeS7tuW8j+OCkuipleS+oeWPr+iDveOBquW9ouW8j+OBq+WkieaPm1xuICAgICAgICBsZXQgZXZhbHVhdGFibGVDb25kaXRpb24gPSBjb25kaXRpb247XG5cbiAgICAgICAgLy8gZGVmaW5lZCgp44Gu6KmV5L6hXG4gICAgICAgIGV2YWx1YXRhYmxlQ29uZGl0aW9uID0gZXZhbHVhdGFibGVDb25kaXRpb24ucmVwbGFjZShkZWZpbmVkQ2hlY2ssIChfLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZpbml0aW9ucy5oYXMobmFtZSkgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyAhZGVmaW5lZCgp44Gu6KmV5L6hXG4gICAgICAgIGV2YWx1YXRhYmxlQ29uZGl0aW9uID0gZXZhbHVhdGFibGVDb25kaXRpb24ucmVwbGFjZShub3REZWZpbmVkQ2hlY2ssIChfLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZpbml0aW9ucy5oYXMobmFtZSkgPyAnZmFsc2UnIDogJ3RydWUnO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDmlbDlgKTmr5TovIPjga7oqZXkvqFcbiAgICAgICAgZXZhbHVhdGFibGVDb25kaXRpb24gPSBldmFsdWF0YWJsZUNvbmRpdGlvbi5yZXBsYWNlKG51bWVyaWNDb21wYXJpc29uLCAobWF0Y2gsIHZhck5hbWUsIG9wZXJhdG9yLCB2YWx1ZVN0cikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVmaW5lZFZhbHVlID0gdGhpcy5kZWZpbml0aW9ucy5nZXQodmFyTmFtZSk7XG4gICAgICAgICAgICBpZiAoZGVmaW5lZFZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiAnZmFsc2UnO1xuXG4gICAgICAgICAgICBjb25zdCB2YWx1ZTEgPSBwYXJzZUludChkZWZpbmVkVmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUyID0gcGFyc2VJbnQodmFsdWVTdHIpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKG9wZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT0nOiByZXR1cm4gdmFsdWUxID09PSB2YWx1ZTIgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgICAgICAgICAgICAgIGNhc2UgJyE9JzogcmV0dXJuIHZhbHVlMSAhPT0gdmFsdWUyID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjYXNlICc+JzogcmV0dXJuIHZhbHVlMSA+IHZhbHVlMiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgY2FzZSAnPCc6IHJldHVybiB2YWx1ZTEgPCB2YWx1ZTIgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgICAgICAgICAgICAgIGNhc2UgJz49JzogcmV0dXJuIHZhbHVlMSA+PSB2YWx1ZTIgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgICAgICAgICAgICAgIGNhc2UgJzw9JzogcmV0dXJuIHZhbHVlMSA8PSB2YWx1ZTIgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiAnZmFsc2UnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDoq5bnkIbmvJTnrpflrZDjga7oqZXkvqFcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIOWuieWFqOOBquipleS+oeOBruOBn+OCgeOAgeadoeS7tuW8j+OCkuaknOiovFxuICAgICAgICAgICAgaWYgKCEvXlthLXpBLVowLTlcXHNcXChcXCkhJnxdKyQvLnRlc3QoZXZhbHVhdGFibGVDb25kaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbmRpdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDoq5bnkIbmvJTnrpflrZDjga7liY3lvozjgavjgrnjg5rjg7zjgrnjgpLov73liqBcbiAgICAgICAgICAgIGV2YWx1YXRhYmxlQ29uZGl0aW9uID0gZXZhbHVhdGFibGVDb25kaXRpb25cbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvJiYvZywgJyAmJiAnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHxcXHwvZywgJyB8fCAnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8hL2csICcgISAnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcgJylcbiAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICAvLyBKYXZhU2NyaXB044Gu6KuW55CG5byP44Go44GX44Gm6KmV5L6hXG4gICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24oYHJldHVybiAke2V2YWx1YXRhYmxlQ29uZGl0aW9ufWApKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBldmFsdWF0aW5nIGNvbmRpdGlvbjonLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHByb2Nlc3Moc3BsaXR0ZWRMaW5lczogc3RyaW5nW10sIHN0YXJ0TGluZVN0cj86IHN0cmluZywgZW5kTGluZVN0cj86IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3QgZGVmaW5lID0gLyNkZWZpbmVbXFx0IF0rKFxcdyspKD86W1xcdCBdKyhcXFMrKSk/LztcbiAgICAgICAgY29uc3QgaWZkZWYgPSAvI2lmZGVmW1xcdCBdKyhcXHcrKS87XG4gICAgICAgIGNvbnN0IGlmbmRlZiA9IC8jaWZuZGVmW1xcdCBdKyhcXHcrKS87XG4gICAgICAgIGNvbnN0IF9pZiA9IC8jaWZbXFx0IF0rKC4rKS87XG4gICAgICAgIGNvbnN0IGVsaWYgPSAvI2VsaWZbXFx0IF0rKC4rKS87XG4gICAgICAgIGNvbnN0IF9lbHNlID0gLyNlbHNlLztcbiAgICAgICAgY29uc3QgZW5kaWYgPSAvI2VuZGlmLztcbiAgICAgICAgY29uc3QgcHJldmlvdXNPdXRwdXRTdGF0ZXM6IGJvb2xlYW5bXSA9IFtdO1xuICAgICAgICBsZXQgb3V0cHV0RmxnID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgaWZkZWZzOiBzdHJpbmdbXVtdID0gW107XG4gICAgICAgIGNvbnN0IGlmZGVmTWF0Y2hlZDogYm9vbGVhbltdID0gW107XG4gICAgICAgIGNvbnN0IG91dHB1dExpbmVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIHRoaXMuZGVmaW5pdGlvbnMuY2xlYXIoKTtcblxuICAgICAgICBsZXQgc3RhcnRMaW5lID0gMDtcbiAgICAgICAgbGV0IGVuZExpbmUgPSBzcGxpdHRlZExpbmVzLmxlbmd0aDtcbiAgICAgICAgaWYgKHN0YXJ0TGluZVN0cikge1xuICAgICAgICAgICAgc3RhcnRMaW5lID0gc3BsaXR0ZWRMaW5lcy5maW5kSW5kZXgobGluZSA9PiBsaW5lLmluY2x1ZGVzKHN0YXJ0TGluZVN0cikpO1xuICAgICAgICAgICAgaWYgKHN0YXJ0TGluZSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzdGFydExpbmUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbmRMaW5lU3RyKSB7XG4gICAgICAgICAgICBlbmRMaW5lID0gc3BsaXR0ZWRMaW5lcy5maW5kSW5kZXgobGluZSA9PiBsaW5lLmluY2x1ZGVzKGVuZExpbmVTdHIpKTtcbiAgICAgICAgICAgIGlmIChlbmRMaW5lID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGVuZExpbmUgPSBzcGxpdHRlZExpbmVzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0TGluZTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gc3BsaXR0ZWRMaW5lc1tpXTtcbiAgICAgICAgICAgIG91dHB1dExpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0TGluZTsgaSA8IGVuZExpbmU7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHNwbGl0dGVkTGluZXNbaV07XG4gICAgICAgICAgICBsZXQgaXNQcmFnbWEgPSBmYWxzZTtcblxuICAgICAgICAgICAgeyAvLyAjZGVmaW5lXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBsaW5lLm1hdGNoKGRlZmluZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW18sIG5hbWUsIHZhbHVlID0gXCIxXCJdID0gcmU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5pdGlvbnMuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgaXNQcmFnbWEgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeyAvLyAjaWZkZWYsICNpZm5kZWYsICNpZlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlSWZkZWYgPSBsaW5lLm1hdGNoKGlmZGVmKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZUlmbmRlZiA9IGxpbmUubWF0Y2goaWZuZGVmKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZUlmID0gbGluZS5tYXRjaChfaWYpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlSWZkZWYgfHwgcmVJZm5kZWYgfHwgcmVJZikge1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c091dHB1dFN0YXRlcy5wdXNoKG91dHB1dEZsZyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb25kaXRpb24gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZUlmZGVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb24gPSBgZGVmaW5lZCgke3JlSWZkZWZbMV19KWA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVJZm5kZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbiA9IGAhZGVmaW5lZCgke3JlSWZuZGVmWzFdfSlgO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlSWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbiA9IHJlSWZbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZmRlZnMucHVzaChbY29uZGl0aW9uXSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAob3V0cHV0RmxnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSB0aGlzLmV2YWx1YXRlQ29uZGl0aW9uKGNvbmRpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZmRlZk1hdGNoZWQucHVzaChvdXRwdXRGbGcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWZkZWZNYXRjaGVkLnB1c2goZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2VsaWZcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IGxpbmUubWF0Y2goZWxpZik7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uZGl0aW9uID0gcmVbMV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJZmRlZnMgPSBpZmRlZnNbaWZkZWZzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzT3V0cHV0U3RhdGVzW3ByZXZpb3VzT3V0cHV0U3RhdGVzLmxlbmd0aCAtIDFdICYmICFpZmRlZk1hdGNoZWRbaWZkZWZNYXRjaGVkLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSB0aGlzLmV2YWx1YXRlQ29uZGl0aW9uKGNvbmRpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3V0cHV0RmxnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWZkZWZNYXRjaGVkW2lmZGVmTWF0Y2hlZC5sZW5ndGggLSAxXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SWZkZWZzLnB1c2goY29uZGl0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgaXNQcmFnbWEgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeyAvLyAjZWxzZVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlID0gbGluZS5tYXRjaChfZWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzT3V0cHV0U3RhdGVzW3ByZXZpb3VzT3V0cHV0U3RhdGVzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSAhaWZkZWZNYXRjaGVkW2lmZGVmTWF0Y2hlZC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dEZsZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2VuZGlmXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBsaW5lLm1hdGNoKGVuZGlmKTtcbiAgICAgICAgICAgICAgICBpZiAocmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSBwcmV2aW91c091dHB1dFN0YXRlc1twcmV2aW91c091dHB1dFN0YXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaXNQcmFnbWEgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZmRlZnMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmZGVmTWF0Y2hlZC5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNPdXRwdXRTdGF0ZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3V0cHV0RmxnICYmICFpc1ByYWdtYSkge1xuICAgICAgICAgICAgICAgIG91dHB1dExpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IGVuZExpbmU7IGkgPCBzcGxpdHRlZExpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gc3BsaXR0ZWRMaW5lc1tpXTtcbiAgICAgICAgICAgIG91dHB1dExpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dExpbmVzO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHtcblx0QXR0cmlidXRlU2VtYW50aWNzLFxuXHRSZWZsZWN0aW9uQXR0cmlidXRlLFxuXHRSZWZsZWN0aW9uVW5pZm9ybSxcblx0UmVmbGVjdGlvblZhcnlpbmcsXG5cdFNoYWRlclN0YWdlU3RyLFxuXHRVbmlmb3JtU2VtYW50aWNzLFxuXHRWYXJUeXBlLFxufSBmcm9tICcuLi90eXBlcy90eXBlJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGdldHMgdGhlIGF0dHJpYnV0ZSwgdmFyeWluZywgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24gZnJvbSB0aGUgY29kZSBwcm9wZXJ0eSBvZiBhIHNoYWRlcml0eSBvYmplY3QuXG4gKiBUaGUgbWV0aG9kcyBvZiB0aGUgU2hhZGVyaXR5IGluc3RhbmNlIGNyZWF0ZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzLlxuICpcbiAqIEJlZm9yZSBnZXR0aW5nIHRoZSBpbmZvcm1hdGlvbiBvZiB0aGUgYXR0cmlidXRlLCB2YXJ5aW5nLCBhbmQgdW5pZm9ybSwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVmbGVjdGlvbiB7XG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGF0dHJpYnV0ZUFuZFZhcnlpbmdUeXBlUmVnRXhwXG5cdFx0PSAvW1xcdCBdKyhmbG9hdHxpbnR8dmVjMnx2ZWMzfHZlYzR8bWF0MnxtYXQzfG1hdDR8aXZlYzJ8aXZlYzN8aXZlYzQpW1xcdCBdKyhcXHcrKTsvO1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSB1bmlmb3JtVHlwZVJlZ0V4cFxuXHRcdD0gL1tcXHQgXSsoZmxvYXR8aW50fHZlYzJ8dmVjM3x2ZWM0fG1hdDJ8bWF0M3xtYXQ0fGl2ZWMyfGl2ZWMzfGl2ZWM0fHNhbXBsZXIyRHxzYW1wbGVyQ3ViZXxzYW1wbGVyM0QpW1xcdCBdKyhcXHcrKTsvO1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBzZW1hbnRpY1JlZ0V4cCA9IC88LipzZW1hbnRpY1tcXHQgXSo9W1xcdCBdKihcXHcrKS4qPi87XG5cblx0cHJpdmF0ZSBfX2F0dHJpYnV0ZVNlbWFudGljc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdHByaXZhdGUgX191bmlmb3JtU2VtYW50aWNzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblx0cHJpdmF0ZSBfX2F0dHJpYnV0ZXM6IFJlZmxlY3Rpb25BdHRyaWJ1dGVbXSA9IFtdO1xuXHRwcml2YXRlIF9fdmFyeWluZ3M6IFJlZmxlY3Rpb25WYXJ5aW5nW10gPSBbXTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1zOiBSZWZsZWN0aW9uVW5pZm9ybVtdID0gW107XG5cblx0cHJpdmF0ZSByZWFkb25seSBfX3NwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW107XG5cdHByaXZhdGUgcmVhZG9ubHkgX19zaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHI7XG5cblx0Y29uc3RydWN0b3Ioc3BsaXR0ZWRTaGFkZXJpdHlTaGFkZXJDb2RlOiBzdHJpbmdbXSwgc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0dGhpcy5fX3NwbGl0dGVkU2hhZGVyQ29kZSA9IHNwbGl0dGVkU2hhZGVyaXR5U2hhZGVyQ29kZTtcblx0XHR0aGlzLl9fc2hhZGVyU3RhZ2UgPSBzaGFkZXJTdGFnZTtcblx0XHR0aGlzLl9fc2V0RGVmYXVsdEF0dHJpYnV0ZUFuZFVuaWZvcm1TZW1hbnRpY3NNYXAoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFsbCBhdHRyaWJ1dGUgdmFyaWFibGUgaW5mb3JtYXRpb24gaW4gdGhlIHNoYWRlciBjb2RlLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgUmVmbGVjdGlvbkF0dHJpYnV0ZSBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgYXR0cmlidXRlcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXM7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhbGwgdmFyeWluZyB2YXJpYWJsZSBpbmZvcm1hdGlvbiBpbiB0aGUgc2hhZGVyIGNvZGUuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBSZWZsZWN0aW9uVmFyeWluZyBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgdmFyeWluZ3MoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX192YXJ5aW5ncztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFsbCB1bmlmb3JtIHZhcmlhYmxlIGluZm9ybWF0aW9uIGluIHRoZSBzaGFkZXIgY29kZS5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIFJlZmxlY3Rpb25Vbmlmb3JtIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCB1bmlmb3JtcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX3VuaWZvcm1zO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgbmFtZXMgb2YgYWxsIGF0dHJpYnV0ZXMgaW5jbHVkZWQgaW4gdGhlIHNoYWRlci5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIHN0cmluZ1xuXHQgKi9cblx0cHVibGljIGdldCBhdHRyaWJ1dGVzTmFtZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7cmV0dXJuIGF0dHJpYnV0ZS5uYW1lfSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBhdHRyaWJ1dGUgc2VtYW50aWMgKGUuZy4gJ1BPU0lUSU9OJykgb2YgYWxsIGF0dHJpYnV0ZXMgaW5jbHVkZWQgaW4gdGhlIHNoYWRlci5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIEF0dHJpYnV0ZVNlbWFudGljcyBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgYXR0cmlidXRlc1NlbWFudGljcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtyZXR1cm4gYXR0cmlidXRlLnNlbWFudGljfSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSB2YXJpYWJsZSB0eXBlIChlLmcuICd2ZWM0Jykgb2YgYWxsIGF0dHJpYnV0ZXMgaW5jbHVkZWQgaW4gdGhlIHNoYWRlci5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIFZhclR5cGUgb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGF0dHJpYnV0ZXNUeXBlcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtyZXR1cm4gYXR0cmlidXRlLnR5cGV9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYW4gYXR0cmlidXRlU2VtYW50aWNzLlxuXHQgKiBUaGUgYXR0cmlidXRlU2VtYW50aWNzIGlzIHVzZWQgaW4gdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWNzXG5cdCAqIChTZWUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBjbGFzcylcblx0ICovXG5cdHB1YmxpYyBhZGRBdHRyaWJ1dGVTZW1hbnRpY3NNYXAobWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+KSB7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcCA9IG5ldyBNYXAoWy4uLnRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAsIC4uLm1hcF0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhIHVuaWZvcm1TZW1hbnRpY3MuXG5cdCAqIFRoZSBhdHRyaWJ1dGVTZW1hbnRpY3MgaXMgdXNlZCBpbiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpY3Ncblx0ICogKFNlZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGNsYXNzKVxuXHQgKi9cblx0cHVibGljIGFkZFVuaWZvcm1TZW1hbnRpY3NNYXAobWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+KSB7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAgPSBuZXcgTWFwKFsuLi50aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcCwgLi4ubWFwXSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGFuIGF0dHJpYnV0ZVNlbWFudGljcy5cblx0ICogVGhlIGF0dHJpYnV0ZVNlbWFudGljcyBpcyB1c2VkIGluIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljc1xuXHQgKiAoU2VlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgY2xhc3MpXG5cdCAqL1xuXHRwdWJsaWMgYWRkQXR0cmlidXRlU2VtYW50aWNzKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoa2V5LCB2YWx1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGEgdW5pZm9ybVNlbWFudGljcy5cblx0ICogVGhlIGF0dHJpYnV0ZVNlbWFudGljcyBpcyB1c2VkIGluIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljc1xuXHQgKiAoU2VlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgY2xhc3MpXG5cdCAqL1xuXHRwdWJsaWMgYWRkVW5pZm9ybVNlbWFudGljcyhrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldChrZXksIHZhbHVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIGF0dHJpYnV0ZVNlbWFudGljc1xuXHQgKi9cblx0cHVibGljIHJlc2V0QXR0cmlidXRlU2VtYW50aWNzKCkge1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdW5pZm9ybVNlbWFudGljc1xuXHQgKi9cblx0cHVibGljIHJlc2V0VW5pZm9ybVNlbWFudGljcygpIHtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdH1cblxuXHQvKipcblx0ICogQW5hbHl6ZSBzaGFkZXIgY29kZSBvZiB0aGUgc2hhZGVyaXR5IGFuZCBnZXQgaW5mb3JtYXRpb24gb2YgYXR0cmlidXRlLCB2YXJ5aW5nIGFuZCB1bmlmb3JtLlxuXHQgKiBUaGUgaW5mb3JtYXRpb24gY2FuIGJlIHJldHJpZXZlZCBmcm9tIHRoZSBnZXQgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqXG5cdCAqIFRoZSBzZW1hbnRpYyBwcm9wZXJ0eSBvZiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZSBpcyBhc3NpZ25lZCB0byB0aGUgdmFsdWUgb2YgdGhlIHNlbWFudGljIGlmXG5cdCAqIGl0IGlzIHNwZWNpZmllZCBpbiB0aGUgYXR0cmlidXRlIGxpbmUgb2YgdGhlIHNoYWRlciBjb2RlLiBJZiBub3QsIHRoZSBBdHRyaWJ1dGVTZW1hbnRpY3NNYXBcblx0ICogaXMgc2VhcmNoZWQgZm9yIG1hdGNoaW5nIHNlbWFudGljcywgb3IgVU5LTk9XTi4gVGhlIHNhbWUgYXBwbGllcyB0byB0aGUgc2VtYW50aWMgcHJvcGVydHkgb2Zcblx0ICogUmVmbGVjdGlvblVuaWZvcm0uXG5cdCAqL1xuXHRwdWJsaWMgcmVmbGVjdCgpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSB0aGlzLl9fc3BsaXR0ZWRTaGFkZXJDb2RlO1xuXHRcdGNvbnN0IHNoYWRlclN0YWdlID0gdGhpcy5fX3NoYWRlclN0YWdlO1xuXG5cdFx0Zm9yIChjb25zdCBzaGFkZXJDb2RlTGluZSBvZiBzcGxpdHRlZFNoYWRlckNvZGUpIHtcblx0XHRcdGNvbnN0IGlzQXR0cmlidXRlTGluZSA9IHRoaXMuX19tYXRjaEF0dHJpYnV0ZShzaGFkZXJDb2RlTGluZSwgc2hhZGVyU3RhZ2UpO1xuXHRcdFx0aWYgKGlzQXR0cmlidXRlTGluZSkge1xuXHRcdFx0XHR0aGlzLl9fYWRkQXR0cmlidXRlKHNoYWRlckNvZGVMaW5lKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzVmFyeWluZ0xpbmUgPSB0aGlzLl9fbWF0Y2hWYXJ5aW5nKHNoYWRlckNvZGVMaW5lLCBzaGFkZXJTdGFnZSk7XG5cdFx0XHRpZiAoaXNWYXJ5aW5nTGluZSkge1xuXHRcdFx0XHR0aGlzLl9fYWRkVmFyeWluZyhzaGFkZXJDb2RlTGluZSwgc2hhZGVyU3RhZ2UpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaXNVbmlmb3JtTGluZSA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKnVuaWZvcm1bXFx0IF0rLyk7XG5cdFx0XHRpZiAoaXNVbmlmb3JtTGluZSkge1xuXHRcdFx0XHR0aGlzLl9fYWRkVW5pZm9ybShzaGFkZXJDb2RlTGluZSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX19zZXREZWZhdWx0QXR0cmlidXRlQW5kVW5pZm9ybVNlbWFudGljc01hcCgpIHtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgncG9zaXRpb24nLCAnUE9TSVRJT04nKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnY29sb3IkJywgJ0NPTE9SXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnY29sb3JfPzAnLCAnQ09MT1JfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0ZXhjb29yZCQnLCAnVEVYQ09PUkRfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0ZXhjb29yZF8/MCcsICdURVhDT09SRF8wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RleGNvb3JkXz8xJywgJ1RFWENPT1JEXzEnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGV4Y29vcmRfPzInLCAnVEVYQ09PUkRfMicpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdub3JtYWwnLCAnTk9STUFMJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RhbmdlbnQnLCAnVEFOR0VOVCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdqb2ludCQnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnYm9uZSQnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnam9pbnRfPzAnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnYm9uZV8/MCcsICdKT0lOVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd3ZWlnaHQkJywgJ1dFSUdIVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd3ZWlnaHRfPzAnLCAnV0VJR0hUU18wJyk7XG5cblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ3dvcmxkbWF0cml4JywgJ1dvcmxkTWF0cml4Jyk7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCdub3JtYWxtYXRyaXgnLCAnTm9ybWFsTWF0cml4Jyk7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCd2aWV3bWF0cml4JywgJ1ZpZXdNYXRyaXgnKTtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ3Byb2plY3Rpb25tYXRyaXgnLCAnUHJvamVjdGlvbk1hdHJpeCcpO1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgnbW9kZWx2aWV3bWF0cml4JywgJ01vZGVsVmlld01hdHJpeCcpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX21hdGNoQXR0cmlidXRlKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcsIHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdGlmIChzaGFkZXJTdGFnZSAhPT0gJ3ZlcnRleCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKihhdHRyaWJ1dGV8aW4pW1xcdCBdKy4rOy8pO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2FkZEF0dHJpYnV0ZShzaGFkZXJDb2RlTGluZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgcmVmbGVjdGlvbkF0dHJpYnV0ZTogUmVmbGVjdGlvbkF0dHJpYnV0ZSA9IHtcblx0XHRcdG5hbWU6ICcnLFxuXHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdHNlbWFudGljOiAnVU5LTk9XTidcblx0XHR9O1xuXG5cdFx0Y29uc3QgbWF0Y2hUeXBlID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi5hdHRyaWJ1dGVBbmRWYXJ5aW5nVHlwZVJlZ0V4cCk7XG5cdFx0aWYgKG1hdGNoVHlwZSkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IG1hdGNoVHlwZVsxXTtcblx0XHRcdHJlZmxlY3Rpb25BdHRyaWJ1dGUudHlwZSA9IHR5cGUgYXMgVmFyVHlwZTtcblx0XHRcdGNvbnN0IG5hbWUgPSBtYXRjaFR5cGVbMl07XG5cdFx0XHRyZWZsZWN0aW9uQXR0cmlidXRlLm5hbWUgPSBuYW1lO1xuXG5cdFx0XHRjb25zdCBtYXRjaFNlbWFudGljID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi5zZW1hbnRpY1JlZ0V4cClcblx0XHRcdGlmIChtYXRjaFNlbWFudGljKSB7XG5cdFx0XHRcdHJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWMgPSBtYXRjaFNlbWFudGljWzFdIGFzIEF0dHJpYnV0ZVNlbWFudGljcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiB0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwKSB7XG5cdFx0XHRcdFx0aWYgKG5hbWUubWF0Y2gobmV3IFJlZ0V4cChrZXksICdpJykpKSB7XG5cdFx0XHRcdFx0XHRyZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljID0gdmFsdWUgYXMgQXR0cmlidXRlU2VtYW50aWNzO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLl9fYXR0cmlidXRlcy5wdXNoKHJlZmxlY3Rpb25BdHRyaWJ1dGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX21hdGNoVmFyeWluZyhzaGFkZXJDb2RlTGluZTogc3RyaW5nLCBzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHRpZiAoc2hhZGVyU3RhZ2UgPT09ICd2ZXJ0ZXgnKSB7XG5cdFx0XHRyZXR1cm4gc2hhZGVyQ29kZUxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qKHZhcnlpbmd8b3V0KVtcXHQgXSsuKzsvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKih2YXJ5aW5nfGluKVtcXHQgXSsuKzsvKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9fYWRkVmFyeWluZyhzaGFkZXJDb2RlTGluZTogc3RyaW5nLCBzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHRjb25zdCByZWZsZWN0aW9uVmFyeWluZzogUmVmbGVjdGlvblZhcnlpbmcgPSB7XG5cdFx0XHRuYW1lOiAnJyxcblx0XHRcdHR5cGU6ICdmbG9hdCcsXG5cdFx0XHRpbm91dDogJ2luJ1xuXHRcdH07XG5cblx0XHRjb25zdCBtYXRjaFR5cGUgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLmF0dHJpYnV0ZUFuZFZhcnlpbmdUeXBlUmVnRXhwKTtcblx0XHRpZiAobWF0Y2hUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gbWF0Y2hUeXBlWzFdO1xuXHRcdFx0cmVmbGVjdGlvblZhcnlpbmcudHlwZSA9IHR5cGUgYXMgVmFyVHlwZTtcblx0XHRcdGNvbnN0IG5hbWUgPSBtYXRjaFR5cGVbMl07XG5cdFx0XHRyZWZsZWN0aW9uVmFyeWluZy5uYW1lID0gbmFtZTtcblx0XHRcdHJlZmxlY3Rpb25WYXJ5aW5nLmlub3V0ID0gKHNoYWRlclN0YWdlID09PSAndmVydGV4JykgPyAnb3V0JyA6ICdpbic7XG5cdFx0fVxuXHRcdHRoaXMuX192YXJ5aW5ncy5wdXNoKHJlZmxlY3Rpb25WYXJ5aW5nKTtcblx0fVxuXG5cdHByaXZhdGUgX19hZGRVbmlmb3JtKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcpIHtcblx0XHRjb25zdCByZWZsZWN0aW9uVW5pZm9ybTogUmVmbGVjdGlvblVuaWZvcm0gPSB7XG5cdFx0XHRuYW1lOiAnJyxcblx0XHRcdHR5cGU6ICdmbG9hdCcsXG5cdFx0XHRzZW1hbnRpYzogJ1VOS05PV04nXG5cdFx0fTtcblxuXHRcdGNvbnN0IG1hdGNoVHlwZSA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24udW5pZm9ybVR5cGVSZWdFeHApO1xuXHRcdGlmIChtYXRjaFR5cGUpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBtYXRjaFR5cGVbMV07XG5cdFx0XHRyZWZsZWN0aW9uVW5pZm9ybS50eXBlID0gdHlwZSBhcyBWYXJUeXBlO1xuXHRcdFx0Y29uc3QgbmFtZSA9IG1hdGNoVHlwZVsyXTtcblx0XHRcdHJlZmxlY3Rpb25Vbmlmb3JtLm5hbWUgPSBuYW1lO1xuXG5cdFx0XHRjb25zdCBtYXRjaFNlbWFudGljcyA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24uc2VtYW50aWNSZWdFeHApXG5cdFx0XHRpZiAobWF0Y2hTZW1hbnRpY3MpIHtcblx0XHRcdFx0cmVmbGVjdGlvblVuaWZvcm0uc2VtYW50aWMgPSBtYXRjaFNlbWFudGljc1sxXSBhcyBVbmlmb3JtU2VtYW50aWNzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwKSB7XG5cdFx0XHRcdFx0aWYgKG5hbWUubWF0Y2gobmV3IFJlZ0V4cChrZXksICdpJykpKSB7XG5cdFx0XHRcdFx0XHRyZWZsZWN0aW9uVW5pZm9ybS5zZW1hbnRpYyA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLl9fdW5pZm9ybXMucHVzaChyZWZsZWN0aW9uVW5pZm9ybSk7XG5cdH1cbn07IiwiaW1wb3J0IHtUZW1wbGF0ZU9iamVjdH0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBlZGl0cyB0aGUgY29kZSBwcm9wZXJ0eSBvZiBhIHNoYWRlcml0eSBvYmplY3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYWRlckVkaXRvciB7XG5cdHN0YXRpYyBfaW5zZXJ0RGVmaW5pdGlvbihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBkZWZpbml0aW9uOiBzdHJpbmcpIHtcblx0XHRjb25zdCBkZWZTdHIgPSBkZWZpbml0aW9uLnJlcGxhY2UoLyNkZWZpbmVbXFx0IF0rLywgJycpO1xuXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnVuc2hpZnQoYCNkZWZpbmUgJHtkZWZTdHJ9YCk7XG5cdH1cblxuXHRzdGF0aWMgX2ZpbGxUZW1wbGF0ZShzaGFkZXJDb2RlOiBzdHJpbmcsIHRlbXBsYXRlT2JqZWN0OiBUZW1wbGF0ZU9iamVjdCkge1xuXHRcdGNvbnN0IHRlbXBsYXRlU3RyaW5nID0gc2hhZGVyQ29kZS5yZXBsYWNlKC9cXC9cXCpbXFx0IF0qc2hhZGVyaXR5OltcXHQgXSooQHtbXFx0IF0qKShcXFMrKShbXFx0IF0qfSlbXFx0IF0qXFwqXFwvL2csICcke3RoaXMuJDJ9Jyk7XG5cblx0XHRjb25zdCByZXN1bHRDb2RlID0gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIGBcIiArIHRlbXBsYXRlU3RyaW5nICsgXCJgO1wiKS5jYWxsKHRlbXBsYXRlT2JqZWN0KTtcblx0XHRyZXR1cm4gcmVzdWx0Q29kZTtcblx0fVxufSIsImltcG9ydCB7U2hhZGVyVmVyc2lvbn0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBjb252ZXJ0cyB0aGUgY29kZSBwcm9wZXJ0eSBvZiBhIHNoYWRlcml0eSBvYmplY3QgdG8gdGhlIHNwZWNpZmllZCBmb3JtYXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYWRlclRyYW5zZm9ybWVyIHtcblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMzIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGVcblx0ICovXG5cdHN0YXRpYyBfdHJhbnNmb3JtVG9HTFNMRVMxKFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0aXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbixcblx0XHRlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuXG5cdCkge1xuXHRcdHRoaXMuX19jb252ZXJ0T3JJbnNlcnRWZXJzaW9uR0xTTEVTMShzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19yZW1vdmVFUzNRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR0aGlzLl9fY29udmVydEluKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0dGhpcy5fX2NvbnZlcnRPdXQoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR0aGlzLl9fcmVtb3ZlUHJlY2lzaW9uRm9yRVMzKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlRnVuY3Rpb25Ub0VTMShzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlID0gc3BsaXR0ZWRTaGFkZXJDb2RlO1xuXG5cdFx0cmV0dXJuIHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMxIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzMgc2hhZGVyIGNvZGVcblx0ICovXG5cdHN0YXRpYyBfdHJhbnNmb3JtVG9HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9fY29udmVydE9ySW5zZXJ0VmVyc2lvbkdMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydEF0dHJpYnV0ZShzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdHRoaXMuX19jb252ZXJ0VmFyeWluZyhzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZUN1YmUoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmUyRChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZTJEUHJvZChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZTNEKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlM0RQcm9kKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUgPSBzcGxpdHRlZFNoYWRlckNvZGU7XG5cblx0XHRyZXR1cm4gdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBzaGFkZXIgY29kZSB0byBhIHNoYWRlciBjb2RlIG9mIHNwZWNpZmllZCBHTFNMIHZlcnNpb25cblx0ICovXG5cdHN0YXRpYyBfdHJhbnNmb3JtVG8oXG5cdFx0dmVyc2lvbjogU2hhZGVyVmVyc2lvbixcblx0XHRzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLFxuXHRcdGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4sXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHRpZiAodmVyc2lvbi5tYXRjaCgvd2ViZ2wyfGVzMy9pKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RyYW5zZm9ybVRvR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdH0gZWxzZSBpZiAodmVyc2lvbi5tYXRjaCgvd2ViZ2wxfGVzMS9pKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RyYW5zZm9ybVRvR0xTTEVTMShzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdJbnZhbGlkIFZlcnNpb24nKVxuXHRcdFx0cmV0dXJuIHNwbGl0dGVkU2hhZGVyQ29kZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogSWYgdGhlIGZpcnN0IGxpbmUgY29udGFpbnMgdmVyc2lvbiBpbmZvcm1hdGlvbiwgb3ZlcndyaXRlIHRoZSBmaXJzdCBsaW5lIHdpdGggJyN2ZXJzaW9uIDEwMCcuXG5cdCAqIElmIG5vdCwgYWRkICcjdmVyc2lvbiAxMDAnIHRvIHRoZSBmaXJzdCBsaW5lLlxuXHQgKlxuXHQgKiBOb3RlOiBJZiB0aGUgZmlyc3QgbGluZSBpcyBjb21tZW50ZWQgb3V0IGFuZCB0aGUgdmVyc2lvbiBpbmZvcm1hdGlvbiBpcyB3cml0dGVuIGluIHRoZSBzZWNvbmQgb3IgbGF0ZXIgbGluZSxcblx0ICogdGhlIGFwcHJvcHJpYXRlIHZlcnNpb24gaW5mb3JtYXRpb24gd2lsbCBiZSBhZGRlZCB0byB0aGUgZmlyc3QgbGluZSBhbmQgdGhlIHVzZXItZGVmaW5lZCB2ZXJzaW9uIGluZm9ybWF0aW9uXG5cdCAqIGluIHRoZSBzZWNvbmQgb3IgbGF0ZXIgbGluZSB3aWxsIGJlIHJlbW92ZWQuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRPckluc2VydFZlcnNpb25HTFNMRVMxKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSojW1xcdCBdKnZlcnNpb25bXFx0IF0rLiovO1xuXHRcdHRoaXMuX19yZW1vdmVGaXJzdE1hdGNoaW5nTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZyk7XG5cblx0XHRzcGxpdHRlZFNoYWRlckNvZGUudW5zaGlmdCgnI3ZlcnNpb24gMTAwJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogSWYgdGhlIGZpcnN0IGxpbmUgY29udGFpbnMgdmVyc2lvbiBpbmZvcm1hdGlvbiwgb3ZlcndyaXRlIHRoZSBmaXJzdCBsaW5lIHdpdGggJyN2ZXJzaW9uIDMwMCBlcycuXG5cdCAqIElmIG5vdCwgYWRkICcjdmVyc2lvbiAzMDAgZXMnIHRvIHRoZSBmaXJzdCBsaW5lLlxuXHQgKiBJbiBib3RoIGNhc2VzLCAnI2RlZmluZSBHTFNMX0VTMycgd2lsbCBiZSBpbnNlcnRlZCBpbiB0aGUgc2Vjb25kIGxpbmUuXG5cdCAqIFVzZSB0aGUgJyNkZWZpbmUgR0xTTF9FUzMnIGRpcmVjdGl2ZSBpZiB5b3Ugd2FudCB0byB3cml0ZSBhIHNoYWRlciBjb2RlIHRoYXQgd2lsbCBvbmx5IHJ1biBpbiB0aGUgY2FzZSBvZiB3ZWJnbDIuXG5cdCAqXG5cdCAqIE5vdGU6IElmIHRoZSBmaXJzdCBsaW5lIGlzIGNvbW1lbnRlZCBvdXQgYW5kIHRoZSB2ZXJzaW9uIGluZm9ybWF0aW9uIGlzIHdyaXR0ZW4gaW4gdGhlIHNlY29uZCBvciBsYXRlciBsaW5lLFxuXHQgKiB0aGUgYXBwcm9wcmlhdGUgdmVyc2lvbiBpbmZvcm1hdGlvbiB3aWxsIGJlIGFkZGVkIHRvIHRoZSBmaXJzdCBsaW5lIGFuZCB0aGUgdXNlci1kZWZpbmVkIHZlcnNpb24gaW5mb3JtYXRpb25cblx0ICogaW4gdGhlIHNlY29uZCBvciBsYXRlciBsaW5lIHdpbGwgYmUgcmVtb3ZlZC5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydE9ySW5zZXJ0VmVyc2lvbkdMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKiNbXFx0IF0qdmVyc2lvbltcXHQgXSsuKi87XG5cdFx0dGhpcy5fX3JlbW92ZUZpcnN0TWF0Y2hpbmdMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnKTtcblxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZS51bnNoaWZ0KCcjZGVmaW5lIEdMU0xfRVMzJyk7XG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnVuc2hpZnQoJyN2ZXJzaW9uIDMwMCBlcycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICdpbicgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMSBxdWFsaWZpZXIoJ2F0dHJpYnV0ZScgb3IgJ3ZhcnlpbmcnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0SW4oc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKmluW1xcdCBdKygoaGlnaHB8bWVkaXVtcHxsb3dwfClbXFx0IF0qXFx3K1tcXHQgXSpcXHcrW1xcdCBdKjspLztcblxuXHRcdGxldCByZXBsYWNlRnVuYztcblx0XHRpZiAoaXNGcmFnbWVudFNoYWRlcikge1xuXHRcdFx0cmVwbGFjZUZ1bmMgPSBmdW5jdGlvbiAobWF0Y2g6IHN0cmluZywgcDE6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gJ3ZhcnlpbmcgJyArIHAxO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXBsYWNlRnVuYyA9IGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiAnYXR0cmlidXRlICcgKyBwMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsIHJlcGxhY2VGdW5jKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcIm91dFwiIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIG1vZGlmeSB0aGUgc2hhZGVyIGNvZGUuXG5cdCAqIElmIHRoZSBzaGFkZXIgc3RhZ2UgaXMgdmVydGV4LCB0aGUgXCJvdXRcIiBxdWFsaWZpZXJzIHdpbGwgYmUgcmVwbGFjZWQgYnkgXCJ2YXJ5aW5nXCIgcXVhbGlmaWVyLlxuXHQgKiBJZiB0aGUgc2hhZGVyIHN0YWdlIGlzIGZyYWdtZW50IGFuZCB0aGUgc2hhZGVyIGhhcyBcIm91dFwiIHF1YWxpZmllcnMsIHRoZSBcIm91dFwiIHF1YWxpZmllcnMgd2lsbFxuXHQgKiBiZSBkZWxldGVkIGFuZCB0aGUgdmFyaWFibGUgaXMgdXNlZCB0byBhc3NpZ24gYSB2YWx1ZSB0byBnbF9GcmFnQ29sb3IuXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRPdXQoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbiwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGlmIChpc0ZyYWdtZW50U2hhZGVyKSB7XG5cdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSB0aGlzLl9fcmVtb3ZlT3V0UXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRpZiAodmFyaWFibGVOYW1lID09IG51bGwpIHtcblx0XHRcdFx0Ly8gbm8gb3V0IHF1YWxpZmllclxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX19hZGRHTEZyYWdDb2xvcih2YXJpYWJsZU5hbWUsIHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKm91dFtcXHQgXSsoKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKlxcdytbXFx0IF0qXFx3K1tcXHQgXSo7KS87XG5cdFx0XHRjb25zdCByZXBsYWNlRnVuYyA9IGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiAndmFyeWluZyAnICsgcDE7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsIHJlcGxhY2VGdW5jKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVGhpcyBtZXRob2QgaXMgYSBwYXJ0IG9mIF9fY29udmVydE91dCBtZXRob2QuXG5cdCAqIFRoaXMgbWV0aG9kIGRlbGV0ZXMgdGhlIFwib3V0XCIgcXVhbGlmaWVycyBhbmQgYWRkcyB0aGUgbGluZSBmb3IgYXNzaWduaW5nIHRvIGdsX0ZyYWdDb2xvci5cblx0ICogSWYgdGhlIHNoYWRlciBkb2VzIG5vdCBoYXZlIHRoZSBcIm91dFwiIHF1YWxpZmllcnMsIHRoaXMgbWV0aG9kIGRvZXMgbm90aGluZy5cblx0ICovXG5cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVPdXRRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKm91dFtcXHQgXSsoKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKlxcdytbXFx0IF0qKFxcdyspW1xcdCBdKjspLztcblxuXHRcdGxldCB2YXJpYWJsZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgbWF0Y2ggPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ubWF0Y2gocmVnKTtcblx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBtYXRjaFsxXTtcblx0XHRcdFx0dmFyaWFibGVOYW1lID0gbWF0Y2hbM107XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB2YXJpYWJsZU5hbWU7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX2FkZEdMRnJhZ0NvbG9yKHZhcmlhYmxlTmFtZTogc3RyaW5nLCBzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgY2xvc2VCcmFja2V0UmVnID0gLyguKilcXH1bXFxuXFx0IF0qJC87XG5cdFx0Y29uc3QgcmV0dXJuUmVnID0gL1tcXG5cXHQgXSpyZXR1cm5bXFxuXFx0IF0qOy87XG5cdFx0Y29uc3QgbWFpbkZ1bmNTdGFydFJlZyA9IC8oXnxeKD8hW1xcL10pW1xcdFxcbiBdKyl2b2lkW1xcdFxcbiBdK21haW4oW1xcdFxcbiBdfFxcKHwkKS87XG5cdFx0Y29uc3QgZnJhZ0NvbG9yQ29kZSA9IGAgIGdsX0ZyYWdDb2xvciA9ICR7dmFyaWFibGVOYW1lfTtgO1xuXG5cdFx0bGV0IHNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSA9IGZhbHNlO1xuXHRcdGZvciAobGV0IGkgPSBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cdFx0XHRpZiAoIXNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSAmJiBsaW5lLm1hdGNoKGNsb3NlQnJhY2tldFJlZykpIHtcblx0XHRcdFx0Ly8gYWRkIGdsX0ZyYWdDb2xvciB0byBsYXN0IGxpbmUgb2YgbWFpbiBmdW5jdGlvblxuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBsaW5lLnJlcGxhY2UoY2xvc2VCcmFja2V0UmVnLCBgJDFcXG4ke2ZyYWdDb2xvckNvZGV9XFxufVxcbmApO1xuXHRcdFx0XHRzZXRHbEZyYWdDb2xvckluTGFzdExpbmUgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobGluZS5tYXRjaChyZXR1cm5SZWcpKSB7XG5cdFx0XHRcdC8vIGFkZCBnbF9GcmFnQ29sb3IganVzdCBiZWZvcmUgcmV0dXJuXG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZS5zcGxpY2UoaSwgMCwgZnJhZ0NvbG9yQ29kZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChsaW5lLm1hdGNoKG1haW5GdW5jU3RhcnRSZWcpKSB7XG5cdFx0XHRcdC8vIGFkZCBnbF9GcmFnQ29sb3Igb25seSBpbiB0aGUgbWFpbiBmdW5jdGlvblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSkge1xuXHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fcmVtb3ZlT3V0UXVhbGlmaWVyOiBOb3QgZm91bmQgdGhlIGNsb3NpbmcgYnJhY2tldHMgZm9yIHRoZSBtYWluIGZ1bmN0aW9uJztcblx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGgsIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIHF1YWxpZmllciBmb3IgZXMzIG9ubHkgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXRcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlRVMzUXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9fcmVtb3ZlVmFyeWluZ1F1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdHRoaXMuX19yZW1vdmVMYXlvdXQoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcImZsYXRcIiBhbmQgXCJzbW9vdGhcIiBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXRcblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlVmFyeWluZ1F1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qKGZsYXR8c21vb3RoKVtcXHQgXSooKGlufG91dClbXFx0IF0rLiopLztcblx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19yZW1vdmVWYXJ5aW5nUXVhbGlmaWVyOiBnbHNsIGVzMSBkb2VzIG5vdCBzdXBwb3J0IGZsYXQgcXVhbGlmaWVyJztcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ucmVwbGFjZShyZWcsIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nLCBwMjogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGlmIChwMSA9PT0gJ2ZsYXQnKSB7XG5cdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSArIDEsIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwMjtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcImxheW91dFwiIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlbW92ZSBpdFxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVMYXlvdXQoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKmxheW91dFtcXHQgXSpcXChbXFx0IF0qbG9jYXRpb25bXFx0IF0qXFw9W1xcdCBdKlxcZFtcXHQgXSpcXClbXFx0IF0rL2c7XG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJwcmVjaXNpb25cIiBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXQgaWYgdGhlIFwicHJlY2lzaW9uXCIgcXVhbGlmaWVyIGlzIHZhbGlkIGZvciBvbmx5IEdMU0wgRVMzXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZVByZWNpc2lvbkZvckVTMyhzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qcHJlY2lzaW9uW1xcdCBdKyhoaWdocHxtZWRpdW1wfGxvd3ApW1xcdCBdKyhcXHcrKVtcXHQgXSo7LztcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBtYXRjaCA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5tYXRjaChyZWcpO1xuXHRcdFx0aWYgKG1hdGNoICE9IG51bGwpIHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSAnaW50JyB8fFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSAnZmxvYXQnIHx8XG5cdFx0XHRcdFx0bWF0Y2hbMl0gPT09ICdzYW1wbGVyMkQnIHx8XG5cdFx0XHRcdFx0bWF0Y2hbMl0gPT09ICdzYW1wbGVyQ3ViZSdcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Ly8gdGhlc2UgcHJlY2lzaW9ucyBhcmUgc3VwcG9ydGVkIGluIGVzMVxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZS5zcGxpY2UoaS0tLCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcInRleHR1cmVcIiBhbmQgXCJ0ZXh0dXJlUHJvalwiIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kXG5cdCAqIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzEgbWV0aG9kKCd0ZXh0dXJlMkQnLCAndGV4dHVyZTJEJywgYW5kIHNvIG9uKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzEoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbiwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnVGV4dHVyZVByb2ogPSBuZXcgUmVnRXhwKGAoJHtzYmx9Kyl0ZXh0dXJlUHJvaihMb2R8KSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVnVGV4dHVyZSA9IG5ldyBSZWdFeHAoYCgke3NibH0rKXRleHR1cmUoTG9kfCkoJHtzYmx9KylgLCAnZycpO1xuXG5cdFx0bGV0IGFyZ3VtZW50U2FtcGxlck1hcDogTWFwPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcblx0XHRjb25zdCB1bmlmb3JtU2FtcGxlck1hcCA9IHRoaXMuX19jcmVhdGVVbmlmb3JtU2FtcGxlck1hcChzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXG5cdFx0XHRjb25zdCBtYXRjaFRleHR1cmVQcm9qID0gbGluZS5tYXRjaCgvdGV4dHVyZVByb2ooTG9kfClbXFx0IF0qXFwoW1xcdCBdKihcXHcrKSwvKTtcblx0XHRcdGlmIChtYXRjaFRleHR1cmVQcm9qKSB7XG5cdFx0XHRcdGFyZ3VtZW50U2FtcGxlck1hcCA9IGFyZ3VtZW50U2FtcGxlck1hcCA/PyB0aGlzLl9fY3JlYXRlQXJndW1lbnRTYW1wbGVyTWFwKFxuXHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZSxcblx0XHRcdFx0XHRpLFxuXHRcdFx0XHRcdGVtYmVkRXJyb3JzSW5PdXRwdXRcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRjb25zdCBpc0xvZE1ldGhvZCA9IG1hdGNoVGV4dHVyZVByb2pbMV0gPT09ICdMb2QnO1xuXHRcdFx0XHRjb25zdCBleHRlbnNpb25TdHIgPSBpc0ZyYWdtZW50U2hhZGVyICYmIGlzTG9kTWV0aG9kID8gYEVYVGAgOiBgYDtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gbWF0Y2hUZXh0dXJlUHJvalsyXTtcblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBhcmd1bWVudFNhbXBsZXJNYXA/LmdldCh2YXJpYWJsZU5hbWUpID8/IHVuaWZvcm1TYW1wbGVyTWFwLmdldCh2YXJpYWJsZU5hbWUpO1xuXHRcdFx0XHRpZiAoc2FtcGxlclR5cGUgIT0gbnVsbCkge1xuXHRcdFx0XHRcdGlmIChzYW1wbGVyVHlwZSA9PT0gJ3NhbXBsZXIyRCcpIHtcblx0XHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5yZXBsYWNlKHJlZ1RleHR1cmVQcm9qLCBgJDF0ZXh0dXJlMkRQcm9qJDIke2V4dGVuc2lvblN0cn0kM2ApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzE6IGRvIG5vdCBzdXBwb3J0ICcgKyBzYW1wbGVyVHlwZSArICcgdHlwZSc7XG5cdFx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbWF0Y2hUZXh0dXJlID0gbGluZS5tYXRjaCgvdGV4dHVyZShMb2R8KVtcXHQgXSpcXChbXFx0IF0qKFxcdyspLC8pO1xuXHRcdFx0aWYgKG1hdGNoVGV4dHVyZSkge1xuXHRcdFx0XHRhcmd1bWVudFNhbXBsZXJNYXAgPSBhcmd1bWVudFNhbXBsZXJNYXAgPz8gdGhpcy5fX2NyZWF0ZUFyZ3VtZW50U2FtcGxlck1hcChcblx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUsXG5cdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRlbWJlZEVycm9yc0luT3V0cHV0XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29uc3QgaXNMb2RNZXRob2QgPSBtYXRjaFRleHR1cmVbMV0gPT09ICdMb2QnO1xuXHRcdFx0XHRjb25zdCBleHRlbnNpb25TdHIgPSBpc0ZyYWdtZW50U2hhZGVyICYmIGlzTG9kTWV0aG9kID8gYEVYVGAgOiBgYDtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gbWF0Y2hUZXh0dXJlWzJdO1xuXHRcdFx0XHRjb25zdCBzYW1wbGVyVHlwZSA9IGFyZ3VtZW50U2FtcGxlck1hcD8uZ2V0KHZhcmlhYmxlTmFtZSkgPz8gdW5pZm9ybVNhbXBsZXJNYXAuZ2V0KHZhcmlhYmxlTmFtZSk7XG5cdFx0XHRcdGlmIChzYW1wbGVyVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0bGV0IHRleHR1cmVGdW5jOiBzdHJpbmc7XG5cdFx0XHRcdFx0aWYgKHNhbXBsZXJUeXBlID09PSAnc2FtcGxlcjJEJykge1xuXHRcdFx0XHRcdFx0dGV4dHVyZUZ1bmMgPSAndGV4dHVyZTJEJztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHNhbXBsZXJUeXBlID09PSAnc2FtcGxlckN1YmUnKSB7XG5cdFx0XHRcdFx0XHR0ZXh0dXJlRnVuYyA9ICd0ZXh0dXJlQ3ViZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRleHR1cmVGdW5jID0gJyc7XG5cdFx0XHRcdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzE6IGRvIG5vdCBzdXBwb3J0ICcgKyBzYW1wbGVyVHlwZSArICcgdHlwZSc7XG5cdFx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0ZXh0dXJlRnVuYyAhPT0gJycpIHtcblx0XHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5yZXBsYWNlKHJlZ1RleHR1cmUsIGAkMSR7dGV4dHVyZUZ1bmN9JDIke2V4dGVuc2lvblN0cn0kM2ApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaXNCbG9ja0VuZCA9ICEhbGluZS5tYXRjaCgvXFx9Lyk7XG5cdFx0XHRpZiAoaXNCbG9ja0VuZCkge1xuXHRcdFx0XHRhcmd1bWVudFNhbXBsZXJNYXAgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRoaXMgbWV0aG9kIGZpbmRzIHVuaWZvcm0gZGVjbGFyYXRpb25zIG9mIHNhbXBsZXIgdHlwZXMgaW4gdGhlIHNoYWRlciBhbmRcblx0ICogY3JlYXRlcyBhIG1hcCB3aXRoIHZhcmlhYmxlIG5hbWVzIGFzIGtleXMgYW5kIHR5cGVzIGFzIHZhbHVlcy5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY3JlYXRlVW5pZm9ybVNhbXBsZXJNYXAoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHVuaWZvcm1TYW1wbGVyTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cdFx0XHRjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qdW5pZm9ybSpbXFx0IF0qKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKihzYW1wbGVyXFx3KylbXFx0IF0rKFxcdyspLyk7XG5cdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBtYXRjaFsyXTtcblx0XHRcdFx0Y29uc3QgbmFtZSA9IG1hdGNoWzNdO1xuXHRcdFx0XHRpZiAodW5pZm9ybVNhbXBsZXJNYXAuZ2V0KG5hbWUpKSB7XG5cdFx0XHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fY3JlYXRlVW5pZm9ybVNhbXBsZXJNYXA6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lJztcblx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHVuaWZvcm1TYW1wbGVyTWFwLnNldChuYW1lLCBzYW1wbGVyVHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB1bmlmb3JtU2FtcGxlck1hcDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUaGlzIG1ldGhvZCBmaW5kcyBzYW1wbGVyIHR5cGVzIGZyb20gdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cyBhbmRcblx0ICogY3JlYXRlcyBhIG1hcCB3aXRoIHZhcmlhYmxlIG5hbWVzIGFzIGtleXMgYW5kIHR5cGVzIGFzIHZhbHVlcy5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY3JlYXRlQXJndW1lbnRTYW1wbGVyTWFwKFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0bGluZUluZGV4OiBudW1iZXIsXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHRjb25zdCBhcmd1bWVudFNhbXBsZXJNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cblx0XHRmb3IgKGxldCBpID0gbGluZUluZGV4OyBpID49IDA7IGktLSkge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblxuXHRcdFx0Y29uc3QgaXNCbG9ja1N0YXJ0TGluZSA9ICEhbGluZS5tYXRjaCgvXFx7Lyk7XG5cdFx0XHRpZiAoIWlzQmxvY2tTdGFydExpbmUpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGJyYWNrZXRTZWN0aW9uQ29kZSA9IHRoaXMuX19nZXRCcmFja2V0U2VjdGlvbihzcGxpdHRlZFNoYWRlckNvZGUsIGkpO1xuXG5cdFx0XHRjb25zdCBpbm5lckJyYWNrZXRTZWN0aW9uQ29kZSA9IGJyYWNrZXRTZWN0aW9uQ29kZS5tYXRjaCgvLipcXCgoLiopXFwpLyk/LlsxXTtcblx0XHRcdGlmIChpbm5lckJyYWNrZXRTZWN0aW9uQ29kZSA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdmFyaWFibGVDYW5kaWRhdGVzID0gaW5uZXJCcmFja2V0U2VjdGlvbkNvZGUuc3BsaXQoJywnKTtcblx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlRGVmaW5pdGlvblJlZyA9IC9bXFxuXFx0IF0qKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcblxcdCBdKihzYW1wbGVyXFx3KylbXFxuXFx0IF0qKFxcdyspW1xcblxcdCBdKi87XG5cblx0XHRcdGNvbnN0IGlzRnVuY3Rpb25CcmFja2V0ID0gISEodmFyaWFibGVDYW5kaWRhdGVzWzBdLm1hdGNoKHNhbXBsZXJUeXBlRGVmaW5pdGlvblJlZykgPz8gdmFyaWFibGVDYW5kaWRhdGVzWzBdLm1hdGNoKC9eW1xcblxcdCBdKiQvKSk7XG5cdFx0XHRpZiAoIWlzRnVuY3Rpb25CcmFja2V0KSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGNvbnN0IHZhcmlhYmxlQ2FuZGlkYXRlIG9mIHZhcmlhYmxlQ2FuZGlkYXRlcykge1xuXHRcdFx0XHRjb25zdCBzYW1wbGVyVmFyaWFibGVNYXRjaCA9IHZhcmlhYmxlQ2FuZGlkYXRlLm1hdGNoKHNhbXBsZXJUeXBlRGVmaW5pdGlvblJlZyk7XG5cdFx0XHRcdGlmIChzYW1wbGVyVmFyaWFibGVNYXRjaCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBzYW1wbGVyVmFyaWFibGVNYXRjaFsyXTtcblx0XHRcdFx0Y29uc3QgbmFtZSA9IHNhbXBsZXJWYXJpYWJsZU1hdGNoWzNdO1xuXHRcdFx0XHRpZiAoYXJndW1lbnRTYW1wbGVyTWFwLmdldChuYW1lKSkge1xuXHRcdFx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX2NyZWF0ZUFyZ3VtZW50U2FtcGxlck1hcDogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUnO1xuXHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGksIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YXJndW1lbnRTYW1wbGVyTWFwLnNldChuYW1lLCBzYW1wbGVyVHlwZSk7XG5cdFx0XHR9XG5cblx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcmd1bWVudFNhbXBsZXJNYXA7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgcGFydCBlbmNsb3NlZCBpbiBicmFja2V0cyg9ICcoKScpLlxuXHQgKiBGb3IgZXhhbXBsZSwgeW91IGNhbiBnZXQgbGluZXMgdGhhdCBjb250YWluIGZ1bmN0aW9uIGFyZ3VtZW50cywgY29uZGl0aW9uYWwgZXhwcmVzc2lvbnMgZm9yIGlmIHN0YXRlbWVudHMsIGV0Yy5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fZ2V0QnJhY2tldFNlY3Rpb24oc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgYnJhY2tldEVuZEluZGV4OiBudW1iZXIpIHtcblx0XHRsZXQgYnJhY2tldFN0YXJ0SW5kZXggPSAwO1xuXHRcdGZvciAobGV0IGogPSBicmFja2V0RW5kSW5kZXg7IGogPj0gMDsgai0tKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2pdO1xuXHRcdFx0Y29uc3QgaXNCcmFja2V0U3RhcnRNYXRjaCA9ICEhbGluZS5tYXRjaCgvXFwoLyk7XG5cdFx0XHRpZiAoaXNCcmFja2V0U3RhcnRNYXRjaCkge1xuXHRcdFx0XHRicmFja2V0U3RhcnRJbmRleCA9IGo7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBjb250YWluQnJhY2tldENvZGUgPSAnJztcblx0XHRmb3IgKGxldCBqID0gYnJhY2tldFN0YXJ0SW5kZXg7IGogPD0gYnJhY2tldEVuZEluZGV4OyBqKyspIHtcblx0XHRcdGNvbnRhaW5CcmFja2V0Q29kZSArPSBzcGxpdHRlZFNoYWRlckNvZGVbal07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbnRhaW5CcmFja2V0Q29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAnYXR0cmlidXRlJyBxdWFsaWZpZXIgaW4gdGhlIHZlcnRleCBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBxdWFsaWZpZXIoJ2luJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydEF0dHJpYnV0ZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuKSB7XG5cdFx0aWYgKGlzRnJhZ21lbnRTaGFkZXIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSphdHRyaWJ1dGVbXFx0IF0rL2c7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICdpbiAnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCByZXBsYWNlU3RyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndmFyeWluZycgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBxdWFsaWZpZXIoJ2luJyBvciAnb3V0Jylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFZhcnlpbmcoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKnZhcnlpbmdbXFx0IF0rL2c7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9IGlzRnJhZ21lbnRTaGFkZXIgPyAnaW4gJyA6ICdvdXQgJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgcmVwbGFjZVN0cik7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmVDdWJlJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZScpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlQ3ViZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZUN1YmUpKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmUnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlMkQnIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmUyRChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZTJEKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZTJEUHJvaicgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmVQcm9qJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmUyRFByb2Qoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmUyRFByb2opKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmVQcm9qJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZTNEJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZScpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlM0Qoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmUzRCkoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZSc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmUzRFByb2onIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlUHJvaicpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlM0RQcm9kKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlM0RQcm9qKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlUHJvaic7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX3JlZ1N5bWJvbHMoKSB7XG5cdFx0cmV0dXJuIGBbIVwiIyQlJicoKVxcKlxcK1xcLVxcLixcXC86Ozw9Pj9AXFxbXFxcXFxcXV5gICsgJ2B7fH1+XFx0XFxuIF0nO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCByZWc6IFJlZ0V4cCwgcmVwbGFjZW1lbnQ6IGFueSkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ucmVwbGFjZShyZWcsIHJlcGxhY2VtZW50KTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZUZpcnN0TWF0Y2hpbmdMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIHJlZzogUmVnRXhwKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChzcGxpdHRlZFNoYWRlckNvZGVbaV0ubWF0Y2gocmVnKSkge1xuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX291dEVycm9yKFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0bGluZUluZGV4OiBudW1iZXIsXG5cdFx0ZXJyb3JNZXNzYWdlOiBzdHJpbmcsXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHRpZiAoZW1iZWRFcnJvcnNJbk91dHB1dCkge1xuXHRcdFx0Y29uc3Qgc2hhZGVyT3V0cHV0TWVzc2FnZSA9IGAvLyBsaW5lICR7bGluZUluZGV4fTogJHtlcnJvck1lc3NhZ2V9XFxuYDtcblx0XHRcdGNvbnN0IGNsb3NlQnJhY2tldFJlZyA9IC8oLiopXFx9W1xcblxcdCBdKiQvO1xuXHRcdFx0Zm9yIChsZXQgaSA9IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXHRcdFx0XHRpZiAobGluZS5tYXRjaChjbG9zZUJyYWNrZXRSZWcpKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc3BsaXR0ZWRTaGFkZXJDb2RlW2ldID09PSBzaGFkZXJPdXRwdXRNZXNzYWdlKSB7XG5cdFx0XHRcdFx0Ly8gYXZvaWQgZHVwbGljYXRlIGVycm9yIG1lc3NhZ2Vcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvck1lc3NhZ2UpO1xuXHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnB1c2goc2hhZGVyT3V0cHV0TWVzc2FnZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO1xuXHRcdH1cblx0fVxufVxuIiwiaW1wb3J0IFJlZmxlY3Rpb24gZnJvbSAnLi9SZWZsZWN0aW9uJztcbmltcG9ydCB7U2hhZGVyaXR5T2JqZWN0LCBTaGFkZXJTdGFnZVN0ciwgU2hhZGVyVmVyc2lvbiwgVGVtcGxhdGVPYmplY3R9IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuaW1wb3J0IFNoYWRlclRyYW5zZm9ybWVyIGZyb20gJy4vU2hhZGVyVHJhbnNmb3JtZXInO1xuaW1wb3J0IFNoYWRlckVkaXRvciBmcm9tICcuL1NoYWRlckVkaXRvcic7XG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xuaW1wb3J0IFNoYWRlcml0eU9iamVjdENyZWF0b3IgZnJvbSAnLi9TaGFkZXJpdHlPYmplY3RDcmVhdG9yJztcbmltcG9ydCBQcmVQcm9jZXNzb3IgZnJvbSAnLi9QcmVQcm9jZXNzb3InO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFkZXJpdHkge1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gc2hhZGVyIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBFUzMgc2hhZGVyIGNvZGUgdG8gYSBHTFNMIEVTMSBzaGFkZXIgY29kZVxuXHQgKiBAcGFyYW0gb2JqIFNoYWRlcml0eSBvYmplY3QgdG8gdHJhbnNsYXRlIHRvIGdsc2wgZXMxXG5cdCAqIEBwYXJhbSBlbWJlZEVycm9yc0luT3V0cHV0IElmIHRydWUsIHdoZW4gdGhlcmUgaXMgYW4gZXJyb3IgaW4gdGhlIGNvbnZlcnNpb24sXG5cdCAqICAgIHRoZSBlcnJvciBhbmQgdGhlIG51bWJlciBvZiBsaW5lcyBhcmUgb3V0cHV0IGF0IHRoZSBib3R0b20gb2YgdGhlIHJldHVyblxuXHQgKiAgICB2YWx1ZSBTaGFkZXJpdHlPYmplY3QuY29kZS4gSWYgZmFsc2UsIHRocm93IGFuIGVycm9yLlxuXHQgKiBAcmV0dXJucyBTaGFkZXJpdHlPYmplY3Qgd2hvc2UgY29kZSBwcm9wZXJ0eSBpcyB0aGUgc2hhZGVyIGNvZGUgZm9yIEdMU0wgRVMxXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHRyYW5zZm9ybVRvR0xTTEVTMShvYmo6IFNoYWRlcml0eU9iamVjdCwgZW1iZWRFcnJvcnNJbk91dHB1dCA9IGZhbHNlKSB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZVxuXHRcdFx0PSBTaGFkZXJUcmFuc2Zvcm1lci5fdHJhbnNmb3JtVG9HTFNMRVMxKFxuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUsXG5cdFx0XHRcdG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdFx0XHRlbWJlZEVycm9yc0luT3V0cHV0XG5cdFx0XHQpO1xuXHRcdGNvbnN0IHJlc3VsdENvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdGNvbnN0IHJlc3VsdE9iajogU2hhZGVyaXR5T2JqZWN0ID0ge1xuXHRcdFx0Y29kZTogcmVzdWx0Q29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHJlc3VsdE9iajtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIEVTMSBzaGFkZXIgY29kZSB0byBhIEdMU0wgRVMzIHNoYWRlciBjb2RlXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHRyYW5zZm9ybVRvR0xTTEVTMyhvYmo6IFNoYWRlcml0eU9iamVjdCkge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGVcblx0XHRcdD0gU2hhZGVyVHJhbnNmb3JtZXIuX3RyYW5zZm9ybVRvR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGUsIG9iai5pc0ZyYWdtZW50U2hhZGVyKTtcblx0XHRjb25zdCByZXN1bHRDb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZSh0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IHJlc3VsdENvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH1cblxuXHQvKipcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBzaGFkZXIgY29kZSB0byBhIHNoYWRlciBjb2RlIG9mIHNwZWNpZmllZCBHTFNMIHZlcnNpb25cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtVG8odmVyc2lvbjogU2hhZGVyVmVyc2lvbiwgb2JqOiBTaGFkZXJpdHlPYmplY3QsIGVtYmVkRXJyb3JzSW5PdXRwdXQgPSBmYWxzZSkge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGVcblx0XHRcdD0gU2hhZGVyVHJhbnNmb3JtZXIuX3RyYW5zZm9ybVRvKFxuXHRcdFx0XHR2ZXJzaW9uLFxuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUsXG5cdFx0XHRcdG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdFx0XHRlbWJlZEVycm9yc0luT3V0cHV0XG5cdFx0XHQpO1xuXHRcdGNvbnN0IHJlc3VsdENvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdGNvbnN0IHJlc3VsdE9iajogU2hhZGVyaXR5T2JqZWN0ID0ge1xuXHRcdFx0Y29kZTogcmVzdWx0Q29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHJlc3VsdE9iajtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgcHJvY2Vzc1ByYWdtYShvYmo6IFNoYWRlcml0eU9iamVjdCwgc3RhcnRMaW5lU3RyPzogc3RyaW5nLCBlbmRMaW5lU3RyPzogc3RyaW5nKSB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZVxuXHRcdFx0PSBQcmVQcm9jZXNzb3IucHJvY2VzcyhzcGxpdHRlZFNoYWRlckNvZGUsIHN0YXJ0TGluZVN0ciwgZW5kTGluZVN0cik7XG5cblx0XHRjb25zdCByZXN1bHRDb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZSh0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IHJlc3VsdENvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gc2hhZGVyaXR5IG9iamVjdCBjcmVhdGlvbiBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBpbnN0YW5jZSB0byBjcmVhdGUgc2hhZGVyaXR5IG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgY3JlYXRlU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcihzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpOiBTaGFkZXJpdHlPYmplY3RDcmVhdG9yIHtcblx0XHRyZXR1cm4gbmV3IFNoYWRlcml0eU9iamVjdENyZWF0b3Ioc2hhZGVyU3RhZ2UpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHNoYWRlciBlZGl0IGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcblx0ICogRmluZCB0aGUgZm9sbG93aW5nIHRlbXBsYXRlIHBhdHRlcm4gaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGtleSB0byB2YWx1ZVxuXHQgKiBAcGFyYW0gdGVtcGxhdGVPYmplY3QgQW4gb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgc3RyaW5nIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIHJlcGxhY2VtZW50XG5cdCAqIFRoZSBrZXkgY2FuIGJlIGEgc3RyaW5nIG9yIGFuIG9iamVjdC4gSWYgYW4gb2JqZWN0IGlzIHVzZWQgYXMgdGhlIGtleSxcblx0ICogdGhlIGtleSBpbiB0aGUgcGF0dGVybiBvZiBzaGFkZXJDb2RlIG11c3QgYWxzbyBtYXRjaCB0aGUgb2JqZWN0LlxuXHQgKiBGb3IgZXhhbXBsZSwgaWYgdGVtcGxhdGVPYmplY3QgaXNcblx0XHR7XG5cdFx0XHRzYW1wbGUge1xuXHRcdFx0XHRzYW1wbGVBOiAwXG5cdFx0XHR9XG5cdFx0fVxuXHQgKiB0aGVuIHRoZSBrZXkgaW4gYSBzaGFkZXIgY29kZSBpcyBzYW1wbGUuc2FtcGxlQS5cblx0ICovXG5cdC8vIFRoZSB0ZW1wbGF0ZSBwYXR0ZXJuIGlzXHQvKiBzaGFkZXJpdHk6IEB7a2V5fSAqL1xuXHRwdWJsaWMgc3RhdGljIGZpbGxUZW1wbGF0ZShvYmo6IFNoYWRlcml0eU9iamVjdCwgYXJnOiBUZW1wbGF0ZU9iamVjdCkge1xuXHRcdGNvbnN0IGNvcHkgPSB0aGlzLl9fY29weVNoYWRlcml0eU9iamVjdChvYmopO1xuXG5cdFx0Y29weS5jb2RlID0gU2hhZGVyRWRpdG9yLl9maWxsVGVtcGxhdGUoY29weS5jb2RlLCBhcmcpO1xuXG5cdFx0cmV0dXJuIGNvcHk7XG5cdH1cblxuXHQvKipcblx0ICogSW5zZXJ0IGRlZmluZSBkaXJlY3RpdmVcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgaW5zZXJ0RGVmaW5pdGlvbihvYmo6IFNoYWRlcml0eU9iamVjdCwgZGVmaW5pdGlvbjogc3RyaW5nKSB7XG5cdFx0Y29uc3QgY29weSA9IHRoaXMuX19jb3B5U2hhZGVyaXR5T2JqZWN0KG9iaik7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRTaGFkZXJFZGl0b3IuX2luc2VydERlZmluaXRpb24oc3BsaXR0ZWRTaGFkZXJDb2RlLCBkZWZpbml0aW9uKTtcblx0XHRjb3B5LmNvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRyZXR1cm4gY29weTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyByZWZsZWN0aW9uIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcblx0ICogQ3JlYXRlIGFuIGluc3RhbmNlIHRvIGdldCB0aGUgYXR0cmlidXRlLCB2YXJ5aW5nLCBhbmQgdW5pZm9ybSBpbmZvcm1hdGlvbiBmcm9tIGEgc2hhZGVyIGNvZGUgb2YgdGhlIHNoYWRlcml0eS5cblx0ICogVG8gZ2V0IHRoZXNlIGluZm9ybWF0aW9uLCB5b3UgbmVlZCB0byBjYWxsIHJlZmxlY3Rpb24ucmVmbGVjdCBtZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGNyZWF0ZVJlZmxlY3Rpb25PYmplY3Qob2JqOiBTaGFkZXJpdHlPYmplY3QpOiBSZWZsZWN0aW9uIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHJlZmxlY3Rpb24gPSBuZXcgUmVmbGVjdGlvbihzcGxpdHRlZFNoYWRlckNvZGUsIG9iai5zaGFkZXJTdGFnZSk7XG5cdFx0cmV0dXJuIHJlZmxlY3Rpb247XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gcHJpdmF0ZSBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19jb3B5U2hhZGVyaXR5T2JqZWN0KG9iajogU2hhZGVyaXR5T2JqZWN0KSB7XG5cdFx0Y29uc3QgY29waWVkT2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiBvYmouY29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9XG5cblx0XHRyZXR1cm4gY29waWVkT2JqO1xuXHR9XG59XG4iLCJpbXBvcnQge1xuXHRTaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0LFxuXHRTaGFkZXJFeHRlbnNpb25CZWhhdmlvcixcblx0U2hhZGVyRXh0ZW5zaW9uT2JqZWN0LFxuXHRTaGFkZXJpdHlPYmplY3QsXG5cdFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzLFxuXHRTaGFkZXJQcmVjaXNpb25PYmplY3QsXG5cdFNoYWRlclByZWNpc2lvbk9iamVjdEtleSxcblx0U2hhZGVyU3RhZ2VTdHIsXG5cdFNoYWRlckF0dHJpYnV0ZU9iamVjdCxcblx0U2hhZGVyUHJlY2lzaW9uVHlwZSxcblx0U2hhZGVyQXR0cmlidXRlVmFyVHlwZSxcblx0U2hhZGVyVmFyeWluZ09iamVjdCxcblx0U2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlLFxuXHRTaGFkZXJWYXJ5aW5nVmFyVHlwZSxcblx0U2hhZGVyVW5pZm9ybU9iamVjdCxcblx0U2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsXG5cdFNoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3QsXG5cdFNoYWRlclN0cnVjdE1lbWJlck9iamVjdCxcblx0U2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdCxcblx0U2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCxcblx0U2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdCxcblx0U2hhZGVyVUJPVmFyaWFibGVPYmplY3QsXG5cdFNoYWRlckZ1bmN0aW9uT2JqZWN0LFxufSBmcm9tICcuLi90eXBlcy90eXBlJztcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBjcmVhdGVzIGEgc2hhZGVyaXR5IG9iamVjdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciB7XG5cdHByaXZhdGUgX19zaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHI7XG5cdHByaXZhdGUgX19mdW5jdGlvbklkQ291bnQgPSAwO1xuXG5cdHByaXZhdGUgX19kZWZpbmVEaXJlY3RpdmVOYW1lczogc3RyaW5nW10gPSBbXTtcblx0cHJpdmF0ZSBfX2V4dGVuc2lvbnM6IFNoYWRlckV4dGVuc2lvbk9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19nbG9iYWxQcmVjaXNpb246IFNoYWRlclByZWNpc2lvbk9iamVjdCA9IHtcblx0XHRpbnQ6ICdoaWdocCcsXG5cdFx0ZmxvYXQ6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjJEOiAnaGlnaHAnLFxuXHRcdHNhbXBsZXJDdWJlOiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIzRDogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyMkRBcnJheTogJ2hpZ2hwJyxcblx0XHRpc2FtcGxlcjJEOiAnaGlnaHAnLFxuXHRcdGlzYW1wbGVyQ3ViZTogJ2hpZ2hwJyxcblx0XHRpc2FtcGxlcjNEOiAnaGlnaHAnLFxuXHRcdGlzYW1wbGVyMkRBcnJheTogJ2hpZ2hwJyxcblx0XHR1c2FtcGxlcjJEOiAnaGlnaHAnLFxuXHRcdHVzYW1wbGVyQ3ViZTogJ2hpZ2hwJyxcblx0XHR1c2FtcGxlcjNEOiAnaGlnaHAnLFxuXHRcdHVzYW1wbGVyMkRBcnJheTogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyMkRTaGFkb3c6ICdoaWdocCcsXG5cdFx0c2FtcGxlckN1YmVTaGFkb3c6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjJEQXJyYXlTaGFkb3c6ICdoaWdocCcsXG5cdH07XG5cdHByaXZhdGUgX19zdHJ1Y3REZWZpbml0aW9uczogU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19nbG9iYWxDb25zdGFudFZhbHVlczogU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlczogU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19hdHRyaWJ1dGVzOiBTaGFkZXJBdHRyaWJ1dGVPYmplY3RbXSA9IFtdOyAvLyBmb3IgdmVydGV4IHNoYWRlciBvbmx5XG5cdHByaXZhdGUgX192YXJ5aW5nczogU2hhZGVyVmFyeWluZ09iamVjdFtdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtczogU2hhZGVyVW5pZm9ybU9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtU3RydWN0czogU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtQnVmZmVyT2JqZWN0czogU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19mdW5jdGlvbnM6IFNoYWRlckZ1bmN0aW9uT2JqZWN0W11bXSA9IFtdOyAvLyBmaXJzdCBpbmRleCByZXByZXNlbnQgZGVwZW5kZW5jeSBsZXZlbFxuXHRwcml2YXRlIF9fbWFpbkZ1bmN0aW9uQ29kZTogc3RyaW5nID0gJ3ZvaWQgbWFpbigpIHt9Jztcblx0cHJpdmF0ZSBfX291dHB1dENvbG9yVmFyaWFibGVOYW1lOiBzdHJpbmcgPSAncmVuZGVyVGFyZ2V0MCc7IC8vIGZvciBmcmFnbWVudCBzaGFkZXIgb25seVxuXG5cdGNvbnN0cnVjdG9yKHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdHRoaXMuX19zaGFkZXJTdGFnZSA9IHNoYWRlclN0YWdlO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIGFkZCBwYXJhbWV0ZXJzIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgYWRkRGVmaW5lRGlyZWN0aXZlKGRlZmluZURpcmVjdGl2ZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5zb21lKG5hbWUgPT4gbmFtZSA9PT0gZGVmaW5lRGlyZWN0aXZlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ2FkZERlZmluZURpcmVjdGl2ZTogdGhpcyBkZWZpbmUgZGlyZWN0aXZlIGlzIGFscmVhZHkgc2V0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzLnB1c2goZGVmaW5lRGlyZWN0aXZlTmFtZSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkRXh0ZW5zaW9uKGV4dGVuc2lvbk5hbWU6IHN0cmluZywgYmVoYXZpb3I6IFNoYWRlckV4dGVuc2lvbkJlaGF2aW9yID0gJ2VuYWJsZScpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5zb21lKGV4dGVuc2lvbiA9PiBleHRlbnNpb24uZXh0ZW5zaW9uTmFtZSA9PT0gZXh0ZW5zaW9uTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ2FkZEV4dGVuc2lvbjogdGhpcyBleHRlbnNpb24gaXMgYWxyZWFkeSBzZXQnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5wdXNoKHtcblx0XHRcdGV4dGVuc2lvbk5hbWUsXG5cdFx0XHRiZWhhdmlvclxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gb25seSBkZWZpbmUgdHlwZXNcblx0cHVibGljIGFkZFN0cnVjdERlZmluaXRpb24oc3RydWN0TmFtZTogc3RyaW5nLCBtZW1iZXJPYmplY3RzOiBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3RbXSkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5zb21lKHN0cnVjdERlZmluaXRpb24gPT4gc3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFN0cnVjdERlZmluaXRpb246IGR1cGxpY2F0ZSBzdHJ1Y3QgdHlwZSBuYW1lICR7c3RydWN0TmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMucHVzaCh7XG5cdFx0XHRzdHJ1Y3ROYW1lLFxuXHRcdFx0bWVtYmVyT2JqZWN0cyxcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRHbG9iYWxDb25zdGFudFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCB0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMywgdmFsdWVzOiBudW1iZXJbXSkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5zb21lKGdsb2JhbENvbnN0YW50VmFsdWUgPT4gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRHbG9iYWxDb25zdGFudFZhbHVlOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc1ZhbGlkQ29tcG9uZW50TnVtYmVyID0gVXRpbGl0eS5faXNWYWxpZENvbXBvbmVudENvdW50KHR5cGUsIHZhbHVlcyk7XG5cdFx0aWYgKCFpc1ZhbGlkQ29tcG9uZW50TnVtYmVyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgY29tcG9uZW50IGNvdW50IG9mICR7dmFyaWFibGVOYW1lfSBpcyBpbnZhbGlkYCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNJbnRUeXBlID0gVXRpbGl0eS5faXNJbnRUeXBlKHR5cGUpO1xuXHRcdGlmIChpc0ludFR5cGUpIHtcblx0XHRcdGNvbnN0IGV4aXN0Tm9uSW50ZWdlclZhbHVlID0gU2hhZGVyaXR5T2JqZWN0Q3JlYXRvci5fX2V4aXN0Tm9uSW50ZWdlclZhbHVlKHZhbHVlcyk7XG5cdFx0XHRpZiAoZXhpc3ROb25JbnRlZ2VyVmFsdWUpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBhZGRHbG9iYWxDb25zdGFudFZhbHVlOiBub24taW50ZWdlciB2YWx1ZSBpcyBzZXQgdG8gJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0dHlwZSxcblx0XHRcdHZhbHVlcyxcblx0XHR9KTtcblx0fVxuXG5cdC8vIG5lZWQgdG8gZGVmaW5lIHN0cnVjdCBieSB0aGUgYWRkU3RydWN0RGVmaW5pdGlvbiBtZXRob2Rcblx0Ly8gdmFsaWRhdGUgdGhhdCB0aGUgY29ycmVzcG9uZGluZyBzdHJ1Y3R1cmUgaXMgZGVmaW5lZCBieSB0aGUgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZSBtZXRob2Rcblx0cHVibGljIGFkZEdsb2JhbENvbnN0YW50U3RydWN0VmFsdWUoc3RydWN0TmFtZTogc3RyaW5nLCB2YXJpYWJsZU5hbWU6IHN0cmluZywgdmFsdWVzOiB7W2tleVZhcmlhYmxlTmFtZTogc3RyaW5nXTogbnVtYmVyW119KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLnNvbWUoc3RydWN0VmFsdWUgPT4gc3RydWN0VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZTogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0c3RydWN0TmFtZSxcblx0XHRcdHZhbHVlcyxcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRBdHRyaWJ1dGVEZWNsYXJhdGlvbihcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZyxcblx0XHR0eXBlOiBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRwcmVjaXNpb24/OiBTaGFkZXJQcmVjaXNpb25UeXBlLFxuXHRcdFx0bG9jYXRpb24/OiBudW1iZXIsXG5cdFx0fVxuXHQpIHtcblx0XHRpZiAodGhpcy5fX3NoYWRlclN0YWdlICE9PSAndmVydGV4Jykge1xuXHRcdFx0Y29uc29sZS5lcnJvcignYWRkQXR0cmlidXRlOiB0aGlzIG1ldGhvZCBpcyBmb3IgdmVydGV4IHNoYWRlciBvbmx5Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2F0dHJpYnV0ZXMuc29tZShhdHRyaWJ1dGUgPT4gYXR0cmlidXRlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZEF0dHJpYnV0ZTogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2F0dHJpYnV0ZXMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHR0eXBlLFxuXHRcdFx0cHJlY2lzaW9uOiBvcHRpb25zPy5wcmVjaXNpb24sXG5cdFx0XHRsb2NhdGlvbjogb3B0aW9ucz8ubG9jYXRpb24sXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkVmFyeWluZ0RlY2xhcmF0aW9uKFxuXHRcdHZhcmlhYmxlTmFtZTogc3RyaW5nLFxuXHRcdHR5cGU6IFNoYWRlclZhcnlpbmdWYXJUeXBlLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRwcmVjaXNpb24/OiBTaGFkZXJQcmVjaXNpb25UeXBlLFxuXHRcdFx0aW50ZXJwb2xhdGlvblR5cGU/OiBTaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUsXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fdmFyeWluZ3Muc29tZSh2YXJ5aW5nID0+IHZhcnlpbmcudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVmFyeWluZzogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNJbnRUeXBlID0gVXRpbGl0eS5faXNJbnRUeXBlKHR5cGUpO1xuXHRcdGxldCBpbnRlcnBvbGF0aW9uVHlwZSA9IG9wdGlvbnM/LmludGVycG9sYXRpb25UeXBlO1xuXHRcdGlmIChpc0ludFR5cGUgJiYgaW50ZXJwb2xhdGlvblR5cGUgIT09ICdmbGF0Jykge1xuXHRcdFx0aWYgKGludGVycG9sYXRpb25UeXBlICE9IG51bGwpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVmFyeWluZzogdGhlIGludGVycG9sYXRpb25UeXBlIG11c3QgYmUgZmxhdCBmb3IgaW50ZWdlciB0eXBlc2ApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYGFkZFZhcnlpbmc6IHNldCB0aGUgaW50ZXJwb2xhdGlvblR5cGUgb2YgaW50ZWdlciB0eXBlcyB0byBmbGF0IHRvIGF2b2lkIGNvbXBpbGF0aW9uIGVycm9yYCk7XG5cdFx0XHRcdGludGVycG9sYXRpb25UeXBlID0gJ2ZsYXQnO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX192YXJ5aW5ncy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHR5cGUsXG5cdFx0XHRwcmVjaXNpb246IG9wdGlvbnM/LnByZWNpc2lvbixcblx0XHRcdGludGVycG9sYXRpb25UeXBlLFxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGFkZFVuaWZvcm1EZWNsYXJhdGlvbihcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZyxcblx0XHR0eXBlOiBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0cHJlY2lzaW9uPzogU2hhZGVyUHJlY2lzaW9uVHlwZSxcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX191bmlmb3Jtcy5zb21lKHVuaWZvcm0gPT4gdW5pZm9ybS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodHlwZSA9PT0gJ2Jvb2wnICYmIG9wdGlvbnM/LnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYGFkZFVuaWZvcm06IHJlbW92ZSB0aGUgc3BlY2lmaWNhdGlvbiBvZiBwcmVjaXNpb24gZm9yIGJvb2wgdHlwZSB0byBhdm9pZCBjb21waWxhdGlvbiBlcnJvcmApO1xuXHRcdFx0b3B0aW9ucy5wcmVjaXNpb24gPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1zLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0dHlwZSxcblx0XHRcdHByZWNpc2lvbjogb3B0aW9ucz8ucHJlY2lzaW9uLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gbmVlZCB0byBkZWZpbmUgc3RydWN0IGJ5IHRoZSBhZGRTdHJ1Y3REZWZpbml0aW9uIG1ldGhvZFxuXHRwdWJsaWMgYWRkVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uKFxuXHRcdHN0cnVjdE5hbWU6IHN0cmluZyxcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZ1xuXHQpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybVN0cnVjdHMuc29tZSh1bmlmb3JtU3RydWN0ID0+IHVuaWZvcm1TdHJ1Y3QudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybVN0cnVjdHMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHRzdHJ1Y3ROYW1lLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gZm9yIGVzM1xuXHRwdWJsaWMgYWRkVW5pZm9ybUJ1ZmZlck9iamVjdERlY2xhcmF0aW9uKFxuXHRcdGJsb2NrTmFtZTogc3RyaW5nLFxuXHRcdHZhcmlhYmxlT2JqZWN0czogU2hhZGVyVUJPVmFyaWFibGVPYmplY3RbXSxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0aW5zdGFuY2VOYW1lPzogU2hhZGVyUHJlY2lzaW9uVHlwZVxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGVCbG9ja05hbWUgPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzLnNvbWUodWJvID0+IHViby5ibG9ja05hbWUgPT09IGJsb2NrTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlQmxvY2tOYW1lKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb246IGR1cGxpY2F0ZSBibG9jayBuYW1lICR7YmxvY2tOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgdWJvIG9mIHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cykge1xuXHRcdFx0Zm9yIChjb25zdCB1Ym9WYXJpYWJsZU9iamVjdCBvZiB1Ym8udmFyaWFibGVPYmplY3RzKSB7XG5cdFx0XHRcdGZvciAoY29uc3QgdmFyaWFibGVPYmplY3Qgb2YgdmFyaWFibGVPYmplY3RzKSB7XG5cdFx0XHRcdFx0aWYgKHVib1ZhcmlhYmxlT2JqZWN0LnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVPYmplY3QudmFyaWFibGVOYW1lKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb246IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVPYmplY3QudmFyaWFibGVOYW1lfWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cy5wdXNoKHtcblx0XHRcdGJsb2NrTmFtZSxcblx0XHRcdHZhcmlhYmxlT2JqZWN0cyxcblx0XHRcdGluc3RhbmNlTmFtZTogb3B0aW9ucz8uaW5zdGFuY2VOYW1lLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gdGhlIHJldHVybiB2YWx1ZSBJZCBpcyBhIHZhbHVlIHRvIGRlbGV0ZSB0aGUgZnVuY3Rpb25cblx0Ly8gdGhlIG1haW4gZnVuY3Rpb24gaXMgZGVmaW5lZCAodXBkYXRlZCkgYnkgdGhlIHVwZGF0ZU1haW5GdW5jdGlvbiBtZXRob2Rcblx0cHVibGljIGFkZEZ1bmN0aW9uRGVmaW5pdGlvbihcblx0XHRmdW5jdGlvbkNvZGU6IHN0cmluZyxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0ZGVwZW5kZW5jeUxldmVsPzogbnVtYmVyXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCBmdW5jdGlvbklkID0gdGhpcy5fX2Z1bmN0aW9uSWRDb3VudCsrO1xuXG5cdFx0Y29uc3QgZGVwZW5kZW5jeUxldmVsID0gb3B0aW9ucz8uZGVwZW5kZW5jeUxldmVsID8/IDA7XG5cdFx0dGhpcy5fX2Z1bmN0aW9uc1tkZXBlbmRlbmN5TGV2ZWxdID0gdGhpcy5fX2Z1bmN0aW9uc1tkZXBlbmRlbmN5TGV2ZWxdID8/IFtdO1xuXHRcdHRoaXMuX19mdW5jdGlvbnNbZGVwZW5kZW5jeUxldmVsXS5wdXNoKHtcblx0XHRcdGZ1bmN0aW9uQ29kZSxcblx0XHRcdGZ1bmN0aW9uSWRcblx0XHR9KTtcblxuXHRcdHJldHVybiBmdW5jdGlvbklkO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHVwZGF0ZSBwYXJhbWV0ZXJzIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgdXBkYXRlR2xvYmFsUHJlY2lzaW9uKHByZWNpc2lvbjogU2hhZGVyUHJlY2lzaW9uT2JqZWN0KSB7XG5cdFx0T2JqZWN0LmFzc2lnbih0aGlzLl9fZ2xvYmFsUHJlY2lzaW9uLCBwcmVjaXNpb24pO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZVN0cnVjdERlZmluaXRpb24oc3RydWN0TmFtZTogc3RyaW5nLCBtZW1iZXJPYmplY3RzOiBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3RbXSkge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuZmluZEluZGV4KHN0cnVjdERlZmluaXRpb24gPT4gc3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgdXBkYXRlU3RydWN0RGVmaW5pdGlvbjogdGhlIHN0cnVjdCB0eXBlIG5hbWUgJHtzdHJ1Y3ROYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnNbbWF0Y2hlZEluZGV4XS5tZW1iZXJPYmplY3RzID0gbWVtYmVyT2JqZWN0cztcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCB2YWx1ZXM6IG51bWJlcltdKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5maW5kSW5kZXgoZ2xvYmFsQ29uc3RhbnRWYWx1ZSA9PiBnbG9iYWxDb25zdGFudFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGB1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdHlwZSA9IHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlc1ttYXRjaGVkSW5kZXhdLnR5cGU7XG5cblx0XHRjb25zdCBpc1ZhbGlkQ29tcG9uZW50TnVtYmVyID0gVXRpbGl0eS5faXNWYWxpZENvbXBvbmVudENvdW50KHR5cGUsIHZhbHVlcyk7XG5cdFx0aWYgKCFpc1ZhbGlkQ29tcG9uZW50TnVtYmVyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCd1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgY29tcG9uZW50IGNvdW50IGlzIGludmFsaWQnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc0ludFR5cGUgPSBVdGlsaXR5Ll9pc0ludFR5cGUodHlwZSk7XG5cdFx0aWYgKGlzSW50VHlwZSkge1xuXHRcdFx0Y29uc3QgZXhpc3ROb25JbnRlZ2VyVmFsdWUgPSBTaGFkZXJpdHlPYmplY3RDcmVhdG9yLl9fZXhpc3ROb25JbnRlZ2VyVmFsdWUodmFsdWVzKTtcblx0XHRcdGlmIChleGlzdE5vbkludGVnZXJWYWx1ZSkge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYHVwZGF0ZUdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSAke3ZhcmlhYmxlTmFtZX0gaGFzIGEgbm9uLWludGVnZXIgdmFsdWUuYCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzW21hdGNoZWRJbmRleF0udmFsdWVzID0gdmFsdWVzO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlczoge1trZXlWYXJpYWJsZU5hbWU6IHN0cmluZ106IG51bWJlcltdfSkge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMuZmluZEluZGV4KHN0cnVjdFZhbHVlID0+IHN0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgdXBkYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZTogIHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXNbbWF0Y2hlZEluZGV4XS52YWx1ZXMgPSB2YWx1ZXM7XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlTWFpbkZ1bmN0aW9uKG1haW5GdW5jdGlvbkNvZGVJbm5lcjogc3RyaW5nKSB7XG5cdFx0dGhpcy5fX21haW5GdW5jdGlvbkNvZGUgPSBtYWluRnVuY3Rpb25Db2RlSW5uZXI7XG5cdH1cblxuXHQvLyBzcGVjaWZ5IHRoZSBuYW1lIG9mIHRoZSBvdXRwdXQgY29sb3IgdmFyaWFibGUgZnJvbSB0aGUgbWFpbiBmdW5jdGlvbiBpbiB0aGUgZnJhZ21lbnQgc2hhZGVyLlxuXHQvLyB1c2VycyBoYXZlIHRvIGFzc2lnbiB0aGUgcmVzdWx0IG9mIGZyYWdtZW50IHNoYWRlciBjYWxjdWxhdGlvbiB0byB0aGlzIHZhcmlhYmxlLlxuXHRwdWJsaWMgdXBkYXRlT3V0cHV0Q29sb3JWYXJpYWJsZU5hbWUob3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGlmICh0aGlzLl9fc2hhZGVyU3RhZ2UgIT09ICdmcmFnbWVudCcpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ3VwZGF0ZU91dHB1dENvbG9yVmFyaWFibGVOYW1lOiB0aGlzIG1ldGhvZCBpcyBmb3IgZnJhZ21lbnQgc2hhZGVyIG9ubHknKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAob3V0cHV0Q29sb3JWYXJpYWJsZU5hbWUubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCd1cGRhdGVPdXRwdXRDb2xvclZhcmlhYmxlTmFtZTogaW52YWxpZCBvdXRDb2xvclZhcmlhYmxlTmFtZScpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19vdXRwdXRDb2xvclZhcmlhYmxlTmFtZSA9IG91dHB1dENvbG9yVmFyaWFibGVOYW1lO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHJlbW92ZSBwYXJhbWV0ZXJzIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgcmVtb3ZlRGVmaW5lRGlyZWN0aXZlKGRlZmluZURpcmVjdGl2ZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9IHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5pbmRleE9mKGRlZmluZURpcmVjdGl2ZU5hbWUpO1xuXG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybigncmVtb3ZlZERlZmluZURpcmVjdGl2ZTogdGhpcyBkZWZpbmUgZGlyZWN0aXZlIGlzIG5vdCBleGlzdCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVFeHRlbnNpb24oZXh0ZW5zaW9uTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19leHRlbnNpb25zLmZpbmRJbmRleChleHRlbnNpb24gPT4gZXh0ZW5zaW9uLmV4dGVuc2lvbk5hbWUgPT09IGV4dGVuc2lvbk5hbWUpO1xuXG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybigncmVtb3ZlRXh0ZW5zaW9uOiB0aGlzIGV4dGVuc2lvbiBpcyBub3QgZXhpc3QnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVTdHJ1Y3REZWZpbml0aW9uKHN0cnVjdE5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuZmluZEluZGV4KHN0cnVjdERlZmluaXRpb24gPT4gc3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgcmVtb3ZlU3RydWN0RGVmaW5pdGlvbjogdGhlIHN0cnVjdCB0eXBlIG5hbWUgJHtzdHJ1Y3ROYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlR2xvYmFsQ29uc3RhbnRWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMuZmluZEluZGV4KGdsb2JhbENvbnN0YW50VmFsdWUgPT4gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5maW5kSW5kZXgoc3RydWN0VmFsdWUgPT4gc3RydWN0VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGB1cGRhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlOiAgdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVBdHRyaWJ1dGVEZWNsYXJhdGlvbih2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fYXR0cmlidXRlcy5maW5kSW5kZXgoYXR0cmlidXRlID0+IGF0dHJpYnV0ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlQXR0cmlidXRlOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2F0dHJpYnV0ZXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlVmFyeWluZ0RlY2xhcmF0aW9uKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX192YXJ5aW5ncy5maW5kSW5kZXgodmFyeWluZyA9PiB2YXJ5aW5nLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVWYXJ5aW5nOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3ZhcnlpbmdzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVVuaWZvcm1EZWNsYXJhdGlvbih2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybXMuZmluZEluZGV4KHVuaWZvcm0gPT4gdW5pZm9ybS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlVW5pZm9ybTogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3Jtcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb24odmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1TdHJ1Y3RzLmZpbmRJbmRleCh1bmlmb3JtU3RydWN0ID0+IHVuaWZvcm1TdHJ1Y3QudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbjogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3JtU3RydWN0cy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb24oYmxvY2tOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzLmZpbmRJbmRleCh1Ym8gPT4gdWJvLmJsb2NrTmFtZSA9PT0gYmxvY2tOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb246IHRoZSB2YXJpYWJsZSBuYW1lICR7YmxvY2tOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlRnVuY3Rpb25EZWZpbml0aW9uKGZ1bmN0aW9uSWQ6IG51bWJlcikge1xuXHRcdHRoaXMuX19maWxsRW1wdHlGdW5jdGlvbnMoKTtcblxuXHRcdC8vIGlkIGlzIHRvbyBzbWFsbCBvciB0b28gYmlnXG5cdFx0aWYgKGZ1bmN0aW9uSWQgPCAwIHx8IGZ1bmN0aW9uSWQgPj0gdGhpcy5fX2Z1bmN0aW9uSWRDb3VudCkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdyZW1vdmVGdW5jdGlvbkRlZmluaXRpb246IGludmFsaWQgZnVuY3Rpb24gaWQnKVxuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgZnVuY3Rpb25PYmplY3RzIG9mIHRoaXMuX19mdW5jdGlvbnMpIHtcblx0XHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHRcdGZ1bmN0aW9uT2JqZWN0cy5maW5kSW5kZXgoZnVuY3Rpb25PYmplY3QgPT4gZnVuY3Rpb25PYmplY3QuZnVuY3Rpb25JZCA9PT0gZnVuY3Rpb25JZCk7XG5cdFx0XHRpZiAobWF0Y2hlZEluZGV4ICE9PSAtMSkge1xuXHRcdFx0XHRmdW5jdGlvbk9iamVjdHMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zb2xlLndhcm4oYHJlbW92ZUZ1bmN0aW9uRGVmaW5pdGlvbjogbm90IGZvdW5kIHRoZSBmdW5jdGlvbiBvZiBmdW5jdGlvbklkICR7ZnVuY3Rpb25JZH1gKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBjcmVhdGUgc2hhZGVyaXR5IG9iamVjdCBmdW5jdGlvblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgY3JlYXRlU2hhZGVyaXR5T2JqZWN0KCk6IFNoYWRlcml0eU9iamVjdCB7XG5cdFx0Y29uc3Qgc2hhZGVyaXR5T2JqID0ge1xuXHRcdFx0Y29kZTogdGhpcy5fX2NyZWF0ZVNoYWRlckNvZGUoKSxcblx0XHRcdHNoYWRlclN0YWdlOiB0aGlzLl9fc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiB0aGlzLl9fc2hhZGVyU3RhZ2UgPT09ICdmcmFnbWVudCcsXG5cdFx0fTtcblxuXHRcdHJldHVybiBzaGFkZXJpdHlPYmo7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gcHJpdmF0ZSBtZXRob2RzXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHByaXZhdGUgc3RhdGljIF9fZXhpc3ROb25JbnRlZ2VyVmFsdWUodmFsdWVzOiBudW1iZXJbXSkge1xuXHRcdGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG5cdFx0XHRpZiAoIU51bWJlci5pc0ludGVnZXIodmFsdWUpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBUT0RPOiBpbXBsZW1lbnQgc2hhZGVyIGNvZGUgaW1wb3J0IGZlYXR1cmUgKGxvdyBwcmlvcml0eSlcblx0Ly8gcHVibGljIGltcG9ydFNoYWRlckNvZGUoY29kZTogc3RyaW5nKSB7fVxuXG5cdC8vIG5lZWQgdG8gYXBwbHkgU2hhZGVyaXR5LnRyYW5zZm9ybVRvR0xTTEVTMSwgdHJhbnNmb3JtVG9HTFNMRVMzIG9yIHRyYW5zZm9ybVRvIG1ldGhvZFxuXHRwcml2YXRlIF9fY3JlYXRlU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdHRoaXMuX19maWxsRW1wdHlGdW5jdGlvbnMoKTtcblxuXHRcdGNvbnN0IGNvZGVcblx0XHRcdD0gYCN2ZXJzaW9uIDMwMCBlc1xcblxcbmBcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZURlZmluZURpcmVjdGl2ZVNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlRXh0ZW5zaW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVHbG9iYWxQcmVjaXNpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVN0cnVjdERlZmluaXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUdsb2JhbENvbnN0YW50VmFsdWVTaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUF0dHJpYnV0ZURlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVWYXJ5aW5nRGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZU91dHB1dENvbG9yRGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVVuaWZvcm1EZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVVbmlmb3JtQnVmZmVyT2JqZWN0U2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVGdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZU1haW5GdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKCk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdHByaXZhdGUgX19maWxsRW1wdHlGdW5jdGlvbnMoKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9fZnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0aGlzLl9fZnVuY3Rpb25zW2ldID0gdGhpcy5fX2Z1bmN0aW9uc1tpXSA/PyBbXTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlRGVmaW5lRGlyZWN0aXZlU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBkZWZpbmVEaXJlY3RpdmVOYW1lIG9mIHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgI2RlZmluZSAke2RlZmluZURpcmVjdGl2ZU5hbWV9XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpOztcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVFeHRlbnNpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IGV4dGVuc2lvbiBvZiB0aGlzLl9fZXh0ZW5zaW9ucykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgI2V4dGVuc2lvbiAke2V4dGVuc2lvbi5leHRlbnNpb25OYW1lfTogJHtleHRlbnNpb24uYmVoYXZpb3J9XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0Ly9UT0RPOiByZW1vdmUgbmVlZGxlc3MgcHJlY2lzaW9uc1xuXHRwcml2YXRlIF9fY3JlYXRlR2xvYmFsUHJlY2lzaW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB0eXBlIGluIHRoaXMuX19nbG9iYWxQcmVjaXNpb24pIHtcblx0XHRcdGNvbnN0IHByZWNpc2lvblR5cGUgPSB0eXBlIGFzIFNoYWRlclByZWNpc2lvbk9iamVjdEtleTtcblx0XHRcdGNvbnN0IHByZWNpc2lvblF1YWxpZmllciA9IHRoaXMuX19nbG9iYWxQcmVjaXNpb25bcHJlY2lzaW9uVHlwZV07XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYHByZWNpc2lvbiAke3ByZWNpc2lvblF1YWxpZmllcn0gJHtwcmVjaXNpb25UeXBlfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlU3RydWN0RGVmaW5pdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3Qgc3RydWN0RGVmaW5pdGlvbiBvZiB0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYHN0cnVjdCAke3N0cnVjdERlZmluaXRpb24uc3RydWN0TmFtZX0ge1xcbmA7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlID0gc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzW2ldO1xuXG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCAgYDtcblx0XHRcdFx0aWYgKHZhcmlhYmxlLnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJpYWJsZS5wcmVjaXNpb259IGA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcmlhYmxlLnR5cGV9ICR7dmFyaWFibGUubWVtYmVyTmFtZX07XFxuYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZVNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgZ2xvYmFsQ29uc3RhbnRWYWx1ZSBvZiB0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBnbG9iYWxDb25zdGFudFZhbHVlLnR5cGU7XG5cdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSBnbG9iYWxDb25zdGFudFZhbHVlLnZhcmlhYmxlTmFtZTtcblx0XHRcdGNvbnN0IHZhbHVlID0gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YWx1ZXM7XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYGNvbnN0ICR7dHlwZX0gJHt2YXJpYWJsZU5hbWV9ID0gJHt0eXBlfShgO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IHZhbHVlW2ldICsgJywgJztcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSA9IHNoYWRlckNvZGUucmVwbGFjZSgvLFxccyQvLCAnKTtcXG4nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHN0cnVjdFZhbHVlIG9mIHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcykge1xuXHRcdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLmZpbmRJbmRleChkZWZpbml0aW9uID0+IGRlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0VmFsdWUuc3RydWN0TmFtZSk7XG5cdFx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiB0aGUgc3RydWN0IHR5cGUgJHtzdHJ1Y3RWYWx1ZS5zdHJ1Y3ROYW1lfSBpcyBub3QgZGVmaW5lZGApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgY29uc3QgJHtzdHJ1Y3RWYWx1ZS5zdHJ1Y3ROYW1lfSAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gPSAke3N0cnVjdFZhbHVlLnN0cnVjdE5hbWV9IChcXG5gO1xuXG5cdFx0XHRjb25zdCBzdHJ1Y3REZWZpbml0aW9uID0gdGhpcy5fX3N0cnVjdERlZmluaXRpb25zW21hdGNoZWRJbmRleF07XG5cdFx0XHRpZiAoc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzLmxlbmd0aCAhPT0gT2JqZWN0LmtleXMoc3RydWN0VmFsdWUudmFsdWVzKS5sZW5ndGgpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogSW52YWxpZCBudW1iZXIgb2YgdmFyaWFibGVzIHRoYXQgJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9IGhhc2ApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaGFzU2FtcGxlclR5cGUgPVxuXHRcdFx0XHRzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHMuc29tZShtZW1iZXJPYmplY3QgPT4gVXRpbGl0eS5faXNTYW1wbGVyVHlwZShtZW1iZXJPYmplY3QudHlwZSkpO1xuXHRcdFx0aWYgKGhhc1NhbXBsZXJUeXBlKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6IENvbnN0YW50U3RydWN0VmFsdWUgKCR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSkgY2Fubm90IGhhdmUgc2FtcGxlciB0eXBlIHBhcmFtZXRlcmApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzW2ldLm1lbWJlck5hbWU7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gc3RydWN0VmFsdWUudmFsdWVzW3ZhcmlhYmxlTmFtZV1cblx0XHRcdFx0aWYgKHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gZG9lcyBub3QgaGF2ZSB0aGUgdmFsdWUgb2YgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB0eXBlID0gc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzW2ldLnR5cGU7XG5cdFx0XHRcdGNvbnN0IGlzVmFsaWRDb21wb25lbnROdW1iZXIgPSBVdGlsaXR5Ll9pc1ZhbGlkQ29tcG9uZW50Q291bnQodHlwZSwgdmFsdWUpO1xuXHRcdFx0XHRpZiAoIWlzVmFsaWRDb21wb25lbnROdW1iZXIpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiB0aGUgY29tcG9uZW50IGNvdW50IG9mICR7dmFyaWFibGVOYW1lfSBpbiAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gaXMgaW52YWxpZGApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgICAke3R5cGV9KGA7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRzaGFkZXJDb2RlICs9IHZhbHVlW2ldICsgJywgJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNoYWRlckNvZGUgPSBzaGFkZXJDb2RlLnJlcGxhY2UoLyxcXHMkLywgJyksXFxuJyk7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgPSBzaGFkZXJDb2RlLnJlcGxhY2UoLyxcXG4kLywgJ1xcbik7XFxuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVBdHRyaWJ1dGVEZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgYXR0cmlidXRlIG9mIHRoaXMuX19hdHRyaWJ1dGVzKSB7XG5cdFx0XHRpZiAoYXR0cmlidXRlLmxvY2F0aW9uICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgbGF5b3V0IChsb2NhdGlvbiA9ICR7YXR0cmlidXRlLmxvY2F0aW9ufSkgYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgaW4gYDtcblxuXHRcdFx0aWYgKGF0dHJpYnV0ZS5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke2F0dHJpYnV0ZS5wcmVjaXNpb259IGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYCR7YXR0cmlidXRlLnR5cGV9ICR7YXR0cmlidXRlLnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVZhcnlpbmdEZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdmFyeWluZyBvZiB0aGlzLl9fdmFyeWluZ3MpIHtcblx0XHRcdGlmICh2YXJ5aW5nLmludGVycG9sYXRpb25UeXBlICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJ5aW5nLmludGVycG9sYXRpb25UeXBlfSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IHRoaXMuX19zaGFkZXJTdGFnZSA9PSAndmVydGV4JyA/IGBvdXQgYCA6IGBpbiBgO1xuXG5cdFx0XHRpZiAodmFyeWluZy5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcnlpbmcucHJlY2lzaW9ufSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcnlpbmcudHlwZX0gJHt2YXJ5aW5nLnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0Ly9UT0RPOiB0cmFuc2xhdGUgd2hlbiBnbHNsIGVzMVxuXHRwcml2YXRlIF9fY3JlYXRlT3V0cHV0Q29sb3JEZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRpZiAodGhpcy5fX3NoYWRlclN0YWdlICE9PSAnZnJhZ21lbnQnKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGBsYXlvdXQobG9jYXRpb24gPSAwKSBvdXQgdmVjNCAke3RoaXMuX19vdXRwdXRDb2xvclZhcmlhYmxlTmFtZX07XFxuXFxuYDtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVVbmlmb3JtRGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHVuaWZvcm0gb2YgdGhpcy5fX3VuaWZvcm1zKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGB1bmlmb3JtIGA7XG5cblx0XHRcdGlmICh1bmlmb3JtLnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dW5pZm9ybS5wcmVjaXNpb259IGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dW5pZm9ybS50eXBlfSAke3VuaWZvcm0udmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB1bmlmb3JtU3RydWN0IG9mIHRoaXMuX191bmlmb3JtU3RydWN0cykge1xuXHRcdFx0Y29uc3Qgc3RydWN0TmFtZSA9IHVuaWZvcm1TdHJ1Y3Quc3RydWN0TmFtZTtcblxuXHRcdFx0Y29uc3QgZXhpc3RTdHJ1Y3REZWZpbml0aW9uID1cblx0XHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLnNvbWUoZGVmaW5pdGlvbiA9PiBkZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdE5hbWUpO1xuXHRcdFx0aWYgKCFleGlzdFN0cnVjdERlZmluaXRpb24pIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb25TaGFkZXJDb2RlOiB0aGUgc3RydWN0IHR5cGUgJHtzdHJ1Y3ROYW1lfSBpcyBub3QgZGVmaW5lZGApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgdW5pZm9ybSAke3N0cnVjdE5hbWV9ICR7dW5pZm9ybVN0cnVjdC52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVVbmlmb3JtQnVmZmVyT2JqZWN0U2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB1Ym8gb2YgdGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGBsYXlvdXQgKHN0ZDE0MCkgdW5pZm9ybSAke3Viby5ibG9ja05hbWV9IHtcXG5gO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHViby52YXJpYWJsZU9iamVjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVPYmogPSB1Ym8udmFyaWFibGVPYmplY3RzW2ldO1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAgICR7dmFyaWFibGVPYmoudHlwZX0gJHt2YXJpYWJsZU9iai52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh1Ym8uaW5zdGFuY2VOYW1lICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgfSAke3Viby5pbnN0YW5jZU5hbWV9O1xcbmA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGB9O1xcbmA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVGdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX19mdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGZ1bmN0aW9uT2JqZWN0cyA9IHRoaXMuX19mdW5jdGlvbnNbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGZ1bmN0aW9uT2JqZWN0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGZ1bmN0aW9uT2JqZWN0c1tqXS5mdW5jdGlvbkNvZGUgKyBgXFxuYDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZU1haW5GdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuX19tYWluRnVuY3Rpb25Db2RlICsgYFxcbmA7XG5cdH1cbn1cbiIsImltcG9ydCB7U2hhZGVyQXR0cmlidXRlVmFyVHlwZSwgU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMsIFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzLCBTaGFkZXJWYXJ5aW5nVmFyVHlwZX0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxpdHkge1xuXHRzdGF0aWMgX3NwbGl0QnlMaW5lRmVlZENvZGUoc291cmNlOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gc291cmNlLnNwbGl0KC9cXHJcXG58XFxuLyk7XG5cdH1cblxuXHRzdGF0aWMgX2pvaW5TcGxpdHRlZExpbmUoc3BsaXR0ZWRMaW5lOiBzdHJpbmdbXSkge1xuXHRcdHJldHVybiBzcGxpdHRlZExpbmUuam9pbignXFxuJyk7XG5cdH1cblxuXHRzdGF0aWMgX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzb3VyY2U6IHN0cmluZykge1xuXHRcdHJldHVybiBzb3VyY2UgPT09ICcnID8gc291cmNlIDogc291cmNlICsgJ1xcbic7XG5cdH1cblxuXHRzdGF0aWMgX2NvbXBvbmVudE51bWJlcihcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzXG5cdCkge1xuXHRcdGxldCBjb21wb25lbnROdW1iZXI7XG5cdFx0aWYgKFxuXHRcdFx0dHlwZSA9PT0gJ2Zsb2F0JyB8fCB0eXBlID09PSAnaW50JyB8fCB0eXBlID09PSAnYm9vbCcgfHwgdHlwZSA9PT0gJ3VpbnQnIHx8XG5cdFx0XHR0eXBlID09PSAnc2FtcGxlcjJEJyB8fCB0eXBlID09PSAnc2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICdzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICdzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICdpc2FtcGxlcjJEJyB8fCB0eXBlID09PSAnaXNhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAnaXNhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICd1c2FtcGxlcjJEJyB8fCB0eXBlID09PSAndXNhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAndXNhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICdzYW1wbGVyMkRTaGFkb3cnIHx8IHR5cGUgPT09ICdzYW1wbGVyQ3ViZVNoYWRvdycgfHwgdHlwZSA9PT0gJ3NhbXBsZXIyREFycmF5U2hhZG93J1xuXHRcdCkge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMTtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZWMyJyB8fCB0eXBlID09PSAnaXZlYzInIHx8IHR5cGUgPT09ICdidmVjMicgfHwgdHlwZSA9PT0gJ3V2ZWMyJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMjtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZWMzJyB8fCB0eXBlID09PSAnaXZlYzMnIHx8IHR5cGUgPT09ICdidmVjMycgfHwgdHlwZSA9PT0gJ3V2ZWMzJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMztcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZWM0JyB8fCB0eXBlID09PSAnaXZlYzQnIHx8IHR5cGUgPT09ICdidmVjNCcgfHwgdHlwZSA9PT0gJ3V2ZWM0JyB8fCB0eXBlID09PSAnbWF0MicgfHwgdHlwZSA9PT0gJ21hdDJ4MicpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDQ7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0MngzJyB8fCB0eXBlID09PSAnbWF0M3gyJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gNjtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQyeDQnIHx8IHR5cGUgPT09ICdtYXQ0eDInKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSA4O1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDMnIHx8IHR5cGUgPT09ICdtYXQzeDMnKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSA5O1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDN4NCcgfHwgdHlwZSA9PT0gJ21hdDR4MycpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDEyO1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDQnIHx8IHR5cGUgPT09ICdtYXQ0eDQnKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAxNjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gdW5rbm93biB0eXBlXG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAwO1xuXHRcdFx0Y29uc29sZS5lcnJvcignVXRpbGl0eS5fY29tcG9uZW50TnVtYmVyOiBkZXRlY3QgdW5rbm93biB0eXBlJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbXBvbmVudE51bWJlcjtcblx0fVxuXG5cdHN0YXRpYyBfaXNJbnRUeXBlKFxuXHRcdHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIHwgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSB8IFNoYWRlclZhcnlpbmdWYXJUeXBlIHwgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzNcblx0KSB7XG5cdFx0aWYgKFxuXHRcdFx0dHlwZSA9PT0gJ2ludCcgfHwgdHlwZSA9PT0gJ2l2ZWMyJyB8fCB0eXBlID09PSAnaXZlYzMnIHx8IHR5cGUgPT09ICdpdmVjNCcgfHxcblx0XHRcdHR5cGUgPT09ICd1aW50JyB8fCB0eXBlID09PSAndXZlYzInIHx8IHR5cGUgPT09ICd1dmVjMycgfHwgdHlwZSA9PT0gJ3V2ZWM0J1xuXHRcdCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgX2lzVmFsaWRDb21wb25lbnRDb3VudChcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzLFxuXHRcdHZhbHVlczogbnVtYmVyW11cblx0KSB7XG5cdFx0Y29uc3QgdmFsaWRDb21wb25lbnRDb3VudCA9IFV0aWxpdHkuX2NvbXBvbmVudE51bWJlcih0eXBlKTtcblx0XHRpZiAodmFsaWRDb21wb25lbnRDb3VudCA9PT0gdmFsdWVzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHN0YXRpYyBfaXNTYW1wbGVyVHlwZShcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzXG5cdCkge1xuXHRcdGlmIChcblx0XHRcdHR5cGUgPT09ICdzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICdzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ3NhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ3NhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ2lzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICdpc2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICdpc2FtcGxlcjNEJyB8fCB0eXBlID09PSAnaXNhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3VzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICd1c2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICd1c2FtcGxlcjNEJyB8fCB0eXBlID09PSAndXNhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3NhbXBsZXIyRFNoYWRvdycgfHwgdHlwZSA9PT0gJ3NhbXBsZXJDdWJlU2hhZG93JyB8fCB0eXBlID09PSAnc2FtcGxlcjJEQXJyYXlTaGFkb3cnXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==