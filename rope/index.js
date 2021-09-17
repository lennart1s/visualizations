let WIDTH = 800
let HEIGHT = 800

let points = []
let bones = []

class Bone {
    A = new p5.Vector()
    B = new p5.Vector()
    length = 0

    constructor(A, B) {
        this.A = A
        this.B = B
        this.length = this.A.dist(this.B)
    }

    draw() {
        stroke(255)
        strokeWeight(3)
        line(this.A.x, this.A.y, this.B.x, this.B.y);

        ellipseMode(CENTER)
        noStroke()
        fill(this.A.fixed ? 0 : 255)
        ellipse(this.A.x, this.A.y, 20, 20)
        fill(this.B.fixed ? 0 : 255)
        ellipse(this.B.x, this.B.y, 20, 20)
    }
}

class Point extends p5.Vector {
    fixed = false

    constructor(x, y, fixed) {
        super(x, y)
        this.fixed = fixed
    }
}


function setup() {
    let canvas = createCanvas(WIDTH, HEIGHT)
    canvas.parent("canvas")

    points = []
    for (let i = 0; i < 8; i++) {
        points.push(new Point(i*50, 0, i == 0));
    }

    bones = []
    for (let i = 0; i < points.length-1; i++) {
        bones.push(new Bone(points[i], points[i+1]));
    }

    frameRate(30)
}

function draw() {
    translate(WIDTH/2, HEIGHT/2)
    background(120)

    let moveToTarget = false
    let targetX = 0
    let targetY = 0

    if (mouseIsPressed) {
        if (0 <= mouseX && mouseX < WIDTH &&
            0 <= mouseY && mouseY < HEIGHT) {
                ellipseMode(CENTER)
                noStroke()
                fill(230, 230, 60)
                ellipse(mouseX-WIDTH/2, mouseY-HEIGHT/2, 30, 30)

                moveToTarget = true
                targetX = mouseX-WIDTH/2
                targetY = mouseY-HEIGHT/2
            }
    }

    if (moveToTarget) {
        points[points.length-1].x = targetX
        points[points.length-1].y = targetY

        // Test if loop is really nessessary
        let passes = 0
        do {

        for (let i = bones.length-1; i >= 0; i--) {
            let b = bones[i]

            if (b.A.fixed) {
                continue
            }

            // let alpha = Math.atan((b.A.y-b.B.y) / (b.A.x-b.B.x))
            let alpha = (new p5.Vector(1, 0)).angleBetween(b.A.sub(b.B))
            b.A.x = b.B.x + b.length * Math.cos(alpha)
            b.A.y = b.B.y + b.length * Math.sin(alpha)
        }

        for (let i = 0; i < bones.length; i++) {
            let b = bones[i]

            let alpha = (new p5.Vector(1, 0)).angleBetween(b.B.sub(b.A))
            b.B.x = b.A.x + b.length * Math.cos(alpha)
            b.B.y = b.A.y + b.length * Math.sin(alpha)
        }

        passes++

        } while (passes < 10)
    }

    for (b of bones) {
        b.draw()
    }
}