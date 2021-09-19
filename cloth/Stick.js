
class Stick {
    color
    A
    B
    length

    constructor(A, B) {
        this.A = A
        this.B = B
        this.length = this.A.dist(this.B)

        this.color = color(255)
    }

    process() {
        // this.A.process()
        // this.B.process()

        let center = new p5.Vector(this.A.x + (this.B.x-this.A.x)/2,
            this.A.y + (this.B.y-this.A.y)/2)
        if (!this.A.fixed) {
            this.A.sub(center)
            this.A.setMag(this.length/2)
            this.A.add(center)
        }

        if (!this.B.fixed) {
            this.B.sub(center)
            this.B.setMag(this.length/2)
            this.B.add(center)
        }
    }

    draw() {
        strokeWeight(5)
        stroke(this.color)
        line(this.A.x, this.A.y, this.B.x, this.B.y)
        this.A.draw()
        this.B.draw()
    }
}