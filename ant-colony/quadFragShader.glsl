precision highp float;

uniform sampler2D texture;
uniform int textured;

varying vec2 uv;

void main(void) {
  if (textured == 1) {
    gl_FragColor = texture2D(texture, uv);
  } else {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
}

