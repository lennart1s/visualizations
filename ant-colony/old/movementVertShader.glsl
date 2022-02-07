attribute vec4 pos;

varying vec2 uv;

void main(void) {
  uv = pos.zw;
  gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
}