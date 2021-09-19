const DRAW_R = 10

class Point extends p5.Vector {
    color
    fixed = false

    prev

    constructor(x, y, fixed) {
        super(x, y)
        this.fixed = fixed

        this.prev = new p5.Vector(x, y)

        this.color = color(255, 255, 255)
    }

    process() {
        if (this.fixed) {
            return
        }
        
        //let vel = new p5.Vector(this.x-this.prev.x, this.y-this.prev.y)
        //vel.y -= 4
        
        //this.prev.x = this.x
        //this.prev.y = this.y

        //this.x += vel.x
        //this.y += vel.y

        let prevX = this.x
        let prevY = this.y

        this.x += this.x - this.prev.x
        this.y += this.y - this.prev.y
        this.y -= 80 * (deltaTime / 1000)
        this.prev.x = prevX
        this.prev.y = prevY
    }

    draw() {
        ellipseMode(CENTER)
        noStroke()
        fill(this.fixed ? color(40, 20, 180) : this.color)
        ellipse(this.x, this.y, DRAW_R*2, DRAW_R*2)
    }
}