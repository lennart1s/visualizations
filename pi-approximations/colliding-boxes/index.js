var collisions = 0
var B
var b

var ft = 0

function setup() {
    var canvas = createCanvas(800, 300)
    canvas.parent("canvas")
    frameRate(30)
    
    let M = document.getElementById("M").value
    let m = document.getElementById("m").value

    B = new Box(250, 50, Number(M), -50, color('blue'))
    b = new Box(200, 25, Number(m), 0, color('red'))
    noLoop()    
}

function draw() {
    process()

    background(120)
    translate(100, 0)
    noStroke()
    fill(255)
    rect(-10, 150, 10, 50)

    B.draw()
    b.draw()

    document.getElementById("num-cols").innerHTML = collisions
}

function process() {
    running = true
    while (true) {
        //Absolute end:
        if (B.vel > 0 && abs(b.vel) < B.vel) {
            noLoop()
            console.log("end " + collisions)
            running = false
            return
        }

        var t
        // Collision after:
        if (b.vel < 0) {
            t = b.x / abs(b.vel)
        } else if (b.vel >= 0) {
            t = (B.x - (b.x+b.size)) / (b.vel - B.vel)
        }
        t *= 1000

        // If frame-time+t below deltaTime: frame-time += t, do collision, set position, recalculate
        // If frame-time+t above deltaTime: calculate positions at deltaTime, ft = 0, draw
        if (ft+t < deltaTime) {
            collisions++
            ft += t
            b.x += b.vel * (t/1000)
            B.x += B.vel * (t/1000)
            if (b.vel < 0) {
                b.vel *= -1
            } else {
                var bvel = b.vel
                b.vel = (b.mass*b.vel + B.mass*(2*B.vel-b.vel)) / (b.mass + B.mass)
                B.vel = (B.mass*B.vel + b.mass*(2*bvel-B.vel)) / (b.mass + B.mass)
            }
            continue
        } else {
            var t = deltaTime - ft
            b.x += b.vel * (t/1000)
            B.x += B.vel * (t/1000)
            ft = 0
            break
        }
    }
}

function settingChange(elem) {
    //console.log(elem.value)
    switch (elem.id) {
    case "M":
        //if (!running) {
            B.mass = Number(elem.value)
        //}
        if (Math.log10(elem.value)%2 != 0) {
            // SHOW INFO THAT THIS WONT APPROXIMATE PI
        } else {
            // HIDE INFO
        }

        break
    }

}