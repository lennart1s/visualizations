let root = document.documentElement;
let mqActive

var WIDTH = 500
var HEIGHT = 500

var R = WIDTH*0.9 / 2

var colors = []

function setup() {
    mqActive = getComputedStyle(root).getPropertyValue("--mq-active") == "true"
    if (mqActive) {
        pixelDensity(1)
        WIDTH = 800
        HEIGHT = 800
        R = WIDTH*0.9 / 2
    }
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
    wheel.controllers.push(new WinnerController(wheel))
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
    if (!mqActive) {
        triangle(R+10, 0, R+30, 10, R+30, -10)
    } else {
        triangle(R+10, 0, WIDTH/2, 30, WIDTH/2, -30)
    }

    // Draw Master Mouse
    if (masterMouseX != undefined && masterMouseY != undefined) {
        noStroke()
        fill(255, 255, 255)
        ellipse(masterMouseX-WIDTH/2, masterMouseY-HEIGHT/2, 30, 30)
    }
}