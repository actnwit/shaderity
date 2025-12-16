/******/ (() => { // webpackBootstrap
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
    static process(splittedLines, definitions = [], startLineStr, endLineStr) {
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
            let isCondiiton = false;
            { // #define
                const re = line.match(define);
                if (re != null) {
                    const [_, name, value = "1"] = re;
                    this.definitions.set(name, value);
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
                    isCondiiton = true;
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
                    isCondiiton = true;
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
                    isCondiiton = true;
                }
            }
            { // #endif
                const re = line.match(endif);
                if (re != null) {
                    outputFlg = previousOutputStates[previousOutputStates.length - 1];
                    isCondiiton = true;
                    ifdefs.pop();
                    ifdefMatched.pop();
                    previousOutputStates.pop();
                }
            }
            if (outputFlg && !isCondiiton) {
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
    static processPragma(obj, definitions = [], startLineStr, endLineStr) {
        const splittedShaderCode = Utility_1.default._splitByLineFeedCode(obj.code);
        const transformedSplittedShaderCode = PreProcessor_1.default.process(splittedShaderCode, definitions, startLineStr, endLineStr);
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
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxjQUFj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QUM7UUFDYixDQUFDO2FBQU0sQ0FBQztZQUNQLE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztJQUNGLENBQUM7Q0FDRDtBQXhGRCw2QkF3RkM7Ozs7Ozs7VUMxRkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3NoYWRlcml0eS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9zaGFkZXJpdHkvLi9zcmMvbWFpbi9QcmVQcm9jZXNzb3IudHMiLCJ3ZWJwYWNrOi8vc2hhZGVyaXR5Ly4vc3JjL21haW4vUmVmbGVjdGlvbi50cyIsIndlYnBhY2s6Ly9zaGFkZXJpdHkvLi9zcmMvbWFpbi9TaGFkZXJFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vc2hhZGVyaXR5Ly4vc3JjL21haW4vU2hhZGVyVHJhbnNmb3JtZXIudHMiLCJ3ZWJwYWNrOi8vc2hhZGVyaXR5Ly4vc3JjL21haW4vU2hhZGVyaXR5LnRzIiwid2VicGFjazovL3NoYWRlcml0eS8uL3NyYy9tYWluL1NoYWRlcml0eU9iamVjdENyZWF0b3IudHMiLCJ3ZWJwYWNrOi8vc2hhZGVyaXR5Ly4vc3JjL21haW4vVXRpbGl0eS50cyIsIndlYnBhY2s6Ly9zaGFkZXJpdHkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2hhZGVyaXR5L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2hhZGVyaXR5L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zaGFkZXJpdHkvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGFkZXJpdHkgZnJvbSAnLi9tYWluL1NoYWRlcml0eSc7XHJcbmltcG9ydCBfU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciBmcm9tICcuL21haW4vU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcic7XHJcbmltcG9ydCBfUmVmbGVjdGlvbiBmcm9tICcuL21haW4vUmVmbGVjdGlvbic7XHJcblxyXG5pbXBvcnQge1xyXG4gIEF0dHJpYnV0ZVNlbWFudGljcyBhcyBfQXR0cmlidXRlU2VtYW50aWNzLFxyXG4gIFJlZmxlY3Rpb25BdHRyaWJ1dGUgYXMgX1JlZmxlY3Rpb25BdHRyaWJ1dGUsXHJcbiAgUmVmbGVjdGlvblVuaWZvcm0gYXMgX1JlZmxlY3Rpb25Vbmlmb3JtLFxyXG4gIFJlZmxlY3Rpb25WYXJ5aW5nIGFzIF9SZWZsZWN0aW9uVmFyeWluZyxcclxuICBTaGFkZXJpdHlPYmplY3QgYXMgX1NoYWRlcml0eU9iamVjdCxcclxuICBTaGFkZXJFeHRlbnNpb25CZWhhdmlvciBhcyBfU2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3IsXHJcbiAgU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgYXMgX1NoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzLFxyXG4gIFNoYWRlclByZWNpc2lvbk9iamVjdCBhcyBfU2hhZGVyUHJlY2lzaW9uT2JqZWN0LFxyXG4gIFNoYWRlclN0YWdlU3RyIGFzIF9TaGFkZXJTdGFnZVN0cixcclxuICBTaGFkZXJQcmVjaXNpb25UeXBlIGFzIF9TaGFkZXJQcmVjaXNpb25UeXBlLFxyXG4gIFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgYXMgX1NoYWRlckF0dHJpYnV0ZVZhclR5cGUsXHJcbiAgU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlIGFzIF9TaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGUsXHJcbiAgU2hhZGVyVmFyeWluZ1ZhclR5cGUgYXMgX1NoYWRlclZhcnlpbmdWYXJUeXBlLFxyXG4gIFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzIGFzIF9TaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyxcclxuICBTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3QgYXMgX1NoYWRlclN0cnVjdE1lbWJlck9iamVjdCxcclxuICBTaGFkZXJVQk9WYXJpYWJsZU9iamVjdCBhcyBfU2hhZGVyVUJPVmFyaWFibGVPYmplY3QsXHJcbiAgU2hhZGVyQXR0cmlidXRlT2JqZWN0IGFzIF9TaGFkZXJBdHRyaWJ1dGVPYmplY3QsXHJcbiAgU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdCBhcyBfU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdCxcclxuICBTaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0IGFzIF9TaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0LFxyXG4gIFNoYWRlckV4dGVuc2lvbk9iamVjdCBhcyBfU2hhZGVyRXh0ZW5zaW9uT2JqZWN0LFxyXG4gIFNoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3QgYXMgX1NoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3QsXHJcbiAgU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdCBhcyBfU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdCxcclxuICBTaGFkZXJVbmlmb3JtT2JqZWN0IGFzIF9TaGFkZXJVbmlmb3JtT2JqZWN0LFxyXG4gIFNoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3QgYXMgX1NoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3QsXHJcbiAgU2hhZGVyVmFyeWluZ09iamVjdCBhcyBfU2hhZGVyVmFyeWluZ09iamVjdCxcclxuICBTaGFkZXJWZXJzaW9uIGFzIF9TaGFkZXJWZXJzaW9uLFxyXG4gIFRlbXBsYXRlT2JqZWN0IGFzIF9UZW1wbGF0ZU9iamVjdCxcclxuICBVbmlmb3JtU2VtYW50aWNzIGFzIF9Vbmlmb3JtU2VtYW50aWNzLFxyXG4gIFZhclR5cGUgYXMgX1ZhclR5cGUsXHJcbn0gZnJvbSAnLi90eXBlcy90eXBlJztcclxuXHJcbmV4cG9ydCB7XHJcbiAgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciBhcyBfU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcixcclxuICBSZWZsZWN0aW9uIGFzIF9SZWZsZWN0aW9uLFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBdHRyaWJ1dGVTZW1hbnRpY3MgPSBfQXR0cmlidXRlU2VtYW50aWNzO1xyXG5leHBvcnQgdHlwZSBSZWZsZWN0aW9uQXR0cmlidXRlID0gX1JlZmxlY3Rpb25BdHRyaWJ1dGU7XHJcbmV4cG9ydCB0eXBlIFJlZmxlY3Rpb25Vbmlmb3JtID0gX1JlZmxlY3Rpb25Vbmlmb3JtO1xyXG5leHBvcnQgdHlwZSBSZWZsZWN0aW9uVmFyeWluZyA9IF9SZWZsZWN0aW9uVmFyeWluZztcclxuZXhwb3J0IHR5cGUgU2hhZGVyaXR5T2JqZWN0ID0gX1NoYWRlcml0eU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3IgPSBfU2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3I7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzID0gX1NoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJQcmVjaXNpb25PYmplY3QgPSBfU2hhZGVyUHJlY2lzaW9uT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJTdGFnZVN0ciA9IF9TaGFkZXJTdGFnZVN0cjtcclxuZXhwb3J0IHR5cGUgU2hhZGVyUHJlY2lzaW9uVHlwZSA9IF9TaGFkZXJQcmVjaXNpb25UeXBlO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlID0gX1NoYWRlckF0dHJpYnV0ZVZhclR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSA9IF9TaGFkZXJWYXJ5aW5nSW50ZXJwb2xhdGlvblR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclZhcnlpbmdWYXJUeXBlID0gX1NoYWRlclZhcnlpbmdWYXJUeXBlO1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyA9IF9TaGFkZXJVbmlmb3JtVmFyVHlwZUVTMztcclxuZXhwb3J0IHR5cGUgU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0ID0gX1NoYWRlclN0cnVjdE1lbWJlck9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVUJPVmFyaWFibGVPYmplY3QgPSBfU2hhZGVyVUJPVmFyaWFibGVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckF0dHJpYnV0ZU9iamVjdCA9IF9TaGFkZXJBdHRyaWJ1dGVPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3QgPSBfU2hhZGVyQ29uc3RhbnRTdHJ1Y3RWYWx1ZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdCA9IF9TaGFkZXJDb25zdGFudFZhbHVlT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJFeHRlbnNpb25PYmplY3QgPSBfU2hhZGVyRXh0ZW5zaW9uT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0ID0gX1NoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclVuaWZvcm1CdWZmZXJPYmplY3QgPSBfU2hhZGVyVW5pZm9ybUJ1ZmZlck9iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVW5pZm9ybU9iamVjdCA9IF9TaGFkZXJVbmlmb3JtT2JqZWN0O1xyXG5leHBvcnQgdHlwZSBTaGFkZXJVbmlmb3JtU3RydWN0T2JqZWN0ID0gX1NoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3Q7XHJcbmV4cG9ydCB0eXBlIFNoYWRlclZhcnlpbmdPYmplY3QgPSBfU2hhZGVyVmFyeWluZ09iamVjdDtcclxuZXhwb3J0IHR5cGUgU2hhZGVyVmVyc2lvbiA9IF9TaGFkZXJWZXJzaW9uO1xyXG5leHBvcnQgdHlwZSBUZW1wbGF0ZU9iamVjdCA9IF9UZW1wbGF0ZU9iamVjdDtcclxuZXhwb3J0IHR5cGUgVW5pZm9ybVNlbWFudGljcyA9IF9Vbmlmb3JtU2VtYW50aWNzO1xyXG5leHBvcnQgdHlwZSBWYXJUeXBlID0gX1ZhclR5cGU7XHJcbmV4cG9ydCB0eXBlIFNoYWRlcml0eU9iamVjdENyZWF0b3IgPSBfU2hhZGVyaXR5T2JqZWN0Q3JlYXRvcjtcclxuZXhwb3J0IHR5cGUgUmVmbGVjdGlvbiA9IF9SZWZsZWN0aW9uO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2hhZGVyaXR5XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZVByb2Nlc3NvciB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZGVmaW5pdGlvbnM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBldmFsdWF0ZUNvbmRpdGlvbihjb25kaXRpb246IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICAvLyDmlbDlgKTmr5TovIPjga7mraPopo/ooajnj75cbiAgICAgICAgY29uc3QgbnVtZXJpY0NvbXBhcmlzb24gPSAvKFxcdyspXFxzKig9PXwhPXw+fDx8Pj18PD0pXFxzKihcXGQrKS9nO1xuICAgICAgICAvLyBkZWZpbmVkKCnjg4Hjgqfjg4Pjgq/jga7mraPopo/ooajnj75cbiAgICAgICAgY29uc3QgZGVmaW5lZENoZWNrID0gL2RlZmluZWRcXHMqXFwoXFxzKihcXHcrKVxccypcXCkvZztcbiAgICAgICAgLy8gIWRlZmluZWQoKeODgeOCp+ODg+OCr+OBruato+imj+ihqOePvlxuICAgICAgICBjb25zdCBub3REZWZpbmVkQ2hlY2sgPSAvIVxccypkZWZpbmVkXFxzKlxcKFxccyooXFx3KylcXHMqXFwpL2c7XG5cbiAgICAgICAgLy8g5p2h5Lu25byP44KS6KmV5L6h5Y+v6IO944Gq5b2i5byP44Gr5aSJ5o+bXG4gICAgICAgIGxldCBldmFsdWF0YWJsZUNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcblxuICAgICAgICAvLyBkZWZpbmVkKCnjga7oqZXkvqFcbiAgICAgICAgZXZhbHVhdGFibGVDb25kaXRpb24gPSBldmFsdWF0YWJsZUNvbmRpdGlvbi5yZXBsYWNlKGRlZmluZWRDaGVjaywgKF8sIG5hbWUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZmluaXRpb25zLmhhcyhuYW1lKSA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICFkZWZpbmVkKCnjga7oqZXkvqFcbiAgICAgICAgZXZhbHVhdGFibGVDb25kaXRpb24gPSBldmFsdWF0YWJsZUNvbmRpdGlvbi5yZXBsYWNlKG5vdERlZmluZWRDaGVjaywgKF8sIG5hbWUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZmluaXRpb25zLmhhcyhuYW1lKSA/ICdmYWxzZScgOiAndHJ1ZSc7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOaVsOWApOavlOi8g+OBruipleS+oVxuICAgICAgICBldmFsdWF0YWJsZUNvbmRpdGlvbiA9IGV2YWx1YXRhYmxlQ29uZGl0aW9uLnJlcGxhY2UobnVtZXJpY0NvbXBhcmlzb24sIChtYXRjaCwgdmFyTmFtZSwgb3BlcmF0b3IsIHZhbHVlU3RyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZWZpbmVkVmFsdWUgPSB0aGlzLmRlZmluaXRpb25zLmdldCh2YXJOYW1lKTtcbiAgICAgICAgICAgIGlmIChkZWZpbmVkVmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuICdmYWxzZSc7XG5cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlMSA9IHBhcnNlSW50KGRlZmluZWRWYWx1ZSk7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZTIgPSBwYXJzZUludCh2YWx1ZVN0cik7XG5cbiAgICAgICAgICAgIHN3aXRjaCAob3BlcmF0b3IpIHtcbiAgICAgICAgICAgICAgICBjYXNlICc9PSc6IHJldHVybiB2YWx1ZTEgPT09IHZhbHVlMiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgY2FzZSAnIT0nOiByZXR1cm4gdmFsdWUxICE9PSB2YWx1ZTIgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgICAgICAgICAgICAgIGNhc2UgJz4nOiByZXR1cm4gdmFsdWUxID4gdmFsdWUyID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjYXNlICc8JzogcmV0dXJuIHZhbHVlMSA8IHZhbHVlMiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgY2FzZSAnPj0nOiByZXR1cm4gdmFsdWUxID49IHZhbHVlMiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgY2FzZSAnPD0nOiByZXR1cm4gdmFsdWUxIDw9IHZhbHVlMiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuICdmYWxzZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOirlueQhua8lOeul+WtkOOBruipleS+oVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8g5a6J5YWo44Gq6KmV5L6h44Gu44Gf44KB44CB5p2h5Lu25byP44KS5qSc6Ki8XG4gICAgICAgICAgICBpZiAoIS9eW2EtekEtWjAtOVxcc1xcKFxcKSEmfF0rJC8udGVzdChldmFsdWF0YWJsZUNvbmRpdGlvbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29uZGl0aW9uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOirlueQhua8lOeul+WtkOOBruWJjeW+jOOBq+OCueODmuODvOOCueOCkui/veWKoFxuICAgICAgICAgICAgZXZhbHVhdGFibGVDb25kaXRpb24gPSBldmFsdWF0YWJsZUNvbmRpdGlvblxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8mJi9nLCAnICYmICcpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcfFxcfC9nLCAnIHx8ICcpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLyEvZywgJyAhICcpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccysvZywgJyAnKVxuICAgICAgICAgICAgICAgIC50cmltKCk7XG5cbiAgICAgICAgICAgIC8vIEphdmFTY3JpcHTjga7oq5bnkIblvI/jgajjgZfjgaboqZXkvqFcbiAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbihgcmV0dXJuICR7ZXZhbHVhdGFibGVDb25kaXRpb259YCkoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGV2YWx1YXRpbmcgY29uZGl0aW9uOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgcHJvY2VzcyhzcGxpdHRlZExpbmVzOiBzdHJpbmdbXSwgZGVmaW5pdGlvbnM6IHN0cmluZ1tdID0gW10sIHN0YXJ0TGluZVN0cj86IHN0cmluZywgZW5kTGluZVN0cj86IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3QgZGVmaW5lID0gLyNkZWZpbmVbXFx0IF0rKFxcdyspKD86W1xcdCBdKyhcXFMrKSk/LztcbiAgICAgICAgY29uc3QgaWZkZWYgPSAvI2lmZGVmW1xcdCBdKyhcXHcrKS87XG4gICAgICAgIGNvbnN0IGlmbmRlZiA9IC8jaWZuZGVmW1xcdCBdKyhcXHcrKS87XG4gICAgICAgIGNvbnN0IF9pZiA9IC8jaWZbXFx0IF0rKC4rKS87XG4gICAgICAgIGNvbnN0IGVsaWYgPSAvI2VsaWZbXFx0IF0rKC4rKS87XG4gICAgICAgIGNvbnN0IF9lbHNlID0gLyNlbHNlLztcbiAgICAgICAgY29uc3QgZW5kaWYgPSAvI2VuZGlmLztcbiAgICAgICAgY29uc3QgcHJldmlvdXNPdXRwdXRTdGF0ZXM6IGJvb2xlYW5bXSA9IFtdO1xuICAgICAgICBsZXQgb3V0cHV0RmxnID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgaWZkZWZzOiBzdHJpbmdbXVtdID0gW107XG4gICAgICAgIGNvbnN0IGlmZGVmTWF0Y2hlZDogYm9vbGVhbltdID0gW107XG4gICAgICAgIGNvbnN0IG91dHB1dExpbmVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIHRoaXMuZGVmaW5pdGlvbnMuY2xlYXIoKTtcbiAgICAgICAgZm9yIChjb25zdCBkZWZpbml0aW9uIG9mIGRlZmluaXRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmluaXRpb25zLnNldChkZWZpbml0aW9uLCBcIjFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc3RhcnRMaW5lID0gMDtcbiAgICAgICAgbGV0IGVuZExpbmUgPSBzcGxpdHRlZExpbmVzLmxlbmd0aDtcbiAgICAgICAgaWYgKHN0YXJ0TGluZVN0cikge1xuICAgICAgICAgICAgc3RhcnRMaW5lID0gc3BsaXR0ZWRMaW5lcy5maW5kSW5kZXgobGluZSA9PiBsaW5lLmluY2x1ZGVzKHN0YXJ0TGluZVN0cikpO1xuICAgICAgICAgICAgaWYgKHN0YXJ0TGluZSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3BsaXR0ZWRMaW5lcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kTGluZVN0cikge1xuICAgICAgICAgICAgZW5kTGluZSA9IHNwbGl0dGVkTGluZXMuZmluZEluZGV4KGxpbmUgPT4gbGluZS5pbmNsdWRlcyhlbmRMaW5lU3RyKSk7XG4gICAgICAgICAgICBpZiAoZW5kTGluZSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3BsaXR0ZWRMaW5lcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0TGluZTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gc3BsaXR0ZWRMaW5lc1tpXTtcbiAgICAgICAgICAgIG91dHB1dExpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0TGluZTsgaSA8IGVuZExpbmU7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHNwbGl0dGVkTGluZXNbaV07XG4gICAgICAgICAgICBsZXQgaXNDb25kaWl0b24gPSBmYWxzZTtcblxuICAgICAgICAgICAgeyAvLyAjZGVmaW5lXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBsaW5lLm1hdGNoKGRlZmluZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW18sIG5hbWUsIHZhbHVlID0gXCIxXCJdID0gcmU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5pdGlvbnMuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2lmZGVmLCAjaWZuZGVmLCAjaWZcbiAgICAgICAgICAgICAgICBjb25zdCByZUlmZGVmID0gbGluZS5tYXRjaChpZmRlZik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVJZm5kZWYgPSBsaW5lLm1hdGNoKGlmbmRlZik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVJZiA9IGxpbmUubWF0Y2goX2lmKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZUlmZGVmIHx8IHJlSWZuZGVmIHx8IHJlSWYpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNPdXRwdXRTdGF0ZXMucHVzaChvdXRwdXRGbGcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29uZGl0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAocmVJZmRlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uID0gYGRlZmluZWQoJHtyZUlmZGVmWzFdfSlgO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlSWZuZGVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb24gPSBgIWRlZmluZWQoJHtyZUlmbmRlZlsxXX0pYDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZUlmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb24gPSByZUlmWzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWZkZWZzLnB1c2goW2NvbmRpdGlvbl0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dEZsZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gdGhpcy5ldmFsdWF0ZUNvbmRpdGlvbihjb25kaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWZkZWZNYXRjaGVkLnB1c2gob3V0cHV0RmxnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmZGVmTWF0Y2hlZC5wdXNoKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpc0NvbmRpaXRvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB7IC8vICNlbGlmXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSBsaW5lLm1hdGNoKGVsaWYpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHJlWzFdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SWZkZWZzID0gaWZkZWZzW2lmZGVmcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c091dHB1dFN0YXRlc1twcmV2aW91c091dHB1dFN0YXRlcy5sZW5ndGggLSAxXSAmJiAhaWZkZWZNYXRjaGVkW2lmZGVmTWF0Y2hlZC5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gdGhpcy5ldmFsdWF0ZUNvbmRpdGlvbihjb25kaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dEZsZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmZGVmTWF0Y2hlZFtpZmRlZk1hdGNoZWQubGVuZ3RoIC0gMV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudElmZGVmcy5wdXNoKGNvbmRpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlzQ29uZGlpdG9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHsgLy8gI2Vsc2VcbiAgICAgICAgICAgICAgICBjb25zdCByZSA9IGxpbmUubWF0Y2goX2Vsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c091dHB1dFN0YXRlc1twcmV2aW91c091dHB1dFN0YXRlcy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gIWlmZGVmTWF0Y2hlZFtpZmRlZk1hdGNoZWQubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRGbGcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpc0NvbmRpaXRvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB7IC8vICNlbmRpZlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlID0gbGluZS5tYXRjaChlbmRpZik7XG4gICAgICAgICAgICAgICAgaWYgKHJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0RmxnID0gcHJldmlvdXNPdXRwdXRTdGF0ZXNbcHJldmlvdXNPdXRwdXRTdGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGlzQ29uZGlpdG9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWZkZWZzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZmRlZk1hdGNoZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzT3V0cHV0U3RhdGVzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG91dHB1dEZsZyAmJiAhaXNDb25kaWl0b24pIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBlbmRMaW5lOyBpIDwgc3BsaXR0ZWRMaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHNwbGl0dGVkTGluZXNbaV07XG4gICAgICAgICAgICBvdXRwdXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXRMaW5lcztcbiAgICB9XG59XG5cbiIsImltcG9ydCB7XG5cdEF0dHJpYnV0ZVNlbWFudGljcyxcblx0UmVmbGVjdGlvbkF0dHJpYnV0ZSxcblx0UmVmbGVjdGlvblVuaWZvcm0sXG5cdFJlZmxlY3Rpb25WYXJ5aW5nLFxuXHRTaGFkZXJTdGFnZVN0cixcblx0VW5pZm9ybVNlbWFudGljcyxcblx0VmFyVHlwZSxcbn0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBnZXRzIHRoZSBhdHRyaWJ1dGUsIHZhcnlpbmcsIGFuZCB1bmlmb3JtIGluZm9ybWF0aW9uIGZyb20gdGhlIGNvZGUgcHJvcGVydHkgb2YgYSBzaGFkZXJpdHkgb2JqZWN0LlxuICogVGhlIG1ldGhvZHMgb2YgdGhlIFNoYWRlcml0eSBpbnN0YW5jZSBjcmVhdGUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcy5cbiAqXG4gKiBCZWZvcmUgZ2V0dGluZyB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIGF0dHJpYnV0ZSwgdmFyeWluZywgYW5kIHVuaWZvcm0sIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZmxlY3Rpb24ge1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBhdHRyaWJ1dGVBbmRWYXJ5aW5nVHlwZVJlZ0V4cFxuXHRcdD0gL1tcXHQgXSsoZmxvYXR8aW50fHVpbnR8dmVjMnx2ZWMzfHZlYzR8bWF0MnxtYXQzfG1hdDR8aXZlYzJ8aXZlYzN8aXZlYzR8dXZlYzJ8dXZlYzN8dXZlYzQpW1xcdCBdKyhcXHcrKTsvO1xuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSB1bmlmb3JtVHlwZVJlZ0V4cFxuXHRcdD0gL1tcXHQgXSsoZmxvYXR8aW50fHVpbnR8dmVjMnx2ZWMzfHZlYzR8bWF0MnxtYXQzfG1hdDR8aXZlYzJ8aXZlYzN8aXZlYzR8dXZlYzJ8dXZlYzN8dXZlYzR8c2FtcGxlcjJEfHNhbXBsZXJDdWJlfHNhbXBsZXIzRClbXFx0IF0rKFxcdyspOy87XG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHNlbWFudGljUmVnRXhwID0gLzwuKnNlbWFudGljW1xcdCBdKj1bXFx0IF0qKFxcdyspLio+LztcblxuXHRwcml2YXRlIF9fYXR0cmlidXRlU2VtYW50aWNzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblx0cHJpdmF0ZSBfX3VuaWZvcm1TZW1hbnRpY3NNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXHRwcml2YXRlIF9fYXR0cmlidXRlczogUmVmbGVjdGlvbkF0dHJpYnV0ZVtdID0gW107XG5cdHByaXZhdGUgX192YXJ5aW5nczogUmVmbGVjdGlvblZhcnlpbmdbXSA9IFtdO1xuXHRwcml2YXRlIF9fdW5pZm9ybXM6IFJlZmxlY3Rpb25Vbmlmb3JtW10gPSBbXTtcblxuXHRwcml2YXRlIHJlYWRvbmx5IF9fc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXTtcblx0cHJpdmF0ZSByZWFkb25seSBfX3NoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cjtcblxuXHRjb25zdHJ1Y3RvcihzcGxpdHRlZFNoYWRlcml0eVNoYWRlckNvZGU6IHN0cmluZ1tdLCBzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHR0aGlzLl9fc3BsaXR0ZWRTaGFkZXJDb2RlID0gc3BsaXR0ZWRTaGFkZXJpdHlTaGFkZXJDb2RlO1xuXHRcdHRoaXMuX19zaGFkZXJTdGFnZSA9IHNoYWRlclN0YWdlO1xuXHRcdHRoaXMuX19zZXREZWZhdWx0QXR0cmlidXRlQW5kVW5pZm9ybVNlbWFudGljc01hcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYWxsIGF0dHJpYnV0ZSB2YXJpYWJsZSBpbmZvcm1hdGlvbiBpbiB0aGUgc2hhZGVyIGNvZGUuXG5cdCAqIEJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbmVlZCB0byBjYWxsIHRoZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGluc3RhbmNlLlxuXHQgKiBAcmV0dXJucyBBcnJheSBvZiBSZWZsZWN0aW9uQXR0cmlidXRlIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCBhdHRyaWJ1dGVzKCkge1xuXHRcdHJldHVybiB0aGlzLl9fYXR0cmlidXRlcztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFsbCB2YXJ5aW5nIHZhcmlhYmxlIGluZm9ybWF0aW9uIGluIHRoZSBzaGFkZXIgY29kZS5cblx0ICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBuZWVkIHRvIGNhbGwgdGhlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgaW5zdGFuY2UuXG5cdCAqIEByZXR1cm5zIEFycmF5IG9mIFJlZmxlY3Rpb25WYXJ5aW5nIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCB2YXJ5aW5ncygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX3ZhcnlpbmdzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYWxsIHVuaWZvcm0gdmFyaWFibGUgaW5mb3JtYXRpb24gaW4gdGhlIHNoYWRlciBjb2RlLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgUmVmbGVjdGlvblVuaWZvcm0gb2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHVuaWZvcm1zKCkge1xuXHRcdHJldHVybiB0aGlzLl9fdW5pZm9ybXM7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBuYW1lcyBvZiBhbGwgYXR0cmlidXRlcyBpbmNsdWRlZCBpbiB0aGUgc2hhZGVyLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2Ygc3RyaW5nXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGF0dHJpYnV0ZXNOYW1lcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2F0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtyZXR1cm4gYXR0cmlidXRlLm5hbWV9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIGF0dHJpYnV0ZSBzZW1hbnRpYyAoZS5nLiAnUE9TSVRJT04nKSBvZiBhbGwgYXR0cmlidXRlcyBpbmNsdWRlZCBpbiB0aGUgc2hhZGVyLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgQXR0cmlidXRlU2VtYW50aWNzIG9iamVjdFxuXHQgKi9cblx0cHVibGljIGdldCBhdHRyaWJ1dGVzU2VtYW50aWNzKCkge1xuXHRcdHJldHVybiB0aGlzLl9fYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge3JldHVybiBhdHRyaWJ1dGUuc2VtYW50aWN9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIHZhcmlhYmxlIHR5cGUgKGUuZy4gJ3ZlYzQnKSBvZiBhbGwgYXR0cmlidXRlcyBpbmNsdWRlZCBpbiB0aGUgc2hhZGVyLlxuXHQgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG5lZWQgdG8gY2FsbCB0aGUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICogQHJldHVybnMgQXJyYXkgb2YgVmFyVHlwZSBvYmplY3Rcblx0ICovXG5cdHB1YmxpYyBnZXQgYXR0cmlidXRlc1R5cGVzKCkge1xuXHRcdHJldHVybiB0aGlzLl9fYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge3JldHVybiBhdHRyaWJ1dGUudHlwZX0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZCBhbiBhdHRyaWJ1dGVTZW1hbnRpY3MuXG5cdCAqIFRoZSBhdHRyaWJ1dGVTZW1hbnRpY3MgaXMgdXNlZCBpbiB0aGUgUmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpY3Ncblx0ICogKFNlZSByZWZsZWN0IG1ldGhvZCBvZiB0aGlzIGNsYXNzKVxuXHQgKi9cblx0cHVibGljIGFkZEF0dHJpYnV0ZVNlbWFudGljc01hcChtYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4pIHtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwID0gbmV3IE1hcChbLi4udGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcCwgLi4ubWFwXSk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkIGEgdW5pZm9ybVNlbWFudGljcy5cblx0ICogVGhlIGF0dHJpYnV0ZVNlbWFudGljcyBpcyB1c2VkIGluIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlLnNlbWFudGljc1xuXHQgKiAoU2VlIHJlZmxlY3QgbWV0aG9kIG9mIHRoaXMgY2xhc3MpXG5cdCAqL1xuXHRwdWJsaWMgYWRkVW5pZm9ybVNlbWFudGljc01hcChtYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4pIHtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcCA9IG5ldyBNYXAoWy4uLnRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLCAuLi5tYXBdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYW4gYXR0cmlidXRlU2VtYW50aWNzLlxuXHQgKiBUaGUgYXR0cmlidXRlU2VtYW50aWNzIGlzIHVzZWQgaW4gdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWNzXG5cdCAqIChTZWUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBjbGFzcylcblx0ICovXG5cdHB1YmxpYyBhZGRBdHRyaWJ1dGVTZW1hbnRpY3Moa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldChrZXksIHZhbHVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGQgYSB1bmlmb3JtU2VtYW50aWNzLlxuXHQgKiBUaGUgYXR0cmlidXRlU2VtYW50aWNzIGlzIHVzZWQgaW4gdGhlIFJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWNzXG5cdCAqIChTZWUgcmVmbGVjdCBtZXRob2Qgb2YgdGhpcyBjbGFzcylcblx0ICovXG5cdHB1YmxpYyBhZGRVbmlmb3JtU2VtYW50aWNzKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KGtleSwgdmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgYXR0cmlidXRlU2VtYW50aWNzXG5cdCAqL1xuXHRwdWJsaWMgcmVzZXRBdHRyaWJ1dGVTZW1hbnRpY3MoKSB7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB1bmlmb3JtU2VtYW50aWNzXG5cdCAqL1xuXHRwdWJsaWMgcmVzZXRVbmlmb3JtU2VtYW50aWNzKCkge1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBbmFseXplIHNoYWRlciBjb2RlIG9mIHRoZSBzaGFkZXJpdHkgYW5kIGdldCBpbmZvcm1hdGlvbiBvZiBhdHRyaWJ1dGUsIHZhcnlpbmcgYW5kIHVuaWZvcm0uXG5cdCAqIFRoZSBpbmZvcm1hdGlvbiBjYW4gYmUgcmV0cmlldmVkIGZyb20gdGhlIGdldCBtZXRob2Qgb2YgdGhpcyBpbnN0YW5jZS5cblx0ICpcblx0ICogVGhlIHNlbWFudGljIHByb3BlcnR5IG9mIHRoZSBSZWZsZWN0aW9uQXR0cmlidXRlIGlzIGFzc2lnbmVkIHRvIHRoZSB2YWx1ZSBvZiB0aGUgc2VtYW50aWMgaWZcblx0ICogaXQgaXMgc3BlY2lmaWVkIGluIHRoZSBhdHRyaWJ1dGUgbGluZSBvZiB0aGUgc2hhZGVyIGNvZGUuIElmIG5vdCwgdGhlIEF0dHJpYnV0ZVNlbWFudGljc01hcFxuXHQgKiBpcyBzZWFyY2hlZCBmb3IgbWF0Y2hpbmcgc2VtYW50aWNzLCBvciBVTktOT1dOLiBUaGUgc2FtZSBhcHBsaWVzIHRvIHRoZSBzZW1hbnRpYyBwcm9wZXJ0eSBvZlxuXHQgKiBSZWZsZWN0aW9uVW5pZm9ybS5cblx0ICovXG5cdHB1YmxpYyByZWZsZWN0KCkge1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IHRoaXMuX19zcGxpdHRlZFNoYWRlckNvZGU7XG5cdFx0Y29uc3Qgc2hhZGVyU3RhZ2UgPSB0aGlzLl9fc2hhZGVyU3RhZ2U7XG5cblx0XHRmb3IgKGNvbnN0IHNoYWRlckNvZGVMaW5lIG9mIHNwbGl0dGVkU2hhZGVyQ29kZSkge1xuXHRcdFx0Y29uc3QgaXNBdHRyaWJ1dGVMaW5lID0gdGhpcy5fX21hdGNoQXR0cmlidXRlKHNoYWRlckNvZGVMaW5lLCBzaGFkZXJTdGFnZSk7XG5cdFx0XHRpZiAoaXNBdHRyaWJ1dGVMaW5lKSB7XG5cdFx0XHRcdHRoaXMuX19hZGRBdHRyaWJ1dGUoc2hhZGVyQ29kZUxpbmUpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaXNWYXJ5aW5nTGluZSA9IHRoaXMuX19tYXRjaFZhcnlpbmcoc2hhZGVyQ29kZUxpbmUsIHNoYWRlclN0YWdlKTtcblx0XHRcdGlmIChpc1ZhcnlpbmdMaW5lKSB7XG5cdFx0XHRcdHRoaXMuX19hZGRWYXJ5aW5nKHNoYWRlckNvZGVMaW5lLCBzaGFkZXJTdGFnZSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpc1VuaWZvcm1MaW5lID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qdW5pZm9ybVtcXHQgXSsvKTtcblx0XHRcdGlmIChpc1VuaWZvcm1MaW5lKSB7XG5cdFx0XHRcdHRoaXMuX19hZGRVbmlmb3JtKHNoYWRlckNvZGVMaW5lKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfX3NldERlZmF1bHRBdHRyaWJ1dGVBbmRVbmlmb3JtU2VtYW50aWNzTWFwKCkge1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdwb3NpdGlvbicsICdQT1NJVElPTicpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdjb2xvciQnLCAnQ09MT1JfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdjb2xvcl8/MCcsICdDT0xPUl8wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RleGNvb3JkJCcsICdURVhDT09SRF8wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3RleGNvb3JkXz8wJywgJ1RFWENPT1JEXzAnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGV4Y29vcmRfPzEnLCAnVEVYQ09PUkRfMScpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCd0ZXhjb29yZF8/MicsICdURVhDT09SRF8yJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ25vcm1hbCcsICdOT1JNQUwnKTtcblx0XHR0aGlzLl9fYXR0cmlidXRlU2VtYW50aWNzTWFwLnNldCgndGFuZ2VudCcsICdUQU5HRU5UJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ2pvaW50JCcsICdKT0lOVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdib25lJCcsICdKT0lOVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdqb2ludF8/MCcsICdKT0lOVFNfMCcpO1xuXHRcdHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXAuc2V0KCdib25lXz8wJywgJ0pPSU5UU18wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3dlaWdodCQnLCAnV0VJR0hUU18wJyk7XG5cdFx0dGhpcy5fX2F0dHJpYnV0ZVNlbWFudGljc01hcC5zZXQoJ3dlaWdodF8/MCcsICdXRUlHSFRTXzAnKTtcblxuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgnd29ybGRtYXRyaXgnLCAnV29ybGRNYXRyaXgnKTtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ25vcm1hbG1hdHJpeCcsICdOb3JtYWxNYXRyaXgnKTtcblx0XHR0aGlzLl9fdW5pZm9ybVNlbWFudGljc01hcC5zZXQoJ3ZpZXdtYXRyaXgnLCAnVmlld01hdHJpeCcpO1xuXHRcdHRoaXMuX191bmlmb3JtU2VtYW50aWNzTWFwLnNldCgncHJvamVjdGlvbm1hdHJpeCcsICdQcm9qZWN0aW9uTWF0cml4Jyk7XG5cdFx0dGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXAuc2V0KCdtb2RlbHZpZXdtYXRyaXgnLCAnTW9kZWxWaWV3TWF0cml4Jyk7XG5cdH1cblxuXHRwcml2YXRlIF9fbWF0Y2hBdHRyaWJ1dGUoc2hhZGVyQ29kZUxpbmU6IHN0cmluZywgc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKSB7XG5cdFx0aWYgKHNoYWRlclN0YWdlICE9PSAndmVydGV4Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gc2hhZGVyQ29kZUxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qKGF0dHJpYnV0ZXxpbilbXFx0IF0rLis7Lyk7XG5cdH1cblxuXHRwcml2YXRlIF9fYWRkQXR0cmlidXRlKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcpIHtcblx0XHRjb25zdCByZWZsZWN0aW9uQXR0cmlidXRlOiBSZWZsZWN0aW9uQXR0cmlidXRlID0ge1xuXHRcdFx0bmFtZTogJycsXG5cdFx0XHR0eXBlOiAnZmxvYXQnLFxuXHRcdFx0c2VtYW50aWM6ICdVTktOT1dOJ1xuXHRcdH07XG5cblx0XHRjb25zdCBtYXRjaFR5cGUgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLmF0dHJpYnV0ZUFuZFZhcnlpbmdUeXBlUmVnRXhwKTtcblx0XHRpZiAobWF0Y2hUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gbWF0Y2hUeXBlWzFdO1xuXHRcdFx0cmVmbGVjdGlvbkF0dHJpYnV0ZS50eXBlID0gdHlwZSBhcyBWYXJUeXBlO1xuXHRcdFx0Y29uc3QgbmFtZSA9IG1hdGNoVHlwZVsyXTtcblx0XHRcdHJlZmxlY3Rpb25BdHRyaWJ1dGUubmFtZSA9IG5hbWU7XG5cblx0XHRcdGNvbnN0IG1hdGNoU2VtYW50aWMgPSBzaGFkZXJDb2RlTGluZS5tYXRjaChSZWZsZWN0aW9uLnNlbWFudGljUmVnRXhwKVxuXHRcdFx0aWYgKG1hdGNoU2VtYW50aWMpIHtcblx0XHRcdFx0cmVmbGVjdGlvbkF0dHJpYnV0ZS5zZW1hbnRpYyA9IG1hdGNoU2VtYW50aWNbMV0gYXMgQXR0cmlidXRlU2VtYW50aWNzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHRoaXMuX19hdHRyaWJ1dGVTZW1hbnRpY3NNYXApIHtcblx0XHRcdFx0XHRpZiAobmFtZS5tYXRjaChuZXcgUmVnRXhwKGtleSwgJ2knKSkpIHtcblx0XHRcdFx0XHRcdHJlZmxlY3Rpb25BdHRyaWJ1dGUuc2VtYW50aWMgPSB2YWx1ZSBhcyBBdHRyaWJ1dGVTZW1hbnRpY3M7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuX19hdHRyaWJ1dGVzLnB1c2gocmVmbGVjdGlvbkF0dHJpYnV0ZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fbWF0Y2hWYXJ5aW5nKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcsIHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdGlmIChzaGFkZXJTdGFnZSA9PT0gJ3ZlcnRleCcpIHtcblx0XHRcdHJldHVybiBzaGFkZXJDb2RlTGluZS5tYXRjaCgvXig/IVtcXC9dKVtcXHQgXSoodmFyeWluZ3xvdXQpW1xcdCBdKy4rOy8pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gc2hhZGVyQ29kZUxpbmUubWF0Y2goL14oPyFbXFwvXSlbXFx0IF0qKHZhcnlpbmd8aW4pW1xcdCBdKy4rOy8pO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX19hZGRWYXJ5aW5nKHNoYWRlckNvZGVMaW5lOiBzdHJpbmcsIHNoYWRlclN0YWdlOiBTaGFkZXJTdGFnZVN0cikge1xuXHRcdGNvbnN0IHJlZmxlY3Rpb25WYXJ5aW5nOiBSZWZsZWN0aW9uVmFyeWluZyA9IHtcblx0XHRcdG5hbWU6ICcnLFxuXHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdGlub3V0OiAnaW4nXG5cdFx0fTtcblxuXHRcdGNvbnN0IG1hdGNoVHlwZSA9IHNoYWRlckNvZGVMaW5lLm1hdGNoKFJlZmxlY3Rpb24uYXR0cmlidXRlQW5kVmFyeWluZ1R5cGVSZWdFeHApO1xuXHRcdGlmIChtYXRjaFR5cGUpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBtYXRjaFR5cGVbMV07XG5cdFx0XHRyZWZsZWN0aW9uVmFyeWluZy50eXBlID0gdHlwZSBhcyBWYXJUeXBlO1xuXHRcdFx0Y29uc3QgbmFtZSA9IG1hdGNoVHlwZVsyXTtcblx0XHRcdHJlZmxlY3Rpb25WYXJ5aW5nLm5hbWUgPSBuYW1lO1xuXHRcdFx0cmVmbGVjdGlvblZhcnlpbmcuaW5vdXQgPSAoc2hhZGVyU3RhZ2UgPT09ICd2ZXJ0ZXgnKSA/ICdvdXQnIDogJ2luJztcblx0XHR9XG5cdFx0dGhpcy5fX3ZhcnlpbmdzLnB1c2gocmVmbGVjdGlvblZhcnlpbmcpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2FkZFVuaWZvcm0oc2hhZGVyQ29kZUxpbmU6IHN0cmluZykge1xuXHRcdGNvbnN0IHJlZmxlY3Rpb25Vbmlmb3JtOiBSZWZsZWN0aW9uVW5pZm9ybSA9IHtcblx0XHRcdG5hbWU6ICcnLFxuXHRcdFx0dHlwZTogJ2Zsb2F0Jyxcblx0XHRcdHNlbWFudGljOiAnVU5LTk9XTidcblx0XHR9O1xuXG5cdFx0Y29uc3QgbWF0Y2hUeXBlID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi51bmlmb3JtVHlwZVJlZ0V4cCk7XG5cdFx0aWYgKG1hdGNoVHlwZSkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IG1hdGNoVHlwZVsxXTtcblx0XHRcdHJlZmxlY3Rpb25Vbmlmb3JtLnR5cGUgPSB0eXBlIGFzIFZhclR5cGU7XG5cdFx0XHRjb25zdCBuYW1lID0gbWF0Y2hUeXBlWzJdO1xuXHRcdFx0cmVmbGVjdGlvblVuaWZvcm0ubmFtZSA9IG5hbWU7XG5cblx0XHRcdGNvbnN0IG1hdGNoU2VtYW50aWNzID0gc2hhZGVyQ29kZUxpbmUubWF0Y2goUmVmbGVjdGlvbi5zZW1hbnRpY1JlZ0V4cClcblx0XHRcdGlmIChtYXRjaFNlbWFudGljcykge1xuXHRcdFx0XHRyZWZsZWN0aW9uVW5pZm9ybS5zZW1hbnRpYyA9IG1hdGNoU2VtYW50aWNzWzFdIGFzIFVuaWZvcm1TZW1hbnRpY3M7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgdGhpcy5fX3VuaWZvcm1TZW1hbnRpY3NNYXApIHtcblx0XHRcdFx0XHRpZiAobmFtZS5tYXRjaChuZXcgUmVnRXhwKGtleSwgJ2knKSkpIHtcblx0XHRcdFx0XHRcdHJlZmxlY3Rpb25Vbmlmb3JtLnNlbWFudGljID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuX191bmlmb3Jtcy5wdXNoKHJlZmxlY3Rpb25Vbmlmb3JtKTtcblx0fVxufTsiLCJpbXBvcnQge1RlbXBsYXRlT2JqZWN0fSBmcm9tICcuLi90eXBlcy90eXBlJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGVkaXRzIHRoZSBjb2RlIHByb3BlcnR5IG9mIGEgc2hhZGVyaXR5IG9iamVjdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhZGVyRWRpdG9yIHtcblx0c3RhdGljIF9pbnNlcnREZWZpbml0aW9uKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGRlZmluaXRpb246IHN0cmluZykge1xuXHRcdGNvbnN0IGRlZlN0ciA9IGRlZmluaXRpb24ucmVwbGFjZSgvI2RlZmluZVtcXHQgXSsvLCAnJyk7XG5cblx0XHRzcGxpdHRlZFNoYWRlckNvZGUudW5zaGlmdChgI2RlZmluZSAke2RlZlN0cn1gKTtcblx0fVxuXG5cdHN0YXRpYyBfZmlsbFRlbXBsYXRlKHNoYWRlckNvZGU6IHN0cmluZywgdGVtcGxhdGVPYmplY3Q6IFRlbXBsYXRlT2JqZWN0KSB7XG5cdFx0Y29uc3QgdGVtcGxhdGVTdHJpbmcgPSBzaGFkZXJDb2RlLnJlcGxhY2UoL1xcL1xcKltcXHQgXSpzaGFkZXJpdHk6W1xcdCBdKihAe1tcXHQgXSopKFxcUyspKFtcXHQgXSp9KVtcXHQgXSpcXCpcXC8vZywgJyR7dGhpcy4kMn0nKTtcblxuXHRcdGNvbnN0IHJlc3VsdENvZGUgPSBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gYFwiICsgdGVtcGxhdGVTdHJpbmcgKyBcImA7XCIpLmNhbGwodGVtcGxhdGVPYmplY3QpO1xuXHRcdHJldHVybiByZXN1bHRDb2RlO1xuXHR9XG59IiwiaW1wb3J0IHtTaGFkZXJWZXJzaW9ufSBmcm9tICcuLi90eXBlcy90eXBlJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGNvbnZlcnRzIHRoZSBjb2RlIHByb3BlcnR5IG9mIGEgc2hhZGVyaXR5IG9iamVjdCB0byB0aGUgc3BlY2lmaWVkIGZvcm1hdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hhZGVyVHJhbnNmb3JtZXIge1xuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBFUzMgc2hhZGVyIGNvZGUgdG8gYSBHTFNMIEVTMSBzaGFkZXIgY29kZVxuXHQgKi9cblx0c3RhdGljIF90cmFuc2Zvcm1Ub0dMU0xFUzEoXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSxcblx0XHRpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuLFxuXHRcdGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW5cblx0KSB7XG5cdFx0dGhpcy5fX2NvbnZlcnRPckluc2VydFZlcnNpb25HTFNMRVMxKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX3JlbW92ZUVTM1F1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGUsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdHRoaXMuX19jb252ZXJ0SW4oc3BsaXR0ZWRTaGFkZXJDb2RlLCBpc0ZyYWdtZW50U2hhZGVyKTtcblx0XHR0aGlzLl9fY29udmVydE91dChzcGxpdHRlZFNoYWRlckNvZGUsIGlzRnJhZ21lbnRTaGFkZXIsIGVtYmVkRXJyb3JzSW5PdXRwdXQpO1xuXHRcdHRoaXMuX19yZW1vdmVQcmVjaXNpb25Gb3JFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmVGdW5jdGlvblRvRVMxKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlciwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0Y29uc3QgdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUgPSBzcGxpdHRlZFNoYWRlckNvZGU7XG5cblx0XHRyZXR1cm4gdHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVHJhbnNsYXRlIGEgR0xTTCBFUzEgc2hhZGVyIGNvZGUgdG8gYSBHTFNMIEVTMyBzaGFkZXIgY29kZVxuXHQgKi9cblx0c3RhdGljIF90cmFuc2Zvcm1Ub0dMU0xFUzMoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgaXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbikge1xuXHRcdHRoaXMuX19jb252ZXJ0T3JJbnNlcnRWZXJzaW9uR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0QXR0cmlidXRlKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0dGhpcy5fX2NvbnZlcnRWYXJ5aW5nKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlQ3ViZShzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHRcdHRoaXMuX19jb252ZXJ0VGV4dHVyZTJEKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlMkRQcm9kKHNwbGl0dGVkU2hhZGVyQ29kZSk7XG5cdFx0dGhpcy5fX2NvbnZlcnRUZXh0dXJlM0Qoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHR0aGlzLl9fY29udmVydFRleHR1cmUzRFByb2Qoc3BsaXR0ZWRTaGFkZXJDb2RlKTtcblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZSA9IHNwbGl0dGVkU2hhZGVyQ29kZTtcblxuXHRcdHJldHVybiB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIHNoYWRlciBjb2RlIHRvIGEgc2hhZGVyIGNvZGUgb2Ygc3BlY2lmaWVkIEdMU0wgdmVyc2lvblxuXHQgKi9cblx0c3RhdGljIF90cmFuc2Zvcm1Ubyhcblx0XHR2ZXJzaW9uOiBTaGFkZXJWZXJzaW9uLFxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sXG5cdFx0aXNGcmFnbWVudFNoYWRlcjogYm9vbGVhbixcblx0XHRlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuXG5cdCkge1xuXHRcdGlmICh2ZXJzaW9uLm1hdGNoKC93ZWJnbDJ8ZXMzL2kpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdHJhbnNmb3JtVG9HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlcik7XG5cdFx0fSBlbHNlIGlmICh2ZXJzaW9uLm1hdGNoKC93ZWJnbDF8ZXMxL2kpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdHJhbnNmb3JtVG9HTFNMRVMxKHNwbGl0dGVkU2hhZGVyQ29kZSwgaXNGcmFnbWVudFNoYWRlciwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgVmVyc2lvbicpXG5cdFx0XHRyZXR1cm4gc3BsaXR0ZWRTaGFkZXJDb2RlO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBJZiB0aGUgZmlyc3QgbGluZSBjb250YWlucyB2ZXJzaW9uIGluZm9ybWF0aW9uLCBvdmVyd3JpdGUgdGhlIGZpcnN0IGxpbmUgd2l0aCAnI3ZlcnNpb24gMTAwJy5cblx0ICogSWYgbm90LCBhZGQgJyN2ZXJzaW9uIDEwMCcgdG8gdGhlIGZpcnN0IGxpbmUuXG5cdCAqXG5cdCAqIE5vdGU6IElmIHRoZSBmaXJzdCBsaW5lIGlzIGNvbW1lbnRlZCBvdXQgYW5kIHRoZSB2ZXJzaW9uIGluZm9ybWF0aW9uIGlzIHdyaXR0ZW4gaW4gdGhlIHNlY29uZCBvciBsYXRlciBsaW5lLFxuXHQgKiB0aGUgYXBwcm9wcmlhdGUgdmVyc2lvbiBpbmZvcm1hdGlvbiB3aWxsIGJlIGFkZGVkIHRvIHRoZSBmaXJzdCBsaW5lIGFuZCB0aGUgdXNlci1kZWZpbmVkIHZlcnNpb24gaW5mb3JtYXRpb25cblx0ICogaW4gdGhlIHNlY29uZCBvciBsYXRlciBsaW5lIHdpbGwgYmUgcmVtb3ZlZC5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydE9ySW5zZXJ0VmVyc2lvbkdMU0xFUzEoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKiNbXFx0IF0qdmVyc2lvbltcXHQgXSsuKi87XG5cdFx0dGhpcy5fX3JlbW92ZUZpcnN0TWF0Y2hpbmdMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnKTtcblxuXHRcdHNwbGl0dGVkU2hhZGVyQ29kZS51bnNoaWZ0KCcjdmVyc2lvbiAxMDAnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBJZiB0aGUgZmlyc3QgbGluZSBjb250YWlucyB2ZXJzaW9uIGluZm9ybWF0aW9uLCBvdmVyd3JpdGUgdGhlIGZpcnN0IGxpbmUgd2l0aCAnI3ZlcnNpb24gMzAwIGVzJy5cblx0ICogSWYgbm90LCBhZGQgJyN2ZXJzaW9uIDMwMCBlcycgdG8gdGhlIGZpcnN0IGxpbmUuXG5cdCAqIEluIGJvdGggY2FzZXMsICcjZGVmaW5lIEdMU0xfRVMzJyB3aWxsIGJlIGluc2VydGVkIGluIHRoZSBzZWNvbmQgbGluZS5cblx0ICogVXNlIHRoZSAnI2RlZmluZSBHTFNMX0VTMycgZGlyZWN0aXZlIGlmIHlvdSB3YW50IHRvIHdyaXRlIGEgc2hhZGVyIGNvZGUgdGhhdCB3aWxsIG9ubHkgcnVuIGluIHRoZSBjYXNlIG9mIHdlYmdsMi5cblx0ICpcblx0ICogTm90ZTogSWYgdGhlIGZpcnN0IGxpbmUgaXMgY29tbWVudGVkIG91dCBhbmQgdGhlIHZlcnNpb24gaW5mb3JtYXRpb24gaXMgd3JpdHRlbiBpbiB0aGUgc2Vjb25kIG9yIGxhdGVyIGxpbmUsXG5cdCAqIHRoZSBhcHByb3ByaWF0ZSB2ZXJzaW9uIGluZm9ybWF0aW9uIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGZpcnN0IGxpbmUgYW5kIHRoZSB1c2VyLWRlZmluZWQgdmVyc2lvbiBpbmZvcm1hdGlvblxuXHQgKiBpbiB0aGUgc2Vjb25kIG9yIGxhdGVyIGxpbmUgd2lsbCBiZSByZW1vdmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0T3JJbnNlcnRWZXJzaW9uR0xTTEVTMyhzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qI1tcXHQgXSp2ZXJzaW9uW1xcdCBdKy4qLztcblx0XHR0aGlzLl9fcmVtb3ZlRmlyc3RNYXRjaGluZ0xpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcpO1xuXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnVuc2hpZnQoJyNkZWZpbmUgR0xTTF9FUzMnKTtcblx0XHRzcGxpdHRlZFNoYWRlckNvZGUudW5zaGlmdCgnI3ZlcnNpb24gMzAwIGVzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ2luJyBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMxIHF1YWxpZmllcignYXR0cmlidXRlJyBvciAndmFyeWluZycpXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRJbihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qaW5bXFx0IF0rKChoaWdocHxtZWRpdW1wfGxvd3B8KVtcXHQgXSpcXHcrW1xcdCBdKlxcdytbXFx0IF0qOykvO1xuXG5cdFx0bGV0IHJlcGxhY2VGdW5jO1xuXHRcdGlmIChpc0ZyYWdtZW50U2hhZGVyKSB7XG5cdFx0XHRyZXBsYWNlRnVuYyA9IGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBwMTogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiAndmFyeWluZyAnICsgcDE7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlcGxhY2VGdW5jID0gZnVuY3Rpb24gKG1hdGNoOiBzdHJpbmcsIHAxOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuICdhdHRyaWJ1dGUgJyArIHAxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgcmVwbGFjZUZ1bmMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIFwib3V0XCIgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgbW9kaWZ5IHRoZSBzaGFkZXIgY29kZS5cblx0ICogSWYgdGhlIHNoYWRlciBzdGFnZSBpcyB2ZXJ0ZXgsIHRoZSBcIm91dFwiIHF1YWxpZmllcnMgd2lsbCBiZSByZXBsYWNlZCBieSBcInZhcnlpbmdcIiBxdWFsaWZpZXIuXG5cdCAqIElmIHRoZSBzaGFkZXIgc3RhZ2UgaXMgZnJhZ21lbnQgYW5kIHRoZSBzaGFkZXIgaGFzIFwib3V0XCIgcXVhbGlmaWVycywgdGhlIFwib3V0XCIgcXVhbGlmaWVycyB3aWxsXG5cdCAqIGJlIGRlbGV0ZWQgYW5kIHRoZSB2YXJpYWJsZSBpcyB1c2VkIHRvIGFzc2lnbiBhIHZhbHVlIHRvIGdsX0ZyYWdDb2xvci5cblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydE91dChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0aWYgKGlzRnJhZ21lbnRTaGFkZXIpIHtcblx0XHRcdGNvbnN0IHZhcmlhYmxlTmFtZSA9IHRoaXMuX19yZW1vdmVPdXRRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdGlmICh2YXJpYWJsZU5hbWUgPT0gbnVsbCkge1xuXHRcdFx0XHQvLyBubyBvdXQgcXVhbGlmaWVyXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fX2FkZEdMRnJhZ0NvbG9yKHZhcmlhYmxlTmFtZSwgc3BsaXR0ZWRTaGFkZXJDb2RlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qb3V0W1xcdCBdKygoaGlnaHB8bWVkaXVtcHxsb3dwfClbXFx0IF0qXFx3K1tcXHQgXSpcXHcrW1xcdCBdKjspLztcblx0XHRcdGNvbnN0IHJlcGxhY2VGdW5jID0gZnVuY3Rpb24gKG1hdGNoOiBzdHJpbmcsIHAxOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuICd2YXJ5aW5nICcgKyBwMTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgcmVwbGFjZUZ1bmMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUaGlzIG1ldGhvZCBpcyBhIHBhcnQgb2YgX19jb252ZXJ0T3V0IG1ldGhvZC5cblx0ICogVGhpcyBtZXRob2QgZGVsZXRlcyB0aGUgXCJvdXRcIiBxdWFsaWZpZXJzIGFuZCBhZGRzIHRoZSBsaW5lIGZvciBhc3NpZ25pbmcgdG8gZ2xfRnJhZ0NvbG9yLlxuXHQgKiBJZiB0aGUgc2hhZGVyIGRvZXMgbm90IGhhdmUgdGhlIFwib3V0XCIgcXVhbGlmaWVycywgdGhpcyBtZXRob2QgZG9lcyBub3RoaW5nLlxuXHQgKi9cblxuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZU91dFF1YWxpZmllcihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qb3V0W1xcdCBdKygoaGlnaHB8bWVkaXVtcHxsb3dwfClbXFx0IF0qXFx3K1tcXHQgXSooXFx3KylbXFx0IF0qOykvO1xuXG5cdFx0bGV0IHZhcmlhYmxlTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBtYXRjaCA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5tYXRjaChyZWcpO1xuXHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IG1hdGNoWzFdO1xuXHRcdFx0XHR2YXJpYWJsZU5hbWUgPSBtYXRjaFszXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhcmlhYmxlTmFtZTtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIF9fYWRkR0xGcmFnQ29sb3IodmFyaWFibGVOYW1lOiBzdHJpbmcsIHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRjb25zdCBjbG9zZUJyYWNrZXRSZWcgPSAvKC4qKVxcfVtcXG5cXHQgXSokLztcblx0XHRjb25zdCByZXR1cm5SZWcgPSAvW1xcblxcdCBdKnJldHVybltcXG5cXHQgXSo7Lztcblx0XHRjb25zdCBtYWluRnVuY1N0YXJ0UmVnID0gLyhefF4oPyFbXFwvXSlbXFx0XFxuIF0rKXZvaWRbXFx0XFxuIF0rbWFpbihbXFx0XFxuIF18XFwofCQpLztcblx0XHRjb25zdCBmcmFnQ29sb3JDb2RlID0gYCAgZ2xfRnJhZ0NvbG9yID0gJHt2YXJpYWJsZU5hbWV9O2A7XG5cblx0XHRsZXQgc2V0R2xGcmFnQ29sb3JJbkxhc3RMaW5lID0gZmFsc2U7XG5cdFx0Zm9yIChsZXQgaSA9IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblx0XHRcdGlmICghc2V0R2xGcmFnQ29sb3JJbkxhc3RMaW5lICYmIGxpbmUubWF0Y2goY2xvc2VCcmFja2V0UmVnKSkge1xuXHRcdFx0XHQvLyBhZGQgZ2xfRnJhZ0NvbG9yIHRvIGxhc3QgbGluZSBvZiBtYWluIGZ1bmN0aW9uXG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IGxpbmUucmVwbGFjZShjbG9zZUJyYWNrZXRSZWcsIGAkMVxcbiR7ZnJhZ0NvbG9yQ29kZX1cXG59XFxuYCk7XG5cdFx0XHRcdHNldEdsRnJhZ0NvbG9ySW5MYXN0TGluZSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChsaW5lLm1hdGNoKHJldHVyblJlZykpIHtcblx0XHRcdFx0Ly8gYWRkIGdsX0ZyYWdDb2xvciBqdXN0IGJlZm9yZSByZXR1cm5cblx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnNwbGljZShpLCAwLCBmcmFnQ29sb3JDb2RlKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGxpbmUubWF0Y2gobWFpbkZ1bmNTdGFydFJlZykpIHtcblx0XHRcdFx0Ly8gYWRkIGdsX0ZyYWdDb2xvciBvbmx5IGluIHRoZSBtYWluIGZ1bmN0aW9uXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICghc2V0R2xGcmFnQ29sb3JJbkxhc3RMaW5lKSB7XG5cdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19yZW1vdmVPdXRRdWFsaWZpZXI6IE5vdCBmb3VuZCB0aGUgY2xvc2luZyBicmFja2V0cyBmb3IgdGhlIG1haW4gZnVuY3Rpb24nO1xuXHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aCwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgcXVhbGlmaWVyIGZvciBlczMgb25seSBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlbW92ZSBpdFxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVFUzNRdWFsaWZpZXIoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgZW1iZWRFcnJvcnNJbk91dHB1dDogYm9vbGVhbikge1xuXHRcdHRoaXMuX19yZW1vdmVWYXJ5aW5nUXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0dGhpcy5fX3JlbW92ZUxheW91dChzcGxpdHRlZFNoYWRlckNvZGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIFwiZmxhdFwiIGFuZCBcInNtb290aFwiIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlbW92ZSBpdFxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19yZW1vdmVWYXJ5aW5nUXVhbGlmaWVyKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGVtYmVkRXJyb3JzSW5PdXRwdXQ6IGJvb2xlYW4pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSooZmxhdHxzbW9vdGgpW1xcdCBdKigoaW58b3V0KVtcXHQgXSsuKikvO1xuXHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX3JlbW92ZVZhcnlpbmdRdWFsaWZpZXI6IGdsc2wgZXMxIGRvZXMgbm90IHN1cHBvcnQgZmxhdCBxdWFsaWZpZXInO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5yZXBsYWNlKHJlZywgKG1hdGNoOiBzdHJpbmcsIHAxOiBzdHJpbmcsIHAyOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0aWYgKHAxID09PSAnZmxhdCcpIHtcblx0XHRcdFx0XHR0aGlzLl9fb3V0RXJyb3Ioc3BsaXR0ZWRTaGFkZXJDb2RlLCBpICsgMSwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHAyO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIFwibGF5b3V0XCIgcXVhbGlmaWVyIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVtb3ZlIGl0XG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX3JlbW92ZUxheW91dChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qbGF5b3V0W1xcdCBdKlxcKFtcXHQgXSpsb2NhdGlvbltcXHQgXSpcXD1bXFx0IF0qXFxkW1xcdCBdKlxcKVtcXHQgXSsvZztcblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSBcInByZWNpc2lvblwiIHF1YWxpZmllciBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlbW92ZSBpdCBpZiB0aGUgXCJwcmVjaXNpb25cIiBxdWFsaWZpZXIgaXMgdmFsaWQgZm9yIG9ubHkgR0xTTCBFUzNcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlUHJlY2lzaW9uRm9yRVMzKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCByZWcgPSAvXig/IVtcXC9dKVtcXHQgXSpwcmVjaXNpb25bXFx0IF0rKGhpZ2hwfG1lZGl1bXB8bG93cClbXFx0IF0rKFxcdyspW1xcdCBdKjsvO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IG1hdGNoID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLm1hdGNoKHJlZyk7XG5cdFx0XHRpZiAobWF0Y2ggIT0gbnVsbCkge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0bWF0Y2hbMl0gPT09ICdpbnQnIHx8XG5cdFx0XHRcdFx0bWF0Y2hbMl0gPT09ICdmbG9hdCcgfHxcblx0XHRcdFx0XHRtYXRjaFsyXSA9PT0gJ3NhbXBsZXIyRCcgfHxcblx0XHRcdFx0XHRtYXRjaFsyXSA9PT0gJ3NhbXBsZXJDdWJlJ1xuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHQvLyB0aGVzZSBwcmVjaXNpb25zIGFyZSBzdXBwb3J0ZWQgaW4gZXMxXG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLnNwbGljZShpLS0sIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlIFwidGV4dHVyZVwiIGFuZCBcInRleHR1cmVQcm9qXCIgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmRcblx0ICogcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMSBtZXRob2QoJ3RleHR1cmUyRCcsICd0ZXh0dXJlMkQnLCBhbmQgc28gb24pXG5cdCAqIFRoaXMgbWV0aG9kIGRpcmVjdGx5IHJlcGxhY2UgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGxpdHRlZFNoYWRlckNvZGUgdmFyaWFibGUuXG5cdCAqL1xuXHRwcml2YXRlIHN0YXRpYyBfX2NvbnZlcnRUZXh0dXJlRnVuY3Rpb25Ub0VTMShzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWdUZXh0dXJlUHJvaiA9IG5ldyBSZWdFeHAoYCgke3NibH0rKXRleHR1cmVQcm9qKExvZHwpKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZWdUZXh0dXJlID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspdGV4dHVyZShMb2R8KSgke3NibH0rKWAsICdnJyk7XG5cblx0XHRsZXQgYXJndW1lbnRTYW1wbGVyTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkO1xuXHRcdGNvbnN0IHVuaWZvcm1TYW1wbGVyTWFwID0gdGhpcy5fX2NyZWF0ZVVuaWZvcm1TYW1wbGVyTWFwKHNwbGl0dGVkU2hhZGVyQ29kZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cblx0XHRcdGNvbnN0IG1hdGNoVGV4dHVyZVByb2ogPSBsaW5lLm1hdGNoKC90ZXh0dXJlUHJvaihMb2R8KVtcXHQgXSpcXChbXFx0IF0qKFxcdyspLC8pO1xuXHRcdFx0aWYgKG1hdGNoVGV4dHVyZVByb2opIHtcblx0XHRcdFx0YXJndW1lbnRTYW1wbGVyTWFwID0gYXJndW1lbnRTYW1wbGVyTWFwID8/IHRoaXMuX19jcmVhdGVBcmd1bWVudFNhbXBsZXJNYXAoXG5cdFx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlLFxuXHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0ZW1iZWRFcnJvcnNJbk91dHB1dFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGNvbnN0IGlzTG9kTWV0aG9kID0gbWF0Y2hUZXh0dXJlUHJvalsxXSA9PT0gJ0xvZCc7XG5cdFx0XHRcdGNvbnN0IGV4dGVuc2lvblN0ciA9IGlzRnJhZ21lbnRTaGFkZXIgJiYgaXNMb2RNZXRob2QgPyBgRVhUYCA6IGBgO1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSBtYXRjaFRleHR1cmVQcm9qWzJdO1xuXHRcdFx0XHRjb25zdCBzYW1wbGVyVHlwZSA9IGFyZ3VtZW50U2FtcGxlck1hcD8uZ2V0KHZhcmlhYmxlTmFtZSkgPz8gdW5pZm9ybVNhbXBsZXJNYXAuZ2V0KHZhcmlhYmxlTmFtZSk7XG5cdFx0XHRcdGlmIChzYW1wbGVyVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKHNhbXBsZXJUeXBlID09PSAnc2FtcGxlcjJEJykge1xuXHRcdFx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLnJlcGxhY2UocmVnVGV4dHVyZVByb2osIGAkMXRleHR1cmUyRFByb2okMiR7ZXh0ZW5zaW9uU3RyfSQzYCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX2NvbnZlcnRUZXh0dXJlRnVuY3Rpb25Ub0VTMTogZG8gbm90IHN1cHBvcnQgJyArIHNhbXBsZXJUeXBlICsgJyB0eXBlJztcblx0XHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGksIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBtYXRjaFRleHR1cmUgPSBsaW5lLm1hdGNoKC90ZXh0dXJlKExvZHwpW1xcdCBdKlxcKFtcXHQgXSooXFx3KyksLyk7XG5cdFx0XHRpZiAobWF0Y2hUZXh0dXJlKSB7XG5cdFx0XHRcdGFyZ3VtZW50U2FtcGxlck1hcCA9IGFyZ3VtZW50U2FtcGxlck1hcCA/PyB0aGlzLl9fY3JlYXRlQXJndW1lbnRTYW1wbGVyTWFwKFxuXHRcdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZSxcblx0XHRcdFx0XHRpLFxuXHRcdFx0XHRcdGVtYmVkRXJyb3JzSW5PdXRwdXRcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRjb25zdCBpc0xvZE1ldGhvZCA9IG1hdGNoVGV4dHVyZVsxXSA9PT0gJ0xvZCc7XG5cdFx0XHRcdGNvbnN0IGV4dGVuc2lvblN0ciA9IGlzRnJhZ21lbnRTaGFkZXIgJiYgaXNMb2RNZXRob2QgPyBgRVhUYCA6IGBgO1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZU5hbWUgPSBtYXRjaFRleHR1cmVbMl07XG5cdFx0XHRcdGNvbnN0IHNhbXBsZXJUeXBlID0gYXJndW1lbnRTYW1wbGVyTWFwPy5nZXQodmFyaWFibGVOYW1lKSA/PyB1bmlmb3JtU2FtcGxlck1hcC5nZXQodmFyaWFibGVOYW1lKTtcblx0XHRcdFx0aWYgKHNhbXBsZXJUeXBlICE9IG51bGwpIHtcblx0XHRcdFx0XHRsZXQgdGV4dHVyZUZ1bmM6IHN0cmluZztcblx0XHRcdFx0XHRpZiAoc2FtcGxlclR5cGUgPT09ICdzYW1wbGVyMkQnKSB7XG5cdFx0XHRcdFx0XHR0ZXh0dXJlRnVuYyA9ICd0ZXh0dXJlMkQnO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc2FtcGxlclR5cGUgPT09ICdzYW1wbGVyQ3ViZScpIHtcblx0XHRcdFx0XHRcdHRleHR1cmVGdW5jID0gJ3RleHR1cmVDdWJlJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGV4dHVyZUZ1bmMgPSAnJztcblx0XHRcdFx0XHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdfX2NvbnZlcnRUZXh0dXJlRnVuY3Rpb25Ub0VTMTogZG8gbm90IHN1cHBvcnQgJyArIHNhbXBsZXJUeXBlICsgJyB0eXBlJztcblx0XHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGksIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHRleHR1cmVGdW5jICE9PSAnJykge1xuXHRcdFx0XHRcdFx0c3BsaXR0ZWRTaGFkZXJDb2RlW2ldID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldLnJlcGxhY2UocmVnVGV4dHVyZSwgYCQxJHt0ZXh0dXJlRnVuY30kMiR7ZXh0ZW5zaW9uU3RyfSQzYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpc0Jsb2NrRW5kID0gISFsaW5lLm1hdGNoKC9cXH0vKTtcblx0XHRcdGlmIChpc0Jsb2NrRW5kKSB7XG5cdFx0XHRcdGFyZ3VtZW50U2FtcGxlck1hcCA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogVGhpcyBtZXRob2QgZmluZHMgdW5pZm9ybSBkZWNsYXJhdGlvbnMgb2Ygc2FtcGxlciB0eXBlcyBpbiB0aGUgc2hhZGVyIGFuZFxuXHQgKiBjcmVhdGVzIGEgbWFwIHdpdGggdmFyaWFibGUgbmFtZXMgYXMga2V5cyBhbmQgdHlwZXMgYXMgdmFsdWVzLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jcmVhdGVVbmlmb3JtU2FtcGxlck1hcChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuKSB7XG5cdFx0Y29uc3QgdW5pZm9ybVNhbXBsZXJNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgbGluZSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXTtcblx0XHRcdGNvbnN0IG1hdGNoID0gbGluZS5tYXRjaCgvXig/IVtcXC9dKVtcXHQgXSp1bmlmb3JtKltcXHQgXSooaGlnaHB8bWVkaXVtcHxsb3dwfClbXFx0IF0qKHNhbXBsZXJcXHcrKVtcXHQgXSsoXFx3KykvKTtcblx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRjb25zdCBzYW1wbGVyVHlwZSA9IG1hdGNoWzJdO1xuXHRcdFx0XHRjb25zdCBuYW1lID0gbWF0Y2hbM107XG5cdFx0XHRcdGlmICh1bmlmb3JtU2FtcGxlck1hcC5nZXQobmFtZSkpIHtcblx0XHRcdFx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnX19jcmVhdGVVbmlmb3JtU2FtcGxlck1hcDogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUnO1xuXHRcdFx0XHRcdHRoaXMuX19vdXRFcnJvcihzcGxpdHRlZFNoYWRlckNvZGUsIGksIGVycm9yTWVzc2FnZSwgZW1iZWRFcnJvcnNJbk91dHB1dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dW5pZm9ybVNhbXBsZXJNYXAuc2V0KG5hbWUsIHNhbXBsZXJUeXBlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHVuaWZvcm1TYW1wbGVyTWFwO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIFRoaXMgbWV0aG9kIGZpbmRzIHNhbXBsZXIgdHlwZXMgZnJvbSB0aGUgZnVuY3Rpb24gYXJndW1lbnRzIGFuZFxuXHQgKiBjcmVhdGVzIGEgbWFwIHdpdGggdmFyaWFibGUgbmFtZXMgYXMga2V5cyBhbmQgdHlwZXMgYXMgdmFsdWVzLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jcmVhdGVBcmd1bWVudFNhbXBsZXJNYXAoXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSxcblx0XHRsaW5lSW5kZXg6IG51bWJlcixcblx0XHRlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuXG5cdCkge1xuXHRcdGNvbnN0IGFyZ3VtZW50U2FtcGxlck1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuXHRcdGZvciAobGV0IGkgPSBsaW5lSW5kZXg7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRjb25zdCBsaW5lID0gc3BsaXR0ZWRTaGFkZXJDb2RlW2ldO1xuXG5cdFx0XHRjb25zdCBpc0Jsb2NrU3RhcnRMaW5lID0gISFsaW5lLm1hdGNoKC9cXHsvKTtcblx0XHRcdGlmICghaXNCbG9ja1N0YXJ0TGluZSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYnJhY2tldFNlY3Rpb25Db2RlID0gdGhpcy5fX2dldEJyYWNrZXRTZWN0aW9uKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSk7XG5cblx0XHRcdGNvbnN0IGlubmVyQnJhY2tldFNlY3Rpb25Db2RlID0gYnJhY2tldFNlY3Rpb25Db2RlLm1hdGNoKC8uKlxcKCguKilcXCkvKT8uWzFdO1xuXHRcdFx0aWYgKGlubmVyQnJhY2tldFNlY3Rpb25Db2RlID09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB2YXJpYWJsZUNhbmRpZGF0ZXMgPSBpbm5lckJyYWNrZXRTZWN0aW9uQ29kZS5zcGxpdCgnLCcpO1xuXHRcdFx0Y29uc3Qgc2FtcGxlclR5cGVEZWZpbml0aW9uUmVnID0gL1tcXG5cXHQgXSooaGlnaHB8bWVkaXVtcHxsb3dwfClbXFxuXFx0IF0qKHNhbXBsZXJcXHcrKVtcXG5cXHQgXSooXFx3KylbXFxuXFx0IF0qLztcblxuXHRcdFx0Y29uc3QgaXNGdW5jdGlvbkJyYWNrZXQgPSAhISh2YXJpYWJsZUNhbmRpZGF0ZXNbMF0ubWF0Y2goc2FtcGxlclR5cGVEZWZpbml0aW9uUmVnKSA/PyB2YXJpYWJsZUNhbmRpZGF0ZXNbMF0ubWF0Y2goL15bXFxuXFx0IF0qJC8pKTtcblx0XHRcdGlmICghaXNGdW5jdGlvbkJyYWNrZXQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoY29uc3QgdmFyaWFibGVDYW5kaWRhdGUgb2YgdmFyaWFibGVDYW5kaWRhdGVzKSB7XG5cdFx0XHRcdGNvbnN0IHNhbXBsZXJWYXJpYWJsZU1hdGNoID0gdmFyaWFibGVDYW5kaWRhdGUubWF0Y2goc2FtcGxlclR5cGVEZWZpbml0aW9uUmVnKTtcblx0XHRcdFx0aWYgKHNhbXBsZXJWYXJpYWJsZU1hdGNoID09IG51bGwpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBzYW1wbGVyVHlwZSA9IHNhbXBsZXJWYXJpYWJsZU1hdGNoWzJdO1xuXHRcdFx0XHRjb25zdCBuYW1lID0gc2FtcGxlclZhcmlhYmxlTWF0Y2hbM107XG5cdFx0XHRcdGlmIChhcmd1bWVudFNhbXBsZXJNYXAuZ2V0KG5hbWUpKSB7XG5cdFx0XHRcdFx0Y29uc3QgZXJyb3JNZXNzYWdlID0gJ19fY3JlYXRlQXJndW1lbnRTYW1wbGVyTWFwOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSc7XG5cdFx0XHRcdFx0dGhpcy5fX291dEVycm9yKHNwbGl0dGVkU2hhZGVyQ29kZSwgaSwgZXJyb3JNZXNzYWdlLCBlbWJlZEVycm9yc0luT3V0cHV0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhcmd1bWVudFNhbXBsZXJNYXAuc2V0KG5hbWUsIHNhbXBsZXJUeXBlKTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyZ3VtZW50U2FtcGxlck1hcDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBwYXJ0IGVuY2xvc2VkIGluIGJyYWNrZXRzKD0gJygpJykuXG5cdCAqIEZvciBleGFtcGxlLCB5b3UgY2FuIGdldCBsaW5lcyB0aGF0IGNvbnRhaW4gZnVuY3Rpb24gYXJndW1lbnRzLCBjb25kaXRpb25hbCBleHByZXNzaW9ucyBmb3IgaWYgc3RhdGVtZW50cywgZXRjLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19nZXRCcmFja2V0U2VjdGlvbihzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBicmFja2V0RW5kSW5kZXg6IG51bWJlcikge1xuXHRcdGxldCBicmFja2V0U3RhcnRJbmRleCA9IDA7XG5cdFx0Zm9yIChsZXQgaiA9IGJyYWNrZXRFbmRJbmRleDsgaiA+PSAwOyBqLS0pIHtcblx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbal07XG5cdFx0XHRjb25zdCBpc0JyYWNrZXRTdGFydE1hdGNoID0gISFsaW5lLm1hdGNoKC9cXCgvKTtcblx0XHRcdGlmIChpc0JyYWNrZXRTdGFydE1hdGNoKSB7XG5cdFx0XHRcdGJyYWNrZXRTdGFydEluZGV4ID0gajtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IGNvbnRhaW5CcmFja2V0Q29kZSA9ICcnO1xuXHRcdGZvciAobGV0IGogPSBicmFja2V0U3RhcnRJbmRleDsgaiA8PSBicmFja2V0RW5kSW5kZXg7IGorKykge1xuXHRcdFx0Y29udGFpbkJyYWNrZXRDb2RlICs9IHNwbGl0dGVkU2hhZGVyQ29kZVtqXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29udGFpbkJyYWNrZXRDb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICdhdHRyaWJ1dGUnIHF1YWxpZmllciBpbiB0aGUgdmVydGV4IHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIHF1YWxpZmllcignaW4nKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0QXR0cmlidXRlKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIGlzRnJhZ21lbnRTaGFkZXI6IGJvb2xlYW4pIHtcblx0XHRpZiAoaXNGcmFnbWVudFNoYWRlcikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlZyA9IC9eKD8hW1xcL10pW1xcdCBdKmF0dHJpYnV0ZVtcXHQgXSsvZztcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ2luICc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsIHJlcGxhY2VTdHIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd2YXJ5aW5nJyBxdWFsaWZpZXIgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIHF1YWxpZmllcignaW4nIG9yICdvdXQnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VmFyeWluZyhzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdLCBpc0ZyYWdtZW50U2hhZGVyOiBib29sZWFuKSB7XG5cdFx0Y29uc3QgcmVnID0gL14oPyFbXFwvXSlbXFx0IF0qdmFyeWluZ1tcXHQgXSsvZztcblx0XHRjb25zdCByZXBsYWNlU3RyID0gaXNGcmFnbWVudFNoYWRlciA/ICdpbiAnIDogJ291dCAnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCByZXBsYWNlU3RyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZUN1YmUnIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmVDdWJlKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlQ3ViZSkoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZSc7XG5cblx0XHR0aGlzLl9fcmVwbGFjZUxpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlLCByZWcsICckMScgKyByZXBsYWNlU3RyICsgJyQzJyk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogRmluZCB0aGUgJ3RleHR1cmUyRCcgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmUnKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZTJEKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10pIHtcblx0XHRjb25zdCBzYmwgPSB0aGlzLl9fcmVnU3ltYm9scygpO1xuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYCgke3NibH0rKSh0ZXh0dXJlMkQpKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmUnO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlMkRQcm9qJyBtZXRob2QgaW4gdGhlIHNoYWRlciBjb2RlIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIEdMU0wgRVMzIG1ldGhvZCgndGV4dHVyZVByb2onKVxuXHQgKiBUaGlzIG1ldGhvZCBkaXJlY3RseSByZXBsYWNlIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BsaXR0ZWRTaGFkZXJDb2RlIHZhcmlhYmxlLlxuXHQgKi9cblx0cHJpdmF0ZSBzdGF0aWMgX19jb252ZXJ0VGV4dHVyZTJEUHJvZChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZTJEUHJvaikoJHtzYmx9KylgLCAnZycpO1xuXHRcdGNvbnN0IHJlcGxhY2VTdHIgPSAndGV4dHVyZVByb2onO1xuXG5cdFx0dGhpcy5fX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZSwgcmVnLCAnJDEnICsgcmVwbGFjZVN0ciArICckMycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEZpbmQgdGhlICd0ZXh0dXJlM0QnIG1ldGhvZCBpbiB0aGUgc2hhZGVyIGNvZGUgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgR0xTTCBFUzMgbWV0aG9kKCd0ZXh0dXJlJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmUzRChzcGxpdHRlZFNoYWRlckNvZGU6IHN0cmluZ1tdKSB7XG5cdFx0Y29uc3Qgc2JsID0gdGhpcy5fX3JlZ1N5bWJvbHMoKTtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGAoJHtzYmx9KykodGV4dHVyZTNEKSgke3NibH0rKWAsICdnJyk7XG5cdFx0Y29uc3QgcmVwbGFjZVN0ciA9ICd0ZXh0dXJlJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBGaW5kIHRoZSAndGV4dHVyZTNEUHJvaicgbWV0aG9kIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBHTFNMIEVTMyBtZXRob2QoJ3RleHR1cmVQcm9qJylcblx0ICogVGhpcyBtZXRob2QgZGlyZWN0bHkgcmVwbGFjZSB0aGUgZWxlbWVudHMgb2YgdGhlIHNwbGl0dGVkU2hhZGVyQ29kZSB2YXJpYWJsZS5cblx0ICovXG5cdHByaXZhdGUgc3RhdGljIF9fY29udmVydFRleHR1cmUzRFByb2Qoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSkge1xuXHRcdGNvbnN0IHNibCA9IHRoaXMuX19yZWdTeW1ib2xzKCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChgKCR7c2JsfSspKHRleHR1cmUzRFByb2opKCR7c2JsfSspYCwgJ2cnKTtcblx0XHRjb25zdCByZXBsYWNlU3RyID0gJ3RleHR1cmVQcm9qJztcblxuXHRcdHRoaXMuX19yZXBsYWNlTGluZShzcGxpdHRlZFNoYWRlckNvZGUsIHJlZywgJyQxJyArIHJlcGxhY2VTdHIgKyAnJDMnKTtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIF9fcmVnU3ltYm9scygpIHtcblx0XHRyZXR1cm4gYFshXCIjJCUmJygpXFwqXFwrXFwtXFwuLFxcLzo7PD0+P0BcXFtcXFxcXFxdXmAgKyAnYHt8fX5cXHRcXG4gXSc7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfX3JlcGxhY2VMaW5lKHNwbGl0dGVkU2hhZGVyQ29kZTogc3RyaW5nW10sIHJlZzogUmVnRXhwLCByZXBsYWNlbWVudDogYW55KSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHRlZFNoYWRlckNvZGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZVtpXSA9IHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5yZXBsYWNlKHJlZywgcmVwbGFjZW1lbnQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIF9fcmVtb3ZlRmlyc3RNYXRjaGluZ0xpbmUoc3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSwgcmVnOiBSZWdFeHApIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0dGVkU2hhZGVyQ29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHNwbGl0dGVkU2hhZGVyQ29kZVtpXS5tYXRjaChyZWcpKSB7XG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIF9fb3V0RXJyb3IoXG5cdFx0c3BsaXR0ZWRTaGFkZXJDb2RlOiBzdHJpbmdbXSxcblx0XHRsaW5lSW5kZXg6IG51bWJlcixcblx0XHRlcnJvck1lc3NhZ2U6IHN0cmluZyxcblx0XHRlbWJlZEVycm9yc0luT3V0cHV0OiBib29sZWFuXG5cdCkge1xuXHRcdGlmIChlbWJlZEVycm9yc0luT3V0cHV0KSB7XG5cdFx0XHRjb25zdCBzaGFkZXJPdXRwdXRNZXNzYWdlID0gYC8vIGxpbmUgJHtsaW5lSW5kZXh9OiAke2Vycm9yTWVzc2FnZX1cXG5gO1xuXHRcdFx0Y29uc3QgY2xvc2VCcmFja2V0UmVnID0gLyguKilcXH1bXFxuXFx0IF0qJC87XG5cdFx0XHRmb3IgKGxldCBpID0gc3BsaXR0ZWRTaGFkZXJDb2RlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdGNvbnN0IGxpbmUgPSBzcGxpdHRlZFNoYWRlckNvZGVbaV07XG5cdFx0XHRcdGlmIChsaW5lLm1hdGNoKGNsb3NlQnJhY2tldFJlZykpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzcGxpdHRlZFNoYWRlckNvZGVbaV0gPT09IHNoYWRlck91dHB1dE1lc3NhZ2UpIHtcblx0XHRcdFx0XHQvLyBhdm9pZCBkdXBsaWNhdGUgZXJyb3IgbWVzc2FnZVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZSk7XG5cdFx0XHRzcGxpdHRlZFNoYWRlckNvZGUucHVzaChzaGFkZXJPdXRwdXRNZXNzYWdlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG5cdFx0fVxuXHR9XG59XG4iLCJpbXBvcnQgUmVmbGVjdGlvbiBmcm9tICcuL1JlZmxlY3Rpb24nO1xuaW1wb3J0IHtTaGFkZXJpdHlPYmplY3QsIFNoYWRlclN0YWdlU3RyLCBTaGFkZXJWZXJzaW9uLCBUZW1wbGF0ZU9iamVjdH0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5pbXBvcnQgU2hhZGVyVHJhbnNmb3JtZXIgZnJvbSAnLi9TaGFkZXJUcmFuc2Zvcm1lcic7XG5pbXBvcnQgU2hhZGVyRWRpdG9yIGZyb20gJy4vU2hhZGVyRWRpdG9yJztcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSc7XG5pbXBvcnQgU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciBmcm9tICcuL1NoYWRlcml0eU9iamVjdENyZWF0b3InO1xuaW1wb3J0IFByZVByb2Nlc3NvciBmcm9tICcuL1ByZVByb2Nlc3Nvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYWRlcml0eSB7XG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBzaGFkZXIgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8qKlxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIEVTMyBzaGFkZXIgY29kZSB0byBhIEdMU0wgRVMxIHNoYWRlciBjb2RlXG5cdCAqIEBwYXJhbSBvYmogU2hhZGVyaXR5IG9iamVjdCB0byB0cmFuc2xhdGUgdG8gZ2xzbCBlczFcblx0ICogQHBhcmFtIGVtYmVkRXJyb3JzSW5PdXRwdXQgSWYgdHJ1ZSwgd2hlbiB0aGVyZSBpcyBhbiBlcnJvciBpbiB0aGUgY29udmVyc2lvbixcblx0ICogICAgdGhlIGVycm9yIGFuZCB0aGUgbnVtYmVyIG9mIGxpbmVzIGFyZSBvdXRwdXQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgcmV0dXJuXG5cdCAqICAgIHZhbHVlIFNoYWRlcml0eU9iamVjdC5jb2RlLiBJZiBmYWxzZSwgdGhyb3cgYW4gZXJyb3IuXG5cdCAqIEByZXR1cm5zIFNoYWRlcml0eU9iamVjdCB3aG9zZSBjb2RlIHByb3BlcnR5IGlzIHRoZSBzaGFkZXIgY29kZSBmb3IgR0xTTCBFUzFcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtVG9HTFNMRVMxKG9iajogU2hhZGVyaXR5T2JqZWN0LCBlbWJlZEVycm9yc0luT3V0cHV0ID0gZmFsc2UpIHtcblx0XHRjb25zdCBzcGxpdHRlZFNoYWRlckNvZGUgPSBVdGlsaXR5Ll9zcGxpdEJ5TGluZUZlZWRDb2RlKG9iai5jb2RlKTtcblxuXHRcdGNvbnN0IHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlXG5cdFx0XHQ9IFNoYWRlclRyYW5zZm9ybWVyLl90cmFuc2Zvcm1Ub0dMU0xFUzEoXG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZSxcblx0XHRcdFx0b2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0XHRcdGVtYmVkRXJyb3JzSW5PdXRwdXRcblx0XHRcdCk7XG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUodHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0Y29uc3QgcmVzdWx0T2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiByZXN1bHRDb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gcmVzdWx0T2JqO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyYW5zbGF0ZSBhIEdMU0wgRVMxIHNoYWRlciBjb2RlIHRvIGEgR0xTTCBFUzMgc2hhZGVyIGNvZGVcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtVG9HTFNMRVMzKG9iajogU2hhZGVyaXR5T2JqZWN0KSB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZVxuXHRcdFx0PSBTaGFkZXJUcmFuc2Zvcm1lci5fdHJhbnNmb3JtVG9HTFNMRVMzKHNwbGl0dGVkU2hhZGVyQ29kZSwgb2JqLmlzRnJhZ21lbnRTaGFkZXIpO1xuXHRcdGNvbnN0IHJlc3VsdENvZGUgPSBVdGlsaXR5Ll9qb2luU3BsaXR0ZWRMaW5lKHRyYW5zZm9ybWVkU3BsaXR0ZWRTaGFkZXJDb2RlKTtcblxuXHRcdGNvbnN0IHJlc3VsdE9iajogU2hhZGVyaXR5T2JqZWN0ID0ge1xuXHRcdFx0Y29kZTogcmVzdWx0Q29kZSxcblx0XHRcdHNoYWRlclN0YWdlOiBvYmouc2hhZGVyU3RhZ2UsXG5cdFx0XHRpc0ZyYWdtZW50U2hhZGVyOiBvYmouaXNGcmFnbWVudFNoYWRlcixcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHJlc3VsdE9iajtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcmFuc2xhdGUgYSBHTFNMIHNoYWRlciBjb2RlIHRvIGEgc2hhZGVyIGNvZGUgb2Ygc3BlY2lmaWVkIEdMU0wgdmVyc2lvblxuXHQgKi9cblx0cHVibGljIHN0YXRpYyB0cmFuc2Zvcm1Ubyh2ZXJzaW9uOiBTaGFkZXJWZXJzaW9uLCBvYmo6IFNoYWRlcml0eU9iamVjdCwgZW1iZWRFcnJvcnNJbk91dHB1dCA9IGZhbHNlKSB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZVxuXHRcdFx0PSBTaGFkZXJUcmFuc2Zvcm1lci5fdHJhbnNmb3JtVG8oXG5cdFx0XHRcdHZlcnNpb24sXG5cdFx0XHRcdHNwbGl0dGVkU2hhZGVyQ29kZSxcblx0XHRcdFx0b2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0XHRcdGVtYmVkRXJyb3JzSW5PdXRwdXRcblx0XHRcdCk7XG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUodHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0Y29uc3QgcmVzdWx0T2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiByZXN1bHRDb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gcmVzdWx0T2JqO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBwcm9jZXNzUHJhZ21hKG9iajogU2hhZGVyaXR5T2JqZWN0LCBkZWZpbml0aW9uczogc3RyaW5nW10gPSBbXSwgc3RhcnRMaW5lU3RyPzogc3RyaW5nLCBlbmRMaW5lU3RyPzogc3RyaW5nKSB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRjb25zdCB0cmFuc2Zvcm1lZFNwbGl0dGVkU2hhZGVyQ29kZVxuXHRcdFx0PSBQcmVQcm9jZXNzb3IucHJvY2VzcyhzcGxpdHRlZFNoYWRlckNvZGUsIGRlZmluaXRpb25zLCBzdGFydExpbmVTdHIsIGVuZExpbmVTdHIpO1xuXG5cdFx0Y29uc3QgcmVzdWx0Q29kZSA9IFV0aWxpdHkuX2pvaW5TcGxpdHRlZExpbmUodHJhbnNmb3JtZWRTcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0Y29uc3QgcmVzdWx0T2JqOiBTaGFkZXJpdHlPYmplY3QgPSB7XG5cdFx0XHRjb2RlOiByZXN1bHRDb2RlLFxuXHRcdFx0c2hhZGVyU3RhZ2U6IG9iai5zaGFkZXJTdGFnZSxcblx0XHRcdGlzRnJhZ21lbnRTaGFkZXI6IG9iai5pc0ZyYWdtZW50U2hhZGVyLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gcmVzdWx0T2JqO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHNoYWRlcml0eSBvYmplY3QgY3JlYXRpb24gZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gaW5zdGFuY2UgdG8gY3JlYXRlIHNoYWRlcml0eSBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGNyZWF0ZVNoYWRlcml0eU9iamVjdENyZWF0b3Ioc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyKTogU2hhZGVyaXR5T2JqZWN0Q3JlYXRvciB7XG5cdFx0cmV0dXJuIG5ldyBTaGFkZXJpdHlPYmplY3RDcmVhdG9yKHNoYWRlclN0YWdlKTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBzaGFkZXIgZWRpdCBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0LyoqXG5cdCAqIEZpbmQgdGhlIGZvbGxvd2luZyB0ZW1wbGF0ZSBwYXR0ZXJuIGluIHRoZSBzaGFkZXIgY29kZSBhbmQgcmVwbGFjZSBrZXkgdG8gdmFsdWVcblx0ICogQHBhcmFtIHRlbXBsYXRlT2JqZWN0IEFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIHN0cmluZyBiZWZvcmUgYW5kIGFmdGVyIHRoZSByZXBsYWNlbWVudFxuXHQgKiBUaGUga2V5IGNhbiBiZSBhIHN0cmluZyBvciBhbiBvYmplY3QuIElmIGFuIG9iamVjdCBpcyB1c2VkIGFzIHRoZSBrZXksXG5cdCAqIHRoZSBrZXkgaW4gdGhlIHBhdHRlcm4gb2Ygc2hhZGVyQ29kZSBtdXN0IGFsc28gbWF0Y2ggdGhlIG9iamVjdC5cblx0ICogRm9yIGV4YW1wbGUsIGlmIHRlbXBsYXRlT2JqZWN0IGlzXG5cdFx0e1xuXHRcdFx0c2FtcGxlIHtcblx0XHRcdFx0c2FtcGxlQTogMFxuXHRcdFx0fVxuXHRcdH1cblx0ICogdGhlbiB0aGUga2V5IGluIGEgc2hhZGVyIGNvZGUgaXMgc2FtcGxlLnNhbXBsZUEuXG5cdCAqL1xuXHQvLyBUaGUgdGVtcGxhdGUgcGF0dGVybiBpc1x0Lyogc2hhZGVyaXR5OiBAe2tleX0gKi9cblx0cHVibGljIHN0YXRpYyBmaWxsVGVtcGxhdGUob2JqOiBTaGFkZXJpdHlPYmplY3QsIGFyZzogVGVtcGxhdGVPYmplY3QpIHtcblx0XHRjb25zdCBjb3B5ID0gdGhpcy5fX2NvcHlTaGFkZXJpdHlPYmplY3Qob2JqKTtcblxuXHRcdGNvcHkuY29kZSA9IFNoYWRlckVkaXRvci5fZmlsbFRlbXBsYXRlKGNvcHkuY29kZSwgYXJnKTtcblxuXHRcdHJldHVybiBjb3B5O1xuXHR9XG5cblx0LyoqXG5cdCAqIEluc2VydCBkZWZpbmUgZGlyZWN0aXZlXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGluc2VydERlZmluaXRpb24ob2JqOiBTaGFkZXJpdHlPYmplY3QsIGRlZmluaXRpb246IHN0cmluZykge1xuXHRcdGNvbnN0IGNvcHkgPSB0aGlzLl9fY29weVNoYWRlcml0eU9iamVjdChvYmopO1xuXHRcdGNvbnN0IHNwbGl0dGVkU2hhZGVyQ29kZSA9IFV0aWxpdHkuX3NwbGl0QnlMaW5lRmVlZENvZGUob2JqLmNvZGUpO1xuXG5cdFx0U2hhZGVyRWRpdG9yLl9pbnNlcnREZWZpbml0aW9uKHNwbGl0dGVkU2hhZGVyQ29kZSwgZGVmaW5pdGlvbik7XG5cdFx0Y29weS5jb2RlID0gVXRpbGl0eS5fam9pblNwbGl0dGVkTGluZShzcGxpdHRlZFNoYWRlckNvZGUpO1xuXG5cdFx0cmV0dXJuIGNvcHk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gcmVmbGVjdGlvbiBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBpbnN0YW5jZSB0byBnZXQgdGhlIGF0dHJpYnV0ZSwgdmFyeWluZywgYW5kIHVuaWZvcm0gaW5mb3JtYXRpb24gZnJvbSBhIHNoYWRlciBjb2RlIG9mIHRoZSBzaGFkZXJpdHkuXG5cdCAqIFRvIGdldCB0aGVzZSBpbmZvcm1hdGlvbiwgeW91IG5lZWQgdG8gY2FsbCByZWZsZWN0aW9uLnJlZmxlY3QgbWV0aG9kLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBjcmVhdGVSZWZsZWN0aW9uT2JqZWN0KG9iajogU2hhZGVyaXR5T2JqZWN0KTogUmVmbGVjdGlvbiB7XG5cdFx0Y29uc3Qgc3BsaXR0ZWRTaGFkZXJDb2RlID0gVXRpbGl0eS5fc3BsaXRCeUxpbmVGZWVkQ29kZShvYmouY29kZSk7XG5cblx0XHRjb25zdCByZWZsZWN0aW9uID0gbmV3IFJlZmxlY3Rpb24oc3BsaXR0ZWRTaGFkZXJDb2RlLCBvYmouc2hhZGVyU3RhZ2UpO1xuXHRcdHJldHVybiByZWZsZWN0aW9uO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHByaXZhdGUgZnVuY3Rpb25zXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHByaXZhdGUgc3RhdGljIF9fY29weVNoYWRlcml0eU9iamVjdChvYmo6IFNoYWRlcml0eU9iamVjdCkge1xuXHRcdGNvbnN0IGNvcGllZE9iajogU2hhZGVyaXR5T2JqZWN0ID0ge1xuXHRcdFx0Y29kZTogb2JqLmNvZGUsXG5cdFx0XHRzaGFkZXJTdGFnZTogb2JqLnNoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogb2JqLmlzRnJhZ21lbnRTaGFkZXIsXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvcGllZE9iajtcblx0fVxufVxuIiwiaW1wb3J0IHtcblx0U2hhZGVyQ29uc3RhbnRWYWx1ZU9iamVjdCxcblx0U2hhZGVyRXh0ZW5zaW9uQmVoYXZpb3IsXG5cdFNoYWRlckV4dGVuc2lvbk9iamVjdCxcblx0U2hhZGVyaXR5T2JqZWN0LFxuXHRTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyxcblx0U2hhZGVyUHJlY2lzaW9uT2JqZWN0LFxuXHRTaGFkZXJQcmVjaXNpb25PYmplY3RLZXksXG5cdFNoYWRlclN0YWdlU3RyLFxuXHRTaGFkZXJBdHRyaWJ1dGVPYmplY3QsXG5cdFNoYWRlclByZWNpc2lvblR5cGUsXG5cdFNoYWRlckF0dHJpYnV0ZVZhclR5cGUsXG5cdFNoYWRlclZhcnlpbmdPYmplY3QsXG5cdFNoYWRlclZhcnlpbmdJbnRlcnBvbGF0aW9uVHlwZSxcblx0U2hhZGVyVmFyeWluZ1ZhclR5cGUsXG5cdFNoYWRlclVuaWZvcm1PYmplY3QsXG5cdFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzLFxuXHRTaGFkZXJTdHJ1Y3REZWZpbml0aW9uT2JqZWN0LFxuXHRTaGFkZXJTdHJ1Y3RNZW1iZXJPYmplY3QsXG5cdFNoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3QsXG5cdFNoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3QsXG5cdFNoYWRlclVuaWZvcm1CdWZmZXJPYmplY3QsXG5cdFNoYWRlclVCT1ZhcmlhYmxlT2JqZWN0LFxuXHRTaGFkZXJGdW5jdGlvbk9iamVjdCxcbn0gZnJvbSAnLi4vdHlwZXMvdHlwZSc7XG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgY3JlYXRlcyBhIHNoYWRlcml0eSBvYmplY3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYWRlcml0eU9iamVjdENyZWF0b3Ige1xuXHRwcml2YXRlIF9fc2hhZGVyU3RhZ2U6IFNoYWRlclN0YWdlU3RyO1xuXHRwcml2YXRlIF9fZnVuY3Rpb25JZENvdW50ID0gMDtcblxuXHRwcml2YXRlIF9fZGVmaW5lRGlyZWN0aXZlTmFtZXM6IHN0cmluZ1tdID0gW107XG5cdHByaXZhdGUgX19leHRlbnNpb25zOiBTaGFkZXJFeHRlbnNpb25PYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fZ2xvYmFsUHJlY2lzaW9uOiBTaGFkZXJQcmVjaXNpb25PYmplY3QgPSB7XG5cdFx0aW50OiAnaGlnaHAnLFxuXHRcdGZsb2F0OiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIyRDogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyQ3ViZTogJ2hpZ2hwJyxcblx0XHRzYW1wbGVyM0Q6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjJEQXJyYXk6ICdoaWdocCcsXG5cdFx0aXNhbXBsZXIyRDogJ2hpZ2hwJyxcblx0XHRpc2FtcGxlckN1YmU6ICdoaWdocCcsXG5cdFx0aXNhbXBsZXIzRDogJ2hpZ2hwJyxcblx0XHRpc2FtcGxlcjJEQXJyYXk6ICdoaWdocCcsXG5cdFx0dXNhbXBsZXIyRDogJ2hpZ2hwJyxcblx0XHR1c2FtcGxlckN1YmU6ICdoaWdocCcsXG5cdFx0dXNhbXBsZXIzRDogJ2hpZ2hwJyxcblx0XHR1c2FtcGxlcjJEQXJyYXk6ICdoaWdocCcsXG5cdFx0c2FtcGxlcjJEU2hhZG93OiAnaGlnaHAnLFxuXHRcdHNhbXBsZXJDdWJlU2hhZG93OiAnaGlnaHAnLFxuXHRcdHNhbXBsZXIyREFycmF5U2hhZG93OiAnaGlnaHAnLFxuXHR9O1xuXHRwcml2YXRlIF9fc3RydWN0RGVmaW5pdGlvbnM6IFNoYWRlclN0cnVjdERlZmluaXRpb25PYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXM6IFNoYWRlckNvbnN0YW50VmFsdWVPYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXM6IFNoYWRlckNvbnN0YW50U3RydWN0VmFsdWVPYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fYXR0cmlidXRlczogU2hhZGVyQXR0cmlidXRlT2JqZWN0W10gPSBbXTsgLy8gZm9yIHZlcnRleCBzaGFkZXIgb25seVxuXHRwcml2YXRlIF9fdmFyeWluZ3M6IFNoYWRlclZhcnlpbmdPYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fdW5pZm9ybXM6IFNoYWRlclVuaWZvcm1PYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fdW5pZm9ybVN0cnVjdHM6IFNoYWRlclVuaWZvcm1TdHJ1Y3RPYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fdW5pZm9ybUJ1ZmZlck9iamVjdHM6IFNoYWRlclVuaWZvcm1CdWZmZXJPYmplY3RbXSA9IFtdO1xuXHRwcml2YXRlIF9fZnVuY3Rpb25zOiBTaGFkZXJGdW5jdGlvbk9iamVjdFtdW10gPSBbXTsgLy8gZmlyc3QgaW5kZXggcmVwcmVzZW50IGRlcGVuZGVuY3kgbGV2ZWxcblx0cHJpdmF0ZSBfX21haW5GdW5jdGlvbkNvZGU6IHN0cmluZyA9ICd2b2lkIG1haW4oKSB7fSc7XG5cdHByaXZhdGUgX19vdXRwdXRDb2xvclZhcmlhYmxlTmFtZTogc3RyaW5nID0gJ3JlbmRlclRhcmdldDAnOyAvLyBmb3IgZnJhZ21lbnQgc2hhZGVyIG9ubHlcblxuXHRjb25zdHJ1Y3RvcihzaGFkZXJTdGFnZTogU2hhZGVyU3RhZ2VTdHIpIHtcblx0XHR0aGlzLl9fc2hhZGVyU3RhZ2UgPSBzaGFkZXJTdGFnZTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBhZGQgcGFyYW1ldGVycyBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHVibGljIGFkZERlZmluZURpcmVjdGl2ZShkZWZpbmVEaXJlY3RpdmVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fZGVmaW5lRGlyZWN0aXZlTmFtZXMuc29tZShuYW1lID0+IG5hbWUgPT09IGRlZmluZURpcmVjdGl2ZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdhZGREZWZpbmVEaXJlY3RpdmU6IHRoaXMgZGVmaW5lIGRpcmVjdGl2ZSBpcyBhbHJlYWR5IHNldCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19kZWZpbmVEaXJlY3RpdmVOYW1lcy5wdXNoKGRlZmluZURpcmVjdGl2ZU5hbWUpO1xuXHR9XG5cblx0cHVibGljIGFkZEV4dGVuc2lvbihleHRlbnNpb25OYW1lOiBzdHJpbmcsIGJlaGF2aW9yOiBTaGFkZXJFeHRlbnNpb25CZWhhdmlvciA9ICdlbmFibGUnKSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX2V4dGVuc2lvbnMuc29tZShleHRlbnNpb24gPT4gZXh0ZW5zaW9uLmV4dGVuc2lvbk5hbWUgPT09IGV4dGVuc2lvbk5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdhZGRFeHRlbnNpb246IHRoaXMgZXh0ZW5zaW9uIGlzIGFscmVhZHkgc2V0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2V4dGVuc2lvbnMucHVzaCh7XG5cdFx0XHRleHRlbnNpb25OYW1lLFxuXHRcdFx0YmVoYXZpb3Jcblx0XHR9KTtcblx0fVxuXG5cdC8vIG9ubHkgZGVmaW5lIHR5cGVzXG5cdHB1YmxpYyBhZGRTdHJ1Y3REZWZpbml0aW9uKHN0cnVjdE5hbWU6IHN0cmluZywgbWVtYmVyT2JqZWN0czogU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0W10pIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fc3RydWN0RGVmaW5pdGlvbnMuc29tZShzdHJ1Y3REZWZpbml0aW9uID0+IHN0cnVjdERlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0TmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRTdHJ1Y3REZWZpbml0aW9uOiBkdXBsaWNhdGUgc3RydWN0IHR5cGUgbmFtZSAke3N0cnVjdE5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLnB1c2goe1xuXHRcdFx0c3RydWN0TmFtZSxcblx0XHRcdG1lbWJlck9iamVjdHMsXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkR2xvYmFsQ29uc3RhbnRWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZywgdHlwZTogU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMsIHZhbHVlczogbnVtYmVyW10pIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMuc29tZShnbG9iYWxDb25zdGFudFZhbHVlID0+IGdsb2JhbENvbnN0YW50VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkR2xvYmFsQ29uc3RhbnRWYWx1ZTogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNWYWxpZENvbXBvbmVudE51bWJlciA9IFV0aWxpdHkuX2lzVmFsaWRDb21wb25lbnRDb3VudCh0eXBlLCB2YWx1ZXMpO1xuXHRcdGlmICghaXNWYWxpZENvbXBvbmVudE51bWJlcikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlIGNvbXBvbmVudCBjb3VudCBvZiAke3ZhcmlhYmxlTmFtZX0gaXMgaW52YWxpZGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzSW50VHlwZSA9IFV0aWxpdHkuX2lzSW50VHlwZSh0eXBlKTtcblx0XHRpZiAoaXNJbnRUeXBlKSB7XG5cdFx0XHRjb25zdCBleGlzdE5vbkludGVnZXJWYWx1ZSA9IFNoYWRlcml0eU9iamVjdENyZWF0b3IuX19leGlzdE5vbkludGVnZXJWYWx1ZSh2YWx1ZXMpO1xuXHRcdFx0aWYgKGV4aXN0Tm9uSW50ZWdlclZhbHVlKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgYWRkR2xvYmFsQ29uc3RhbnRWYWx1ZTogbm9uLWludGVnZXIgdmFsdWUgaXMgc2V0IHRvICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlcy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHR5cGUsXG5cdFx0XHR2YWx1ZXMsXG5cdFx0fSk7XG5cdH1cblxuXHQvLyBuZWVkIHRvIGRlZmluZSBzdHJ1Y3QgYnkgdGhlIGFkZFN0cnVjdERlZmluaXRpb24gbWV0aG9kXG5cdC8vIHZhbGlkYXRlIHRoYXQgdGhlIGNvcnJlc3BvbmRpbmcgc3RydWN0dXJlIGlzIGRlZmluZWQgYnkgdGhlIF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGUgbWV0aG9kXG5cdHB1YmxpYyBhZGRHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlKHN0cnVjdE5hbWU6IHN0cmluZywgdmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlczoge1trZXlWYXJpYWJsZU5hbWU6IHN0cmluZ106IG51bWJlcltdfSkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5zb21lKHN0cnVjdFZhbHVlID0+IHN0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZEdsb2JhbENvbnN0YW50U3RydWN0VmFsdWU6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlcy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHN0cnVjdE5hbWUsXG5cdFx0XHR2YWx1ZXMsXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkQXR0cmlidXRlRGVjbGFyYXRpb24oXG5cdFx0dmFyaWFibGVOYW1lOiBzdHJpbmcsXG5cdFx0dHlwZTogU2hhZGVyQXR0cmlidXRlVmFyVHlwZSxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0cHJlY2lzaW9uPzogU2hhZGVyUHJlY2lzaW9uVHlwZSxcblx0XHRcdGxvY2F0aW9uPzogbnVtYmVyLFxuXHRcdH1cblx0KSB7XG5cdFx0aWYgKHRoaXMuX19zaGFkZXJTdGFnZSAhPT0gJ3ZlcnRleCcpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2FkZEF0dHJpYnV0ZTogdGhpcyBtZXRob2QgaXMgZm9yIHZlcnRleCBzaGFkZXIgb25seScpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzRHVwbGljYXRlID1cblx0XHRcdHRoaXMuX19hdHRyaWJ1dGVzLnNvbWUoYXR0cmlidXRlID0+IGF0dHJpYnV0ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKGlzRHVwbGljYXRlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBhZGRBdHRyaWJ1dGU6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19hdHRyaWJ1dGVzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0dHlwZSxcblx0XHRcdHByZWNpc2lvbjogb3B0aW9ucz8ucHJlY2lzaW9uLFxuXHRcdFx0bG9jYXRpb246IG9wdGlvbnM/LmxvY2F0aW9uLFxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGFkZFZhcnlpbmdEZWNsYXJhdGlvbihcblx0XHR2YXJpYWJsZU5hbWU6IHN0cmluZyxcblx0XHR0eXBlOiBTaGFkZXJWYXJ5aW5nVmFyVHlwZSxcblx0XHRvcHRpb25zPzoge1xuXHRcdFx0cHJlY2lzaW9uPzogU2hhZGVyUHJlY2lzaW9uVHlwZSxcblx0XHRcdGludGVycG9sYXRpb25UeXBlPzogU2hhZGVyVmFyeWluZ0ludGVycG9sYXRpb25UeXBlLFxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX3ZhcnlpbmdzLnNvbWUodmFyeWluZyA9PiB2YXJ5aW5nLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFZhcnlpbmc6IGR1cGxpY2F0ZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzSW50VHlwZSA9IFV0aWxpdHkuX2lzSW50VHlwZSh0eXBlKTtcblx0XHRsZXQgaW50ZXJwb2xhdGlvblR5cGUgPSBvcHRpb25zPy5pbnRlcnBvbGF0aW9uVHlwZTtcblx0XHRpZiAoaXNJbnRUeXBlICYmIGludGVycG9sYXRpb25UeXBlICE9PSAnZmxhdCcpIHtcblx0XHRcdGlmIChpbnRlcnBvbGF0aW9uVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFZhcnlpbmc6IHRoZSBpbnRlcnBvbGF0aW9uVHlwZSBtdXN0IGJlIGZsYXQgZm9yIGludGVnZXIgdHlwZXNgKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBhZGRWYXJ5aW5nOiBzZXQgdGhlIGludGVycG9sYXRpb25UeXBlIG9mIGludGVnZXIgdHlwZXMgdG8gZmxhdCB0byBhdm9pZCBjb21waWxhdGlvbiBlcnJvcmApO1xuXHRcdFx0XHRpbnRlcnBvbGF0aW9uVHlwZSA9ICdmbGF0Jztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fdmFyeWluZ3MucHVzaCh7XG5cdFx0XHR2YXJpYWJsZU5hbWUsXG5cdFx0XHR0eXBlLFxuXHRcdFx0cHJlY2lzaW9uOiBvcHRpb25zPy5wcmVjaXNpb24sXG5cdFx0XHRpbnRlcnBvbGF0aW9uVHlwZSxcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBhZGRVbmlmb3JtRGVjbGFyYXRpb24oXG5cdFx0dmFyaWFibGVOYW1lOiBzdHJpbmcsXG5cdFx0dHlwZTogU2hhZGVyVW5pZm9ybVZhclR5cGVFUzMsXG5cdFx0b3B0aW9ucz86IHtcblx0XHRcdHByZWNpc2lvbj86IFNoYWRlclByZWNpc2lvblR5cGUsXG5cdFx0fVxuXHQpIHtcblx0XHRjb25zdCBpc0R1cGxpY2F0ZSA9XG5cdFx0XHR0aGlzLl9fdW5pZm9ybXMuc29tZSh1bmlmb3JtID0+IHVuaWZvcm0udmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVW5pZm9ybTogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGUgPT09ICdib29sJyAmJiBvcHRpb25zPy5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0Y29uc29sZS53YXJuKGBhZGRVbmlmb3JtOiByZW1vdmUgdGhlIHNwZWNpZmljYXRpb24gb2YgcHJlY2lzaW9uIGZvciBib29sIHR5cGUgdG8gYXZvaWQgY29tcGlsYXRpb24gZXJyb3JgKTtcblx0XHRcdG9wdGlvbnMucHJlY2lzaW9uID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHRoaXMuX191bmlmb3Jtcy5wdXNoKHtcblx0XHRcdHZhcmlhYmxlTmFtZSxcblx0XHRcdHR5cGUsXG5cdFx0XHRwcmVjaXNpb246IG9wdGlvbnM/LnByZWNpc2lvbixcblx0XHR9KTtcblx0fVxuXG5cdC8vIG5lZWQgdG8gZGVmaW5lIHN0cnVjdCBieSB0aGUgYWRkU3RydWN0RGVmaW5pdGlvbiBtZXRob2Rcblx0cHVibGljIGFkZFVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbihcblx0XHRzdHJ1Y3ROYW1lOiBzdHJpbmcsXG5cdFx0dmFyaWFibGVOYW1lOiBzdHJpbmdcblx0KSB7XG5cdFx0Y29uc3QgaXNEdXBsaWNhdGUgPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1TdHJ1Y3RzLnNvbWUodW5pZm9ybVN0cnVjdCA9PiB1bmlmb3JtU3RydWN0LnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGFkZFVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvbjogZHVwbGljYXRlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1TdHJ1Y3RzLnB1c2goe1xuXHRcdFx0dmFyaWFibGVOYW1lLFxuXHRcdFx0c3RydWN0TmFtZSxcblx0XHR9KTtcblx0fVxuXG5cdC8vIGZvciBlczNcblx0cHVibGljIGFkZFVuaWZvcm1CdWZmZXJPYmplY3REZWNsYXJhdGlvbihcblx0XHRibG9ja05hbWU6IHN0cmluZyxcblx0XHR2YXJpYWJsZU9iamVjdHM6IFNoYWRlclVCT1ZhcmlhYmxlT2JqZWN0W10sXG5cdFx0b3B0aW9ucz86IHtcblx0XHRcdGluc3RhbmNlTmFtZT86IFNoYWRlclByZWNpc2lvblR5cGVcblx0XHR9XG5cdCkge1xuXHRcdGNvbnN0IGlzRHVwbGljYXRlQmxvY2tOYW1lID1cblx0XHRcdHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cy5zb21lKHVibyA9PiB1Ym8uYmxvY2tOYW1lID09PSBibG9ja05hbWUpO1xuXHRcdGlmIChpc0R1cGxpY2F0ZUJsb2NrTmFtZSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVW5pZm9ybUJ1ZmZlck9iamVjdERlY2xhcmF0aW9uOiBkdXBsaWNhdGUgYmxvY2sgbmFtZSAke2Jsb2NrTmFtZX1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKGNvbnN0IHVibyBvZiB0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMpIHtcblx0XHRcdGZvciAoY29uc3QgdWJvVmFyaWFibGVPYmplY3Qgb2YgdWJvLnZhcmlhYmxlT2JqZWN0cykge1xuXHRcdFx0XHRmb3IgKGNvbnN0IHZhcmlhYmxlT2JqZWN0IG9mIHZhcmlhYmxlT2JqZWN0cykge1xuXHRcdFx0XHRcdGlmICh1Ym9WYXJpYWJsZU9iamVjdC52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlT2JqZWN0LnZhcmlhYmxlTmFtZSkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgYWRkVW5pZm9ybUJ1ZmZlck9iamVjdERlY2xhcmF0aW9uOiBkdXBsaWNhdGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlT2JqZWN0LnZhcmlhYmxlTmFtZX1gKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybUJ1ZmZlck9iamVjdHMucHVzaCh7XG5cdFx0XHRibG9ja05hbWUsXG5cdFx0XHR2YXJpYWJsZU9iamVjdHMsXG5cdFx0XHRpbnN0YW5jZU5hbWU6IG9wdGlvbnM/Lmluc3RhbmNlTmFtZSxcblx0XHR9KTtcblx0fVxuXG5cdC8vIHRoZSByZXR1cm4gdmFsdWUgSWQgaXMgYSB2YWx1ZSB0byBkZWxldGUgdGhlIGZ1bmN0aW9uXG5cdC8vIHRoZSBtYWluIGZ1bmN0aW9uIGlzIGRlZmluZWQgKHVwZGF0ZWQpIGJ5IHRoZSB1cGRhdGVNYWluRnVuY3Rpb24gbWV0aG9kXG5cdHB1YmxpYyBhZGRGdW5jdGlvbkRlZmluaXRpb24oXG5cdFx0ZnVuY3Rpb25Db2RlOiBzdHJpbmcsXG5cdFx0b3B0aW9ucz86IHtcblx0XHRcdGRlcGVuZGVuY3lMZXZlbD86IG51bWJlclxuXHRcdH1cblx0KSB7XG5cdFx0Y29uc3QgZnVuY3Rpb25JZCA9IHRoaXMuX19mdW5jdGlvbklkQ291bnQrKztcblxuXHRcdGNvbnN0IGRlcGVuZGVuY3lMZXZlbCA9IG9wdGlvbnM/LmRlcGVuZGVuY3lMZXZlbCA/PyAwO1xuXHRcdHRoaXMuX19mdW5jdGlvbnNbZGVwZW5kZW5jeUxldmVsXSA9IHRoaXMuX19mdW5jdGlvbnNbZGVwZW5kZW5jeUxldmVsXSA/PyBbXTtcblx0XHR0aGlzLl9fZnVuY3Rpb25zW2RlcGVuZGVuY3lMZXZlbF0ucHVzaCh7XG5cdFx0XHRmdW5jdGlvbkNvZGUsXG5cdFx0XHRmdW5jdGlvbklkXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb25JZDtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyB1cGRhdGUgcGFyYW1ldGVycyBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHVibGljIHVwZGF0ZUdsb2JhbFByZWNpc2lvbihwcmVjaXNpb246IFNoYWRlclByZWNpc2lvbk9iamVjdCkge1xuXHRcdE9iamVjdC5hc3NpZ24odGhpcy5fX2dsb2JhbFByZWNpc2lvbiwgcHJlY2lzaW9uKTtcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVTdHJ1Y3REZWZpbml0aW9uKHN0cnVjdE5hbWU6IHN0cmluZywgbWVtYmVyT2JqZWN0czogU2hhZGVyU3RydWN0TWVtYmVyT2JqZWN0W10pIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLmZpbmRJbmRleChzdHJ1Y3REZWZpbml0aW9uID0+IHN0cnVjdERlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0TmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHVwZGF0ZVN0cnVjdERlZmluaXRpb246IHRoZSBzdHJ1Y3QgdHlwZSBuYW1lICR7c3RydWN0TmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zW21hdGNoZWRJbmRleF0ubWVtYmVyT2JqZWN0cyA9IG1lbWJlck9iamVjdHM7XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZywgdmFsdWVzOiBudW1iZXJbXSkge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMuZmluZEluZGV4KGdsb2JhbENvbnN0YW50VmFsdWUgPT4gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgdXBkYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHR5cGUgPSB0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXNbbWF0Y2hlZEluZGV4XS50eXBlO1xuXG5cdFx0Y29uc3QgaXNWYWxpZENvbXBvbmVudE51bWJlciA9IFV0aWxpdHkuX2lzVmFsaWRDb21wb25lbnRDb3VudCh0eXBlLCB2YWx1ZXMpO1xuXHRcdGlmICghaXNWYWxpZENvbXBvbmVudE51bWJlcikge1xuXHRcdFx0Y29uc29sZS5lcnJvcigndXBkYXRlR2xvYmFsQ29uc3RhbnRWYWx1ZTogdGhlIGNvbXBvbmVudCBjb3VudCBpcyBpbnZhbGlkJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNJbnRUeXBlID0gVXRpbGl0eS5faXNJbnRUeXBlKHR5cGUpO1xuXHRcdGlmIChpc0ludFR5cGUpIHtcblx0XHRcdGNvbnN0IGV4aXN0Tm9uSW50ZWdlclZhbHVlID0gU2hhZGVyaXR5T2JqZWN0Q3JlYXRvci5fX2V4aXN0Tm9uSW50ZWdlclZhbHVlKHZhbHVlcyk7XG5cdFx0XHRpZiAoZXhpc3ROb25JbnRlZ2VyVmFsdWUpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGB1cGRhdGVHbG9iYWxDb25zdGFudFZhbHVlOiB0aGUgJHt2YXJpYWJsZU5hbWV9IGhhcyBhIG5vbi1pbnRlZ2VyIHZhbHVlLmApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX19nbG9iYWxDb25zdGFudFZhbHVlc1ttYXRjaGVkSW5kZXhdLnZhbHVlcyA9IHZhbHVlcztcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCB2YWx1ZXM6IHtba2V5VmFyaWFibGVOYW1lOiBzdHJpbmddOiBudW1iZXJbXX0pIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzLmZpbmRJbmRleChzdHJ1Y3RWYWx1ZSA9PiBzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHVwZGF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWU6ICB0aGUgdmFyaWFibGUgbmFtZSAke3ZhcmlhYmxlTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50U3RydWN0VmFsdWVzW21hdGNoZWRJbmRleF0udmFsdWVzID0gdmFsdWVzO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZU1haW5GdW5jdGlvbihtYWluRnVuY3Rpb25Db2RlSW5uZXI6IHN0cmluZykge1xuXHRcdHRoaXMuX19tYWluRnVuY3Rpb25Db2RlID0gbWFpbkZ1bmN0aW9uQ29kZUlubmVyO1xuXHR9XG5cblx0Ly8gc3BlY2lmeSB0aGUgbmFtZSBvZiB0aGUgb3V0cHV0IGNvbG9yIHZhcmlhYmxlIGZyb20gdGhlIG1haW4gZnVuY3Rpb24gaW4gdGhlIGZyYWdtZW50IHNoYWRlci5cblx0Ly8gdXNlcnMgaGF2ZSB0byBhc3NpZ24gdGhlIHJlc3VsdCBvZiBmcmFnbWVudCBzaGFkZXIgY2FsY3VsYXRpb24gdG8gdGhpcyB2YXJpYWJsZS5cblx0cHVibGljIHVwZGF0ZU91dHB1dENvbG9yVmFyaWFibGVOYW1lKG91dHB1dENvbG9yVmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRpZiAodGhpcy5fX3NoYWRlclN0YWdlICE9PSAnZnJhZ21lbnQnKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCd1cGRhdGVPdXRwdXRDb2xvclZhcmlhYmxlTmFtZTogdGhpcyBtZXRob2QgaXMgZm9yIGZyYWdtZW50IHNoYWRlciBvbmx5Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKG91dHB1dENvbG9yVmFyaWFibGVOYW1lLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcigndXBkYXRlT3V0cHV0Q29sb3JWYXJpYWJsZU5hbWU6IGludmFsaWQgb3V0Q29sb3JWYXJpYWJsZU5hbWUnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fb3V0cHV0Q29sb3JWYXJpYWJsZU5hbWUgPSBvdXRwdXRDb2xvclZhcmlhYmxlTmFtZTtcblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyByZW1vdmUgcGFyYW1ldGVycyBmdW5jdGlvbnNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHVibGljIHJlbW92ZURlZmluZURpcmVjdGl2ZShkZWZpbmVEaXJlY3RpdmVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPSB0aGlzLl9fZGVmaW5lRGlyZWN0aXZlTmFtZXMuaW5kZXhPZihkZWZpbmVEaXJlY3RpdmVOYW1lKTtcblxuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ3JlbW92ZWREZWZpbmVEaXJlY3RpdmU6IHRoaXMgZGVmaW5lIGRpcmVjdGl2ZSBpcyBub3QgZXhpc3QnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZGVmaW5lRGlyZWN0aXZlTmFtZXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlRXh0ZW5zaW9uKGV4dGVuc2lvbk5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZXh0ZW5zaW9ucy5maW5kSW5kZXgoZXh0ZW5zaW9uID0+IGV4dGVuc2lvbi5leHRlbnNpb25OYW1lID09PSBleHRlbnNpb25OYW1lKTtcblxuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ3JlbW92ZUV4dGVuc2lvbjogdGhpcyBleHRlbnNpb24gaXMgbm90IGV4aXN0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2V4dGVuc2lvbnMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlU3RydWN0RGVmaW5pdGlvbihzdHJ1Y3ROYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLmZpbmRJbmRleChzdHJ1Y3REZWZpbml0aW9uID0+IHN0cnVjdERlZmluaXRpb24uc3RydWN0TmFtZSA9PT0gc3RydWN0TmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHJlbW92ZVN0cnVjdERlZmluaXRpb246IHRoZSBzdHJ1Y3QgdHlwZSBuYW1lICR7c3RydWN0TmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3N0cnVjdERlZmluaXRpb25zLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZUdsb2JhbENvbnN0YW50VmFsdWUodmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzLmZpbmRJbmRleChnbG9iYWxDb25zdGFudFZhbHVlID0+IGdsb2JhbENvbnN0YW50VmFsdWUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZUdsb2JhbENvbnN0YW50VmFsdWU6IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRWYWx1ZXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZSh2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMuZmluZEluZGV4KHN0cnVjdFZhbHVlID0+IHN0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgdXBkYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZTogIHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlQXR0cmlidXRlRGVjbGFyYXRpb24odmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX2F0dHJpYnV0ZXMuZmluZEluZGV4KGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUudmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZUF0dHJpYnV0ZTogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX19hdHRyaWJ1dGVzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZVZhcnlpbmdEZWNsYXJhdGlvbih2YXJpYWJsZU5hbWU6IHN0cmluZykge1xuXHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHR0aGlzLl9fdmFyeWluZ3MuZmluZEluZGV4KHZhcnlpbmcgPT4gdmFyeWluZy52YXJpYWJsZU5hbWUgPT09IHZhcmlhYmxlTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlVmFyeWluZzogdGhlIHZhcmlhYmxlIG5hbWUgJHt2YXJpYWJsZU5hbWV9IGlzIG5vdCBleGlzdGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX192YXJ5aW5ncy5zcGxpY2UobWF0Y2hlZEluZGV4LCAxKTtcblx0fVxuXG5cdHB1YmxpYyByZW1vdmVVbmlmb3JtRGVjbGFyYXRpb24odmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcblx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0dGhpcy5fX3VuaWZvcm1zLmZpbmRJbmRleCh1bmlmb3JtID0+IHVuaWZvcm0udmFyaWFibGVOYW1lID09PSB2YXJpYWJsZU5hbWUpO1xuXHRcdGlmIChtYXRjaGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYHJlbW92ZVVuaWZvcm06IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybXMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX191bmlmb3JtU3RydWN0cy5maW5kSW5kZXgodW5pZm9ybVN0cnVjdCA9PiB1bmlmb3JtU3RydWN0LnZhcmlhYmxlTmFtZSA9PT0gdmFyaWFibGVOYW1lKTtcblx0XHRpZiAobWF0Y2hlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGByZW1vdmVVbmlmb3JtU3RydWN0RGVjbGFyYXRpb246IHRoZSB2YXJpYWJsZSBuYW1lICR7dmFyaWFibGVOYW1lfSBpcyBub3QgZXhpc3RgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9fdW5pZm9ybVN0cnVjdHMuc3BsaWNlKG1hdGNoZWRJbmRleCwgMSk7XG5cdH1cblxuXHRwdWJsaWMgcmVtb3ZlVW5pZm9ybUJ1ZmZlck9iamVjdERlY2xhcmF0aW9uKGJsb2NrTmFtZTogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbWF0Y2hlZEluZGV4ID1cblx0XHRcdHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cy5maW5kSW5kZXgodWJvID0+IHViby5ibG9ja05hbWUgPT09IGJsb2NrTmFtZSk7XG5cdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdGNvbnNvbGUud2FybihgcmVtb3ZlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uOiB0aGUgdmFyaWFibGUgbmFtZSAke2Jsb2NrTmFtZX0gaXMgbm90IGV4aXN0YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fX3VuaWZvcm1CdWZmZXJPYmplY3RzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHR9XG5cblx0cHVibGljIHJlbW92ZUZ1bmN0aW9uRGVmaW5pdGlvbihmdW5jdGlvbklkOiBudW1iZXIpIHtcblx0XHR0aGlzLl9fZmlsbEVtcHR5RnVuY3Rpb25zKCk7XG5cblx0XHQvLyBpZCBpcyB0b28gc21hbGwgb3IgdG9vIGJpZ1xuXHRcdGlmIChmdW5jdGlvbklkIDwgMCB8fCBmdW5jdGlvbklkID49IHRoaXMuX19mdW5jdGlvbklkQ291bnQpIHtcblx0XHRcdGNvbnNvbGUud2FybigncmVtb3ZlRnVuY3Rpb25EZWZpbml0aW9uOiBpbnZhbGlkIGZ1bmN0aW9uIGlkJylcblx0XHR9XG5cblx0XHRmb3IgKGNvbnN0IGZ1bmN0aW9uT2JqZWN0cyBvZiB0aGlzLl9fZnVuY3Rpb25zKSB7XG5cdFx0XHRjb25zdCBtYXRjaGVkSW5kZXggPVxuXHRcdFx0XHRmdW5jdGlvbk9iamVjdHMuZmluZEluZGV4KGZ1bmN0aW9uT2JqZWN0ID0+IGZ1bmN0aW9uT2JqZWN0LmZ1bmN0aW9uSWQgPT09IGZ1bmN0aW9uSWQpO1xuXHRcdFx0aWYgKG1hdGNoZWRJbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0ZnVuY3Rpb25PYmplY3RzLnNwbGljZShtYXRjaGVkSW5kZXgsIDEpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc29sZS53YXJuKGByZW1vdmVGdW5jdGlvbkRlZmluaXRpb246IG5vdCBmb3VuZCB0aGUgZnVuY3Rpb24gb2YgZnVuY3Rpb25JZCAke2Z1bmN0aW9uSWR9YCk7XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gY3JlYXRlIHNoYWRlcml0eSBvYmplY3QgZnVuY3Rpb25cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cHVibGljIGNyZWF0ZVNoYWRlcml0eU9iamVjdCgpOiBTaGFkZXJpdHlPYmplY3Qge1xuXHRcdGNvbnN0IHNoYWRlcml0eU9iaiA9IHtcblx0XHRcdGNvZGU6IHRoaXMuX19jcmVhdGVTaGFkZXJDb2RlKCksXG5cdFx0XHRzaGFkZXJTdGFnZTogdGhpcy5fX3NoYWRlclN0YWdlLFxuXHRcdFx0aXNGcmFnbWVudFNoYWRlcjogdGhpcy5fX3NoYWRlclN0YWdlID09PSAnZnJhZ21lbnQnLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gc2hhZGVyaXR5T2JqO1xuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIHByaXZhdGUgbWV0aG9kc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwcml2YXRlIHN0YXRpYyBfX2V4aXN0Tm9uSW50ZWdlclZhbHVlKHZhbHVlczogbnVtYmVyW10pIHtcblx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuXHRcdFx0aWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gVE9ETzogaW1wbGVtZW50IHNoYWRlciBjb2RlIGltcG9ydCBmZWF0dXJlIChsb3cgcHJpb3JpdHkpXG5cdC8vIHB1YmxpYyBpbXBvcnRTaGFkZXJDb2RlKGNvZGU6IHN0cmluZykge31cblxuXHQvLyBuZWVkIHRvIGFwcGx5IFNoYWRlcml0eS50cmFuc2Zvcm1Ub0dMU0xFUzEsIHRyYW5zZm9ybVRvR0xTTEVTMyBvciB0cmFuc2Zvcm1UbyBtZXRob2Rcblx0cHJpdmF0ZSBfX2NyZWF0ZVNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHR0aGlzLl9fZmlsbEVtcHR5RnVuY3Rpb25zKCk7XG5cblx0XHRjb25zdCBjb2RlXG5cdFx0XHQ9IGAjdmVyc2lvbiAzMDAgZXNcXG5cXG5gXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVEZWZpbmVEaXJlY3RpdmVTaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZUV4dGVuc2lvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlR2xvYmFsUHJlY2lzaW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVTdHJ1Y3REZWZpbml0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVHbG9iYWxDb25zdGFudFZhbHVlU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVBdHRyaWJ1dGVEZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlVmFyeWluZ0RlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVPdXRwdXRDb2xvckRlY2xhcmF0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVVbmlmb3JtRGVjbGFyYXRpb25TaGFkZXJDb2RlKClcblx0XHRcdCsgdGhpcy5fX2NyZWF0ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvblNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlVW5pZm9ybUJ1ZmZlck9iamVjdFNoYWRlckNvZGUoKVxuXHRcdFx0KyB0aGlzLl9fY3JlYXRlRnVuY3Rpb25EZWZpbml0aW9uU2hhZGVyQ29kZSgpXG5cdFx0XHQrIHRoaXMuX19jcmVhdGVNYWluRnVuY3Rpb25EZWZpbml0aW9uU2hhZGVyQ29kZSgpO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHRwcml2YXRlIF9fZmlsbEVtcHR5RnVuY3Rpb25zKCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fX2Z1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dGhpcy5fX2Z1bmN0aW9uc1tpXSA9IHRoaXMuX19mdW5jdGlvbnNbaV0gPz8gW107XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZURlZmluZURpcmVjdGl2ZVNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgZGVmaW5lRGlyZWN0aXZlTmFtZSBvZiB0aGlzLl9fZGVmaW5lRGlyZWN0aXZlTmFtZXMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYCNkZWZpbmUgJHtkZWZpbmVEaXJlY3RpdmVOYW1lfVxcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTs7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlRXh0ZW5zaW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBleHRlbnNpb24gb2YgdGhpcy5fX2V4dGVuc2lvbnMpIHtcblx0XHRcdHNoYWRlckNvZGUgKz0gYCNleHRlbnNpb24gJHtleHRlbnNpb24uZXh0ZW5zaW9uTmFtZX06ICR7ZXh0ZW5zaW9uLmJlaGF2aW9yfVxcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdC8vVE9ETzogcmVtb3ZlIG5lZWRsZXNzIHByZWNpc2lvbnNcblx0cHJpdmF0ZSBfX2NyZWF0ZUdsb2JhbFByZWNpc2lvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdHlwZSBpbiB0aGlzLl9fZ2xvYmFsUHJlY2lzaW9uKSB7XG5cdFx0XHRjb25zdCBwcmVjaXNpb25UeXBlID0gdHlwZSBhcyBTaGFkZXJQcmVjaXNpb25PYmplY3RLZXk7XG5cdFx0XHRjb25zdCBwcmVjaXNpb25RdWFsaWZpZXIgPSB0aGlzLl9fZ2xvYmFsUHJlY2lzaW9uW3ByZWNpc2lvblR5cGVdO1xuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGBwcmVjaXNpb24gJHtwcmVjaXNpb25RdWFsaWZpZXJ9ICR7cHJlY2lzaW9uVHlwZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVN0cnVjdERlZmluaXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHN0cnVjdERlZmluaXRpb24gb2YgdGhpcy5fX3N0cnVjdERlZmluaXRpb25zKSB7XG5cdFx0XHRzaGFkZXJDb2RlICs9IGBzdHJ1Y3QgJHtzdHJ1Y3REZWZpbml0aW9uLnN0cnVjdE5hbWV9IHtcXG5gO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCB2YXJpYWJsZSA9IHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0c1tpXTtcblxuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAgIGA7XG5cdFx0XHRcdGlmICh2YXJpYWJsZS5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dmFyaWFibGUucHJlY2lzaW9ufSBgO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJpYWJsZS50eXBlfSAke3ZhcmlhYmxlLm1lbWJlck5hbWV9O1xcbmA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYH07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZUdsb2JhbENvbnN0YW50VmFsdWVTaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IGdsb2JhbENvbnN0YW50VmFsdWUgb2YgdGhpcy5fX2dsb2JhbENvbnN0YW50VmFsdWVzKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gZ2xvYmFsQ29uc3RhbnRWYWx1ZS50eXBlO1xuXHRcdFx0Y29uc3QgdmFyaWFibGVOYW1lID0gZ2xvYmFsQ29uc3RhbnRWYWx1ZS52YXJpYWJsZU5hbWU7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IGdsb2JhbENvbnN0YW50VmFsdWUudmFsdWVzO1xuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGBjb25zdCAke3R5cGV9ICR7dmFyaWFibGVOYW1lfSA9ICR7dHlwZX0oYDtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSB2YWx1ZVtpXSArICcsICc7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgPSBzaGFkZXJDb2RlLnJlcGxhY2UoLyxcXHMkLywgJyk7XFxuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCBzdHJ1Y3RWYWx1ZSBvZiB0aGlzLl9fZ2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZXMpIHtcblx0XHRcdGNvbnN0IG1hdGNoZWRJbmRleCA9XG5cdFx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5maW5kSW5kZXgoZGVmaW5pdGlvbiA9PiBkZWZpbml0aW9uLnN0cnVjdE5hbWUgPT09IHN0cnVjdFZhbHVlLnN0cnVjdE5hbWUpO1xuXHRcdFx0aWYgKG1hdGNoZWRJbmRleCA9PT0gLTEpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogdGhlIHN0cnVjdCB0eXBlICR7c3RydWN0VmFsdWUuc3RydWN0TmFtZX0gaXMgbm90IGRlZmluZWRgKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYGNvbnN0ICR7c3RydWN0VmFsdWUuc3RydWN0TmFtZX0gJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9ID0gJHtzdHJ1Y3RWYWx1ZS5zdHJ1Y3ROYW1lfSAoXFxuYDtcblxuXHRcdFx0Y29uc3Qgc3RydWN0RGVmaW5pdGlvbiA9IHRoaXMuX19zdHJ1Y3REZWZpbml0aW9uc1ttYXRjaGVkSW5kZXhdO1xuXHRcdFx0aWYgKHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0cy5sZW5ndGggIT09IE9iamVjdC5rZXlzKHN0cnVjdFZhbHVlLnZhbHVlcykubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlR2xvYmFsQ29uc3RhbnRTdHJ1Y3RWYWx1ZVNoYWRlckNvZGU6IEludmFsaWQgbnVtYmVyIG9mIHZhcmlhYmxlcyB0aGF0ICR7c3RydWN0VmFsdWUudmFyaWFibGVOYW1lfSBoYXNgKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhhc1NhbXBsZXJUeXBlID1cblx0XHRcdFx0c3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzLnNvbWUobWVtYmVyT2JqZWN0ID0+IFV0aWxpdHkuX2lzU2FtcGxlclR5cGUobWVtYmVyT2JqZWN0LnR5cGUpKTtcblx0XHRcdGlmIChoYXNTYW1wbGVyVHlwZSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBfX2NyZWF0ZUdsb2JhbENvbnN0YW50U3RydWN0VmFsdWVTaGFkZXJDb2RlOiBDb25zdGFudFN0cnVjdFZhbHVlICgke3N0cnVjdFZhbHVlLnZhcmlhYmxlTmFtZX0pIGNhbm5vdCBoYXZlIHNhbXBsZXIgdHlwZSBwYXJhbWV0ZXJgKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0RGVmaW5pdGlvbi5tZW1iZXJPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlTmFtZSA9IHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0c1tpXS5tZW1iZXJOYW1lO1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IHN0cnVjdFZhbHVlLnZhbHVlc1t2YXJpYWJsZU5hbWVdXG5cdFx0XHRcdGlmICh2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9IGRvZXMgbm90IGhhdmUgdGhlIHZhbHVlIG9mICR7dmFyaWFibGVOYW1lfWApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgdHlwZSA9IHN0cnVjdERlZmluaXRpb24ubWVtYmVyT2JqZWN0c1tpXS50eXBlO1xuXHRcdFx0XHRjb25zdCBpc1ZhbGlkQ29tcG9uZW50TnVtYmVyID0gVXRpbGl0eS5faXNWYWxpZENvbXBvbmVudENvdW50KHR5cGUsIHZhbHVlKTtcblx0XHRcdFx0aWYgKCFpc1ZhbGlkQ29tcG9uZW50TnVtYmVyKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgX19jcmVhdGVHbG9iYWxDb25zdGFudFN0cnVjdFZhbHVlU2hhZGVyQ29kZTogdGhlIGNvbXBvbmVudCBjb3VudCBvZiAke3ZhcmlhYmxlTmFtZX0gaW4gJHtzdHJ1Y3RWYWx1ZS52YXJpYWJsZU5hbWV9IGlzIGludmFsaWRgKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCAgJHt0eXBlfShgO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0c2hhZGVyQ29kZSArPSB2YWx1ZVtpXSArICcsICc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzaGFkZXJDb2RlID0gc2hhZGVyQ29kZS5yZXBsYWNlKC8sXFxzJC8sICcpLFxcbicpO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlID0gc2hhZGVyQ29kZS5yZXBsYWNlKC8sXFxuJC8sICdcXG4pO1xcbicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlQXR0cmlidXRlRGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IGF0dHJpYnV0ZSBvZiB0aGlzLl9fYXR0cmlidXRlcykge1xuXHRcdFx0aWYgKGF0dHJpYnV0ZS5sb2NhdGlvbiAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYGxheW91dCAobG9jYXRpb24gPSAke2F0dHJpYnV0ZS5sb2NhdGlvbn0pIGA7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYGluIGA7XG5cblx0XHRcdGlmIChhdHRyaWJ1dGUucHJlY2lzaW9uICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHthdHRyaWJ1dGUucHJlY2lzaW9ufSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGAke2F0dHJpYnV0ZS50eXBlfSAke2F0dHJpYnV0ZS52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVWYXJ5aW5nRGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0bGV0IHNoYWRlckNvZGUgPSAnJztcblx0XHRmb3IgKGNvbnN0IHZhcnlpbmcgb2YgdGhpcy5fX3ZhcnlpbmdzKSB7XG5cdFx0XHRpZiAodmFyeWluZy5pbnRlcnBvbGF0aW9uVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYCR7dmFyeWluZy5pbnRlcnBvbGF0aW9uVHlwZX0gYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSB0aGlzLl9fc2hhZGVyU3RhZ2UgPT0gJ3ZlcnRleCcgPyBgb3V0IGAgOiBgaW4gYDtcblxuXHRcdFx0aWYgKHZhcnlpbmcucHJlY2lzaW9uICE9IG51bGwpIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJ5aW5nLnByZWNpc2lvbn0gYDtcblx0XHRcdH1cblxuXHRcdFx0c2hhZGVyQ29kZSArPSBgJHt2YXJ5aW5nLnR5cGV9ICR7dmFyeWluZy52YXJpYWJsZU5hbWV9O1xcbmA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdC8vVE9ETzogdHJhbnNsYXRlIHdoZW4gZ2xzbCBlczFcblx0cHJpdmF0ZSBfX2NyZWF0ZU91dHB1dENvbG9yRGVjbGFyYXRpb25TaGFkZXJDb2RlKCk6IHN0cmluZyB7XG5cdFx0aWYgKHRoaXMuX19zaGFkZXJTdGFnZSAhPT0gJ2ZyYWdtZW50Jykge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdHJldHVybiBgbGF5b3V0KGxvY2F0aW9uID0gMCkgb3V0IHZlYzQgJHt0aGlzLl9fb3V0cHV0Q29sb3JWYXJpYWJsZU5hbWV9O1xcblxcbmA7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlVW5pZm9ybURlY2xhcmF0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChjb25zdCB1bmlmb3JtIG9mIHRoaXMuX191bmlmb3Jtcykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgdW5pZm9ybSBgO1xuXG5cdFx0XHRpZiAodW5pZm9ybS5wcmVjaXNpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRzaGFkZXJDb2RlICs9IGAke3VuaWZvcm0ucHJlY2lzaW9ufSBgO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFkZXJDb2RlICs9IGAke3VuaWZvcm0udHlwZX0gJHt1bmlmb3JtLnZhcmlhYmxlTmFtZX07XFxuYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gVXRpbGl0eS5fYWRkTGluZUZlZWRDb2RlSWZOb3ROdWxsU3RyaW5nKHNoYWRlckNvZGUpO1xuXHR9XG5cblx0cHJpdmF0ZSBfX2NyZWF0ZVVuaWZvcm1TdHJ1Y3REZWNsYXJhdGlvblNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdW5pZm9ybVN0cnVjdCBvZiB0aGlzLl9fdW5pZm9ybVN0cnVjdHMpIHtcblx0XHRcdGNvbnN0IHN0cnVjdE5hbWUgPSB1bmlmb3JtU3RydWN0LnN0cnVjdE5hbWU7XG5cblx0XHRcdGNvbnN0IGV4aXN0U3RydWN0RGVmaW5pdGlvbiA9XG5cdFx0XHRcdHRoaXMuX19zdHJ1Y3REZWZpbml0aW9ucy5zb21lKGRlZmluaXRpb24gPT4gZGVmaW5pdGlvbi5zdHJ1Y3ROYW1lID09PSBzdHJ1Y3ROYW1lKTtcblx0XHRcdGlmICghZXhpc3RTdHJ1Y3REZWZpbml0aW9uKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYF9fY3JlYXRlVW5pZm9ybVN0cnVjdERlY2xhcmF0aW9uU2hhZGVyQ29kZTogdGhlIHN0cnVjdCB0eXBlICR7c3RydWN0TmFtZX0gaXMgbm90IGRlZmluZWRgKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHNoYWRlckNvZGUgKz0gYHVuaWZvcm0gJHtzdHJ1Y3ROYW1lfSAke3VuaWZvcm1TdHJ1Y3QudmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlVW5pZm9ybUJ1ZmZlck9iamVjdFNoYWRlckNvZGUoKTogc3RyaW5nIHtcblx0XHRsZXQgc2hhZGVyQ29kZSA9ICcnO1xuXHRcdGZvciAoY29uc3QgdWJvIG9mIHRoaXMuX191bmlmb3JtQnVmZmVyT2JqZWN0cykge1xuXHRcdFx0c2hhZGVyQ29kZSArPSBgbGF5b3V0IChzdGQxNDApIHVuaWZvcm0gJHt1Ym8uYmxvY2tOYW1lfSB7XFxuYDtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB1Ym8udmFyaWFibGVPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHZhcmlhYmxlT2JqID0gdWJvLnZhcmlhYmxlT2JqZWN0c1tpXTtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgICAke3ZhcmlhYmxlT2JqLnR5cGV9ICR7dmFyaWFibGVPYmoudmFyaWFibGVOYW1lfTtcXG5gO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodWJvLmluc3RhbmNlTmFtZSAhPSBudWxsKSB7XG5cdFx0XHRcdHNoYWRlckNvZGUgKz0gYH0gJHt1Ym8uaW5zdGFuY2VOYW1lfTtcXG5gO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBgfTtcXG5gO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBVdGlsaXR5Ll9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc2hhZGVyQ29kZSk7XG5cdH1cblxuXHRwcml2YXRlIF9fY3JlYXRlRnVuY3Rpb25EZWZpbml0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdGxldCBzaGFkZXJDb2RlID0gJyc7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9fZnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBmdW5jdGlvbk9iamVjdHMgPSB0aGlzLl9fZnVuY3Rpb25zW2ldO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBmdW5jdGlvbk9iamVjdHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0c2hhZGVyQ29kZSArPSBmdW5jdGlvbk9iamVjdHNbal0uZnVuY3Rpb25Db2RlICsgYFxcbmA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFV0aWxpdHkuX2FkZExpbmVGZWVkQ29kZUlmTm90TnVsbFN0cmluZyhzaGFkZXJDb2RlKTtcblx0fVxuXG5cdHByaXZhdGUgX19jcmVhdGVNYWluRnVuY3Rpb25EZWZpbml0aW9uU2hhZGVyQ29kZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLl9fbWFpbkZ1bmN0aW9uQ29kZSArIGBcXG5gO1xuXHR9XG59XG4iLCJpbXBvcnQge1NoYWRlckF0dHJpYnV0ZVZhclR5cGUsIFNoYWRlckNvbnN0YW50VmFsdWVWYXJUeXBlRVMzLCBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMywgU2hhZGVyVmFyeWluZ1ZhclR5cGV9IGZyb20gJy4uL3R5cGVzL3R5cGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVdGlsaXR5IHtcblx0c3RhdGljIF9zcGxpdEJ5TGluZUZlZWRDb2RlKHNvdXJjZTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHNvdXJjZS5zcGxpdCgvXFxyXFxufFxcbi8pO1xuXHR9XG5cblx0c3RhdGljIF9qb2luU3BsaXR0ZWRMaW5lKHNwbGl0dGVkTGluZTogc3RyaW5nW10pIHtcblx0XHRyZXR1cm4gc3BsaXR0ZWRMaW5lLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0c3RhdGljIF9hZGRMaW5lRmVlZENvZGVJZk5vdE51bGxTdHJpbmcoc291cmNlOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gc291cmNlID09PSAnJyA/IHNvdXJjZSA6IHNvdXJjZSArICdcXG4nO1xuXHR9XG5cblx0c3RhdGljIF9jb21wb25lbnROdW1iZXIoXG5cdFx0dHlwZTogU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgfCBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlIHwgU2hhZGVyVmFyeWluZ1ZhclR5cGUgfCBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTM1xuXHQpIHtcblx0XHRsZXQgY29tcG9uZW50TnVtYmVyO1xuXHRcdGlmIChcblx0XHRcdHR5cGUgPT09ICdmbG9hdCcgfHwgdHlwZSA9PT0gJ2ludCcgfHwgdHlwZSA9PT0gJ2Jvb2wnIHx8IHR5cGUgPT09ICd1aW50JyB8fFxuXHRcdFx0dHlwZSA9PT0gJ3NhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ3NhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAnc2FtcGxlcjNEJyB8fCB0eXBlID09PSAnc2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAnaXNhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICdpc2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAndXNhbXBsZXIyRCcgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyQ3ViZScgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICd1c2FtcGxlcjJEQXJyYXknIHx8XG5cdFx0XHR0eXBlID09PSAnc2FtcGxlcjJEU2hhZG93JyB8fCB0eXBlID09PSAnc2FtcGxlckN1YmVTaGFkb3cnIHx8IHR5cGUgPT09ICdzYW1wbGVyMkRBcnJheVNoYWRvdydcblx0XHQpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDE7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAndmVjMicgfHwgdHlwZSA9PT0gJ2l2ZWMyJyB8fCB0eXBlID09PSAnYnZlYzInIHx8IHR5cGUgPT09ICd1dmVjMicpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDI7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAndmVjMycgfHwgdHlwZSA9PT0gJ2l2ZWMzJyB8fCB0eXBlID09PSAnYnZlYzMnIHx8IHR5cGUgPT09ICd1dmVjMycpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDM7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAndmVjNCcgfHwgdHlwZSA9PT0gJ2l2ZWM0JyB8fCB0eXBlID09PSAnYnZlYzQnIHx8IHR5cGUgPT09ICd1dmVjNCcgfHwgdHlwZSA9PT0gJ21hdDInIHx8IHR5cGUgPT09ICdtYXQyeDInKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSA0O1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ21hdDJ4MycgfHwgdHlwZSA9PT0gJ21hdDN4MicpIHtcblx0XHRcdGNvbXBvbmVudE51bWJlciA9IDY7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAnbWF0Mng0JyB8fCB0eXBlID09PSAnbWF0NHgyJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gODtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQzJyB8fCB0eXBlID09PSAnbWF0M3gzJykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gOTtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQzeDQnIHx8IHR5cGUgPT09ICdtYXQ0eDMnKSB7XG5cdFx0XHRjb21wb25lbnROdW1iZXIgPSAxMjtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdtYXQ0JyB8fCB0eXBlID09PSAnbWF0NHg0Jykge1xuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMTY7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHVua25vd24gdHlwZVxuXHRcdFx0Y29tcG9uZW50TnVtYmVyID0gMDtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1V0aWxpdHkuX2NvbXBvbmVudE51bWJlcjogZGV0ZWN0IHVua25vd24gdHlwZScpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21wb25lbnROdW1iZXI7XG5cdH1cblxuXHRzdGF0aWMgX2lzSW50VHlwZShcblx0XHR0eXBlOiBTaGFkZXJDb25zdGFudFZhbHVlVmFyVHlwZUVTMyB8IFNoYWRlckF0dHJpYnV0ZVZhclR5cGUgfCBTaGFkZXJWYXJ5aW5nVmFyVHlwZSB8IFNoYWRlclVuaWZvcm1WYXJUeXBlRVMzXG5cdCkge1xuXHRcdGlmIChcblx0XHRcdHR5cGUgPT09ICdpbnQnIHx8IHR5cGUgPT09ICdpdmVjMicgfHwgdHlwZSA9PT0gJ2l2ZWMzJyB8fCB0eXBlID09PSAnaXZlYzQnIHx8XG5cdFx0XHR0eXBlID09PSAndWludCcgfHwgdHlwZSA9PT0gJ3V2ZWMyJyB8fCB0eXBlID09PSAndXZlYzMnIHx8IHR5cGUgPT09ICd1dmVjNCdcblx0XHQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIF9pc1ZhbGlkQ29tcG9uZW50Q291bnQoXG5cdFx0dHlwZTogU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgfCBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlIHwgU2hhZGVyVmFyeWluZ1ZhclR5cGUgfCBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTMyxcblx0XHR2YWx1ZXM6IG51bWJlcltdXG5cdCkge1xuXHRcdGNvbnN0IHZhbGlkQ29tcG9uZW50Q291bnQgPSBVdGlsaXR5Ll9jb21wb25lbnROdW1iZXIodHlwZSk7XG5cdFx0aWYgKHZhbGlkQ29tcG9uZW50Q291bnQgPT09IHZhbHVlcy5sZW5ndGgpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRzdGF0aWMgX2lzU2FtcGxlclR5cGUoXG5cdFx0dHlwZTogU2hhZGVyQ29uc3RhbnRWYWx1ZVZhclR5cGVFUzMgfCBTaGFkZXJBdHRyaWJ1dGVWYXJUeXBlIHwgU2hhZGVyVmFyeWluZ1ZhclR5cGUgfCBTaGFkZXJVbmlmb3JtVmFyVHlwZUVTM1xuXHQpIHtcblx0XHRpZiAoXG5cdFx0XHR0eXBlID09PSAnc2FtcGxlcjJEJyB8fCB0eXBlID09PSAnc2FtcGxlckN1YmUnIHx8IHR5cGUgPT09ICdzYW1wbGVyM0QnIHx8IHR5cGUgPT09ICdzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICdpc2FtcGxlcjJEJyB8fCB0eXBlID09PSAnaXNhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAnaXNhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ2lzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICd1c2FtcGxlcjJEJyB8fCB0eXBlID09PSAndXNhbXBsZXJDdWJlJyB8fCB0eXBlID09PSAndXNhbXBsZXIzRCcgfHwgdHlwZSA9PT0gJ3VzYW1wbGVyMkRBcnJheScgfHxcblx0XHRcdHR5cGUgPT09ICdzYW1wbGVyMkRTaGFkb3cnIHx8IHR5cGUgPT09ICdzYW1wbGVyQ3ViZVNoYWRvdycgfHwgdHlwZSA9PT0gJ3NhbXBsZXIyREFycmF5U2hhZG93J1xuXHRcdCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=