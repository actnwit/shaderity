attribute vec3 a_position;
attribute vec2 a_uv; // < semantic=TEXCOORD_0 >
varying vec3 v_position;

uniform vec4 u_worldMatrix;  // < semantic = WorldMatrix >
uniform sampler2D u_texture; // <semantic=DataTexture, min=10, max=100, default=>

int main() {
  gl_Position = a_position;
  v_position = a_position;
}
