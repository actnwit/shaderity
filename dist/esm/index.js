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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluL1JlZmxlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4vU2hhZGVyRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluL1NoYWRlclRyYW5zZm9ybWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluL1NoYWRlcml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9TaGFkZXJpdHlPYmplY3RDcmVhdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluL1V0aWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQSw0R0FBeUM7QUF5RXpDLGtCQUFlLG1CQUFTOzs7Ozs7Ozs7Ozs7Ozs7QUMvRHhC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Y0FBYyxDQUNwQixJQUE2RztRQUU3RyxJQUNDLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxLQUFLLGFBQWEsSUFBSSxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxnQkFBZ0I7WUFDbkcsSUFBSSxLQUFLLFlBQVksSUFBSSxJQUFJLEtBQUssY0FBYyxJQUFJLElBQUksS0FBSyxZQUFZLElBQUksSUFBSSxLQUFLLGlCQUFpQjtZQUN2RyxJQUFJLEtBQUssWUFBWSxJQUFJLElBQUksS0FBSyxjQUFjLElBQUksSUFBSSxLQUFLLFlBQVksSUFBSSxJQUFJLEtBQUssaUJBQWlCO1lBQ3ZHLElBQUksS0FBSyxpQkFBaUIsSUFBSSxJQUFJLEtBQUssbUJBQW1CLElBQUksSUFBSSxLQUFLLHNCQUFzQixFQUM1RjtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ1o7YUFBTTtZQUNOLE9BQU8sS0FBSyxDQUFDO1NBQ2I7SUFDRixDQUFDO0NBQ0Q7QUF4RkQsMEJBd0ZDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuLy4uLy4uL2Rpc3QvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IFNoYWRlcml0eSBmcm9tICcuL21haW4vU2hhZGVyaXR5JztcclxuaW1wb3J0IF9TaGFkZXJpdHlPYmplY3RDcmVhdG9yIGZyb20gJy4vbWFpbi9TaGFkZXJpdHlPYmplY3RDcmVhdG9yJztcclxuaW1wb3J0IF9SZWZsZWN0aW9uIGZyb20gJy4vbWFpbi9SZWZsZWN0aW9uJztcclxuXHJcbmltcG9ydCB7XHJcbiAgQXR0cmlidXRlU2VtYW50aWNzIGFzIF9BdHRyaWJ1dGVTZW1hbnRpY3MsXHJcbiAgUmVmbGVjdGlvbkF0dHJpYnV0ZSBhcyBfUmVmbGVjdGlvbkF0dHJpYnV0ZSxcclxuICBSZWZsZWN0aW9uVW5pZm9ybSBhcyBfUmVmbGVjdGlvblVuaWZvcm0sXHJcbiAgUmVmbGVjdGlvblZhcnlpbmcgYXMgX1JlZmxlY3Rpb25WYXJ5aW5nLFxyXG4gIFNoYWRlcml0eU9iamVjdCBhcyBfU2hhZGVyaXR5T2JqZWN0LFxyXG4gIFNoYWRlckV4dGVuc2lvbkJlaGF2aW9yIGFzIF9TaGFkZXJFeHRlbnNpb25CZWhhdmlvcixcclxuICBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyBhcyBfU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMsXHJcbiAgU2hhZGVyUHJlY2lzaW9uT2JqZWN0IGFzIF9TaGFkZXJQcmVjaXNpb25PYmplY3QsXHJcbiAgU2hhZGVyU3RhZ2VTdHIgYXMgX1NoYWRlclN0YWdlU3RyLFxyXG4gIFNoYWRlclByZWNpc2lvblR5cGUgYXMgX1NoYWRlclByZWNpc2lvblR5cGUsXHJcbiAgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSBhcyBfU2hhZGVyQXR0cmlidXRlVmFyVHlwZSxcclxuICBTaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUgYXMgX1NoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSxcclxuICBTaGFkZXJWYXJ5aW5nVmFyVHlwZSBhcyBfU2hhZGVyVmFyeWluZ1ZhclR5cGUsXHJcbiAgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMgYXMgX1NoYWRlclVuaWZvcm1WYXJUeXBlRVMzLFxyXG4gIFNoYWRlclN0cnVjdE1lbWJlck9iamVjdCBhcyBfU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0LFxyXG4gIFNoYWRlclVCT1ZhcmlhYmxlT2JqZWN0IGFzIF9TaGFkZXJVQk9WYXJpYWJsZU9iamVjdCxcclxuICBTaGFkZXJBdHRyaWJ1dGVPYmplY3QgYXMgX1NoYWRlckF0dHJpYnV0ZU9iamVjdCxcclxuICBTaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0IGFzIF9TaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0LFxyXG4gIFNoYWRlckNvbnN0YW50VmFsdWVPYmplY3QgYXMgX1NoYWRlckNvbnN0YW50VmFsdWVPYmplY3QsXHJcbiAgU2hhZGVyRXh0ZW5zaW9uT2JqZWN0IGFzIF9TaGFkZXJFeHRlbnNpb25PYmplY3QsXHJcbiAgU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdCBhcyBfU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdCxcclxuICBTaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0IGFzIF9TaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0LFxyXG4gIFNoYWRlclVuaWZvcm1PYmplY3QgYXMgX1NoYWRlclVuaWZvcm1PYmplY3QsXHJcbiAgU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCBhcyBfU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCxcclxuICBTaGFkZXJWYXJ5aW5nT2JqZWN0IGFzIF9TaGFkZXJWYXJ5aW5nT2JqZWN0LFxyXG4gIFNoYWRlclZlcnNpb24gYXMgX1NoYWRlclZlcnNpb24sXHJcbiAgVGVtcGxhdGVPYmplY3QgYXMgX1RlbXBsYXRlT2JqZWN0LFxyXG4gIFVuaWZvcm1TZW1hbnRpY3MgYXMgX1VuaWZvcm1TZW1hbnRpY3MsXHJcbiAgVmFyVHlwZSBhcyBfVmFyVHlwZSxcclxufSBmcm9tICcuL3R5cGVzL3R5cGUnO1xyXG5cclxuZXhwb3J0IHtcclxuICBTaGFkZXJpdHlPYmplY3RDcmVhdG9yIGFzIF9TaGFkZXJpdHlPYmplY3RDcmVhdG9yLFxyXG4gIFJlZmxlY3Rpb24gYXMgX1JlZmxlY3Rpb24sXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEF0dHJpYnV0ZVNlbWFudGljcyA9IF9BdHRyaWJ1dGVTZW1hbnRpY3M7XHJcbmV4cG9ydCB0eXBlIFJlZmxlY3Rpb25BdHRyaWJ1dGUgPSBfUmVmbGVjdGlvbkF0dHJpYnV0ZTtcclxuZXhwb3J0IHR5cGUgUmVmbGVjdGlvblVuaWZvcm0gPSBfUmVmbGVjdGlvblVuaWZvcm07XHJcbmV4cG9ydCB0eXBlIFJlZmxlY3Rpb25WYXJ5aW5nID0gX1JlZmxlY3Rpb25WYXJ5aW5nO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJpdHlPYmplY3QgPSBfU2hhZGVyaXR5T2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJFeHRlbnNpb25CZWhhdmlvciA9IF9TaGFkZXJFeHRlbnNpb25CZWhhdmlvcjtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgPSBfU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzM7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclByZWNpc2lvbk9iamVjdCA9IF9TaGFkZXJQcmVjaXNpb25PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclN0YWdlU3RyID0gX1NoYWRlclN0YWdlU3RyO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJQcmVjaXNpb25UeXBlID0gX1NoYWRlclByZWNpc2lvblR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgPSBfU2hhZGVyQXR0cmlidXRlVmFyVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlID0gX1NoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmFyeWluZ1ZhclR5cGUgPSBfU2hhZGVyVmFyeWluZ1ZhclR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzID0gX1NoYWRlclVuaWZvcm1WYXJUeXBlRVMzO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3QgPSBfU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVQk9WYXJpYWJsZU9iamVjdCA9IF9TaGFkZXJVQk9WYXJpYWJsZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQXR0cmlidXRlT2JqZWN0ID0gX1NoYWRlckF0dHJpYnV0ZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdCA9IF9TaGFkZXJDb25zdGFudFN0cnVjdFZhbHVlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0ID0gX1NoYWRlckNvbnN0YW50VmFsdWVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckV4dGVuc2lvbk9iamVjdCA9IF9TaGFkZXJFeHRlbnNpb25PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3QgPSBfU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdCA9IF9TaGFkZXJVbmlmb3JtQnVmZmVyT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVbmlmb3JtT2JqZWN0ID0gX1NoYWRlclVuaWZvcm1PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3QgPSBfU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmFyeWluZ09iamVjdCA9IF9TaGFkZXJWYXJ5aW5nT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJWZXJzaW9uID0gX1NoYWRlclZlcnNpb247XHJcbmV4cG9ydCB0eXBlIFRlbXBsYXRlT2JqZWN0ID0gX1RlbXBsYXRlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBVbmlmb3JtU2VtYW50aWNzID0gX1VuaWZvcm1TZW1hbnRpY3M7XHJcbmV4cG9ydCB0eXBlIFZhclR5cGUgPSBfVmFyVHlwZTtcclxuZXhwb3J0IHR5cGUgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciA9IF9TaGFkZXJpdHlPYmplY3RDcmVhdG9yO1xyXG5leHBvcnQgdHlwZSBSZWZsZWN0aW9uID0gX1JlZmxlY3Rpb247XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaGFkZXJpdHlcclxuIiwiaW1wb3J0IHtcblx0QXR0cmlidXRlU2VtYW50aWNzLFxuXHRSZWZsZWN0aW9uQXR0cmlidXRlLFxuXHRSZWZsZWN0aW9uVW5pZm9ybSxcblx0UmVmbGVjdGlvblZhcnlpbmcsXG5cdFNoYWRlclN0YWdlU3RyLFxuXHRVbmlmb3JtU2VtYW50aWNzLFxuXHRWYXJUeXBlLFxufSBmcm9tICcuLi90eXBlcy90eXBlJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGdldHMgdGhlIGF0dHJpYnV0ZSwgdmFyeWluZywgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24gZnJvbSB0aGUgY29kZSBwcm9wZXJ0eSBvZiBhIHNoYWRlcml0eSBvYmplY3QuXG4gKiBUaGUgbWV0aG9kcyBvZiB0aGUgU2hhZGVyaXR5IGluc3RhbmNlIGNyZWF0ZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzLlxuICpcbiAqIEJlZm9yZSBnZXR0aW5nIHRoZSBpbmZvcm1hdGlvbiBvZiB0aGUgYXR0cmlidXRlLCB2YXJ5aW5nLCBhbmQgdW5pZm9ybSwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVmbGVjdGlvbiB7XG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGF0dHJpYnV0ZUFuZFZhcnlpbmdUeXBlUmVnRXhwXG5cdFx0PSAvW1xcdCBdKyhmbG9hdHxpbnR8dmVjMnx2ZWMzfHZlYzR8bWF0MnxtYXQzfG1hdDR8aXZlYzJ8aXZlYzN8aXZlYzQpW1xcdCBdKyhcXHcrKTsvO1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSB1bmlmb3JtVHlwZVJlZ0V4cFxuXHRcdD0gL1tcXHQgXSsoZmxvYXR8aW50fHZlYzJ8dmVjM3x2ZWM0fG1hdDJ8bWF0M3xtYXQ0fGl2ZWMyfGl2ZWMzfGl2ZWM0fHNhbXBsZXIyRHxzYW1wbGVyQ3ViZXxzYW1wbGVyM0QpW1xcdCBdKyhcXHcrKTsvO1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBzZW1hbnRpY1JlZ0V4cCA9IC88LipzZW1hbnRpY1tcXHQgXSo9W1xcdCBdKihcXHcrKS4qPi87XG5cblx0cHJpdmF0ZSBfX2F0dHJpYnV0ZVNlbWFudGljc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdHByaXZhdGUgX191bmlmb3JtU2VtYW50aWNzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblx0cHJpdmF0ZSBfX2F0dHJpYnV0ZXM6IFJlZmxlY3Rpb25BdHRyaWJ1dGVbXSA9IFtdO1xuXHRwcml2YXRlIF9fdmFyeWluZ3M6IFJlZmxlY3Rpb25WYXJ5aW5nW10gPSBbXTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1zOiBSZWZsZWN0aW9uVW5pZm9ybVtdID0gW107XG5cblx0cHJpdmF0ZSByZWFkb25seSBfX3NwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW107XG5cdHByaXZhdGUgcmVhZG9ubHkgX19zaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHI7XG5cblx0Y29uc3RydWN0b3Ioc3BsaXR0ZWRTaGFkZXJpdHlTaGFkZXJDb2RlOiBzdHJpbmdbXSwgc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0dGhpcy5fX3NwbGl0dGVkU2hhZGVyQ29kZSA9IHNwbGl0dGVkU2hhZGVyaXR5U2hhZGVyQ29kZTtcblx0XHR0aGlzLl9fc2hhZGVyU3RhZ2UgPSBzaGFkZXJTdGFnZTtcblx0XHR0aGlzLl9fc2V0RGVmYXVsdEF0dHJpYnV0ZUFuZFVuaWZvcm1TZW1hbnRpY3NNYXAoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFsbCBhdHRyaWJ1dGUgdmFyaWFibGUgaW5mb3JtYXRpb24gaW4gdGhlIHNoYWRlciBjb2RlLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgUmVmbGVjdGlvbkF0dHJpYnV0ZSBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgYXR0cmlidXRlcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXM7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyBhbGwgdmFyeWluZyB2YXJpYWJsZSBpbmZvcm1hdGlvbiBpbiB0aGUgc2hhZGVyIGNvZGUuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBSZWZsZWN0aW9uVmFyeWluZyBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgdmFyeWluZ3MoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX192YXJ5aW5ncztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFsbCB1bmlmb3JtIHZhcmlhYmxlIGluZm9ybWF0aW9uIGluIHRoZSBzaGFkZXIgY29kZS5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIFJlZmxlY3Rpb25Vbmlmb3JtIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCB1bmlmb3JtcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX3VuaWZvcm1zO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgbmFtZXMgb2YgYWxsIGF0dHJpYnV0ZXMgaW5jbHVkZWQgaW4gdGhlIHNoYWRlci5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIHN0cmluZ1xuXHQgKi9cblx0cHVibGljIGdldCBhdHRyaWJ1dGVzTmFtZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7cmV0dXJuIGF0dHJpYnV0ZS5uYW1lfSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBhdHRyaWJ1dGUgc2VtYW50aWMgKGUuZy4gJ1BPU0lUSU9OJykgb2YgYWxsIGF0dHJpYnV0ZXMgaW5jbHVkZWQgaW4gdGhlIHNoYWRlci5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIEF0dHJpYnV0ZVNlbWFudGljcyBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgYXR0cmlidXRlc1NlbWFudGljcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtyZXR1cm4gYXR0cmlidXRlLnNlbWFudGljfSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSB2YXJpYWJsZSB0eXBlIChlLmcuICd2ZWM0Jykgb2YgYWxsIGF0dHJpYnV0ZXMgaW5jbHVkZWQgaW4gdGhlIHNoYWRlci5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIFZhclR5cGUgb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGF0dHJpYnV0ZXNUeXBlcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtyZXR1cm4gYXR0cmlidXRlLnR5cGV9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYW4gYXR0cmlidXRlU2VtYW50aWNzLlxuXHQgKiBUaGUgYXR0cmlidXRlU2VtYW50aWNzIGlzIHVzZWQgaW4gdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWNzXG5cdCAqIChTZWUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBjbGFzcylcblx0ICovXG5cdHB1YmxpYyBhZGRBdHRyaWJ1dGVTZW1hbnRpY3NNYXAobWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+KSB7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcCA9IG5ldyBNYXAoWy4uLnRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAsIC4uLm1hcF0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhIHVuaWZvcm1TZW1hbnRpY3MuXG5cdCAqIFRoZSBhdHRyaWJ1dGVTZW1hbnRpY3MgaXMgdXNlZCBpbiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpY3Ncblx0ICogKFNlZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGNsYXNzKVxuXHQgKi9cblx0cHVibGljIGFkZFVuaWZvcm1TZW1hbnRpY3NNYXAobWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+KSB7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAgPSBuZXcgTWFwKFsuLi50aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcCwgLi4ubWFwXSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGFuIGF0dHJpYnV0ZVNlbWFudGljcy5cblx0ICogVGhlIGF0dHJpYnV0ZVNlbWFudGljcyBpcyB1c2VkIGluIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljc1xuXHQgKiAoU2VlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgY2xhc3MpXG5cdCAqL1xuXHRwdWJsaWMgYWRkQXR0cmlidXRlU2VtYW50aWNzKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoa2V5LCB2YWx1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGEgdW5pZm9ybVNlbWFudGljcy5cblx0ICogVGhlIGF0dHJpYnV0ZVNlbWFudGljcyBpcyB1c2VkIGluIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljc1xuXHQgKiAoU2VlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgY2xhc3MpXG5cdCAqL1xuXHRwdWJsaWMgYWRkVW5pZm9ybVNlbWFudGljcyhrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldChrZXksIHZhbHVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIGF0dHJpYnV0ZVNlbWFudGljc1xuXHQgKi9cblx0cHVibGljIHJlc2V0QXR0cmlidXRlU2VtYW50aWNzKCkge1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdW5pZm9ybVNlbWFudGljc1xuXHQgKi9cblx0cHVibGljIHJlc2V0VW5pZm9ybVNlbWFudGljcygpIHtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdH1cblxuXHQvKipcblx0ICogQW5hbHl6ZSBzaGFkZXIgY29kZSBvZiB0aGUgc2hhZGVyaXR5IGFuZCBnZXQgaW5mb3JtYXRpb24gb2YgYXR0cmlidXRlLCB2YXJ5aW5nIGFuZCB1bmlmb3JtLlxuXHQgKiBUaGUgaW5mb3JtYXRpb24gY2FuIGJlIHJldHJpZXZlZCBmcm9tIHRoZSBnZXQgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqXG5cdCAqIFRoZSBzZW1hbnRpYyBwcm9wZXJ0eSBvZiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZSBpcyBhc3NpZ25lZCB0byB0aGUgdmFsdWUgb2YgdGhlIHNlbWFudGljIGlmXG5cdCAqIGl0IGlzIHNwZWNpZmllZCBpbiB0aGUgYXR0cmlidXRlIGxpbmUgb2YgdGhlIHNoYWRlciBjb2RlLiBJZiBub3QsIHRoZSBBdHRyaWJ1dGVTZW1hbnRpY3NNYXBcblx0ICogaXMgc2VhcmNoZWQgZm9yIG1hdGNoaW5nIHNlbWFudGljcywgb3IgVU5LTk9XTi4gVGhlIHNhbWUgYXBwbGllcyB0byB0aGUgc2VtYW50aWMgcHJvcGVydHkgb2Zcblx0ICogUmVmbGVjdGlvblVuaWZvcm0uXG5cdCAqL1xuXHRwdWJsaWMgcmVmbGVjdCgpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSB0aGlzLl9fc3BsaXR0ZWRTaGFkZXJDb2RlO1xuXHRcdGNvbnN0IHNoYWRlclN0YWdlID0gdGhpcy5fX3NoYWRlclN0YWdlO1xuXG5cdFx0Zm9yIChjb25zdCBzaGFkZXJDb2RlTGluZSBvZiBzcGxpdHRlZFNoYWRlckNvZGUpIHtcblx0XHRcdGNvbnN0IGlzQXR0cmlidXRlTGluZSA9IHRoaXMuX19tYXRjaEF0dHJpYnV0ZShzaGFkZXJDb2RlTGluZSwgc2hhZGVyU3RhZ2UpO1xuXHRcdFx0aWYgKGlzQXR0cmlidXRlTGluZSkge1xuXHRcdFx0XHR0aGlzLl9fYWRkQXR0cmlidXRlKHNoYWRlckNvZGVMaW5lKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzVmFyeWluZ0xpbmUgPSB0aGlzLl9fbWF0Y2hWYXJ5aW5nKHNoYWRlckNvZGVMaW5lLCBzaGFkZXJTdGFnZSk7XG5cdFx0XHRpZiAoaXNWYXJ5aW5nTGluZSkge1xuXHRcdFx0XHR0aGlzLl9fYWRkVmFyeWluZyhzaGFkZXJDb2RlTGluZSwgc2hhZGVyU3RhZ2UpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaXNVbmlmb3JtTGluZSA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKnVuaWZvcm1bXFx0IF0rLyk7XG5cdFx0XHRpZiAoaXNVbmlmb3JtTGluZSkge1xuXHRcdFx0XHR0aGlzLl9fYWRkVW5pZm9ybShzaGFkZXJDb2RlTGluZSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX19zZXREZWZhdWx0QXR0cmlidXRlQW5kVW5pZm9ybVNlbWFudGljc01hcCgpIHtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgncG9zaXRpb24nLCAnUE9TSVRJT04nKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnY29sb3IkJywgJ0NPTE9SXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnY29sb3JfPzAnLCAnQ09MT1JfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0ZXhjb29yZCQnLCAnVEVYQ09PUkRfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0ZXhjb29yZF8/MCcsICdURVhDT09SRF8wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RleGNvb3JkXz8xJywgJ1RFWENPT1JEXzEnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGV4Y29vcmRfPzInLCAnVEVYQ09PUkRfMicpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdub3JtYWwnLCAnTk9STUFMJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RhbmdlbnQnLCAnVEFOR0VOVCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdqb2ludCQnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnYm9uZSQnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnam9pbnRfPzAnLCAnSk9JTlRTXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgnYm9uZV8/MCcsICdKT0lOVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd3ZWlnaHQkJywgJ1dFSUdIVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd3ZWlnaHRfPzAnLCAnV0VJR0hUU18wJyk7XG5cblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ3dvcmxkbWF0cml4JywgJ1dvcmxkTWF0cml4Jyk7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCdub3JtYWxtYXRyaXgnLCAnTm9ybWFsTWF0cml4Jyk7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCd2aWV3bWF0cml4JywgJ1ZpZXdNYXRyaXgnKTtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ3Byb2plY3Rpb25tYXRyaXgnLCAnUHJvamVjdGlvbk1hdHJpeCcpO1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgnbW9kZWx2aWV3bWF0cml4JywgJ01vZGVsVmlld01hdHJpeCcpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX21hdGNoQXR0cmlidXRlKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcsIHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdGlmIChzaGFkZXJTdGFnZSAhPT0gJ3ZlcnRleCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKihhdHRyaWJ1dGV8aW4pW1xcdCBdKy4rOy8pO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2FkZEF0dHJpYnV0ZShzaGFkZXJDb2RlTGluZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgcmVmbGVjdGlvbkF0dHJpYnV0ZTogUmVmbGVjdGlvbkF0dHJpYnV0ZSA9IHtcblx0XHRcdG5hbWU6ICcnLFxuXHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdHNlbWFudGljOiAnVU5LTk9XTidcblx0XHR9O1xuXG5cdFx0Y29uc3QgbWF0Y2hUeXBlID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi5hdHRyaWJ1dGVBbmRWYXJ5aW5nVHlwZVJlZ0V4cCk7XG5cdFx0aWYgKG1hdGNoVHlwZSkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IG1hdGNoVHlwZVsxXTtcblx0XHRcdHJlZmxlY3Rpb25BdHRyaWJ1dGUudHlwZSA9IHR5cGUgYXMgVmFyVHlwZTtcblx0XHRcdGNvbnN0IG5hbWUgPSBtYXRjaFR5cGVbMl07XG5cdFx0XHRyZWZsZWN0aW9uQXR0cmlidXRlLm5hbWUgPSBuYW1lO1xuXG5cdFx0XHRjb25zdCBtYXRjaFNlbWFudGljID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi5zZW1hbnRpY1JlZ0V4cClcblx0XHRcdGlmIChtYXRjaFNlbWFudGljKSB7XG5cdFx0XHRcdHJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWMgPSBtYXRjaFNlbWFudGljWzFdIGFzIEF0dHJpYnV0ZVNlbWFudGljcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiB0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwKSB7XG5cdFx0XHRcdFx0aWYgKG5hbWUubWF0Y2gobmV3IFJlZ0V4cChrZXksICdpJykpKSB7XG5cdFx0XHRcdFx0XHRyZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljID0gdmFsdWUgYXMgQXR0cmlidXRlU2VtYW50aWNzO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLl9fYXR0cmlidXRlcy5wdXNoKHJlZmxlY3Rpb25BdHRyaWJ1dGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX21hdGNoVmFyeWluZyhzaGFkZXJDb2RlTGluZTogc3RyaW5nLCBzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHRpZiAoc2hhZGVyU3RhZ2UgPT09ICd2ZXJ0ZXgnKSB7XG5cdFx0XHRyZXR1cm4gc2hhZGVyQ29kZUxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qKHZhcnlpbmd8b3V0KVtcXHQgXSsuKzsvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHNoYWRlckNvZGVMaW5lLm1hdGNoKC9eKD8hW1xcL10pW1xcdCBdKih2YXJ5aW5nfGluKVtcXHQgXSsuKzsvKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9fYWRkVmFyeWluZyhzaGFkZXJDb2RlTGluZTogc3RyaW5nLCBzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHRjb25zdCByZWZsZWN0aW9uVmFyeWluZzogUmVmbGVjdGlvblZhcnlpbmcgPSB7XG5cdFx0XHRuYW1lOiAnJyxcblx0XHRcdHR5cGU6ICdmbG9hdCcsXG5cdFx0XHRpbm91dDogJ2luJ1xuXHRcdH07XG5cblx0XHRjb25zdCBtYXRjaFR5cGUgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLmF0dHJpYnV0ZUFuZFZhcnlpbmdUeXBlUmVnRXhwKTtcblx0XHRpZiAobWF0Y2hUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gbWF0Y2hUeXBlWzFdO1xuXHRcdFx0cmVmbGVjdGlvblZhcnlpbmcudHlwZSA9IHR5cGUgYXMgVmFyVHlwZTtcblx0XHRcdGNvbnN0IG5hbWUgPSBtYXRjaFR5cGVbMl07XG5cdFx0XHRyZWZsZWN0aW9uVmFyeWluZy5uYW1lID0gbmFtZTtcblx0XHRcdHJlZmxlY3Rpb25WYXJ5aW5nLmlub3V0ID0gKHNoYWRlclN0YWdlID09PSAndmVydGV4JykgPyAnb3V0JyA6ICdpbic7XG5cdFx0fVxuXHRcdHRoaXMuX192YXJ5aW5ncy5wdXNoKHJlZmxlY3Rpb25WYXJ5aW5nKTtcblx0fVxuXG5cdHByaXZhdGUgX19hZGRVbmlmb3JtKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcpIHtcblx0XHRjb25zdCByZWZsZWN0aW9uVW5pZm9ybTogUmVmbGVjdGlvblVuaWZvcm0gPSB7XG5cdFx0XHRuYW1lOiAnJyxcblx0XHRcdHR5cGU6ICdmbG9hdCcsXG5cdFx0XHRzZW1hbnRpYzogJ1VOS05PV04nXG5cdFx0fTtcblxuXHRcdGNvbnN0IG1hdGNoVHlwZSA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24udW5pZm9ybVR5cGVSZWdFeHApO1xuXHRcdGlmIChtYXRjaFR5cGUpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBtYXRjaFR5cGVbMV07XG5cdFx0XHRyZWZsZWN0aW9uVW5pZm9ybS50eXBlID0gdHlwZSBhcyBWYXJUeXBlO1xuXHRcdFx0Y29uc3QgbmFtZSA9IG1hdGNoVHlwZVsyXTtcblx0XHRcdHJlZmxlY3Rpb25Vbmlmb3JtLm5hbWUgPSBuYW1lO1xuXG5cdFx0XHRjb25zdCBtYXRjaFNlbWFudGljcyA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24uc2VtYW50aWNSZWdFeHApXG5cdFx0XHRpZiAobWF0Y2hTZW1hbnRpY3MpIHtcblx0XHRcdFx0cmVmbGVjdGlvblVuaWZvcm0uc2VtYW50aWMgPSBtYXRjaFNlbWFudGljc1sxXSBhcyBVbmlmb3JtU2VtYW50aWNzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwKSB7XG5cdFx0XHRcdFx0aWYgKG5hbWUubWF0Y2gobmV3IFJlZ0V4cChrZXksICdpJykpKSB7XG5cdFx0XHRcdFx0XHRyZWZsZWN0aW9uVW5pZm9ybS5zZW1hbnRpYyA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLl9fdW5pZm9ybXMucHVzaChyZWZsZWN0aW9uVW5pZm9ybSk7XG5cdH1cbn07IiwiaW1wb3J0IHtUZW1wbGF0ZU9iamVjdH0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBlZGl0cyB0aGUgY29kZSBwcm9wZXJ0eSBvZiBhIHNoYWRlcml0eSBvYmplY3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYWRlckVkaXRvciB7XG5cdHN0YXRpYyBfaW5zZXJ0RGVmaW5pdGlvbihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBkZWZpbml0aW9uOiBzdHJpbmcpIHtcblx0XHRjb25zdCBkZWZTdHIgPSBkZWZpbml0aW9uLnJlcGxhY2UoLyNkZWZpbmVbXFx0IF0rLywgJycpO1xuXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnVuc2hpZnQoYCNkZWZpbmUgJHtkZWZTdHJ9YCk7XG5cdH1cblxuXHRzdGF0aWMgX2ZpbGxUZW1wbGF0ZShzaGFkZXJDb2RlOiBzdHJpbmcsIHRlbXBsYXRlT2JqZWN0OiBUZW1wbGF0ZU9iamVjdCkge1xuXHRcdGNvbnN0IHRlbXBsYXRlU3RyaW5nID0gc2hhZGVyQ29kZS5yZXBsYWNlKC9cXC9cXCpbXFx0IF0qc2hhZGVyaXR5OltcXHQgXSooQHtbXFx0IF0qKShcXFMrKShbXFx0IF0qfSlbXFx0IF0qXFwqXFwvL2csICcke3RoaXMuJDJ9Jyk7XG5cblx0XHRjb25zdCByZXN1bHRDb2RlID0gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIGBcIiArIHRlbXBsYXRlU3RyaW5nICsgXCJgO1wiKS5jYWxsKHRlbXBsYXRlT2JqZWN0KTtcblx0XHRyZXR1cm4gcmVzdWx0Q29kZTtcblx0fVxufSIsImltcG9ydCB7U2hhZGVyVmVyc2lvbn0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBjb252ZXJ0cyB0aGUgY29kZSBwcm9wZXJ0eSBvZiBhIHNoYWRlcml0eSBvYmplY3QgdG8gdGhlIHNwZWNpZmllZCBmb3JtYXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYWRlclRyYW5zZm9ybWVyIHtcblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMzIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGVcblx0ICovXG5cdHN0YXRpYyBfdHJhbnNmb3JtVG9HTFNMRVMxKFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0aXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbixcblx0XHRlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuXG5cdCkge1xuXHRcdHRoaXMuX19jb252ZXJ0T3JJbnNlcnRWZXJzaW9uR0xTTEVTMShzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19yZW1vdmVFUzNRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR0aGlzLl9fY29udmVydEluKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0dGhpcy5fX2NvbnZlcnRPdXQoc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR0aGlzLl9fcmVtb3ZlUHJlY2lzaW9uRm9yRVMzKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlRnVuY3Rpb25Ub0VTMShzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlID0gc3BsaXR0ZWRTaGFkZXJDb2RlO1xuXG5cdFx0cmV0dXJuIHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMxIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzMgc2hhZGVyIGNvZGVcblx0ICovXG5cdHN0YXRpYyBfdHJhbnNmb3JtVG9HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9fY29udmVydE9ySW5zZXJ0VmVyc2lvbkdMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydEF0dHJpYnV0ZShzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdHRoaXMuX19jb252ZXJ0VmFyeWluZyhzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZUN1YmUoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmUyRChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZTJEUHJvZChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZTNEKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlM0RQcm9kKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUgPSBzcGxpdHRlZFNoYWRlckNvZGU7XG5cblx0XHRyZXR1cm4gdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBzaGFkZXIgY29kZSB0byBhIHNoYWRlciBjb2RlIG9mIHNwZWNpZmllZCBHTFNMIHZlcnNpb25cblx0ICovXG5cdHN0YXRpYyBfdHJhbnNmb3JtVG8oXG5cdFx0dmVyc2lvbjogU2hhZGVyVmVyc2lvbixcblx0XHRzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLFxuXHRcdGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4sXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHRpZiAodmVyc2lvbi5tYXRjaCgvd2ViZ2wyfGVzMy9pKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RyYW5zZm9ybVRvR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdH0gZWxzZSBpZiAodmVyc2lvbi5tYXRjaCgvd2ViZ2wxfGVzMS9pKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RyYW5zZm9ybVRvR0xTTEVTMShzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdJbnZhbGlkIFZlcnNpb24nKVxuXHRcdFx0cmV0dXJuIHNwbGl0dGVkU2hhZGVyQ29kZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogSWYgdGhlIGZpcnN0IGxpbmUgY29udGFpbnMgdmVyc2lvbiBpbmZvcm1hdGlvbiwgb3ZlcndyaXRlIHRoZSBmaXJzdCBsaW5lIHdpdGggJyN2ZXJzaW9uIDEwMCcuXG5cdCAqIElmIG5vdCwgYWRkICcjdmVyc2lvbiAxMDAnIHRvIHRoZSBmaXJzdCBsaW5lLlxuXHQgKlxuXHQgKiBOb3RlOiBJZiB0aGUgZmlyc3QgbGluZSBpcyBjb21tZW50ZWQgb3V0IGFuZCB0aGUgdmVyc2lvbiBpbmZvcm1hdGlvbiBpcyB3cml0dGVuIGluIHRoZSBzZWNvbmQgb3IgbGF0ZXIgbGluZSxcblx0ICogdGhlIGFwcHJvcHJpYXRlIHZlcnNpb24gaW5mb3JtYXRpb24gd2lsbCBiZSBhZGRlZCB0byB0aGUgZmlyc3QgbGluZSBhbmQgdGhlIHVzZXItZGVmaW5lZCB2ZXJzaW9uIGluZm9ybWF0aW9uXG5cdCAqIGluIHRoZSBzZWNvbmQgb3IgbGF0ZXIgbGluZSB3aWxsIGJlIHJlbW92ZWQuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRPckluc2VydFZlcnNpb25HTFNMRVMxKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSojW1xcdCBdKnZlcnNpb25bXFx0IF0rLiovO1xuXHRcdHRoaXMuX19yZW1vdmVGaXJzdE1hdGNoaW5nTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZyk7XG5cblx0XHRzcGxpdHRlZFNoYWRlckNvZGUudW5zaGlmdCgnI3ZlcnNpb24gMTAwJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogSWYgdGhlIGZpcnN0IGxpbmUgY29udGFpbnMgdmVyc2lvbiBpbmZvcm1hdGlvbiwgb3ZlcndyaXRlIHRoZSBmaXJzdCBsaW5lIHdpdGggJyN2ZXJzaW9uIDMwMCBlcycuXG5cdCAqIElmIG5vdCwgYWRkICcjdmVyc2lvbiAzMDAgZXMnIHRvIHRoZSBmaXJzdCBsaW5lLlxuXHQgKiBJbiBib3RoIGNhc2VzLCAnI2RlZmluZSBHTFNMX0VTMycgd2lsbCBiZSBpbnNlcnRlZCBpbiB0aGUgc2Vjb25kIGxpbmUuXG5cdCAqIFVzZSB0aGUgJyNkZWZpbmUgR0xTTF9FUzMnIGRpcmVjdGl2ZSBpZiB5b3Ugd2FudCB0byB3cml0ZSBhIHNoYWRlciBjb2RlIHRoYXQgd2lsbCBvbmx5IHJ1biBpbiB0aGUgY2FzZSBvZiB3ZWJnbDIuXG5cdCAqXG5cdCAqIE5vdGU6IElmIHRoZSBmaXJzdCBsaW5lIGlzIGNvbW1lbnRlZCBvdXQgYW5kIHRoZSB2ZXJzaW9uIGluZm9ybWF0aW9uIGlzIHdyaXR0ZW4gaW4gdGhlIHNlY29uZCBvciBsYXRlciBsaW5lLFxuXHQgKiB0aGUgYXBwcm9wcmlhdGUgdmVyc2lvbiBpbmZvcm1hdGlvbiB3aWxsIGJlIGFkZGVkIHRvIHRoZSBmaXJzdCBsaW5lIGFuZCB0aGUgdXNlci1kZWZpbmVkIHZlcnNpb24gaW5mb3JtYXRpb25cblx0ICogaW4gdGhlIHNlY29uZCBvciBsYXRlciBsaW5lIHdpbGwgYmUgcmVtb3ZlZC5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydE9ySW5zZXJ0VmVyc2lvbkdMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKiNbXFx0IF0qdmVyc2lvbltcXHQgXSsuKi87XG5cdFx0dGhpcy5fX3JlbW92ZUZpcnN0TWF0Y2hpbmdMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnKTtcblxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZS51bnNoaWZ0KCcjZGVmaW5lIEdMU0xfRVMzJyk7XG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnVuc2hpZnQoJyN2ZXJzaW9uIDMwMCBlcycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICdpbicgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMSBxdWFsaWZpZXIoJ2F0dHJpYnV0ZScgb3IgJ3ZhcnlpbmcnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0SW4oc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKmluW1xcdCBdKygoaGlnaHB8bWVkaXVtcHxsb3dwfClbXFx0IF0qXFx3K1tcXHQgXSpcXHcrW1xcdCBdKjspLztcblxuXHRcdGxldCByZXBsYWNlRnVuYztcblx0XHRpZiAoaXNGcmFnbWVudFNoYWRlcikge1xuXHRcdFx0cmVwbGFjZUZ1bmMgPSBmdW5jdGlvbiAobWF0Y2g6IHN0cmluZywgcDE6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gJ3ZhcnlpbmcgJyArIHAxO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXBsYWNlRnVuYyA9IGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiAnYXR0cmlidXRlICcgKyBwMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsIHJlcGxhY2VGdW5jKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcIm91dFwiIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIG1vZGlmeSB0aGUgc2hhZGVyIGNvZGUuXG5cdCAqIElmIHRoZSBzaGFkZXIgc3RhZ2UgaXMgdmVydGV4LCB0aGUgXCJvdXRcIiBxdWFsaWZpZXJzIHdpbGwgYmUgcmVwbGFjZWQgYnkgXCJ2YXJ5aW5nXCIgcXVhbGlmaWVyLlxuXHQgKiBJZiB0aGUgc2hhZGVyIHN0YWdlIGlzIGZyYWdtZW50IGFuZCB0aGUgc2hhZGVyIGhhcyBcIm91dFwiIHF1YWxpZmllcnMsIHRoZSBcIm91dFwiIHF1YWxpZmllcnMgd2lsbFxuXHQgKiBiZSBkZWxldGVkIGFuZCB0aGUgdmFyaWFibGUgaXMgdXNlZCB0byBhc3NpZ24gYSB2YWx1ZSB0byBnbF9GcmFnQ29sb3IuXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRPdXQoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbiwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGlmIChpc0ZyYWdtZW50U2hhZGVyKSB7XG5cdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSB0aGlzLl9fcmVtb3ZlT3V0UXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRpZiAodmFyaWFibGVOYW1lID09IG51bGwpIHtcblx0XHRcdFx0Ly8gbm8gb3V0IHF1YWxpZmllclxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX19hZGRHTEZyYWdDb2xvcih2YXJpYWJsZU5hbWUsIHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKm91dFtcXHQgXSsoKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKlxcdytbXFx0IF0qXFx3K1tcXHQgXSo7KS87XG5cdFx0XHRjb25zdCByZXBsYWNlRnVuYyA9IGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiAndmFyeWluZyAnICsgcDE7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsIHJlcGxhY2VGdW5jKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVGhpcyBtZXRob2QgaXMgYSBwYXJ0IG9mIF9fY29udmVydE91dCBtZXRob2QuXG5cdCAqIFRoaXMgbWV0aG9kIGRlbGV0ZXMgdGhlIFwib3V0XCIgcXVhbGlmaWVycyBhbmQgYWRkcyB0aGUgbGluZSBmb3IgYXNzaWduaW5nIHRvIGdsX0ZyYWdDb2xvci5cblx0ICogSWYgdGhlIHNoYWRlciBkb2VzIG5vdCBoYXZlIHRoZSBcIm91dFwiIHF1YWxpZmllcnMsIHRoaXMgbWV0aG9kIGRvZXMgbm90aGluZy5cblx0ICovXG5cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVPdXRRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKm91dFtcXHQgXSsoKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKlxcdytbXFx0IF0qKFxcdyspW1xcdCBdKjspLztcblxuXHRcdGxldCB2YXJpYWJsZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgbWF0Y2ggPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ubWF0Y2gocmVnKTtcblx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBtYXRjaFsxXTtcblx0XHRcdFx0dmFyaWFibGVOYW1lID0gbWF0Y2hbM107XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB2YXJpYWJsZU5hbWU7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX2FkZEdMRnJhZ0NvbG9yKHZhcmlhYmxlTmFtZTogc3RyaW5nLCBzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgY2xvc2VCcmFja2V0UmVnID0gLyguKilcXH1bXFxuXFx0IF0qJC87XG5cdFx0Y29uc3QgcmV0dXJuUmVnID0gL1tcXG5cXHQgXSpyZXR1cm5bXFxuXFx0IF0qOy87XG5cdFx0Y29uc3QgbWFpbkZ1bmNTdGFydFJlZyA9IC8oXnxeKD8hW1xcL10pW1xcdFxcbiBdKyl2b2lkW1xcdFxcbiBdK21haW4oW1xcdFxcbiBdfFxcKHwkKS87XG5cdFx0Y29uc3QgZnJhZ0NvbG9yQ29kZSA9IGAgIGdsX0ZyYWdDb2xvciA9ICR7dmFyaWFibGVOYW1lfTtgO1xuXG5cdFx0bGV0IHNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSA9IGZhbHNlO1xuXHRcdGZvciAobGV0IGkgPSBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cdFx0XHRpZiAoIXNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSAmJiBsaW5lLm1hdGNoKGNsb3NlQnJhY2tldFJlZykpIHtcblx0XHRcdFx0Ly8gYWRkIGdsX0ZyYWdDb2xvciB0byBsYXN0IGxpbmUgb2YgbWFpbiBmdW5jdGlvblxuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBsaW5lLnJlcGxhY2UoY2xvc2VCcmFja2V0UmVnLCBgJDFcXG4ke2ZyYWdDb2xvckNvZGV9XFxufVxcbmApO1xuXHRcdFx0XHRzZXRHbEZyYWdDb2xvckluTGFzdExpbmUgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobGluZS5tYXRjaChyZXR1cm5SZWcpKSB7XG5cdFx0XHRcdC8vIGFkZCBnbF9GcmFnQ29sb3IganVzdCBiZWZvcmUgcmV0dXJuXG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZS5zcGxpY2UoaSwgMCwgZnJhZ0NvbG9yQ29kZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChsaW5lLm1hdGNoKG1haW5GdW5jU3RhcnRSZWcpKSB7XG5cdFx0XHRcdC8vIGFkZCBnbF9GcmFnQ29sb3Igb25seSBpbiB0aGUgbWFpbiBmdW5jdGlvblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSkge1xuXHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fcmVtb3ZlT3V0UXVhbGlmaWVyOiBOb3QgZm91bmQgdGhlIGNsb3NpbmcgYnJhY2tldHMgZm9yIHRoZSBtYWluIGZ1bmN0aW9uJztcblx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGgsIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIHF1YWxpZmllciBmb3IgZXMzIG9ubHkgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXRcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlRVMzUXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9fcmVtb3ZlVmFyeWluZ1F1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdHRoaXMuX19yZW1vdmVMYXlvdXQoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcImZsYXRcIiBhbmQgXCJzbW9vdGhcIiBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXRcblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlVmFyeWluZ1F1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qKGZsYXR8c21vb3RoKVtcXHQgXSooKGlufG91dClbXFx0IF0rLiopLztcblx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19yZW1vdmVWYXJ5aW5nUXVhbGlmaWVyOiBnbHNsIGVzMSBkb2VzIG5vdCBzdXBwb3J0IGZsYXQgcXVhbGlmaWVyJztcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ucmVwbGFjZShyZWcsIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nLCBwMjogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGlmIChwMSA9PT0gJ2ZsYXQnKSB7XG5cdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSArIDEsIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwMjtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcImxheW91dFwiIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlbW92ZSBpdFxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVMYXlvdXQoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKmxheW91dFtcXHQgXSpcXChbXFx0IF0qbG9jYXRpb25bXFx0IF0qXFw9W1xcdCBdKlxcZFtcXHQgXSpcXClbXFx0IF0rL2c7XG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgXCJwcmVjaXNpb25cIiBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZW1vdmUgaXQgaWYgdGhlIFwicHJlY2lzaW9uXCIgcXVhbGlmaWVyIGlzIHZhbGlkIGZvciBvbmx5IEdMU0wgRVMzXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZVByZWNpc2lvbkZvckVTMyhzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qcHJlY2lzaW9uW1xcdCBdKyhoaWdocHxtZWRpdW1wfGxvd3ApW1xcdCBdKyhcXHcrKVtcXHQgXSo7LztcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBtYXRjaCA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5tYXRjaChyZWcpO1xuXHRcdFx0aWYgKG1hdGNoICE9IG51bGwpIHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSAnaW50JyB8fFxuXHRcdFx0XHRcdG1hdGNoWzJdID09PSAnZmxvYXQnIHx8XG5cdFx0XHRcdFx0bWF0Y2hbMl0gPT09ICdzYW1wbGVyMkQnIHx8XG5cdFx0XHRcdFx0bWF0Y2hbMl0gPT09ICdzYW1wbGVyQ3ViZSdcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Ly8gdGhlc2UgcHJlY2lzaW9ucyBhcmUgc3VwcG9ydGVkIGluIGVzMVxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZS5zcGxpY2UoaS0tLCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcInRleHR1cmVcIiBhbmQgXCJ0ZXh0dXJlUHJvalwiIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kXG5cdCAqIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzEgbWV0aG9kKCd0ZXh0dXJlMkQnLCAndGV4dHVyZTJEJywgYW5kIHNvIG9uKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzEoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbiwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnVGV4dHVyZVByb2ogPSBuZXcgUmVnRXhwKGAoJHtzYmx9Kyl0ZXh0dXJlUHJvaihMb2R8KSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVnVGV4dHVyZSA9IG5ldyBSZWdFeHAoYCgke3NibH0rKXRleHR1cmUoTG9kfCkoJHtzYmx9KylgLCAnZycpO1xuXG5cdFx0bGV0IGFyZ3VtZW50U2FtcGxlck1hcDogTWFwPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcblx0XHRjb25zdCB1bmlmb3JtU2FtcGxlck1hcCA9IHRoaXMuX19jcmVhdGVVbmlmb3JtU2FtcGxlck1hcChzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXG5cdFx0XHRjb25zdCBtYXRjaFRleHR1cmVQcm9qID0gbGluZS5tYXRjaCgvdGV4dHVyZVByb2ooTG9kfClbXFx0IF0qXFwoW1xcdCBdKihcXHcrKSwvKTtcblx0XHRcdGlmIChtYXRjaFRleHR1cmVQcm9qKSB7XG5cdFx0XHRcdGFyZ3VtZW50U2FtcGxlck1hcCA9IGFyZ3VtZW50U2FtcGxlck1hcCA/PyB0aGlzLl9fY3JlYXRlQXJndW1lbnRTYW1wbGVyTWFwKFxuXHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZSxcblx0XHRcdFx0XHRpLFxuXHRcdFx0XHRcdGVtYmVkRXJyb3JzSW5PdXRwdXRcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRjb25zdCBpc0xvZE1ldGhvZCA9IG1hdGNoVGV4dHVyZVByb2pbMV0gPT09ICdMb2QnO1xuXHRcdFx0XHRjb25zdCBleHRlbnNpb25TdHIgPSBpc0ZyYWdtZW50U2hhZGVyICYmIGlzTG9kTWV0aG9kID8gYEVYVGAgOiBgYDtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gbWF0Y2hUZXh0dXJlUHJvalsyXTtcblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBhcmd1bWVudFNhbXBsZXJNYXA/LmdldCh2YXJpYWJsZU5hbWUpID8/IHVuaWZvcm1TYW1wbGVyTWFwLmdldCh2YXJpYWJsZU5hbWUpO1xuXHRcdFx0XHRpZiAoc2FtcGxlclR5cGUgIT0gbnVsbCkge1xuXHRcdFx0XHRcdGlmIChzYW1wbGVyVHlwZSA9PT0gJ3NhbXBsZXIyRCcpIHtcblx0XHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5yZXBsYWNlKHJlZ1RleHR1cmVQcm9qLCBgJDF0ZXh0dXJlMkRQcm9qJDIke2V4dGVuc2lvblN0cn0kM2ApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzE6IGRvIG5vdCBzdXBwb3J0ICcgKyBzYW1wbGVyVHlwZSArICcgdHlwZSc7XG5cdFx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbWF0Y2hUZXh0dXJlID0gbGluZS5tYXRjaCgvdGV4dHVyZShMb2R8KVtcXHQgXSpcXChbXFx0IF0qKFxcdyspLC8pO1xuXHRcdFx0aWYgKG1hdGNoVGV4dHVyZSkge1xuXHRcdFx0XHRhcmd1bWVudFNhbXBsZXJNYXAgPSBhcmd1bWVudFNhbXBsZXJNYXAgPz8gdGhpcy5fX2NyZWF0ZUFyZ3VtZW50U2FtcGxlck1hcChcblx0XHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUsXG5cdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRlbWJlZEVycm9yc0luT3V0cHV0XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29uc3QgaXNMb2RNZXRob2QgPSBtYXRjaFRleHR1cmVbMV0gPT09ICdMb2QnO1xuXHRcdFx0XHRjb25zdCBleHRlbnNpb25TdHIgPSBpc0ZyYWdtZW50U2hhZGVyICYmIGlzTG9kTWV0aG9kID8gYEVYVGAgOiBgYDtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gbWF0Y2hUZXh0dXJlWzJdO1xuXHRcdFx0XHRjb25zdCBzYW1wbGVyVHlwZSA9IGFyZ3VtZW50U2FtcGxlck1hcD8uZ2V0KHZhcmlhYmxlTmFtZSkgPz8gdW5pZm9ybVNhbXBsZXJNYXAuZ2V0KHZhcmlhYmxlTmFtZSk7XG5cdFx0XHRcdGlmIChzYW1wbGVyVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0bGV0IHRleHR1cmVGdW5jOiBzdHJpbmc7XG5cdFx0XHRcdFx0aWYgKHNhbXBsZXJUeXBlID09PSAnc2FtcGxlcjJEJykge1xuXHRcdFx0XHRcdFx0dGV4dHVyZUZ1bmMgPSAndGV4dHVyZTJEJztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHNhbXBsZXJUeXBlID09PSAnc2FtcGxlckN1YmUnKSB7XG5cdFx0XHRcdFx0XHR0ZXh0dXJlRnVuYyA9ICd0ZXh0dXJlQ3ViZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRleHR1cmVGdW5jID0gJyc7XG5cdFx0XHRcdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19jb252ZXJ0VGV4dHVyZUZ1bmN0aW9uVG9FUzE6IGRvIG5vdCBzdXBwb3J0ICcgKyBzYW1wbGVyVHlwZSArICcgdHlwZSc7XG5cdFx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0ZXh0dXJlRnVuYyAhPT0gJycpIHtcblx0XHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5yZXBsYWNlKHJlZ1RleHR1cmUsIGAkMSR7dGV4dHVyZUZ1bmN9JDIke2V4dGVuc2lvblN0cn0kM2ApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaXNCbG9ja0VuZCA9ICEhbGluZS5tYXRjaCgvXFx9Lyk7XG5cdFx0XHRpZiAoaXNCbG9ja0VuZCkge1xuXHRcdFx0XHRhcmd1bWVudFNhbXBsZXJNYXAgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRoaXMgbWV0aG9kIGZpbmRzIHVuaWZvcm0gZGVjbGFyYXRpb25zIG9mIHNhbXBsZXIgdHlwZXMgaW4gdGhlIHNoYWRlciBhbmRcblx0ICogY3JlYXRlcyBhIG1hcCB3aXRoIHZhcmlhYmxlIG5hbWVzIGFzIGtleXMgYW5kIHR5cGVzIGFzIHZhbHVlcy5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY3JlYXRlVW5pZm9ybVNhbXBsZXJNYXAoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdGNvbnN0IHVuaWZvcm1TYW1wbGVyTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cdFx0XHRjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qdW5pZm9ybSpbXFx0IF0qKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcdCBdKihzYW1wbGVyXFx3KylbXFx0IF0rKFxcdyspLyk7XG5cdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBtYXRjaFsyXTtcblx0XHRcdFx0Y29uc3QgbmFtZSA9IG1hdGNoWzNdO1xuXHRcdFx0XHRpZiAodW5pZm9ybVNhbXBsZXJNYXAuZ2V0KG5hbWUpKSB7XG5cdFx0XHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fY3JlYXRlVW5pZm9ybVNhbXBsZXJNYXA6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lJztcblx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpLCBlcnJvck1lc3NhZ2UsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHVuaWZvcm1TYW1wbGVyTWFwLnNldChuYW1lLCBzYW1wbGVyVHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB1bmlmb3JtU2FtcGxlck1hcDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUaGlzIG1ldGhvZCBmaW5kcyBzYW1wbGVyIHR5cGVzIGZyb20gdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cyBhbmRcblx0ICogY3JlYXRlcyBhIG1hcCB3aXRoIHZhcmlhYmxlIG5hbWVzIGFzIGtleXMgYW5kIHR5cGVzIGFzIHZhbHVlcy5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY3JlYXRlQXJndW1lbnRTYW1wbGVyTWFwKFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0bGluZUluZGV4OiBudW1iZXIsXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHRjb25zdCBhcmd1bWVudFNhbXBsZXJNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cblx0XHRmb3IgKGxldCBpID0gbGluZUluZGV4OyBpID49IDA7IGktLSkge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblxuXHRcdFx0Y29uc3QgaXNCbG9ja1N0YXJ0TGluZSA9ICEhbGluZS5tYXRjaCgvXFx7Lyk7XG5cdFx0XHRpZiAoIWlzQmxvY2tTdGFydExpbmUpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGJyYWNrZXRTZWN0aW9uQ29kZSA9IHRoaXMuX19nZXRCcmFja2V0U2VjdGlvbihzcGxpdHRlZFNoYWRlckNvZGUsIGkpO1xuXG5cdFx0XHRjb25zdCBpbm5lckJyYWNrZXRTZWN0aW9uQ29kZSA9IGJyYWNrZXRTZWN0aW9uQ29kZS5tYXRjaCgvLipcXCgoLiopXFwpLyk/LlsxXTtcblx0XHRcdGlmIChpbm5lckJyYWNrZXRTZWN0aW9uQ29kZSA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdmFyaWFibGVDYW5kaWRhdGVzID0gaW5uZXJCcmFja2V0U2VjdGlvbkNvZGUuc3BsaXQoJywnKTtcblx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlRGVmaW5pdGlvblJlZyA9IC9bXFxuXFx0IF0qKGhpZ2hwfG1lZGl1bXB8bG93cHwpW1xcblxcdCBdKihzYW1wbGVyXFx3KylbXFxuXFx0IF0qKFxcdyspW1xcblxcdCBdKi87XG5cblx0XHRcdGNvbnN0IGlzRnVuY3Rpb25CcmFja2V0ID0gISEodmFyaWFibGVDYW5kaWRhdGVzWzBdLm1hdGNoKHNhbXBsZXJUeXBlRGVmaW5pdGlvblJlZykgPz8gdmFyaWFibGVDYW5kaWRhdGVzWzBdLm1hdGNoKC9eW1xcblxcdCBdKiQvKSk7XG5cdFx0XHRpZiAoIWlzRnVuY3Rpb25CcmFja2V0KSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGNvbnN0IHZhcmlhYmxlQ2FuZGlkYXRlIG9mIHZhcmlhYmxlQ2FuZGlkYXRlcykge1xuXHRcdFx0XHRjb25zdCBzYW1wbGVyVmFyaWFibGVNYXRjaCA9IHZhcmlhYmxlQ2FuZGlkYXRlLm1hdGNoKHNhbXBsZXJUeXBlRGVmaW5pdGlvblJlZyk7XG5cdFx0XHRcdGlmIChzYW1wbGVyVmFyaWFibGVNYXRjaCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3Qgc2FtcGxlclR5cGUgPSBzYW1wbGVyVmFyaWFibGVNYXRjaFsyXTtcblx0XHRcdFx0Y29uc3QgbmFtZSA9IHNhbXBsZXJWYXJpYWJsZU1hdGNoWzNdO1xuXHRcdFx0XHRpZiAoYXJndW1lbnRTYW1wbGVyTWFwLmdldChuYW1lKSkge1xuXHRcdFx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX2NyZWF0ZUFyZ3VtZW50U2FtcGxlck1hcDogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUnO1xuXHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGksIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YXJndW1lbnRTYW1wbGVyTWFwLnNldChuYW1lLCBzYW1wbGVyVHlwZSk7XG5cdFx0XHR9XG5cblx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcmd1bWVudFNhbXBsZXJNYXA7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgcGFydCBlbmNsb3NlZCBpbiBicmFja2V0cyg9ICcoKScpLlxuXHQgKiBGb3IgZXhhbXBsZSwgeW91IGNhbiBnZXQgbGluZXMgdGhhdCBjb250YWluIGZ1bmN0aW9uIGFyZ3VtZW50cywgY29uZGl0aW9uYWwgZXhwcmVzc2lvbnMgZm9yIGlmIHN0YXRlbWVudHMsIGV0Yy5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fZ2V0QnJhY2tldFNlY3Rpb24oc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgYnJhY2tldEVuZEluZGV4OiBudW1iZXIpIHtcblx0XHRsZXQgYnJhY2tldFN0YXJ0SW5kZXggPSAwO1xuXHRcdGZvciAobGV0IGogPSBicmFja2V0RW5kSW5kZXg7IGogPj0gMDsgai0tKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2pdO1xuXHRcdFx0Y29uc3QgaXNCcmFja2V0U3RhcnRNYXRjaCA9ICEhbGluZS5tYXRjaCgvXFwoLyk7XG5cdFx0XHRpZiAoaXNCcmFja2V0U3RhcnRNYXRjaCkge1xuXHRcdFx0XHRicmFja2V0U3RhcnRJbmRleCA9IGo7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBjb250YWluQnJhY2tldENvZGUgPSAnJztcblx0XHRmb3IgKGxldCBqID0gYnJhY2tldFN0YXJ0SW5kZXg7IGogPD0gYnJhY2tldEVuZEluZGV4OyBqKyspIHtcblx0XHRcdGNvbnRhaW5CcmFja2V0Q29kZSArPSBzcGxpdHRlZFNoYWRlckNvZGVbal07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbnRhaW5CcmFja2V0Q29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAnYXR0cmlidXRlJyBxdWFsaWZpZXIgaW4gdGhlIHZlcnRleCBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBxdWFsaWZpZXIoJ2luJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydEF0dHJpYnV0ZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuKSB7XG5cdFx0aWYgKGlzRnJhZ21lbnRTaGFkZXIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSphdHRyaWJ1dGVbXFx0IF0rL2c7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICdpbiAnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCByZXBsYWNlU3RyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndmFyeWluZycgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBxdWFsaWZpZXIoJ2luJyBvciAnb3V0Jylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFZhcnlpbmcoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbikge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKnZhcnlpbmdbXFx0IF0rL2c7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9IGlzRnJhZ21lbnRTaGFkZXIgPyAnaW4gJyA6ICdvdXQgJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgcmVwbGFjZVN0cik7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmVDdWJlJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZScpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlQ3ViZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZUN1YmUpKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmUnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlMkQnIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmUyRChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZTJEKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZTJEUHJvaicgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmVQcm9qJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmUyRFByb2Qoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmUyRFByb2opKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmVQcm9qJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZTNEJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZScpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlM0Qoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmUzRCkoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZSc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmUzRFByb2onIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlUHJvaicpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlM0RQcm9kKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlM0RQcm9qKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlUHJvaic7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX3JlZ1N5bWJvbHMoKSB7XG5cdFx0cmV0dXJuIGBbIVwiIyQlJicoKVxcKlxcK1xcLVxcLixcXC86Ozw9Pj9AXFxbXFxcXFxcXV5gICsgJ2B7fH1+XFx0XFxuIF0nO1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCByZWc6IFJlZ0V4cCwgcmVwbGFjZW1lbnQ6IGFueSkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzcGxpdHRlZFNoYWRlckNvZGVbaV0gPSBzcGxpdHRlZFNoYWRlckNvZGVbaV0ucmVwbGFjZShyZWcsIHJlcGxhY2VtZW50KTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZUZpcnN0TWF0Y2hpbmdMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIHJlZzogUmVnRXhwKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChzcGxpdHRlZFNoYWRlckNvZGVbaV0ubWF0Y2gocmVnKSkge1xuXHRcdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX291dEVycm9yKFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0bGluZUluZGV4OiBudW1iZXIsXG5cdFx0ZXJyb3JNZXNzYWdlOiBzdHJpbmcsXG5cdFx0ZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhblxuXHQpIHtcblx0XHRpZiAoZW1iZWRFcnJvcnNJbk91dHB1dCkge1xuXHRcdFx0Y29uc3Qgc2hhZGVyT3V0cHV0TWVzc2FnZSA9IGAvLyBsaW5lICR7bGluZUluZGV4fTogJHtlcnJvck1lc3NhZ2V9XFxuYDtcblx0XHRcdGNvbnN0IGNsb3NlQnJhY2tldFJlZyA9IC8oLiopXFx9W1xcblxcdCBdKiQvO1xuXHRcdFx0Zm9yIChsZXQgaSA9IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXHRcdFx0XHRpZiAobGluZS5tYXRjaChjbG9zZUJyYWNrZXRSZWcpKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc3BsaXR0ZWRTaGFkZXJDb2RlW2ldID09PSBzaGFkZXJPdXRwdXRNZXNzYWdlKSB7XG5cdFx0XHRcdFx0Ly8gYXZvaWQgZHVwbGljYXRlIGVycm9yIG1lc3NhZ2Vcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y29uc29sZS5lcnJvcihlcnJvck1lc3NhZ2UpO1xuXHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnB1c2goc2hhZGVyT3V0cHV0TWVzc2FnZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO1xuXHRcdH1cblx0fVxufVxuIiwiaW1wb3J0IFJlZmxlY3Rpb24gZnJvbSAnLi9SZWZsZWN0aW9uJztcbmltcG9ydCB7U2hhZGVyaXR5T2JqZWN0LCBTaGFkZXJTdGFnZVN0ciwgU2hhZGVyVmVyc2lvbiwgVGVtcGxhdGVPYmplY3R9IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuaW1wb3J0IFNoYWRlclRyYW5zZm9ybWVyIGZyb20gJy4vU2hhZGVyVHJhbnNmb3JtZXInO1xuaW1wb3J0IFNoYWRlckVkaXRvciBmcm9tICcuL1NoYWRlckVkaXRvcic7XG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xuaW1wb3J0IFNoYWRlcml0eU9iamVjdENyZWF0b3IgZnJvbSAnLi9TaGFkZXJpdHlPYmplY3RDcmVhdG9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhZGVyaXR5IHtcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHNoYWRlciB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0LyoqXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMzIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGVcblx0ICogQHBhcmFtIG9iaiBTaGFkZXJpdHkgb2JqZWN0IHRvIHRyYW5zbGF0ZSB0byBnbHNsIGVzMVxuXHQgKiBAcGFyYW0gZW1iZWRFcnJvcnNJbk91dHB1dCBJZiB0cnVlLCB3aGVuIHRoZXJlIGlzIGFuIGVycm9yIGluIHRoZSBjb252ZXJzaW9uLFxuXHQgKiAgICB0aGUgZXJyb3IgYW5kIHRoZSBudW1iZXIgb2YgbGluZXMgYXJlIG91dHB1dCBhdCB0aGUgYm90dG9tIG9mIHRoZSByZXR1cm5cblx0ICogICAgdmFsdWUgU2hhZGVyaXR5T2JqZWN0LmNvZGUuIElmIGZhbHNlLCB0aHJvdyBhbiBlcnJvci5cblx0ICogQHJldHVybnMgU2hhZGVyaXR5T2JqZWN0IHdob3NlIGNvZGUgcHJvcGVydHkgaXMgdGhlIHNoYWRlciBjb2RlIGZvciBHTFNMIEVTMVxuXHQgKi9cblx0cHVibGljIHN0YXRpYyB0cmFuc2Zvcm1Ub0dMU0xFUzEob2JqOiBTaGFkZXJpdHlPYmplY3QsIGVtYmVkRXJyb3JzSW5PdXRwdXQgPSBmYWxzZSkge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGVcblx0XHRcdD0gU2hhZGVyVHJhbnNmb3JtZXIuX3RyYW5zZm9ybVRvR0xTTEVTMShcblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLFxuXHRcdFx0XHRvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHRcdFx0ZW1iZWRFcnJvcnNJbk91dHB1dFxuXHRcdFx0KTtcblx0XHRjb25zdCByZXN1bHRDb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZSh0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IHJlc3VsdENvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH1cblxuXHQvKipcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGUgdG8gYSBHTFNMIEVTMyBzaGFkZXIgY29kZVxuXHQgKi9cblx0cHVibGljIHN0YXRpYyB0cmFuc2Zvcm1Ub0dMU0xFUzMob2JqOiBTaGFkZXJpdHlPYmplY3QpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlXG5cdFx0XHQ9IFNoYWRlclRyYW5zZm9ybWVyLl90cmFuc2Zvcm1Ub0dMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlLCBvYmouaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUodHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0Y29uc3QgcmVzdWx0T2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiByZXN1bHRDb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gcmVzdWx0T2JqO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgc2hhZGVyIGNvZGUgdG8gYSBzaGFkZXIgY29kZSBvZiBzcGVjaWZpZWQgR0xTTCB2ZXJzaW9uXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHRyYW5zZm9ybVRvKHZlcnNpb246IFNoYWRlclZlcnNpb24sIG9iajogU2hhZGVyaXR5T2JqZWN0LCBlbWJlZEVycm9yc0luT3V0cHV0ID0gZmFsc2UpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlXG5cdFx0XHQ9IFNoYWRlclRyYW5zZm9ybWVyLl90cmFuc2Zvcm1Ubyhcblx0XHRcdFx0dmVyc2lvbixcblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLFxuXHRcdFx0XHRvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHRcdFx0ZW1iZWRFcnJvcnNJbk91dHB1dFxuXHRcdFx0KTtcblx0XHRjb25zdCByZXN1bHRDb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZSh0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRjb25zdCByZXN1bHRPYmo6IFNoYWRlcml0eU9iamVjdCA9IHtcblx0XHRcdGNvZGU6IHJlc3VsdENvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gc2hhZGVyaXR5IG9iamVjdCBjcmVhdGlvbiBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBpbnN0YW5jZSB0byBjcmVhdGUgc2hhZGVyaXR5IG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgY3JlYXRlU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcihzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpOiBTaGFkZXJpdHlPYmplY3RDcmVhdG9yIHtcblx0XHRyZXR1cm4gbmV3IFNoYWRlcml0eU9iamVjdENyZWF0b3Ioc2hhZGVyU3RhZ2UpO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHNoYWRlciBlZGl0IGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcblx0ICogRmluZCB0aGUgZm9sbG93aW5nIHRlbXBsYXRlIHBhdHRlcm4gaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGtleSB0byB2YWx1ZVxuXHQgKiBAcGFyYW0gdGVtcGxhdGVPYmplY3QgQW4gb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgc3RyaW5nIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIHJlcGxhY2VtZW50XG5cdCAqIFRoZSBrZXkgY2FuIGJlIGEgc3RyaW5nIG9yIGFuIG9iamVjdC4gSWYgYW4gb2JqZWN0IGlzIHVzZWQgYXMgdGhlIGtleSxcblx0ICogdGhlIGtleSBpbiB0aGUgcGF0dGVybiBvZiBzaGFkZXJDb2RlIG11c3QgYWxzbyBtYXRjaCB0aGUgb2JqZWN0LlxuXHQgKiBGb3IgZXhhbXBsZSwgaWYgdGVtcGxhdGVPYmplY3QgaXNcblx0XHR7XG5cdFx0XHRzYW1wbGUge1xuXHRcdFx0XHRzYW1wbGVBOiAwXG5cdFx0XHR9XG5cdFx0fVxuXHQgKiB0aGVuIHRoZSBrZXkgaW4gYSBzaGFkZXIgY29kZSBpcyBzYW1wbGUuc2FtcGxlQS5cblx0ICovXG5cdC8vIFRoZSB0ZW1wbGF0ZSBwYXR0ZXJuIGlzXHQvKiBzaGFkZXJpdHk6IEB7a2V5fSAqL1xuXHRwdWJsaWMgc3RhdGljIGZpbGxUZW1wbGF0ZShvYmo6IFNoYWRlcml0eU9iamVjdCwgYXJnOiBUZW1wbGF0ZU9iamVjdCkge1xuXHRcdGNvbnN0IGNvcHkgPSB0aGlzLl9fY29weVNoYWRlcml0eU9iamVjdChvYmopO1xuXG5cdFx0Y29weS5jb2RlID0gU2hhZGVyRWRpdG9yLl9maWxsVGVtcGxhdGUoY29weS5jb2RlLCBhcmcpO1xuXG5cdFx0cmV0dXJuIGNvcHk7XG5cdH1cblxuXHQvKipcblx0ICogSW5zZXJ0IGRlZmluZSBkaXJlY3RpdmVcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgaW5zZXJ0RGVmaW5pdGlvbihvYmo6IFNoYWRlcml0eU9iamVjdCwgZGVmaW5pdGlvbjogc3RyaW5nKSB7XG5cdFx0Y29uc3QgY29weSA9IHRoaXMuX19jb3B5U2hhZGVyaXR5T2JqZWN0KG9iaik7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRTaGFkZXJFZGl0b3IuX2luc2VydERlZmluaXRpb24oc3BsaXR0ZWRTaGFkZXJDb2RlLCBkZWZpbml0aW9uKTtcblx0XHRjb3B5LmNvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cblx0XHRyZXR1cm4gY29weTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyByZWZsZWN0aW9uIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHQvKipcblx0ICogQ3JlYXRlIGFuIGluc3RhbmNlIHRvIGdldCB0aGUgYXR0cmlidXRlLCB2YXJ5aW5nLCBhbmQgdW5pZm9ybSBpbmZvcm1hdGlvbiBmcm9tIGEgc2hhZGVyIGNvZGUgb2YgdGhlIHNoYWRlcml0eS5cblx0ICogVG8gZ2V0IHRoZXNlIGluZm9ybWF0aW9uLCB5b3UgbmVlZCB0byBjYWxsIHJlZmxlY3Rpb24ucmVmbGVjdCBtZXRob2QuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGNyZWF0ZVJlZmxlY3Rpb25PYmplY3Qob2JqOiBTaGFkZXJpdHlPYmplY3QpOiBSZWZsZWN0aW9uIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHJlZmxlY3Rpb24gPSBuZXcgUmVmbGVjdGlvbihzcGxpdHRlZFNoYWRlckNvZGUsIG9iai5zaGFkZXJTdGFnZSk7XG5cdFx0cmV0dXJuIHJlZmxlY3Rpb247XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gcHJpdmF0ZSBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHJpdmF0ZSBzdGF0aWMgX19jb3B5U2hhZGVyaXR5T2JqZWN0KG9iajogU2hhZGVyaXR5T2JqZWN0KSB7XG5cdFx0Y29uc3QgY29waWVkT2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiBvYmouY29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9XG5cblx0XHRyZXR1cm4gY29waWVkT2JqO1xuXHR9XG59XG4iLCJpbXBvcnQge1xuXHRTaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0LFxuXHRTaGFkZXJFeHRlbnNpb25CZWhhdmlvcixcblx0U2hhZGVyRXh0ZW5zaW9uT2JqZWN0LFxuXHRTaGFkZXJpdHlPYmplY3QsXG5cdFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzLFxuXHRTaGFkZXJQcmVjaXNpb25PYmplY3QsXG5cdFNoYWRlclByZWNpc2lvbk9iamVjdEtleSxcblx0U2hhZGVyU3RhZ2VTdHIsXG5cdFNoYWRlckF0dHJpYnV0ZU9iamVjdCxcblx0U2hhZGVyUHJlY2lzaW9uVHlwZSxcblx0U2hhZGVyQXR0cmlidXRlVmFyVHlwZSxcblx0U2hhZGVyVmFyeWluZ09iamVjdCxcblx0U2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlLFxuXHRTaGFkZXJWYXJ5aW5nVmFyVHlwZSxcblx0U2hhZGVyVW5pZm9ybU9iamVjdCxcblx0U2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsXG5cdFNoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3QsXG5cdFNoYWRlclN0cnVjdE1lbWJlck9iamVjdCxcblx0U2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdCxcblx0U2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdCxcblx0U2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdCxcblx0U2hhZGVyVUJPVmFyaWFibGVPYmplY3QsXG5cdFNoYWRlckZ1bmN0aW9uT2JqZWN0LFxufSBmcm9tICcuLi90eXBlcy90eXBlJztcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBjcmVhdGVzIGEgc2hhZGVyaXR5IG9iamVjdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciB7XG5cdHByaXZhdGUgX19zaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHI7XG5cdHByaXZhdGUgX19mdW5jdGlvbklkQ291bnQgPSAwO1xuXG5cdHByaXZhdGUgX19kZWZpbmVEaXJlY3RpdmVOYW1lczogc3RyaW5nW10gPSBbXTtcblx0cHJpdmF0ZSBfX2V4dGVuc2lvbnM6IFNoYWRlckV4dGVuc2lvbk9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19nbG9iYWxQcmVjaXNpb246IFNoYWRlclByZWNpc2lvbk9iamVjdCA9IHtcblx0XHRpbnQ6ICdoaWdocCcsXG5cdFx0ZmxvYXQ6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjJEOiAnaGlnaHAnLFxuXHRcdHNhbXBsZXJDdWJlOiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIzRDogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyMkRBcnJheTogJ2hpZ2hwJyxcblx0XHRpc2FtcGxlcjJEOiAnaGlnaHAnLFxuXHRcdGlzYW1wbGVyQ3ViZTogJ2hpZ2hwJyxcblx0XHRpc2FtcGxlcjNEOiAnaGlnaHAnLFxuXHRcdGlzYW1wbGVyMkRBcnJheTogJ2hpZ2hwJyxcblx0XHR1c2FtcGxlcjJEOiAnaGlnaHAnLFxuXHRcdHVzYW1wbGVyQ3ViZTogJ2hpZ2hwJyxcblx0XHR1c2FtcGxlcjNEOiAnaGlnaHAnLFxuXHRcdHVzYW1wbGVyMkRBcnJheTogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyMkRTaGFkb3c6ICdoaWdocCcsXG5cdFx0c2FtcGxlckN1YmVTaGFkb3c6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjJEQXJyYXlTaGFkb3c6ICdoaWdocCcsXG5cdH07XG5cdHByaXZhdGUgX19zdHJ1Y3REZWZpbml0aW9uczogU2hhZGVyU3RydWN0RGVmaW5pdGlvbk9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19nbG9iYWxDb25zdGFudFZhbHVlczogU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlczogU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19hdHRyaWJ1dGVzOiBTaGFkZXJBdHRyaWJ1dGVPYmplY3RbXSA9IFtdOyAvLyBmb3IgdmVydGV4IHNoYWRlciBvbmx5XG5cdHByaXZhdGUgX192YXJ5aW5nczogU2hhZGVyVmFyeWluZ09iamVjdFtdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtczogU2hhZGVyVW5pZm9ybU9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtU3RydWN0czogU2hhZGVyVW5pZm9ybVN0cnVjdE9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX191bmlmb3JtQnVmZmVyT2JqZWN0czogU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdFtdID0gW107XG5cdHByaXZhdGUgX19mdW5jdGlvbnM6IFNoYWRlckZ1bmN0aW9uT2JqZWN0W11bXSA9IFtdOyAvLyBmaXJzdCBpbmRleCByZXByZXNlbnQgZGVwZW5kZW5jeSBsZXZlbFxuXHRwcml2YXRlIF9fbWFpbkZ1bmN0aW9uQ29kZTogc3RyaW5nID0gJ3ZvaWQgbWFpbigpIHt9Jztcblx0cHJpdmF0ZSBfX291dHB1dENvbG9yVmFyaWFibGVOYW1lOiBzdHJpbmcgPSAncmVuZGVyVGFyZ2V0MCc7IC8vIGZvciBmcmFnbWVudCBzaGFkZXIgb25seVxuXG5cdGNvbnN0cnVjdG9yKHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdHRoaXMuX19zaGFkZXJTdGFnZSA9IHNoYWRlclN0YWdlO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIGFkZCBwYXJhbWV0ZXJzIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgYWRkRGVmaW5lRGlyZWN0aXZlKGRlZmluZURpcmVjdGl2ZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5zb21lKG5hbWUgPT4gbmFtZSA9PT0gZGVmaW5lRGlyZWN0aXZlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ2FkZERlZmluZURpcmVjdGl2ZTogdGhpcyBkZWZpbmUgZGlyZWN0aXZlIGlzIGFscmVhZHkgc2V0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2RlZmluZURpcmVjdGl2ZU5hbWVzLnB1c2goZGVmaW5lRGlyZWN0aXZlTmFtZSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkRXh0ZW5zaW9uKGV4dGVuc2lvbk5hbWU6IHN0cmluZywgYmVoYXZpb3I6IFNoYWRlckV4dGVuc2lvbkJlaGF2aW9yID0gJ2VuYWJsZScpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5zb21lKGV4dGVuc2lvbiA9PiBleHRlbnNpb24uZXh0ZW5zaW9uTmFtZSA9PT0gZXh0ZW5zaW9uTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ2FkZEV4dGVuc2lvbjogdGhpcyBleHRlbnNpb24gaXMgYWxyZWFkeSBzZXQnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5wdXNoKHtcblx0XHRcdGV4dGVuc2lvbk5hbWUsXG5cdFx0XHRiZWhhdmlvclxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gb25seSBkZWZpbmUgdHlwZXNcblx0cHVibGljIGFkZFN0cnVjdERlZmluaXRpb24oc3RydWN0TmFtZTogc3RyaW5nLCBtZW1iZXJPYmplY3RzOiBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3RbXSkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5zb21lKHN0cnVjdERlZmluaXRpb24gPT4gc3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFN0cnVjdERlZmluaXRpb246IGR1cGxpY2F0ZSBzdHJ1Y3QgdHlwZSBuYW1lICR7c3RydWN0TmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMucHVzaCh7XG5cdFx0XHRzdHJ1Y3ROYW1lLFxuXHRcdFx0bWVtYmVyT2JqZWN0cyxcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRHbG9iYWxDb25zdGFudFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCB0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMywgdmFsdWVzOiBudW1iZXJbXSkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5zb21lKGdsb2JhbENvbnN0YW50VmFsdWUgPT4gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRHbG9iYWxDb25zdGFudFZhbHVlOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc1ZhbGlkQ29tcG9uZW50TnVtYmVyID0gVXRpbGl0eS5faXNWYWxpZENvbXBvbmVudENvdW50KHR5cGUsIHZhbHVlcyk7XG5cdFx0aWYgKCFpc1ZhbGlkQ29tcG9uZW50TnVtYmVyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgY29tcG9uZW50IGNvdW50IG9mICR7dmFyaWFibGVOYW1lfSBpcyBpbnZhbGlkYCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNJbnRUeXBlID0gVXRpbGl0eS5faXNJbnRUeXBlKHR5cGUpO1xuXHRcdGlmIChpc0ludFR5cGUpIHtcblx0XHRcdGNvbnN0IGV4aXN0Tm9uSW50ZWdlclZhbHVlID0gU2hhZGVyaXR5T2JqZWN0Q3JlYXRvci5fX2V4aXN0Tm9uSW50ZWdlclZhbHVlKHZhbHVlcyk7XG5cdFx0XHRpZiAoZXhpc3ROb25JbnRlZ2VyVmFsdWUpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBhZGRHbG9iYWxDb25zdGFudFZhbHVlOiBub24taW50ZWdlciB2YWx1ZSBpcyBzZXQgdG8gJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0dHlwZSxcblx0XHRcdHZhbHVlcyxcblx0XHR9KTtcblx0fVxuXG5cdC8vIG5lZWQgdG8gZGVmaW5lIHN0cnVjdCBieSB0aGUgYWRkU3RydWN0RGVmaW5pdGlvbiBtZXRob2Rcblx0Ly8gdmFsaWRhdGUgdGhhdCB0aGUgY29ycmVzcG9uZGluZyBzdHJ1Y3R1cmUgaXMgZGVmaW5lZCBieSB0aGUgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZSBtZXRob2Rcblx0cHVibGljIGFkZEdsb2JhbENvbnN0YW50U3RydWN0VmFsdWUoc3RydWN0TmFtZTogc3RyaW5nLCB2YXJpYWJsZU5hbWU6IHN0cmluZywgdmFsdWVzOiB7W2tleVZhcmlhYmxlTmFtZTogc3RyaW5nXTogbnVtYmVyW119KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLnNvbWUoc3RydWN0VmFsdWUgPT4gc3RydWN0VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZTogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0c3RydWN0TmFtZSxcblx0XHRcdHZhbHVlcyxcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRBdHRyaWJ1dGVEZWNsYXJhdGlvbihcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZyxcblx0XHR0eXBlOiBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRwcmVjaXNpb24/OiBTaGFkZXJQcmVjaXNpb25UeXBlLFxuXHRcdFx0bG9jYXRpb24/OiBudW1iZXIsXG5cdFx0fVxuXHQpIHtcblx0XHRpZiAodGhpcy5fX3NoYWRlclN0YWdlICE9PSAndmVydGV4Jykge1xuXHRcdFx0Y29uc29sZS5lcnJvcignYWRkQXR0cmlidXRlOiB0aGlzIG1ldGhvZCBpcyBmb3IgdmVydGV4IHNoYWRlciBvbmx5Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2F0dHJpYnV0ZXMuc29tZShhdHRyaWJ1dGUgPT4gYXR0cmlidXRlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZEF0dHJpYnV0ZTogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2F0dHJpYnV0ZXMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHR0eXBlLFxuXHRcdFx0cHJlY2lzaW9uOiBvcHRpb25zPy5wcmVjaXNpb24sXG5cdFx0XHRsb2NhdGlvbjogb3B0aW9ucz8ubG9jYXRpb24sXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkVmFyeWluZ0RlY2xhcmF0aW9uKFxuXHRcdHZhcmlhYmxlTmFtZTogc3RyaW5nLFxuXHRcdHR5cGU6IFNoYWRlclZhcnlpbmdWYXJUeXBlLFxuXHRcdG9wdGlvbnM/OiB7XG5cdFx0XHRwcmVjaXNpb24/OiBTaGFkZXJQcmVjaXNpb25UeXBlLFxuXHRcdFx0aW50ZXJwb2xhdGlvblR5cGU/OiBTaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUsXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fdmFyeWluZ3Muc29tZSh2YXJ5aW5nID0+IHZhcnlpbmcudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVmFyeWluZzogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNJbnRUeXBlID0gVXRpbGl0eS5faXNJbnRUeXBlKHR5cGUpO1xuXHRcdGxldCBpbnRlcnBvbGF0aW9uVHlwZSA9IG9wdGlvbnM/LmludGVycG9sYXRpb25UeXBlO1xuXHRcdGlmIChpc0ludFR5cGUgJiYgaW50ZXJwb2xhdGlvblR5cGUgIT09ICdmbGF0Jykge1xuXHRcdFx0aWYgKGludGVycG9sYXRpb25UeXBlICE9IG51bGwpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVmFyeWluZzogdGhlIGludGVycG9sYXRpb25UeXBlIG11c3QgYmUgZmxhdCBmb3IgaW50ZWdlciB0eXBlc2ApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYGFkZFZhcnlpbmc6IHNldCB0aGUgaW50ZXJwb2xhdGlvblR5cGUgb2YgaW50ZWdlciB0eXBlcyB0byBmbGF0IHRvIGF2b2lkIGNvbXBpbGF0aW9uIGVycm9yYCk7XG5cdFx0XHRcdGludGVycG9sYXRpb25UeXBlID0gJ2ZsYXQnO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX192YXJ5aW5ncy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHR5cGUsXG5cdFx0XHRwcmVjaXNpb246IG9wdGlvbnM/LnByZWNpc2lvbixcblx0XHRcdGludGVycG9sYXRpb25UeXBlLFxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGFkZFVuaWZvcm1EZWNsYXJhdGlvbihcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZyxcblx0XHR0eXBlOiBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0cHJlY2lzaW9uPzogU2hhZGVyUHJlY2lzaW9uVHlwZSxcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX191bmlmb3Jtcy5zb21lKHVuaWZvcm0gPT4gdW5pZm9ybS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodHlwZSA9PT0gJ2Jvb2wnICYmIG9wdGlvbnM/LnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYGFkZFVuaWZvcm06IHJlbW92ZSB0aGUgc3BlY2lmaWNhdGlvbiBvZiBwcmVjaXNpb24gZm9yIGJvb2wgdHlwZSB0byBhdm9pZCBjb21waWxhdGlvbiBlcnJvcmApO1xuXHRcdFx0b3B0aW9ucy5wcmVjaXNpb24gPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1zLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0dHlwZSxcblx0XHRcdHByZWNpc2lvbjogb3B0aW9ucz8ucHJlY2lzaW9uLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gbmVlZCB0byBkZWZpbmUgc3RydWN0IGJ5IHRoZSBhZGRTdHJ1Y3REZWZpbml0aW9uIG1ldGhvZFxuXHRwdWJsaWMgYWRkVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uKFxuXHRcdHN0cnVjdE5hbWU6IHN0cmluZyxcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZ1xuXHQpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybVN0cnVjdHMuc29tZSh1bmlmb3JtU3RydWN0ID0+IHVuaWZvcm1TdHJ1Y3QudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybVN0cnVjdHMucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHRzdHJ1Y3ROYW1lLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gZm9yIGVzM1xuXHRwdWJsaWMgYWRkVW5pZm9ybUJ1ZmZlck9iamVjdERlY2xhcmF0aW9uKFxuXHRcdGJsb2NrTmFtZTogc3RyaW5nLFxuXHRcdHZhcmlhYmxlT2JqZWN0czogU2hhZGVyVUJPVmFyaWFibGVPYmplY3RbXSxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0aW5zdGFuY2VOYW1lPzogU2hhZGVyUHJlY2lzaW9uVHlwZVxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGVCbG9ja05hbWUgPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzLnNvbWUodWJvID0+IHViby5ibG9ja05hbWUgPT09IGJsb2NrTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlQmxvY2tOYW1lKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb246IGR1cGxpY2F0ZSBibG9jayBuYW1lICR7YmxvY2tOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgdWJvIG9mIHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cykge1xuXHRcdFx0Zm9yIChjb25zdCB1Ym9WYXJpYWJsZU9iamVjdCBvZiB1Ym8udmFyaWFibGVPYmplY3RzKSB7XG5cdFx0XHRcdGZvciAoY29uc3QgdmFyaWFibGVPYmplY3Qgb2YgdmFyaWFibGVPYmplY3RzKSB7XG5cdFx0XHRcdFx0aWYgKHVib1ZhcmlhYmxlT2JqZWN0LnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVPYmplY3QudmFyaWFibGVOYW1lKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBhZGRVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb246IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVPYmplY3QudmFyaWFibGVOYW1lfWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cy5wdXNoKHtcblx0XHRcdGJsb2NrTmFtZSxcblx0XHRcdHZhcmlhYmxlT2JqZWN0cyxcblx0XHRcdGluc3RhbmNlTmFtZTogb3B0aW9ucz8uaW5zdGFuY2VOYW1lLFxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gdGhlIHJldHVybiB2YWx1ZSBJZCBpcyBhIHZhbHVlIHRvIGRlbGV0ZSB0aGUgZnVuY3Rpb25cblx0Ly8gdGhlIG1haW4gZnVuY3Rpb24gaXMgZGVmaW5lZCAodXBkYXRlZCkgYnkgdGhlIHVwZGF0ZU1haW5GdW5jdGlvbiBtZXRob2Rcblx0cHVibGljIGFkZEZ1bmN0aW9uRGVmaW5pdGlvbihcblx0XHRmdW5jdGlvbkNvZGU6IHN0cmluZyxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0ZGVwZW5kZW5jeUxldmVsPzogbnVtYmVyXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCBmdW5jdGlvbklkID0gdGhpcy5fX2Z1bmN0aW9uSWRDb3VudCsrO1xuXG5cdFx0Y29uc3QgZGVwZW5kZW5jeUxldmVsID0gb3B0aW9ucz8uZGVwZW5kZW5jeUxldmVsID8/IDA7XG5cdFx0dGhpcy5fX2Z1bmN0aW9uc1tkZXBlbmRlbmN5TGV2ZWxdID0gdGhpcy5fX2Z1bmN0aW9uc1tkZXBlbmRlbmN5TGV2ZWxdID8/IFtdO1xuXHRcdHRoaXMuX19mdW5jdGlvbnNbZGVwZW5kZW5jeUxldmVsXS5wdXNoKHtcblx0XHRcdGZ1bmN0aW9uQ29kZSxcblx0XHRcdGZ1bmN0aW9uSWRcblx0XHR9KTtcblxuXHRcdHJldHVybiBmdW5jdGlvbklkO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHVwZGF0ZSBwYXJhbWV0ZXJzIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgdXBkYXRlR2xvYmFsUHJlY2lzaW9uKHByZWNpc2lvbjogU2hhZGVyUHJlY2lzaW9uT2JqZWN0KSB7XG5cdFx0T2JqZWN0LmFzc2lnbih0aGlzLl9fZ2xvYmFsUHJlY2lzaW9uLCBwcmVjaXNpb24pO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZVN0cnVjdERlZmluaXRpb24oc3RydWN0TmFtZTogc3RyaW5nLCBtZW1iZXJPYmplY3RzOiBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3RbXSkge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuZmluZEluZGV4KHN0cnVjdERlZmluaXRpb24gPT4gc3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgdXBkYXRlU3RydWN0RGVmaW5pdGlvbjogdGhlIHN0cnVjdCB0eXBlIG5hbWUgJHtzdHJ1Y3ROYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnNbbWF0Y2hlZEluZGV4XS5tZW1iZXJPYmplY3RzID0gbWVtYmVyT2JqZWN0cztcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCB2YWx1ZXM6IG51bWJlcltdKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5maW5kSW5kZXgoZ2xvYmFsQ29uc3RhbnRWYWx1ZSA9PiBnbG9iYWxDb25zdGFudFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGB1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdHlwZSA9IHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlc1ttYXRjaGVkSW5kZXhdLnR5cGU7XG5cblx0XHRjb25zdCBpc1ZhbGlkQ29tcG9uZW50TnVtYmVyID0gVXRpbGl0eS5faXNWYWxpZENvbXBvbmVudENvdW50KHR5cGUsIHZhbHVlcyk7XG5cdFx0aWYgKCFpc1ZhbGlkQ29tcG9uZW50TnVtYmVyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCd1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgY29tcG9uZW50IGNvdW50IGlzIGludmFsaWQnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc0ludFR5cGUgPSBVdGlsaXR5Ll9pc0ludFR5cGUodHlwZSk7XG5cdFx0aWYgKGlzSW50VHlwZSkge1xuXHRcdFx0Y29uc3QgZXhpc3ROb25JbnRlZ2VyVmFsdWUgPSBTaGFkZXJpdHlPYmplY3RDcmVhdG9yLl9fZXhpc3ROb25JbnRlZ2VyVmFsdWUodmFsdWVzKTtcblx0XHRcdGlmIChleGlzdE5vbkludGVnZXJWYWx1ZSkge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYHVwZGF0ZUdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSAke3ZhcmlhYmxlTmFtZX0gaGFzIGEgbm9uLWludGVnZXIgdmFsdWUuYCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzW21hdGNoZWRJbmRleF0udmFsdWVzID0gdmFsdWVzO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlczoge1trZXlWYXJpYWJsZU5hbWU6IHN0cmluZ106IG51bWJlcltdfSkge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMuZmluZEluZGV4KHN0cnVjdFZhbHVlID0+IHN0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgdXBkYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZTogIHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXNbbWF0Y2hlZEluZGV4XS52YWx1ZXMgPSB2YWx1ZXM7XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlTWFpbkZ1bmN0aW9uKG1haW5GdW5jdGlvbkNvZGVJbm5lcjogc3RyaW5nKSB7XG5cdFx0dGhpcy5fX21haW5GdW5jdGlvbkNvZGUgPSBtYWluRnVuY3Rpb25Db2RlSW5uZXI7XG5cdH1cblxuXHQvLyBzcGVjaWZ5IHRoZSBuYW1lIG9mIHRoZSBvdXRwdXQgY29sb3IgdmFyaWFibGUgZnJvbSB0aGUgbWFpbiBmdW5jdGlvbiBpbiB0aGUgZnJhZ21lbnQgc2hhZGVyLlxuXHQvLyB1c2VycyBoYXZlIHRvIGFzc2lnbiB0aGUgcmVzdWx0IG9mIGZyYWdtZW50IHNoYWRlciBjYWxjdWxhdGlvbiB0byB0aGlzIHZhcmlhYmxlLlxuXHRwdWJsaWMgdXBkYXRlT3V0cHV0Q29sb3JWYXJpYWJsZU5hbWUob3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGlmICh0aGlzLl9fc2hhZGVyU3RhZ2UgIT09ICdmcmFnbWVudCcpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ3VwZGF0ZU91dHB1dENvbG9yVmFyaWFibGVOYW1lOiB0aGlzIG1ldGhvZCBpcyBmb3IgZnJhZ21lbnQgc2hhZGVyIG9ubHknKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAob3V0cHV0Q29sb3JWYXJpYWJsZU5hbWUubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCd1cGRhdGVPdXRwdXRDb2xvclZhcmlhYmxlTmFtZTogaW52YWxpZCBvdXRDb2xvclZhcmlhYmxlTmFtZScpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19vdXRwdXRDb2xvclZhcmlhYmxlTmFtZSA9IG91dHB1dENvbG9yVmFyaWFibGVOYW1lO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHJlbW92ZSBwYXJhbWV0ZXJzIGZ1bmN0aW9uc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgcmVtb3ZlRGVmaW5lRGlyZWN0aXZlKGRlZmluZURpcmVjdGl2ZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9IHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5pbmRleE9mKGRlZmluZURpcmVjdGl2ZU5hbWUpO1xuXG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybigncmVtb3ZlZERlZmluZURpcmVjdGl2ZTogdGhpcyBkZWZpbmUgZGlyZWN0aXZlIGlzIG5vdCBleGlzdCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVFeHRlbnNpb24oZXh0ZW5zaW9uTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19leHRlbnNpb25zLmZpbmRJbmRleChleHRlbnNpb24gPT4gZXh0ZW5zaW9uLmV4dGVuc2lvbk5hbWUgPT09IGV4dGVuc2lvbk5hbWUpO1xuXG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybigncmVtb3ZlRXh0ZW5zaW9uOiB0aGlzIGV4dGVuc2lvbiBpcyBub3QgZXhpc3QnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVTdHJ1Y3REZWZpbml0aW9uKHN0cnVjdE5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuZmluZEluZGV4KHN0cnVjdERlZmluaXRpb24gPT4gc3RydWN0RGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgcmVtb3ZlU3RydWN0RGVmaW5pdGlvbjogdGhlIHN0cnVjdCB0eXBlIG5hbWUgJHtzdHJ1Y3ROYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlR2xvYmFsQ29uc3RhbnRWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMuZmluZEluZGV4KGdsb2JhbENvbnN0YW50VmFsdWUgPT4gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5maW5kSW5kZXgoc3RydWN0VmFsdWUgPT4gc3RydWN0VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGB1cGRhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlOiAgdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVBdHRyaWJ1dGVEZWNsYXJhdGlvbih2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fYXR0cmlidXRlcy5maW5kSW5kZXgoYXR0cmlidXRlID0+IGF0dHJpYnV0ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlQXR0cmlidXRlOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2F0dHJpYnV0ZXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlVmFyeWluZ0RlY2xhcmF0aW9uKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX192YXJ5aW5ncy5maW5kSW5kZXgodmFyeWluZyA9PiB2YXJ5aW5nLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVWYXJ5aW5nOiB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3ZhcnlpbmdzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVVuaWZvcm1EZWNsYXJhdGlvbih2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybXMuZmluZEluZGV4KHVuaWZvcm0gPT4gdW5pZm9ybS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlVW5pZm9ybTogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3Jtcy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb24odmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1TdHJ1Y3RzLmZpbmRJbmRleCh1bmlmb3JtU3RydWN0ID0+IHVuaWZvcm1TdHJ1Y3QudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbjogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3JtU3RydWN0cy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVVbmlmb3JtQnVmZmVyT2JqZWN0RGVjbGFyYXRpb24oYmxvY2tOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzLmZpbmRJbmRleCh1Ym8gPT4gdWJvLmJsb2NrTmFtZSA9PT0gYmxvY2tOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb246IHRoZSB2YXJpYWJsZSBuYW1lICR7YmxvY2tOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlRnVuY3Rpb25EZWZpbml0aW9uKGZ1bmN0aW9uSWQ6IG51bWJlcikge1xuXHRcdHRoaXMuX19maWxsRW1wdHlGdW5jdGlvbnMoKTtcblxuXHRcdC8vIGlkIGlzIHRvbyBzbWFsbCBvciB0b28gYmlnXG5cdFx0aWYgKGZ1bmN0aW9uSWQgPCAwIHx8IGZ1bmN0aW9uSWQgPj0gdGhpcy5fX2Z1bmN0aW9uSWRDb3VudCkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdyZW1vdmVGdW5jdGlvbkRlZmluaXRpb246IGludmFsaWQgZnVuY3Rpb24gaWQnKVxuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgZnVuY3Rpb25PYmplY3RzIG9mIHRoaXMuX19mdW5jdGlvbnMpIHtcblx0XHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHRcdGZ1bmN0aW9uT2JqZWN0cy5maW5kSW5kZXgoZnVuY3Rpb25PYmplY3QgPT4gZnVuY3Rpb25PYmplY3QuZnVuY3Rpb25JZCA9PT0gZnVuY3Rpb25JZCk7XG5cdFx0XHRpZiAobWF0Y2hlZEluZGV4ICE9PSAtMSkge1xuXHRcdFx0XHRmdW5jdGlvbk9iamVjdHMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zb2xlLndhcm4oYHJlbW92ZUZ1bmN0aW9uRGVmaW5pdGlvbjogbm90IGZvdW5kIHRoZSBmdW5jdGlvbiBvZiBmdW5jdGlvbklkICR7ZnVuY3Rpb25JZH1gKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBjcmVhdGUgc2hhZGVyaXR5IG9iamVjdCBmdW5jdGlvblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwdWJsaWMgY3JlYXRlU2hhZGVyaXR5T2JqZWN0KCk6IFNoYWRlcml0eU9iamVjdCB7XG5cdFx0Y29uc3Qgc2hhZGVyaXR5T2JqID0ge1xuXHRcdFx0Y29kZTogdGhpcy5fX2NyZWF0ZVNoYWRlckNvZGUoKSxcblx0XHRcdHNoYWRlclN0YWdlOiB0aGlzLl9fc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiB0aGlzLl9fc2hhZGVyU3RhZ2UgPT09ICdmcmFnbWVudCcsXG5cdFx0fTtcblxuXHRcdHJldHVybiBzaGFkZXJpdHlPYmo7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gcHJpdmF0ZSBtZXRob2RzXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHByaXZhdGUgc3RhdGljIF9fZXhpc3ROb25JbnRlZ2VyVmFsdWUodmFsdWVzOiBudW1iZXJbXSkge1xuXHRcdGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG5cdFx0XHRpZiAoIU51bWJlci5pc0ludGVnZXIodmFsdWUpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBUT0RPOiBpbXBsZW1lbnQgc2hhZGVyIGNvZGUgaW1wb3J0IGZlYXR1cmUgKGxvdyBwcmlvcml0eSlcblx0Ly8gcHVibGljIGltcG9ydFNoYWRlckNvZGUoY29kZTogc3RyaW5nKSB7fVxuXG5cdC8vIG5lZWQgdG8gYXBwbHkgU2hhZGVyaXR5LnRyYW5zZm9ybVRvR0xTTEVTMSwgdHJhbnNmb3JtVG9HTFNMRVMzIG9yIHRyYW5zZm9ybVRvIG1ldGhvZFxuXHRwcml2YXRlIF9fY3JlYXRlU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdHRoaXMuX19maWxsRW1wdHlGdW5jdGlvbnMoKTtcblxuXHRcdGNvbnN0IGNvZGVcblx0XHRcdD0gYCN2ZXJzaW9uIDMwMCBlc1xcblxcbmBcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZURlZmluZURpcmVjdGl2ZVNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlRXh0ZW5zaW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVHbG9iYWxQcmVjaXNpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVN0cnVjdERlZmluaXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUdsb2JhbENvbnN0YW50VmFsdWVTaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUF0dHJpYnV0ZURlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVWYXJ5aW5nRGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZU91dHB1dENvbG9yRGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVVuaWZvcm1EZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVVbmlmb3JtQnVmZmVyT2JqZWN0U2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVGdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZU1haW5GdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKCk7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdHByaXZhdGUgX19maWxsRW1wdHlGdW5jdGlvbnMoKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9fZnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0aGlzLl9fZnVuY3Rpb25zW2ldID0gdGhpcy5fX2Z1bmN0aW9uc1tpXSA/PyBbXTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlRGVmaW5lRGlyZWN0aXZlU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBkZWZpbmVEaXJlY3RpdmVOYW1lIG9mIHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgI2RlZmluZSAke2RlZmluZURpcmVjdGl2ZU5hbWV9XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpOztcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVFeHRlbnNpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IGV4dGVuc2lvbiBvZiB0aGlzLl9fZXh0ZW5zaW9ucykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgI2V4dGVuc2lvbiAke2V4dGVuc2lvbi5leHRlbnNpb25OYW1lfTogJHtleHRlbnNpb24uYmVoYXZpb3J9XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0Ly9UT0RPOiByZW1vdmUgbmVlZGxlc3MgcHJlY2lzaW9uc1xuXHRwcml2YXRlIF9fY3JlYXRlR2xvYmFsUHJlY2lzaW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB0eXBlIGluIHRoaXMuX19nbG9iYWxQcmVjaXNpb24pIHtcblx0XHRcdGNvbnN0IHByZWNpc2lvblR5cGUgPSB0eXBlIGFzIFNoYWRlclByZWNpc2lvbk9iamVjdEtleTtcblx0XHRcdGNvbnN0IHByZWNpc2lvblF1YWxpZmllciA9IHRoaXMuX19nbG9iYWxQcmVjaXNpb25bcHJlY2lzaW9uVHlwZV07XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYHByZWNpc2lvbiAke3ByZWNpc2lvblF1YWxpZmllcn0gJHtwcmVjaXNpb25UeXBlfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlU3RydWN0RGVmaW5pdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3Qgc3RydWN0RGVmaW5pdGlvbiBvZiB0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYHN0cnVjdCAke3N0cnVjdERlZmluaXRpb24uc3RydWN0TmFtZX0ge1xcbmA7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlID0gc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzW2ldO1xuXG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCAgYDtcblx0XHRcdFx0aWYgKHZhcmlhYmxlLnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJpYWJsZS5wcmVjaXNpb259IGA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcmlhYmxlLnR5cGV9ICR7dmFyaWFibGUubWVtYmVyTmFtZX07XFxuYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZVNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgZ2xvYmFsQ29uc3RhbnRWYWx1ZSBvZiB0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBnbG9iYWxDb25zdGFudFZhbHVlLnR5cGU7XG5cdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSBnbG9iYWxDb25zdGFudFZhbHVlLnZhcmlhYmxlTmFtZTtcblx0XHRcdGNvbnN0IHZhbHVlID0gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YWx1ZXM7XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYGNvbnN0ICR7dHlwZX0gJHt2YXJpYWJsZU5hbWV9ID0gJHt0eXBlfShgO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IHZhbHVlW2ldICsgJywgJztcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSA9IHNoYWRlckNvZGUucmVwbGFjZSgvLFxccyQvLCAnKTtcXG4nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHN0cnVjdFZhbHVlIG9mIHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcykge1xuXHRcdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLmZpbmRJbmRleChkZWZpbml0aW9uID0+IGRlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0VmFsdWUuc3RydWN0TmFtZSk7XG5cdFx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiB0aGUgc3RydWN0IHR5cGUgJHtzdHJ1Y3RWYWx1ZS5zdHJ1Y3ROYW1lfSBpcyBub3QgZGVmaW5lZGApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgY29uc3QgJHtzdHJ1Y3RWYWx1ZS5zdHJ1Y3ROYW1lfSAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gPSAke3N0cnVjdFZhbHVlLnN0cnVjdE5hbWV9IChcXG5gO1xuXG5cdFx0XHRjb25zdCBzdHJ1Y3REZWZpbml0aW9uID0gdGhpcy5fX3N0cnVjdERlZmluaXRpb25zW21hdGNoZWRJbmRleF07XG5cdFx0XHRpZiAoc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzLmxlbmd0aCAhPT0gT2JqZWN0LmtleXMoc3RydWN0VmFsdWUudmFsdWVzKS5sZW5ndGgpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogSW52YWxpZCBudW1iZXIgb2YgdmFyaWFibGVzIHRoYXQgJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9IGhhc2ApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaGFzU2FtcGxlclR5cGUgPVxuXHRcdFx0XHRzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHMuc29tZShtZW1iZXJPYmplY3QgPT4gVXRpbGl0eS5faXNTYW1wbGVyVHlwZShtZW1iZXJPYmplY3QudHlwZSkpO1xuXHRcdFx0aWYgKGhhc1NhbXBsZXJUeXBlKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6IENvbnN0YW50U3RydWN0VmFsdWUgKCR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSkgY2Fubm90IGhhdmUgc2FtcGxlciB0eXBlIHBhcmFtZXRlcmApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3REZWZpbml0aW9uLm1lbWJlck9iamVjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzW2ldLm1lbWJlck5hbWU7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gc3RydWN0VmFsdWUudmFsdWVzW3ZhcmlhYmxlTmFtZV1cblx0XHRcdFx0aWYgKHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gZG9lcyBub3QgaGF2ZSB0aGUgdmFsdWUgb2YgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB0eXBlID0gc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzW2ldLnR5cGU7XG5cdFx0XHRcdGNvbnN0IGlzVmFsaWRDb21wb25lbnROdW1iZXIgPSBVdGlsaXR5Ll9pc1ZhbGlkQ29tcG9uZW50Q291bnQodHlwZSwgdmFsdWUpO1xuXHRcdFx0XHRpZiAoIWlzVmFsaWRDb21wb25lbnROdW1iZXIpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiB0aGUgY29tcG9uZW50IGNvdW50IG9mICR7dmFyaWFibGVOYW1lfSBpbiAke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0gaXMgaW52YWxpZGApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgICAke3R5cGV9KGA7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRzaGFkZXJDb2RlICs9IHZhbHVlW2ldICsgJywgJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNoYWRlckNvZGUgPSBzaGFkZXJDb2RlLnJlcGxhY2UoLyxcXHMkLywgJyksXFxuJyk7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgPSBzaGFkZXJDb2RlLnJlcGxhY2UoLyxcXG4kLywgJ1xcbik7XFxuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVBdHRyaWJ1dGVEZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgYXR0cmlidXRlIG9mIHRoaXMuX19hdHRyaWJ1dGVzKSB7XG5cdFx0XHRpZiAoYXR0cmlidXRlLmxvY2F0aW9uICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgbGF5b3V0IChsb2NhdGlvbiA9ICR7YXR0cmlidXRlLmxvY2F0aW9ufSkgYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgaW4gYDtcblxuXHRcdFx0aWYgKGF0dHJpYnV0ZS5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke2F0dHJpYnV0ZS5wcmVjaXNpb259IGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYCR7YXR0cmlidXRlLnR5cGV9ICR7YXR0cmlidXRlLnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVZhcnlpbmdEZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdmFyeWluZyBvZiB0aGlzLl9fdmFyeWluZ3MpIHtcblx0XHRcdGlmICh2YXJ5aW5nLmludGVycG9sYXRpb25UeXBlICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJ5aW5nLmludGVycG9sYXRpb25UeXBlfSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IHRoaXMuX19zaGFkZXJTdGFnZSA9PSAndmVydGV4JyA/IGBvdXQgYCA6IGBpbiBgO1xuXG5cdFx0XHRpZiAodmFyeWluZy5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcnlpbmcucHJlY2lzaW9ufSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGAke3ZhcnlpbmcudHlwZX0gJHt2YXJ5aW5nLnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0Ly9UT0RPOiB0cmFuc2xhdGUgd2hlbiBnbHNsIGVzMVxuXHRwcml2YXRlIF9fY3JlYXRlT3V0cHV0Q29sb3JEZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRpZiAodGhpcy5fX3NoYWRlclN0YWdlICE9PSAnZnJhZ21lbnQnKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGBsYXlvdXQobG9jYXRpb24gPSAwKSBvdXQgdmVjNCAke3RoaXMuX19vdXRwdXRDb2xvclZhcmlhYmxlTmFtZX07XFxuXFxuYDtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVVbmlmb3JtRGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHVuaWZvcm0gb2YgdGhpcy5fX3VuaWZvcm1zKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGB1bmlmb3JtIGA7XG5cblx0XHRcdGlmICh1bmlmb3JtLnByZWNpc2lvbiAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dW5pZm9ybS5wcmVjaXNpb259IGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dW5pZm9ybS50eXBlfSAke3VuaWZvcm0udmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB1bmlmb3JtU3RydWN0IG9mIHRoaXMuX191bmlmb3JtU3RydWN0cykge1xuXHRcdFx0Y29uc3Qgc3RydWN0TmFtZSA9IHVuaWZvcm1TdHJ1Y3Quc3RydWN0TmFtZTtcblxuXHRcdFx0Y29uc3QgZXhpc3RTdHJ1Y3REZWZpbml0aW9uID1cblx0XHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLnNvbWUoZGVmaW5pdGlvbiA9PiBkZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdE5hbWUpO1xuXHRcdFx0aWYgKCFleGlzdFN0cnVjdERlZmluaXRpb24pIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb25TaGFkZXJDb2RlOiB0aGUgc3RydWN0IHR5cGUgJHtzdHJ1Y3ROYW1lfSBpcyBub3QgZGVmaW5lZGApO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgdW5pZm9ybSAke3N0cnVjdE5hbWV9ICR7dW5pZm9ybVN0cnVjdC52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVVbmlmb3JtQnVmZmVyT2JqZWN0U2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB1Ym8gb2YgdGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGBsYXlvdXQgKHN0ZDE0MCkgdW5pZm9ybSAke3Viby5ibG9ja05hbWV9IHtcXG5gO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHViby52YXJpYWJsZU9iamVjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgdmFyaWFibGVPYmogPSB1Ym8udmFyaWFibGVPYmplY3RzW2ldO1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAgICR7dmFyaWFibGVPYmoudHlwZX0gJHt2YXJpYWJsZU9iai52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh1Ym8uaW5zdGFuY2VOYW1lICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgfSAke3Viby5pbnN0YW5jZU5hbWV9O1xcbmA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGB9O1xcbmA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVGdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX19mdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGZ1bmN0aW9uT2JqZWN0cyA9IHRoaXMuX19mdW5jdGlvbnNbaV07XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGZ1bmN0aW9uT2JqZWN0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGZ1bmN0aW9uT2JqZWN0c1tqXS5mdW5jdGlvbkNvZGUgKyBgXFxuYDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZU1haW5GdW5jdGlvbkRlZmluaXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuX19tYWluRnVuY3Rpb25Db2RlICsgYFxcbmA7XG5cdH1cbn1cbiIsImltcG9ydCB7U2hhZGVyQXR0cmlidXRlVmFyVHlwZSwgU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMsIFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzLCBTaGFkZXJWYXJ5aW5nVmFyVHlwZX0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxpdHkge1xuXHRzdGF0aWMgX3NwbGl0QnlMaW5lRmVlZENvZGUoc291cmNlOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gc291cmNlLnNwbGl0KC9cXHJcXG58XFxuLyk7XG5cdH1cblxuXHRzdGF0aWMgX2pvaW5TcGxpdHRlZExpbmUoc3BsaXR0ZWRMaW5lOiBzdHJpbmdbXSkge1xuXHRcdHJldHVybiBzcGxpdHRlZExpbmUuam9pbignXFxuJyk7XG5cdH1cblxuXHRzdGF0aWMgX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzb3VyY2U6IHN0cmluZykge1xuXHRcdHJldHVybiBzb3VyY2UgPT09ICcnID8gc291cmNlIDogc291cmNlICsgJ1xcbic7XG5cdH1cblxuXHRzdGF0aWMgX2NvbXBvbmVudE51bWJlcihcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzXG5cdCkge1xuXHRcdGxldCBjb21wb25lbnROdW1iZXI7XG5cdFx0aWYgKFxuXHRcdFx0dHlwZSA9PT0gJ2Zsb2F0JyB8fCB0eXBlID09PSAnaW50JyB8fCB0eXBlID09PSAnYm9vbCcgfHwgdHlwZSA9PT0gJ3VpbnQnIHx8XG5cdFx0XHR0eXBlID09PSAnc2FtcGxlcjJEJyB8fCB0eXBlID09PSAnc2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICdzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICdzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICdpc2FtcGxlcjJEJyB8fCB0eXBlID09PSAnaXNhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAnaXNhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICd1c2FtcGxlcjJEJyB8fCB0eXBlID09PSAndXNhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAndXNhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICdzYW1wbGVyMkRTaGFkb3cnIHx8IHR5cGUgPT09ICdzYW1wbGVyQ3ViZVNoYWRvdycgfHwgdHlwZSA9PT0gJ3NhbXBsZXIyREFycmF5U2hhZG93J1xuXHRcdCkge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMTtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZWMyJyB8fCB0eXBlID09PSAnaXZlYzInIHx8IHR5cGUgPT09ICdidmVjMicgfHwgdHlwZSA9PT0gJ3V2ZWMyJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMjtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZWMzJyB8fCB0eXBlID09PSAnaXZlYzMnIHx8IHR5cGUgPT09ICdidmVjMycgfHwgdHlwZSA9PT0gJ3V2ZWMzJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMztcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICd2ZWM0JyB8fCB0eXBlID09PSAnaXZlYzQnIHx8IHR5cGUgPT09ICdidmVjNCcgfHwgdHlwZSA9PT0gJ3V2ZWM0JyB8fCB0eXBlID09PSAnbWF0MicgfHwgdHlwZSA9PT0gJ21hdDJ4MicpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDQ7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0MngzJyB8fCB0eXBlID09PSAnbWF0M3gyJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gNjtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQyeDQnIHx8IHR5cGUgPT09ICdtYXQ0eDInKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSA4O1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDMnIHx8IHR5cGUgPT09ICdtYXQzeDMnKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSA5O1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDN4NCcgfHwgdHlwZSA9PT0gJ21hdDR4MycpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDEyO1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDQnIHx8IHR5cGUgPT09ICdtYXQ0eDQnKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAxNjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gdW5rbm93biB0eXBlXG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAwO1xuXHRcdFx0Y29uc29sZS5lcnJvcignVXRpbGl0eS5fY29tcG9uZW50TnVtYmVyOiBkZXRlY3QgdW5rbm93biB0eXBlJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbXBvbmVudE51bWJlcjtcblx0fVxuXG5cdHN0YXRpYyBfaXNJbnRUeXBlKFxuXHRcdHR5cGU6IFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzIHwgU2hhZGVyQXR0cmlidXRlVmFyVHlwZSB8IFNoYWRlclZhcnlpbmdWYXJUeXBlIHwgU2hhZGVyVW5pZm9ybVZhclR5cGVFUzNcblx0KSB7XG5cdFx0aWYgKFxuXHRcdFx0dHlwZSA9PT0gJ2ludCcgfHwgdHlwZSA9PT0gJ2l2ZWMyJyB8fCB0eXBlID09PSAnaXZlYzMnIHx8IHR5cGUgPT09ICdpdmVjNCcgfHxcblx0XHRcdHR5cGUgPT09ICd1aW50JyB8fCB0eXBlID09PSAndXZlYzInIHx8IHR5cGUgPT09ICd1dmVjMycgfHwgdHlwZSA9PT0gJ3V2ZWM0J1xuXHRcdCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgX2lzVmFsaWRDb21wb25lbnRDb3VudChcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzLFxuXHRcdHZhbHVlczogbnVtYmVyW11cblx0KSB7XG5cdFx0Y29uc3QgdmFsaWRDb21wb25lbnRDb3VudCA9IFV0aWxpdHkuX2NvbXBvbmVudE51bWJlcih0eXBlKTtcblx0XHRpZiAodmFsaWRDb21wb25lbnRDb3VudCA9PT0gdmFsdWVzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHN0YXRpYyBfaXNTYW1wbGVyVHlwZShcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzXG5cdCkge1xuXHRcdGlmIChcblx0XHRcdHR5cGUgPT09ICdzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICdzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ3NhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ3NhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ2lzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICdpc2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICdpc2FtcGxlcjNEJyB8fCB0eXBlID09PSAnaXNhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3VzYW1wbGVyMkQnIHx8IHR5cGUgPT09ICd1c2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICd1c2FtcGxlcjNEJyB8fCB0eXBlID09PSAndXNhbXBsZXIyREFycmF5JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3NhbXBsZXIyRFNoYWRvdycgfHwgdHlwZSA9PT0gJ3NhbXBsZXJDdWJlU2hhZG93JyB8fCB0eXBlID09PSAnc2FtcGxlcjJEQXJyYXlTaGFkb3cnXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==