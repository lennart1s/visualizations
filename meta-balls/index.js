window.onload = main

var vbo
var shaderProgram

async function main() {
  const canvas = document.getElementById("glCanvas")
  const gl = canvas.getContext("webgl")

  if (!gl) {
    alert("Unable to initialize WebGL")
    return
  }

  await initShaders(gl)
  
  initBuffer(gl)
  
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0.0, 0.05, 0.12, 1.0)
  
  gl.clear(gl.COLOR_BUFFER_BIT)

  /*let posMatrixUniform = gl.getUniformLocation(shaderProgram, 'posMatrix')
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.vertexAttribPointer(vbo, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vbo)
  gl.uniformMatrix4fv(posMatrixUniform, false, new Float32Array([0.25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]))
  gl.drawArrays(gl.POINTS, 0, 4)*/
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.vertexAttribPointer(vbo, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vbo)

  for (let i = 0; i < 100; i++) {
    gl.clear(gl.COLOR_BUFFER_BIT)
    drawPoint(gl, -0.5+i/100, 0.0, 30)
    await sleep(20)
  }

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawPoint(gl, x, y, r) {
  let translationVecPos = gl.getUniformLocation(shaderProgram, 'translation')
  gl.uniform3fv(translationVecPos, new Float32Array([x, y, 0.0]))

  let radiusPos = gl.getUniformLocation(shaderProgram, 'radius')
  gl.uniform1f(radiusPos, r)

  gl.drawArrays(gl.POINTS, 0, 1)
}

function initBuffer(gl) {
  vbo = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)

  var vertices = [
    0.0, 0.0, 0.0
  ]

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
}

async function initShaders(gl) {
  var fragShader = await getShader(gl, 'http://localhost:5500/meta-balls/fragShader.glsl', gl.FRAGMENT_SHADER)
  var vertShader = await getShader(gl, 'http://localhost:5500/meta-balls/vertShader.glsl', gl.VERTEX_SHADER)

  shaderProgram  = gl.createProgram()
  gl.attachShader(shaderProgram, vertShader)
  gl.attachShader(shaderProgram, fragShader)
  gl.linkProgram(shaderProgram)

  gl.useProgram(shaderProgram)
}

async function getShader(gl, url, type) {
  let resp = await fetch(url)
  let source = await resp.text()
  
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  console.log(type + 'Shader compiled successfully: ' + compiled);
  var compilationLog = gl.getShaderInfoLog(shader);
console.log(type + 'Shader compiler log: ' + compilationLog);

  return shader
}