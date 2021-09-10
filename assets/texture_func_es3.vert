in vec2 a_texcoord;
in vec3 a_texcoord3;
uniform sampler2D texture1;
uniform samplerCube texture2;
uniform mediump samplerCube texture3;

void fetch(
  samplerCube texture1,
  sampler2D texture2
) {
  gl_FragColor = textureLod(texture2, a_texcoord);
  gl_FragColor = textureLod(texture1, a_texcoord3);
  gl_FragColor = texture(texture3, a_texcoord3);
  gl_FragColor = textureProj(texture2, a_texcoord);
}

void fetch2(
  samplerCube texture2,
  // sampler2D texture1
) {
  gl_FragColor = texture(texture1, a_texcoord);
  gl_FragColor = texture(texture2, a_texcoord3);
  gl_FragColor = textureProj(texture1, a_texcoord);
}

void main () {
  fetch(texture2, texture1);
  fetch2(texture2, texture1);
}
