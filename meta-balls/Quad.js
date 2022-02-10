class Quad {
  static shader
  static vbo
  static translationVecUniPos
  static scaleVecUniPos
  static texturedUniPos

  x
  y
  w
  h
  texture

  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  render(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture)

    gl.uniform3fv(Quad.translationVecUniPos, new Float32Array([this.x, this.y, 0.0]))
    gl.uniform3fv(Quad.scaleVecUniPos, new Float32Array([this.w, this.h, 0.0]))
    gl.uniform1i(Quad.texturedUniPos, this.texture ? 1 : 0)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  static async init(gl) {
    Quad.shader = await loadShadersToProgram(gl, 'quadShader', './quadFragShader.glsl', './quadVertShader.glsl')
    Quad.translationVecUniPos = gl.getUniformLocation(Quad.shader, 'translation')
    Quad.scaleVecUniPos = gl.getUniformLocation(Quad.shader, 'scale')
    Quad.texturedUniPos = gl.getUniformLocation(Quad.shader, 'textured')

    Quad.vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, Quad.vbo)
    var vertices = [
      -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
      -0.5,  0.5, 0.0, 1.0, 0.0, 1.0,
       0.5, -0.5, 0.0, 1.0, 1.0, 0.0,
       0.5,  0.5, 0.0, 1.0, 1.0, 1.0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 0)
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 4*Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(0)
    gl.enableVertexAttribArray(1)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  static prepareRender(gl) {
    gl.useProgram(Quad.shader)

    gl.bindBuffer(gl.ARRAY_BUFFER, Quad.vbo)
  }

  static postpareRender(gl) {
    gl.useProgram(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }
}