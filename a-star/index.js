
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
                fill(255, 255, map(val, abs(minOf2D(cells).value), abs(maxOf2D(cells).value), 255, 0))
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

let steps = 0
function processAstar(s) {
    steps += s
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
        cells[q.x][q.y] = cells[q.x][q.y] <= 0 ? PATH : cells[q.x][q.y]
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

    let startNode = findStartNode()
    if (startNode && currentCellType == START) {
        cells[startNode.x][startNode.y] = EMPTY
    }
    let destNode = findDestNode()
    if (destNode && currentCellType == DEST) {
        cells[destNode.x][destNode.y] = EMPTY
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

function minOf2D(array) {
    let minVal = 0
    let minX = -1
    let minY = -1
    for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < array[x].length; y++) {
            if (array[x][y] > 0) {
                continue
            }
            if (array[x][y] < minVal || minX == -1 || minY == -1) {
                minVal = array[x][y]
                minX = x
                minY = y
            }
        }
    }

    return {
        value: minVal,
        x: minX,
        y: minY,
    }
}

function maxOf2D(array) {
    let maxVal = 0
    let maxX = -1
    let maxY = -1
    for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < array[x].length; y++) {
            if (array[x][y] > 0) {
                continue
            }
            if (array[x][y] > maxVal || maxX == -1 || maxY == -1) {
                maxVal = array[x][y]
                maxX = x
                maxY = y
            }
        }
    }

    return {
        value: maxVal,
        x: maxX,
        y: maxY,
    }
}