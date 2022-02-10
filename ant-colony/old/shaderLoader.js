let shaderPrograms = {}

function getShaderProgram(name) {
  return shaderPrograms[name]
}

async function loadShadersToProgram(gl, name, fragURl, vertURL) {
  var fragShader = await getShader(gl, fragURl, gl.FRAGMENT_SHADER)
  var vertShader = await getShader(gl, vertURL, gl.VERTEX_SHADER)

  let shaderProgram  = gl.createProgram()
  gl.attachShader(shaderProgram, vertShader)
  gl.attachShader(shaderProgram, fragShader)
  gl.linkProgram(shaderProgram)
  
  shaderPrograms[name] = shaderProgram
  return shaderProgram
}

async function getShader(gl, url, type) {
  let resp = await fetch(url)
  let source = await resp.text()
  
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  console.log(`${type == gl.FRAGMENT_SHADER ? 'Fragment-' : 'Vertex-'}Shader compile success: ${compiled}`);
  var compilationLog = gl.getShaderInfoLog(shader);
  if (compilationLog && compilationLog != '') {
    console.log(`Log: ${compilationLog}`);
  }

  return shader
}