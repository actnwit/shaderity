precision mediump float;

#define GL_ES
#define GL_ES_3

#ifdef GL_ES
in vec4 vColor;
  #ifdef GL_ES_3
    in vec4 vTexcoord2;
  #else
    in vec4 vTexcoord3;
  #endif
#else
in vec4 vTexcoord4;
#endif

#ifdef GL_ES
  #ifdef GL_ES_2
    in vec4 vTexcoord2;
  #else
    in vec4 vTexcoord3;
  #endif
in vec4 vColor;
#else
in vec4 vTexcoord4;
#endif

#ifdef GL_ES_4
in vec4 vColor;
  #ifdef GL_ES
    in vec4 vTexcoord5;
  #else
    in vec4 vTexcoord6;
  #endif
#else
in vec4 vTexcoord7;
#endif

#ifdef GL_ES_4
in vec4 vColor;
  #ifdef GL_ES_5
    in vec4 vTexcoord8;
  #else
    in vec4 vTexcoord9;
  #endif
#else
in vec4 vTexcoord10;
#endif

#ifdef GL_ES2
in vec4 vColor;
#else
in vec4 vTexcoord4;
  #ifdef GL_ES_3
    in vec4 vTexcoord2;
  #else
    in vec4 vTexcoord3;
  #endif
#endif

#ifdef GL_ES2
in vec4 vColor;
#else
  #ifdef GL_ES_2
    in vec4 vTexcoord2;
  #else
    in vec4 vTexcoord3;
  #endif
in vec4 vTexcoord4;
#endif
