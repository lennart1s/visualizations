precision highp float;

uniform sampler2D texture;
uniform float deltaTime;

varying vec2 uv;

/*vec4 floatToVec4(float val) {
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
}*/

vec3 floatToVec3(float val) {
  if (val == 0.0) {
    return vec3(0.0, 0.0, 0.0);
  }

  int exponentBits = 7;
  int mantissaBits = 16;

  int signBit = 0;
  if (val < 0.0) {
    signBit = 1;
    val = abs(val);
  }

  float mantissa = val;
  int exponent = 0;
  for (int i = 0; i < 50; i++) {
    if (mantissa >= 2.0) {
      mantissa /= 2.0;
      exponent++;
    } else if (mantissa < 1.0) {
      mantissa *= 2.0;
      exponent--;
    } else {
      break;
    }
  }

  int exponentInt = int(pow(2.0, float(7)-1.0)) -1 + exponent;

  mantissa -= 1.0;
  int mantissaInt = 0;
  for (int mb = 1; mb <= 16; mb++) {
    int ib = mantissaBits - mb;
    if (mantissa >= pow(2.0, -float(mb))) {
      mantissaInt += int(pow(2.0, float(ib)));
      mantissa -= pow(2.0, -float(mb));
    }
  }

  int r = exponentInt+signBit*128;
  int g = int(float(mantissaInt) / pow(2.0, 8.0));
  mantissaInt -= g*int(pow(2.0, 8.0));
  int b = mantissaInt;

  return vec3(float(r), float(g), float(b));
}

float vec3ToFloat(vec3 vec) {
  if (vec.x == 0.0 && vec.y == 0.0 && vec.z == 0.0) {
    return 0.0;
  }

  int signBit = 0;
  if (vec.x >= 128.0) {
    signBit = 1;
  }
  int exponent = int(vec.x) - signBit*128 - int(pow(2.0, 6.0)) + 1;

  int mantissaInt = int(vec.y * pow(2.0, 8.0)) + int(vec.z);
  float mantissa = 1.0;
  for (int ib = 15; ib >= 0; ib--) {
    if (mantissaInt >= int(pow(2.0, float(ib)))) {
      mantissaInt -= int(pow(2.0, float(ib)));
      mantissa += pow(2.0, -float(16-ib));
    }
  }

  return float(1-2*signBit) * float(mantissa) * pow(2.0, float(exponent));
}

void main(void) {
  float speed = 100.0;
  float xPerPix = 1.0 / 1280.0;
  float yPerPix = 1.0 / 720.0;

  vec4 data = texture2D(texture, uv);
  if (data.w != 1.0) { // unused pixel
    return;
  }

  gl_FragColor = data;

  if (mod(uv.x/xPerPix, 4.0) < 1.0) { // posX
    float posX = vec3ToFloat(data.xyz*255.0);
    vec4 dirData = texture2D(texture, vec2(uv.x+2.0*xPerPix, uv.y));
    float dir = vec3ToFloat(dirData.xyz*255.0);
    vec3 vec = floatToVec3(posX+(cos(dir)*speed*(deltaTime/1000.0)));
    gl_FragColor = vec4(vec.xyz/255.0, 1.0);
  } else if (mod(uv.x/xPerPix, 4.0) < 2.0) { // posY
    float posY = vec3ToFloat(data.xyz*255.0);
    vec4 dirData = texture2D(texture, vec2(uv.x+1.0*xPerPix, uv.y));
    float dir = vec3ToFloat(dirData.xyz*255.0);
    vec3 vec = floatToVec3(posY+(sin(dir)*speed*(deltaTime/1000.0)));
    gl_FragColor = vec4(vec.xyz/255.0, 1.0);
  } else if (mod(uv.x/xPerPix, 4.0) < 3.0) {  // velX
    float velX = vec3ToFloat(data.xyz*255.0);
    vec4 posXData = texture2D(texture, vec2(uv.x-2.0*xPerPix, uv.y));
    float posX = vec3ToFloat(posXData.xyz*255.0);
    float nextX = posX + velX*(deltaTime/1000.0);
    if (nextX < 0.0 || nextX >= 1280.0) {
      velX *= -1.0;
    }
    vec3 vec = floatToVec3(velX);
    gl_FragColor = vec4(vec.xyz/255.0, 1.0);
  } else if (mod(uv.x/xPerPix, 4.0) < 4.0) {  // velY
    float velY = vec3ToFloat(data.xyz*255.0);
    vec4 posYData = texture2D(texture, vec2(uv.x-2.0*xPerPix, uv.y));
    float posY = vec3ToFloat(posYData.xyz*255.0);
    float nextY = posY + velY*(deltaTime/1000.0);
    if (nextY < 0.0 || nextY >= 720.0) {
      velY *= -1.0;
    }
    vec3 vec = floatToVec3(velY);
    gl_FragColor = vec4(vec.xyz/255.0, 1.0);
  }
}

