in vec2 v_texcoord;
in vec3 v_texcoord3;
uniform sampler2D texture1;
uniform samplerCube texture2;

void fetch(
  samplerCube texture1,
  sampler2D texture2
) {
  gl_FragColor = texture(texture2, v_texcoord);
  gl_FragColor = texture(texture1, v_texcoord3);
  gl_FragColor = textureProj(texture2, v_texcoord);
}

void fetch2(
  samplerCube texture2,
  sampler2D texture1
) {
  gl_FragColor = texture(texture1, v_texcoord);
  gl_FragColor = texture(texture2, v_texcoord3);
  gl_FragColor = textureProj(texture1, v_texcoord);
}

void main () {
  fetch(texture2, texture1);
  fetch2(texture2, texture1);
}
