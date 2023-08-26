precision mediump float;

#define GL_ES

#ifdef GL_ES
in vec4 vColor;
#endif

#ifdef GL_ES2
in vec4 vTexcoord;
#endif

void main() {
  gl_FlagColor = vColor;
}
