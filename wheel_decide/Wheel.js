var lastX
var lastY

class Wheel {
    sections = []

    rotation = 0
    speed = 0

    constructor(sections) {
        this.sections = sections
    }

    draw() {
        rotate(this.rotation)
        for (let i = 0; i < this.sections.length; i++) {
            noStroke()
            fill(i*70)

            arc(0, 0, R*2, R*2, 0, 2*PI / this.sections.length)
            
            fill(255)
            textSize(20)
            textAlign(CENTER)
            rotate(PI/this.sections.length)
            text(this.sections[i], 0, -10, R, 20)
            rotate(-(PI/this.sections.length))

            rotate(2*PI / this.sections.length)
        }
        rotate(-this.rotation)
    }

    update() {
        if (mouseIsPressed && mouseButton == LEFT) {
            if (lastX != undefined && lastY != undefined) {
                var dotP = lastX*(mouseX-WIDTH/2) + lastY*(mouseY-HEIGHT/2)
                var lenL = sqrt(lastX*lastX + lastY*lastY)
                var lenM = sqrt((mouseX-WIDTH/2)*(mouseX-WIDTH/2) + (mouseY-HEIGHT/2)*(mouseY-HEIGHT/2))
                var phi = acos(dotP / (lenL*lenM))
                if (!Number.isNaN(phi)) {
                    this.speed = phi * deltaTime/1000 * Math.sign(lastX*(mouseY-HEIGHT/2) + -lastY*(mouseX-WIDTH/2))
                } 
            }
        }

        this.rotation += this.speed * deltaTime
        this.rotation = (this.rotation > 0) ? this.rotation%(2*PI) : this.rotation%(2*PI)+2*PI
        this.speed *= 0.99
        if (!mouseIsPressed && this.speed != 0 && abs(this.speed) < 0.00006) {
            this.speed = 0
            console.log("Landed on " + this.isOn())
        }
    }

    isOn() {
        let i = (this.rotation / (2*PI))*this.sections.length
        return this.sections[this.sections.length-int(i)-1]
    }
}

function mousePressed() {
    if (sqrt((mouseX-WIDTH/2)*(mouseX-WIDTH/2)+(mouseY-HEIGHT/2)*(mouseY-HEIGHT/2)) <= R) {
        lastX = mouseX-WIDTH/2
        lastY = mouseY-HEIGHT/2
    }
}

function mouseClicked() {
    lastX = undefined
    lastY = undefined
}