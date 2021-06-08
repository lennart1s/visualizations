var WIDTH = 600
var HEIGHT = 600
var R = WIDTH*0.8 / 2

var colors = []

var wheel


function setup() {
    var canvas = createCanvas(WIDTH, HEIGHT)
    canvas.parent("canvas")
    let cp = int(random(COLOR_PALETTES.length))
    console.log("Using color palette: " + (cp+1))
    colors = COLOR_PALETTES[cp]

    wheel = new Wheel(["Deine Mom", "1awdawd awd", "apawd"])
}

function draw() {
    wheel.update()

    translate(WIDTH/2, HEIGHT/2)

    background(color(colors[BG_COLOR]))
    
    noStroke()
    for (let r = R+20; r > R; r--) {
        fill(0, 0, 0, map(r, R, R+20, 1, 0.3))
        ellipse(0, 0, r*2, r*2)
    }

    wheel.draw()

    fill(250)
    triangle(R+10, 0, R+30, 10, R+30, -10)
}