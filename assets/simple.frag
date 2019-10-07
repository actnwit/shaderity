precision mediump float;

in vec4 vColor;
in vec4 vTexcoord;

void main() {
  gl_FlagColor = vColor;
}
