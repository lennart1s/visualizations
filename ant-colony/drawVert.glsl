precision highp float;

attribute float index;

uniform sampler2D texture;

/* vec4 floatToVec4(float val) {
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
} */

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
  gl_PointSize = 10.0;

  float xPerPix = 2.0 / 1280.0; // TODO; check theese values by displaying in fragShader
  float yPerPix = 2.0 / 720.0;

  vec4 posXData = texture2D(texture, vec2(xPerPix*index*2.0+0.25*xPerPix, 0.25*yPerPix));
  //float posX = vec4ToFloat(vec4(0.0, 0.0, posXData.xy*255.0));
  float posX = vec3ToFloat(vec3(posXData.xyz*255.0));
  vec4 posYData = texture2D(texture, vec2(xPerPix*index*2.0+0.75*xPerPix, 0.25*yPerPix));
  float posY = vec3ToFloat(vec3(posYData.xyz*255.0));

  /* vec4 velXData = texture2D(texture, vec2(xPerPix*index*2.0+1.25*xPerPix, 0.25*yPerPix));
  float velX = vec4ToFloat(vec4(0.0, 0.0, velXData.xy*255.0));
  vec4 velYData = texture2D(texture, vec2(xPerPix*index*2.0+1.75*xPerPix, 0.25*yPerPix));
  float velY = vec4ToFloat(vec4(0.0, 0.0, velYData.xy*255.0));
  
  posX += velX; */

  mat4 scale = mat4(2.0/1280.0, 0.0, 0.0, 0.0,
                          0.0, -2.0/720.0, 0.0, 0.0,
                          0.0,       0.0, 1.0, 0.0,
                          0.0,       0.0, 0.0, 1.0);
  mat4 transl = mat4(1.0, 0.0, 0.0, 0.0,
                     0.0, 1.0, 0.0, 0.0,
                     0.0, 0.0, 1.0, 0.0,
                     -1.0, 1.0, 0.0, 1.0);

  gl_Position = transl * scale * vec4(posX, posY, 0.0, 1.0);
}