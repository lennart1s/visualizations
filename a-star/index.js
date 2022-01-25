
const EMPTY = 0
const BLOCK = 1
const START = 2
const DEST = 3
const PATH = 4

let WIDTH = 20
let HEIGHT = 20
let ppc = 25

let currentCellType = BLOCK

let cells = []
let open = []
let closed = []

let destX = 9
let destY = 15

function setup() {
    let canvas = createCanvas(WIDTH*ppc, HEIGHT*ppc)
    canvas.parent("canvas")

    for (let x = 0; x < WIDTH; x++) {
        cells.push(new Array(HEIGHT).fill(0))
    }

    /*cells[4][5] = START
    cells[destX][destY] = DEST

    cells[0][8] = BLOCK
    cells[1][8] = BLOCK
    cells[2][8] = BLOCK
    cells[3][8] = BLOCK
    cells[4][8] = BLOCK
    cells[5][8] = BLOCK
    cells[6][8] = BLOCK
    cells[7][8] = BLOCK
    cells[8][8] = BLOCK
    cells[9][8] = BLOCK
    cells[10][8] = BLOCK

    noLoop()
    let d = astar()
    while (d) {
        console.log(d.x, d.y)
        cells[d.x][d.y] = cells[d.x][d.y] == EMPTY ? PATH : cells[d.x][d.y]
        d = d.parent
    }
    for (let c of closed) {
        if (cells[c.x][c.y] != EMPTY) {
            continue
        }
        cells[c.x][c.y] = -c.f
        console.log(-c.f)
    }*/
}

function draw() {
    background(255)
    
    // Draw cells
    noStroke()
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (cells[x][y] == EMPTY) {
                //fill(255)
                continue
            } else if (cells[x][y] == BLOCK) {
                fill(30) 
            } else if (cells[x][y] == START) {
                fill(255, 0, 0)
            } else if (cells[x][y] == DEST) {
                fill(0, 255, 0)
            } else if (cells[x][y] == PATH) {
                fill(30, 10, 160)
            } else if (cells[x][y] < 0) {
                let val = abs(cells[x][y])
                fill(255, 255, map(val, 10, 20, 255, 0))
            }
            
            rect(x*ppc, y*ppc, ppc, ppc)
        }
    }

    // Draw grid
    stroke(0)
    strokeWeight(0.5)
    for (let x = 0; x <= WIDTH; x++) {
       line(x*ppc, 0, x*ppc, HEIGHT*ppc) 
    }
    for (let y = 0; y <= HEIGHT; y++) {
        line(0, y*ppc, WIDTH*ppc, y*ppc) 
    }

}

function processAstar(steps) {
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (cells[x][y] == PATH) {
                cells[x][y] = EMPTY
            }
        }
    }

    let q = astar(steps)
    while (q) {
        console.log(q.x, q.y)
        cells[q.x][q.y] = cells[q.x][q.y] == EMPTY ? PATH : cells[q.x][q.y]
        q = q.parent
    }
}

function mousePressed() {
    if (mouseX < 0 || mouseX > WIDTH*ppc ||
        mouseY < 0 || mouseY > HEIGHT*ppc) {
        return
    }

    let x = Math.floor(mouseX / ppc)
    let y = Math.floor(mouseY / ppc)

    if (currentCellType == START || currentCellType == DEST) {
        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {
                if (cells[i][j] == currentCellType && (i != x || j != y)) {
                    cells[i][j] = EMPTY
                }
            }
        }
    }

    cells[x][y] = (cells[x][y] != currentCellType) ? currentCellType : EMPTY
}

function formChange(form) {
    let data = new FormData(form)
    let val = Number.parseInt(data.get('cell-type'))
    currentCellType = val
}

function findStartNode() {
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (cells[x][y] == START) {
                return {x, y}
            }
        }
    }
}

function findDestNode() {
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (cells[x][y] == DEST) {
                return {x, y}
            }
        }
    }
}