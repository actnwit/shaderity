#version 300 es

in vec2 v_texcoord;
in vec3 v_texcoord3;
uniform sampler2D u_texture;
uniform samplerCube u_textureCube;

void main () {
  gl_FragColor = texture(u_texture, v_texcoord);
  gl_FragColor = texture(u_textureCube, v_texcoord3);
  gl_FragColor = textureProj(u_texture, v_texcoord);
}
