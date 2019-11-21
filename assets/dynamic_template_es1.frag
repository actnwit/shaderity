precision mediump float;

in vec4 vColor;

/* shaderity: ${var_a} */
/* shaderity: ${ var_b } */

void main() {
  gl_FlagColor = zero_one(vColor);
}
