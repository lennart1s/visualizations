var cols = 40
var rows = 40
var gridSize = 20

var cells = []

function setup() {
    var canvas = createCanvas(cols*gridSize, rows*gridSize)
    canvas.parent("canvas")

    for (var x = 0; x < cols; x++) {
        var col = []
        for (var y = 0; y < rows; y++) {
            col.push(0)
        }
        cells.push(col)
    }
}

function draw() {
    background(60, 48, 69)

    for (x = 0; x < cols; x++) {
        for (y = 0; y < rows; y++) {
            strokeWeight(0.2)
            stroke(120, 80, 90)
            fill (60, 48, 69)
            if (cells[x][y] != 0) {
                fill(247, 37, 247)
            }
            rect(x*gridSize, y*gridSize, (x+1)*gridSize, (y+1)*gridSize)
        }
    }
}

function process() {
    var prev = []
    for (x = 0; x < cols; x++) {
        var row = []
        for (y = 0; y < rows; y++) {
            row.push(cells[x][y])
        }
        prev.push(row)
    }

    for (x = 0; x < cols; x++) {
        for (y = 0; y < rows; y++) {
            var aliveNeighbours = 0
            for (xn = x-1; xn <= x+1; xn++) {
                for (yn = y-1; yn <= y+1; yn++) {
                    if((xn!=x||yn!=y) && 0 <= xn && xn < cols && 0 <= yn && yn < rows) {
                        aliveNeighbours += prev[xn][yn]
                    }
                }
            }

            if (prev[x][y] == 1 && (aliveNeighbours <= 1 || aliveNeighbours >= 4)) {
                cells[x][y] = 0
            } else if (prev[x][y] == 0 && aliveNeighbours == 3) {
                cells[x][y] = 1
            }
        }
    }

    var found = false
    for (x = 0; x < cols; x++) {
        for (y = 0; y < rows; y++) {
            if (cells[x][y] == 1) {
                found = true
            }
        }
    }
    if (!found) {
        //running = false
        //frameRate(30)
    }
}

function mouseClicked() {
    var c = int(mouseX / gridSize)
    var r = int(mouseY / gridSize)

    if (c < 0 || c >= cols || r < 0 || r >= rows) {
        return
    }

    if (cells[c][r] == 0) {
        cells[c][r] = 1
    } else {
        cells[c][r] = 0
    }
}

function reset() {
    for (x = 0; x < cols; x++) {
        for (y = 0; y < rows; y++) {
            cells[x][y] = 0
        }
    }
}