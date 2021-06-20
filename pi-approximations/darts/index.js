let WIDTH = 600
let HEIGHT = 600

let DPF = 50
let TOTAL = 0
let HITS = 0

function setup() {
    let canvas = createCanvas(WIDTH, HEIGHT)
    canvas.parent("canvas")

    frameRate(30)

    background(120)

    noStroke()
    fill(180, 150, 130)
    ellipse(WIDTH/2, HEIGHT/2, WIDTH, HEIGHT)
}

function draw() {
    for (let i = 0; i < DPF; i++) {
        let x = random(0, WIDTH)
        let y = random(0, HEIGHT)

        TOTAL++
        stroke(0)
        if (dist(x, y, WIDTH/2, HEIGHT/2) < WIDTH/2) {
            HITS++
            stroke(random(70, 220), random(70, 220), random(70, 220))
        }

        strokeWeight(1.5)
        point(x, y)
    }

    let circleA = width*height * HITS/TOTAL
    let pi = circleA / pow(width/2, 2)
    console.log(pi)

}