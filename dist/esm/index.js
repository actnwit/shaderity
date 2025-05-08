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
    static process(splittedLines) {
        const define = /#define[\t ]+(\w+)/;
        const ifdef = /#ifdef[\t ]+(\w+)/;
        const elif = /#elif[\t ]+defined\((\w+)\)/;
        const _else = /#else/;
        const endif = /#endif/;
        const outputHistory = [];
        const previousOutputStates = [];
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
            { // #ifdef
                const re = line.match(ifdef);
                if (re != null) {
                    previousOutputStates.push(outputFlg);
                    outputHistory.push(outputFlg);
                    const toCheckDef = re[1];
                    ifdefs.push([toCheckDef]);
                    if (outputFlg) {
                        if (definitions.indexOf(toCheckDef) === -1) {
                            outputFlg = false;
                            ifdefMatched.push(false);
                        }
                        else {
                            ifdefMatched.push(true);
                        }
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
                    const toCheckDef = re[1];
                    const currentIfdefs = ifdefs[ifdefs.length - 1];
                    if (previousOutputStates[previousOutputStates.length - 1] && !ifdefMatched[ifdefMatched.length - 1]) {
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
                    outputHistory.pop();
                    previousOutputStates.pop();
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

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluL1ByZVByb2Nlc3Nvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9SZWZsZWN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluL1NoYWRlckVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9TaGFkZXJUcmFuc2Zvcm1lci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9TaGFkZXJpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4vU2hhZGVyaXR5T2JqZWN0Q3JlYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9VdGlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsNEdBQXlD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QUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDM0QsSUFB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LEVBQzVGO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDWjthQUFNO1lBQ04sT0FBTyxLQUFLLENBQUM7U0FDYjtJQUNGLENBQUM7Q0FDRDtBQXhGRCwwQkF3RkMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vLi4vLi4vZGlzdC9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgU2hhZGVyaXR5IGZyb20gJy4vbWFpbi9TaGFkZXJpdHknO1xyXG5pbXBvcnQgX1NoYWRlcml0eU9iamVjdENyZWF0b3IgZnJvbSAnLi9tYWluL1NoYWRlcml0eU9iamVjdENyZWF0b3InO1xyXG5pbXBvcnQgX1JlZmxlY3Rpb24gZnJvbSAnLi9tYWluL1JlZmxlY3Rpb24nO1xyXG5cclxuaW1wb3J0IHtcclxuICBBdHRyaWJ1dGVTZW1hbnRpY3MgYXMgX0F0dHJpYnV0ZVNlbWFudGljcyxcclxuICBSZWZsZWN0aW9uQXR0cmlidXRlIGFzIF9SZWZsZWN0aW9uQXR0cmlidXRlLFxyXG4gIFJlZmxlY3Rpb25Vbmlmb3JtIGFzIF9SZWZsZWN0aW9uVW5pZm9ybSxcclxuICBSZWZsZWN0aW9uVmFyeWluZyBhcyBfUmVmbGVjdGlvblZhcnlpbmcsXHJcbiAgU2hhZGVyaXR5T2JqZWN0IGFzIF9TaGFkZXJpdHlPYmplY3QsXHJcbiAgU2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3IgYXMgX1NoYWRlckV4dGVuc2lvbkJlaGF2aW9yLFxyXG4gIFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIGFzIF9TaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyxcclxuICBTaGFkZXJQcmVjaXNpb25PYmplY3QgYXMgX1NoYWRlclByZWNpc2lvbk9iamVjdCxcclxuICBTaGFkZXJTdGFnZVN0ciBhcyBfU2hhZGVyU3RhZ2VTdHIsXHJcbiAgU2hhZGVyUHJlY2lzaW9uVHlwZSBhcyBfU2hhZGVyUHJlY2lzaW9uVHlwZSxcclxuICBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlIGFzIF9TaGFkZXJBdHRyaWJ1dGVWYXJUeXBlLFxyXG4gIFNoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSBhcyBfU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlLFxyXG4gIFNoYWRlclZhcnlpbmdWYXJUeXBlIGFzIF9TaGFkZXJWYXJ5aW5nVmFyVHlwZSxcclxuICBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyBhcyBfU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsXHJcbiAgU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0IGFzIF9TaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3QsXHJcbiAgU2hhZGVyVUJPVmFyaWFibGVPYmplY3QgYXMgX1NoYWRlclVCT1ZhcmlhYmxlT2JqZWN0LFxyXG4gIFNoYWRlckF0dHJpYnV0ZU9iamVjdCBhcyBfU2hhZGVyQXR0cmlidXRlT2JqZWN0LFxyXG4gIFNoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3QgYXMgX1NoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3QsXHJcbiAgU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdCBhcyBfU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdCxcclxuICBTaGFkZXJFeHRlbnNpb25PYmplY3QgYXMgX1NoYWRlckV4dGVuc2lvbk9iamVjdCxcclxuICBTaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0IGFzIF9TaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0LFxyXG4gIFNoYWRlclVuaWZvcm1CdWZmZXJPYmplY3QgYXMgX1NoYWRlclVuaWZvcm1CdWZmZXJPYmplY3QsXHJcbiAgU2hhZGVyVW5pZm9ybU9iamVjdCBhcyBfU2hhZGVyVW5pZm9ybU9iamVjdCxcclxuICBTaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0IGFzIF9TaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0LFxyXG4gIFNoYWRlclZhcnlpbmdPYmplY3QgYXMgX1NoYWRlclZhcnlpbmdPYmplY3QsXHJcbiAgU2hhZGVyVmVyc2lvbiBhcyBfU2hhZGVyVmVyc2lvbixcclxuICBUZW1wbGF0ZU9iamVjdCBhcyBfVGVtcGxhdGVPYmplY3QsXHJcbiAgVW5pZm9ybVNlbWFudGljcyBhcyBfVW5pZm9ybVNlbWFudGljcyxcclxuICBWYXJUeXBlIGFzIF9WYXJUeXBlLFxyXG59IGZyb20gJy4vdHlwZXMvdHlwZSc7XHJcblxyXG5leHBvcnQge1xyXG4gIFNoYWRlcml0eU9iamVjdENyZWF0b3IgYXMgX1NoYWRlcml0eU9iamVjdENyZWF0b3IsXHJcbiAgUmVmbGVjdGlvbiBhcyBfUmVmbGVjdGlvbixcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQXR0cmlidXRlU2VtYW50aWNzID0gX0F0dHJpYnV0ZVNlbWFudGljcztcclxuZXhwb3J0IHR5cGUgUmVmbGVjdGlvbkF0dHJpYnV0ZSA9IF9SZWZsZWN0aW9uQXR0cmlidXRlO1xyXG5leHBvcnQgdHlwZSBSZWZsZWN0aW9uVW5pZm9ybSA9IF9SZWZsZWN0aW9uVW5pZm9ybTtcclxuZXhwb3J0IHR5cGUgUmVmbGVjdGlvblZhcnlpbmcgPSBfUmVmbGVjdGlvblZhcnlpbmc7XHJcbmV4cG9ydCB0eXBlIFNoYWRlcml0eU9iamVjdCA9IF9TaGFkZXJpdHlPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckV4dGVuc2lvbkJlaGF2aW9yID0gX1NoYWRlckV4dGVuc2lvbkJlaGF2aW9yO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyA9IF9TaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMztcclxuZXhwb3J0IHR5cGUgU2hhZGVyUHJlY2lzaW9uT2JqZWN0ID0gX1NoYWRlclByZWNpc2lvbk9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyU3RhZ2VTdHIgPSBfU2hhZGVyU3RhZ2VTdHI7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclByZWNpc2lvblR5cGUgPSBfU2hhZGVyUHJlY2lzaW9uVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSA9IF9TaGFkZXJBdHRyaWJ1dGVWYXJUeXBlO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUgPSBfU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJWYXJ5aW5nVmFyVHlwZSA9IF9TaGFkZXJWYXJ5aW5nVmFyVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMgPSBfU2hhZGVyVW5pZm9ybVZhclR5cGVFUzM7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclN0cnVjdE1lbWJlck9iamVjdCA9IF9TaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVCT1ZhcmlhYmxlT2JqZWN0ID0gX1NoYWRlclVCT1ZhcmlhYmxlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJBdHRyaWJ1dGVPYmplY3QgPSBfU2hhZGVyQXR0cmlidXRlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0ID0gX1NoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckNvbnN0YW50VmFsdWVPYmplY3QgPSBfU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyRXh0ZW5zaW9uT2JqZWN0ID0gX1NoYWRlckV4dGVuc2lvbk9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdCA9IF9TaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0ID0gX1NoYWRlclVuaWZvcm1CdWZmZXJPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVuaWZvcm1PYmplY3QgPSBfU2hhZGVyVW5pZm9ybU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCA9IF9TaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJWYXJ5aW5nT2JqZWN0ID0gX1NoYWRlclZhcnlpbmdPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclZlcnNpb24gPSBfU2hhZGVyVmVyc2lvbjtcclxuZXhwb3J0IHR5cGUgVGVtcGxhdGVPYmplY3QgPSBfVGVtcGxhdGVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFVuaWZvcm1TZW1hbnRpY3MgPSBfVW5pZm9ybVNlbWFudGljcztcclxuZXhwb3J0IHR5cGUgVmFyVHlwZSA9IF9WYXJUeXBlO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJpdHlPYmplY3RDcmVhdG9yID0gX1NoYWRlcml0eU9iamVjdENyZWF0b3I7XHJcbmV4cG9ydCB0eXBlIFJlZmxlY3Rpb24gPSBfUmVmbGVjdGlvbjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNoYWRlcml0eVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVQcm9jZXNzb3Ige1xuICAgIHB1YmxpYyBzdGF0aWMgcHJvY2VzcyhzcGxpdHRlZExpbmVzOiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3QgZGVmaW5lID0gLyNkZWZpbmVbXFx0IF0rKFxcdyspLztcbiAgICAgICAgY29uc3QgaWZkZWYgPSAvI2lmZGVmW1xcdCBdKyhcXHcrKS87XG4gICAgICAgIGNvbnN0IGVsaWYgPSAvI2VsaWZbXFx0IF0rZGVmaW5lZFxcKChcXHcrKVxcKS87XG4gICAgICAgIGNvbnN0IF9lbHNlID0gLyNlbHNlLztcbiAgICAgICAgY29uc3QgZW5kaWYgPSAvI2VuZGlmLztcbiAgICAgICAgY29uc3Qgb3V0cHV0SGlzdG9yeTogYm9vbGVhbltdID0gW107XG4gICAgICAgIGNvbnN0IHByZXZpb3VzT3V0cHV0U3RhdGVzOiBib29sZWFuW10gPSBbXTtcbiAgICAgICAgbGV0IG91dHB1dEZsZyA9IHRydWU7XG4gICAgICAgIGNvbnN0IGRlZmluaXRpb25zOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBjb25zdCBpZmRlZnM6IHN0cmluZ1tdW10gPSBbXTtcbiAgICAgICAgY29uc3QgaWZkZWZNYXRjaGVkOiBib29sZWFuW10gPSBbXTtcbiAgICAgICAgY29uc3Qgb3V0cHV0TGluZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZExpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gc3BsaXR0ZWRMaW5lc1tpXTtcbiAgICAgICAgICAgIGxldCBpc1ByYWdtYSA9IGZhbHNlO1xuICAgICAgICAgICAgeyAvLyAjZGVmaW5lXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBsaW5lLm1hdGNoKGRlZmluZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5pdGlvbnMucHVzaChyZVsxXSk7XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2lmZGVmXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBsaW5lLm1hdGNoKGlmZGVmKTtcbiAgICAgICAgICAgICAgICBpZiAocmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c091dHB1dFN0YXRlcy5wdXNoKG91dHB1dEZsZyk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEhpc3RvcnkucHVzaChvdXRwdXRGbGcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b0NoZWNrRGVmID0gcmVbMV07XG4gICAgICAgICAgICAgICAgICAgIGlmZGVmcy5wdXNoKFt0b0NoZWNrRGVmXSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAob3V0cHV0RmxnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVmaW5pdGlvbnMuaW5kZXhPZih0b0NoZWNrRGVmKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZmRlZk1hdGNoZWQucHVzaChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmZGVmTWF0Y2hlZC5wdXNoKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWZkZWZNYXRjaGVkLnB1c2goZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2VsaWZcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IGxpbmUubWF0Y2goZWxpZik7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9DaGVja0RlZiA9IHJlWzFdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SWZkZWZzID0gaWZkZWZzW2lmZGVmcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c091dHB1dFN0YXRlc1twcmV2aW91c091dHB1dFN0YXRlcy5sZW5ndGggLSAxXSAmJiAhaWZkZWZNYXRjaGVkW2lmZGVmTWF0Y2hlZC5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmluaXRpb25zLmluZGV4T2YodG9DaGVja0RlZikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZmRlZk1hdGNoZWRbaWZkZWZNYXRjaGVkLmxlbmd0aCAtIDFdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SWZkZWZzLnB1c2godG9DaGVja0RlZik7XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2Vsc2VcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IGxpbmUubWF0Y2goX2Vsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c091dHB1dFN0YXRlc1twcmV2aW91c091dHB1dFN0YXRlcy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gIWlmZGVmTWF0Y2hlZFtpZmRlZk1hdGNoZWQubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpc1ByYWdtYSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB7IC8vICNlbmRpZlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlID0gbGluZS5tYXRjaChlbmRpZik7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gcHJldmlvdXNPdXRwdXRTdGF0ZXNbcHJldmlvdXNPdXRwdXRTdGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGlzUHJhZ21hID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWZkZWZzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZmRlZk1hdGNoZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEhpc3RvcnkucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzT3V0cHV0U3RhdGVzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG91dHB1dEZsZyAmJiAhaXNQcmFnbWEpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXRMaW5lcztcbiAgICB9XG59XG5cbiIsImltcG9ydCB7XG5cdEF0dHJpYnV0ZVNlbWFudGljcyxcblx0UmVmbGVjdGlvbkF0dHJpYnV0ZSxcblx0UmVmbGVjdGlvblVuaWZvcm0sXG5cdFJlZmxlY3Rpb25WYXJ5aW5nLFxuXHRTaGFkZXJTdGFnZVN0cixcblx0VW5pZm9ybVNlbWFudGljcyxcblx0VmFyVHlwZSxcbn0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBnZXRzIHRoZSBhdHRyaWJ1dGUsIHZhcnlpbmcsIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uIGZyb20gdGhlIGNvZGUgcHJvcGVydHkgb2YgYSBzaGFkZXJpdHkgb2JqZWN0LlxuICogVGhlIG1ldGhvZHMgb2YgdGhlIFNoYWRlcml0eSBpbnN0YW5jZSBjcmVhdGUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcy5cbiAqXG4gKiBCZWZvcmUgZ2V0dGluZyB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIGF0dHJpYnV0ZSwgdmFyeWluZywgYW5kIHVuaWZvcm0sIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZmxlY3Rpb24ge1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBhdHRyaWJ1dGVBbmRWYXJ5aW5nVHlwZVJlZ0V4cFxuXHRcdD0gL1tcXHQgXSsoZmxvYXR8aW50fHZlYzJ8dmVjM3x2ZWM0fG1hdDJ8bWF0M3xtYXQ0fGl2ZWMyfGl2ZWMzfGl2ZWM0KVtcXHQgXSsoXFx3Kyk7Lztcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgdW5pZm9ybVR5cGVSZWdFeHBcblx0XHQ9IC9bXFx0IF0rKGZsb2F0fGludHx2ZWMyfHZlYzN8dmVjNHxtYXQyfG1hdDN8bWF0NHxpdmVjMnxpdmVjM3xpdmVjNHxzYW1wbGVyMkR8c2FtcGxlckN1YmV8c2FtcGxlcjNEKVtcXHQgXSsoXFx3Kyk7Lztcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgc2VtYW50aWNSZWdFeHAgPSAvPC4qc2VtYW50aWNbXFx0IF0qPVtcXHQgXSooXFx3KykuKj4vO1xuXG5cdHByaXZhdGUgX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXHRwcml2YXRlIF9fdW5pZm9ybVNlbWFudGljc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdHByaXZhdGUgX19hdHRyaWJ1dGVzOiBSZWZsZWN0aW9uQXR0cmlidXRlW10gPSBbXTtcblx0cHJpdmF0ZSBfX3ZhcnlpbmdzOiBSZWZsZWN0aW9uVmFyeWluZ1tdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtczogUmVmbGVjdGlvblVuaWZvcm1bXSA9IFtdO1xuXG5cdHByaXZhdGUgcmVhZG9ubHkgX19zcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdO1xuXHRwcml2YXRlIHJlYWRvbmx5IF9fc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyO1xuXG5cdGNvbnN0cnVjdG9yKHNwbGl0dGVkU2hhZGVyaXR5U2hhZGVyQ29kZTogc3RyaW5nW10sIHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdHRoaXMuX19zcGxpdHRlZFNoYWRlckNvZGUgPSBzcGxpdHRlZFNoYWRlcml0eVNoYWRlckNvZGU7XG5cdFx0dGhpcy5fX3NoYWRlclN0YWdlID0gc2hhZGVyU3RhZ2U7XG5cdFx0dGhpcy5fX3NldERlZmF1bHRBdHRyaWJ1dGVBbmRVbmlmb3JtU2VtYW50aWNzTWFwKCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhbGwgYXR0cmlidXRlIHZhcmlhYmxlIGluZm9ybWF0aW9uIGluIHRoZSBzaGFkZXIgY29kZS5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIFJlZmxlY3Rpb25BdHRyaWJ1dGUgb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGF0dHJpYnV0ZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19hdHRyaWJ1dGVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYWxsIHZhcnlpbmcgdmFyaWFibGUgaW5mb3JtYXRpb24gaW4gdGhlIHNoYWRlciBjb2RlLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgUmVmbGVjdGlvblZhcnlpbmcgb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHZhcnlpbmdzKCkge1xuXHRcdHJldHVybiB0aGlzLl9fdmFyeWluZ3M7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhbGwgdW5pZm9ybSB2YXJpYWJsZSBpbmZvcm1hdGlvbiBpbiB0aGUgc2hhZGVyIGNvZGUuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBSZWZsZWN0aW9uVW5pZm9ybSBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgdW5pZm9ybXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX191bmlmb3Jtcztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIG5hbWVzIG9mIGFsbCBhdHRyaWJ1dGVzIGluY2x1ZGVkIGluIHRoZSBzaGFkZXIuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBzdHJpbmdcblx0ICovXG5cdHB1YmxpYyBnZXQgYXR0cmlidXRlc05hbWVzKCkge1xuXHRcdHJldHVybiB0aGlzLl9fYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge3JldHVybiBhdHRyaWJ1dGUubmFtZX0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgYXR0cmlidXRlIHNlbWFudGljIChlLmcuICdQT1NJVElPTicpIG9mIGFsbCBhdHRyaWJ1dGVzIGluY2x1ZGVkIGluIHRoZSBzaGFkZXIuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBBdHRyaWJ1dGVTZW1hbnRpY3Mgb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGF0dHJpYnV0ZXNTZW1hbnRpY3MoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7cmV0dXJuIGF0dHJpYnV0ZS5zZW1hbnRpY30pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgdmFyaWFibGUgdHlwZSAoZS5nLiAndmVjNCcpIG9mIGFsbCBhdHRyaWJ1dGVzIGluY2x1ZGVkIGluIHRoZSBzaGFkZXIuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBWYXJUeXBlIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCBhdHRyaWJ1dGVzVHlwZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7cmV0dXJuIGF0dHJpYnV0ZS50eXBlfSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGFuIGF0dHJpYnV0ZVNlbWFudGljcy5cblx0ICogVGhlIGF0dHJpYnV0ZVNlbWFudGljcyBpcyB1c2VkIGluIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljc1xuXHQgKiAoU2VlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgY2xhc3MpXG5cdCAqL1xuXHRwdWJsaWMgYWRkQXR0cmlidXRlU2VtYW50aWNzTWFwKG1hcDogTWFwPHN0cmluZywgc3RyaW5nPikge1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAgPSBuZXcgTWFwKFsuLi50aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLCAuLi5tYXBdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYSB1bmlmb3JtU2VtYW50aWNzLlxuXHQgKiBUaGUgYXR0cmlidXRlU2VtYW50aWNzIGlzIHVzZWQgaW4gdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWNzXG5cdCAqIChTZWUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBjbGFzcylcblx0ICovXG5cdHB1YmxpYyBhZGRVbmlmb3JtU2VtYW50aWNzTWFwKG1hcDogTWFwPHN0cmluZywgc3RyaW5nPikge1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwID0gbmV3IE1hcChbLi4udGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAsIC4uLm1hcF0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhbiBhdHRyaWJ1dGVTZW1hbnRpY3MuXG5cdCAqIFRoZSBhdHRyaWJ1dGVTZW1hbnRpY3MgaXMgdXNlZCBpbiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpY3Ncblx0ICogKFNlZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGNsYXNzKVxuXHQgKi9cblx0cHVibGljIGFkZEF0dHJpYnV0ZVNlbWFudGljcyhrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KGtleSwgdmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhIHVuaWZvcm1TZW1hbnRpY3MuXG5cdCAqIFRoZSBhdHRyaWJ1dGVTZW1hbnRpY3MgaXMgdXNlZCBpbiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpY3Ncblx0ICogKFNlZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGNsYXNzKVxuXHQgKi9cblx0cHVibGljIGFkZFVuaWZvcm1TZW1hbnRpY3Moa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoa2V5LCB2YWx1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSBhdHRyaWJ1dGVTZW1hbnRpY3Ncblx0ICovXG5cdHB1YmxpYyByZXNldEF0dHJpYnV0ZVNlbWFudGljcygpIHtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHVuaWZvcm1TZW1hbnRpY3Ncblx0ICovXG5cdHB1YmxpYyByZXNldFVuaWZvcm1TZW1hbnRpY3MoKSB7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFuYWx5emUgc2hhZGVyIGNvZGUgb2YgdGhlIHNoYWRlcml0eSBhbmQgZ2V0IGluZm9ybWF0aW9uIG9mIGF0dHJpYnV0ZSwgdmFyeWluZyBhbmQgdW5pZm9ybS5cblx0ICogVGhlIGluZm9ybWF0aW9uIGNhbiBiZSByZXRyaWV2ZWQgZnJvbSB0aGUgZ2V0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKlxuXHQgKiBUaGUgc2VtYW50aWMgcHJvcGVydHkgb2YgdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUgaXMgYXNzaWduZWQgdG8gdGhlIHZhbHVlIG9mIHRoZSBzZW1hbnRpYyBpZlxuXHQgKiBpdCBpcyBzcGVjaWZpZWQgaW4gdGhlIGF0dHJpYnV0ZSBsaW5lIG9mIHRoZSBzaGFkZXIgY29kZS4gSWYgbm90LCB0aGUgQXR0cmlidXRlU2VtYW50aWNzTWFwXG5cdCAqIGlzIHNlYXJjaGVkIGZvciBtYXRjaGluZyBzZW1hbnRpY3MsIG9yIFVOS05PV04uIFRoZSBzYW1lIGFwcGxpZXMgdG8gdGhlIHNlbWFudGljIHByb3BlcnR5IG9mXG5cdCAqIFJlZmxlY3Rpb25Vbmlmb3JtLlxuXHQgKi9cblx0cHVibGljIHJlZmxlY3QoKSB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gdGhpcy5fX3NwbGl0dGVkU2hhZGVyQ29kZTtcblx0XHRjb25zdCBzaGFkZXJTdGFnZSA9IHRoaXMuX19zaGFkZXJTdGFnZTtcblxuXHRcdGZvciAoY29uc3Qgc2hhZGVyQ29kZUxpbmUgb2Ygc3BsaXR0ZWRTaGFkZXJDb2RlKSB7XG5cdFx0XHRjb25zdCBpc0F0dHJpYnV0ZUxpbmUgPSB0aGlzLl9fbWF0Y2hBdHRyaWJ1dGUoc2hhZGVyQ29kZUxpbmUsIHNoYWRlclN0YWdlKTtcblx0XHRcdGlmIChpc0F0dHJpYnV0ZUxpbmUpIHtcblx0XHRcdFx0dGhpcy5fX2FkZEF0dHJpYnV0ZShzaGFkZXJDb2RlTGluZSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpc1ZhcnlpbmdMaW5lID0gdGhpcy5fX21hdGNoVmFyeWluZyhzaGFkZXJDb2RlTGluZSwgc2hhZGVyU3RhZ2UpO1xuXHRcdFx0aWYgKGlzVmFyeWluZ0xpbmUpIHtcblx0XHRcdFx0dGhpcy5fX2FkZFZhcnlpbmcoc2hhZGVyQ29kZUxpbmUsIHNoYWRlclN0YWdlKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzVW5pZm9ybUxpbmUgPSBzaGFkZXJDb2RlTGluZS5tYXRjaCgvXig/IVtcXC9dKVtcXHQgXSp1bmlmb3JtW1xcdCBdKy8pO1xuXHRcdFx0aWYgKGlzVW5pZm9ybUxpbmUpIHtcblx0XHRcdFx0dGhpcy5fX2FkZFVuaWZvcm0oc2hhZGVyQ29kZUxpbmUpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9fc2V0RGVmYXVsdEF0dHJpYnV0ZUFuZFVuaWZvcm1TZW1hbnRpY3NNYXAoKSB7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3Bvc2l0aW9uJywgJ1BPU0lUSU9OJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2NvbG9yJCcsICdDT0xPUl8wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2NvbG9yXz8wJywgJ0NPTE9SXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGV4Y29vcmQkJywgJ1RFWENPT1JEXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGV4Y29vcmRfPzAnLCAnVEVYQ09PUkRfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0ZXhjb29yZF8/MScsICdURVhDT09SRF8xJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RleGNvb3JkXz8yJywgJ1RFWENPT1JEXzInKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnbm9ybWFsJywgJ05PUk1BTCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0YW5nZW50JywgJ1RBTkdFTlQnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnam9pbnQkJywgJ0pPSU5UU18wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2JvbmUkJywgJ0pPSU5UU18wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2pvaW50Xz8wJywgJ0pPSU5UU18wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2JvbmVfPzAnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnd2VpZ2h0JCcsICdXRUlHSFRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnd2VpZ2h0Xz8wJywgJ1dFSUdIVFNfMCcpO1xuXG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCd3b3JsZG1hdHJpeCcsICdXb3JsZE1hdHJpeCcpO1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgnbm9ybWFsbWF0cml4JywgJ05vcm1hbE1hdHJpeCcpO1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgndmlld21hdHJpeCcsICdWaWV3TWF0cml4Jyk7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCdwcm9qZWN0aW9ubWF0cml4JywgJ1Byb2plY3Rpb25NYXRyaXgnKTtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ21vZGVsdmlld21hdHJpeCcsICdNb2RlbFZpZXdNYXRyaXgnKTtcblx0fVxuXG5cdHByaXZhdGUgX19tYXRjaEF0dHJpYnV0ZShzaGFkZXJDb2RlTGluZTogc3RyaW5nLCBzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHRpZiAoc2hhZGVyU3RhZ2UgIT09ICd2ZXJ0ZXgnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiBzaGFkZXJDb2RlTGluZS5tYXRjaCgvXig/IVtcXC9dKVtcXHQgXSooYXR0cmlidXRlfGluKVtcXHQgXSsuKzsvKTtcblx0fVxuXG5cdHByaXZhdGUgX19hZGRBdHRyaWJ1dGUoc2hhZGVyQ29kZUxpbmU6IHN0cmluZykge1xuXHRcdGNvbnN0IHJlZmxlY3Rpb25BdHRyaWJ1dGU6IFJlZmxlY3Rpb25BdHRyaWJ1dGUgPSB7XG5cdFx0XHRuYW1lOiAnJyxcblx0XHRcdHR5cGU6ICdmbG9hdCcsXG5cdFx0XHRzZW1hbnRpYzogJ1VOS05PV04nXG5cdFx0fTtcblxuXHRcdGNvbnN0IG1hdGNoVHlwZSA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24uYXR0cmlidXRlQW5kVmFyeWluZ1R5cGVSZWdFeHApO1xuXHRcdGlmIChtYXRjaFR5cGUpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBtYXRjaFR5cGVbMV07XG5cdFx0XHRyZWZsZWN0aW9uQXR0cmlidXRlLnR5cGUgPSB0eXBlIGFzIFZhclR5cGU7XG5cdFx0XHRjb25zdCBuYW1lID0gbWF0Y2hUeXBlWzJdO1xuXHRcdFx0cmVmbGVjdGlvbkF0dHJpYnV0ZS5uYW1lID0gbmFtZTtcblxuXHRcdFx0Y29uc3QgbWF0Y2hTZW1hbnRpYyA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24uc2VtYW50aWNSZWdFeHApXG5cdFx0XHRpZiAobWF0Y2hTZW1hbnRpYykge1xuXHRcdFx0XHRyZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljID0gbWF0Y2hTZW1hbnRpY1sxXSBhcyBBdHRyaWJ1dGVTZW1hbnRpY3M7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgdGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcCkge1xuXHRcdFx0XHRcdGlmIChuYW1lLm1hdGNoKG5ldyBSZWdFeHAoa2V5LCAnaScpKSkge1xuXHRcdFx0XHRcdFx0cmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpYyA9IHZhbHVlIGFzIEF0dHJpYnV0ZVNlbWFudGljcztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZXMucHVzaChyZWZsZWN0aW9uQXR0cmlidXRlKTtcblx0fVxuXG5cdHByaXZhdGUgX19tYXRjaFZhcnlpbmcoc2hhZGVyQ29kZUxpbmU6IHN0cmluZywgc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0aWYgKHNoYWRlclN0YWdlID09PSAndmVydGV4Jykge1xuXHRcdFx0cmV0dXJuIHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKih2YXJ5aW5nfG91dClbXFx0IF0rLis7Lyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBzaGFkZXJDb2RlTGluZS5tYXRjaCgvXig/IVtcXC9dKVtcXHQgXSoodmFyeWluZ3xpbilbXFx0IF0rLis7Lyk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfX2FkZFZhcnlpbmcoc2hhZGVyQ29kZUxpbmU6IHN0cmluZywgc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0Y29uc3QgcmVmbGVjdGlvblZhcnlpbmc6IFJlZmxlY3Rpb25WYXJ5aW5nID0ge1xuXHRcdFx0bmFtZTogJycsXG5cdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0aW5vdXQ6ICdpbidcblx0XHR9O1xuXG5cdFx0Y29uc3QgbWF0Y2hUeXBlID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi5hdHRyaWJ1dGVBbmRWYXJ5aW5nVHlwZVJlZ0V4cCk7XG5cdFx0aWYgKG1hdGNoVHlwZSkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IG1hdGNoVHlwZVsxXTtcblx0XHRcdHJlZmxlY3Rpb25WYXJ5aW5nLnR5cGUgPSB0eXBlIGFzIFZhclR5cGU7XG5cdFx0XHRjb25zdCBuYW1lID0gbWF0Y2hUeXBlWzJdO1xuXHRcdFx0cmVmbGVjdGlvblZhcnlpbmcubmFtZSA9IG5hbWU7XG5cdFx0XHRyZWZsZWN0aW9uVmFyeWluZy5pbm91dCA9IChzaGFkZXJTdGFnZSA9PT0gJ3ZlcnRleCcpID8gJ291dCcgOiAnaW4nO1xuXHRcdH1cblx0XHR0aGlzLl9fdmFyeWluZ3MucHVzaChyZWZsZWN0aW9uVmFyeWluZyk7XG5cdH1cblxuXHRwcml2YXRlIF9fYWRkVW5pZm9ybShzaGFkZXJDb2RlTGluZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgcmVmbGVjdGlvblVuaWZvcm06IFJlZmxlY3Rpb25Vbmlmb3JtID0ge1xuXHRcdFx0bmFtZTogJycsXG5cdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0c2VtYW50aWM6ICdVTktOT1dOJ1xuXHRcdH07XG5cblx0XHRjb25zdCBtYXRjaFR5cGUgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLnVuaWZvcm1UeXBlUmVnRXhwKTtcblx0XHRpZiAobWF0Y2hUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gbWF0Y2hUeXBlWzFdO1xuXHRcdFx0cmVmbGVjdGlvblVuaWZvcm0udHlwZSA9IHR5cGUgYXMgVmFyVHlwZTtcblx0XHRcdGNvbnN0IG5hbWUgPSBtYXRjaFR5cGVbMl07XG5cdFx0XHRyZWZsZWN0aW9uVW5pZm9ybS5uYW1lID0gbmFtZTtcblxuXHRcdFx0Y29uc3QgbWF0Y2hTZW1hbnRpY3MgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLnNlbWFudGljUmVnRXhwKVxuXHRcdFx0aWYgKG1hdGNoU2VtYW50aWNzKSB7XG5cdFx0XHRcdHJlZmxlY3Rpb25Vbmlmb3JtLnNlbWFudGljID0gbWF0Y2hTZW1hbnRpY3NbMV0gYXMgVW5pZm9ybVNlbWFudGljcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiB0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcCkge1xuXHRcdFx0XHRcdGlmIChuYW1lLm1hdGNoKG5ldyBSZWdFeHAoa2V5LCAnaScpKSkge1xuXHRcdFx0XHRcdFx0cmVmbGVjdGlvblVuaWZvcm0uc2VtYW50aWMgPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5fX3VuaWZvcm1zLnB1c2gocmVmbGVjdGlvblVuaWZvcm0pO1xuXHR9XG59OyIsImltcG9ydCB7VGVtcGxhdGVPYmplY3R9IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgZWRpdHMgdGhlIGNvZGUgcHJvcGVydHkgb2YgYSBzaGFkZXJpdHkgb2JqZWN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFkZXJFZGl0b3Ige1xuXHRzdGF0aWMgX2luc2VydERlZmluaXRpb24oc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZGVmaW5pdGlvbjogc3RyaW5nKSB7XG5cdFx0Y29uc3QgZGVmU3RyID0gZGVmaW5pdGlvbi5yZXBsYWNlKC8jZGVmaW5lW1xcdCBdKy8sICcnKTtcblxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZS51bnNoaWZ0KGAjZGVmaW5lICR7ZGVmU3RyfWApO1xuXHR9XG5cblx0c3RhdGljIF9maWxsVGVtcGxhdGUoc2hhZGVyQ29kZTogc3RyaW5nLCB0ZW1wbGF0ZU9iamVjdDogVGVtcGxhdGVPYmplY3QpIHtcblx0XHRjb25zdCB0ZW1wbGF0ZVN0cmluZyA9IHNoYWRlckNvZGUucmVwbGFjZSgvXFwvXFwqW1xcdCBdKnNoYWRlcml0eTpbXFx0IF0qKEB7W1xcdCBdKikoXFxTKykoW1xcdCBdKn0pW1xcdCBdKlxcKlxcLy9nLCAnJHt0aGlzLiQyfScpO1xuXG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IG5ldyBGdW5jdGlvbihcInJldHVybiBgXCIgKyB0ZW1wbGF0ZVN0cmluZyArIFwiYDtcIikuY2FsbCh0ZW1wbGF0ZU9iamVjdCk7XG5cdFx0cmV0dXJuIHJlc3VsdENvZGU7XG5cdH1cbn0iLCJpbXBvcnQge1NoYWRlclZlcnNpb259IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgY29udmVydHMgdGhlIGNvZGUgcHJvcGVydHkgb2YgYSBzaGFkZXJpdHkgb2JqZWN0IHRvIHRoZSBzcGVjaWZpZWQgZm9ybWF0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFkZXJUcmFuc2Zvcm1lciB7XG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIEVTMyBzaGFkZXIgY29kZSB0byBhIEdMU0wgRVMxIHNoYWRlciBjb2RlXG5cdCAqL1xuXHRzdGF0aWMgX3RyYW5zZm9ybVRvR0xTTEVTMShcblx0XHRzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLFxuXHRcdGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4sXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHR0aGlzLl9fY29udmVydE9ySW5zZXJ0VmVyc2lvbkdMU0xFUzEoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fcmVtb3ZlRVMzUXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0dGhpcy5fX2NvbnZlcnRJbihzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdHRoaXMuX19jb252ZXJ0T3V0KHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlciwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0dGhpcy5fX3JlbW92ZVByZWNpc2lvbkZvckVTMyhzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzEoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSA9IHNwbGl0dGVkU2hhZGVyQ29kZTtcblxuXHRcdHJldHVybiB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIEVTMSBzaGFkZXIgY29kZSB0byBhIEdMU0wgRVMzIHNoYWRlciBjb2RlXG5cdCAqL1xuXHRzdGF0aWMgX3RyYW5zZm9ybVRvR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fX2NvbnZlcnRPckluc2VydFZlcnNpb25HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRBdHRyaWJ1dGUoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyKTtcblx0XHR0aGlzLl9fY29udmVydFZhcnlpbmcoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmVDdWJlKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlMkQoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmUyRFByb2Qoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmUzRChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZTNEUHJvZChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlID0gc3BsaXR0ZWRTaGFkZXJDb2RlO1xuXG5cdFx0cmV0dXJuIHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgc2hhZGVyIGNvZGUgdG8gYSBzaGFkZXIgY29kZSBvZiBzcGVjaWZpZWQgR0xTTCB2ZXJzaW9uXG5cdCAqL1xuXHRzdGF0aWMgX3RyYW5zZm9ybVRvKFxuXHRcdHZlcnNpb246IFNoYWRlclZlcnNpb24sXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSxcblx0XHRpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuLFxuXHRcdGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW5cblx0KSB7XG5cdFx0aWYgKHZlcnNpb24ubWF0Y2goL3dlYmdsMnxlczMvaSkpIHtcblx0XHRcdHJldHVybiB0aGlzLl90cmFuc2Zvcm1Ub0dMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyKTtcblx0XHR9IGVsc2UgaWYgKHZlcnNpb24ubWF0Y2goL3dlYmdsMXxlczEvaSkpIHtcblx0XHRcdHJldHVybiB0aGlzLl90cmFuc2Zvcm1Ub0dMU0xFUzEoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5lcnJvcignSW52YWxpZCBWZXJzaW9uJylcblx0XHRcdHJldHVybiBzcGxpdHRlZFNoYWRlckNvZGU7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIElmIHRoZSBmaXJzdCBsaW5lIGNvbnRhaW5zIHZlcnNpb24gaW5mb3JtYXRpb24sIG92ZXJ3cml0ZSB0aGUgZmlyc3QgbGluZSB3aXRoICcjdmVyc2lvbiAxMDAnLlxuXHQgKiBJZiBub3QsIGFkZCAnI3ZlcnNpb24gMTAwJyB0byB0aGUgZmlyc3QgbGluZS5cblx0ICpcblx0ICogTm90ZTogSWYgdGhlIGZpcnN0IGxpbmUgaXMgY29tbWVudGVkIG91dCBhbmQgdGhlIHZlcnNpb24gaW5mb3JtYXRpb24gaXMgd3JpdHRlbiBpbiB0aGUgc2Vjb25kIG9yIGxhdGVyIGxpbmUsXG5cdCAqIHRoZSBhcHByb3ByaWF0ZSB2ZXJzaW9uIGluZm9ybWF0aW9uIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGZpcnN0IGxpbmUgYW5kIHRoZSB1c2VyLWRlZmluZWQgdmVyc2lvbiBpbmZvcm1hdGlvblxuXHQgKiBpbiB0aGUgc2Vjb25kIG9yIGxhdGVyIGxpbmUgd2lsbCBiZSByZW1vdmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0T3JJbnNlcnRWZXJzaW9uR0xTTEVTMShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qI1tcXHQgXSp2ZXJzaW9uW1xcdCBdKy4qLztcblx0XHR0aGlzLl9fcmVtb3ZlRmlyc3RNYXRjaGluZ0xpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcpO1xuXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnVuc2hpZnQoJyN2ZXJzaW9uIDEwMCcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIElmIHRoZSBmaXJzdCBsaW5lIGNvbnRhaW5zIHZlcnNpb24gaW5mb3JtYXRpb24sIG92ZXJ3cml0ZSB0aGUgZmlyc3QgbGluZSB3aXRoICcjdmVyc2lvbiAzMDAgZXMnLlxuXHQgKiBJZiBub3QsIGFkZCAnI3ZlcnNpb24gMzAwIGVzJyB0byB0aGUgZmlyc3QgbGluZS5cblx0ICogSW4gYm90aCBjYXNlcywgJyNkZWZpbmUgR0xTTF9FUzMnIHdpbGwgYmUgaW5zZXJ0ZWQgaW4gdGhlIHNlY29uZCBsaW5lLlxuXHQgKiBVc2UgdGhlICcjZGVmaW5lIEdMU0xfRVMzJyBkaXJlY3RpdmUgaWYgeW91IHdhbnQgdG8gd3JpdGUgYSBzaGFkZXIgY29kZSB0aGF0IHdpbGwgb25seSBydW4gaW4gdGhlIGNhc2Ugb2Ygd2ViZ2wyLlxuXHQgKlxuXHQgKiBOb3RlOiBJZiB0aGUgZmlyc3QgbGluZSBpcyBjb21tZW50ZWQgb3V0IGFuZCB0aGUgdmVyc2lvbiBpbmZvcm1hdGlvbiBpcyB3cml0dGVuIGluIHRoZSBzZWNvbmQgb3IgbGF0ZXIgbGluZSxcblx0ICogdGhlIGFwcHJvcHJpYXRlIHZlcnNpb24gaW5mb3JtYXRpb24gd2lsbCBiZSBhZGRlZCB0byB0aGUgZmlyc3QgbGluZSBhbmQgdGhlIHVzZXItZGVmaW5lZCB2ZXJzaW9uIGluZm9ybWF0aW9uXG5cdCAqIGluIHRoZSBzZWNvbmQgb3IgbGF0ZXIgbGluZSB3aWxsIGJlIHJlbW92ZWQuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRPckluc2VydFZlcnNpb25HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSojW1xcdCBdKnZlcnNpb25bXFx0IF0rLiovO1xuXHRcdHRoaXMuX19yZW1vdmVGaXJzdE1hdGNoaW5nTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZyk7XG5cblx0XHRzcGxpdHRlZFNoYWRlckNvZGUudW5zaGlmdCgnI2RlZmluZSBHTFNMX0VTMycpO1xuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZS51bnNoaWZ0KCcjdmVyc2lvbiAzMDAgZXMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAnaW4nIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzEgcXVhbGlmaWVyKCdhdHRyaWJ1dGUnIG9yICd2YXJ5aW5nJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydEluKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSppbltcXHQgXSsoKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKlxcdytbXFx0IF0qXFx3K1tcXHQgXSo7KS87XG5cblx0XHRsZXQgcmVwbGFjZUZ1bmM7XG5cdFx0aWYgKGlzRnJhZ21lbnRTaGFkZXIpIHtcblx0XHRcdHJlcGxhY2VGdW5jID0gZnVuY3Rpb24gKG1hdGNoOiBzdHJpbmcsIHAxOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuICd2YXJ5aW5nICcgKyBwMTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVwbGFjZUZ1bmMgPSBmdW5jdGlvbiAobWF0Y2g6IHN0cmluZywgcDE6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gJ2F0dHJpYnV0ZSAnICsgcDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCByZXBsYWNlRnVuYyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJvdXRcIiBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCBtb2RpZnkgdGhlIHNoYWRlciBjb2RlLlxuXHQgKiBJZiB0aGUgc2hhZGVyIHN0YWdlIGlzIHZlcnRleCwgdGhlIFwib3V0XCIgcXVhbGlmaWVycyB3aWxsIGJlIHJlcGxhY2VkIGJ5IFwidmFyeWluZ1wiIHF1YWxpZmllci5cblx0ICogSWYgdGhlIHNoYWRlciBzdGFnZSBpcyBmcmFnbWVudCBhbmQgdGhlIHNoYWRlciBoYXMgXCJvdXRcIiBxdWFsaWZpZXJzLCB0aGUgXCJvdXRcIiBxdWFsaWZpZXJzIHdpbGxcblx0ICogYmUgZGVsZXRlZCBhbmQgdGhlIHZhcmlhYmxlIGlzIHVzZWQgdG8gYXNzaWduIGEgdmFsdWUgdG8gZ2xfRnJhZ0NvbG9yLlxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0T3V0KHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRpZiAoaXNGcmFnbWVudFNoYWRlcikge1xuXHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gdGhpcy5fX3JlbW92ZU91dFF1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0aWYgKHZhcmlhYmxlTmFtZSA9PSBudWxsKSB7XG5cdFx0XHRcdC8vIG5vIG91dCBxdWFsaWZpZXJcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9fYWRkR0xGcmFnQ29sb3IodmFyaWFibGVOYW1lLCBzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSpvdXRbXFx0IF0rKChoaWdocHxtZWRpdW1wfGxvd3B8KVtcXHQgXSpcXHcrW1xcdCBdKlxcdytbXFx0IF0qOykvO1xuXHRcdFx0Y29uc3QgcmVwbGFjZUZ1bmMgPSBmdW5jdGlvbiAobWF0Y2g6IHN0cmluZywgcDE6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gJ3ZhcnlpbmcgJyArIHAxO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCByZXBsYWNlRnVuYyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRoaXMgbWV0aG9kIGlzIGEgcGFydCBvZiBfX2NvbnZlcnRPdXQgbWV0aG9kLlxuXHQgKiBUaGlzIG1ldGhvZCBkZWxldGVzIHRoZSBcIm91dFwiIHF1YWxpZmllcnMgYW5kIGFkZHMgdGhlIGxpbmUgZm9yIGFzc2lnbmluZyB0byBnbF9GcmFnQ29sb3IuXG5cdCAqIElmIHRoZSBzaGFkZXIgZG9lcyBub3QgaGF2ZSB0aGUgXCJvdXRcIiBxdWFsaWZpZXJzLCB0aGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcuXG5cdCAqL1xuXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlT3V0UXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSpvdXRbXFx0IF0rKChoaWdocHxtZWRpdW1wfGxvd3B8KVtcXHQgXSpcXHcrW1xcdCBdKihcXHcrKVtcXHQgXSo7KS87XG5cblx0XHRsZXQgdmFyaWFibGVOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IG1hdGNoID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLm1hdGNoKHJlZyk7XG5cdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gbWF0Y2hbMV07XG5cdFx0XHRcdHZhcmlhYmxlTmFtZSA9IG1hdGNoWzNdO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdmFyaWFibGVOYW1lO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19hZGRHTEZyYWdDb2xvcih2YXJpYWJsZU5hbWU6IHN0cmluZywgc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IGNsb3NlQnJhY2tldFJlZyA9IC8oLiopXFx9W1xcblxcdCBdKiQvO1xuXHRcdGNvbnN0IHJldHVyblJlZyA9IC9bXFxuXFx0IF0qcmV0dXJuW1xcblxcdCBdKjsvO1xuXHRcdGNvbnN0IG1haW5GdW5jU3RhcnRSZWcgPSAvKF58Xig/IVtcXC9dKVtcXHRcXG4gXSspdm9pZFtcXHRcXG4gXSttYWluKFtcXHRcXG4gXXxcXCh8JCkvO1xuXHRcdGNvbnN0IGZyYWdDb2xvckNvZGUgPSBgICBnbF9GcmFnQ29sb3IgPSAke3ZhcmlhYmxlTmFtZX07YDtcblxuXHRcdGxldCBzZXRHbEZyYWdDb2xvckluTGFzdExpbmUgPSBmYWxzZTtcblx0XHRmb3IgKGxldCBpID0gc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXHRcdFx0aWYgKCFzZXRHbEZyYWdDb2xvckluTGFzdExpbmUgJiYgbGluZS5tYXRjaChjbG9zZUJyYWNrZXRSZWcpKSB7XG5cdFx0XHRcdC8vIGFkZCBnbF9GcmFnQ29sb3IgdG8gbGFzdCBsaW5lIG9mIG1haW4gZnVuY3Rpb25cblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gbGluZS5yZXBsYWNlKGNsb3NlQnJhY2tldFJlZywgYCQxXFxuJHtmcmFnQ29sb3JDb2RlfVxcbn1cXG5gKTtcblx0XHRcdFx0c2V0R2xGcmFnQ29sb3JJbkxhc3RMaW5lID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGxpbmUubWF0Y2gocmV0dXJuUmVnKSkge1xuXHRcdFx0XHQvLyBhZGQgZ2xfRnJhZ0NvbG9yIGp1c3QgYmVmb3JlIHJldHVyblxuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUuc3BsaWNlKGksIDAsIGZyYWdDb2xvckNvZGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobGluZS5tYXRjaChtYWluRnVuY1N0YXJ0UmVnKSkge1xuXHRcdFx0XHQvLyBhZGQgZ2xfRnJhZ0NvbG9yIG9ubHkgaW4gdGhlIG1haW4gZnVuY3Rpb25cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCFzZXRHbEZyYWdDb2xvckluTGFzdExpbmUpIHtcblx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX3JlbW92ZU91dFF1YWxpZmllcjogTm90IGZvdW5kIHRoZSBjbG9zaW5nIGJyYWNrZXRzIGZvciB0aGUgbWFpbiBmdW5jdGlvbic7XG5cdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBxdWFsaWZpZXIgZm9yIGVzMyBvbmx5IGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVtb3ZlIGl0XG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZUVTM1F1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0dGhpcy5fX3JlbW92ZVZhcnlpbmdRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR0aGlzLl9fcmVtb3ZlTGF5b3V0KHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJmbGF0XCIgYW5kIFwic21vb3RoXCIgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVtb3ZlIGl0XG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZVZhcnlpbmdRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKihmbGF0fHNtb290aClbXFx0IF0qKChpbnxvdXQpW1xcdCBdKy4qKS87XG5cdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fcmVtb3ZlVmFyeWluZ1F1YWxpZmllcjogZ2xzbCBlczEgZG9lcyBub3Qgc3VwcG9ydCBmbGF0IHF1YWxpZmllcic7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLnJlcGxhY2UocmVnLCAobWF0Y2g6IHN0cmluZywgcDE6IHN0cmluZywgcDI6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRpZiAocDEgPT09ICdmbGF0Jykge1xuXHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGkgKyAxLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHRcdHJldHVybiBtYXRjaDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcDI7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJsYXlvdXRcIiBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXRcblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlTGF5b3V0KHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSpsYXlvdXRbXFx0IF0qXFwoW1xcdCBdKmxvY2F0aW9uW1xcdCBdKlxcPVtcXHQgXSpcXGRbXFx0IF0qXFwpW1xcdCBdKy9nO1xuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIFwicHJlY2lzaW9uXCIgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVtb3ZlIGl0IGlmIHRoZSBcInByZWNpc2lvblwiIHF1YWxpZmllciBpcyB2YWxpZCBmb3Igb25seSBHTFNMIEVTM1xuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVQcmVjaXNpb25Gb3JFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKnByZWNpc2lvbltcXHQgXSsoaGlnaHB8bWVkaXVtcHxsb3dwKVtcXHQgXSsoXFx3KylbXFx0IF0qOy87XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgbWF0Y2ggPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ubWF0Y2gocmVnKTtcblx0XHRcdGlmIChtYXRjaCAhPSBudWxsKSB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRtYXRjaFsyXSA9PT0gJ2ludCcgfHxcblx0XHRcdFx0XHRtYXRjaFsyXSA9PT0gJ2Zsb2F0JyB8fFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSAnc2FtcGxlcjJEJyB8fFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSAnc2FtcGxlckN1YmUnXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdC8vIHRoZXNlIHByZWNpc2lvbnMgYXJlIHN1cHBvcnRlZCBpbiBlczFcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJ0ZXh0dXJlXCIgYW5kIFwidGV4dHVyZVByb2pcIiBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZFxuXHQgKiByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMxIG1ldGhvZCgndGV4dHVyZTJEJywgJ3RleHR1cmUyRCcsIGFuZCBzbyBvbilcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmVGdW5jdGlvblRvRVMxKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZ1RleHR1cmVQcm9qID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspdGV4dHVyZVByb2ooTG9kfCkoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlZ1RleHR1cmUgPSBuZXcgUmVnRXhwKGAoJHtzYmx9Kyl0ZXh0dXJlKExvZHwpKCR7c2JsfSspYCwgJ2cnKTtcblxuXHRcdGxldCBhcmd1bWVudFNhbXBsZXJNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG5cdFx0Y29uc3QgdW5pZm9ybVNhbXBsZXJNYXAgPSB0aGlzLl9fY3JlYXRlVW5pZm9ybVNhbXBsZXJNYXAoc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblxuXHRcdFx0Y29uc3QgbWF0Y2hUZXh0dXJlUHJvaiA9IGxpbmUubWF0Y2goL3RleHR1cmVQcm9qKExvZHwpW1xcdCBdKlxcKFtcXHQgXSooXFx3KyksLyk7XG5cdFx0XHRpZiAobWF0Y2hUZXh0dXJlUHJvaikge1xuXHRcdFx0XHRhcmd1bWVudFNhbXBsZXJNYXAgPSBhcmd1bWVudFNhbXBsZXJNYXAgPz8gdGhpcy5fX2NyZWF0ZUFyZ3VtZW50U2FtcGxlck1hcChcblx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUsXG5cdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRlbWJlZEVycm9yc0luT3V0cHV0XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29uc3QgaXNMb2RNZXRob2QgPSBtYXRjaFRleHR1cmVQcm9qWzFdID09PSAnTG9kJztcblx0XHRcdFx0Y29uc3QgZXh0ZW5zaW9uU3RyID0gaXNGcmFnbWVudFNoYWRlciAmJiBpc0xvZE1ldGhvZCA/IGBFWFRgIDogYGA7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlTmFtZSA9IG1hdGNoVGV4dHVyZVByb2pbMl07XG5cdFx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlID0gYXJndW1lbnRTYW1wbGVyTWFwPy5nZXQodmFyaWFibGVOYW1lKSA/PyB1bmlmb3JtU2FtcGxlck1hcC5nZXQodmFyaWFibGVOYW1lKTtcblx0XHRcdFx0aWYgKHNhbXBsZXJUeXBlICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAoc2FtcGxlclR5cGUgPT09ICdzYW1wbGVyMkQnKSB7XG5cdFx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ucmVwbGFjZShyZWdUZXh0dXJlUHJvaiwgYCQxdGV4dHVyZTJEUHJvaiQyJHtleHRlbnNpb25TdHJ9JDNgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fY29udmVydFRleHR1cmVGdW5jdGlvblRvRVMxOiBkbyBub3Qgc3VwcG9ydCAnICsgc2FtcGxlclR5cGUgKyAnIHR5cGUnO1xuXHRcdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG1hdGNoVGV4dHVyZSA9IGxpbmUubWF0Y2goL3RleHR1cmUoTG9kfClbXFx0IF0qXFwoW1xcdCBdKihcXHcrKSwvKTtcblx0XHRcdGlmIChtYXRjaFRleHR1cmUpIHtcblx0XHRcdFx0YXJndW1lbnRTYW1wbGVyTWFwID0gYXJndW1lbnRTYW1wbGVyTWFwID8/IHRoaXMuX19jcmVhdGVBcmd1bWVudFNhbXBsZXJNYXAoXG5cdFx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLFxuXHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0ZW1iZWRFcnJvcnNJbk91dHB1dFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGNvbnN0IGlzTG9kTWV0aG9kID0gbWF0Y2hUZXh0dXJlWzFdID09PSAnTG9kJztcblx0XHRcdFx0Y29uc3QgZXh0ZW5zaW9uU3RyID0gaXNGcmFnbWVudFNoYWRlciAmJiBpc0xvZE1ldGhvZCA/IGBFWFRgIDogYGA7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlTmFtZSA9IG1hdGNoVGV4dHVyZVsyXTtcblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBhcmd1bWVudFNhbXBsZXJNYXA/LmdldCh2YXJpYWJsZU5hbWUpID8/IHVuaWZvcm1TYW1wbGVyTWFwLmdldCh2YXJpYWJsZU5hbWUpO1xuXHRcdFx0XHRpZiAoc2FtcGxlclR5cGUgIT0gbnVsbCkge1xuXHRcdFx0XHRcdGxldCB0ZXh0dXJlRnVuYzogc3RyaW5nO1xuXHRcdFx0XHRcdGlmIChzYW1wbGVyVHlwZSA9PT0gJ3NhbXBsZXIyRCcpIHtcblx0XHRcdFx0XHRcdHRleHR1cmVGdW5jID0gJ3RleHR1cmUyRCc7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzYW1wbGVyVHlwZSA9PT0gJ3NhbXBsZXJDdWJlJykge1xuXHRcdFx0XHRcdFx0dGV4dHVyZUZ1bmMgPSAndGV4dHVyZUN1YmUnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0ZXh0dXJlRnVuYyA9ICcnO1xuXHRcdFx0XHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fY29udmVydFRleHR1cmVGdW5jdGlvblRvRVMxOiBkbyBub3Qgc3VwcG9ydCAnICsgc2FtcGxlclR5cGUgKyAnIHR5cGUnO1xuXHRcdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodGV4dHVyZUZ1bmMgIT09ICcnKSB7XG5cdFx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ucmVwbGFjZShyZWdUZXh0dXJlLCBgJDEke3RleHR1cmVGdW5jfSQyJHtleHRlbnNpb25TdHJ9JDNgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzQmxvY2tFbmQgPSAhIWxpbmUubWF0Y2goL1xcfS8pO1xuXHRcdFx0aWYgKGlzQmxvY2tFbmQpIHtcblx0XHRcdFx0YXJndW1lbnRTYW1wbGVyTWFwID0gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUaGlzIG1ldGhvZCBmaW5kcyB1bmlmb3JtIGRlY2xhcmF0aW9ucyBvZiBzYW1wbGVyIHR5cGVzIGluIHRoZSBzaGFkZXIgYW5kXG5cdCAqIGNyZWF0ZXMgYSBtYXAgd2l0aCB2YXJpYWJsZSBuYW1lcyBhcyBrZXlzIGFuZCB0eXBlcyBhcyB2YWx1ZXMuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NyZWF0ZVVuaWZvcm1TYW1wbGVyTWFwKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRjb25zdCB1bmlmb3JtU2FtcGxlck1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXHRcdFx0Y29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKnVuaWZvcm0qW1xcdCBdKihoaWdocHxtZWRpdW1wfGxvd3B8KVtcXHQgXSooc2FtcGxlclxcdyspW1xcdCBdKyhcXHcrKS8pO1xuXHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlID0gbWF0Y2hbMl07XG5cdFx0XHRcdGNvbnN0IG5hbWUgPSBtYXRjaFszXTtcblx0XHRcdFx0aWYgKHVuaWZvcm1TYW1wbGVyTWFwLmdldChuYW1lKSkge1xuXHRcdFx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX2NyZWF0ZVVuaWZvcm1TYW1wbGVyTWFwOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSc7XG5cdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR1bmlmb3JtU2FtcGxlck1hcC5zZXQobmFtZSwgc2FtcGxlclR5cGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdW5pZm9ybVNhbXBsZXJNYXA7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVGhpcyBtZXRob2QgZmluZHMgc2FtcGxlciB0eXBlcyBmcm9tIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMgYW5kXG5cdCAqIGNyZWF0ZXMgYSBtYXAgd2l0aCB2YXJpYWJsZSBuYW1lcyBhcyBrZXlzIGFuZCB0eXBlcyBhcyB2YWx1ZXMuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NyZWF0ZUFyZ3VtZW50U2FtcGxlck1hcChcblx0XHRzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLFxuXHRcdGxpbmVJbmRleDogbnVtYmVyLFxuXHRcdGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW5cblx0KSB7XG5cdFx0Y29uc3QgYXJndW1lbnRTYW1wbGVyTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IGxpbmVJbmRleDsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cblx0XHRcdGNvbnN0IGlzQmxvY2tTdGFydExpbmUgPSAhIWxpbmUubWF0Y2goL1xcey8pO1xuXHRcdFx0aWYgKCFpc0Jsb2NrU3RhcnRMaW5lKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBicmFja2V0U2VjdGlvbkNvZGUgPSB0aGlzLl9fZ2V0QnJhY2tldFNlY3Rpb24oc3BsaXR0ZWRTaGFkZXJDb2RlLCBpKTtcblxuXHRcdFx0Y29uc3QgaW5uZXJCcmFja2V0U2VjdGlvbkNvZGUgPSBicmFja2V0U2VjdGlvbkNvZGUubWF0Y2goLy4qXFwoKC4qKVxcKS8pPy5bMV07XG5cdFx0XHRpZiAoaW5uZXJCcmFja2V0U2VjdGlvbkNvZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHZhcmlhYmxlQ2FuZGlkYXRlcyA9IGlubmVyQnJhY2tldFNlY3Rpb25Db2RlLnNwbGl0KCcsJyk7XG5cdFx0XHRjb25zdCBzYW1wbGVyVHlwZURlZmluaXRpb25SZWcgPSAvW1xcblxcdCBdKihoaWdocHxtZWRpdW1wfGxvd3B8KVtcXG5cXHQgXSooc2FtcGxlclxcdyspW1xcblxcdCBdKihcXHcrKVtcXG5cXHQgXSovO1xuXG5cdFx0XHRjb25zdCBpc0Z1bmN0aW9uQnJhY2tldCA9ICEhKHZhcmlhYmxlQ2FuZGlkYXRlc1swXS5tYXRjaChzYW1wbGVyVHlwZURlZmluaXRpb25SZWcpID8/IHZhcmlhYmxlQ2FuZGlkYXRlc1swXS5tYXRjaCgvXltcXG5cXHQgXSokLykpO1xuXHRcdFx0aWYgKCFpc0Z1bmN0aW9uQnJhY2tldCkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChjb25zdCB2YXJpYWJsZUNhbmRpZGF0ZSBvZiB2YXJpYWJsZUNhbmRpZGF0ZXMpIHtcblx0XHRcdFx0Y29uc3Qgc2FtcGxlclZhcmlhYmxlTWF0Y2ggPSB2YXJpYWJsZUNhbmRpZGF0ZS5tYXRjaChzYW1wbGVyVHlwZURlZmluaXRpb25SZWcpO1xuXHRcdFx0XHRpZiAoc2FtcGxlclZhcmlhYmxlTWF0Y2ggPT0gbnVsbCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlID0gc2FtcGxlclZhcmlhYmxlTWF0Y2hbMl07XG5cdFx0XHRcdGNvbnN0IG5hbWUgPSBzYW1wbGVyVmFyaWFibGVNYXRjaFszXTtcblx0XHRcdFx0aWYgKGFyZ3VtZW50U2FtcGxlck1hcC5nZXQobmFtZSkpIHtcblx0XHRcdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19jcmVhdGVBcmd1bWVudFNhbXBsZXJNYXA6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lJztcblx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFyZ3VtZW50U2FtcGxlck1hcC5zZXQobmFtZSwgc2FtcGxlclR5cGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJndW1lbnRTYW1wbGVyTWFwO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIHBhcnQgZW5jbG9zZWQgaW4gYnJhY2tldHMoPSAnKCknKS5cblx0ICogRm9yIGV4YW1wbGUsIHlvdSBjYW4gZ2V0IGxpbmVzIHRoYXQgY29udGFpbiBmdW5jdGlvbiBhcmd1bWVudHMsIGNvbmRpdGlvbmFsIGV4cHJlc3Npb25zIGZvciBpZiBzdGF0ZW1lbnRzLCBldGMuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2dldEJyYWNrZXRTZWN0aW9uKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGJyYWNrZXRFbmRJbmRleDogbnVtYmVyKSB7XG5cdFx0bGV0IGJyYWNrZXRTdGFydEluZGV4ID0gMDtcblx0XHRmb3IgKGxldCBqID0gYnJhY2tldEVuZEluZGV4OyBqID49IDA7IGotLSkge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtqXTtcblx0XHRcdGNvbnN0IGlzQnJhY2tldFN0YXJ0TWF0Y2ggPSAhIWxpbmUubWF0Y2goL1xcKC8pO1xuXHRcdFx0aWYgKGlzQnJhY2tldFN0YXJ0TWF0Y2gpIHtcblx0XHRcdFx0YnJhY2tldFN0YXJ0SW5kZXggPSBqO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRsZXQgY29udGFpbkJyYWNrZXRDb2RlID0gJyc7XG5cdFx0Zm9yIChsZXQgaiA9IGJyYWNrZXRTdGFydEluZGV4OyBqIDw9IGJyYWNrZXRFbmRJbmRleDsgaisrKSB7XG5cdFx0XHRjb250YWluQnJhY2tldENvZGUgKz0gc3BsaXR0ZWRTaGFkZXJDb2RlW2pdO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb250YWluQnJhY2tldENvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ2F0dHJpYnV0ZScgcXVhbGlmaWVyIGluIHRoZSB2ZXJ0ZXggc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgcXVhbGlmaWVyKCdpbicpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRBdHRyaWJ1dGUoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbikge1xuXHRcdGlmIChpc0ZyYWdtZW50U2hhZGVyKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qYXR0cmlidXRlW1xcdCBdKy9nO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAnaW4gJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgcmVwbGFjZVN0cik7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3ZhcnlpbmcnIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgcXVhbGlmaWVyKCdpbicgb3IgJ291dCcpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRWYXJ5aW5nKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSp2YXJ5aW5nW1xcdCBdKy9nO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSBpc0ZyYWdtZW50U2hhZGVyID8gJ2luICcgOiAnb3V0ICc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsIHJlcGxhY2VTdHIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlQ3ViZScgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmUnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZUN1YmUoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmVDdWJlKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZTJEJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZScpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlMkQoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmUyRCkoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZSc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmUyRFByb2onIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlUHJvaicpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlMkRQcm9kKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlMkRQcm9qKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlUHJvaic7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmUzRCcgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmUnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZTNEKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlM0QpKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmUnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlM0RQcm9qJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZVByb2onKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZTNEUHJvZChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZTNEUHJvaikoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZVByb2onO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19yZWdTeW1ib2xzKCkge1xuXHRcdHJldHVybiBgWyFcIiMkJSYnKClcXCpcXCtcXC1cXC4sXFwvOjs8PT4/QFxcW1xcXFxcXF1eYCArICdge3x9flxcdFxcbiBdJztcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIF9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgcmVnOiBSZWdFeHAsIHJlcGxhY2VtZW50OiBhbnkpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLnJlcGxhY2UocmVnLCByZXBsYWNlbWVudCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVGaXJzdE1hdGNoaW5nTGluZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCByZWc6IFJlZ0V4cCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLm1hdGNoKHJlZykpIHtcblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnNwbGljZShpLCAxKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19vdXRFcnJvcihcblx0XHRzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLFxuXHRcdGxpbmVJbmRleDogbnVtYmVyLFxuXHRcdGVycm9yTWVzc2FnZTogc3RyaW5nLFxuXHRcdGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW5cblx0KSB7XG5cdFx0aWYgKGVtYmVkRXJyb3JzSW5PdXRwdXQpIHtcblx0XHRcdGNvbnN0IHNoYWRlck91dHB1dE1lc3NhZ2UgPSBgLy8gbGluZSAke2xpbmVJbmRleH06ICR7ZXJyb3JNZXNzYWdlfVxcbmA7XG5cdFx0XHRjb25zdCBjbG9zZUJyYWNrZXRSZWcgPSAvKC4qKVxcfVtcXG5cXHQgXSokLztcblx0XHRcdGZvciAobGV0IGkgPSBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblx0XHRcdFx0aWYgKGxpbmUubWF0Y2goY2xvc2VCcmFja2V0UmVnKSkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9PT0gc2hhZGVyT3V0cHV0TWVzc2FnZSkge1xuXHRcdFx0XHRcdC8vIGF2b2lkIGR1cGxpY2F0ZSBlcnJvciBtZXNzYWdlXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcblx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZS5wdXNoKHNoYWRlck91dHB1dE1lc3NhZ2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcblx0XHR9XG5cdH1cbn1cbiIsImltcG9ydCBSZWZsZWN0aW9uIGZyb20gJy4vUmVmbGVjdGlvbic7XG5pbXBvcnQge1NoYWRlcml0eU9iamVjdCwgU2hhZGVyU3RhZ2VTdHIsIFNoYWRlclZlcnNpb24sIFRlbXBsYXRlT2JqZWN0fSBmcm9tICcuLi90eXBlcy90eXBlJztcbmltcG9ydCBTaGFkZXJUcmFuc2Zvcm1lciBmcm9tICcuL1NoYWRlclRyYW5zZm9ybWVyJztcbmltcG9ydCBTaGFkZXJFZGl0b3IgZnJvbSAnLi9TaGFkZXJFZGl0b3InO1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5JztcbmltcG9ydCBTaGFkZXJpdHlPYmplY3RDcmVhdG9yIGZyb20gJy4vU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcic7XG5pbXBvcnQgUHJlUHJvY2Vzc29yIGZyb20gJy4vUHJlUHJvY2Vzc29yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhZGVyaXR5IHtcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHNoYWRlciB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0LyoqXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMzIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGVcblx0ICogQHBhcmFtIG9iaiBTaGFkZXJpdHkgb2JqZWN0IHRvIHRyYW5zbGF0ZSB0byBnbHNsIGVzMVxuXHQgKiBAcGFyYW0gZW1iZWRFcnJvcnNJbk91dHB1dCBJZiB0cnVlLCB3aGVuIHRoZXJlIGlzIGFuIGVycm9yIGluIHRoZSBjb252ZXJzaW9uLFxuXHQgKiAgICB0aGUgZXJyb3IgYW5kIHRoZSBudW1iZXIgb2YgbGluZXMgYXJlIG91dHB1dCBhdCB0aGUgYm90dG9tIG9mIHRoZSByZXR1cm5cblx0ICogICAgdmFsdWUgU2hhZGVyaXR5T2JqZWN0LmNvZGUuIElmIGZhbHNlLCB0aHJvdyBhbiBlcnJvci5cblx0ICogQHJldHVybnMgU2hhZGVyaXR5T2JqZWN0IHdob3NlIGNvZGUgcHJvcGVydHkgaXMgdGhlIHNoYWRlciBjb2RlIGZvciBHTFNMIEVTMVxuXHQgKi9cblx0cHVibGljIHN0YXRpYyB0cmFuc2Zvcm1Ub0dMU0xFUzEob2JqOiBTaGFkZXJpdHlPYmplY3QsIGVtYmVkRXJyb3JzSW5PdXRwdXQgPSBmYWxzZSkge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGVcblx0XHRcdD0gU2hhZGVyVHJhbnNmb3JtZXIuX3RyYW5zZm9ybVRvR0xTTEVTMShcblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLFxuXHRcdFx0XHRvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHRcdFx0ZW1iZWRFcnJvcnNJbk91dHB1dFxuXHRcdFx0KTtcblx0XHRjb25zdCByZXN1bHRDb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZSh0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IHJlc3VsdENvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH1cblxuXHQvKipcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGUgdG8gYSBHTFNMIEVTMyBzaGFkZXIgY29kZVxuXHQgKi9cblx0cHVibGljIHN0YXRpYyB0cmFuc2Zvcm1Ub0dMU0xFUzMob2JqOiBTaGFkZXJpdHlPYmplY3QpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlXG5cdFx0XHQ9IFNoYWRlclRyYW5zZm9ybWVyLl90cmFuc2Zvcm1Ub0dMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlLCBvYmouaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUodHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0Y29uc3QgcmVzdWx0T2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiByZXN1bHRDb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gcmVzdWx0T2JqO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgc2hhZGVyIGNvZGUgdG8gYSBzaGFkZXIgY29kZSBvZiBzcGVjaWZpZWQgR0xTTCB2ZXJzaW9uXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHRyYW5zZm9ybVRvKHZlcnNpb246IFNoYWRlclZlcnNpb24sIG9iajogU2hhZGVyaXR5T2JqZWN0LCBlbWJlZEVycm9yc0luT3V0cHV0ID0gZmFsc2UpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlXG5cdFx0XHQ9IFNoYWRlclRyYW5zZm9ybWVyLl90cmFuc2Zvcm1Ubyhcblx0XHRcdFx0dmVyc2lvbixcblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLFxuXHRcdFx0XHRvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHRcdFx0ZW1iZWRFcnJvcnNJbk91dHB1dFxuXHRcdFx0KTtcblx0XHRjb25zdCByZXN1bHRDb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZSh0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IHJlc3VsdENvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIHByb2Nlc3NQcmFnbWEob2JqOiBTaGFkZXJpdHlPYmplY3QpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlXG5cdFx0XHQ9IFByZVByb2Nlc3Nvci5wcm9jZXNzKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRDb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZSh0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IHJlc3VsdENvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gc2hhZGVyaXR5IG9iamVjdCBjcmVhdGlvbiBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBpbnN0YW5jZSB0byBjcmVhdGUgc2hhZGVyaXR5IG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgY3JlYXRlU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcihzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpOiBTaGFkZXJpdHlPYmplY3RDcmVhdG9yIHtcblx0XHRyZXR1cm4gbmV3IFNoYWRlcml0eU9iamVjdENyZWF0b3Ioc2hhZGVyU3RhZ2UpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHNoYWRlciBlZGl0IGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcblx0ICogRmluZCB0aGUgZm9sbG93aW5nIHRlbXBsYXRlIHBhdHRlcm4gaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGtleSB0byB2YWx1ZVxuXHQgKiBAcGFyYW0gdGVtcGxhdGVPYmplY3QgQW4gb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgc3RyaW5nIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIHJlcGxhY2VtZW50XG5cdCAqIFRoZSBrZXkgY2FuIGJlIGEgc3RyaW5nIG9yIGFuIG9iamVjdC4gSWYgYW4gb2JqZWN0IGlzIHVzZWQgYXMgdGhlIGtleSxcblx0ICogdGhlIGtleSBpbiB0aGUgcGF0dGVybiBvZiBzaGFkZXJDb2RlIG11c3QgYWxzbyBtYXRjaCB0aGUgb2JqZWN0LlxuXHQgKiBGb3IgZXhhbXBsZSwgaWYgdGVtcGxhdGVPYmplY3QgaXNcblx0XHR7XG5cdFx0XHRzYW1wbGUge1xuXHRcdFx0XHRzYW1wbGVBOiAwXG5cdFx0XHR9XG5cdFx0fVxuXHQgKiB0aGVuIHRoZSBrZXkgaW4gYSBzaGFkZXIgY29kZSBpcyBzYW1wbGUuc2FtcGxlQS5cblx0ICovXG5cdC8vIFRoZSB0ZW1wbGF0ZSBwYXR0ZXJuIGlzXHQvKiBzaGFkZXJpdHk6IEB7a2V5fSAqL1xuXHRwdWJsaWMgc3RhdGljIGZpbGxUZW1wbGF0ZShvYmo6IFNoYWRlcml0eU9iamVjdCwgYXJnOiBUZW1wbGF0ZU9iamVjdCkge1xuXHRcdGNvbnN0IGNvcHkgPSB0aGlzLl9fY29weVNoYWRlcml0eU9iamVjdChvYmopO1xuXG5cdFx0Y29weS5jb2RlID0gU2hhZGVyRWRpdG9yLl9maWxsVGVtcGxhdGUoY29weS5jb2RlLCBhcmcpO1xuXG5cdFx0cmV0dXJuIGNvcHk7XG5cdH1cblxuXHQvKipcblx0ICogSW5zZXJ0IGRlZmluZSBkaXJlY3RpdmVcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgaW5zZXJ0RGVmaW5pdGlvbihvYmo6IFNoYWRlcml0eU9iamVjdCwgZGVmaW5pdGlvbjogc3RyaW5nKSB7XG5cdFx0Y29uc3QgY29weSA9IHRoaXMuX19jb3B5U2hhZGVyaXR5T2JqZWN0KG9iaik7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRTaGFkZXJFZGl0b3IuX2luc2VydERlZmluaXRpb24oc3BsaXR0ZWRTaGFkZXJDb2RlLCBkZWZpbml0aW9uKTtcblx0XHRjb3B5LmNvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRyZXR1cm4gY29weTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyByZWZsZWN0aW9uIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcblx0ICogQ3JlYXRlIGFuIGluc3RhbmNlIHRvIGdldCB0aGUgYXR0cmlidXRlLCB2YXJ5aW5nLCBhbmQgdW5pZm9ybSBpbmZvcm1hdGlvbiBmcm9tIGEgc2hhZGVyIGNvZGUgb2YgdGhlIHNoYWRlcml0eS5cblx0ICogVG8gZ2V0IHRoZXNlIGluZm9ybWF0aW9uLCB5b3UgbmVlZCB0byBjYWxsIHJlZmxlY3Rpb24ucmVmbGVjdCBtZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGNyZWF0ZVJlZmxlY3Rpb25PYmplY3Qob2JqOiBTaGFkZXJpdHlPYmplY3QpOiBSZWZsZWN0aW9uIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHJlZmxlY3Rpb24gPSBuZXcgUmVmbGVjdGlvbihzcGxpdHRlZFNoYWRlckNvZGUsIG9iai5zaGFkZXJTdGFnZSk7XG5cdFx0cmV0dXJuIHJlZmxlY3Rpb247XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gcHJpdmF0ZSBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19jb3B5U2hhZGVyaXR5T2JqZWN0KG9iajogU2hhZGVyaXR5T2JqZWN0KSB7XG5cdFx0Y29uc3QgY29waWVkT2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiBvYmouY29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9XG5cblx0XHRyZXR1cm4gY29waWVkT2JqO1xuXHR9XG59XG4iLCJpbXBvcnQge1xuXHRTaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0LFxuXHRTaGFkZXJFeHRlbnNpb25CZWhhdmlvcixcblx0U2hhZGVyRXh0ZW5zaW9uT2JqZWN0LFxuXHRTaGFkZXJpdHlPYmplY3QsXG5cdFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzLFxuXHRTaGFkZXJQcmVjaXNpb25PYmplY3QsXG5cdFNoYWRlclByZWNpc2lvbk9iamVjdEtleSxcblx0U2hhZGVyU3RhZ2VTdHIsXG5cdFNoYWRlckF0dHJpYnV0ZU9iamVjdCxcblx0U2hhZGVyUHJlY2lzaW9uVHlwZSxcblx0U2hhZGVyQXR0cmlidXRlVmFyVHlwZSxcblx0U2hhZGVyVmFyeWluZ09iamVjdCxcblx0U2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlLFxuXHRTaGFkZXJWYXJ5aW5nVmFyVHlwZSxcblx0U2hhZGVyVW5pZm9ybU9iamVjdCxcblx0U2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsXG5cdFNoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3QsXG5cdFNoYWRlclN0cnVjdE1lbWJlck9iamVjdCxcblx0U2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdCxcblx0U2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCxcblx0U2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdCxcblx0U2hhZGVyVUJPVmFyaWFibGVPYmplY3QsXG5cdFNoYWRlckZ1bmN0aW9uT2JqZWN0LFxufSBmcm9tICcuLi90eXBlcy90eXBlJztcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBjcmVhdGVzIGEgc2hhZGVyaXR5IG9iamVjdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciB7XG5cdHByaXZhdGUgX19zaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHI7XG5cdHByaXZhdGUgX19mdW5jdGlvbklkQ291bnQgPSAwO1xuXG5cdHByaXZhdGUgX19kZWZpbmVEaXJlY3RpdmVOYW1lczogc3RyaW5nW10gPSBbXTtcblx0cHJpdmF0ZSBfX2V4dGVuc2lvbnM6IFNoYWRlckV4dGVuc2lvbk9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19nbG9iYWxQcmVjaXNpb246IFNoYWRlclByZWNpc2lvbk9iamVjdCA9IHtcblx0XHRpbnQ6ICdoaWdocCcsXG5cdFx0ZmxvYXQ6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjJEOiAnaGlnaHAnLFxuXHRcdHNhbXBsZXJDdWJlOiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIzRDogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyMkRBcnJheTogJ2hpZ2hwJyxcblx0XHRpc2FtcGxlcjJEOiAnaGlnaHAnLFxuXHRcdGlzYW1wbGVyQ3ViZTogJ2hpZ2hwJyxcblx0XHRpc2FtcGxlcjNEOiAnaGlnaHAnLFxuXHRcdGlzYW1wbGVyMkRBcnJheTogJ2hpZ2hwJyxcblx0XHR1c2FtcGxlcjJEOiAnaGlnaHAnLFxuXHRcdHVzYW1wbGVyQ3ViZTogJ2hpZ2hwJyxcblx0XHR1c2FtcGxlcjNEOiAnaGlnaHAnLFxuXHRcdHVzYW1wbGVyMkRBcnJheTogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyMkRTaGFkb3c6ICdoaWdocCcsXG5cdFx0c2FtcGxlckN1YmVTaGFkb3c6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjJEQXJyYXlTaGFkb3c6ICdoaWdocCcsXG5cdH07XG5cdHByaXZhdGUgX19zdHJ1Y3REZWZpbml0aW9uczogU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19nbG9iYWxDb25zdGFudFZhbHVlczogU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlczogU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19hdHRyaWJ1dGVzOiBTaGFkZXJBdHRyaWJ1dGVPYmplY3RbXSA9IFtdOyAvLyBmb3IgdmVydGV4IHNoYWRlciBvbmx5XG5cdHByaXZhdGUgX192YXJ5aW5nczogU2hhZGVyVmFyeWluZ09iamVjdFtdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtczogU2hhZGVyVW5pZm9ybU9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtU3RydWN0czogU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtQnVmZmVyT2JqZWN0czogU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19mdW5jdGlvbnM6IFNoYWRlckZ1bmN0aW9uT2JqZWN0W11bXSA9IFtdOyAvLyBmaXJzdCBpbmRleCByZXByZXNlbnQgZGVwZW5kZW5jeSBsZXZlbFxuXHRwcml2YXRlIF9fbWFpbkZ1bmN0aW9uQ29kZTogc3RyaW5nID0gJ3ZvaWQgbWFpbigpIHt9Jztcblx0cHJpdmF0ZSBfX291dHB1dENvbG9yVmFyaWFibGVOYW1lOiBzdHJpbmcgPSAncmVuZGVyVGFyZ2V0MCc7IC8vIGZvciBmcmFnbWVudCBzaGFkZXIgb25seVxuXG5cdGNvbnN0cnVjdG9yKHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdHRoaXMuX19zaGFkZXJTdGFnZSA9IHNoYWRlclN0YWdlO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIGFkZCBwYXJhbWV0ZXJzIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgYWRkRGVmaW5lRGlyZWN0aXZlKGRlZmluZURpcmVjdGl2ZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5zb21lKG5hbWUgPT4gbmFtZSA9PT0gZGVmaW5lRGlyZWN0aXZlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ2FkZERlZmluZURpcmVjdGl2ZTogdGhpcyBkZWZpbmUgZGlyZWN0aXZlIGlzIGFscmVhZHkgc2V0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzLnB1c2goZGVmaW5lRGlyZWN0aXZlTmFtZSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkRXh0ZW5zaW9uKGV4dGVuc2lvbk5hbWU6IHN0cmluZywgYmVoYXZpb3I6IFNoYWRlckV4dGVuc2lvbkJlaGF2aW9yID0gJ2VuYWJsZScpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5zb21lKGV4dGVuc2lvbiA9PiBleHRlbnNpb24uZXh0ZW5zaW9uTmFtZSA9PT0gZXh0ZW5zaW9uTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ2FkZEV4dGVuc2lvbjogdGhpcyBleHRlbnNpb24gaXMgYWxyZWFkeSBzZXQnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5wdXNoKHtcblx0XHRcdGV4dGVuc2lvbk5hbWUsXG5cdFx0XHRiZWhhdmlvclxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gb25seSBkZWZpbmUgdHlwZXNcblx0cHVibGljIGFkZFN0cnVjdERlZmluaXRpb24oc3RydWN0TmFtZTogc3RyaW5nLCBtZW1iZXJPYmplY3RzOiBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3RbXSkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5zb21lKHN0cnVjdERlZmluaXRpb24gPT4gc3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFN0cnVjdERlZmluaXRpb246IGR1cGxpY2F0ZSBzdHJ1Y3QgdHlwZSBuYW1lICR7c3RydWN0TmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMucHVzaCh7XG5cdFx0XHRzdHJ1Y3ROYW1lLFxuXHRcdFx0bWVtYmVyT2JqZWN0cyxcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRHbG9iYWxDb25zdGFudFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCB0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMywgdmFsdWVzOiBudW1iZXJbXSkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5zb21lKGdsb2JhbENvbnN0YW50VmFsdWUgPT4gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRHbG9iYWxDb25zdGFudFZhbHVlOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc1ZhbGlkQ29tcG9uZW50TnVtYmVyID0gVXRpbGl0eS5faXNWYWxpZENvbXBvbmVudENvdW50KHR5cGUsIHZhbHVlcyk7XG5cdFx0aWYgKCFpc1ZhbGlkQ29tcG9uZW50TnVtYmVyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgY29tcG9uZW50IGNvdW50IG9mICR7dmFyaWFibGVOYW1lfSBpcyBpbnZhbGlkYCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNJbnRUeXBlID0gVXRpbGl0eS5faXNJbnRUeXBlKHR5cGUpO1xuXHRcdGlmIChpc0ludFR5cGUpIHtcblx0XHRcdGNvbnN0IGV4aXN0Tm9uSW50ZWdlclZhbHVlID0gU2hhZGVyaXR5T2JqZWN0Q3JlYXRvci5fX2V4aXN0Tm9uSW50ZWdlclZhbHVlKHZhbHVlcyk7XG5cdFx0XHRpZiAoZXhpc3ROb25JbnRlZ2VyVmFsdWUpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBhZGRHbG9iYWxDb25zdGFudFZhbHVlOiBub24taW50ZWdlciB2YWx1ZSBpcyBzZXQgdG8gJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0dHlwZSxcblx0XHRcdHZhbHVlcyxcblx0XHR9KTtcblx0fVxuXG5cdC8vIG5lZWQgdG8gZGVmaW5lIHN0cnVjdCBieSB0aGUgYWRkU3RydWN0RGVmaW5pdGlvbiBtZXRob2Rcblx0Ly8gdmFsaWRhdGUgdGhhdCB0aGUgY29ycmVzcG9uZGluZyBzdHJ1Y3R1cmUgaXMgZGVmaW5lZCBieSB0aGUgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZSBtZXRob2Rcblx0cHVibGljIGFkZEdsb2JhbENvbnN0YW50U3RydWN0VmFsdWUoc3RydWN0TmFtZTogc3RyaW5nLCB2YXJpYWJsZU5hbWU6IHN0cmluZywgdmFsdWVzOiB7W2tleVZhcmlhYmxlTmFtZTogc3RyaW5nXTogbnVtYmVyW119KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLnNvbWUoc3RydWN0VmFsdWUgPT4gc3RydWN0VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZTogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0c3RydWN0TmFtZSxcblx0XHRcdHZhbHVlcyxcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRBdHRyaWJ1dGVEZWNsYXJhdGlvbihcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZyxcblx0XHR0eXBlOiBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRwcmVjaXNpb24/OiBTaGFkZXJQcmVjaXNpb25UeXBlLFxuXHRcdFx0bG9jYXRpb24/OiBudW1iZXIsXG5cdFx0fVxuXHQpIHtcblx0XHRpZiAodGhpcy5fX3NoYWRlclN0YWdlICE9PSAndmVydGV4Jykge1xuXHRcdFx0Y29uc29sZS5lcnJvcignYWRkQXR0cmlidXRlOiB0aGlzIG1ldGhvZCBpcyBmb3IgdmVydGV4IHNoYWRlciBvbmx5Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2F0dHJpYnV0ZXMuc29tZShhdHRyaWJ1dGUgPT4gYXR0cmlidXRlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZEF0dHJpYnV0ZTogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2F0dHJpYnV0ZXMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHR0eXBlLFxuXHRcdFx0cHJlY2lzaW9uOiBvcHRpb25zPy5wcmVjaXNpb24sXG5cdFx0XHRsb2NhdGlvbjogb3B0aW9ucz8ubG9jYXRpb24sXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkVmFyeWluZ0RlY2xhcmF0aW9uKFxuXHRcdHZhcmlhYmxlTmFtZTogc3RyaW5nLFxuXHRcdHR5cGU6IFNoYWRlclZhcnlpbmdWYXJUeXBlLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRwcmVjaXNpb24/OiBTaGFkZXJQcmVjaXNpb25UeXBlLFxuXHRcdFx0aW50ZXJwb2xhdGlvblR5cGU/OiBTaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUsXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fdmFyeWluZ3Muc29tZSh2YXJ5aW5nID0+IHZhcnlpbmcudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVmFyeWluZzogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNJbnRUeXBlID0gVXRpbGl0eS5faXNJbnRUeXBlKHR5cGUpO1xuXHRcdGxldCBpbnRlcnBvbGF0aW9uVHlwZSA9IG9wdGlvbnM/LmludGVycG9sYXRpb25UeXBlO1xuXHRcdGlmIChpc0ludFR5cGUgJiYgaW50ZXJwb2xhdGlvblR5cGUgIT09ICdmbGF0Jykge1xuXHRcdFx0aWYgKGludGVycG9sYXRpb25UeXBlICE9IG51bGwpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVmFyeWluZzogdGhlIGludGVycG9sYXRpb25UeXBlIG11c3QgYmUgZmxhdCBmb3IgaW50ZWdlciB0eXBlc2ApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYGFkZFZhcnlpbmc6IHNldCB0aGUgaW50ZXJwb2xhdGlvblR5cGUgb2YgaW50ZWdlciB0eXBlcyB0byBmbGF0IHRvIGF2b2lkIGNvbXBpbGF0aW9uIGVycm9yYCk7XG5cdFx0XHRcdGludGVycG9sYXRpb25UeXBlID0gJ2ZsYXQnO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX192YXJ5aW5ncy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHR5cGUsXG5cdFx0XHRwcmVjaXNpb246IG9wdGlvbnM/LnByZWNpc2lvbixcblx0XHRcdGludGVycG9sYXRpb25UeXBlLFxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGFkZFVuaWZvcm1EZWNsYXJhdGlvbihcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZyxcblx0XHR0eXBlOiBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0cHJlY2lzaW9uPzogU2hhZGVyUHJlY2lzaW9uVHlwZSxcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX191bmlmb3Jtcy5zb21lKHVuaWZvcm0gPT4gdW5pZm9ybS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodHlwZSA9PT0gJ2Jvb2wnICYmIG9wdGlvbnM/LnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYGFkZFVuaWZvcm06IHJlbW92ZSB0aGUgc3BlY2lmaWNhdGlvbiBvZiBwcmVjaXNpb24gZm9yIGJvb2wgdHlwZSB0byBhdm9pZCBjb21waWxhdGlvbiBlcnJvcmApO1xuXHRcdFx0b3B0aW9ucy5wcmVjaXNpb24gPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1zLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0dHlwZSxcblx0XHRcdHByZWNpc2lvbjogb3B0aW9ucz8ucHJlY2lzaW9uLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gbmVlZCB0byBkZWZpbmUgc3RydWN0IGJ5IHRoZSBhZGRTdHJ1Y3REZWZpbml0aW9uIG1ldGhvZFxuXHRwdWJsaWMgYWRkVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uKFxuXHRcdHN0cnVjdE5hbWU6IHN0cmluZyxcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZ1xuXHQpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybVN0cnVjdHMuc29tZSh1bmlmb3JtU3RydWN0ID0+IHVuaWZvcm1TdHJ1Y3QudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybVN0cnVjdHMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHRzdHJ1Y3ROYW1lLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gZm9yIGVzM1xuXHRwdWJsaWMgYWRkVW5pZm9ybUJ1ZmZlck9iamVjdERlY2xhcmF0aW9uKFxuXHRcdGJsb2NrTmFtZTogc3RyaW5nLFxuXHRcdHZhcmlhYmxlT2JqZWN0czogU2hhZGVyVUJPVmFyaWFibGVPYmplY3RbXSxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0aW5zdGFuY2VOYW1lPzogU2hhZGVyUHJlY2lzaW9uVHlwZVxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGVCbG9ja05hbWUgPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzLnNvbWUodWJvID0+IHViby5ibG9ja05hbWUgPT09IGJsb2NrTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlQmxvY2tOYW1lKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb246IGR1cGxpY2F0ZSBibG9jayBuYW1lICR7YmxvY2tOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgdWJvIG9mIHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cykge1xuXHRcdFx0Zm9yIChjb25zdCB1Ym9WYXJpYWJsZU9iamVjdCBvZiB1Ym8udmFyaWFibGVPYmplY3RzKSB7XG5cdFx0XHRcdGZvciAoY29uc3QgdmFyaWFibGVPYmplY3Qgb2YgdmFyaWFibGVPYmplY3RzKSB7XG5cdFx0XHRcdFx0aWYgKHVib1ZhcmlhYmxlT2JqZWN0LnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVPYmplY3QudmFyaWFibGVOYW1lKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb246IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVPYmplY3QudmFyaWFibGVOYW1lfWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cy5wdXNoKHtcblx0XHRcdGJsb2NrTmFtZSxcblx0XHRcdHZhcmlhYmxlT2JqZWN0cyxcblx0XHRcdGluc3RhbmNlTmFtZTogb3B0aW9ucz8uaW5zdGFuY2VOYW1lLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gdGhlIHJldHVybiB2YWx1ZSBJZCBpcyBhIHZhbHVlIHRvIGRlbGV0ZSB0aGUgZnVuY3Rpb25cblx0Ly8gdGhlIG1haW4gZnVuY3Rpb24gaXMgZGVmaW5lZCAodXBkYXRlZCkgYnkgdGhlIHVwZGF0ZU1haW5GdW5jdGlvbiBtZXRob2Rcblx0cHVibGljIGFkZEZ1bmN0aW9uRGVmaW5pdGlvbihcblx0XHRmdW5jdGlvbkNvZGU6IHN0cmluZyxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0ZGVwZW5kZW5jeUxldmVsPzogbnVtYmVyXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCBmdW5jdGlvbklkID0gdGhpcy5fX2Z1bmN0aW9uSWRDb3VudCsrO1xuXG5cdFx0Y29uc3QgZGVwZW5kZW5jeUxldmVsID0gb3B0aW9ucz8uZGVwZW5kZW5jeUxldmVsID8/IDA7XG5cdFx0dGhpcy5fX2Z1bmN0aW9uc1tkZXBlbmRlbmN5TGV2ZWxdID0gdGhpcy5fX2Z1bmN0aW9uc1tkZXBlbmRlbmN5TGV2ZWxdID8/IFtdO1xuXHRcdHRoaXMuX19mdW5jdGlvbnNbZGVwZW5kZW5jeUxldmVsXS5wdXNoKHtcblx0XHRcdGZ1bmN0aW9uQ29kZSxcblx0XHRcdGZ1bmN0aW9uSWRcblx0XHR9KTtcblxuXHRcdHJldHVybiBmdW5jdGlvbklkO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHVwZGF0ZSBwYXJhbWV0ZXJzIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgdXBkYXRlR2xvYmFsUHJlY2lzaW9uKHByZWNpc2lvbjogU2hhZGVyUHJlY2lzaW9uT2JqZWN0KSB7XG5cdFx0T2JqZWN0LmFzc2lnbih0aGlzLl9fZ2xvYmFsUHJlY2lzaW9uLCBwcmVjaXNpb24pO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZVN0cnVjdERlZmluaXRpb24oc3RydWN0TmFtZTogc3RyaW5nLCBtZW1iZXJPYmplY3RzOiBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3RbXSkge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuZmluZEluZGV4KHN0cnVjdERlZmluaXRpb24gPT4gc3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgdXBkYXRlU3RydWN0RGVmaW5pdGlvbjogdGhlIHN0cnVjdCB0eXBlIG5hbWUgJHtzdHJ1Y3ROYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnNbbWF0Y2hlZEluZGV4XS5tZW1iZXJPYmplY3RzID0gbWVtYmVyT2JqZWN0cztcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCB2YWx1ZXM6IG51bWJlcltdKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5maW5kSW5kZXgoZ2xvYmFsQ29uc3RhbnRWYWx1ZSA9PiBnbG9iYWxDb25zdGFudFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGB1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdHlwZSA9IHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlc1ttYXRjaGVkSW5kZXhdLnR5cGU7XG5cblx0XHRjb25zdCBpc1ZhbGlkQ29tcG9uZW50TnVtYmVyID0gVXRpbGl0eS5faXNWYWxpZENvbXBvbmVudENvdW50KHR5cGUsIHZhbHVlcyk7XG5cdFx0aWYgKCFpc1ZhbGlkQ29tcG9uZW50TnVtYmVyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCd1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgY29tcG9uZW50IGNvdW50IGlzIGludmFsaWQnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc0ludFR5cGUgPSBVdGlsaXR5Ll9pc0ludFR5cGUodHlwZSk7XG5cdFx0aWYgKGlzSW50VHlwZSkge1xuXHRcdFx0Y29uc3QgZXhpc3ROb25JbnRlZ2VyVmFsdWUgPSBTaGFkZXJpdHlPYmplY3RDcmVhdG9yLl9fZXhpc3ROb25JbnRlZ2VyVmFsdWUodmFsdWVzKTtcblx0XHRcdGlmIChleGlzdE5vbkludGVnZXJWYWx1ZSkge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYHVwZGF0ZUdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSAke3ZhcmlhYmxlTmFtZX0gaGFzIGEgbm9uLWludGVnZXIgdmFsdWUuYCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzW21hdGNoZWRJbmRleF0udmFsdWVzID0gdmFsdWVzO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlczoge1trZXlWYXJpYWJsZU5hbWU6IHN0cmluZ106IG51bWJlcltdfSkge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMuZmluZEluZGV4KHN0cnVjdFZhbHVlID0+IHN0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgdXBkYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZTogIHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXNbbWF0Y2hlZEluZGV4XS52YWx1ZXMgPSB2YWx1ZXM7XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlTWFpbkZ1bmN0aW9uKG1haW5GdW5jdGlvbkNvZGVJbm5lcjogc3RyaW5nKSB7XG5cdFx0dGhpcy5fX21haW5GdW5jdGlvbkNvZGUgPSBtYWluRnVuY3Rpb25Db2RlSW5uZXI7XG5cdH1cblxuXHQvLyBzcGVjaWZ5IHRoZSBuYW1lIG9mIHRoZSBvdXRwdXQgY29sb3IgdmFyaWFibGUgZnJvbSB0aGUgbWFpbiBmdW5jdGlvbiBpbiB0aGUgZnJhZ21lbnQgc2hhZGVyLlxuXHQvLyB1c2VycyBoYXZlIHRvIGFzc2lnbiB0aGUgcmVzdWx0IG9mIGZyYWdtZW50IHNoYWRlciBjYWxjdWxhdGlvbiB0byB0aGlzIHZhcmlhYmxlLlxuXHRwdWJsaWMgdXBkYXRlT3V0cHV0Q29sb3JWYXJpYWJsZU5hbWUob3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGlmICh0aGlzLl9fc2hhZGVyU3RhZ2UgIT09ICdmcmFnbWVudCcpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ3VwZGF0ZU91dHB1dENvbG9yVmFyaWFibGVOYW1lOiB0aGlzIG1ldGhvZCBpcyBmb3IgZnJhZ21lbnQgc2hhZGVyIG9ubHknKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAob3V0cHV0Q29sb3JWYXJpYWJsZU5hbWUubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCd1cGRhdGVPdXRwdXRDb2xvclZhcmlhYmxlTmFtZTogaW52YWxpZCBvdXRDb2xvclZhcmlhYmxlTmFtZScpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19vdXRwdXRDb2xvclZhcmlhYmxlTmFtZSA9IG91dHB1dENvbG9yVmFyaWFibGVOYW1lO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHJlbW92ZSBwYXJhbWV0ZXJzIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgcmVtb3ZlRGVmaW5lRGlyZWN0aXZlKGRlZmluZURpcmVjdGl2ZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9IHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5pbmRleE9mKGRlZmluZURpcmVjdGl2ZU5hbWUpO1xuXG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybigncmVtb3ZlZERlZmluZURpcmVjdGl2ZTogdGhpcyBkZWZpbmUgZGlyZWN0aXZlIGlzIG5vdCBleGlzdCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVFeHRlbnNpb24oZXh0ZW5zaW9uTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19leHRlbnNpb25zLmZpbmRJbmRleChleHRlbnNpb24gPT4gZXh0ZW5zaW9uLmV4dGVuc2lvbk5hbWUgPT09IGV4dGVuc2lvbk5hbWUpO1xuXG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybigncmVtb3ZlRXh0ZW5zaW9uOiB0aGlzIGV4dGVuc2lvbiBpcyBub3QgZXhpc3QnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVTdHJ1Y3REZWZpbml0aW9uKHN0cnVjdE5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuZmluZEluZGV4KHN0cnVjdERlZmluaXRpb24gPT4gc3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgcmVtb3ZlU3RydWN0RGVmaW5pdGlvbjogdGhlIHN0cnVjdCB0eXBlIG5hbWUgJHtzdHJ1Y3ROYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlR2xvYmFsQ29uc3RhbnRWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMuZmluZEluZGV4KGdsb2JhbENvbnN0YW50VmFsdWUgPT4gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5maW5kSW5kZXgoc3RydWN0VmFsdWUgPT4gc3RydWN0VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGB1cGRhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlOiAgdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVBdHRyaWJ1dGVEZWNsYXJhdGlvbih2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fYXR0cmlidXRlcy5maW5kSW5kZXgoYXR0cmlidXRlID0+IGF0dHJpYnV0ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlQXR0cmlidXRlOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2F0dHJpYnV0ZXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlVmFyeWluZ0RlY2xhcmF0aW9uKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX192YXJ5aW5ncy5maW5kSW5kZXgodmFyeWluZyA9PiB2YXJ5aW5nLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVWYXJ5aW5nOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3ZhcnlpbmdzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVVuaWZvcm1EZWNsYXJhdGlvbih2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybXMuZmluZEluZGV4KHVuaWZvcm0gPT4gdW5pZm9ybS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlVW5pZm9ybTogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3Jtcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb24odmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1TdHJ1Y3RzLmZpbmRJbmRleCh1bmlmb3JtU3RydWN0ID0+IHVuaWZvcm1TdHJ1Y3QudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbjogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3JtU3RydWN0cy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb24oYmxvY2tOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzLmZpbmRJbmRleCh1Ym8gPT4gdWJvLmJsb2NrTmFtZSA9PT0gYmxvY2tOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb246IHRoZSB2YXJpYWJsZSBuYW1lICR7YmxvY2tOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlRnVuY3Rpb25EZWZpbml0aW9uKGZ1bmN0aW9uSWQ6IG51bWJlcikge1xuXHRcdHRoaXMuX19maWxsRW1wdHlGdW5jdGlvbnMoKTtcblxuXHRcdC8vIGlkIGlzIHRvbyBzbWFsbCBvciB0b28gYmlnXG5cdFx0aWYgKGZ1bmN0aW9uSWQgPCAwIHx8IGZ1bmN0aW9uSWQgPj0gdGhpcy5fX2Z1bmN0aW9uSWRDb3VudCkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdyZW1vdmVGdW5jdGlvbkRlZmluaXRpb246IGludmFsaWQgZnVuY3Rpb24gaWQnKVxuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgZnVuY3Rpb25PYmplY3RzIG9mIHRoaXMuX19mdW5jdGlvbnMpIHtcblx0XHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHRcdGZ1bmN0aW9uT2JqZWN0cy5maW5kSW5kZXgoZnVuY3Rpb25PYmplY3QgPT4gZnVuY3Rpb25PYmplY3QuZnVuY3Rpb25JZCA9PT0gZnVuY3Rpb25JZCk7XG5cdFx0XHRpZiAobWF0Y2hlZEluZGV4ICE9PSAtMSkge1xuXHRcdFx0XHRmdW5jdGlvbk9iamVjdHMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zb2xlLndhcm4oYHJlbW92ZUZ1bmN0aW9uRGVmaW5pdGlvbjogbm90IGZvdW5kIHRoZSBmdW5jdGlvbiBvZiBmdW5jdGlvbklkICR7ZnVuY3Rpb25JZH1gKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBjcmVhdGUgc2hhZGVyaXR5IG9iamVjdCBmdW5jdGlvblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgY3JlYXRlU2hhZGVyaXR5T2JqZWN0KCk6IFNoYWRlcml0eU9iamVjdCB7XG5cdFx0Y29uc3Qgc2hhZGVyaXR5T2JqID0ge1xuXHRcdFx0Y29kZTogdGhpcy5fX2NyZWF0ZVNoYWRlckNvZGUoKSxcblx0XHRcdHNoYWRlclN0YWdlOiB0aGlzLl9fc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiB0aGlzLl9fc2hhZGVyU3RhZ2UgPT09ICdmcmFnbWVudCcsXG5cdFx0fTtcblxuXHRcdHJldHVybiBzaGFkZXJpdHlPYmo7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gcHJpdmF0ZSBtZXRob2RzXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHByaXZhdGUgc3RhdGljIF9fZXhpc3ROb25JbnRlZ2VyVmFsdWUodmFsdWVzOiBudW1iZXJbXSkge1xuXHRcdGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG5cdFx0XHRpZiAoIU51bWJlci5pc0ludGVnZXIodmFsdWUpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBUT0RPOiBpbXBsZW1lbnQgc2hhZGVyIGNvZGUgaW1wb3J0IGZlYXR1cmUgKGxvdyBwcmlvcml0eSlcblx0Ly8gcHVibGljIGltcG9ydFNoYWRlckNvZGUoY29kZTogc3RyaW5nKSB7fVxuXG5cdC8vIG5lZWQgdG8gYXBwbHkgU2hhZGVyaXR5LnRyYW5zZm9ybVRvR0xTTEVTMSwgdHJhbnNmb3JtVG9HTFNMRVMzIG9yIHRyYW5zZm9ybVRvIG1ldGhvZFxuXHRwcml2YXRlIF9fY3JlYXRlU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdHRoaXMuX19maWxsRW1wdHlGdW5jdGlvbnMoKTtcblxuXHRcdGNvbnN0IGNvZGVcblx0XHRcdD0gYCN2ZXJzaW9uIDMwMCBlc1xcblxcbmBcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZURlZmluZURpcmVjdGl2ZVNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlRXh0ZW5zaW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVHbG9iYWxQcmVjaXNpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVN0cnVjdERlZmluaXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUdsb2JhbENvbnN0YW50VmFsdWVTaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUF0dHJpYnV0ZURlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVWYXJ5aW5nRGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZU91dHB1dENvbG9yRGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVVuaWZvcm1EZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVVbmlmb3JtQnVmZmVyT2JqZWN0U2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVGdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZU1haW5GdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKCk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdHByaXZhdGUgX19maWxsRW1wdHlGdW5jdGlvbnMoKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9fZnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0aGlzLl9fZnVuY3Rpb25zW2ldID0gdGhpcy5fX2Z1bmN0aW9uc1tpXSA/PyBbXTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlRGVmaW5lRGlyZWN0aXZlU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBkZWZpbmVEaXJlY3RpdmVOYW1lIG9mIHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgI2RlZmluZSAke2RlZmluZURpcmVjdGl2ZU5hbWV9XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpOztcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVFeHRlbnNpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IGV4dGVuc2lvbiBvZiB0aGlzLl9fZXh0ZW5zaW9ucykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgI2V4dGVuc2lvbiAke2V4dGVuc2lvbi5leHRlbnNpb25OYW1lfTogJHtleHRlbnNpb24uYmVoYXZpb3J9XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0Ly9UT0RPOiByZW1vdmUgbmVlZGxlc3MgcHJlY2lzaW9uc1xuXHRwcml2YXRlIF9fY3JlYXRlR2xvYmFsUHJlY2lzaW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB0eXBlIGluIHRoaXMuX19nbG9iYWxQcmVjaXNpb24pIHtcblx0XHRcdGNvbnN0IHByZWNpc2lvblR5cGUgPSB0eXBlIGFzIFNoYWRlclByZWNpc2lvbk9iamVjdEtleTtcblx0XHRcdGNvbnN0IHByZWNpc2lvblF1YWxpZmllciA9IHRoaXMuX19nbG9iYWxQcmVjaXNpb25bcHJlY2lzaW9uVHlwZV07XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYHByZWNpc2lvbiAke3ByZWNpc2lvblF1YWxpZmllcn0gJHtwcmVjaXNpb25UeXBlfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlU3RydWN0RGVmaW5pdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3Qgc3RydWN0RGVmaW5pdGlvbiBvZiB0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYHN0cnVjdCAke3N0cnVjdERlZmluaXRpb24uc3RydWN0TmFtZX0ge1xcbmA7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlID0gc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzW2ldO1xuXG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCAgYDtcblx0XHRcdFx0aWYgKHZhcmlhYmxlLnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJpYWJsZS5wcmVjaXNpb259IGA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcmlhYmxlLnR5cGV9ICR7dmFyaWFibGUubWVtYmVyTmFtZX07XFxuYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZVNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgZ2xvYmFsQ29uc3RhbnRWYWx1ZSBvZiB0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBnbG9iYWxDb25zdGFudFZhbHVlLnR5cGU7XG5cdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSBnbG9iYWxDb25zdGFudFZhbHVlLnZhcmlhYmxlTmFtZTtcblx0XHRcdGNvbnN0IHZhbHVlID0gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YWx1ZXM7XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYGNvbnN0ICR7dHlwZX0gJHt2YXJpYWJsZU5hbWV9ID0gJHt0eXBlfShgO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IHZhbHVlW2ldICsgJywgJztcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSA9IHNoYWRlckNvZGUucmVwbGFjZSgvLFxccyQvLCAnKTtcXG4nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHN0cnVjdFZhbHVlIG9mIHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcykge1xuXHRcdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLmZpbmRJbmRleChkZWZpbml0aW9uID0+IGRlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0VmFsdWUuc3RydWN0TmFtZSk7XG5cdFx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiB0aGUgc3RydWN0IHR5cGUgJHtzdHJ1Y3RWYWx1ZS5zdHJ1Y3ROYW1lfSBpcyBub3QgZGVmaW5lZGApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgY29uc3QgJHtzdHJ1Y3RWYWx1ZS5zdHJ1Y3ROYW1lfSAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gPSAke3N0cnVjdFZhbHVlLnN0cnVjdE5hbWV9IChcXG5gO1xuXG5cdFx0XHRjb25zdCBzdHJ1Y3REZWZpbml0aW9uID0gdGhpcy5fX3N0cnVjdERlZmluaXRpb25zW21hdGNoZWRJbmRleF07XG5cdFx0XHRpZiAoc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzLmxlbmd0aCAhPT0gT2JqZWN0LmtleXMoc3RydWN0VmFsdWUudmFsdWVzKS5sZW5ndGgpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogSW52YWxpZCBudW1iZXIgb2YgdmFyaWFibGVzIHRoYXQgJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9IGhhc2ApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaGFzU2FtcGxlclR5cGUgPVxuXHRcdFx0XHRzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHMuc29tZShtZW1iZXJPYmplY3QgPT4gVXRpbGl0eS5faXNTYW1wbGVyVHlwZShtZW1iZXJPYmplY3QudHlwZSkpO1xuXHRcdFx0aWYgKGhhc1NhbXBsZXJUeXBlKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6IENvbnN0YW50U3RydWN0VmFsdWUgKCR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSkgY2Fubm90IGhhdmUgc2FtcGxlciB0eXBlIHBhcmFtZXRlcmApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzW2ldLm1lbWJlck5hbWU7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gc3RydWN0VmFsdWUudmFsdWVzW3ZhcmlhYmxlTmFtZV1cblx0XHRcdFx0aWYgKHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gZG9lcyBub3QgaGF2ZSB0aGUgdmFsdWUgb2YgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB0eXBlID0gc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzW2ldLnR5cGU7XG5cdFx0XHRcdGNvbnN0IGlzVmFsaWRDb21wb25lbnROdW1iZXIgPSBVdGlsaXR5Ll9pc1ZhbGlkQ29tcG9uZW50Q291bnQodHlwZSwgdmFsdWUpO1xuXHRcdFx0XHRpZiAoIWlzVmFsaWRDb21wb25lbnROdW1iZXIpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiB0aGUgY29tcG9uZW50IGNvdW50IG9mICR7dmFyaWFibGVOYW1lfSBpbiAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gaXMgaW52YWxpZGApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgICAke3R5cGV9KGA7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRzaGFkZXJDb2RlICs9IHZhbHVlW2ldICsgJywgJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNoYWRlckNvZGUgPSBzaGFkZXJDb2RlLnJlcGxhY2UoLyxcXHMkLywgJyksXFxuJyk7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgPSBzaGFkZXJDb2RlLnJlcGxhY2UoLyxcXG4kLywgJ1xcbik7XFxuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVBdHRyaWJ1dGVEZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgYXR0cmlidXRlIG9mIHRoaXMuX19hdHRyaWJ1dGVzKSB7XG5cdFx0XHRpZiAoYXR0cmlidXRlLmxvY2F0aW9uICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgbGF5b3V0IChsb2NhdGlvbiA9ICR7YXR0cmlidXRlLmxvY2F0aW9ufSkgYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgaW4gYDtcblxuXHRcdFx0aWYgKGF0dHJpYnV0ZS5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke2F0dHJpYnV0ZS5wcmVjaXNpb259IGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYCR7YXR0cmlidXRlLnR5cGV9ICR7YXR0cmlidXRlLnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVZhcnlpbmdEZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdmFyeWluZyBvZiB0aGlzLl9fdmFyeWluZ3MpIHtcblx0XHRcdGlmICh2YXJ5aW5nLmludGVycG9sYXRpb25UeXBlICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJ5aW5nLmludGVycG9sYXRpb25UeXBlfSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IHRoaXMuX19zaGFkZXJTdGFnZSA9PSAndmVydGV4JyA/IGBvdXQgYCA6IGBpbiBgO1xuXG5cdFx0XHRpZiAodmFyeWluZy5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcnlpbmcucHJlY2lzaW9ufSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcnlpbmcudHlwZX0gJHt2YXJ5aW5nLnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0Ly9UT0RPOiB0cmFuc2xhdGUgd2hlbiBnbHNsIGVzMVxuXHRwcml2YXRlIF9fY3JlYXRlT3V0cHV0Q29sb3JEZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRpZiAodGhpcy5fX3NoYWRlclN0YWdlICE9PSAnZnJhZ21lbnQnKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGBsYXlvdXQobG9jYXRpb24gPSAwKSBvdXQgdmVjNCAke3RoaXMuX19vdXRwdXRDb2xvclZhcmlhYmxlTmFtZX07XFxuXFxuYDtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVVbmlmb3JtRGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHVuaWZvcm0gb2YgdGhpcy5fX3VuaWZvcm1zKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGB1bmlmb3JtIGA7XG5cblx0XHRcdGlmICh1bmlmb3JtLnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dW5pZm9ybS5wcmVjaXNpb259IGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dW5pZm9ybS50eXBlfSAke3VuaWZvcm0udmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB1bmlmb3JtU3RydWN0IG9mIHRoaXMuX191bmlmb3JtU3RydWN0cykge1xuXHRcdFx0Y29uc3Qgc3RydWN0TmFtZSA9IHVuaWZvcm1TdHJ1Y3Quc3RydWN0TmFtZTtcblxuXHRcdFx0Y29uc3QgZXhpc3RTdHJ1Y3REZWZpbml0aW9uID1cblx0XHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLnNvbWUoZGVmaW5pdGlvbiA9PiBkZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdE5hbWUpO1xuXHRcdFx0aWYgKCFleGlzdFN0cnVjdERlZmluaXRpb24pIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb25TaGFkZXJDb2RlOiB0aGUgc3RydWN0IHR5cGUgJHtzdHJ1Y3ROYW1lfSBpcyBub3QgZGVmaW5lZGApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgdW5pZm9ybSAke3N0cnVjdE5hbWV9ICR7dW5pZm9ybVN0cnVjdC52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVVbmlmb3JtQnVmZmVyT2JqZWN0U2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB1Ym8gb2YgdGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGBsYXlvdXQgKHN0ZDE0MCkgdW5pZm9ybSAke3Viby5ibG9ja05hbWV9IHtcXG5gO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHViby52YXJpYWJsZU9iamVjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVPYmogPSB1Ym8udmFyaWFibGVPYmplY3RzW2ldO1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAgICR7dmFyaWFibGVPYmoudHlwZX0gJHt2YXJpYWJsZU9iai52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh1Ym8uaW5zdGFuY2VOYW1lICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgfSAke3Viby5pbnN0YW5jZU5hbWV9O1xcbmA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGB9O1xcbmA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVGdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX19mdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGZ1bmN0aW9uT2JqZWN0cyA9IHRoaXMuX19mdW5jdGlvbnNbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGZ1bmN0aW9uT2JqZWN0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGZ1bmN0aW9uT2JqZWN0c1tqXS5mdW5jdGlvbkNvZGUgKyBgXFxuYDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZU1haW5GdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuX19tYWluRnVuY3Rpb25Db2RlICsgYFxcbmA7XG5cdH1cbn1cbiIsImltcG9ydCB7U2hhZGVyQXR0cmlidXRlVmFyVHlwZSwgU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMsIFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzLCBTaGFkZXJWYXJ5aW5nVmFyVHlwZX0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxpdHkge1xuXHRzdGF0aWMgX3NwbGl0QnlMaW5lRmVlZENvZGUoc291cmNlOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gc291cmNlLnNwbGl0KC9cXHJcXG58XFxuLyk7XG5cdH1cblxuXHRzdGF0aWMgX2pvaW5TcGxpdHRlZExpbmUoc3BsaXR0ZWRMaW5lOiBzdHJpbmdbXSkge1xuXHRcdHJldHVybiBzcGxpdHRlZExpbmUuam9pbignXFxuJyk7XG5cdH1cblxuXHRzdGF0aWMgX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzb3VyY2U6IHN0cmluZykge1xuXHRcdHJldHVybiBzb3VyY2UgPT09ICcnID8gc291cmNlIDogc291cmNlICsgJ1xcbic7XG5cdH1cblxuXHRzdGF0aWMgX2NvbXBvbmVudE51bWJlcihcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzXG5cdCkge1xuXHRcdGxldCBjb21wb25lbnROdW1iZXI7XG5cdFx0aWYgKFxuXHRcdFx0dHlwZSA9PT0gJ2Zsb2F0JyB8fCB0eXBlID09PSAnaW50JyB8fCB0eXBlID09PSAnYm9vbCcgfHwgdHlwZSA9PT0gJ3VpbnQnIHx8XG5cdFx0XHR0eXBlID09PSAnc2FtcGxlcjJEJyB8fCB0eXBlID09PSAnc2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICdzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICdzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICdpc2FtcGxlcjJEJyB8fCB0eXBlID09PSAnaXNhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAnaXNhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICd1c2FtcGxlcjJEJyB8fCB0eXBlID09PSAndXNhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAndXNhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICdzYW1wbGVyMkRTaGFkb3cnIHx8IHR5cGUgPT09ICdzYW1wbGVyQ3ViZVNoYWRvdycgfHwgdHlwZSA9PT0gJ3NhbXBsZXIyREFycmF5U2hhZG93J1xuXHRcdCkge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMTtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZWMyJyB8fCB0eXBlID09PSAnaXZlYzInIHx8IHR5cGUgPT09ICdidmVjMicgfHwgdHlwZSA9PT0gJ3V2ZWMyJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMjtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZWMzJyB8fCB0eXBlID09PSAnaXZlYzMnIHx8IHR5cGUgPT09ICdidmVjMycgfHwgdHlwZSA9PT0gJ3V2ZWMzJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMztcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZWM0JyB8fCB0eXBlID09PSAnaXZlYzQnIHx8IHR5cGUgPT09ICdidmVjNCcgfHwgdHlwZSA9PT0gJ3V2ZWM0JyB8fCB0eXBlID09PSAnbWF0MicgfHwgdHlwZSA9PT0gJ21hdDJ4MicpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDQ7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0MngzJyB8fCB0eXBlID09PSAnbWF0M3gyJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gNjtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQyeDQnIHx8IHR5cGUgPT09ICdtYXQ0eDInKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSA4O1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDMnIHx8IHR5cGUgPT09ICdtYXQzeDMnKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSA5O1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDN4NCcgfHwgdHlwZSA9PT0gJ21hdDR4MycpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDEyO1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDQnIHx8IHR5cGUgPT09ICdtYXQ0eDQnKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAxNjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gdW5rbm93biB0eXBlXG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAwO1xuXHRcdFx0Y29uc29sZS5lcnJvcignVXRpbGl0eS5fY29tcG9uZW50TnVtYmVyOiBkZXRlY3QgdW5rbm93biB0eXBlJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbXBvbmVudE51bWJlcjtcblx0fVxuXG5cdHN0YXRpYyBfaXNJbnRUeXBlKFxuXHRcdHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIHwgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSB8IFNoYWRlclZhcnlpbmdWYXJUeXBlIHwgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzNcblx0KSB7XG5cdFx0aWYgKFxuXHRcdFx0dHlwZSA9PT0gJ2ludCcgfHwgdHlwZSA9PT0gJ2l2ZWMyJyB8fCB0eXBlID09PSAnaXZlYzMnIHx8IHR5cGUgPT09ICdpdmVjNCcgfHxcblx0XHRcdHR5cGUgPT09ICd1aW50JyB8fCB0eXBlID09PSAndXZlYzInIHx8IHR5cGUgPT09ICd1dmVjMycgfHwgdHlwZSA9PT0gJ3V2ZWM0J1xuXHRcdCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgX2lzVmFsaWRDb21wb25lbnRDb3VudChcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzLFxuXHRcdHZhbHVlczogbnVtYmVyW11cblx0KSB7XG5cdFx0Y29uc3QgdmFsaWRDb21wb25lbnRDb3VudCA9IFV0aWxpdHkuX2NvbXBvbmVudE51bWJlcih0eXBlKTtcblx0XHRpZiAodmFsaWRDb21wb25lbnRDb3VudCA9PT0gdmFsdWVzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHN0YXRpYyBfaXNTYW1wbGVyVHlwZShcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzXG5cdCkge1xuXHRcdGlmIChcblx0XHRcdHR5cGUgPT09ICdzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICdzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ3NhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ3NhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ2lzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICdpc2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICdpc2FtcGxlcjNEJyB8fCB0eXBlID09PSAnaXNhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3VzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICd1c2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICd1c2FtcGxlcjNEJyB8fCB0eXBlID09PSAndXNhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3NhbXBsZXIyRFNoYWRvdycgfHwgdHlwZSA9PT0gJ3NhbXBsZXJDdWJlU2hhZG93JyB8fCB0eXBlID09PSAnc2FtcGxlcjJEQXJyYXlTaGFkb3cnXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==