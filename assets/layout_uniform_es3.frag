varying vec2 v_texcoord;
varying vec3 v_texcoord3;
layout(location = 0) uniform sampler2D u_texture;
layout(location = 1) uniform samplerCube u_textureCube;


void main () {
  gl_FragColor = texture2D(u_texture, v_texcoord);
  gl_FragColor = textureCube(u_textureCube, v_texcoord3);
  gl_FragColor = texture2DProj(u_texture, v_texcoord);
}
