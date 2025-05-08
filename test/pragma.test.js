const Shaderity = require('../dist/esm/index').default;
const ifdefFragment = require('../dist/index_test').ifdefFragment;
const ifdef2Fragment = require('../dist/index_test').ifdef2Fragment;
const elifFragment = require('../dist/index_test').elifFragment;
const ifdef3Fragment = require('../dist/index_test').ifdef3Fragment;

test('test ifdef', async() => {
    expect(Shaderity.processPragma(ifdefFragment).code).toBe(`precision mediump float;


in vec4 vColor;


in vec4 vColor2;

in vec4 vNormal;

void main() {
  gl_FlagColor = vColor;
}
`);
});

test('test double ifdef', async() => {
    expect(Shaderity.processPragma(ifdef2Fragment).code).toBe(`precision mediump float;


in vec4 vColor;
    in vec4 vTexcoord2;

    in vec4 vTexcoord3;
in vec4 vColor;

in vec4 vTexcoord7;

in vec4 vTexcoord10;

in vec4 vTexcoord4;
    in vec4 vTexcoord2;

    in vec4 vTexcoord3;
in vec4 vTexcoord4;

`);
});

test('test elif', async() => {
    expect(Shaderity.processPragma(elifFragment).code).toBe(`precision mediump float;


in vec4 vColor;

in vec4 vColor4;

in vec4 vColor7;
`);
});

test('test triple ifdef', async() => {
    expect(Shaderity.processPragma(ifdef3Fragment).code).toBe(`precision mediump float;


in vec4 vColor;
      in vec4 vTexcoord0;
    in vec4 vTexcoord2;

      in vec4 vTexcoord0;
    in vec4 vTexcoord2;

    in vec4 vTexcoord0;
      in vec4 vTexcoord1;
in vec4 vTexcoord4;

`);
});
