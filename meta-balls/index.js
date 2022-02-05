const FPS_CAP = 60
let WIDTH
let HEIGHT

window.onload = main

let deltaTime = 1/0

async function main() {
  const canvas = document.getElementById("glCanvas")
  WIDTH = window.innerWidth
  HEIGHT = window.innerHeight
  canvas.width = WIDTH
  canvas.height = HEIGHT
  var gl = canvas.getContext("webgl")
  if (!gl) {
    alert("Unable to initialize WebGL")
    return
  }
  
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  

  // Texture and FBO setup
  let chargeTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, chargeTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let chargeTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, chargeTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, chargeTexture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  /* let metaTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, metaTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 640, 480, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let metaTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, metaTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, metaTexture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null) */

  await Charge.init(gl)
  await Quad.init(gl)
  let metaShader = await loadShadersToProgram(gl, 'metaShader', './metaFragShader.glsl', './metaVertShader.glsl')
  let windowUniPos = gl.getUniformLocation(metaShader, 'window')
  let metaVBO = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, metaVBO)
  var vertices = [
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  let numCharges = Math.floor(0.000013*WIDTH*HEIGHT)
  console.log(`Simulating ${numCharges} meta balls.`)
  let chargeSize = 350
  let charges = []
  for (let i = 0; i < numCharges; i++) {
    charges.push(new Charge(Math.random()*WIDTH, Math.random()*HEIGHT, chargeSize))
  }
  
  let chargeTextureQuad = new Quad(-1, -1, 0.5, 0.5)
  chargeTextureQuad.texture = chargeTexture

  /* let metaTextureQuad = new Quad(-0.5, -0.5, 1, 1)
  metaTextureQuad.texture = metaTexture */

  let lastTime = Date.now()-1
  while (true) {
    let now = Date.now()
    deltaTime = now - lastTime
    if (deltaTime < 1000/FPS_CAP) {
      await Sleep(1000/FPS_CAP - deltaTime)
      continue
    }
    lastTime = now

    for (let c of charges) {
      c.move();
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, chargeTextureFBO)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    Charge.prepareRender(gl)
    for (let c of charges) {
      c.render(gl);
    }
    Charge.postpareRender(gl)



    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.clearColor(0.0, 0.0, 0.0, 0.9)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(metaShader)
    gl.bindBuffer(gl.ARRAY_BUFFER, metaVBO)

    gl.bindTexture(gl.TEXTURE_2D, chargeTexture)
    gl.uniform2fv(windowUniPos, new Float32Array([WIDTH, HEIGHT]))
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    gl.useProgram(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)



    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    Quad.prepareRender(gl)
    // chargeTextureQuad.render(gl)
    Quad.postpareRender(gl)

    // break
  }
}

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}