class MouseController {
    wheel

    prevMouseX
    prevMouseY

    constructor(wheel) {
        this.wheel = wheel
    }

    update() {
        if (mouseIsPressed && mouseButton == LEFT) {
            if (this.prevMouseX == undefined && this.prevMouseY == undefined && 
                dist(mouseX-WIDTH/2, mouseY-HEIGHT/2, 0, 0) > R) {
                return
            }

            if (this.prevMouseX != undefined && this.prevMouseY != undefined) {
                var dotP = this.prevMouseX*(mouseX-WIDTH/2) + this.prevMouseY*(mouseY-HEIGHT/2)
                var lenL = sqrt(this.prevMouseX*this.prevMouseX + this.prevMouseY*this.prevMouseY)
                var lenM = sqrt((mouseX-WIDTH/2)*(mouseX-WIDTH/2) + (mouseY-HEIGHT/2)*(mouseY-HEIGHT/2))
                var phi = acos(dotP / (lenL*lenM))
                if (!Number.isNaN(phi)) {
                    this.wheel.speed = phi / (deltaTime/1000) * Math.sign(this.prevMouseX*(mouseY-HEIGHT/2) -this.prevMouseY*(mouseX-WIDTH/2))
                }
            }
            this.prevMouseX = mouseX - WIDTH/2
            this.prevMouseY = mouseY - HEIGHT/2
        } else {
            this.prevMouseX = undefined
            this.prevMouseY = undefined
        }

    }

}

class SendController {

    wheel

    constructor(wheel) {
        this.wheel = wheel
    }

    update() {
        //if ((mouseX >= -50 && mouseX < WIDTH+50 && mouseY >= -50 && mouseY < HEIGHT+50) || this.wheel.speed > 0) {
            sendData()
        //}
    }

}

class WinnerController {
    wheel
    prevSpeed = 0

    constructor(wheel) {
        this.wheel = wheel
    }

    update() {
        if (this.prevSpeed != 0 && this.wheel.speed == 0 && !mouseIsPressed && !masterMousePressed) {
            winnerPromptHandler.showWinner(this.wheel.isOn())
        }
        this.prevSpeed = this.wheel.speed

        if (mouseIsPressed && mouseButton == LEFT) {
            if (dist(mouseX-WIDTH/2, mouseY-HEIGHT/2, 0, 0) >= WIDTH/2) {
                winnerPromptHandler.hideWinner()
            }
        }
    }
}