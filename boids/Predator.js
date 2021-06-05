PREDATOR_ENABLED = false
PRED_TERM_VEL = 100
PRED_ACC_FORCE =  400

class Predator {
    
    pos = new p5.Vector()
    vel = new p5.Vector()
    acc = new p5.Vector()

    steer = 0

    pointerControll = false

    constructor(x, y) {
        this.pos.x = x;
        this.pos.y = y;

        this.vel.x = random(-1, 1)
        this.vel.y = random(-1, 1)
        this.vel.setMag(random(PRED_TERM_VEL))
    }

    update() {
        if (this.pointerControll) {
            if (mouseIsPressed) {
                if (0 <= mouseX && mouseX < WIDTH &&
                    0 <= mouseY && mouseY < HEIGHT) {
                        predator.pos.x = mouseX
                        predator.pos.y = mouseY
                    }
            }
            return
        }

        this.steer += random(-2, 2)
        if (Math.abs(this.steer) >= 10) {
            this.steer *= 0.4
        }
        this.acc = this.vel.copy()
        this.acc.rotate(this.steer*(deltaTime/1000))
        this.acc.setMag(BOID_ACC_FORCE)
        this.acc.add(this.getAirResistance())

        this.vel.x += this.acc.x * (deltaTime / 1000)
        this.vel.y += this.acc.y * (deltaTime / 1000)

        this.pos.x += this.vel.x * (deltaTime / 1000)
        this.pos.y += this.vel.y * (deltaTime / 1000)

        this.checkBorders()
    }

    draw() {
        stroke(250, 150, 40)
        strokeWeight(5)
        fill(0, 0, 0, 0)
        ellipse(this.pos.x, this.pos.y, 40, 40)
    }

    getAirResistance() {
        var resistanceForce = Math.pow(this.vel.mag(), 2) * (PRED_ACC_FORCE / Math.pow(PRED_TERM_VEL, 2))

        return this.vel.copy().setMag(-resistanceForce)
    }

    checkBorders() {
        if (this.pos.x < 0) {
            this.pos.x = WIDTH
        } else if (this.pos.x > WIDTH) {
            this.pos.x = 0
        }
        if (this.pos.y < 0) {
            this.pos.y = HEIGHT
        } else if (this.pos.y > HEIGHT) {
            this.pos.y = 0
        }
    }

}