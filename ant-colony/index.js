const FPS_CAP = 60
const NUM_AGENTS = 250000 // 1280*720/4    250000
let WIDTH = 0
let HEIGHT = 0

let deltaTime = 0

window.onload = main


async function main() {
  const canvas = document.getElementById("glCanvas")
  WIDTH = canvas.width
  HEIGHT = canvas.height
  console.log(WIDTH, HEIGHT)
  var gl = canvas.getContext("webgl2", {antialias: false})
  if (!gl) {
    alert("Unable to initialize WebGL")
    return
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  
  //let agentsImg = createAgents()
  let agentsImg = createBallAgents()
  let prevDataTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, prevDataTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, agentsImg);
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
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, agentsImg);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let dataTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, dataTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dataTexture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)


  let copyAgentsTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, copyAgentsTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let copyAgentsTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, copyAgentsTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, copyAgentsTexture, 0)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  let agentsTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, agentsTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let agentsTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, agentsTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, agentsTexture, 0)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  let copyShader = await loadShadersToProgram(gl, './copyFragShader.glsl', './copyVertShader.glsl')

  let diffuseShader = await loadShadersToProgram(gl, './diffuseFragShader.glsl', './diffuseVertShader.glsl')
  let diffuseWindowUniPos = gl.getUniformLocation(diffuseShader, 'window')
  
  let drawShader = await loadShadersToProgram(gl, './drawFrag.glsl', './drawVert.glsl')
  let drawWindowUniPos = gl.getUniformLocation(drawShader, 'window')

  let moveShader = await loadShadersToProgram(gl, './moveFragShader.glsl', './moveVertShader.glsl')
  let moveWindowUniPos = gl.getUniformLocation(moveShader, 'window')
  let moveDeltaTimeUniPos = gl.getUniformLocation(moveShader, 'deltaTime')
  let textureUniPos = gl.getUniformLocation(moveShader, 'texture')
  let heatMapUniPos = gl.getUniformLocation(moveShader, 'heatMap')
  gl.useProgram(moveShader)
  gl.uniform1i(textureUniPos, 0)
  gl.uniform1i(heatMapUniPos, 1)
  gl.useProgram(null)

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
  //let dataSample = new Quad(7.0, 7.0, 16.0, 16.0)
  let dataSample = new Quad(0.0, 0.0, 2.0, 2.0)
  dataSample.texture = dataTexture
  let agentSample = new Quad(0.0, 0.0, 2.0, 2.0)
  agentSample.texture = agentsTexture


  Sleep(500)
  let lastTime = Date.now()-1
  let i = 0
  let deltaSum = 0
  while (true) {
    let now = Date.now()
    deltaTime = now - lastTime
    if (deltaTime < 1000/FPS_CAP) {
      await Sleep(1000/FPS_CAP - deltaTime)
      continue
    }
    lastTime = now

    deltaSum += deltaTime
    i++
    if (i >= FPS_CAP) {
      console.log(`FPS: ${Math.floor(1000/(deltaSum/i)+0.5)}`)
      i = 0
      deltaSum = 0
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, dataTextureFBO)
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(moveShader)
    gl.uniform1f(moveDeltaTimeUniPos, deltaTime)
    gl.uniform2fv(moveWindowUniPos, new Float32Array([WIDTH, HEIGHT]))
    gl.bindVertexArray(moveVAO)
    gl.activeTexture(gl.TEXTURE0+0)
    gl.bindTexture(gl.TEXTURE_2D, prevDataTexture)
    gl.activeTexture(gl.TEXTURE0+1)
    gl.bindTexture(gl.TEXTURE_2D, agentsTexture)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindVertexArray(null)
    gl.activeTexture(gl.TEXTURE0)

    gl.bindFramebuffer(gl.FRAMEBUFFER, agentsTextureFBO)
    gl.useProgram(drawShader)
    gl.uniform2fv(drawWindowUniPos, new Float32Array([WIDTH, HEIGHT]))
    gl.bindVertexArray(drawVAO)
    gl.bindTexture(gl.TEXTURE_2D, dataTexture)
    gl.drawArrays(gl.POINTS, 0, NUM_AGENTS)
    gl.bindVertexArray(null)

    gl.bindFramebuffer(gl.FRAMEBUFFER, copyAgentsTextureFBO)
    gl.useProgram(copyShader)
    gl.bindVertexArray(moveVAO)
    gl.bindTexture(gl.TEXTURE_2D, agentsTexture)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindVertexArray(null)

    gl.bindFramebuffer(gl.FRAMEBUFFER, agentsTextureFBO)
    gl.useProgram(diffuseShader)
    gl.uniform2fv(diffuseWindowUniPos, new Float32Array([WIDTH, HEIGHT]))
    gl.bindVertexArray(moveVAO)
    gl.bindTexture(gl.TEXTURE_2D, copyAgentsTexture)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT)


    Quad.prepareRender(gl)
    // dataSample.render(gl)
    agentSample.render(gl)
    Quad.postpareRender(gl)

    // break
  }
}

function createAgents() {
  //let data = new Uint8Array(1280*720*4)
  let data = new Uint8Array(WIDTH*HEIGHT*4)

  for (let i = 0; i < NUM_AGENTS; i++) {
    let posX = floatToVec3(Math.random()*WIDTH)
    let posY = floatToVec3(Math.random()*HEIGHT)
    //let velX = floatToVec3((Math.random()*220+10)*Math.sign(Math.random()-0.5))
    //let velY = floatToVec3((Math.random()*220+10)*Math.sign(Math.random()-0.5))
    let dir = floatToVec3(Math.random()*2*Math.PI)
    data[i*16] = posX.x
    data[i*16+1] = posX.y
    data[i*16+2] = posX.z
    data[i*16+3] = 255
    data[i*16+4] = posY.x
    data[i*16+5] = posY.y
    data[i*16+6] = posY.z
    data[i*16+7] = 255
    data[i*16+8] = dir.x
    data[i*16+9] = dir.y
    data[i*16+10] = dir.z
    data[i*16+11] = 255
    data[i*16+12] = 0
    data[i*16+13] = 0
    data[i*16+14] = 0
    data[i*16+15] = 255
    /*data[i*16+8] = velX.x
    data[i*16+9] = velX.y
    data[i*16+10] = velX.z
    data[i*16+11] = 255
    data[i*16+12] = velY.x
    data[i*16+13] = velY.y
    data[i*16+14] = velY.z
    data[i*16+15] = 255*/
  }
  
  return data
}

function createBallAgents() {
  let data = new Uint8Array(WIDTH*HEIGHT*4)

  for (let i = 0; i < NUM_AGENTS; i++) {
    let r = Math.random()*Math.min(WIDTH, HEIGHT)*0.5 // 0.1 for insta collapse, 0.5 for nice circle
    let a = Math.random()*2*Math.PI
    let posX = floatToVec3(WIDTH/2 + Math.cos(a)*r)
    let posY = floatToVec3(HEIGHT/2 + Math.sin(a)*r)
    let dir = floatToVec3((a+Math.PI) % (2*Math.PI))

    data[i*16] = posX.x
    data[i*16+1] = posX.y
    data[i*16+2] = posX.z
    data[i*16+3] = 255
    data[i*16+4] = posY.x
    data[i*16+5] = posY.y
    data[i*16+6] = posY.z
    data[i*16+7] = 255
    data[i*16+8] = dir.x
    data[i*16+9] = dir.y
    data[i*16+10] = dir.z
    data[i*16+11] = 255
    data[i*16+12] = 0
    data[i*16+13] = 0
    data[i*16+14] = 0
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