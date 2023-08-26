const Shaderity = require('../dist/esm/index').default;
const ifdefFragment = require('../dist/index_test').ifdefFragment;
const ifdef2Fragment = require('../dist/index_test').ifdef2Fragment;
const elifFragment = require('../dist/index_test').elifFragment;

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

in vec4 vTexcoord7;

in vec4 vTexcoord10;
`);
});

test('test elif', async() => {
    expect(Shaderity.processPragma(elifFragment).code).toBe(`precision mediump float;


in vec4 vColor;

in vec4 vColor4;

in vec4 vColor7;
`);
});
