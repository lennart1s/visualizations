const DIR_X = 0
const DIR_Y = 1
const DIR_NONE = -1

class Block {
  x
  y
  w
  h

  allowX
  allowY

  targetBlock

  drawX
  drawY

  grabbed = false
  invalid = false

  constructor(x, y, w, h, dir = 0, targetBlock = false) {
    this.x = x
    this.y = y
    this.h = h
    this.w = w
    this.allowX = dir === DIR_X
    this.allowY = dir === DIR_Y
    this.targetBlock = targetBlock
  }

  grab() {
    this.grabbed = true
  }

  release() {
    this.grabbed = false
    if (this.invalid) {
      this.invalid = false
      return
    }

    this.x = Math.round(this.drawX / CELL_SIZE)
    this.y = Math.round(this.drawY / CELL_SIZE)
  }

  update() {
    this.drawX = this.x * CELL_SIZE
    this.drawY = this.y * CELL_SIZE

    if (this.grabbed) {
      this.drawX += this.allowX ? mouseX - mouseDownX : 0
      this.drawY += this.allowY ? mouseY - mouseDownY : 0

      this.drawX = min(max(this.drawX, 0), WIDTH-this.w*CELL_SIZE)
      this.drawY = min(max(this.drawY, 0), HEIGHT-this.h*CELL_SIZE)

      let potX = Math.round(this.drawX / CELL_SIZE)
      let potY = Math.round(this.drawY / CELL_SIZE)

      this.invalid = false
      let walkedCells = []
      for (let x = min(this.x, potX);
        x < max(this.x+this.w, potX+this.w); x++) {
        for (let y = min(this.y, potY);
          y < max(this.y+this.h, potY+this.h); y++) {
          walkedCells.push(createVector(x, y))
        }
      }

      invalidCheck: for (let o of blocks) {
        if (o !== this) {
          for (let c of walkedCells) {
            if (o.spansCell(c.x, c.y)) {
              this.invalid = true
              break invalidCheck
            }
          }
        }
      }
    }
  }

  draw() {
    strokeWeight(3)
    stroke(0)
    fill(160, 140, 180)

    if (this.targetBlock) {
      fill(50, 150, 20)
    }

    if (this.grabbed) {
      let shadowX = Math.round(this.drawX / CELL_SIZE) * CELL_SIZE
      let shadowY = Math.round(this.drawY / CELL_SIZE) * CELL_SIZE
      fill(200, 0, 0, 20)
      rect(shadowX, shadowY, this.w*CELL_SIZE, this.h*CELL_SIZE)

      fill(200, 100, 100)
    }

    if (this.invalid) {
      fill(255, 0, 0)
    }

    rect(this.drawX, this.drawY, this.w*CELL_SIZE, this.h*CELL_SIZE)
  }

  spansCell(x, y) {
    return this.x <= x && x < this.x+this.w && this.y <= y && y < this.y+this.h
  }
}