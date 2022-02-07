precision highp float;

uniform sampler2D agentTexture;
uniform vec2 dimensions;

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
  float xPerPix = 1.0 / dimensions.x;
  float yPerPix = 1.0 / dimensions.y;

  vec4 agentData = texture2D(agentTexture, uv);
  gl_FragColor = vec4(uv, 0.0, 1.0);
  return;

  if (uv.x <= 0.25) {
    float x = vec4ToFloat(vec4(0.0, 0.0, agentData.xy));
    float velX = vec4ToFloat(vec4(0.0, 0.0, texture2D(agentTexture, uv+vec2(0.5, 0.0))));
    gl_FragColor = vec4(floatToVec4(x+velX).zw, 0.0, 1.0);
    return;
  }

  //float x = vec4ToFloat(vec4(0.0, 0.0, agentData.xy));
  //float

  gl_FragColor = agentData;
  gl_FragColor = vec4(0.3, 0.3, 0.4, 1.0);
}