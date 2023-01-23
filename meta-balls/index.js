const FPS_CAP = 60
let WIDTH
let HEIGHT

let charges = []

window.onload = main
let ct
let lastResizeTimeout
window.onresize = () => {
  clearTimeout(lastResizeTimeout)
  lastResizeTimeout = setTimeout(() => {
    const canvas = document.getElementById("glCanvas")
    WIDTH = window.innerWidth
    HEIGHT = window.innerHeight
    canvas.width = WIDTH
    canvas.height = HEIGHT
    let gl = canvas.getContext("webgl")
    gl.viewport(0, 0, WIDTH, HEIGHT)
    gl.bindTexture(gl.TEXTURE_2D, ct)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    generateCharges()
  }, 500);
}

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
  

  let chargeTexture = gl.createTexture()
  ct = chargeTexture
  gl.bindTexture(gl.TEXTURE_2D, chargeTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let chargeTextureFBO = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, chargeTextureFBO)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, chargeTexture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)


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

  generateCharges()
  
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
    chargeTextureQuad.render(gl)
    Quad.postpareRender(gl)
  }
}

function generateCharges() {
  let numCharges = Math.floor(0.000013*WIDTH*HEIGHT)
  console.log(`Simulating ${numCharges} meta balls.`)
  let chargeSize = 350
  while (charges.length < numCharges) {
    charges.push(new Charge(Math.random()*WIDTH, Math.random()*HEIGHT, chargeSize))
  }
  deleteLoop: while (charges.length > numCharges) {
    for (let i = 0; i < charges.length; i++) {
      if (charges[i].x < 0 || charges[i].x >= WIDTH || charges[i].y < 0 || charges[i].y >= HEIGHT) {
        charges.splice(i, 1)
        continue deleteLoop
      }
    }
    charges.splice(0, 1)
  }
}

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}