precision highp float;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main(void) {
  float dist = sqrt(pow(gl_PointCoord.x-0.5, 2.0) + pow(gl_PointCoord.y-0.5, 2.0));

  float val = map(sqrt(dist), 0.0, sqrt(0.5), 1.0, 0.0);
  gl_FragColor = vec4(1.0, 1.0, 1.0, val);
}