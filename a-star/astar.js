let start
let dest

function astar(steps) {
    start = findStartNode()
    dest = findDestNode()
    if (!start || !dest) {
        return
    }

    open = []
    closed = []
    open.push(new Node(undefined, start.x, start.y))

    let step = 0
    while (open.length > 0 && (steps < 0 || step < steps)) {
        let minCost = 99999
        let minI = -1
        for (let i = 0; i < open.length; i++) {
            if (open[i].f < minCost || minI == -1) {
                minCost = open[i].f
                minI = i
            }
        }
        let q = open[minI]
        open.splice(minI, 1)
        closed.push(q)

        let successors = q.getSuccessors()
        for (let s of successors) {
            if (s.x == dest.x && s.y == dest.y) {
                return s
            }

            let inClosed = undefined
            for (let c of closed) {
                if (c.x == s.x && c.y == s.y) {
                    inClosed = c
                    break
                }
            }
            if (inClosed && inClosed.f < s.f) {
                continue
            } 

            let inOpen = undefined
            for (let o of open) {
                if (o.x == s.x && o.y == s.y) {
                    inOpen = o
                    break
                }
            }
            if (inOpen && inOpen.f < s.f) {
                continue
            } else if (inOpen) {
                inOpen.parent = s.parent
                inOpen.calculateCosts()
            } else {
                open.push(s)
            }
        }

        step++
    }
}

class Node {
    f
    g
    h

    x
    y

    parent

    constructor(parent, x, y) {
        this.parent = parent
        this.x = x
        this.y = y
        this.calculateCosts()
    }

    calculateCosts() {
        if (this.parent == undefined) {
            this.g = 0
            this.h = 0
            this.f = 0
            return
        }

        this.g = this.parent.g+Math.sqrt(Math.pow(this.x-this.parent.x, 2)+Math.pow(this.y-this.parent.y, 2))
        this.h = Math.sqrt(Math.pow(dest.x-this.x, 2) + Math.pow(dest.y-this.y, 2))
        this.f = this.g + this.h

        if (cells[this.x][this.y] == EMPTY) {
            cells[this.x][this.y] = -this.h
        }
    }

    getSuccessors() {
        let successors = []
        for (let xo = -1; xo <= 1; xo++) {
            for (let yo = -1; yo <= 1; yo++) {
                if (xo == 0 && yo == 0) {
                    continue
                } else if (this.x+xo < 0 || this.x+xo >= WIDTH || this.y+yo < 0 || this.y+yo >= HEIGHT || cells[this.x+xo][this.y+yo] == BLOCK) {
                    continue
                }
                let s = new Node(this, this.x+xo, this.y+yo)
                successors.push(s)
            }
        }
        return successors
    }
}