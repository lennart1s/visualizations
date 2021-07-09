let width = 400
let height = 400

var img
var qt

function setup() {
    let canvas = createCanvas(width, height)
    canvas.parent("canvas")

    img = loadImage('./panda.jpg', () => {
        img.resize(width, height)
        img.loadPixels()

        qt = new QuadTree(0, 0, width, height)
        qt.draw()
    })

    frameRate(5)
    noLoop()
    background(90, 90, 90)
}

function mouseMoved() {
    let clicked = qt.getChilSpanning(mouseX, mouseY)
    if (clicked == undefined) {
        return
    }
    clicked.divide()
    clicked.draw()
}

function mouseClicked() {
    let clicked = qt.getChilSpanning(mouseX, mouseY)
    clicked.divide()
    clicked.draw()
}

class QuadTree {
    x
    y
    w
    h
    
    tl
    tr
    bl
    br

    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    divide() {
        this.tl = new QuadTree(this.x, this.y, this.w/2, this.h/2)
        this.tr = new QuadTree(this.x+this.w/2, this.y, this.w/2, this.h/2)
        this.bl = new QuadTree(this.x, this.y+this.h/2, this.w/2, this.h/2)
        this.br = new QuadTree(this.x+this.w/2, this.y+this.h/2, this.w/2, this.h/2)
    }

    isSpanning(x, y) {
        return this.x <= x && x < this.x+this.w && this.y <= y && y < this.y+this.h
    }

    getChilSpanning(x, y) {
        if (this.isSpanning(x, y)) {
            if (this.tl == null || this.tl == undefined) {
                return this
            }

            for (let c of [this.tl, this.tr, this.bl, this.br]) {
                if (c.isSpanning(x, y)) {
                    return c.getChilSpanning(x, y)
                }
            }
        }
    }

    draw() {
        if (this.tl != null && this.tl != undefined) {
            fill(255)
            rect(this.x, this.y, this.w, this.h)
            
            for (let c of [this.tl, this.tr, this.bl, this.br]) {
                c.draw()
            }
            return
        }

        ellipseMode(CORNER)
        noStroke()
        fill(img.get(this.x+this.w/2, this.y+this.h/2))

        ellipse(this.x, this.y, this.w, this.h)
    }


}
