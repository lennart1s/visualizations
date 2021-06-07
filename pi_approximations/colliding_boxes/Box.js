class Box {
    x
    size
    mass
    vel

    color

    constructor(x, size, mass, vel, color) {
        this.x = x
        this.size = size
        this.mass = mass
        this.vel = vel

        this.color = color
    }

    draw() {
        noStroke()
        fill(this.color)
        rect(this.x, 200-this.size, this.size, this.size)
    }
}