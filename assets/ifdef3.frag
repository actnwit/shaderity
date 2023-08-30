precision mediump float;

#define GL_ES
#define GL_ES_2
#define GL_ES_3

#ifdef GL_ES
in vec4 vColor;
  #ifdef GL_ES_2
    #ifdef GL_ES_3
      in vec4 vTexcoord0;
    #else
      in vec4 vTexcoord1;
    #endif
    in vec4 vTexcoord2;
  #else
    in vec4 vTexcoord3;
  #endif
#else
in vec4 vTexcoord4;
#endif

#ifdef GL_ES_1
in vec4 vColor;
#elif defined(GL_ES)
  #ifdef GL_ES_2
    #ifdef GL_ES_3
      in vec4 vTexcoord0;
    #else
      in vec4 vTexcoord1;
    #endif
    in vec4 vTexcoord2;
  #elif defined(GL_ES_3)
    in vec4 vTexcoord0;
  #else
    in vec4 vTexcoord3;
  #endif
#else
in vec4 vTexcoord4;
#endif

#ifdef GL_ES_1
in vec4 vColor;
#elif defined(GL_ES_0)
in vec4 vColor2;
#else
  #ifdef GL_ES_4
    in vec4 vTexcoord2;
  #elif defined(GL_ES_3)
    in vec4 vTexcoord0;
    #ifdef GL_ES_5
      in vec4 vTexcoord0;
    #else
      in vec4 vTexcoord1;
    #endif
  #else
    in vec4 vTexcoord3;
  #endif
in vec4 vTexcoord4;
#endif

#ifdef GL_ES_5
  #ifdef GL_ES_6
    in vec4 vTexcoord1;
  #else
    #ifdef GL_ES_7
    in vec4 vTexcoord2;
    #else
    in vec4 vTexcoord3;
    #endif
  #endif
#endif
