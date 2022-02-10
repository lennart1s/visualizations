attribute vec4 position;
attribute vec2 uvIn;

uniform vec3 translation;
uniform vec3 scale;

varying vec2 uv;

void main(void) {
  uv = uvIn;
  mat4 scaleMat = mat4(scale.x,     0.0, 0.0, 0.0,
                           0.0, scale.y, 0.0, 0.0,
                           0.0,     0.0, 1.0, 0.0,
                           0.0,     0.0, 0.0, 1.0);

  mat4 translMat = mat4(1.0, 0.0, 0.0, 0.0,
                     0.0, 1.0, 0.0, 0.0,
                     0.0, 0.0, 1.0, 0.0,
                     translation.x, translation.y, 0.0, 1.0);

  gl_Position = translMat * scaleMat * (position);
}