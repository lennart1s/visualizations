precision highp float;

uniform sampler2D texture;
uniform vec2 window;

varying vec2 uv;

void main(void) {
  vec4 col = texture2D(texture, uv);

  float xPerPix = 1.0 / window.x;
  float yPerPix = 1.0 / window.y;
  vec4 sum = vec4(0.0);
  for (float xOff = -1.0; xOff <= 1.0; xOff += 1.0) {
    for (float yOff = -1.0; yOff <= 1.0; yOff += 1.0) { 
      sum += texture2D(texture, uv+vec2(xOff*xPerPix, yOff*yPerPix));
    }
  }
  sum = sum / (3.0*3.0); 

  sum -= 0.025; // 0.02

  if (dot(sum, sum) < 0.4) {
    sum = vec4(0.0, 0.0, 0.0, 1.0);
  }

  gl_FragColor = sum;
}

