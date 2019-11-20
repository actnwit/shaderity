attribute vec3 a_position;
varying vec3 v_position;

uniform vec4 u_worldMatrix;

int main() {
  gl_Position = a_position;
  v_position = a_position;
}
