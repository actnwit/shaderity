// texture_es1.frag
#version 100

varying vec2 v_texcoord;
varying vec3 v_texcoord3;
uniform sampler2D u_texture;
uniform sampler3D u_texture_3D;
uniform samplerCube u_textureCube;

void main (void) {
  gl_FragColor = texture2D(u_texture, v_texcoord);
  gl_FragColor = textureCube(u_textureCube, v_texcoord3);
  gl_FragColor = texture2DProj(u_texture, v_texcoord);
  gl_FragColor = texture3D(u_texture_3D, v_texcoord);
  gl_FragColor = texture3DProj(u_texture_3D, v_texcoord);
}
