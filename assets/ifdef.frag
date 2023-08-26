precision mediump float;

#define GL_ES

#ifdef GL_ES
in vec4 vColor;
#endif

#ifdef GL_ES2
in vec4 vTexcoord;
#endif

#ifdef GL_ES
in vec4 vColor2;
#else
in vec4 vTexcoord2;
#endif

#ifdef GL_ES2
in vec4 vTexcoord;
#else
in vec4 vNormal;
#endif

void main() {
  gl_FlagColor = vColor;
}
