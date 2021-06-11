var lastX
var lastY

var font

class Wheel {
    sections = []

    rotation = Math.PI
    speed = 0

    constructor(sections) {
        this.sections = sections
    }

    setSections(sections) {
        this.sections = sections
    }
    
    draw() {
        if (font == undefined) {
            font = loadFont('res/BalooTammudu2-Medium.ttf')
        }
        
        rotate(this.rotation)
        for (let i = 0; i < this.sections.length; i++) {
            noStroke()
            var colorIndex = 2 + i%(colors.length-2)
            if (colorIndex == 2 && i == this.sections.length-1) {
                colorIndex = (colors.length-2)
            }
            fill(colors[colorIndex])

            arc(0, 0, R*2, R*2, 0, 2*PI / this.sections.length)
            
            fill(colors[TEXT_COLOR])
            stroke(colors[BG_COLOR])
            strokeWeight(2)
            textFont(font)
            textSize((mqActive)?50:30)
            
            textStyle(BOLD)
            textAlign(CENTER)
            rotate(PI/this.sections.length)
            text(this.sections[i], 10, (mqActive)?-40:-25, R-10, (mqActive)?60:40)
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
        this.speed *= (mqActive)?0.97:0.99
        if (!mouseIsPressed && this.speed != 0 && abs(this.speed) < 0.00006) {
            this.speed = 0
            console.log("Landed on " + this.isOn())
            winnerPromptHandler.showWinner(this.isOn())
            lastX = undefined
            lastY = undefined
        }

        if (socket != undefined && socket.readyState == WebSocket.OPEN) {
            //socket.send("mouseX="+mouseX+"&mouseY="+mouseY+"&rot="+this.rotation+"&vel="+this.speed)
            let data = {
                "clientID": clientID+"",
                "mouseX": mouseX+"",
                "mouseY": mouseY+"",
                "rot": this.rotation+"",
                "vel": this.speed+""
            }
            socket.send(JSON.stringify(data))
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

    if (sqrt((mouseX-WIDTH/2)*(mouseX-WIDTH/2)+(mouseY-HEIGHT/2)*(mouseY-HEIGHT/2)) > WIDTH/2) {
        winnerPromptHandler.hideWinner()
    }
}