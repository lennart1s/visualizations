precision highp float;

varying vec2 uv;

vec4 floatToVec4(float val) {
  float x = float(int(val / pow(2.0, 24.0)));
  val -= x*pow(2.0, 24.0);
  float y = float(int(val / pow(2.0, 16.0)));
  val -= y*pow(2.0, 16.0);
  float z = float(int(val / pow(2.0,  8.0)));
  val -= z*pow(2.0, 8.0);
  float w = val;

  return vec4(x, y, z, w);
}

float vec4ToFloat(vec4 vec) {
  float val = 0.0;
  val += vec.x * pow(2.0, 24.0);
  val += vec.y * pow(2.0, 16.0);
  val += vec.z * pow(2.0,  8.0);
  val += vec.w;

  return val;
}

void main(void) {
  vec4 testVec = vec4(0.0, 80.0, 2.0, 256.0);
  float f = vec4ToFloat(testVec);

  vec4 res = floatToVec4(f);
  float r = res.y;
  float g = res.z;
  float b = res.w;

  gl_FragColor = vec4(r/255.0, g/255.0, b/255.0, 1.0);
}

