attribute vec2 position;
attribute vec2 uvIn;

varying vec2 uv;

void main(void) {
  uv = uvIn;
  gl_Position = vec4(position, 0.0, 1.0);
}