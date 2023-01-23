const FPS_CAP = 60
let WIDTH
let HEIGHT

window.onload = main

let deltaTime = 0

async function main() {
  const canvas = document.getElementById("glCanvas")
  WIDTH = canvas.WIDTH
  HEIGHT = canvas.HEIGHT
  var gl = canvas.getContext("webgl")
  if (!gl) {
    alert("Unable to initialize WebGL")
    return
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  await Quad.init(gl)

  let movementShader = await loadShadersToProgram(gl, 'shader', './movementFragShader.glsl', './movementVertShader.glsl')
  let dimensionsUniPos = gl.getUniformLocation(movementShader, 'dimensions')

  let VBO = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO)
  var vertices = [
    -1.0, -1.0, 0.0, 0.0,
    -1.0,  1.0, 0.0, 1.0,
     1.0, -1.0, 1.0, 0.0,
     1.0,  1.0, 1.0, 1.0,
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)


  let agentsImg = createAgents()

  let initAgentsTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, initAgentsTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 10, 0, gl.RGBA, gl.UNSIGNED_BYTE, Uint8Array.from(agentsImg.data));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let prevAgentsTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, prevAgentsTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 10, 0, gl.RGBA, gl.UNSIGNED_BYTE, Uint8Array.from(agentsImg.data));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let prevAgentsTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, prevAgentsTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, prevAgentsTexture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  let agentsTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, agentsTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 10, 0, gl.RGBA, gl.UNSIGNED_BYTE, Uint8Array.from(agentsImg.data));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let agentsTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, agentsTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, agentsTexture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  let q = new Quad(-0.98, 0.0, 0.6, 0.8)
  q.texture = agentsTexture

  let q3 = new Quad(0.08, 0.0, 0.6, 0.8)
  q3.texture = prevAgentsTexture

  let q5 = new Quad(-0.83, -0.98, 0.05, 0.25)
  q5.texture = initAgentsTexture
  let q6 = new Quad(-0.83, -0.98, 0.05, 0.25)

  let lastTime = Date.now()-1
  while (true) {
    let now = Date.now()
    deltaTime = now - lastTime
    if (deltaTime < 1000/FPS_CAP) {
      await Sleep(1000/FPS_CAP - deltaTime)
      continue
    }
    lastTime = now

    // Porcess movement
    /*gl.bindFramebuffer(gl.FRAMEBUFFER, agentsTextureFBO)
    gl.useProgram(movementShader)
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.uniform2fv(dimensionsUniPos, new Float32Array([2, 10]))
    gl.bindTexture(gl.TEXTURE_2D, initAgentsTexture)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)*/


    /*gl.bindFramebuffer(gl.FRAMEBUFFER, prevAgentsTextureFBO)
    gl.useProgram(movementShader)
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.uniform2fv(dimensionsUniPos, new Float32Array([2, 10]))
    gl.bindTexture(gl.TEXTURE_2D, initAgentsTexture)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)*/

    /* gl.bindFramebuffer(gl.FRAMEBUFFER, agentsTextureFBO)
    gl.useProgram(movementShader)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    // gl.bindTexture(gl.TEXTURE_2D, agentsTexture)
    gl.uniform2fv(dimensionsUniPos, new Float32Array([2, 10]))

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindTexture(gl.TEXTURE_2D, null)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)


    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(movementShader)

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bindTexture(gl.TEXTURE_2D, agentsTexture)
    gl.uniform2fv(dimensionsUniPos, new Float32Array([2, 10]))

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)*/

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    Quad.prepareRender(gl)
    q.render(gl)
    //q3.render(gl)
    //q6.render(gl)
    //q5.render(gl)
    Quad.postpareRender(gl)

    //break
  }

}

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function createAgents() {
  const numAgents = 30

  let canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = numAgents
  let ctx = canvas.getContext('2d')
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let data = imgData.data
  for (let i = 0; i < numAgents; i++) {
    data[i*16] = 0
    data[i*16+1] = 10
    data[i*16+2] = 0
    data[i*16+3] = 255
    data[i*16+4] = 0
    data[i*16+5] = (i+1)*10
    data[i*16+6] = 0
    data[i*16+7] = 255
    data[i*16+8] = 0
    data[i*16+9] = 2
    data[i*16+10] = 0
    data[i*16+11] = 255
    data[i*16+12] = 0
    data[i*16+13] = 0
    data[i*16+14] = 0
    data[i*16+15] = 255
    /* data[i*8] = 0
    data[i*8+1] = 255
    data[i*8+2] = 0
    data[i*8+3] = 255
    data[i*8+4] = 0
    data[i*8+5] = 0
    data[i*8+6] = 255
    data[i*8+7] = 255 */
  }
  ctx.putImageData(imgData, 0, 0)
  
  let url = canvas.toDataURL('image/png')
  console.log(url)

  return imgData
}