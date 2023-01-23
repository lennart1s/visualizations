attribute vec4 position;

uniform vec3 translation;
uniform float radius;

uniform vec2 window;

void main(void) {
  mat4 scale = mat4(1.0/(window.x/2.0),        0.0, 0.0, 0.0,
                          0.0, -1.0/(window.y/2.0), 0.0, 0.0,
                          0.0,         0.0, 1.0, 0.0,
                          0.0,         0.0, 0.0, 1.0);
  mat4 transl = mat4(1.0, 0.0, 0.0, 0.0,
                     0.0, 1.0, 0.0, 0.0,
                     0.0, 0.0, 1.0, 0.0,
                     -1.0, 1.0, 0.0, 1.0);

  gl_PointSize = radius * 2.0;
  gl_Position = transl * scale * (position + vec4(translation, 0.0));
}