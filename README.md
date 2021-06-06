# Shaderity

Shaderity is a shader tool set.

Shaderity are composed from the several components.

- shaderity: This. for runtime features
- shaderity-loader: for static features
- shaderity-node: The internal component for shaderity-loader.

The name "Shaderity" was coined from the combination of "Shader" and "Integrity".

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

## Reflection

Shaderity analogizes the names of attribute variables in the vertex shader for mapping to the CPU-side vertex attributes semantics.

In this sample, Shaderity determines that `a_position` is a `POSITION` semantics. `a_uv` is not in the current Shaderity's analogy dictionary, so it is `UNKNOWN` as is, but the comment `// < semantic=TEXCOORD_0 >` allows Shaderity to determine that it is a `TEXCOORD_0` semantics. 

```glsl
in vec3 a_position;
in vec2 a_uv; // < semantic=TEXCOORD_0 >
out vec3 v_position;

uniform vec4 u_worldMatrix;
uniform sampler2D u_texture; // <semantic=DataTexture, min=10, max=100, default=>

int main() {
  gl_Position = a_position;
  v_position = a_position;
}
```

Here is the current analogy dictionary for vertex attribute variables.
(The key of the map is written in regular expression. The matching is ignoreCase.)

The semantics (the values of the map) definitions are referenced from glTF2 specification.
https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#meshes

```javascript
    this.__attributeSemanticsMap.set('position', 'POSITION');
    this.__attributeSemanticsMap.set('color$', 'COLOR_0');
    this.__attributeSemanticsMap.set('color_?0', 'COLOR_0');
    this.__attributeSemanticsMap.set('texcoord$', 'TEXCOORD_0');
    this.__attributeSemanticsMap.set('texcoord_?0', 'TEXCOORD_0');
    this.__attributeSemanticsMap.set('texcoord_?1', 'TEXCOORD_1');
    this.__attributeSemanticsMap.set('normal', 'NORMAL');
    this.__attributeSemanticsMap.set('tangent', 'TANGENT');
    this.__attributeSemanticsMap.set('joint$', 'JOINTS_0');
    this.__attributeSemanticsMap.set('bone$', 'JOINTS_0');
    this.__attributeSemanticsMap.set('joint_?0', 'JOINTS_0');
    this.__attributeSemanticsMap.set('bone_?0', 'JOINTS_0');
    this.__attributeSemanticsMap.set('weight$', 'WEIGHTS_0');
    this.__attributeSemanticsMap.set('weight_?0', 'WEIGHTS_0');
```

You can get the reflection data by like this.

```javascript
  const shaderity = Shaderity.getInstance();
  const reflection = shaderity.reflect(reflectionVertexES3);
  expect(reflection.attributes[0]).toStrictEqual(
    {
      name: 'a_position',
      type: 'vec3',
      semantic: 'POSITION'
    }
    );
  expect(reflection.attributes[1]).toStrictEqual(
    {
      name: 'a_uv',
      type: 'vec2',
      semantic: 'TEXCOORD_0'
    }
    );
```

You can add other words to analogy dictionary by this method.

```typescript
  addAttributeSemanticsMap(map: Map<string, string>) {
    this.__attributeSemanticsMap = new Map([...this.__attributeSemanticsMap, ...map]);
  }
```

You can check more functionalities in [test/basic.test.js](./test/basic.test.js) .

## LICENSE

MIT License
