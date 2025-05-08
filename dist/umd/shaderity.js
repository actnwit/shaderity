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
    static process(splittedLines) {
        const define = /#define[\t ]+(\w+)/;
        const ifdef = /#ifdef[\t ]+(\w+)/;
        const elif = /#elif[\t ]+defined\((\w+)\)/;
        const _else = /#else/;
        const endif = /#endif/;
        const outputHistory = [];
        let outputFlg = true;
        const definitions = [];
        const ifdefs = [];
        const ifdefMatched = [];
        const outputLines = [];
        for (let i = 0; i < splittedLines.length; i++) {
            const line = splittedLines[i];
            let isPragma = false;
            { // #define
                const re = line.match(define);
                if (re != null) {
                    definitions.push(re[1]);
                    isPragma = true;
                }
            }
            if (outputHistory.indexOf(false) === -1) { // #ifdef
                const re = line.match(ifdef);
                if (re != null) {
                    outputHistory.push(outputFlg);
                    const toCheckDef = re[1];
                    ifdefs.push([toCheckDef]);
                    if (definitions.indexOf(toCheckDef) === -1) {
                        outputFlg = false;
                        ifdefMatched.push(false);
                    }
                    else {
                        ifdefMatched.push(true);
                    }
                    isPragma = true;
                }
            }
            if (outputHistory.indexOf(false) === -1) { // #elif
                const re = line.match(elif);
                if (re != null) {
                    const toCheckDef = re[1];
                    const currentIfdefs = ifdefs[ifdefs.length - 1];
                    if (!ifdefMatched[ifdefMatched.length - 1]) {
                        if (definitions.indexOf(toCheckDef) !== -1) {
                            outputFlg = true;
                            ifdefMatched[ifdefMatched.length - 1] = true;
                        }
                        else {
                            outputFlg = false;
                        }
                    }
                    else {
                        outputFlg = false;
                    }
                    currentIfdefs.push(toCheckDef);
                    isPragma = true;
                }
            }
            if (outputHistory.indexOf(false) === -1) { // #else
                const re = line.match(_else);
                if (re != null) {
                    outputFlg = !ifdefMatched[ifdefMatched.length - 1];
                    isPragma = true;
                }
            }
            { // #endif
                const re = line.match(endif);
                if (re != null) {
                    if (outputHistory.indexOf(false) === -1) {
                        outputFlg = outputHistory[outputHistory.length - 1];
                    }
                    isPragma = true;
                    ifdefs.pop();
                    ifdefMatched.pop();
                    outputHistory.pop();
                }
            }
            if (outputFlg && !isPragma) {
                outputLines.push(line);
            }
        }
        return outputLines;
    }
}
exports.default = PreProcessor;


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
    static processPragma(obj) {
        const splittedShaderCode = Utility_1.default._splitByLineFeedCode(obj.code);
        const transformedSplittedShaderCode = PreProcessor_1.default.process(splittedShaderCode);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TaGFkZXJpdHkvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1NoYWRlcml0eS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9TaGFkZXJpdHkvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vU2hhZGVyaXR5Ly4vc3JjL21haW4vUHJlUHJvY2Vzc29yLnRzIiwid2VicGFjazovL1NoYWRlcml0eS8uL3NyYy9tYWluL1JlZmxlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vU2hhZGVyaXR5Ly4vc3JjL21haW4vU2hhZGVyRWRpdG9yLnRzIiwid2VicGFjazovL1NoYWRlcml0eS8uL3NyYy9tYWluL1NoYWRlclRyYW5zZm9ybWVyLnRzIiwid2VicGFjazovL1NoYWRlcml0eS8uL3NyYy9tYWluL1NoYWRlcml0eS50cyIsIndlYnBhY2s6Ly9TaGFkZXJpdHkvLi9zcmMvbWFpbi9TaGFkZXJpdHlPYmplY3RDcmVhdG9yLnRzIiwid2VicGFjazovL1NoYWRlcml0eS8uL3NyYy9tYWluL1V0aWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87UUNWQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5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QUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLGNBQWMs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QUFJLEtBQUssaUJBQWlCO1lBQ3ZHLElBQUksS0FBSyxpQkFBaUIsSUFBSSxJQUFJLEtBQUssbUJBQW1CLElBQUksSUFBSSxLQUFLLHNCQUFzQixFQUM1RjtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ1o7YUFBTTtZQUNOLE9BQU8sS0FBSyxDQUFDO1NBQ2I7SUFDRixDQUFDO0NBQ0Q7QUF4RkQsMEJBd0ZDIiwiZmlsZSI6InNoYWRlcml0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlNoYWRlcml0eVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTaGFkZXJpdHlcIl0gPSBmYWN0b3J5KCk7XG59KSh3aW5kb3csIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiLi8uLi8uLi9kaXN0L1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCBTaGFkZXJpdHkgZnJvbSAnLi9tYWluL1NoYWRlcml0eSc7XHJcbmltcG9ydCBfU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciBmcm9tICcuL21haW4vU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcic7XHJcbmltcG9ydCBfUmVmbGVjdGlvbiBmcm9tICcuL21haW4vUmVmbGVjdGlvbic7XHJcblxyXG5pbXBvcnQge1xyXG4gIEF0dHJpYnV0ZVNlbWFudGljcyBhcyBfQXR0cmlidXRlU2VtYW50aWNzLFxyXG4gIFJlZmxlY3Rpb25BdHRyaWJ1dGUgYXMgX1JlZmxlY3Rpb25BdHRyaWJ1dGUsXHJcbiAgUmVmbGVjdGlvblVuaWZvcm0gYXMgX1JlZmxlY3Rpb25Vbmlmb3JtLFxyXG4gIFJlZmxlY3Rpb25WYXJ5aW5nIGFzIF9SZWZsZWN0aW9uVmFyeWluZyxcclxuICBTaGFkZXJpdHlPYmplY3QgYXMgX1NoYWRlcml0eU9iamVjdCxcclxuICBTaGFkZXJFeHRlbnNpb25CZWhhdmlvciBhcyBfU2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3IsXHJcbiAgU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgYXMgX1NoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzLFxyXG4gIFNoYWRlclByZWNpc2lvbk9iamVjdCBhcyBfU2hhZGVyUHJlY2lzaW9uT2JqZWN0LFxyXG4gIFNoYWRlclN0YWdlU3RyIGFzIF9TaGFkZXJTdGFnZVN0cixcclxuICBTaGFkZXJQcmVjaXNpb25UeXBlIGFzIF9TaGFkZXJQcmVjaXNpb25UeXBlLFxyXG4gIFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgYXMgX1NoYWRlckF0dHJpYnV0ZVZhclR5cGUsXHJcbiAgU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlIGFzIF9TaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUsXHJcbiAgU2hhZGVyVmFyeWluZ1ZhclR5cGUgYXMgX1NoYWRlclZhcnlpbmdWYXJUeXBlLFxyXG4gIFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzIGFzIF9TaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyxcclxuICBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3QgYXMgX1NoYWRlclN0cnVjdE1lbWJlck9iamVjdCxcclxuICBTaGFkZXJVQk9WYXJpYWJsZU9iamVjdCBhcyBfU2hhZGVyVUJPVmFyaWFibGVPYmplY3QsXHJcbiAgU2hhZGVyQXR0cmlidXRlT2JqZWN0IGFzIF9TaGFkZXJBdHRyaWJ1dGVPYmplY3QsXHJcbiAgU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdCBhcyBfU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdCxcclxuICBTaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0IGFzIF9TaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0LFxyXG4gIFNoYWRlckV4dGVuc2lvbk9iamVjdCBhcyBfU2hhZGVyRXh0ZW5zaW9uT2JqZWN0LFxyXG4gIFNoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3QgYXMgX1NoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3QsXHJcbiAgU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdCBhcyBfU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdCxcclxuICBTaGFkZXJVbmlmb3JtT2JqZWN0IGFzIF9TaGFkZXJVbmlmb3JtT2JqZWN0LFxyXG4gIFNoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3QgYXMgX1NoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3QsXHJcbiAgU2hhZGVyVmFyeWluZ09iamVjdCBhcyBfU2hhZGVyVmFyeWluZ09iamVjdCxcclxuICBTaGFkZXJWZXJzaW9uIGFzIF9TaGFkZXJWZXJzaW9uLFxyXG4gIFRlbXBsYXRlT2JqZWN0IGFzIF9UZW1wbGF0ZU9iamVjdCxcclxuICBVbmlmb3JtU2VtYW50aWNzIGFzIF9Vbmlmb3JtU2VtYW50aWNzLFxyXG4gIFZhclR5cGUgYXMgX1ZhclR5cGUsXHJcbn0gZnJvbSAnLi90eXBlcy90eXBlJztcclxuXHJcbmV4cG9ydCB7XHJcbiAgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciBhcyBfU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcixcclxuICBSZWZsZWN0aW9uIGFzIF9SZWZsZWN0aW9uLFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBdHRyaWJ1dGVTZW1hbnRpY3MgPSBfQXR0cmlidXRlU2VtYW50aWNzO1xyXG5leHBvcnQgdHlwZSBSZWZsZWN0aW9uQXR0cmlidXRlID0gX1JlZmxlY3Rpb25BdHRyaWJ1dGU7XHJcbmV4cG9ydCB0eXBlIFJlZmxlY3Rpb25Vbmlmb3JtID0gX1JlZmxlY3Rpb25Vbmlmb3JtO1xyXG5leHBvcnQgdHlwZSBSZWZsZWN0aW9uVmFyeWluZyA9IF9SZWZsZWN0aW9uVmFyeWluZztcclxuZXhwb3J0IHR5cGUgU2hhZGVyaXR5T2JqZWN0ID0gX1NoYWRlcml0eU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3IgPSBfU2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3I7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzID0gX1NoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJQcmVjaXNpb25PYmplY3QgPSBfU2hhZGVyUHJlY2lzaW9uT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJTdGFnZVN0ciA9IF9TaGFkZXJTdGFnZVN0cjtcclxuZXhwb3J0IHR5cGUgU2hhZGVyUHJlY2lzaW9uVHlwZSA9IF9TaGFkZXJQcmVjaXNpb25UeXBlO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlID0gX1NoYWRlckF0dHJpYnV0ZVZhclR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSA9IF9TaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclZhcnlpbmdWYXJUeXBlID0gX1NoYWRlclZhcnlpbmdWYXJUeXBlO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyA9IF9TaGFkZXJVbmlmb3JtVmFyVHlwZUVTMztcclxuZXhwb3J0IHR5cGUgU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0ID0gX1NoYWRlclN0cnVjdE1lbWJlck9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVUJPVmFyaWFibGVPYmplY3QgPSBfU2hhZGVyVUJPVmFyaWFibGVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckF0dHJpYnV0ZU9iamVjdCA9IF9TaGFkZXJBdHRyaWJ1dGVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3QgPSBfU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdCA9IF9TaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJFeHRlbnNpb25PYmplY3QgPSBfU2hhZGVyRXh0ZW5zaW9uT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0ID0gX1NoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVuaWZvcm1CdWZmZXJPYmplY3QgPSBfU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVW5pZm9ybU9iamVjdCA9IF9TaGFkZXJVbmlmb3JtT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0ID0gX1NoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclZhcnlpbmdPYmplY3QgPSBfU2hhZGVyVmFyeWluZ09iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmVyc2lvbiA9IF9TaGFkZXJWZXJzaW9uO1xyXG5leHBvcnQgdHlwZSBUZW1wbGF0ZU9iamVjdCA9IF9UZW1wbGF0ZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgVW5pZm9ybVNlbWFudGljcyA9IF9Vbmlmb3JtU2VtYW50aWNzO1xyXG5leHBvcnQgdHlwZSBWYXJUeXBlID0gX1ZhclR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlcml0eU9iamVjdENyZWF0b3IgPSBfU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcjtcclxuZXhwb3J0IHR5cGUgUmVmbGVjdGlvbiA9IF9SZWZsZWN0aW9uO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2hhZGVyaXR5XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZVByb2Nlc3NvciB7XG4gICAgcHVibGljIHN0YXRpYyBwcm9jZXNzKHNwbGl0dGVkTGluZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICAgICAgICBjb25zdCBkZWZpbmUgPSAvI2RlZmluZVtcXHQgXSsoXFx3KykvO1xuICAgICAgICBjb25zdCBpZmRlZiA9IC8jaWZkZWZbXFx0IF0rKFxcdyspLztcbiAgICAgICAgY29uc3QgZWxpZiA9IC8jZWxpZltcXHQgXStkZWZpbmVkXFwoKFxcdyspXFwpLztcbiAgICAgICAgY29uc3QgX2Vsc2UgPSAvI2Vsc2UvO1xuICAgICAgICBjb25zdCBlbmRpZiA9IC8jZW5kaWYvO1xuICAgICAgICBjb25zdCBvdXRwdXRIaXN0b3J5OiBib29sZWFuW10gPSBbXTtcbiAgICAgICAgbGV0IG91dHB1dEZsZyA9IHRydWU7XG4gICAgICAgIGNvbnN0IGRlZmluaXRpb25zOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBjb25zdCBpZmRlZnM6IHN0cmluZ1tdW10gPSBbXTtcbiAgICAgICAgY29uc3QgaWZkZWZNYXRjaGVkOiBib29sZWFuW10gPSBbXTtcbiAgICAgICAgY29uc3Qgb3V0cHV0TGluZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZExpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gc3BsaXR0ZWRMaW5lc1tpXTtcbiAgICAgICAgICAgIGxldCBpc1ByYWdtYSA9IGZhbHNlO1xuICAgICAgICAgICAgeyAvLyAjZGVmaW5lXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBsaW5lLm1hdGNoKGRlZmluZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5pdGlvbnMucHVzaChyZVsxXSk7XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvdXRwdXRIaXN0b3J5LmluZGV4T2YoZmFsc2UpID09PSAtMSkgeyAvLyAjaWZkZWZcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IGxpbmUubWF0Y2goaWZkZWYpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEhpc3RvcnkucHVzaChvdXRwdXRGbGcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b0NoZWNrRGVmID0gcmVbMV07XG4gICAgICAgICAgICAgICAgICAgIGlmZGVmcy5wdXNoKFt0b0NoZWNrRGVmXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZpbml0aW9ucy5pbmRleE9mKHRvQ2hlY2tEZWYpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZmRlZk1hdGNoZWQucHVzaChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZmRlZk1hdGNoZWQucHVzaCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpc1ByYWdtYSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3V0cHV0SGlzdG9yeS5pbmRleE9mKGZhbHNlKSA9PT0gLTEpIHsgLy8gI2VsaWZcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IGxpbmUubWF0Y2goZWxpZik7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9DaGVja0RlZiA9IHJlWzFdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SWZkZWZzID0gaWZkZWZzW2lmZGVmcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpZmRlZk1hdGNoZWRbaWZkZWZNYXRjaGVkLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVmaW5pdGlvbnMuaW5kZXhPZih0b0NoZWNrRGVmKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmZGVmTWF0Y2hlZFtpZmRlZk1hdGNoZWQubGVuZ3RoIC0gMV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dEZsZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJZmRlZnMucHVzaCh0b0NoZWNrRGVmKTtcbiAgICAgICAgICAgICAgICAgICAgaXNQcmFnbWEgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG91dHB1dEhpc3RvcnkuaW5kZXhPZihmYWxzZSkgPT09IC0xKSB7IC8vICNlbHNlXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBsaW5lLm1hdGNoKF9lbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAocmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSAhaWZkZWZNYXRjaGVkW2lmZGVmTWF0Y2hlZC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaXNQcmFnbWEgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeyAvLyAjZW5kaWZcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IGxpbmUubWF0Y2goZW5kaWYpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXRIaXN0b3J5LmluZGV4T2YoZmFsc2UpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gb3V0cHV0SGlzdG9yeVtvdXRwdXRIaXN0b3J5Lmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWZkZWZzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZmRlZk1hdGNoZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEhpc3RvcnkucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3V0cHV0RmxnICYmICFpc1ByYWdtYSkge1xuICAgICAgICAgICAgICAgIG91dHB1dExpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dExpbmVzO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHtcblx0QXR0cmlidXRlU2VtYW50aWNzLFxuXHRSZWZsZWN0aW9uQXR0cmlidXRlLFxuXHRSZWZsZWN0aW9uVW5pZm9ybSxcblx0UmVmbGVjdGlvblZhcnlpbmcsXG5cdFNoYWRlclN0YWdlU3RyLFxuXHRVbmlmb3JtU2VtYW50aWNzLFxuXHRWYXJUeXBlLFxufSBmcm9tICcuLi90eXBlcy90eXBlJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGdldHMgdGhlIGF0dHJpYnV0ZSwgdmFyeWluZywgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24gZnJvbSB0aGUgY29kZSBwcm9wZXJ0eSBvZiBhIHNoYWRlcml0eSBvYmplY3QuXG4gKiBUaGUgbWV0aG9kcyBvZiB0aGUgU2hhZGVyaXR5IGluc3RhbmNlIGNyZWF0ZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzLlxuICpcbiAqIEJlZm9yZSBnZXR0aW5nIHRoZSBpbmZvcm1hdGlvbiBvZiB0aGUgYXR0cmlidXRlLCB2YXJ5aW5nLCBhbmQgdW5pZm9ybSwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVmbGVjdGlvbiB7XG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGF0dHJpYnV0ZUFuZFZhcnlpbmdUeXBlUmVnRXhwXG5cdFx0PSAvW1xcdCBdKyhmbG9hdHxpbnR8dmVjMnx2ZWMzfHZlYzR8bWF0MnxtYXQzfG1hdDR8aXZlYzJ8aXZlYzN8aXZlYzQpW1xcdCBdKyhcXHcrKTsvO1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSB1bmlmb3JtVHlwZVJlZ0V4cFxuXHRcdD0gL1tcXHQgXSsoZmxvYXR8aW50fHZlYzJ8dmVjM3x2ZWM0fG1hdDJ8bWF0M3xtYXQ0fGl2ZWMyfGl2ZWMzfGl2ZWM0fHNhbXBsZXIyRHxzYW1wbGVyQ3ViZXxzYW1wbGVyM0QpW1xcdCBdKyhcXHcrKTsvO1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBzZW1hbnRpY1JlZ0V4cCA9IC88LipzZW1hbnRpY1tcXHQgXSo9W1xcdCBdKihcXHcrKS4qPi87XG5cblx0cHJpdmF0ZSBfX2F0dHJpYnV0ZVNlbWFudGljc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdHByaXZhdGUgX191bmlmb3JtU2VtYW50aWNzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblx0cHJpdmF0ZSBfX2F0dHJpYnV0ZXM6IFJlZmxlY3Rpb25BdHRyaWJ1dGVbXSA9IFtdO1xuXHRwcml2YXRlIF9fdmFyeWluZ3M6IFJlZmxlY3Rpb25WYXJ5aW5nW10gPSBbXTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1zOiBSZWZsZWN0aW9uVW5pZm9ybVtdID0gW107XG5cblx0cHJpdmF0ZSByZWFkb25seSBfX3NwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW107XG5cdHByaXZhdGUgcmVhZG9ubHkgX19zaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHI7XG5cblx0Y29uc3RydWN0b3Ioc3BsaXR0ZWRTaGFkZXJpdHlTaGFkZXJDb2RlOiBzdHJpbmdbXSwgc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0dGhpcy5fX3NwbGl0dGVkU2hhZGVyQ29kZSA9IHNwbGl0dGVkU2hhZGVyaXR5U2hhZGVyQ29kZTtcblx0XHR0aGlzLl9fc2hhZGVyU3RhZ2UgPSBzaGFkZXJTdGFnZTtcblx0XHR0aGlzLl9fc2V0RGVmYXVsdEF0dHJpYnV0ZUFuZFVuaWZvcm1TZW1hbnRpY3NNYXAoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFsbCBhdHRyaWJ1dGUgdmFyaWFibGUgaW5mb3JtYXRpb24gaW4gdGhlIHNoYWRlciBjb2RlLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgUmVmbGVjdGlvbkF0dHJpYnV0ZSBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgYXR0cmlidXRlcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXM7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhbGwgdmFyeWluZyB2YXJpYWJsZSBpbmZvcm1hdGlvbiBpbiB0aGUgc2hhZGVyIGNvZGUuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBSZWZsZWN0aW9uVmFyeWluZyBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgdmFyeWluZ3MoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX192YXJ5aW5ncztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFsbCB1bmlmb3JtIHZhcmlhYmxlIGluZm9ybWF0aW9uIGluIHRoZSBzaGFkZXIgY29kZS5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIFJlZmxlY3Rpb25Vbmlmb3JtIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCB1bmlmb3JtcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX3VuaWZvcm1zO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgbmFtZXMgb2YgYWxsIGF0dHJpYnV0ZXMgaW5jbHVkZWQgaW4gdGhlIHNoYWRlci5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIHN0cmluZ1xuXHQgKi9cblx0cHVibGljIGdldCBhdHRyaWJ1dGVzTmFtZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7cmV0dXJuIGF0dHJpYnV0ZS5uYW1lfSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBhdHRyaWJ1dGUgc2VtYW50aWMgKGUuZy4gJ1BPU0lUSU9OJykgb2YgYWxsIGF0dHJpYnV0ZXMgaW5jbHVkZWQgaW4gdGhlIHNoYWRlci5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIEF0dHJpYnV0ZVNlbWFudGljcyBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgYXR0cmlidXRlc1NlbWFudGljcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtyZXR1cm4gYXR0cmlidXRlLnNlbWFudGljfSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSB2YXJpYWJsZSB0eXBlIChlLmcuICd2ZWM0Jykgb2YgYWxsIGF0dHJpYnV0ZXMgaW5jbHVkZWQgaW4gdGhlIHNoYWRlci5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIFZhclR5cGUgb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGF0dHJpYnV0ZXNUeXBlcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtyZXR1cm4gYXR0cmlidXRlLnR5cGV9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYW4gYXR0cmlidXRlU2VtYW50aWNzLlxuXHQgKiBUaGUgYXR0cmlidXRlU2VtYW50aWNzIGlzIHVzZWQgaW4gdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWNzXG5cdCAqIChTZWUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBjbGFzcylcblx0ICovXG5cdHB1YmxpYyBhZGRBdHRyaWJ1dGVTZW1hbnRpY3NNYXAobWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+KSB7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcCA9IG5ldyBNYXAoWy4uLnRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAsIC4uLm1hcF0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhIHVuaWZvcm1TZW1hbnRpY3MuXG5cdCAqIFRoZSBhdHRyaWJ1dGVTZW1hbnRpY3MgaXMgdXNlZCBpbiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpY3Ncblx0ICogKFNlZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGNsYXNzKVxuXHQgKi9cblx0cHVibGljIGFkZFVuaWZvcm1TZW1hbnRpY3NNYXAobWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+KSB7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAgPSBuZXcgTWFwKFsuLi50aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcCwgLi4ubWFwXSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGFuIGF0dHJpYnV0ZVNlbWFudGljcy5cblx0ICogVGhlIGF0dHJpYnV0ZVNlbWFudGljcyBpcyB1c2VkIGluIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljc1xuXHQgKiAoU2VlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgY2xhc3MpXG5cdCAqL1xuXHRwdWJsaWMgYWRkQXR0cmlidXRlU2VtYW50aWNzKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoa2V5LCB2YWx1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGEgdW5pZm9ybVNlbWFudGljcy5cblx0ICogVGhlIGF0dHJpYnV0ZVNlbWFudGljcyBpcyB1c2VkIGluIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljc1xuXHQgKiAoU2VlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgY2xhc3MpXG5cdCAqL1xuXHRwdWJsaWMgYWRkVW5pZm9ybVNlbWFudGljcyhrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldChrZXksIHZhbHVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIGF0dHJpYnV0ZVNlbWFudGljc1xuXHQgKi9cblx0cHVibGljIHJlc2V0QXR0cmlidXRlU2VtYW50aWNzKCkge1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdW5pZm9ybVNlbWFudGljc1xuXHQgKi9cblx0cHVibGljIHJlc2V0VW5pZm9ybVNlbWFudGljcygpIHtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdH1cblxuXHQvKipcblx0ICogQW5hbHl6ZSBzaGFkZXIgY29kZSBvZiB0aGUgc2hhZGVyaXR5IGFuZCBnZXQgaW5mb3JtYXRpb24gb2YgYXR0cmlidXRlLCB2YXJ5aW5nIGFuZCB1bmlmb3JtLlxuXHQgKiBUaGUgaW5mb3JtYXRpb24gY2FuIGJlIHJldHJpZXZlZCBmcm9tIHRoZSBnZXQgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqXG5cdCAqIFRoZSBzZW1hbnRpYyBwcm9wZXJ0eSBvZiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZSBpcyBhc3NpZ25lZCB0byB0aGUgdmFsdWUgb2YgdGhlIHNlbWFudGljIGlmXG5cdCAqIGl0IGlzIHNwZWNpZmllZCBpbiB0aGUgYXR0cmlidXRlIGxpbmUgb2YgdGhlIHNoYWRlciBjb2RlLiBJZiBub3QsIHRoZSBBdHRyaWJ1dGVTZW1hbnRpY3NNYXBcblx0ICogaXMgc2VhcmNoZWQgZm9yIG1hdGNoaW5nIHNlbWFudGljcywgb3IgVU5LTk9XTi4gVGhlIHNhbWUgYXBwbGllcyB0byB0aGUgc2VtYW50aWMgcHJvcGVydHkgb2Zcblx0ICogUmVmbGVjdGlvblVuaWZvcm0uXG5cdCAqL1xuXHRwdWJsaWMgcmVmbGVjdCgpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSB0aGlzLl9fc3BsaXR0ZWRTaGFkZXJDb2RlO1xuXHRcdGNvbnN0IHNoYWRlclN0YWdlID0gdGhpcy5fX3NoYWRlclN0YWdlO1xuXG5cdFx0Zm9yIChjb25zdCBzaGFkZXJDb2RlTGluZSBvZiBzcGxpdHRlZFNoYWRlckNvZGUpIHtcblx0XHRcdGNvbnN0IGlzQXR0cmlidXRlTGluZSA9IHRoaXMuX19tYXRjaEF0dHJpYnV0ZShzaGFkZXJDb2RlTGluZSwgc2hhZGVyU3RhZ2UpO1xuXHRcdFx0aWYgKGlzQXR0cmlidXRlTGluZSkge1xuXHRcdFx0XHR0aGlzLl9fYWRkQXR0cmlidXRlKHNoYWRlckNvZGVMaW5lKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzVmFyeWluZ0xpbmUgPSB0aGlzLl9fbWF0Y2hWYXJ5aW5nKHNoYWRlckNvZGVMaW5lLCBzaGFkZXJTdGFnZSk7XG5cdFx0XHRpZiAoaXNWYXJ5aW5nTGluZSkge1xuXHRcdFx0XHR0aGlzLl9fYWRkVmFyeWluZyhzaGFkZXJDb2RlTGluZSwgc2hhZGVyU3RhZ2UpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaXNVbmlmb3JtTGluZSA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKnVuaWZvcm1bXFx0IF0rLyk7XG5cdFx0XHRpZiAoaXNVbmlmb3JtTGluZSkge1xuXHRcdFx0XHR0aGlzLl9fYWRkVW5pZm9ybShzaGFkZXJDb2RlTGluZSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX19zZXREZWZhdWx0QXR0cmlidXRlQW5kVW5pZm9ybVNlbWFudGljc01hcCgpIHtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgncG9zaXRpb24nLCAnUE9TSVRJT04nKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnY29sb3IkJywgJ0NPTE9SXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnY29sb3JfPzAnLCAnQ09MT1JfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0ZXhjb29yZCQnLCAnVEVYQ09PUkRfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0ZXhjb29yZF8/MCcsICdURVhDT09SRF8wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RleGNvb3JkXz8xJywgJ1RFWENPT1JEXzEnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGV4Y29vcmRfPzInLCAnVEVYQ09PUkRfMicpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdub3JtYWwnLCAnTk9STUFMJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RhbmdlbnQnLCAnVEFOR0VOVCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdqb2ludCQnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnYm9uZSQnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnam9pbnRfPzAnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnYm9uZV8/MCcsICdKT0lOVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd3ZWlnaHQkJywgJ1dFSUdIVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd3ZWlnaHRfPzAnLCAnV0VJR0hUU18wJyk7XG5cblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ3dvcmxkbWF0cml4JywgJ1dvcmxkTWF0cml4Jyk7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCdub3JtYWxtYXRyaXgnLCAnTm9ybWFsTWF0cml4Jyk7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCd2aWV3bWF0cml4JywgJ1ZpZXdNYXRyaXgnKTtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ3Byb2plY3Rpb25tYXRyaXgnLCAnUHJvamVjdGlvbk1hdHJpeCcpO1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgnbW9kZWx2aWV3bWF0cml4JywgJ01vZGVsVmlld01hdHJpeCcpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX21hdGNoQXR0cmlidXRlKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcsIHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdGlmIChzaGFkZXJTdGFnZSAhPT0gJ3ZlcnRleCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKihhdHRyaWJ1dGV8aW4pW1xcdCBdKy4rOy8pO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2FkZEF0dHJpYnV0ZShzaGFkZXJDb2RlTGluZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgcmVmbGVjdGlvbkF0dHJpYnV0ZTogUmVmbGVjdGlvbkF0dHJpYnV0ZSA9IHtcblx0XHRcdG5hbWU6ICcnLFxuXHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdHNlbWFudGljOiAnVU5LTk9XTidcblx0XHR9O1xuXG5cdFx0Y29uc3QgbWF0Y2hUeXBlID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi5hdHRyaWJ1dGVBbmRWYXJ5aW5nVHlwZVJlZ0V4cCk7XG5cdFx0aWYgKG1hdGNoVHlwZSkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IG1hdGNoVHlwZVsxXTtcblx0XHRcdHJlZmxlY3Rpb25BdHRyaWJ1dGUudHlwZSA9IHR5cGUgYXMgVmFyVHlwZTtcblx0XHRcdGNvbnN0IG5hbWUgPSBtYXRjaFR5cGVbMl07XG5cdFx0XHRyZWZsZWN0aW9uQXR0cmlidXRlLm5hbWUgPSBuYW1lO1xuXG5cdFx0XHRjb25zdCBtYXRjaFNlbWFudGljID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi5zZW1hbnRpY1JlZ0V4cClcblx0XHRcdGlmIChtYXRjaFNlbWFudGljKSB7XG5cdFx0XHRcdHJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWMgPSBtYXRjaFNlbWFudGljWzFdIGFzIEF0dHJpYnV0ZVNlbWFudGljcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiB0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwKSB7XG5cdFx0XHRcdFx0aWYgKG5hbWUubWF0Y2gobmV3IFJlZ0V4cChrZXksICdpJykpKSB7XG5cdFx0XHRcdFx0XHRyZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljID0gdmFsdWUgYXMgQXR0cmlidXRlU2VtYW50aWNzO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLl9fYXR0cmlidXRlcy5wdXNoKHJlZmxlY3Rpb25BdHRyaWJ1dGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX21hdGNoVmFyeWluZyhzaGFkZXJDb2RlTGluZTogc3RyaW5nLCBzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHRpZiAoc2hhZGVyU3RhZ2UgPT09ICd2ZXJ0ZXgnKSB7XG5cdFx0XHRyZXR1cm4gc2hhZGVyQ29kZUxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qKHZhcnlpbmd8b3V0KVtcXHQgXSsuKzsvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKih2YXJ5aW5nfGluKVtcXHQgXSsuKzsvKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9fYWRkVmFyeWluZyhzaGFkZXJDb2RlTGluZTogc3RyaW5nLCBzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHRjb25zdCByZWZsZWN0aW9uVmFyeWluZzogUmVmbGVjdGlvblZhcnlpbmcgPSB7XG5cdFx0XHRuYW1lOiAnJyxcblx0XHRcdHR5cGU6ICdmbG9hdCcsXG5cdFx0XHRpbm91dDogJ2luJ1xuXHRcdH07XG5cblx0XHRjb25zdCBtYXRjaFR5cGUgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLmF0dHJpYnV0ZUFuZFZhcnlpbmdUeXBlUmVnRXhwKTtcblx0XHRpZiAobWF0Y2hUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gbWF0Y2hUeXBlWzFdO1xuXHRcdFx0cmVmbGVjdGlvblZhcnlpbmcudHlwZSA9IHR5cGUgYXMgVmFyVHlwZTtcblx0XHRcdGNvbnN0IG5hbWUgPSBtYXRjaFR5cGVbMl07XG5cdFx0XHRyZWZsZWN0aW9uVmFyeWluZy5uYW1lID0gbmFtZTtcblx0XHRcdHJlZmxlY3Rpb25WYXJ5aW5nLmlub3V0ID0gKHNoYWRlclN0YWdlID09PSAndmVydGV4JykgPyAnb3V0JyA6ICdpbic7XG5cdFx0fVxuXHRcdHRoaXMuX192YXJ5aW5ncy5wdXNoKHJlZmxlY3Rpb25WYXJ5aW5nKTtcblx0fVxuXG5cdHByaXZhdGUgX19hZGRVbmlmb3JtKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcpIHtcblx0XHRjb25zdCByZWZsZWN0aW9uVW5pZm9ybTogUmVmbGVjdGlvblVuaWZvcm0gPSB7XG5cdFx0XHRuYW1lOiAnJyxcblx0XHRcdHR5cGU6ICdmbG9hdCcsXG5cdFx0XHRzZW1hbnRpYzogJ1VOS05PV04nXG5cdFx0fTtcblxuXHRcdGNvbnN0IG1hdGNoVHlwZSA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24udW5pZm9ybVR5cGVSZWdFeHApO1xuXHRcdGlmIChtYXRjaFR5cGUpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBtYXRjaFR5cGVbMV07XG5cdFx0XHRyZWZsZWN0aW9uVW5pZm9ybS50eXBlID0gdHlwZSBhcyBWYXJUeXBlO1xuXHRcdFx0Y29uc3QgbmFtZSA9IG1hdGNoVHlwZVsyXTtcblx0XHRcdHJlZmxlY3Rpb25Vbmlmb3JtLm5hbWUgPSBuYW1lO1xuXG5cdFx0XHRjb25zdCBtYXRjaFNlbWFudGljcyA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24uc2VtYW50aWNSZWdFeHApXG5cdFx0XHRpZiAobWF0Y2hTZW1hbnRpY3MpIHtcblx0XHRcdFx0cmVmbGVjdGlvblVuaWZvcm0uc2VtYW50aWMgPSBtYXRjaFNlbWFudGljc1sxXSBhcyBVbmlmb3JtU2VtYW50aWNzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwKSB7XG5cdFx0XHRcdFx0aWYgKG5hbWUubWF0Y2gobmV3IFJlZ0V4cChrZXksICdpJykpKSB7XG5cdFx0XHRcdFx0XHRyZWZsZWN0aW9uVW5pZm9ybS5zZW1hbnRpYyA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLl9fdW5pZm9ybXMucHVzaChyZWZsZWN0aW9uVW5pZm9ybSk7XG5cdH1cbn07IiwiaW1wb3J0IHtUZW1wbGF0ZU9iamVjdH0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBlZGl0cyB0aGUgY29kZSBwcm9wZXJ0eSBvZiBhIHNoYWRlcml0eSBvYmplY3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYWRlckVkaXRvciB7XG5cdHN0YXRpYyBfaW5zZXJ0RGVmaW5pdGlvbihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBkZWZpbml0aW9uOiBzdHJpbmcpIHtcblx0XHRjb25zdCBkZWZTdHIgPSBkZWZpbml0aW9uLnJlcGxhY2UoLyNkZWZpbmVbXFx0IF0rLywgJycpO1xuXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnVuc2hpZnQoYCNkZWZpbmUgJHtkZWZTdHJ9YCk7XG5cdH1cblxuXHRzdGF0aWMgX2ZpbGxUZW1wbGF0ZShzaGFkZXJDb2RlOiBzdHJpbmcsIHRlbXBsYXRlT2JqZWN0OiBUZW1wbGF0ZU9iamVjdCkge1xuXHRcdGNvbnN0IHRlbXBsYXRlU3RyaW5nID0gc2hhZGVyQ29kZS5yZXBsYWNlKC9cXC9cXCpbXFx0IF0qc2hhZGVyaXR5OltcXHQgXSooQHtbXFx0IF0qKShcXFMrKShbXFx0IF0qfSlbXFx0IF0qXFwqXFwvL2csICcke3RoaXMuJDJ9Jyk7XG5cblx0XHRjb25zdCByZXN1bHRDb2RlID0gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIGBcIiArIHRlbXBsYXRlU3RyaW5nICsgXCJgO1wiKS5jYWxsKHRlbXBsYXRlT2JqZWN0KTtcblx0XHRyZXR1cm4gcmVzdWx0Q29kZTtcblx0fVxufSIsImltcG9ydCB7U2hhZGVyVmVyc2lvbn0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBjb252ZXJ0cyB0aGUgY29kZSBwcm9wZXJ0eSBvZiBhIHNoYWRlcml0eSBvYmplY3QgdG8gdGhlIHNwZWNpZmllZCBmb3JtYXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYWRlclRyYW5zZm9ybWVyIHtcblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMzIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGVcblx0ICovXG5cdHN0YXRpYyBfdHJhbnNmb3JtVG9HTFNMRVMxKFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0aXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbixcblx0XHRlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuXG5cdCkge1xuXHRcdHRoaXMuX19jb252ZXJ0T3JJbnNlcnRWZXJzaW9uR0xTTEVTMShzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19yZW1vdmVFUzNRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR0aGlzLl9fY29udmVydEluKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0dGhpcy5fX2NvbnZlcnRPdXQoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR0aGlzLl9fcmVtb3ZlUHJlY2lzaW9uRm9yRVMzKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlRnVuY3Rpb25Ub0VTMShzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlID0gc3BsaXR0ZWRTaGFkZXJDb2RlO1xuXG5cdFx0cmV0dXJuIHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMxIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzMgc2hhZGVyIGNvZGVcblx0ICovXG5cdHN0YXRpYyBfdHJhbnNmb3JtVG9HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9fY29udmVydE9ySW5zZXJ0VmVyc2lvbkdMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydEF0dHJpYnV0ZShzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdHRoaXMuX19jb252ZXJ0VmFyeWluZyhzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZUN1YmUoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmUyRChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZTJEUHJvZChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZTNEKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlM0RQcm9kKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUgPSBzcGxpdHRlZFNoYWRlckNvZGU7XG5cblx0XHRyZXR1cm4gdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBzaGFkZXIgY29kZSB0byBhIHNoYWRlciBjb2RlIG9mIHNwZWNpZmllZCBHTFNMIHZlcnNpb25cblx0ICovXG5cdHN0YXRpYyBfdHJhbnNmb3JtVG8oXG5cdFx0dmVyc2lvbjogU2hhZGVyVmVyc2lvbixcblx0XHRzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLFxuXHRcdGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4sXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHRpZiAodmVyc2lvbi5tYXRjaCgvd2ViZ2wyfGVzMy9pKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RyYW5zZm9ybVRvR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdH0gZWxzZSBpZiAodmVyc2lvbi5tYXRjaCgvd2ViZ2wxfGVzMS9pKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RyYW5zZm9ybVRvR0xTTEVTMShzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdJbnZhbGlkIFZlcnNpb24nKVxuXHRcdFx0cmV0dXJuIHNwbGl0dGVkU2hhZGVyQ29kZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogSWYgdGhlIGZpcnN0IGxpbmUgY29udGFpbnMgdmVyc2lvbiBpbmZvcm1hdGlvbiwgb3ZlcndyaXRlIHRoZSBmaXJzdCBsaW5lIHdpdGggJyN2ZXJzaW9uIDEwMCcuXG5cdCAqIElmIG5vdCwgYWRkICcjdmVyc2lvbiAxMDAnIHRvIHRoZSBmaXJzdCBsaW5lLlxuXHQgKlxuXHQgKiBOb3RlOiBJZiB0aGUgZmlyc3QgbGluZSBpcyBjb21tZW50ZWQgb3V0IGFuZCB0aGUgdmVyc2lvbiBpbmZvcm1hdGlvbiBpcyB3cml0dGVuIGluIHRoZSBzZWNvbmQgb3IgbGF0ZXIgbGluZSxcblx0ICogdGhlIGFwcHJvcHJpYXRlIHZlcnNpb24gaW5mb3JtYXRpb24gd2lsbCBiZSBhZGRlZCB0byB0aGUgZmlyc3QgbGluZSBhbmQgdGhlIHVzZXItZGVmaW5lZCB2ZXJzaW9uIGluZm9ybWF0aW9uXG5cdCAqIGluIHRoZSBzZWNvbmQgb3IgbGF0ZXIgbGluZSB3aWxsIGJlIHJlbW92ZWQuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRPckluc2VydFZlcnNpb25HTFNMRVMxKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSojW1xcdCBdKnZlcnNpb25bXFx0IF0rLiovO1xuXHRcdHRoaXMuX19yZW1vdmVGaXJzdE1hdGNoaW5nTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZyk7XG5cblx0XHRzcGxpdHRlZFNoYWRlckNvZGUudW5zaGlmdCgnI3ZlcnNpb24gMTAwJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogSWYgdGhlIGZpcnN0IGxpbmUgY29udGFpbnMgdmVyc2lvbiBpbmZvcm1hdGlvbiwgb3ZlcndyaXRlIHRoZSBmaXJzdCBsaW5lIHdpdGggJyN2ZXJzaW9uIDMwMCBlcycuXG5cdCAqIElmIG5vdCwgYWRkICcjdmVyc2lvbiAzMDAgZXMnIHRvIHRoZSBmaXJzdCBsaW5lLlxuXHQgKiBJbiBib3RoIGNhc2VzLCAnI2RlZmluZSBHTFNMX0VTMycgd2lsbCBiZSBpbnNlcnRlZCBpbiB0aGUgc2Vjb25kIGxpbmUuXG5cdCAqIFVzZSB0aGUgJyNkZWZpbmUgR0xTTF9FUzMnIGRpcmVjdGl2ZSBpZiB5b3Ugd2FudCB0byB3cml0ZSBhIHNoYWRlciBjb2RlIHRoYXQgd2lsbCBvbmx5IHJ1biBpbiB0aGUgY2FzZSBvZiB3ZWJnbDIuXG5cdCAqXG5cdCAqIE5vdGU6IElmIHRoZSBmaXJzdCBsaW5lIGlzIGNvbW1lbnRlZCBvdXQgYW5kIHRoZSB2ZXJzaW9uIGluZm9ybWF0aW9uIGlzIHdyaXR0ZW4gaW4gdGhlIHNlY29uZCBvciBsYXRlciBsaW5lLFxuXHQgKiB0aGUgYXBwcm9wcmlhdGUgdmVyc2lvbiBpbmZvcm1hdGlvbiB3aWxsIGJlIGFkZGVkIHRvIHRoZSBmaXJzdCBsaW5lIGFuZCB0aGUgdXNlci1kZWZpbmVkIHZlcnNpb24gaW5mb3JtYXRpb25cblx0ICogaW4gdGhlIHNlY29uZCBvciBsYXRlciBsaW5lIHdpbGwgYmUgcmVtb3ZlZC5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydE9ySW5zZXJ0VmVyc2lvbkdMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKiNbXFx0IF0qdmVyc2lvbltcXHQgXSsuKi87XG5cdFx0dGhpcy5fX3JlbW92ZUZpcnN0TWF0Y2hpbmdMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnKTtcblxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZS51bnNoaWZ0KCcjZGVmaW5lIEdMU0xfRVMzJyk7XG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnVuc2hpZnQoJyN2ZXJzaW9uIDMwMCBlcycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICdpbicgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMSBxdWFsaWZpZXIoJ2F0dHJpYnV0ZScgb3IgJ3ZhcnlpbmcnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0SW4oc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKmluW1xcdCBdKygoaGlnaHB8bWVkaXVtcHxsb3dwfClbXFx0IF0qXFx3K1tcXHQgXSpcXHcrW1xcdCBdKjspLztcblxuXHRcdGxldCByZXBsYWNlRnVuYztcblx0XHRpZiAoaXNGcmFnbWVudFNoYWRlcikge1xuXHRcdFx0cmVwbGFjZUZ1bmMgPSBmdW5jdGlvbiAobWF0Y2g6IHN0cmluZywgcDE6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gJ3ZhcnlpbmcgJyArIHAxO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXBsYWNlRnVuYyA9IGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiAnYXR0cmlidXRlICcgKyBwMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsIHJlcGxhY2VGdW5jKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcIm91dFwiIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIG1vZGlmeSB0aGUgc2hhZGVyIGNvZGUuXG5cdCAqIElmIHRoZSBzaGFkZXIgc3RhZ2UgaXMgdmVydGV4LCB0aGUgXCJvdXRcIiBxdWFsaWZpZXJzIHdpbGwgYmUgcmVwbGFjZWQgYnkgXCJ2YXJ5aW5nXCIgcXVhbGlmaWVyLlxuXHQgKiBJZiB0aGUgc2hhZGVyIHN0YWdlIGlzIGZyYWdtZW50IGFuZCB0aGUgc2hhZGVyIGhhcyBcIm91dFwiIHF1YWxpZmllcnMsIHRoZSBcIm91dFwiIHF1YWxpZmllcnMgd2lsbFxuXHQgKiBiZSBkZWxldGVkIGFuZCB0aGUgdmFyaWFibGUgaXMgdXNlZCB0byBhc3NpZ24gYSB2YWx1ZSB0byBnbF9GcmFnQ29sb3IuXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRPdXQoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbiwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGlmIChpc0ZyYWdtZW50U2hhZGVyKSB7XG5cdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSB0aGlzLl9fcmVtb3ZlT3V0UXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRpZiAodmFyaWFibGVOYW1lID09IG51bGwpIHtcblx0XHRcdFx0Ly8gbm8gb3V0IHF1YWxpZmllclxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX19hZGRHTEZyYWdDb2xvcih2YXJpYWJsZU5hbWUsIHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKm91dFtcXHQgXSsoKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKlxcdytbXFx0IF0qXFx3K1tcXHQgXSo7KS87XG5cdFx0XHRjb25zdCByZXBsYWNlRnVuYyA9IGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiAndmFyeWluZyAnICsgcDE7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsIHJlcGxhY2VGdW5jKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVGhpcyBtZXRob2QgaXMgYSBwYXJ0IG9mIF9fY29udmVydE91dCBtZXRob2QuXG5cdCAqIFRoaXMgbWV0aG9kIGRlbGV0ZXMgdGhlIFwib3V0XCIgcXVhbGlmaWVycyBhbmQgYWRkcyB0aGUgbGluZSBmb3IgYXNzaWduaW5nIHRvIGdsX0ZyYWdDb2xvci5cblx0ICogSWYgdGhlIHNoYWRlciBkb2VzIG5vdCBoYXZlIHRoZSBcIm91dFwiIHF1YWxpZmllcnMsIHRoaXMgbWV0aG9kIGRvZXMgbm90aGluZy5cblx0ICovXG5cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVPdXRRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKm91dFtcXHQgXSsoKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKlxcdytbXFx0IF0qKFxcdyspW1xcdCBdKjspLztcblxuXHRcdGxldCB2YXJpYWJsZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgbWF0Y2ggPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ubWF0Y2gocmVnKTtcblx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBtYXRjaFsxXTtcblx0XHRcdFx0dmFyaWFibGVOYW1lID0gbWF0Y2hbM107XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB2YXJpYWJsZU5hbWU7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX2FkZEdMRnJhZ0NvbG9yKHZhcmlhYmxlTmFtZTogc3RyaW5nLCBzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgY2xvc2VCcmFja2V0UmVnID0gLyguKilcXH1bXFxuXFx0IF0qJC87XG5cdFx0Y29uc3QgcmV0dXJuUmVnID0gL1tcXG5cXHQgXSpyZXR1cm5bXFxuXFx0IF0qOy87XG5cdFx0Y29uc3QgbWFpbkZ1bmNTdGFydFJlZyA9IC8oXnxeKD8hW1xcL10pW1xcdFxcbiBdKyl2b2lkW1xcdFxcbiBdK21haW4oW1xcdFxcbiBdfFxcKHwkKS87XG5cdFx0Y29uc3QgZnJhZ0NvbG9yQ29kZSA9IGAgIGdsX0ZyYWdDb2xvciA9ICR7dmFyaWFibGVOYW1lfTtgO1xuXG5cdFx0bGV0IHNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSA9IGZhbHNlO1xuXHRcdGZvciAobGV0IGkgPSBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cdFx0XHRpZiAoIXNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSAmJiBsaW5lLm1hdGNoKGNsb3NlQnJhY2tldFJlZykpIHtcblx0XHRcdFx0Ly8gYWRkIGdsX0ZyYWdDb2xvciB0byBsYXN0IGxpbmUgb2YgbWFpbiBmdW5jdGlvblxuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBsaW5lLnJlcGxhY2UoY2xvc2VCcmFja2V0UmVnLCBgJDFcXG4ke2ZyYWdDb2xvckNvZGV9XFxufVxcbmApO1xuXHRcdFx0XHRzZXRHbEZyYWdDb2xvckluTGFzdExpbmUgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobGluZS5tYXRjaChyZXR1cm5SZWcpKSB7XG5cdFx0XHRcdC8vIGFkZCBnbF9GcmFnQ29sb3IganVzdCBiZWZvcmUgcmV0dXJuXG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZS5zcGxpY2UoaSwgMCwgZnJhZ0NvbG9yQ29kZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChsaW5lLm1hdGNoKG1haW5GdW5jU3RhcnRSZWcpKSB7XG5cdFx0XHRcdC8vIGFkZCBnbF9GcmFnQ29sb3Igb25seSBpbiB0aGUgbWFpbiBmdW5jdGlvblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSkge1xuXHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fcmVtb3ZlT3V0UXVhbGlmaWVyOiBOb3QgZm91bmQgdGhlIGNsb3NpbmcgYnJhY2tldHMgZm9yIHRoZSBtYWluIGZ1bmN0aW9uJztcblx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGgsIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIHF1YWxpZmllciBmb3IgZXMzIG9ubHkgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXRcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlRVMzUXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9fcmVtb3ZlVmFyeWluZ1F1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdHRoaXMuX19yZW1vdmVMYXlvdXQoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcImZsYXRcIiBhbmQgXCJzbW9vdGhcIiBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXRcblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlVmFyeWluZ1F1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qKGZsYXR8c21vb3RoKVtcXHQgXSooKGlufG91dClbXFx0IF0rLiopLztcblx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19yZW1vdmVWYXJ5aW5nUXVhbGlmaWVyOiBnbHNsIGVzMSBkb2VzIG5vdCBzdXBwb3J0IGZsYXQgcXVhbGlmaWVyJztcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ucmVwbGFjZShyZWcsIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nLCBwMjogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGlmIChwMSA9PT0gJ2ZsYXQnKSB7XG5cdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSArIDEsIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwMjtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcImxheW91dFwiIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlbW92ZSBpdFxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVMYXlvdXQoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKmxheW91dFtcXHQgXSpcXChbXFx0IF0qbG9jYXRpb25bXFx0IF0qXFw9W1xcdCBdKlxcZFtcXHQgXSpcXClbXFx0IF0rL2c7XG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJwcmVjaXNpb25cIiBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXQgaWYgdGhlIFwicHJlY2lzaW9uXCIgcXVhbGlmaWVyIGlzIHZhbGlkIGZvciBvbmx5IEdMU0wgRVMzXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZVByZWNpc2lvbkZvckVTMyhzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qcHJlY2lzaW9uW1xcdCBdKyhoaWdocHxtZWRpdW1wfGxvd3ApW1xcdCBdKyhcXHcrKVtcXHQgXSo7LztcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBtYXRjaCA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5tYXRjaChyZWcpO1xuXHRcdFx0aWYgKG1hdGNoICE9IG51bGwpIHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSAnaW50JyB8fFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSAnZmxvYXQnIHx8XG5cdFx0XHRcdFx0bWF0Y2hbMl0gPT09ICdzYW1wbGVyMkQnIHx8XG5cdFx0XHRcdFx0bWF0Y2hbMl0gPT09ICdzYW1wbGVyQ3ViZSdcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Ly8gdGhlc2UgcHJlY2lzaW9ucyBhcmUgc3VwcG9ydGVkIGluIGVzMVxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZS5zcGxpY2UoaS0tLCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcInRleHR1cmVcIiBhbmQgXCJ0ZXh0dXJlUHJvalwiIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kXG5cdCAqIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzEgbWV0aG9kKCd0ZXh0dXJlMkQnLCAndGV4dHVyZTJEJywgYW5kIHNvIG9uKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzEoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbiwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnVGV4dHVyZVByb2ogPSBuZXcgUmVnRXhwKGAoJHtzYmx9Kyl0ZXh0dXJlUHJvaihMb2R8KSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVnVGV4dHVyZSA9IG5ldyBSZWdFeHAoYCgke3NibH0rKXRleHR1cmUoTG9kfCkoJHtzYmx9KylgLCAnZycpO1xuXG5cdFx0bGV0IGFyZ3VtZW50U2FtcGxlck1hcDogTWFwPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcblx0XHRjb25zdCB1bmlmb3JtU2FtcGxlck1hcCA9IHRoaXMuX19jcmVhdGVVbmlmb3JtU2FtcGxlck1hcChzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXG5cdFx0XHRjb25zdCBtYXRjaFRleHR1cmVQcm9qID0gbGluZS5tYXRjaCgvdGV4dHVyZVByb2ooTG9kfClbXFx0IF0qXFwoW1xcdCBdKihcXHcrKSwvKTtcblx0XHRcdGlmIChtYXRjaFRleHR1cmVQcm9qKSB7XG5cdFx0XHRcdGFyZ3VtZW50U2FtcGxlck1hcCA9IGFyZ3VtZW50U2FtcGxlck1hcCA/PyB0aGlzLl9fY3JlYXRlQXJndW1lbnRTYW1wbGVyTWFwKFxuXHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZSxcblx0XHRcdFx0XHRpLFxuXHRcdFx0XHRcdGVtYmVkRXJyb3JzSW5PdXRwdXRcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRjb25zdCBpc0xvZE1ldGhvZCA9IG1hdGNoVGV4dHVyZVByb2pbMV0gPT09ICdMb2QnO1xuXHRcdFx0XHRjb25zdCBleHRlbnNpb25TdHIgPSBpc0ZyYWdtZW50U2hhZGVyICYmIGlzTG9kTWV0aG9kID8gYEVYVGAgOiBgYDtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gbWF0Y2hUZXh0dXJlUHJvalsyXTtcblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBhcmd1bWVudFNhbXBsZXJNYXA/LmdldCh2YXJpYWJsZU5hbWUpID8/IHVuaWZvcm1TYW1wbGVyTWFwLmdldCh2YXJpYWJsZU5hbWUpO1xuXHRcdFx0XHRpZiAoc2FtcGxlclR5cGUgIT0gbnVsbCkge1xuXHRcdFx0XHRcdGlmIChzYW1wbGVyVHlwZSA9PT0gJ3NhbXBsZXIyRCcpIHtcblx0XHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5yZXBsYWNlKHJlZ1RleHR1cmVQcm9qLCBgJDF0ZXh0dXJlMkRQcm9qJDIke2V4dGVuc2lvblN0cn0kM2ApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzE6IGRvIG5vdCBzdXBwb3J0ICcgKyBzYW1wbGVyVHlwZSArICcgdHlwZSc7XG5cdFx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbWF0Y2hUZXh0dXJlID0gbGluZS5tYXRjaCgvdGV4dHVyZShMb2R8KVtcXHQgXSpcXChbXFx0IF0qKFxcdyspLC8pO1xuXHRcdFx0aWYgKG1hdGNoVGV4dHVyZSkge1xuXHRcdFx0XHRhcmd1bWVudFNhbXBsZXJNYXAgPSBhcmd1bWVudFNhbXBsZXJNYXAgPz8gdGhpcy5fX2NyZWF0ZUFyZ3VtZW50U2FtcGxlck1hcChcblx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUsXG5cdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRlbWJlZEVycm9yc0luT3V0cHV0XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29uc3QgaXNMb2RNZXRob2QgPSBtYXRjaFRleHR1cmVbMV0gPT09ICdMb2QnO1xuXHRcdFx0XHRjb25zdCBleHRlbnNpb25TdHIgPSBpc0ZyYWdtZW50U2hhZGVyICYmIGlzTG9kTWV0aG9kID8gYEVYVGAgOiBgYDtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gbWF0Y2hUZXh0dXJlWzJdO1xuXHRcdFx0XHRjb25zdCBzYW1wbGVyVHlwZSA9IGFyZ3VtZW50U2FtcGxlck1hcD8uZ2V0KHZhcmlhYmxlTmFtZSkgPz8gdW5pZm9ybVNhbXBsZXJNYXAuZ2V0KHZhcmlhYmxlTmFtZSk7XG5cdFx0XHRcdGlmIChzYW1wbGVyVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0bGV0IHRleHR1cmVGdW5jOiBzdHJpbmc7XG5cdFx0XHRcdFx0aWYgKHNhbXBsZXJUeXBlID09PSAnc2FtcGxlcjJEJykge1xuXHRcdFx0XHRcdFx0dGV4dHVyZUZ1bmMgPSAndGV4dHVyZTJEJztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHNhbXBsZXJUeXBlID09PSAnc2FtcGxlckN1YmUnKSB7XG5cdFx0XHRcdFx0XHR0ZXh0dXJlRnVuYyA9ICd0ZXh0dXJlQ3ViZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRleHR1cmVGdW5jID0gJyc7XG5cdFx0XHRcdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzE6IGRvIG5vdCBzdXBwb3J0ICcgKyBzYW1wbGVyVHlwZSArICcgdHlwZSc7XG5cdFx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0ZXh0dXJlRnVuYyAhPT0gJycpIHtcblx0XHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5yZXBsYWNlKHJlZ1RleHR1cmUsIGAkMSR7dGV4dHVyZUZ1bmN9JDIke2V4dGVuc2lvblN0cn0kM2ApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaXNCbG9ja0VuZCA9ICEhbGluZS5tYXRjaCgvXFx9Lyk7XG5cdFx0XHRpZiAoaXNCbG9ja0VuZCkge1xuXHRcdFx0XHRhcmd1bWVudFNhbXBsZXJNYXAgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRoaXMgbWV0aG9kIGZpbmRzIHVuaWZvcm0gZGVjbGFyYXRpb25zIG9mIHNhbXBsZXIgdHlwZXMgaW4gdGhlIHNoYWRlciBhbmRcblx0ICogY3JlYXRlcyBhIG1hcCB3aXRoIHZhcmlhYmxlIG5hbWVzIGFzIGtleXMgYW5kIHR5cGVzIGFzIHZhbHVlcy5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY3JlYXRlVW5pZm9ybVNhbXBsZXJNYXAoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHVuaWZvcm1TYW1wbGVyTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cdFx0XHRjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qdW5pZm9ybSpbXFx0IF0qKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKihzYW1wbGVyXFx3KylbXFx0IF0rKFxcdyspLyk7XG5cdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBtYXRjaFsyXTtcblx0XHRcdFx0Y29uc3QgbmFtZSA9IG1hdGNoWzNdO1xuXHRcdFx0XHRpZiAodW5pZm9ybVNhbXBsZXJNYXAuZ2V0KG5hbWUpKSB7XG5cdFx0XHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fY3JlYXRlVW5pZm9ybVNhbXBsZXJNYXA6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lJztcblx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHVuaWZvcm1TYW1wbGVyTWFwLnNldChuYW1lLCBzYW1wbGVyVHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB1bmlmb3JtU2FtcGxlck1hcDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUaGlzIG1ldGhvZCBmaW5kcyBzYW1wbGVyIHR5cGVzIGZyb20gdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cyBhbmRcblx0ICogY3JlYXRlcyBhIG1hcCB3aXRoIHZhcmlhYmxlIG5hbWVzIGFzIGtleXMgYW5kIHR5cGVzIGFzIHZhbHVlcy5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY3JlYXRlQXJndW1lbnRTYW1wbGVyTWFwKFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0bGluZUluZGV4OiBudW1iZXIsXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHRjb25zdCBhcmd1bWVudFNhbXBsZXJNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cblx0XHRmb3IgKGxldCBpID0gbGluZUluZGV4OyBpID49IDA7IGktLSkge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblxuXHRcdFx0Y29uc3QgaXNCbG9ja1N0YXJ0TGluZSA9ICEhbGluZS5tYXRjaCgvXFx7Lyk7XG5cdFx0XHRpZiAoIWlzQmxvY2tTdGFydExpbmUpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGJyYWNrZXRTZWN0aW9uQ29kZSA9IHRoaXMuX19nZXRCcmFja2V0U2VjdGlvbihzcGxpdHRlZFNoYWRlckNvZGUsIGkpO1xuXG5cdFx0XHRjb25zdCBpbm5lckJyYWNrZXRTZWN0aW9uQ29kZSA9IGJyYWNrZXRTZWN0aW9uQ29kZS5tYXRjaCgvLipcXCgoLiopXFwpLyk/LlsxXTtcblx0XHRcdGlmIChpbm5lckJyYWNrZXRTZWN0aW9uQ29kZSA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdmFyaWFibGVDYW5kaWRhdGVzID0gaW5uZXJCcmFja2V0U2VjdGlvbkNvZGUuc3BsaXQoJywnKTtcblx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlRGVmaW5pdGlvblJlZyA9IC9bXFxuXFx0IF0qKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcblxcdCBdKihzYW1wbGVyXFx3KylbXFxuXFx0IF0qKFxcdyspW1xcblxcdCBdKi87XG5cblx0XHRcdGNvbnN0IGlzRnVuY3Rpb25CcmFja2V0ID0gISEodmFyaWFibGVDYW5kaWRhdGVzWzBdLm1hdGNoKHNhbXBsZXJUeXBlRGVmaW5pdGlvblJlZykgPz8gdmFyaWFibGVDYW5kaWRhdGVzWzBdLm1hdGNoKC9eW1xcblxcdCBdKiQvKSk7XG5cdFx0XHRpZiAoIWlzRnVuY3Rpb25CcmFja2V0KSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGNvbnN0IHZhcmlhYmxlQ2FuZGlkYXRlIG9mIHZhcmlhYmxlQ2FuZGlkYXRlcykge1xuXHRcdFx0XHRjb25zdCBzYW1wbGVyVmFyaWFibGVNYXRjaCA9IHZhcmlhYmxlQ2FuZGlkYXRlLm1hdGNoKHNhbXBsZXJUeXBlRGVmaW5pdGlvblJlZyk7XG5cdFx0XHRcdGlmIChzYW1wbGVyVmFyaWFibGVNYXRjaCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBzYW1wbGVyVmFyaWFibGVNYXRjaFsyXTtcblx0XHRcdFx0Y29uc3QgbmFtZSA9IHNhbXBsZXJWYXJpYWJsZU1hdGNoWzNdO1xuXHRcdFx0XHRpZiAoYXJndW1lbnRTYW1wbGVyTWFwLmdldChuYW1lKSkge1xuXHRcdFx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX2NyZWF0ZUFyZ3VtZW50U2FtcGxlck1hcDogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUnO1xuXHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGksIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YXJndW1lbnRTYW1wbGVyTWFwLnNldChuYW1lLCBzYW1wbGVyVHlwZSk7XG5cdFx0XHR9XG5cblx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcmd1bWVudFNhbXBsZXJNYXA7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgcGFydCBlbmNsb3NlZCBpbiBicmFja2V0cyg9ICcoKScpLlxuXHQgKiBGb3IgZXhhbXBsZSwgeW91IGNhbiBnZXQgbGluZXMgdGhhdCBjb250YWluIGZ1bmN0aW9uIGFyZ3VtZW50cywgY29uZGl0aW9uYWwgZXhwcmVzc2lvbnMgZm9yIGlmIHN0YXRlbWVudHMsIGV0Yy5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fZ2V0QnJhY2tldFNlY3Rpb24oc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgYnJhY2tldEVuZEluZGV4OiBudW1iZXIpIHtcblx0XHRsZXQgYnJhY2tldFN0YXJ0SW5kZXggPSAwO1xuXHRcdGZvciAobGV0IGogPSBicmFja2V0RW5kSW5kZXg7IGogPj0gMDsgai0tKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2pdO1xuXHRcdFx0Y29uc3QgaXNCcmFja2V0U3RhcnRNYXRjaCA9ICEhbGluZS5tYXRjaCgvXFwoLyk7XG5cdFx0XHRpZiAoaXNCcmFja2V0U3RhcnRNYXRjaCkge1xuXHRcdFx0XHRicmFja2V0U3RhcnRJbmRleCA9IGo7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBjb250YWluQnJhY2tldENvZGUgPSAnJztcblx0XHRmb3IgKGxldCBqID0gYnJhY2tldFN0YXJ0SW5kZXg7IGogPD0gYnJhY2tldEVuZEluZGV4OyBqKyspIHtcblx0XHRcdGNvbnRhaW5CcmFja2V0Q29kZSArPSBzcGxpdHRlZFNoYWRlckNvZGVbal07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbnRhaW5CcmFja2V0Q29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAnYXR0cmlidXRlJyBxdWFsaWZpZXIgaW4gdGhlIHZlcnRleCBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBxdWFsaWZpZXIoJ2luJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydEF0dHJpYnV0ZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuKSB7XG5cdFx0aWYgKGlzRnJhZ21lbnRTaGFkZXIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSphdHRyaWJ1dGVbXFx0IF0rL2c7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICdpbiAnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCByZXBsYWNlU3RyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndmFyeWluZycgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBxdWFsaWZpZXIoJ2luJyBvciAnb3V0Jylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFZhcnlpbmcoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKnZhcnlpbmdbXFx0IF0rL2c7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9IGlzRnJhZ21lbnRTaGFkZXIgPyAnaW4gJyA6ICdvdXQgJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgcmVwbGFjZVN0cik7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmVDdWJlJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZScpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlQ3ViZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZUN1YmUpKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmUnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlMkQnIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmUyRChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZTJEKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZTJEUHJvaicgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmVQcm9qJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmUyRFByb2Qoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmUyRFByb2opKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmVQcm9qJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZTNEJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZScpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlM0Qoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmUzRCkoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZSc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmUzRFByb2onIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlUHJvaicpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlM0RQcm9kKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlM0RQcm9qKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlUHJvaic7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX3JlZ1N5bWJvbHMoKSB7XG5cdFx0cmV0dXJuIGBbIVwiIyQlJicoKVxcKlxcK1xcLVxcLixcXC86Ozw9Pj9AXFxbXFxcXFxcXV5gICsgJ2B7fH1+XFx0XFxuIF0nO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCByZWc6IFJlZ0V4cCwgcmVwbGFjZW1lbnQ6IGFueSkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ucmVwbGFjZShyZWcsIHJlcGxhY2VtZW50KTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZUZpcnN0TWF0Y2hpbmdMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIHJlZzogUmVnRXhwKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChzcGxpdHRlZFNoYWRlckNvZGVbaV0ubWF0Y2gocmVnKSkge1xuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX291dEVycm9yKFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0bGluZUluZGV4OiBudW1iZXIsXG5cdFx0ZXJyb3JNZXNzYWdlOiBzdHJpbmcsXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHRpZiAoZW1iZWRFcnJvcnNJbk91dHB1dCkge1xuXHRcdFx0Y29uc3Qgc2hhZGVyT3V0cHV0TWVzc2FnZSA9IGAvLyBsaW5lICR7bGluZUluZGV4fTogJHtlcnJvck1lc3NhZ2V9XFxuYDtcblx0XHRcdGNvbnN0IGNsb3NlQnJhY2tldFJlZyA9IC8oLiopXFx9W1xcblxcdCBdKiQvO1xuXHRcdFx0Zm9yIChsZXQgaSA9IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXHRcdFx0XHRpZiAobGluZS5tYXRjaChjbG9zZUJyYWNrZXRSZWcpKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc3BsaXR0ZWRTaGFkZXJDb2RlW2ldID09PSBzaGFkZXJPdXRwdXRNZXNzYWdlKSB7XG5cdFx0XHRcdFx0Ly8gYXZvaWQgZHVwbGljYXRlIGVycm9yIG1lc3NhZ2Vcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvck1lc3NhZ2UpO1xuXHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnB1c2goc2hhZGVyT3V0cHV0TWVzc2FnZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO1xuXHRcdH1cblx0fVxufVxuIiwiaW1wb3J0IFJlZmxlY3Rpb24gZnJvbSAnLi9SZWZsZWN0aW9uJztcbmltcG9ydCB7U2hhZGVyaXR5T2JqZWN0LCBTaGFkZXJTdGFnZVN0ciwgU2hhZGVyVmVyc2lvbiwgVGVtcGxhdGVPYmplY3R9IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuaW1wb3J0IFNoYWRlclRyYW5zZm9ybWVyIGZyb20gJy4vU2hhZGVyVHJhbnNmb3JtZXInO1xuaW1wb3J0IFNoYWRlckVkaXRvciBmcm9tICcuL1NoYWRlckVkaXRvcic7XG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xuaW1wb3J0IFNoYWRlcml0eU9iamVjdENyZWF0b3IgZnJvbSAnLi9TaGFkZXJpdHlPYmplY3RDcmVhdG9yJztcbmltcG9ydCBQcmVQcm9jZXNzb3IgZnJvbSAnLi9QcmVQcm9jZXNzb3InO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFkZXJpdHkge1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gc2hhZGVyIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBFUzMgc2hhZGVyIGNvZGUgdG8gYSBHTFNMIEVTMSBzaGFkZXIgY29kZVxuXHQgKiBAcGFyYW0gb2JqIFNoYWRlcml0eSBvYmplY3QgdG8gdHJhbnNsYXRlIHRvIGdsc2wgZXMxXG5cdCAqIEBwYXJhbSBlbWJlZEVycm9yc0luT3V0cHV0IElmIHRydWUsIHdoZW4gdGhlcmUgaXMgYW4gZXJyb3IgaW4gdGhlIGNvbnZlcnNpb24sXG5cdCAqICAgIHRoZSBlcnJvciBhbmQgdGhlIG51bWJlciBvZiBsaW5lcyBhcmUgb3V0cHV0IGF0IHRoZSBib3R0b20gb2YgdGhlIHJldHVyblxuXHQgKiAgICB2YWx1ZSBTaGFkZXJpdHlPYmplY3QuY29kZS4gSWYgZmFsc2UsIHRocm93IGFuIGVycm9yLlxuXHQgKiBAcmV0dXJucyBTaGFkZXJpdHlPYmplY3Qgd2hvc2UgY29kZSBwcm9wZXJ0eSBpcyB0aGUgc2hhZGVyIGNvZGUgZm9yIEdMU0wgRVMxXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHRyYW5zZm9ybVRvR0xTTEVTMShvYmo6IFNoYWRlcml0eU9iamVjdCwgZW1iZWRFcnJvcnNJbk91dHB1dCA9IGZhbHNlKSB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZVxuXHRcdFx0PSBTaGFkZXJUcmFuc2Zvcm1lci5fdHJhbnNmb3JtVG9HTFNMRVMxKFxuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUsXG5cdFx0XHRcdG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdFx0XHRlbWJlZEVycm9yc0luT3V0cHV0XG5cdFx0XHQpO1xuXHRcdGNvbnN0IHJlc3VsdENvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdGNvbnN0IHJlc3VsdE9iajogU2hhZGVyaXR5T2JqZWN0ID0ge1xuXHRcdFx0Y29kZTogcmVzdWx0Q29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHJlc3VsdE9iajtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIEVTMSBzaGFkZXIgY29kZSB0byBhIEdMU0wgRVMzIHNoYWRlciBjb2RlXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHRyYW5zZm9ybVRvR0xTTEVTMyhvYmo6IFNoYWRlcml0eU9iamVjdCkge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGVcblx0XHRcdD0gU2hhZGVyVHJhbnNmb3JtZXIuX3RyYW5zZm9ybVRvR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGUsIG9iai5pc0ZyYWdtZW50U2hhZGVyKTtcblx0XHRjb25zdCByZXN1bHRDb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZSh0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IHJlc3VsdENvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH1cblxuXHQvKipcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBzaGFkZXIgY29kZSB0byBhIHNoYWRlciBjb2RlIG9mIHNwZWNpZmllZCBHTFNMIHZlcnNpb25cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtVG8odmVyc2lvbjogU2hhZGVyVmVyc2lvbiwgb2JqOiBTaGFkZXJpdHlPYmplY3QsIGVtYmVkRXJyb3JzSW5PdXRwdXQgPSBmYWxzZSkge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGVcblx0XHRcdD0gU2hhZGVyVHJhbnNmb3JtZXIuX3RyYW5zZm9ybVRvKFxuXHRcdFx0XHR2ZXJzaW9uLFxuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUsXG5cdFx0XHRcdG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdFx0XHRlbWJlZEVycm9yc0luT3V0cHV0XG5cdFx0XHQpO1xuXHRcdGNvbnN0IHJlc3VsdENvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdGNvbnN0IHJlc3VsdE9iajogU2hhZGVyaXR5T2JqZWN0ID0ge1xuXHRcdFx0Y29kZTogcmVzdWx0Q29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHJlc3VsdE9iajtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgcHJvY2Vzc1ByYWdtYShvYmo6IFNoYWRlcml0eU9iamVjdCkge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGVcblx0XHRcdD0gUHJlUHJvY2Vzc29yLnByb2Nlc3Moc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdGNvbnN0IHJlc3VsdENvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdGNvbnN0IHJlc3VsdE9iajogU2hhZGVyaXR5T2JqZWN0ID0ge1xuXHRcdFx0Y29kZTogcmVzdWx0Q29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHJlc3VsdE9iajtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBzaGFkZXJpdHkgb2JqZWN0IGNyZWF0aW9uIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcblx0ICogQ3JlYXRlIGFuIGluc3RhbmNlIHRvIGNyZWF0ZSBzaGFkZXJpdHkgb2JqZWN0LlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBjcmVhdGVTaGFkZXJpdHlPYmplY3RDcmVhdG9yKHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cik6IFNoYWRlcml0eU9iamVjdENyZWF0b3Ige1xuXHRcdHJldHVybiBuZXcgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcihzaGFkZXJTdGFnZSk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gc2hhZGVyIGVkaXQgZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8qKlxuXHQgKiBGaW5kIHRoZSBmb2xsb3dpbmcgdGVtcGxhdGUgcGF0dGVybiBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2Uga2V5IHRvIHZhbHVlXG5cdCAqIEBwYXJhbSB0ZW1wbGF0ZU9iamVjdCBBbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBzdHJpbmcgYmVmb3JlIGFuZCBhZnRlciB0aGUgcmVwbGFjZW1lbnRcblx0ICogVGhlIGtleSBjYW4gYmUgYSBzdHJpbmcgb3IgYW4gb2JqZWN0LiBJZiBhbiBvYmplY3QgaXMgdXNlZCBhcyB0aGUga2V5LFxuXHQgKiB0aGUga2V5IGluIHRoZSBwYXR0ZXJuIG9mIHNoYWRlckNvZGUgbXVzdCBhbHNvIG1hdGNoIHRoZSBvYmplY3QuXG5cdCAqIEZvciBleGFtcGxlLCBpZiB0ZW1wbGF0ZU9iamVjdCBpc1xuXHRcdHtcblx0XHRcdHNhbXBsZSB7XG5cdFx0XHRcdHNhbXBsZUE6IDBcblx0XHRcdH1cblx0XHR9XG5cdCAqIHRoZW4gdGhlIGtleSBpbiBhIHNoYWRlciBjb2RlIGlzIHNhbXBsZS5zYW1wbGVBLlxuXHQgKi9cblx0Ly8gVGhlIHRlbXBsYXRlIHBhdHRlcm4gaXNcdC8qIHNoYWRlcml0eTogQHtrZXl9ICovXG5cdHB1YmxpYyBzdGF0aWMgZmlsbFRlbXBsYXRlKG9iajogU2hhZGVyaXR5T2JqZWN0LCBhcmc6IFRlbXBsYXRlT2JqZWN0KSB7XG5cdFx0Y29uc3QgY29weSA9IHRoaXMuX19jb3B5U2hhZGVyaXR5T2JqZWN0KG9iaik7XG5cblx0XHRjb3B5LmNvZGUgPSBTaGFkZXJFZGl0b3IuX2ZpbGxUZW1wbGF0ZShjb3B5LmNvZGUsIGFyZyk7XG5cblx0XHRyZXR1cm4gY29weTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbnNlcnQgZGVmaW5lIGRpcmVjdGl2ZVxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBpbnNlcnREZWZpbml0aW9uKG9iajogU2hhZGVyaXR5T2JqZWN0LCBkZWZpbml0aW9uOiBzdHJpbmcpIHtcblx0XHRjb25zdCBjb3B5ID0gdGhpcy5fX2NvcHlTaGFkZXJpdHlPYmplY3Qob2JqKTtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdFNoYWRlckVkaXRvci5faW5zZXJ0RGVmaW5pdGlvbihzcGxpdHRlZFNoYWRlckNvZGUsIGRlZmluaXRpb24pO1xuXHRcdGNvcHkuY29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdHJldHVybiBjb3B5O1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHJlZmxlY3Rpb24gZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gaW5zdGFuY2UgdG8gZ2V0IHRoZSBhdHRyaWJ1dGUsIHZhcnlpbmcsIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uIGZyb20gYSBzaGFkZXIgY29kZSBvZiB0aGUgc2hhZGVyaXR5LlxuXHQgKiBUbyBnZXQgdGhlc2UgaW5mb3JtYXRpb24sIHlvdSBuZWVkIHRvIGNhbGwgcmVmbGVjdGlvbi5yZWZsZWN0IG1ldGhvZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgY3JlYXRlUmVmbGVjdGlvbk9iamVjdChvYmo6IFNoYWRlcml0eU9iamVjdCk6IFJlZmxlY3Rpb24ge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgcmVmbGVjdGlvbiA9IG5ldyBSZWZsZWN0aW9uKHNwbGl0dGVkU2hhZGVyQ29kZSwgb2JqLnNoYWRlclN0YWdlKTtcblx0XHRyZXR1cm4gcmVmbGVjdGlvbjtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBwcml2YXRlIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwcml2YXRlIHN0YXRpYyBfX2NvcHlTaGFkZXJpdHlPYmplY3Qob2JqOiBTaGFkZXJpdHlPYmplY3QpIHtcblx0XHRjb25zdCBjb3BpZWRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IG9iai5jb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH1cblxuXHRcdHJldHVybiBjb3BpZWRPYmo7XG5cdH1cbn1cbiIsImltcG9ydCB7XG5cdFNoYWRlckNvbnN0YW50VmFsdWVPYmplY3QsXG5cdFNoYWRlckV4dGVuc2lvbkJlaGF2aW9yLFxuXHRTaGFkZXJFeHRlbnNpb25PYmplY3QsXG5cdFNoYWRlcml0eU9iamVjdCxcblx0U2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMsXG5cdFNoYWRlclByZWNpc2lvbk9iamVjdCxcblx0U2hhZGVyUHJlY2lzaW9uT2JqZWN0S2V5LFxuXHRTaGFkZXJTdGFnZVN0cixcblx0U2hhZGVyQXR0cmlidXRlT2JqZWN0LFxuXHRTaGFkZXJQcmVjaXNpb25UeXBlLFxuXHRTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlLFxuXHRTaGFkZXJWYXJ5aW5nT2JqZWN0LFxuXHRTaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUsXG5cdFNoYWRlclZhcnlpbmdWYXJUeXBlLFxuXHRTaGFkZXJVbmlmb3JtT2JqZWN0LFxuXHRTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyxcblx0U2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdCxcblx0U2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0LFxuXHRTaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0LFxuXHRTaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0LFxuXHRTaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0LFxuXHRTaGFkZXJVQk9WYXJpYWJsZU9iamVjdCxcblx0U2hhZGVyRnVuY3Rpb25PYmplY3QsXG59IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5JztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGNyZWF0ZXMgYSBzaGFkZXJpdHkgb2JqZWN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFkZXJpdHlPYmplY3RDcmVhdG9yIHtcblx0cHJpdmF0ZSBfX3NoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cjtcblx0cHJpdmF0ZSBfX2Z1bmN0aW9uSWRDb3VudCA9IDA7XG5cblx0cHJpdmF0ZSBfX2RlZmluZURpcmVjdGl2ZU5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuXHRwcml2YXRlIF9fZXh0ZW5zaW9uczogU2hhZGVyRXh0ZW5zaW9uT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX2dsb2JhbFByZWNpc2lvbjogU2hhZGVyUHJlY2lzaW9uT2JqZWN0ID0ge1xuXHRcdGludDogJ2hpZ2hwJyxcblx0XHRmbG9hdDogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyMkQ6ICdoaWdocCcsXG5cdFx0c2FtcGxlckN1YmU6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjNEOiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIyREFycmF5OiAnaGlnaHAnLFxuXHRcdGlzYW1wbGVyMkQ6ICdoaWdocCcsXG5cdFx0aXNhbXBsZXJDdWJlOiAnaGlnaHAnLFxuXHRcdGlzYW1wbGVyM0Q6ICdoaWdocCcsXG5cdFx0aXNhbXBsZXIyREFycmF5OiAnaGlnaHAnLFxuXHRcdHVzYW1wbGVyMkQ6ICdoaWdocCcsXG5cdFx0dXNhbXBsZXJDdWJlOiAnaGlnaHAnLFxuXHRcdHVzYW1wbGVyM0Q6ICdoaWdocCcsXG5cdFx0dXNhbXBsZXIyREFycmF5OiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIyRFNoYWRvdzogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyQ3ViZVNoYWRvdzogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyMkRBcnJheVNoYWRvdzogJ2hpZ2hwJyxcblx0fTtcblx0cHJpdmF0ZSBfX3N0cnVjdERlZmluaXRpb25zOiBTaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX2dsb2JhbENvbnN0YW50VmFsdWVzOiBTaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzOiBTaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX2F0dHJpYnV0ZXM6IFNoYWRlckF0dHJpYnV0ZU9iamVjdFtdID0gW107IC8vIGZvciB2ZXJ0ZXggc2hhZGVyIG9ubHlcblx0cHJpdmF0ZSBfX3ZhcnlpbmdzOiBTaGFkZXJWYXJ5aW5nT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1zOiBTaGFkZXJVbmlmb3JtT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1TdHJ1Y3RzOiBTaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1CdWZmZXJPYmplY3RzOiBTaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0W10gPSBbXTtcblx0cHJpdmF0ZSBfX2Z1bmN0aW9uczogU2hhZGVyRnVuY3Rpb25PYmplY3RbXVtdID0gW107IC8vIGZpcnN0IGluZGV4IHJlcHJlc2VudCBkZXBlbmRlbmN5IGxldmVsXG5cdHByaXZhdGUgX19tYWluRnVuY3Rpb25Db2RlOiBzdHJpbmcgPSAndm9pZCBtYWluKCkge30nO1xuXHRwcml2YXRlIF9fb3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU6IHN0cmluZyA9ICdyZW5kZXJUYXJnZXQwJzsgLy8gZm9yIGZyYWdtZW50IHNoYWRlciBvbmx5XG5cblx0Y29uc3RydWN0b3Ioc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0dGhpcy5fX3NoYWRlclN0YWdlID0gc2hhZGVyU3RhZ2U7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gYWRkIHBhcmFtZXRlcnMgZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHB1YmxpYyBhZGREZWZpbmVEaXJlY3RpdmUoZGVmaW5lRGlyZWN0aXZlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzLnNvbWUobmFtZSA9PiBuYW1lID09PSBkZWZpbmVEaXJlY3RpdmVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUud2FybignYWRkRGVmaW5lRGlyZWN0aXZlOiB0aGlzIGRlZmluZSBkaXJlY3RpdmUgaXMgYWxyZWFkeSBzZXQnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZGVmaW5lRGlyZWN0aXZlTmFtZXMucHVzaChkZWZpbmVEaXJlY3RpdmVOYW1lKTtcblx0fVxuXG5cdHB1YmxpYyBhZGRFeHRlbnNpb24oZXh0ZW5zaW9uTmFtZTogc3RyaW5nLCBiZWhhdmlvcjogU2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3IgPSAnZW5hYmxlJykge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19leHRlbnNpb25zLnNvbWUoZXh0ZW5zaW9uID0+IGV4dGVuc2lvbi5leHRlbnNpb25OYW1lID09PSBleHRlbnNpb25OYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUud2FybignYWRkRXh0ZW5zaW9uOiB0aGlzIGV4dGVuc2lvbiBpcyBhbHJlYWR5IHNldCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19leHRlbnNpb25zLnB1c2goe1xuXHRcdFx0ZXh0ZW5zaW9uTmFtZSxcblx0XHRcdGJlaGF2aW9yXG5cdFx0fSk7XG5cdH1cblxuXHQvLyBvbmx5IGRlZmluZSB0eXBlc1xuXHRwdWJsaWMgYWRkU3RydWN0RGVmaW5pdGlvbihzdHJ1Y3ROYW1lOiBzdHJpbmcsIG1lbWJlck9iamVjdHM6IFNoYWRlclN0cnVjdE1lbWJlck9iamVjdFtdKSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLnNvbWUoc3RydWN0RGVmaW5pdGlvbiA9PiBzdHJ1Y3REZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdE5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkU3RydWN0RGVmaW5pdGlvbjogZHVwbGljYXRlIHN0cnVjdCB0eXBlIG5hbWUgJHtzdHJ1Y3ROYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5wdXNoKHtcblx0XHRcdHN0cnVjdE5hbWUsXG5cdFx0XHRtZW1iZXJPYmplY3RzLFxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGFkZEdsb2JhbENvbnN0YW50VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzLCB2YWx1ZXM6IG51bWJlcltdKSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLnNvbWUoZ2xvYmFsQ29uc3RhbnRWYWx1ZSA9PiBnbG9iYWxDb25zdGFudFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZEdsb2JhbENvbnN0YW50VmFsdWU6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzVmFsaWRDb21wb25lbnROdW1iZXIgPSBVdGlsaXR5Ll9pc1ZhbGlkQ29tcG9uZW50Q291bnQodHlwZSwgdmFsdWVzKTtcblx0XHRpZiAoIWlzVmFsaWRDb21wb25lbnROdW1iZXIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZEdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSBjb21wb25lbnQgY291bnQgb2YgJHt2YXJpYWJsZU5hbWV9IGlzIGludmFsaWRgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc0ludFR5cGUgPSBVdGlsaXR5Ll9pc0ludFR5cGUodHlwZSk7XG5cdFx0aWYgKGlzSW50VHlwZSkge1xuXHRcdFx0Y29uc3QgZXhpc3ROb25JbnRlZ2VyVmFsdWUgPSBTaGFkZXJpdHlPYmplY3RDcmVhdG9yLl9fZXhpc3ROb25JbnRlZ2VyVmFsdWUodmFsdWVzKTtcblx0XHRcdGlmIChleGlzdE5vbkludGVnZXJWYWx1ZSkge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYGFkZEdsb2JhbENvbnN0YW50VmFsdWU6IG5vbi1pbnRlZ2VyIHZhbHVlIGlzIHNldCB0byAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHR0eXBlLFxuXHRcdFx0dmFsdWVzLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gbmVlZCB0byBkZWZpbmUgc3RydWN0IGJ5IHRoZSBhZGRTdHJ1Y3REZWZpbml0aW9uIG1ldGhvZFxuXHQvLyB2YWxpZGF0ZSB0aGF0IHRoZSBjb3JyZXNwb25kaW5nIHN0cnVjdHVyZSBpcyBkZWZpbmVkIGJ5IHRoZSBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlIG1ldGhvZFxuXHRwdWJsaWMgYWRkR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZShzdHJ1Y3ROYW1lOiBzdHJpbmcsIHZhcmlhYmxlTmFtZTogc3RyaW5nLCB2YWx1ZXM6IHtba2V5VmFyaWFibGVOYW1lOiBzdHJpbmddOiBudW1iZXJbXX0pIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMuc29tZShzdHJ1Y3RWYWx1ZSA9PiBzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHRzdHJ1Y3ROYW1lLFxuXHRcdFx0dmFsdWVzLFxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGFkZEF0dHJpYnV0ZURlY2xhcmF0aW9uKFxuXHRcdHZhcmlhYmxlTmFtZTogc3RyaW5nLFxuXHRcdHR5cGU6IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUsXG5cdFx0b3B0aW9ucz86IHtcblx0XHRcdHByZWNpc2lvbj86IFNoYWRlclByZWNpc2lvblR5cGUsXG5cdFx0XHRsb2NhdGlvbj86IG51bWJlcixcblx0XHR9XG5cdCkge1xuXHRcdGlmICh0aGlzLl9fc2hhZGVyU3RhZ2UgIT09ICd2ZXJ0ZXgnKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdhZGRBdHRyaWJ1dGU6IHRoaXMgbWV0aG9kIGlzIGZvciB2ZXJ0ZXggc2hhZGVyIG9ubHknKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fYXR0cmlidXRlcy5zb21lKGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkQXR0cmlidXRlOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fYXR0cmlidXRlcy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHR5cGUsXG5cdFx0XHRwcmVjaXNpb246IG9wdGlvbnM/LnByZWNpc2lvbixcblx0XHRcdGxvY2F0aW9uOiBvcHRpb25zPy5sb2NhdGlvbixcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRWYXJ5aW5nRGVjbGFyYXRpb24oXG5cdFx0dmFyaWFibGVOYW1lOiBzdHJpbmcsXG5cdFx0dHlwZTogU2hhZGVyVmFyeWluZ1ZhclR5cGUsXG5cdFx0b3B0aW9ucz86IHtcblx0XHRcdHByZWNpc2lvbj86IFNoYWRlclByZWNpc2lvblR5cGUsXG5cdFx0XHRpbnRlcnBvbGF0aW9uVHlwZT86IFNoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSxcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX192YXJ5aW5ncy5zb21lKHZhcnlpbmcgPT4gdmFyeWluZy52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRWYXJ5aW5nOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc0ludFR5cGUgPSBVdGlsaXR5Ll9pc0ludFR5cGUodHlwZSk7XG5cdFx0bGV0IGludGVycG9sYXRpb25UeXBlID0gb3B0aW9ucz8uaW50ZXJwb2xhdGlvblR5cGU7XG5cdFx0aWYgKGlzSW50VHlwZSAmJiBpbnRlcnBvbGF0aW9uVHlwZSAhPT0gJ2ZsYXQnKSB7XG5cdFx0XHRpZiAoaW50ZXJwb2xhdGlvblR5cGUgIT0gbnVsbCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBhZGRWYXJ5aW5nOiB0aGUgaW50ZXJwb2xhdGlvblR5cGUgbXVzdCBiZSBmbGF0IGZvciBpbnRlZ2VyIHR5cGVzYCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgYWRkVmFyeWluZzogc2V0IHRoZSBpbnRlcnBvbGF0aW9uVHlwZSBvZiBpbnRlZ2VyIHR5cGVzIHRvIGZsYXQgdG8gYXZvaWQgY29tcGlsYXRpb24gZXJyb3JgKTtcblx0XHRcdFx0aW50ZXJwb2xhdGlvblR5cGUgPSAnZmxhdCc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3ZhcnlpbmdzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0dHlwZSxcblx0XHRcdHByZWNpc2lvbjogb3B0aW9ucz8ucHJlY2lzaW9uLFxuXHRcdFx0aW50ZXJwb2xhdGlvblR5cGUsXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkVW5pZm9ybURlY2xhcmF0aW9uKFxuXHRcdHZhcmlhYmxlTmFtZTogc3RyaW5nLFxuXHRcdHR5cGU6IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRwcmVjaXNpb24/OiBTaGFkZXJQcmVjaXNpb25UeXBlLFxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1zLnNvbWUodW5pZm9ybSA9PiB1bmlmb3JtLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFVuaWZvcm06IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlID09PSAnYm9vbCcgJiYgb3B0aW9ucz8ucHJlY2lzaW9uICE9IG51bGwpIHtcblx0XHRcdGNvbnNvbGUud2FybihgYWRkVW5pZm9ybTogcmVtb3ZlIHRoZSBzcGVjaWZpY2F0aW9uIG9mIHByZWNpc2lvbiBmb3IgYm9vbCB0eXBlIHRvIGF2b2lkIGNvbXBpbGF0aW9uIGVycm9yYCk7XG5cdFx0XHRvcHRpb25zLnByZWNpc2lvbiA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybXMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHR0eXBlLFxuXHRcdFx0cHJlY2lzaW9uOiBvcHRpb25zPy5wcmVjaXNpb24sXG5cdFx0fSk7XG5cdH1cblxuXHQvLyBuZWVkIHRvIGRlZmluZSBzdHJ1Y3QgYnkgdGhlIGFkZFN0cnVjdERlZmluaXRpb24gbWV0aG9kXG5cdHB1YmxpYyBhZGRVbmlmb3JtU3RydWN0RGVjbGFyYXRpb24oXG5cdFx0c3RydWN0TmFtZTogc3RyaW5nLFxuXHRcdHZhcmlhYmxlTmFtZTogc3RyaW5nXG5cdCkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX191bmlmb3JtU3RydWN0cy5zb21lKHVuaWZvcm1TdHJ1Y3QgPT4gdW5pZm9ybVN0cnVjdC52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtU3RydWN0RGVjbGFyYXRpb246IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3JtU3RydWN0cy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHN0cnVjdE5hbWUsXG5cdFx0fSk7XG5cdH1cblxuXHQvLyBmb3IgZXMzXG5cdHB1YmxpYyBhZGRVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb24oXG5cdFx0YmxvY2tOYW1lOiBzdHJpbmcsXG5cdFx0dmFyaWFibGVPYmplY3RzOiBTaGFkZXJVQk9WYXJpYWJsZU9iamVjdFtdLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRpbnN0YW5jZU5hbWU/OiBTaGFkZXJQcmVjaXNpb25UeXBlXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZUJsb2NrTmFtZSA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMuc29tZSh1Ym8gPT4gdWJvLmJsb2NrTmFtZSA9PT0gYmxvY2tOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGVCbG9ja05hbWUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFVuaWZvcm1CdWZmZXJPYmplY3REZWNsYXJhdGlvbjogZHVwbGljYXRlIGJsb2NrIG5hbWUgJHtibG9ja05hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCB1Ym8gb2YgdGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzKSB7XG5cdFx0XHRmb3IgKGNvbnN0IHVib1ZhcmlhYmxlT2JqZWN0IG9mIHViby52YXJpYWJsZU9iamVjdHMpIHtcblx0XHRcdFx0Zm9yIChjb25zdCB2YXJpYWJsZU9iamVjdCBvZiB2YXJpYWJsZU9iamVjdHMpIHtcblx0XHRcdFx0XHRpZiAodWJvVmFyaWFibGVPYmplY3QudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU9iamVjdC52YXJpYWJsZU5hbWUpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFVuaWZvcm1CdWZmZXJPYmplY3REZWNsYXJhdGlvbjogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU9iamVjdC52YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzLnB1c2goe1xuXHRcdFx0YmxvY2tOYW1lLFxuXHRcdFx0dmFyaWFibGVPYmplY3RzLFxuXHRcdFx0aW5zdGFuY2VOYW1lOiBvcHRpb25zPy5pbnN0YW5jZU5hbWUsXG5cdFx0fSk7XG5cdH1cblxuXHQvLyB0aGUgcmV0dXJuIHZhbHVlIElkIGlzIGEgdmFsdWUgdG8gZGVsZXRlIHRoZSBmdW5jdGlvblxuXHQvLyB0aGUgbWFpbiBmdW5jdGlvbiBpcyBkZWZpbmVkICh1cGRhdGVkKSBieSB0aGUgdXBkYXRlTWFpbkZ1bmN0aW9uIG1ldGhvZFxuXHRwdWJsaWMgYWRkRnVuY3Rpb25EZWZpbml0aW9uKFxuXHRcdGZ1bmN0aW9uQ29kZTogc3RyaW5nLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRkZXBlbmRlbmN5TGV2ZWw/OiBudW1iZXJcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IGZ1bmN0aW9uSWQgPSB0aGlzLl9fZnVuY3Rpb25JZENvdW50Kys7XG5cblx0XHRjb25zdCBkZXBlbmRlbmN5TGV2ZWwgPSBvcHRpb25zPy5kZXBlbmRlbmN5TGV2ZWwgPz8gMDtcblx0XHR0aGlzLl9fZnVuY3Rpb25zW2RlcGVuZGVuY3lMZXZlbF0gPSB0aGlzLl9fZnVuY3Rpb25zW2RlcGVuZGVuY3lMZXZlbF0gPz8gW107XG5cdFx0dGhpcy5fX2Z1bmN0aW9uc1tkZXBlbmRlbmN5TGV2ZWxdLnB1c2goe1xuXHRcdFx0ZnVuY3Rpb25Db2RlLFxuXHRcdFx0ZnVuY3Rpb25JZFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uSWQ7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gdXBkYXRlIHBhcmFtZXRlcnMgZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHB1YmxpYyB1cGRhdGVHbG9iYWxQcmVjaXNpb24ocHJlY2lzaW9uOiBTaGFkZXJQcmVjaXNpb25PYmplY3QpIHtcblx0XHRPYmplY3QuYXNzaWduKHRoaXMuX19nbG9iYWxQcmVjaXNpb24sIHByZWNpc2lvbik7XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlU3RydWN0RGVmaW5pdGlvbihzdHJ1Y3ROYW1lOiBzdHJpbmcsIG1lbWJlck9iamVjdHM6IFNoYWRlclN0cnVjdE1lbWJlck9iamVjdFtdKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5maW5kSW5kZXgoc3RydWN0RGVmaW5pdGlvbiA9PiBzdHJ1Y3REZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdE5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGB1cGRhdGVTdHJ1Y3REZWZpbml0aW9uOiB0aGUgc3RydWN0IHR5cGUgbmFtZSAke3N0cnVjdE5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9uc1ttYXRjaGVkSW5kZXhdLm1lbWJlck9iamVjdHMgPSBtZW1iZXJPYmplY3RzO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZUdsb2JhbENvbnN0YW50VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlczogbnVtYmVyW10pIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLmZpbmRJbmRleChnbG9iYWxDb25zdGFudFZhbHVlID0+IGdsb2JhbENvbnN0YW50VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHVwZGF0ZUdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0eXBlID0gdGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzW21hdGNoZWRJbmRleF0udHlwZTtcblxuXHRcdGNvbnN0IGlzVmFsaWRDb21wb25lbnROdW1iZXIgPSBVdGlsaXR5Ll9pc1ZhbGlkQ29tcG9uZW50Q291bnQodHlwZSwgdmFsdWVzKTtcblx0XHRpZiAoIWlzVmFsaWRDb21wb25lbnROdW1iZXIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ3VwZGF0ZUdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSBjb21wb25lbnQgY291bnQgaXMgaW52YWxpZCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzSW50VHlwZSA9IFV0aWxpdHkuX2lzSW50VHlwZSh0eXBlKTtcblx0XHRpZiAoaXNJbnRUeXBlKSB7XG5cdFx0XHRjb25zdCBleGlzdE5vbkludGVnZXJWYWx1ZSA9IFNoYWRlcml0eU9iamVjdENyZWF0b3IuX19leGlzdE5vbkludGVnZXJWYWx1ZSh2YWx1ZXMpO1xuXHRcdFx0aWYgKGV4aXN0Tm9uSW50ZWdlclZhbHVlKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgdXBkYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlICR7dmFyaWFibGVOYW1lfSBoYXMgYSBub24taW50ZWdlciB2YWx1ZS5gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXNbbWF0Y2hlZEluZGV4XS52YWx1ZXMgPSB2YWx1ZXM7XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZywgdmFsdWVzOiB7W2tleVZhcmlhYmxlTmFtZTogc3RyaW5nXTogbnVtYmVyW119KSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5maW5kSW5kZXgoc3RydWN0VmFsdWUgPT4gc3RydWN0VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGB1cGRhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlOiAgdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlc1ttYXRjaGVkSW5kZXhdLnZhbHVlcyA9IHZhbHVlcztcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVNYWluRnVuY3Rpb24obWFpbkZ1bmN0aW9uQ29kZUlubmVyOiBzdHJpbmcpIHtcblx0XHR0aGlzLl9fbWFpbkZ1bmN0aW9uQ29kZSA9IG1haW5GdW5jdGlvbkNvZGVJbm5lcjtcblx0fVxuXG5cdC8vIHNwZWNpZnkgdGhlIG5hbWUgb2YgdGhlIG91dHB1dCBjb2xvciB2YXJpYWJsZSBmcm9tIHRoZSBtYWluIGZ1bmN0aW9uIGluIHRoZSBmcmFnbWVudCBzaGFkZXIuXG5cdC8vIHVzZXJzIGhhdmUgdG8gYXNzaWduIHRoZSByZXN1bHQgb2YgZnJhZ21lbnQgc2hhZGVyIGNhbGN1bGF0aW9uIHRvIHRoaXMgdmFyaWFibGUuXG5cdHB1YmxpYyB1cGRhdGVPdXRwdXRDb2xvclZhcmlhYmxlTmFtZShvdXRwdXRDb2xvclZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0aWYgKHRoaXMuX19zaGFkZXJTdGFnZSAhPT0gJ2ZyYWdtZW50Jykge1xuXHRcdFx0Y29uc29sZS5lcnJvcigndXBkYXRlT3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU6IHRoaXMgbWV0aG9kIGlzIGZvciBmcmFnbWVudCBzaGFkZXIgb25seScpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChvdXRwdXRDb2xvclZhcmlhYmxlTmFtZS5sZW5ndGggPT09IDApIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ3VwZGF0ZU91dHB1dENvbG9yVmFyaWFibGVOYW1lOiBpbnZhbGlkIG91dENvbG9yVmFyaWFibGVOYW1lJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX291dHB1dENvbG9yVmFyaWFibGVOYW1lID0gb3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gcmVtb3ZlIHBhcmFtZXRlcnMgZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHB1YmxpYyByZW1vdmVEZWZpbmVEaXJlY3RpdmUoZGVmaW5lRGlyZWN0aXZlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID0gdGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzLmluZGV4T2YoZGVmaW5lRGlyZWN0aXZlTmFtZSk7XG5cblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdyZW1vdmVkRGVmaW5lRGlyZWN0aXZlOiB0aGlzIGRlZmluZSBkaXJlY3RpdmUgaXMgbm90IGV4aXN0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZUV4dGVuc2lvbihleHRlbnNpb25OYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2V4dGVuc2lvbnMuZmluZEluZGV4KGV4dGVuc2lvbiA9PiBleHRlbnNpb24uZXh0ZW5zaW9uTmFtZSA9PT0gZXh0ZW5zaW9uTmFtZSk7XG5cblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdyZW1vdmVFeHRlbnNpb246IHRoaXMgZXh0ZW5zaW9uIGlzIG5vdCBleGlzdCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19leHRlbnNpb25zLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVN0cnVjdERlZmluaXRpb24oc3RydWN0TmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5maW5kSW5kZXgoc3RydWN0RGVmaW5pdGlvbiA9PiBzdHJ1Y3REZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdE5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGByZW1vdmVTdHJ1Y3REZWZpbml0aW9uOiB0aGUgc3RydWN0IHR5cGUgbmFtZSAke3N0cnVjdE5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVHbG9iYWxDb25zdGFudFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5maW5kSW5kZXgoZ2xvYmFsQ29uc3RhbnRWYWx1ZSA9PiBnbG9iYWxDb25zdGFudFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLmZpbmRJbmRleChzdHJ1Y3RWYWx1ZSA9PiBzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHVwZGF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWU6ICB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZUF0dHJpYnV0ZURlY2xhcmF0aW9uKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19hdHRyaWJ1dGVzLmZpbmRJbmRleChhdHRyaWJ1dGUgPT4gYXR0cmlidXRlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVBdHRyaWJ1dGU6IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fYXR0cmlidXRlcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVWYXJ5aW5nRGVjbGFyYXRpb24odmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3ZhcnlpbmdzLmZpbmRJbmRleCh2YXJ5aW5nID0+IHZhcnlpbmcudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZVZhcnlpbmc6IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdmFyeWluZ3Muc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlVW5pZm9ybURlY2xhcmF0aW9uKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX191bmlmb3Jtcy5maW5kSW5kZXgodW5pZm9ybSA9PiB1bmlmb3JtLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVVbmlmb3JtOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1zLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbih2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybVN0cnVjdHMuZmluZEluZGV4KHVuaWZvcm1TdHJ1Y3QgPT4gdW5pZm9ybVN0cnVjdC52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1TdHJ1Y3RzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVVuaWZvcm1CdWZmZXJPYmplY3REZWNsYXJhdGlvbihibG9ja05hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMuZmluZEluZGV4KHVibyA9PiB1Ym8uYmxvY2tOYW1lID09PSBibG9ja05hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbjogdGhlIHZhcmlhYmxlIG5hbWUgJHtibG9ja05hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVGdW5jdGlvbkRlZmluaXRpb24oZnVuY3Rpb25JZDogbnVtYmVyKSB7XG5cdFx0dGhpcy5fX2ZpbGxFbXB0eUZ1bmN0aW9ucygpO1xuXG5cdFx0Ly8gaWQgaXMgdG9vIHNtYWxsIG9yIHRvbyBiaWdcblx0XHRpZiAoZnVuY3Rpb25JZCA8IDAgfHwgZnVuY3Rpb25JZCA+PSB0aGlzLl9fZnVuY3Rpb25JZENvdW50KSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ3JlbW92ZUZ1bmN0aW9uRGVmaW5pdGlvbjogaW52YWxpZCBmdW5jdGlvbiBpZCcpXG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBmdW5jdGlvbk9iamVjdHMgb2YgdGhpcy5fX2Z1bmN0aW9ucykge1xuXHRcdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdFx0ZnVuY3Rpb25PYmplY3RzLmZpbmRJbmRleChmdW5jdGlvbk9iamVjdCA9PiBmdW5jdGlvbk9iamVjdC5mdW5jdGlvbklkID09PSBmdW5jdGlvbklkKTtcblx0XHRcdGlmIChtYXRjaGVkSW5kZXggIT09IC0xKSB7XG5cdFx0XHRcdGZ1bmN0aW9uT2JqZWN0cy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnNvbGUud2FybihgcmVtb3ZlRnVuY3Rpb25EZWZpbml0aW9uOiBub3QgZm91bmQgdGhlIGZ1bmN0aW9uIG9mIGZ1bmN0aW9uSWQgJHtmdW5jdGlvbklkfWApO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIGNyZWF0ZSBzaGFkZXJpdHkgb2JqZWN0IGZ1bmN0aW9uXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHB1YmxpYyBjcmVhdGVTaGFkZXJpdHlPYmplY3QoKTogU2hhZGVyaXR5T2JqZWN0IHtcblx0XHRjb25zdCBzaGFkZXJpdHlPYmogPSB7XG5cdFx0XHRjb2RlOiB0aGlzLl9fY3JlYXRlU2hhZGVyQ29kZSgpLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IHRoaXMuX19zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IHRoaXMuX19zaGFkZXJTdGFnZSA9PT0gJ2ZyYWdtZW50Jyxcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHNoYWRlcml0eU9iajtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBwcml2YXRlIG1ldGhvZHNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19leGlzdE5vbkludGVnZXJWYWx1ZSh2YWx1ZXM6IG51bWJlcltdKSB7XG5cdFx0Zm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcblx0XHRcdGlmICghTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIFRPRE86IGltcGxlbWVudCBzaGFkZXIgY29kZSBpbXBvcnQgZmVhdHVyZSAobG93IHByaW9yaXR5KVxuXHQvLyBwdWJsaWMgaW1wb3J0U2hhZGVyQ29kZShjb2RlOiBzdHJpbmcpIHt9XG5cblx0Ly8gbmVlZCB0byBhcHBseSBTaGFkZXJpdHkudHJhbnNmb3JtVG9HTFNMRVMxLCB0cmFuc2Zvcm1Ub0dMU0xFUzMgb3IgdHJhbnNmb3JtVG8gbWV0aG9kXG5cdHByaXZhdGUgX19jcmVhdGVTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0dGhpcy5fX2ZpbGxFbXB0eUZ1bmN0aW9ucygpO1xuXG5cdFx0Y29uc3QgY29kZVxuXHRcdFx0PSBgI3ZlcnNpb24gMzAwIGVzXFxuXFxuYFxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlRGVmaW5lRGlyZWN0aXZlU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVFeHRlbnNpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUdsb2JhbFByZWNpc2lvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlU3RydWN0RGVmaW5pdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZVNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlQXR0cmlidXRlRGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVZhcnlpbmdEZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlT3V0cHV0Q29sb3JEZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlVW5pZm9ybURlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVVuaWZvcm1CdWZmZXJPYmplY3RTaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUZ1bmN0aW9uRGVmaW5pdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlTWFpbkZ1bmN0aW9uRGVmaW5pdGlvblNoYWRlckNvZGUoKTtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2ZpbGxFbXB0eUZ1bmN0aW9ucygpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX19mdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRoaXMuX19mdW5jdGlvbnNbaV0gPSB0aGlzLl9fZnVuY3Rpb25zW2ldID8/IFtdO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVEZWZpbmVEaXJlY3RpdmVTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IGRlZmluZURpcmVjdGl2ZU5hbWUgb2YgdGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGAjZGVmaW5lICR7ZGVmaW5lRGlyZWN0aXZlTmFtZX1cXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7O1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUV4dGVuc2lvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgZXh0ZW5zaW9uIG9mIHRoaXMuX19leHRlbnNpb25zKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGAjZXh0ZW5zaW9uICR7ZXh0ZW5zaW9uLmV4dGVuc2lvbk5hbWV9OiAke2V4dGVuc2lvbi5iZWhhdmlvcn1cXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHQvL1RPRE86IHJlbW92ZSBuZWVkbGVzcyBwcmVjaXNpb25zXG5cdHByaXZhdGUgX19jcmVhdGVHbG9iYWxQcmVjaXNpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHR5cGUgaW4gdGhpcy5fX2dsb2JhbFByZWNpc2lvbikge1xuXHRcdFx0Y29uc3QgcHJlY2lzaW9uVHlwZSA9IHR5cGUgYXMgU2hhZGVyUHJlY2lzaW9uT2JqZWN0S2V5O1xuXHRcdFx0Y29uc3QgcHJlY2lzaW9uUXVhbGlmaWVyID0gdGhpcy5fX2dsb2JhbFByZWNpc2lvbltwcmVjaXNpb25UeXBlXTtcblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgcHJlY2lzaW9uICR7cHJlY2lzaW9uUXVhbGlmaWVyfSAke3ByZWNpc2lvblR5cGV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVTdHJ1Y3REZWZpbml0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBzdHJ1Y3REZWZpbml0aW9uIG9mIHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgc3RydWN0ICR7c3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lfSB7XFxuYDtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGUgPSBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHNbaV07XG5cblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgICBgO1xuXHRcdFx0XHRpZiAodmFyaWFibGUucHJlY2lzaW9uICE9IG51bGwpIHtcblx0XHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcmlhYmxlLnByZWNpc2lvbn0gYDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dmFyaWFibGUudHlwZX0gJHt2YXJpYWJsZS5tZW1iZXJOYW1lfTtcXG5gO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGB9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVHbG9iYWxDb25zdGFudFZhbHVlU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBnbG9iYWxDb25zdGFudFZhbHVlIG9mIHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcykge1xuXHRcdFx0Y29uc3QgdHlwZSA9IGdsb2JhbENvbnN0YW50VmFsdWUudHlwZTtcblx0XHRcdGNvbnN0IHZhcmlhYmxlTmFtZSA9IGdsb2JhbENvbnN0YW50VmFsdWUudmFyaWFibGVOYW1lO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBnbG9iYWxDb25zdGFudFZhbHVlLnZhbHVlcztcblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgY29uc3QgJHt0eXBlfSAke3ZhcmlhYmxlTmFtZX0gPSAke3R5cGV9KGA7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gdmFsdWVbaV0gKyAnLCAnO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlID0gc2hhZGVyQ29kZS5yZXBsYWNlKC8sXFxzJC8sICcpO1xcbicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3Qgc3RydWN0VmFsdWUgb2YgdGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzKSB7XG5cdFx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuZmluZEluZGV4KGRlZmluaXRpb24gPT4gZGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3RWYWx1ZS5zdHJ1Y3ROYW1lKTtcblx0XHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6IHRoZSBzdHJ1Y3QgdHlwZSAke3N0cnVjdFZhbHVlLnN0cnVjdE5hbWV9IGlzIG5vdCBkZWZpbmVkYCk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGBjb25zdCAke3N0cnVjdFZhbHVlLnN0cnVjdE5hbWV9ICR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSA9ICR7c3RydWN0VmFsdWUuc3RydWN0TmFtZX0gKFxcbmA7XG5cblx0XHRcdGNvbnN0IHN0cnVjdERlZmluaXRpb24gPSB0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnNbbWF0Y2hlZEluZGV4XTtcblx0XHRcdGlmIChzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHMubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhzdHJ1Y3RWYWx1ZS52YWx1ZXMpLmxlbmd0aCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiBJbnZhbGlkIG51bWJlciBvZiB2YXJpYWJsZXMgdGhhdCAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gaGFzYCk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBoYXNTYW1wbGVyVHlwZSA9XG5cdFx0XHRcdHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0cy5zb21lKG1lbWJlck9iamVjdCA9PiBVdGlsaXR5Ll9pc1NhbXBsZXJUeXBlKG1lbWJlck9iamVjdC50eXBlKSk7XG5cdFx0XHRpZiAoaGFzU2FtcGxlclR5cGUpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogQ29uc3RhbnRTdHJ1Y3RWYWx1ZSAoJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9KSBjYW5ub3QgaGF2ZSBzYW1wbGVyIHR5cGUgcGFyYW1ldGVyYCk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHNbaV0ubWVtYmVyTmFtZTtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBzdHJ1Y3RWYWx1ZS52YWx1ZXNbdmFyaWFibGVOYW1lXVxuXHRcdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6ICR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSBkb2VzIG5vdCBoYXZlIHRoZSB2YWx1ZSBvZiAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHR5cGUgPSBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHNbaV0udHlwZTtcblx0XHRcdFx0Y29uc3QgaXNWYWxpZENvbXBvbmVudE51bWJlciA9IFV0aWxpdHkuX2lzVmFsaWRDb21wb25lbnRDb3VudCh0eXBlLCB2YWx1ZSk7XG5cdFx0XHRcdGlmICghaXNWYWxpZENvbXBvbmVudE51bWJlcikge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6IHRoZSBjb21wb25lbnQgY291bnQgb2YgJHt2YXJpYWJsZU5hbWV9IGluICR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSBpcyBpbnZhbGlkYCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAgICR7dHlwZX0oYDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHNoYWRlckNvZGUgKz0gdmFsdWVbaV0gKyAnLCAnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2hhZGVyQ29kZSA9IHNoYWRlckNvZGUucmVwbGFjZSgvLFxccyQvLCAnKSxcXG4nKTtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSA9IHNoYWRlckNvZGUucmVwbGFjZSgvLFxcbiQvLCAnXFxuKTtcXG4nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUF0dHJpYnV0ZURlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgdGhpcy5fX2F0dHJpYnV0ZXMpIHtcblx0XHRcdGlmIChhdHRyaWJ1dGUubG9jYXRpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGBsYXlvdXQgKGxvY2F0aW9uID0gJHthdHRyaWJ1dGUubG9jYXRpb259KSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGBpbiBgO1xuXG5cdFx0XHRpZiAoYXR0cmlidXRlLnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7YXR0cmlidXRlLnByZWNpc2lvbn0gYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgJHthdHRyaWJ1dGUudHlwZX0gJHthdHRyaWJ1dGUudmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlVmFyeWluZ0RlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB2YXJ5aW5nIG9mIHRoaXMuX192YXJ5aW5ncykge1xuXHRcdFx0aWYgKHZhcnlpbmcuaW50ZXJwb2xhdGlvblR5cGUgIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcnlpbmcuaW50ZXJwb2xhdGlvblR5cGV9IGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gdGhpcy5fX3NoYWRlclN0YWdlID09ICd2ZXJ0ZXgnID8gYG91dCBgIDogYGluIGA7XG5cblx0XHRcdGlmICh2YXJ5aW5nLnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dmFyeWluZy5wcmVjaXNpb259IGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dmFyeWluZy50eXBlfSAke3ZhcnlpbmcudmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHQvL1RPRE86IHRyYW5zbGF0ZSB3aGVuIGdsc2wgZXMxXG5cdHByaXZhdGUgX19jcmVhdGVPdXRwdXRDb2xvckRlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGlmICh0aGlzLl9fc2hhZGVyU3RhZ2UgIT09ICdmcmFnbWVudCcpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRyZXR1cm4gYGxheW91dChsb2NhdGlvbiA9IDApIG91dCB2ZWM0ICR7dGhpcy5fX291dHB1dENvbG9yVmFyaWFibGVOYW1lfTtcXG5cXG5gO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVVuaWZvcm1EZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdW5pZm9ybSBvZiB0aGlzLl9fdW5pZm9ybXMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYHVuaWZvcm0gYDtcblxuXHRcdFx0aWYgKHVuaWZvcm0ucHJlY2lzaW9uICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt1bmlmb3JtLnByZWNpc2lvbn0gYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgJHt1bmlmb3JtLnR5cGV9ICR7dW5pZm9ybS52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHVuaWZvcm1TdHJ1Y3Qgb2YgdGhpcy5fX3VuaWZvcm1TdHJ1Y3RzKSB7XG5cdFx0XHRjb25zdCBzdHJ1Y3ROYW1lID0gdW5pZm9ybVN0cnVjdC5zdHJ1Y3ROYW1lO1xuXG5cdFx0XHRjb25zdCBleGlzdFN0cnVjdERlZmluaXRpb24gPVxuXHRcdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuc29tZShkZWZpbml0aW9uID0+IGRlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0TmFtZSk7XG5cdFx0XHRpZiAoIWV4aXN0U3RydWN0RGVmaW5pdGlvbikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvblNoYWRlckNvZGU6IHRoZSBzdHJ1Y3QgdHlwZSAke3N0cnVjdE5hbWV9IGlzIG5vdCBkZWZpbmVkYCk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGB1bmlmb3JtICR7c3RydWN0TmFtZX0gJHt1bmlmb3JtU3RydWN0LnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVVuaWZvcm1CdWZmZXJPYmplY3RTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHVibyBvZiB0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYGxheW91dCAoc3RkMTQwKSB1bmlmb3JtICR7dWJvLmJsb2NrTmFtZX0ge1xcbmA7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdWJvLnZhcmlhYmxlT2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZU9iaiA9IHViby52YXJpYWJsZU9iamVjdHNbaV07XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCAgJHt2YXJpYWJsZU9iai50eXBlfSAke3ZhcmlhYmxlT2JqLnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHViby5pbnN0YW5jZU5hbWUgIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGB9ICR7dWJvLmluc3RhbmNlTmFtZX07XFxuYDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYH07XFxuYDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUZ1bmN0aW9uRGVmaW5pdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fX2Z1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgZnVuY3Rpb25PYmplY3RzID0gdGhpcy5fX2Z1bmN0aW9uc1tpXTtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgZnVuY3Rpb25PYmplY3RzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gZnVuY3Rpb25PYmplY3RzW2pdLmZ1bmN0aW9uQ29kZSArIGBcXG5gO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlTWFpbkZ1bmN0aW9uRGVmaW5pdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5fX21haW5GdW5jdGlvbkNvZGUgKyBgXFxuYDtcblx0fVxufVxuIiwiaW1wb3J0IHtTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlLCBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMywgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsIFNoYWRlclZhcnlpbmdWYXJUeXBlfSBmcm9tICcuLi90eXBlcy90eXBlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbGl0eSB7XG5cdHN0YXRpYyBfc3BsaXRCeUxpbmVGZWVkQ29kZShzb3VyY2U6IHN0cmluZykge1xuXHRcdHJldHVybiBzb3VyY2Uuc3BsaXQoL1xcclxcbnxcXG4vKTtcblx0fVxuXG5cdHN0YXRpYyBfam9pblNwbGl0dGVkTGluZShzcGxpdHRlZExpbmU6IHN0cmluZ1tdKSB7XG5cdFx0cmV0dXJuIHNwbGl0dGVkTGluZS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHN0YXRpYyBfYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNvdXJjZTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHNvdXJjZSA9PT0gJycgPyBzb3VyY2UgOiBzb3VyY2UgKyAnXFxuJztcblx0fVxuXG5cdHN0YXRpYyBfY29tcG9uZW50TnVtYmVyKFxuXHRcdHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIHwgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSB8IFNoYWRlclZhcnlpbmdWYXJUeXBlIHwgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzNcblx0KSB7XG5cdFx0bGV0IGNvbXBvbmVudE51bWJlcjtcblx0XHRpZiAoXG5cdFx0XHR0eXBlID09PSAnZmxvYXQnIHx8IHR5cGUgPT09ICdpbnQnIHx8IHR5cGUgPT09ICdib29sJyB8fCB0eXBlID09PSAndWludCcgfHxcblx0XHRcdHR5cGUgPT09ICdzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICdzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ3NhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ3NhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ2lzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICdpc2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICdpc2FtcGxlcjNEJyB8fCB0eXBlID09PSAnaXNhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3VzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICd1c2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICd1c2FtcGxlcjNEJyB8fCB0eXBlID09PSAndXNhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3NhbXBsZXIyRFNoYWRvdycgfHwgdHlwZSA9PT0gJ3NhbXBsZXJDdWJlU2hhZG93JyB8fCB0eXBlID09PSAnc2FtcGxlcjJEQXJyYXlTaGFkb3cnXG5cdFx0KSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAxO1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3ZlYzInIHx8IHR5cGUgPT09ICdpdmVjMicgfHwgdHlwZSA9PT0gJ2J2ZWMyJyB8fCB0eXBlID09PSAndXZlYzInKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAyO1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3ZlYzMnIHx8IHR5cGUgPT09ICdpdmVjMycgfHwgdHlwZSA9PT0gJ2J2ZWMzJyB8fCB0eXBlID09PSAndXZlYzMnKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAzO1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3ZlYzQnIHx8IHR5cGUgPT09ICdpdmVjNCcgfHwgdHlwZSA9PT0gJ2J2ZWM0JyB8fCB0eXBlID09PSAndXZlYzQnIHx8IHR5cGUgPT09ICdtYXQyJyB8fCB0eXBlID09PSAnbWF0MngyJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gNDtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQyeDMnIHx8IHR5cGUgPT09ICdtYXQzeDInKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSA2O1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDJ4NCcgfHwgdHlwZSA9PT0gJ21hdDR4MicpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDg7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0MycgfHwgdHlwZSA9PT0gJ21hdDN4MycpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDk7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0M3g0JyB8fCB0eXBlID09PSAnbWF0NHgzJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMTI7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0NCcgfHwgdHlwZSA9PT0gJ21hdDR4NCcpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDE2O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyB1bmtub3duIHR5cGVcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDA7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdVdGlsaXR5Ll9jb21wb25lbnROdW1iZXI6IGRldGVjdCB1bmtub3duIHR5cGUnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29tcG9uZW50TnVtYmVyO1xuXHR9XG5cblx0c3RhdGljIF9pc0ludFR5cGUoXG5cdFx0dHlwZTogU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgfCBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlIHwgU2hhZGVyVmFyeWluZ1ZhclR5cGUgfCBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTM1xuXHQpIHtcblx0XHRpZiAoXG5cdFx0XHR0eXBlID09PSAnaW50JyB8fCB0eXBlID09PSAnaXZlYzInIHx8IHR5cGUgPT09ICdpdmVjMycgfHwgdHlwZSA9PT0gJ2l2ZWM0JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3VpbnQnIHx8IHR5cGUgPT09ICd1dmVjMicgfHwgdHlwZSA9PT0gJ3V2ZWMzJyB8fCB0eXBlID09PSAndXZlYzQnXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyBfaXNWYWxpZENvbXBvbmVudENvdW50KFxuXHRcdHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIHwgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSB8IFNoYWRlclZhcnlpbmdWYXJUeXBlIHwgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsXG5cdFx0dmFsdWVzOiBudW1iZXJbXVxuXHQpIHtcblx0XHRjb25zdCB2YWxpZENvbXBvbmVudENvdW50ID0gVXRpbGl0eS5fY29tcG9uZW50TnVtYmVyKHR5cGUpO1xuXHRcdGlmICh2YWxpZENvbXBvbmVudENvdW50ID09PSB2YWx1ZXMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0c3RhdGljIF9pc1NhbXBsZXJUeXBlKFxuXHRcdHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIHwgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSB8IFNoYWRlclZhcnlpbmdWYXJUeXBlIHwgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzNcblx0KSB7XG5cdFx0aWYgKFxuXHRcdFx0dHlwZSA9PT0gJ3NhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ3NhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAnc2FtcGxlcjNEJyB8fCB0eXBlID09PSAnc2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAnaXNhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICdpc2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAndXNhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICd1c2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAnc2FtcGxlcjJEU2hhZG93JyB8fCB0eXBlID09PSAnc2FtcGxlckN1YmVTaGFkb3cnIHx8IHR5cGUgPT09ICdzYW1wbGVyMkRBcnJheVNoYWRvdydcblx0XHQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9