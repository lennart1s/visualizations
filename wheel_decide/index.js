var WIDTH = 600
var HEIGHT = 600
var R = WIDTH*0.8 / 2

var wheel


function setup() {
    var canvas = createCanvas(WIDTH, HEIGHT)
    canvas.parent("canvas")

    wheel = new Wheel(["Deine Mom", "Dein Vatter", "Du Wixxer", "4", "5"])
}

function draw() {
    wheel.update()

    translate(WIDTH/2, HEIGHT/2)

    background(150)
    
    for (let r = R+15; r > R; r--) {
        fill(map(r, R, R+15, 120, 150))
        ellipse(0, 0, r*2, r*2)
    }
    wheel.draw()

    fill(250)
    triangle(R+10, 0, R+30, 10, R+30, -10)
}