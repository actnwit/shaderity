attribute vec3 a_position;
varying vec3 v_position;

uniform vec4 u_worldMatrix;  // < semantic = WorldMatrix >
uniform sampler2D u_texture; // <semantic=DataTexture, min=10, max=100>

int main() {
  gl_Position = a_position;
  v_position = a_position;
}
