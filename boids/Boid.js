BOID_R = 10
BOID_TERM_VEL = 280
BOID_ACC_FORCE = 200
BOID_VISUAL_RANGE = 200
BOID_SEPERATION_RANGE = 50

ENABLE_COHESION = true
ENABLE_SEPERATION = true
ENABLE_ALIGNMENT = true

SHOW_ACC = true
SHOW_VEL = true
SHOW_VIS_RANGE = false
SHOW_SEP_RANGE = false

class Boid {

    pos = new p5.Vector()
    vel = new p5.Vector()
    acc = new p5.Vector()

    constructor(x, y) {
        this.pos.x = x
        this.pos.y = y

        this.vel.x = random(-1, 1)
        this.vel.y = random(-1, 1)
        this.vel.setMag(random(BOID_TERM_VEL))
    }

    update() {
        this.acc.set(0, 0)

        // COHESION
        if (ENABLE_COHESION) {
            var com = new p5.Vector()
            var boidsSeen = 0
            for (var b of boids) {
                if (this.pos.dist(b.pos) <= BOID_VISUAL_RANGE) {
                    com.add(b.pos)
                    boidsSeen++
                }
            }
            if (boidsSeen > 0) {
                com.div(boidsSeen)
                var f = new p5.Vector(com.x-this.pos.x, com.y-this.pos.y).setMag(BOID_ACC_FORCE)
                this.acc.add(f)
            }
        }

        // SEPERATION
        if (ENABLE_SEPERATION) {
            var com = new p5.Vector()
            var boidsSeen = 0
            for (var b of boids) {
                if (this.pos.dist(b.pos) <= BOID_SEPERATION_RANGE) {
                    com.add(b.pos)
                    boidsSeen++
                }
            }
            if (boidsSeen > 0) {
                com.div(boidsSeen)
                var f = new p5.Vector(com.x-this.pos.x, com.y-this.pos.y).setMag(-BOID_ACC_FORCE*3)
                this.acc.add(f)
            }
        }

        // ALIGNMENT
        if (ENABLE_ALIGNMENT) {
            var avgHeading = new p5.Vector()
            var boidsSeen = 0
            for (var b of boids) {
                if (this.pos.dist(b.pos) <= BOID_VISUAL_RANGE) {
                    avgHeading.add(b.vel)
                    boidsSeen++
                }
            }
            if (boidsSeen > 0) {
                avgHeading.div(boidsSeen)
            
                this.acc.add(avgHeading.setMag(BOID_ACC_FORCE*0.6))
            }
        }

        // PREDATOR
        if (PREDATOR_ENABLED) {
            if (this.pos.dist(predator.pos) <= BOID_VISUAL_RANGE) {
                var f = new p5.Vector(predator.pos.x-this.pos.x, predator.pos.y-this.pos.y)
                    .setMag(-BOID_ACC_FORCE*5)
                this.acc.add(f)
            }
        }
        
        // If nothing else: accelerate forward
        if (this.acc.mag() == 0) {
            this.acc = this.vel.copy()
        }

        this.acc.setMag(BOID_ACC_FORCE)
        this.acc.add(this.getAirResistance())
        
        this.vel.x += this.acc.x * (deltaTime / 1000)
        this.vel.y += this.acc.y * (deltaTime / 1000)

        this.pos.x += this.vel.x * (deltaTime / 1000)
        this.pos.y += this.vel.y * (deltaTime / 1000)

        this.checkBorders()
    }

    getAirResistance() {
        var resistanceForce = Math.pow(this.vel.mag(), 2) * (BOID_ACC_FORCE / Math.pow(BOID_TERM_VEL, 2))

        return this.vel.copy().setMag(-resistanceForce)
    }

    draw() {
        stroke(255)
        strokeWeight(2)
        fill(0, 0, 0, 0)
        ellipse(this.pos.x, this.pos.y, BOID_R, BOID_R)

        // DRAW VELOCITY
        if (SHOW_VEL) {
            stroke(200, 40, 40)
            strokeWeight(1.5)
            var xVel = map(this.vel.x, -BOID_TERM_VEL, BOID_TERM_VEL, -40, 40)
            var yVel = map(this.vel.y, -BOID_TERM_VEL, BOID_TERM_VEL, -40, 40)
            line(this.pos.x, this.pos.y, this.pos.x+xVel, this.pos.y+yVel)
        }

        // DRAW ACCELERATION
        if (SHOW_ACC) {
            stroke(180, 180, 40)
            strokeWeight(0.3)
            var xAcc = map(this.acc.x, -BOID_ACC_FORCE, BOID_ACC_FORCE, -30, 30)
            var yAcc = map(this.acc.y, -BOID_ACC_FORCE, BOID_ACC_FORCE, -30, 30)
            line(this.pos.x, this.pos.y, this.pos.x+xAcc, this.pos.y+yAcc)
        }

        // DRAW VISUAL RANGE
        if (SHOW_VIS_RANGE) {
            stroke(100, 200, 100)
            strokeWeight(0.2)
            ellipse(this.pos.x, this.pos.y, BOID_VISUAL_RANGE, BOID_VISUAL_RANGE)
        }

        // DRAW SEPERATION RANGE
        if (SHOW_SEP_RANGE) {
            stroke(180, 100, 50)
            strokeWeight(0.4)
            ellipse(this.pos.x, this.pos.y, BOID_SEPERATION_RANGE, BOID_SEPERATION_RANGE)
        }
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