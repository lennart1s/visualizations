document.addEventListener('contextmenu', event => event.preventDefault());

let WIDTH = 800
let HEIGHT = 800

let running = false

let selA
let selB

// let a
// let b
// let s
let points = []
let sticks = []

function setup() {
    loadPreset()
    let canvas = createCanvas(WIDTH, HEIGHT)
    canvas.parent("canvas")

    // a = new Point(0, 0, true)
    // b = new Point(50, 75)
    // s = new Stick(a, b)

    frameRate(30)
}

function draw() {
    translate(WIDTH/2, HEIGHT/2)
    scale(1, -1)
    background(120)

    if (running) {
        if (mouseIsPressed) {
            let x = mouseX - WIDTH/2
            let y = -1 * (mouseY - HEIGHT/2)
            hitsStick(new p5.Vector(x, y))
        }

        for (let p of points) {
            p.process()
        }

        for (let i = 0; i < 15; i++) {
            for (let s of sticks) {
                s.process()
            }
        }
    }

    // s.draw()
    if (!running) {
        for (let p of points) {
            p.draw()
        }
    }

    for (let s of sticks) {
        s.draw()
    }
}

function mouseClicked() {
    let x = mouseX - WIDTH/2
    let y = -1 * (mouseY - HEIGHT/2)

    if (running) {
        return
    }

    let p = hitsPoint(new p5.Vector(x, y))
    if (!p && mouseButton == LEFT) {
        points.push(new Point(x, y))
    } else if (mouseButton === LEFT){
        p.color = color(255, 0, 0)
        if (!selA) {
            selA = p
        } else {
            selB = p
            connect(selA, selB)
            clearSelection()
        }
    } 
}

function connect(a, b) {
    sticks.push(new Stick(a, b))
}

function clearSelection() {
    selA.color = color(255)
    selB.color = color(255)
    selA = null
    selB = null
}

function mouseReleased() {
    if (mouseButton != RIGHT) {
        return
    }

    let x = mouseX - WIDTH/2
    let y = -1 * (mouseY - HEIGHT/2)

    let p = hitsPoint(new p5.Vector(x, y))
    if (p) {
        p.fixed = !p.fixed
    }
}

function hitsPoint(cursor) {
    for (let p of points) {
        if (cursor.dist(p) < DRAW_R) {
            return p
        }
    }

    return undefined
}

function hitsStick(cursor) {
    for (let si = 0; si < sticks.length; si++) {
        let s = sticks[si]
        if (cursor.dist(s.A) > s.length || cursor.dist(s.B) > s.length) {
            continue
        }
        for (let i = 1; i <= 5; i++) {
            let x = s.A.x + (s.B.x-s.A.x) / 6 * i
            let y = s.A.y + (s.B.y-s.A.y) / 6 * i
            if (cursor.dist(new p5.Vector(x, y)) < 10) {
                sticks.splice(si, 1)
                return true
            }
        }
    }

    return false
}

function startLoop() {
    running = !running
}

function savePreset() {
    let i = 0
    for (let p of points) {
        p.id = i
        i++
    }

    let data = JSON.stringify({ points, sticks })
    localStorage.setItem('cloth', data)
}

function loadPreset() {
    running = false
    data = JSON.parse(localStorage.getItem('cloth')) || {points:[], sticks:[]}
    // let data = {"points":[{"x":-511.3500061035156,"y":309.3999996185303,"z":0,"color":{"mode":"rgb","maxes":{"rgb":[255,255,255,255],"hsb":[360,100,100,1],"hsl":[360,100,100,1]},"_array":[1,1,1,1],"levels":[255,255,255,255]},"prev":{"x":-511.3500061035156,"y":309.3999996185303,"z":0},"id":0}],"sticks":[]}

    points = []
    for (let pd of data.points) {
        delete pd.color
        let p = new Point()
        Object.assign(p, pd)
        points.push(p)
    }

    sticks = []
    for (let sd of data.sticks) {
        let s = new Stick(points[sd.A.id], points[sd.B.id])
        sticks.push(s)
    }
}

function cleanUp() {
    running = false
    points = []
    sticks = []
}

function setGrid() {
    points = []
    sticks = []

    let GRID_SIZE = 9
    let STEP_SIZE = WIDTH*0.8 / GRID_SIZE

    for (let x = -4; x <= 4; x++) {
        for (let y = -4; y <= 4; y++) {
            let p = new Point(x*STEP_SIZE, y*STEP_SIZE, y == 4 && x%2 == 0)
            points.push(p)
        }
    }
    
    for (let i = 0; i < points.length; i++) {
        if (i % GRID_SIZE != 0) {
            let s = new Stick(points[i-1], points[i])
            sticks.push(s)
        }
        if (i-GRID_SIZE >= 0) {
            let s = new Stick(points[i-9], points[i])
            sticks.push(s)
        }
    }
}