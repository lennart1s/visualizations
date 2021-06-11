class TitleHandler {

    inputElem

    constructor(elem) {
        this.inputElem = elem
        this.inputElem.onchange = () => {this.titleChange()}
    }

    titleChange() {
        if (this.inputElem.value == "") {
            this.inputElem.classList = []
        } else {
            this.inputElem.classList = ["non-empty-input"]
        }

        serialize()
    }

    getTitle() {
        return this.inputElem.value
    }

    setTitle(title) {
        this.inputElem.value = title 

        this.titleChange()
    }

    serialize() {
        let title = this.getTitle()
        if (title == "") {
            return ""
        }

        return "title="+title
    }

}

class OptionHandler {

    menuElem
    wheel

    constructor(menuElem, wheel) {
        this.menuElem = menuElem
        for (var input of this.menuElem.children) {
            input.onchange = () => {this.optionChange()}
        }
        this.wheel = wheel
    }

    optionChange() {
        let options = this.getOptions()
        if (options.length > 0) {
            if (wheel == undefined) {
                wheel = new Wheel(options)
            } else {
                wheel.setSections(options)
            }
            
        }

        serialize()
    }

    getOptions() {
        let options = []

        for (var input of this.menuElem.children) {
            if (input.value != "") {
                options.push(input.value)
            }
        }

        return options
    }

    setOptions(options) {
        for (i = 0; i < options.length; i++) {
            if (i == 0) {
                this.menuElem.children[0].value = options[i]
                continue
            }
            this.addInput(options[i])
        }

        this.optionChange()
    }

    addInput(value) {
        var input = document.createElement("input")
        input.type = "text"
        input.placeholder = "Option " + (this.menuElem.children.length+1)
        input.onchange = () => {this.optionChange()}
        if (value != undefined) {
            input.value = value
        }

        this.menuElem.appendChild(input)
        window.scrollTo(0, document.body.scrollHeight)
    }

    serialize() {
        let data = ""

        let options = this.getOptions()
        if (options.length > 0) {
            data += "options="
        }

        let first = true
        for (let option of options) {
            if (option != "") {
                data += (first ? "" : "%11") + option
                first = false
            }
        }
        
        return data
    }

}

class WinnerPromptHandler {
    
    elem

    constructor(elem) {
        this.elem = elem
    }

    showWinner(text, duration) {
        this.elem.innerHTML = text

        this.elem.style.display = "block"
        this.elem.classList = "appear"

        if (duration != undefined) {
            setTimeout(() => {
                this.hideWinner()
            }, duration);
        }
    }

    hideWinner() {
        this.elem.classList = "disappear"
        setTimeout(() => {
            document.getElementById("winner").style.display = "none"
        }, 500);
    }

}

function serialize() {
    var hash = titleHandler.serialize()
    var optionData = optionHandler.serialize()
    if (optionData != "") {
        hash += "&"+optionData
    }

    parent.location.hash = hash
}

function deserialize() {
    let hash = parent.location.hash.slice(1)
    hash = hash.replaceAll("%20", " ")
    
    let parts = hash.split("&")

    for (i = 0; i < parts.length; i++) {
        switch (i) {
        case 0: 
            if (parts[i].startsWith("title=")) {
                console.log(parts[i].replace("title=", ""))
                let title = parts[i].replace("title=", "")
                titleHandler.setTitle(title)
            }
            break
        case 1:
            if (parts[i].startsWith("options=")) {
                let options = parts[i].replace("options=", "").split("%11")
                optionHandler.setOptions(options)
            }
            break
        }
    }
}