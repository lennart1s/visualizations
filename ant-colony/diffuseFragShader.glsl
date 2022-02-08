precision highp float;

uniform sampler2D texture;

varying vec2 uv;

void main(void) {
  vec4 col = texture2D(texture, uv);

  float xPerPix = 1.0 / 1280.0;
  float yPerPix = 1.0 / 720.0;
  vec4 sum = vec4(0.0);
  for (float xOff = -1.0; xOff <= 1.0; xOff += 1.0) {
    for (float yOff = -1.0; yOff <= 1.0; yOff += 1.0) { 
      sum += texture2D(texture, uv+vec2(xOff*xPerPix, yOff*yPerPix));
    }
  }
  sum = sum / (3.0*3.0); 

  if (dot(sum, sum) < 0.3) {
    sum = vec4(0.0, 0.0, 0.0, 1.0);
  }

  gl_FragColor = sum * 0.99;
}

