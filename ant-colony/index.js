const FPS_CAP = 60
const NUM_AGENTS = 20

let deltaTime = 0

window.onload = main


async function main() {
  const canvas = document.getElementById("glCanvas")
  var gl = canvas.getContext("webgl2", {antialias: false})
  if (!gl) {
    alert("Unable to initialize WebGL")
    return
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  
  let agentsImg = createAgents()
  let prevDataTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, prevDataTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1280, 720, 0, gl.RGBA, gl.UNSIGNED_BYTE, agentsImg);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let prevDataTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, prevDataTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, prevDataTexture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  let dataTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, dataTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1280, 720, 0, gl.RGBA, gl.UNSIGNED_BYTE, agentsImg);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let dataTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, dataTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dataTexture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  let agentsTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, agentsTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1280, 720, 0, gl.RGBA, gl.UNSIGNED_BYTE, agentsImg);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let agentsTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, agentsTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, agentsTexture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  let copyShader = await loadShadersToProgram(gl, './copyFragShader.glsl', './copyVertShader.glsl')
  let moveShader = await loadShadersToProgram(gl, './moveFragShader.glsl', './moveVertShader.glsl')
  let moveDeltaTimeUniPos = gl.getUniformLocation(moveShader, 'deltaTime')

  var moveVBOVerts = [
    -1.0, -1.0, 0.0, 0.0,
    -1.0,  1.0, 0.0, 1.0,
    1.0, -1.0, 1.0, 0.0,
    1.0,  1.0, 1.0, 1.0,
  ]
  let moveVBO = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, moveVBO)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(moveVBOVerts), gl.STATIC_DRAW)
  let moveVAO = gl.createVertexArray()
  gl.bindVertexArray(moveVAO)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4*Float32Array.BYTES_PER_ELEMENT, 0)
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4*Float32Array.BYTES_PER_ELEMENT, 2*Float32Array.BYTES_PER_ELEMENT)
  gl.enableVertexAttribArray(0)
  gl.enableVertexAttribArray(1)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.bindVertexArray(null)

  let drawShader = await loadShadersToProgram(gl, './drawFrag.glsl', './drawVert.glsl')
  var drawVBOVerts = []
  for (let i = 0.0; i < NUM_AGENTS; i++) {
    drawVBOVerts.push(i)
  }
  let drawVBO = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, drawVBO)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(drawVBOVerts), gl.STATIC_DRAW)
  let drawVAO = gl.createVertexArray()
  gl.bindVertexArray(drawVAO)
  gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.bindVertexArray(null)
  
  
  await Quad.init(gl)
  let initSample = new Quad(-0.7, 0.7, 0.5, 0.4)
  initSample.texture = prevDataTexture
  let dataSample = new Quad(7.0, 7.0, 16.0, 16.0)
  dataSample.texture = dataTexture
  let agentSample = new Quad(0.0, 0.0, 1.8, 1.8)
  agentSample.texture = agentsTexture

  let lastTime = Date.now()-1
  while (true) {
    let now = Date.now()
    deltaTime = now - lastTime
    if (deltaTime < 1000/FPS_CAP) {
      await Sleep(1000/FPS_CAP - deltaTime)
      continue
    }
    lastTime = now


    /*gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(moveShader)
    gl.bindVertexArray(moveVAO)
    gl.bindTexture(gl.TEXTURE_2D, initAgentsTexture)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindVertexArray(null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)*/

    gl.bindFramebuffer(gl.FRAMEBUFFER, dataTextureFBO)
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(moveShader)
    gl.uniform1f(moveDeltaTimeUniPos, deltaTime)
    gl.bindVertexArray(moveVAO)
    gl.bindTexture(gl.TEXTURE_2D, prevDataTexture)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindVertexArray(null)

    gl.bindFramebuffer(gl.FRAMEBUFFER, agentsTextureFBO)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(drawShader)
    gl.bindVertexArray(drawVAO)
    gl.bindTexture(gl.TEXTURE_2D, dataTexture)
    gl.drawArrays(gl.POINTS, 0, NUM_AGENTS)
    gl.bindVertexArray(null)

    gl.bindFramebuffer(gl.FRAMEBUFFER, prevDataTextureFBO)
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(copyShader)
    gl.bindVertexArray(moveVAO)
    gl.bindTexture(gl.TEXTURE_2D, dataTexture)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindVertexArray(null)
    

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT)


    Quad.prepareRender(gl)
    //initSample.render(gl)
    dataSample.render(gl)
    agentSample.render(gl)
    Quad.postpareRender(gl)

    // break
  }
}

function createAgents() {
  let data = new Uint8Array(1280*720*4)

  for (let i = 0; i < NUM_AGENTS; i++) {
    //let y = intToVec2(20*(i+1))
    //let velX = intToVec2(i)
    let posX = floatToVec3(100)
    let posY = floatToVec3(20*(i+1))
    let velX = floatToVec3(i*10)
    let velY = floatToVec3(0)
    data[i*16] = posX.x
    data[i*16+1] = posX.y
    data[i*16+2] = posX.Z
    data[i*16+3] = 255
    data[i*16+4] = posY.x
    data[i*16+5] = posY.y
    data[i*16+6] = posY.z
    data[i*16+7] = 255
    data[i*16+8] = velX.x
    data[i*16+9] = velX.y
    data[i*16+10] = velX.z
    data[i*16+11] = 255
    data[i*16+12] = velY.x
    data[i*16+13] = velY.y
    data[i*16+14] = velY.z
    data[i*16+15] = 255
  }
  
  return data
}

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function intToVec2(val) {
  let x = val >> 8
  val -= x*(2<<7)
  let y = val
  
  return { x, y }
}

function floatToVec3(val) {
  if (val == 0) {
    return {
      x: 0,
      y: 0,
      z: 0,
    }
  }
  
  let exponentBits = 7
  let mantissaBits = 16
  let sign = val < 0 ? 1 : 0

  let mantissa = Math.abs(val)
  let exponent = 0
  while (mantissa >= 2 || mantissa < 1) {
    if (mantissa >= 2) {
      mantissa /= 2
      exponent++
    } else if (mantissa < 1) {
      mantissa *= 2
      exponent--
    }
  }

  let exponentInt = Math.pow(2, exponentBits-1) -1 +exponent

  mantissa -= 1
  let mantissaInt = 0
  for (let mb = 1; mb <= mantissaBits; mb++) {
    let ib = mantissaBits - mb
    if (mantissa >= Math.pow(2, -mb)) {
      mantissaInt += Math.pow(2, ib)
      mantissa -= Math.pow(2, -mb)
    }
  }

  let mantissaV2 = intToVec2(mantissaInt)

  return {
    x: exponentInt + sign*128,
    y: mantissaV2.x,
    z: mantissaV2.y,
  }
}

function vec3ToFloat(vec) {
  if (vec.x == 0 && vec.y == 0 && vec.z == 0) {
    return 0.0
  }

  let exponentBits = 7
  let mantissaBits = 16

  let sign = vec.x >= 128 ? 1 : 0
  let exponent = vec.x - sign*128 - Math.pow(2, exponentBits-1) +1;

  let mantissaInt = vec.y*Math.pow(2, 8) + vec.z
  let mantissa = 1.0
  for (let ib = mantissaBits-1; ib >= 0; ib--) {
    if (mantissaInt >= Math.pow(2, ib)) {
      mantissaInt -= Math.pow(2, ib)
      mantissa += Math.pow(2, -(mantissaBits-ib))
    }
  }

  let val = (1.0-2.0*sign) * mantissa * Math.pow(2.0, exponent)
  return val
}