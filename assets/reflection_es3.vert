in vec3 a_position;
in vec2 a_uv; // < semantic=TEXCOORD_0 >
out vec3 v_position;

uniform vec4 u_worldMatrix;
uniform sampler2D u_texture; // <semantic=DataTexture, min=10, max=100, default=>

int main() {
  gl_Position = a_position;
  v_position = a_position;
}
