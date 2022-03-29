const WIDTH = 600
const HEIGHT = 600
const GRID_WIDTH = 6
const CELL_SIZE = WIDTH / GRID_WIDTH

let mouseDownX, mouseDownY


let target
let blocks = []

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT)
  canvas.parent("canvas")

  target = createVector(4, 2)

  blocks.push(new Block(0, 0, 3, 1, DIR_X))
  blocks.push(new Block(0, 2, 2, 1, DIR_X, true))
  blocks.push(new Block(5, 0, 1, 3, DIR_Y))
  blocks.push(new Block(0, 3, 1, 2, DIR_Y))
  blocks.push(new Block(0, 5, 3, 1, DIR_X))
  blocks.push(new Block(2, 1, 1, 3, DIR_Y))
  blocks.push(new Block(4, 4, 1, 2, DIR_Y))
  blocks.push(new Block(4, 3, 2, 1, DIR_X))

  background(120)
}

function draw() {
  background(120)
  
  strokeWeight(2)
  stroke(100)
  for (let x = CELL_SIZE; x < WIDTH; x += CELL_SIZE) {
    line(x, 0, x, HEIGHT)
  }
  for (let y = CELL_SIZE; y < HEIGHT; y += CELL_SIZE) {
    line(0, y, WIDTH, y)
  }
  
  for (let b of blocks) {
    b.update()
  }
  for (let b of blocks) {
    b.draw()
  }

  noStroke()
  fill(50, 200, 50, 50)
  rect(target.x*CELL_SIZE, target.y*CELL_SIZE,
    2*CELL_SIZE, 1*CELL_SIZE)
}

function mousePressed() {
  mouseDownX = mouseX
  mouseDownY = mouseY
  mouseCellX = mouseDownX / CELL_SIZE
  mouseCellY = mouseDownY / CELL_SIZE
  for (let b of blocks) {
    if (b.x < mouseCellX && mouseCellX < b.x+b.w
        && b.y < mouseCellY && mouseCellY < b.y+b.h) {
        b.grab()
        break
    }
  }
}

function mouseReleased() {
  for (let b of blocks) {
      if (b.grabbed) {
          b.release()

          if (b.targetBlock && b.x == target.x && b.y == target.y) {
            console.log('win')
          }
      }
  }
}
