# Shaderity

Shaderity is a shader tool set.

Shaderity are composed from the several components.

- shaderity: This. for runtime features
- shaderity-loader: for static features
- shaderity-node: The internal component for shaderity-loader.

## Features

### Runtime features

With this `shaderity`, you can do the following things:

- Variables fill-in to GLSL code in runtime.
- Transpile between GLSL ES 1.0 and GLSL ES 3.0 .

### Static features

With [shaderity-loader](https://github.com/actnwit/shaderity-loader), you can do the following things:

- Provide `#include` like statement for GLSL shader files. (similar syntax to glslify)
- Embed GLSL shader files into TypeScript/JavaScript as a WebPack Loader.
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
