precision highp float;

in vec2 v_texcoord2;
in vec3 v_texcoord3;
uniform sampler2D texture1;
uniform samplerCube texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform sampler2D texture5;

void fetch(
  mediump samplerCube texture1,
  sampler2D texture2,
  out samplerCube texture3
) {
  texture3 = texture1;

  texture(texture2, v_texcoord2);
  texture(texture1, v_texcoord3);
  textureProj(texture2, v_texcoord3);

  for(float i = 0.0; i < 5.0; i++) {

  }

  textureLod(texture1, v_texcoord3, 0.0);
  texture(texture2, v_texcoord2);
  texture(texture1, v_texcoord3);
  textureProj(texture2, v_texcoord3);
  textureProjLod(texture2, v_texcoord3, 0.0);
}

void fetch2(
  samplerCube texture2,
  in samplerCube texture4,
  const in samplerCube texture5
) {
  texture(texture1, v_texcoord2);
  texture(texture2, v_texcoord3);
  textureProj(texture1, v_texcoord3);

  if(true) {
  }

  bool test = true;

  if(test) {
  }

  textureLod(texture1, v_texcoord2, 0.0);
  texture(texture1, v_texcoord2);
  texture(texture2, v_texcoord3);
  textureProj(texture1, v_texcoord3);

  texture(texture3, v_texcoord3);
  texture(texture4, v_texcoord3);
  texture(texture5, v_texcoord3);
}

void main () {
  fetch(texture2, texture1);
  fetch2(texture2);
}
