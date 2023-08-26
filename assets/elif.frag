precision mediump float;

#define GL_ES
#define GL_ES2
#define GL_ES4

#ifdef GL_ES
in vec4 vColor;
#elif defined(GL_ES2)
in vec4 vColor2;
#endif

#ifdef GL_ES3
in vec4 vColor3;
#elif defined(GL_ES4)
in vec4 vColor4;
#endif

#ifdef GL_ES5
in vec4 vColor5;
#elif defined(GL_ES6)
in vec4 vColor6;
#else
in vec4 vColor7;
#endif
