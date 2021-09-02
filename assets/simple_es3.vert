in vec3 position;
in vec4 color;
uniform mat4 matrix;
out vec4 vColor;

void main () {
  vColor = color;
  gl_Position = matrix * position;
}
