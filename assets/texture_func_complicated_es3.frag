precision highp float;

in vec2 v_texcoord2;
in vec3 v_texcoord3;
uniform sampler2D texture1;
uniform samplerCube texture2;

void fetch(
  mediump samplerCube texture1,
  sampler2D texture2
) {

  texture(texture2, v_texcoord2);
  textureCube(texture1, v_texcoord3);
  textureProj(texture2, v_texcoord3);

  for(float i = 0.0; i < 5.0; i++) {

  }

  texture(texture2, v_texcoord2);
  textureCube(texture1, v_texcoord3);
  textureProj(texture2, v_texcoord3);
}

void fetch2(samplerCube texture2) {
  texture(texture1, v_texcoord2);
  textureCube(texture2, v_texcoord3);
  textureProj(texture1, v_texcoord3);

  if(true) {
  }

  bool test = true;

  if(test) {
  }

  texture(texture1, v_texcoord2);
  textureCube(texture2, v_texcoord3);
  textureProj(texture1, v_texcoord3);
}

void main () {
  fetch(texture2, texture1);
  fetch2(texture2);
}
