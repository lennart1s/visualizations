precision highp float;

uniform sampler2D texture;

uniform vec2 window;

varying vec2 uv;

void main(void) {
  float xPerPix = 1.0 / window.x;
  float yPerPix = 1.0 / window.y;
  float sum = 0.0;
  for (float xOff = -5.0; xOff <= 5.0; xOff += 1.0) {
    for (float yOff = -5.0; yOff <= 5.0; yOff += 1.0) { 
      sum += texture2D(texture, uv+vec2(xOff*xPerPix, yOff*yPerPix)).x;
    }
  }
  sum = sum / (11.0*11.0);

  vec4 texCol = texture2D(texture, uv);
  //if (texCol.x > 0.6) {
  if (sum > 0.6) {
    gl_FragColor = vec4(gl_FragCoord.x/window.x, 0.0, gl_FragCoord.y/window.y, 1.0);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}

