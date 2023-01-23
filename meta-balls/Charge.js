class Charge {
  static shader
  static vbo
  static windowUniPos
  static translationVecUniPos
  static radiusUniPos

  x
  y
  r
  velX
  velY

  constructor(x, y, r) {
    this.x = x
    this.y = y
    this.r = r

    this.velX = Math.random() * 2 - 1
    this.velY = Math.random() * 2 - 1
    let speed = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2))
    let speedDest = Math.random()*100 + 100
    this.velX *= speedDest / speed
    this.velY *= speedDest / speed
  }

  move() {
    this.x += this.velX * (deltaTime / 1000)
    this.y += this.velY * (deltaTime / 1000)

    if (this.x >= WIDTH || this.x < 0) {
      this.velX *= -1
    }
    if (this.y >= HEIGHT || this.y < 0) {
      this.velY *= -1
    }
  }

  render(gl) {
    gl.uniform2fv(Charge.windowUniPos, new Float32Array([WIDTH, HEIGHT]))
    gl.uniform3fv(Charge.translationVecUniPos, new Float32Array([this.x, this.y, 0.0]))
    gl.uniform1f(Charge.radiusUniPos, this.r)

    gl.drawArrays(gl.POINTS, 0, 1)
  }

  static async init(gl) {
    Charge.shader = await loadShadersToProgram(gl, 'chargeShader', './chargeFragShader.glsl', './chargeVertShader.glsl')
    Charge.windowUniPos = gl.getUniformLocation(Charge.shader, 'window')
    Charge.translationVecUniPos = gl.getUniformLocation(Charge.shader, 'translation')
    Charge.radiusUniPos = gl.getUniformLocation(Charge.shader, 'radius')

    Charge.vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, Charge.vbo)
    var vertices = [
      0.0, 0.0, 0.0, 1.0
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.vertexAttribPointer(Charge.vbo, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(Charge.vbo)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  static prepareRender(gl) {
    gl.useProgram(Charge.shader)

    gl.bindBuffer(gl.ARRAY_BUFFER, Charge.vbo)
  }

  static postpareRender(gl) {
    gl.useProgram(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }
}