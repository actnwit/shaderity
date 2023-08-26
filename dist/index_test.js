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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src_for_test/index_test.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/attribute_and_varying_precision_es3.vert":
/*!*********************************************************!*\
  !*** ./assets/attribute_and_varying_precision_es3.vert ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"in float a_testA;\\nin lowp float a_testB;\\n\\nout float v_testA;\\nout lowp float v_testB;\\n\\nvoid main() {}\\n\",\"shaderStage\":\"vertex\",\"isFragmentShader\":false});\n\n//# sourceURL=webpack:///./assets/attribute_and_varying_precision_es3.vert?");

/***/ }),

/***/ "./assets/dynamic_template_es1.frag":
/*!******************************************!*\
  !*** ./assets/dynamic_template_es1.frag ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"precision mediump float;\\n\\nin vec4 vColor;\\n\\n/* shaderity: @{var_a} */\\n/* shaderity: @{ var_b } */\\n\\nvoid main() {\\n  gl_FlagColor = zero_one(vColor);\\n}\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/dynamic_template_es1.frag?");

/***/ }),

/***/ "./assets/elif.frag":
/*!**************************!*\
  !*** ./assets/elif.frag ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"precision mediump float;\\n\\n#define GL_ES\\n#define GL_ES2\\n#define GL_ES4\\n\\n#ifdef GL_ES\\nin vec4 vColor;\\n#elif defined(GL_ES2)\\nin vec4 vColor2;\\n#endif\\n\\n#ifdef GL_ES3\\nin vec4 vColor3;\\n#elif defined(GL_ES4)\\nin vec4 vColor4;\\n#endif\\n\\n#ifdef GL_ES5\\nin vec4 vColor5;\\n#elif defined(GL_ES6)\\nin vec4 vColor6;\\n#else\\nin vec4 vColor7;\\n#endif\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/elif.frag?");

/***/ }),

/***/ "./assets/ifdef.frag":
/*!***************************!*\
  !*** ./assets/ifdef.frag ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"precision mediump float;\\n\\n#define GL_ES\\n\\n#ifdef GL_ES\\nin vec4 vColor;\\n#endif\\n\\n#ifdef GL_ES2\\nin vec4 vTexcoord;\\n#endif\\n\\n#ifdef GL_ES\\nin vec4 vColor2;\\n#else\\nin vec4 vTexcoord2;\\n#endif\\n\\n#ifdef GL_ES2\\nin vec4 vTexcoord;\\n#else\\nin vec4 vNormal;\\n#endif\\n\\nvoid main() {\\n  gl_FlagColor = vColor;\\n}\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/ifdef.frag?");

/***/ }),

/***/ "./assets/ifdef2.frag":
/*!****************************!*\
  !*** ./assets/ifdef2.frag ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"precision mediump float;\\n\\n#define GL_ES\\n#define GL_ES_3\\n\\n#ifdef GL_ES\\nin vec4 vColor;\\n  #ifdef GL_ES_3\\n    in vec4 vTexcoord2;\\n  #else\\n    in vec4 vTexcoord3;\\n  #endif\\n#else\\nin vec4 vTexcoord4;\\n#endif\\n\\n#ifdef GL_ES\\nin vec4 vColor;\\n  #ifdef GL_ES_2\\n    in vec4 vTexcoord2;\\n  #else\\n    in vec4 vTexcoord3;\\n  #endif\\n#else\\nin vec4 vTexcoord4;\\n#endif\\n\\n#ifdef GL_ES_4\\nin vec4 vColor;\\n  #ifdef GL_ES\\n    in vec4 vTexcoord5;\\n  #else\\n    in vec4 vTexcoord6;\\n  #endif\\n#else\\nin vec4 vTexcoord7;\\n#endif\\n\\n#ifdef GL_ES_4\\nin vec4 vColor;\\n  #ifdef GL_ES_5\\n    in vec4 vTexcoord8;\\n  #else\\n    in vec4 vTexcoord9;\\n  #endif\\n#else\\nin vec4 vTexcoord10;\\n#endif\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/ifdef2.frag?");

/***/ }),

/***/ "./assets/insert_definition_es3.vert":
/*!*******************************************!*\
  !*** ./assets/insert_definition_es3.vert ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"in vec3 position;\\n\\nvoid main () {\\n  gl_Position = vec4(position, 1.0);\\n}\\n\",\"shaderStage\":\"vertex\",\"isFragmentShader\":false});\n\n//# sourceURL=webpack:///./assets/insert_definition_es3.vert?");

/***/ }),

/***/ "./assets/layout_attribute_es3.vert":
/*!******************************************!*\
  !*** ./assets/layout_attribute_es3.vert ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"in float a_testA;\\nin lowp vec2 a_testB;\\nlayout (location = 0) in float a_testC;\\nlayout (location = 1) in lowp vec2 a_testD;\\n\\nvoid main () {}\\n\",\"shaderStage\":\"vertex\",\"isFragmentShader\":false});\n\n//# sourceURL=webpack:///./assets/layout_attribute_es3.vert?");

/***/ }),

/***/ "./assets/layout_uniform_es3.frag":
/*!****************************************!*\
  !*** ./assets/layout_uniform_es3.frag ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"varying vec2 v_texcoord;\\nvarying vec3 v_texcoord3;\\nlayout(location = 0) uniform sampler2D u_texture;\\nlayout(location = 1) uniform samplerCube u_textureCube;\\n\\n\\nvoid main () {\\n  gl_FragColor = texture2D(u_texture, v_texcoord);\\n  gl_FragColor = textureCube(u_textureCube, v_texcoord3);\\n  gl_FragColor = texture2DProj(u_texture, v_texcoord);\\n}\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/layout_uniform_es3.frag?");

/***/ }),

/***/ "./assets/out_qualifier_fragment_es3.frag":
/*!************************************************!*\
  !*** ./assets/out_qualifier_fragment_es3.frag ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"layout(location = 0) out vec4 rt0;\\n\\nvoid main () {\\n  if(false){\\n    return;\\n  }\\n}\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/out_qualifier_fragment_es3.frag?");

/***/ }),

/***/ "./assets/out_to_gl_frag_color.frag":
/*!******************************************!*\
  !*** ./assets/out_to_gl_frag_color.frag ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"#version 300 es\\n\\nlayout(location = 0) out vec4 renderTarget0;\\n\\nvoid main() {}\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/out_to_gl_frag_color.frag?");

/***/ }),

/***/ "./assets/precision_es3.vert":
/*!***********************************!*\
  !*** ./assets/precision_es3.vert ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"#version 300 es\\n\\nprecision mediump int;\\nprecision lowp float;\\nprecision highp sampler2D;\\nprecision highp samplerCube;\\nprecision highp sampler3D;\\nprecision highp sampler2DArray;\\nprecision highp isampler2D;\\nprecision highp isamplerCube;\\nprecision highp isampler3D;\\nprecision highp isampler2DArray;\\nprecision highp usampler2D;\\nprecision highp usamplerCube;\\nprecision highp usampler3D;\\nprecision highp usampler2DArray;\\nprecision highp sampler2DShadow;\\nprecision highp samplerCubeShadow;\\nprecision highp sampler2DArrayShadow;\\n\\nvoid main() {}\\n\",\"shaderStage\":\"vertex\",\"isFragmentShader\":false});\n\n//# sourceURL=webpack:///./assets/precision_es3.vert?");

/***/ }),

/***/ "./assets/reflection_es1.vert":
/*!************************************!*\
  !*** ./assets/reflection_es1.vert ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"attribute vec3 a_position;\\nattribute vec2 a_uv; // < semantic=TEXCOORD_0 >\\nvarying vec3 v_position;\\n\\nuniform vec4 u_worldMatrix;\\nuniform sampler2D u_texture; // <semantic=DataTexture, min=10, max=100, default=>\\n\\nint main() {\\n  gl_Position = a_position;\\n  v_position = a_position;\\n}\\n\",\"shaderStage\":\"vertex\",\"isFragmentShader\":false});\n\n//# sourceURL=webpack:///./assets/reflection_es1.vert?");

/***/ }),

/***/ "./assets/reflection_es3.vert":
/*!************************************!*\
  !*** ./assets/reflection_es3.vert ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"in vec3 a_position;\\nin vec2 a_uv; // < semantic=TEXCOORD_0 >\\nout vec3 v_position;\\n\\nuniform vec4 u_worldMatrix;\\nuniform sampler2D u_texture; // <semantic=DataTexture, min=10, max=100, default=>\\n\\nint main() {\\n  gl_Position = a_position;\\n  v_position = a_position;\\n}\\n\",\"shaderStage\":\"vertex\",\"isFragmentShader\":false});\n\n//# sourceURL=webpack:///./assets/reflection_es3.vert?");

/***/ }),

/***/ "./assets/simple_es3.frag":
/*!********************************!*\
  !*** ./assets/simple_es3.frag ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"precision mediump float;\\n\\nin vec4 vColor;\\nin vec4 vTexcoord;\\n\\nvoid main() {\\n  gl_FlagColor = vColor;\\n}\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/simple_es3.frag?");

/***/ }),

/***/ "./assets/simple_es3.vert":
/*!********************************!*\
  !*** ./assets/simple_es3.vert ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"in vec3 position;\\nin vec4 color;\\nuniform mat4 matrix;\\nout vec4 vColor;\\n\\nvoid main () {\\n  vColor = color;\\n  gl_Position = matrix * position;\\n}\\n\",\"shaderStage\":\"vertex\",\"isFragmentShader\":false});\n\n//# sourceURL=webpack:///./assets/simple_es3.vert?");

/***/ }),

/***/ "./assets/smooth_varying_es3.vert":
/*!****************************************!*\
  !*** ./assets/smooth_varying_es3.vert ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"#version 300 es\\n\\nprecision highp int;\\nprecision highp float;\\nprecision highp sampler2D;\\nprecision highp samplerCube;\\n\\nout float v_testA;\\nsmooth out lowp mat2 v_testB;\\n\\nvoid main() {}\\n\",\"shaderStage\":\"vertex\",\"isFragmentShader\":false});\n\n//# sourceURL=webpack:///./assets/smooth_varying_es3.vert?");

/***/ }),

/***/ "./assets/texture_es1.frag":
/*!*********************************!*\
  !*** ./assets/texture_es1.frag ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"// texture_es1.frag\\n#version 100\\n\\nvarying vec2 v_texcoord;\\nvarying vec3 v_texcoord3;\\nuniform sampler2D u_texture;\\nuniform sampler3D u_texture_3D;\\nuniform samplerCube u_textureCube;\\n\\nvoid main () {\\n  gl_FragColor = texture2D(u_texture, v_texcoord);\\n  gl_FragColor = textureCube(u_textureCube, v_texcoord3);\\n  gl_FragColor = texture2DProj(u_texture, v_texcoord);\\n  gl_FragColor = texture3D(u_texture_3D, v_texcoord);\\n  gl_FragColor = texture3DProj(u_texture_3D, v_texcoord);\\n}\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/texture_es1.frag?");

/***/ }),

/***/ "./assets/texture_es3.frag":
/*!*********************************!*\
  !*** ./assets/texture_es3.frag ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"#version 300 es\\n\\nin vec2 v_texcoord;\\nin vec3 v_texcoord3;\\nuniform sampler2D u_texture;\\nuniform samplerCube u_textureCube;\\n\\nvoid main () {\\n  gl_FragColor = texture(u_texture, v_texcoord);\\n  gl_FragColor = texture(u_textureCube, v_texcoord3);\\n  gl_FragColor = textureProj(u_texture, v_texcoord);\\n}\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/texture_es3.frag?");

/***/ }),

/***/ "./assets/texture_func_complicated_es3.frag":
/*!**************************************************!*\
  !*** ./assets/texture_func_complicated_es3.frag ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"precision highp float;\\n\\nin vec2 v_texcoord2;\\nin vec3 v_texcoord3;\\nuniform sampler2D texture1;\\nuniform samplerCube texture2;\\nuniform sampler2D texture3;\\nuniform sampler2D texture4;\\nuniform sampler2D texture5;\\n\\nvoid fetch(\\n  mediump samplerCube texture1,\\n  sampler2D texture2,\\n  out samplerCube texture3\\n) {\\n  texture3 = texture1;\\n\\n  texture(texture2, v_texcoord2);\\n  texture(texture1, v_texcoord3);\\n  textureProj(texture2, v_texcoord3);\\n\\n  for(float i = 0.0; i < 5.0; i++) {\\n\\n  }\\n\\n  textureLod(texture1, v_texcoord3, 0.0);\\n  texture(texture2, v_texcoord2);\\n  texture(texture1, v_texcoord3);\\n  textureProj(texture2, v_texcoord3);\\n  textureProjLod(texture2, v_texcoord3, 0.0);\\n}\\n\\nvoid fetch2(\\n  samplerCube texture2,\\n  in samplerCube texture4,\\n  const in samplerCube texture5\\n) {\\n  texture(texture1, v_texcoord2);\\n  texture(texture2, v_texcoord3);\\n  textureProj(texture1, v_texcoord3);\\n\\n  if(true) {\\n  }\\n\\n  bool test = true;\\n\\n  if(test) {\\n  }\\n\\n  textureLod(texture1, v_texcoord2, 0.0);\\n  texture(texture1, v_texcoord2);\\n  texture(texture2, v_texcoord3);\\n  textureProj(texture1, v_texcoord3);\\n\\n  texture(texture3, v_texcoord3);\\n  texture(texture4, v_texcoord3);\\n  texture(texture5, v_texcoord3);\\n}\\n\\nvoid main () {\\n  fetch(texture2, texture1);\\n  fetch2(texture2);\\n}\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/texture_func_complicated_es3.frag?");

/***/ }),

/***/ "./assets/texture_func_es3.frag":
/*!**************************************!*\
  !*** ./assets/texture_func_es3.frag ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"in vec2 v_texcoord;\\nin vec3 v_texcoord3;\\nuniform sampler2D texture1;\\nuniform samplerCube texture2;\\nuniform mediump samplerCube texture3;\\n\\nvoid fetch(\\n  samplerCube texture1,\\n  sampler2D texture2\\n) {\\n  gl_FragColor = texture(texture2, v_texcoord);\\n  gl_FragColor = texture(texture1, v_texcoord3);\\n  gl_FragColor = texture(texture3, v_texcoord3);\\n  gl_FragColor = textureProj(texture2, v_texcoord);\\n}\\n\\nvoid fetch2(\\n  samplerCube texture2,\\n  // sampler2D texture1\\n) {\\n  gl_FragColor = texture(texture1, v_texcoord);\\n  gl_FragColor = texture(texture2, v_texcoord3);\\n  gl_FragColor = textureProj(texture1, v_texcoord);\\n}\\n\\nvoid main () {\\n  fetch(texture2, texture1);\\n  fetch2(texture2, texture1);\\n}\\n\",\"shaderStage\":\"fragment\",\"isFragmentShader\":true});\n\n//# sourceURL=webpack:///./assets/texture_func_es3.frag?");

/***/ }),

/***/ "./assets/texture_func_es3.vert":
/*!**************************************!*\
  !*** ./assets/texture_func_es3.vert ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"code\":\"in vec2 a_texcoord;\\nin vec3 a_texcoord3;\\nuniform sampler2D texture1;\\nuniform samplerCube texture2;\\nuniform mediump samplerCube texture3;\\n\\nvoid fetch(\\n  samplerCube texture1,\\n  sampler2D texture2\\n) {\\n  gl_FragColor = textureLod(texture2, a_texcoord);\\n  gl_FragColor = textureLod(texture1, a_texcoord3);\\n  gl_FragColor = texture(texture3, a_texcoord3);\\n  gl_FragColor = textureProj(texture2, a_texcoord);\\n}\\n\\nvoid fetch2(\\n  samplerCube texture2,\\n  // sampler2D texture1\\n) {\\n  gl_FragColor = texture(texture1, a_texcoord);\\n  gl_FragColor = texture(texture2, a_texcoord3);\\n  gl_FragColor = textureProj(texture1, a_texcoord);\\n}\\n\\nvoid main () {\\n  fetch(texture2, texture1);\\n  fetch2(texture2, texture1);\\n}\\n\",\"shaderStage\":\"vertex\",\"isFragmentShader\":false});\n\n//# sourceURL=webpack:///./assets/texture_func_es3.vert?");

/***/ }),

/***/ "./src_for_test/index_test.js":
/*!************************************!*\
  !*** ./src_for_test/index_test.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _assets_simple_es3_frag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/simple_es3.frag */ \"./assets/simple_es3.frag\");\n/* harmony import */ var _assets_simple_es3_vert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/simple_es3.vert */ \"./assets/simple_es3.vert\");\n/* harmony import */ var _assets_texture_es1_frag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/texture_es1.frag */ \"./assets/texture_es1.frag\");\n/* harmony import */ var _assets_texture_es3_frag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/texture_es3.frag */ \"./assets/texture_es3.frag\");\n/* harmony import */ var _assets_texture_func_es3_frag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/texture_func_es3.frag */ \"./assets/texture_func_es3.frag\");\n/* harmony import */ var _assets_texture_func_es3_vert__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/texture_func_es3.vert */ \"./assets/texture_func_es3.vert\");\n/* harmony import */ var _assets_texture_func_complicated_es3_frag__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../assets/texture_func_complicated_es3.frag */ \"./assets/texture_func_complicated_es3.frag\");\n/* harmony import */ var _assets_dynamic_template_es1_frag__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../assets/dynamic_template_es1.frag */ \"./assets/dynamic_template_es1.frag\");\n/* harmony import */ var _assets_insert_definition_es3_vert__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../assets/insert_definition_es3.vert */ \"./assets/insert_definition_es3.vert\");\n/* harmony import */ var _assets_reflection_es1_vert__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../assets/reflection_es1.vert */ \"./assets/reflection_es1.vert\");\n/* harmony import */ var _assets_reflection_es3_vert__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../assets/reflection_es3.vert */ \"./assets/reflection_es3.vert\");\n/* harmony import */ var _assets_layout_uniform_es3_frag__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../assets/layout_uniform_es3.frag */ \"./assets/layout_uniform_es3.frag\");\n/* harmony import */ var _assets_precision_es3_vert__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../assets/precision_es3.vert */ \"./assets/precision_es3.vert\");\n/* harmony import */ var _assets_attribute_and_varying_precision_es3_vert__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../assets/attribute_and_varying_precision_es3.vert */ \"./assets/attribute_and_varying_precision_es3.vert\");\n/* harmony import */ var _assets_layout_attribute_es3_vert__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../assets/layout_attribute_es3.vert */ \"./assets/layout_attribute_es3.vert\");\n/* harmony import */ var _assets_out_to_gl_frag_color_frag__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../assets/out_to_gl_frag_color.frag */ \"./assets/out_to_gl_frag_color.frag\");\n/* harmony import */ var _assets_smooth_varying_es3_vert__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../assets/smooth_varying_es3.vert */ \"./assets/smooth_varying_es3.vert\");\n/* harmony import */ var _assets_out_qualifier_fragment_es3_frag__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../assets/out_qualifier_fragment_es3.frag */ \"./assets/out_qualifier_fragment_es3.frag\");\n/* harmony import */ var _assets_elif_frag__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../assets/elif.frag */ \"./assets/elif.frag\");\n/* harmony import */ var _assets_ifdef_frag__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../assets/ifdef.frag */ \"./assets/ifdef.frag\");\n/* harmony import */ var _assets_ifdef2_frag__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../assets/ifdef2.frag */ \"./assets/ifdef2.frag\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nexports.simpleFragment = _assets_simple_es3_frag__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\r\nexports.simpleVertex = _assets_simple_es3_vert__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\r\nexports.textureFragmentES1 = _assets_texture_es1_frag__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\r\nexports.textureFragmentES3 = _assets_texture_es3_frag__WEBPACK_IMPORTED_MODULE_3__[\"default\"];\r\nexports.textureFuncFragmentES3 = _assets_texture_func_es3_frag__WEBPACK_IMPORTED_MODULE_4__[\"default\"];\r\nexports.textureFuncVertexES3 = _assets_texture_func_es3_vert__WEBPACK_IMPORTED_MODULE_5__[\"default\"];\r\nexports.textureFuncComplicatedES3Shader = _assets_texture_func_complicated_es3_frag__WEBPACK_IMPORTED_MODULE_6__[\"default\"];\r\nexports.dynamicTemplateFragment = _assets_dynamic_template_es1_frag__WEBPACK_IMPORTED_MODULE_7__[\"default\"];\r\nexports.insertDefinitionVertex = _assets_insert_definition_es3_vert__WEBPACK_IMPORTED_MODULE_8__[\"default\"];\r\nexports.reflectionVertexES1 = _assets_reflection_es1_vert__WEBPACK_IMPORTED_MODULE_9__[\"default\"];\r\nexports.reflectionVertexES3 = _assets_reflection_es3_vert__WEBPACK_IMPORTED_MODULE_10__[\"default\"];\r\nexports.layoutUniformFragmentES3 = _assets_layout_uniform_es3_frag__WEBPACK_IMPORTED_MODULE_11__[\"default\"];\r\nexports.precisionES3 = _assets_precision_es3_vert__WEBPACK_IMPORTED_MODULE_12__[\"default\"];\r\nexports.attributeAndVaryingPrecisionES3 = _assets_attribute_and_varying_precision_es3_vert__WEBPACK_IMPORTED_MODULE_13__[\"default\"];\r\nexports.layoutAttributeES3 = _assets_layout_attribute_es3_vert__WEBPACK_IMPORTED_MODULE_14__[\"default\"];\r\nexports.outToGlFragColorES3 = _assets_out_to_gl_frag_color_frag__WEBPACK_IMPORTED_MODULE_15__[\"default\"];\r\nexports.smoothVaryingES3 = _assets_smooth_varying_es3_vert__WEBPACK_IMPORTED_MODULE_16__[\"default\"];\r\nexports.outQualifierFragmentES3 = _assets_out_qualifier_fragment_es3_frag__WEBPACK_IMPORTED_MODULE_17__[\"default\"];\r\nexports.elifFragment = _assets_elif_frag__WEBPACK_IMPORTED_MODULE_18__[\"default\"];\r\nexports.ifdefFragment = _assets_ifdef_frag__WEBPACK_IMPORTED_MODULE_19__[\"default\"];\r\nexports.ifdef2Fragment = _assets_ifdef2_frag__WEBPACK_IMPORTED_MODULE_20__[\"default\"];\r\n\n\n//# sourceURL=webpack:///./src_for_test/index_test.js?");

/***/ })

/******/ });