const Shaderity = require('../dist/esm/index').default;
const ifdefFragment = require('../dist/index_test').ifdefFragment;

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
