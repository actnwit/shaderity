precision mediump float;

in vec4 vColor;

#pragma shaderity: ${var_a}
#pragma shaderity: ${var_b}

void main() {
  gl_FlagColor = zero_one(vColor);
}
