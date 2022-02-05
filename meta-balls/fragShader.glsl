precision mediump float;

void main(void) {
  float dist = 0.5 - sqrt(pow(gl_PointCoord.x-0.5, 2.0) + pow(gl_PointCoord.y-0.5, 2.0));

  gl_FragColor = vec4(1.0, 1.0, 1.0, dist);
}