attribute vec4 position;

uniform vec3 translation;
uniform float radius;

void main(void) {
  gl_PointSize = radius * 2.0;
  gl_Position = vec4(position.x+translation.x, position.y+translation.y, 0.0, 1.0);
}