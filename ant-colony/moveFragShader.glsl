precision highp float;

uniform sampler2D texture;
uniform sampler2D heatMap;
uniform float deltaTime;
uniform vec2 window;

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

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float hash(float x) {
  x += 1.54235;
  x *= x / 2352.0;
  x = sin(x);

  return x;
}

void main(void) {
  float speed = 300.0;
  float xPerPix = 1.0 / window.x;
  float yPerPix = 1.0 / window.y;

  vec4 data = texture2D(texture, uv);
  if (data.w != 1.0) { // unused pixel
    return;
  }

  gl_FragColor = data;

  if (mod(uv.x/xPerPix, 4.0) < 1.0) { // posX
    float posX = vec3ToFloat(data.xyz*255.0);
    vec4 dirData = texture2D(texture, vec2(uv.x+2.0*xPerPix, uv.y));
    float dir = vec3ToFloat(dirData.xyz*255.0);

    float new = posX+(cos(dir)*speed*(deltaTime/1000.0));
    if (new >= window.x) {
      new = window.x-1.0;
    } else if (new < 0.0) {
      new = 0.0;
    }

    vec3 vec = floatToVec3(new);
    gl_FragColor = vec4(vec.xyz/255.0, 1.0);

  } else if (mod(uv.x/xPerPix, 4.0) < 2.0) { // posY
    float posY = vec3ToFloat(data.xyz*255.0);
    vec4 dirData = texture2D(texture, vec2(uv.x+1.0*xPerPix, uv.y));
    float dir = vec3ToFloat(dirData.xyz*255.0);

    float new = posY+(sin(dir)*speed*(deltaTime/1000.0));
    if (new >= window.y) {
      new = window.y-1.0;
    } else if (new < 0.0) {
      new = 0.0;
    }

    vec3 vec = floatToVec3(new);
    gl_FragColor = vec4(vec.xyz/255.0, 1.0);

  } else if (mod(uv.x/xPerPix, 4.0) < 3.0) {  // dir
    float dir = vec3ToFloat(data.xyz*255.0);

    vec4 posXData = texture2D(texture, vec2(uv.x-2.0*xPerPix, uv.y));
    float posX = vec3ToFloat(posXData.xyz*255.0);
    vec4 posYData = texture2D(texture, vec2(uv.x-1.0*xPerPix, uv.y));
    float posY = vec3ToFloat(posYData.xyz*255.0);

    float angle = 33.0 / (2.0*3.141592);
    float lookDist = 32.0;
    vec2 left = vec2(posX + lookDist*cos(dir+angle), posY + lookDist*sin(dir+angle));
    vec2 ahead = vec2(posX + lookDist*cos(dir), posY + lookDist*sin(dir));
    vec2 right = vec2(posX + lookDist*cos(dir-angle), posY + lookDist*sin(dir-angle));

    float valLeft = 0.0;
    for (float xOff = -5.0; xOff <= 5.0; xOff++) {
      for (float yOff = -5.0; yOff <= 5.0; yOff++) {
        valLeft += texture2D(heatMap, vec2((left.x+xOff)*xPerPix, 1.0-(left.y+yOff)*yPerPix)).x;
      }
    }
    valLeft /= 25.0;
    float valAhead = 0.0;
    for (float xOff = -5.0; xOff <= 5.0; xOff++) {
      for (float yOff = -5.0; yOff <= 5.0; yOff++) {
        valAhead += texture2D(heatMap, vec2((ahead.x+xOff)*xPerPix, 1.0-(ahead.y+yOff)*yPerPix)).x;
      }
    }
    valAhead /= 25.0;
    float valRight = 0.0;
    for (float xOff = -5.0; xOff <= 5.0; xOff++) {
      for (float yOff = -5.0; yOff <= 5.0; yOff++) {
        valRight += texture2D(heatMap, vec2((right.x+xOff)*xPerPix, 1.0-(right.y+yOff)*yPerPix)).x;
      }
    }
    valRight /= 25.0;

    if (ahead.x < 20.0 || ahead.x >= window.x-20.0 || ahead.y < 2.0 || ahead.y > window.y-20.0) {
      dir += 3.141592;
    } else if (left.x < 20.0 || left.x >= window.x-20.0 || left.y < 2.0 || left.y > window.y-20.0) {
      dir += 0.7;
    } else if (right.x < 20.0 || right.x >= window.x-20.0 || right.y < 2.0 || right.y > window.y-20.0) {
      dir -= 0.7;
    } else if (valLeft > valAhead && valLeft > valRight) {
      dir -= (valLeft - valAhead)*0.4;
    } else if (valRight > valAhead && valRight > valLeft) {
      dir += (valRight - valAhead)*0.4;
    }
    dir += 0.25*hash(posX*posY);

    float nextX = posX + cos(dir)*speed*(deltaTime/1000.0);
    float nextY = posY + sin(dir)*speed*(deltaTime/1000.0);
    if (nextX < 0.0 || nextX >= window.x || nextY < 0.0 || nextY >= window.y) {
      dir += hash(dir)*2.0*3.141592;
    }
    if (dir > 3.141592 * 2.0) {
      dir = mod(dir, 3.141592*2.0);
    } else if (dir < 0.0) {
      dir += 2.0*3.141592;
    }

    vec3 vec = floatToVec3(dir);
    gl_FragColor = vec4(vec.xyz/255.0, 1.0);
    
  } else if (mod(uv.x/xPerPix, 4.0) < 4.0) {  // empty
  
  }
}

