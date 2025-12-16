const Shaderity = require('../dist/esm/index').default;
const ifdefFragment = require('../dist/index_test').ifdefFragment;
const ifdef2Fragment = require('../dist/index_test').ifdef2Fragment;
const elifFragment = require('../dist/index_test').elifFragment;
const ifdef3Fragment = require('../dist/index_test').ifdef3Fragment;
const complexMacroFragment = require('../dist/index_test').complexMacroFragment;

test('test ifdef', async() => {
    // console.log(Shaderity.processPragma(ifdefFragment).code);
    expect(Shaderity.processPragma(ifdefFragment).code).toBe(`precision mediump float;

#define GL_ES

in vec4 vColor;


in vec4 vColor2;

in vec4 vNormal;

void main() {
  gl_FlagColor = vColor;
}
`);
});

test('test double ifdef', async() => {
    // console.log(Shaderity.processPragma(ifdef2Fragment).code);
    expect(Shaderity.processPragma(ifdef2Fragment).code).toBe(`precision mediump float;

#define GL_ES
#define GL_ES_3

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
    // console.log(Shaderity.processPragma(elifFragment).code);
    expect(Shaderity.processPragma(elifFragment).code).toBe(`precision mediump float;

#define GL_ES
#define GL_ES2
#define GL_ES4

in vec4 vColor;

in vec4 vColor4;

in vec4 vColor7;
`);
});

test('test triple ifdef', async() => {
    // console.log(Shaderity.processPragma(ifdef3Fragment).code);
    expect(Shaderity.processPragma(ifdef3Fragment).code).toBe(`precision mediump float;

#define GL_ES
#define GL_ES_2
#define GL_ES_3

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

test('test complex macro', async() => {
  // console.log(Shaderity.processPragma(complexMacroFragment).code);
    expect(Shaderity.processPragma(complexMacroFragment).code).toBe(`#define VERSION 2
    // バージョン1より新しい
#define DEBUG
#define RELEASE
    // リリースビルド
#define LINUX
    // Windows または Linux
    // MACOSではない
#define FEATURE_A
#define BETA
    // 複雑な条件による分岐
`);
});
