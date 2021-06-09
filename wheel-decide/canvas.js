let root = document.documentElement;

var WIDTH = 500
var HEIGHT = 500
var R = WIDTH*0.9 / 2

var colors = []

var wheel

function setup() {
    // Canvas creation
    var canvas = createCanvas(WIDTH, HEIGHT)
    canvas.parent("canvas")

    // Color palette
    let cp = int(random(COLOR_PALETTES.length))
    console.log("Using color palette: " + (cp+1))
    colors = COLOR_PALETTES[cp]
    root.style.setProperty('--bg-color', colors[BG_COLOR])
    root.style.setProperty('--text-color', colors[TEXT_COLOR])

    // Creating the Initial Wheel
    if (wheel == undefined) {
        wheel = new Wheel(["Monday", "Tuesday", "Sunday"])
    }
}

function draw() {
    // Logic
    wheel.update()

    // BG
    translate(WIDTH/2, HEIGHT/2)
    background(color(colors[BG_COLOR]))
    
    // Draw wheel shadow
    noStroke()
    for (let r = R+20; r > R; r--) {
        fill(0, 0, 0, map(r, R, R+20, 1, 0.3))
        ellipse(0, 0, r*2, r*2)
    }

    // Draw wheel
    wheel.draw()

    // Draw pointer
    fill(250)
    triangle(R+10, 0, R+30, 10, R+30, -10)
}