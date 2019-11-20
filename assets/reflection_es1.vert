attribute vec3 a_position;
varying vec3 v_position;

int main() {
  gl_Position = a_position;
  v_position = a_position;
}
