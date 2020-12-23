# Shaderity

Shaderity is a shader tool set.

## Features

- Provide `#include` like statement for GLSL shader files. (similar syntax to glslify)
- Transpile between GLSL ES 1.0 and GLSL ES 3.0 .
- Embed GLSL shader files into TypeScript/JavaScript with WebPack Loader. (see [shaderity-loader](https://github.com/actnwit/shaderity))
- Variables fill-in to GLSL code in runtime.
- Can be used in conjunction with glslify.

## How to use

### Converting GLSL ES 100 to GLSL ES 300

```javascript
const Shaderity = require('shaderity');

const shaderObj = {
    code:`
precision mediump float;

varying vec4 vColor;
varying vec4 vTexcoord;

void main() {
  gl_FlagColor = vColor;
}
`,
    shaderStage: 'fragment'
};

const convertedObj = shaderity.transformToGLSLES3(shaderObj);
console.out(convertedObj.code);
/*
precision mediump float;

in vec4 vColor;
in vec4 vTexcoord;

void main() {
  gl_FlagColor = vColor;
}
*/
```

You can check more functionalities in [test/basic.test.js](./test/basic.test.js) .

## LICENSE

MIT License
