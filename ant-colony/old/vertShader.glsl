attribute vec2 uvIn;

varying vec2 uv;

void main(void) {
  uv = uvIn;
  gl_Position = vec4(-1.0+2.0*uvIn.x, -1.0+2.0*uvIn.y, 0.0, 1.0);
}