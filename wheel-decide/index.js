window.onload = function() {
    let hash = parent.location.hash.slice(1)
    hash = hash.replaceAll("%20", " ")
    let parts = hash.split("&")
    for (i = 0; i < parts.length; i++) {
        switch (i) {
        case 0: 
            if (parts[i].startsWith("title=")) {
                input = document.getElementById("title-input")
                input.value = parts[i].replace("title=", "")
                titleChange(input)
            }
            break
        case 1:
            if (parts[i].startsWith("options=")) {
                let options = parts[i].replace("options=", "").split("%11")
                for (i = 0; i < options.length; i++) {
                    if (i == 0) {
                        document.getElementById("menu").children[0].value = options[i]
                        continue
                    }
                    addOption(options[i])
                }
                optionChange()
            }
        }
    }
}


function addOption(value) {
    let menu = document.getElementById('menu')

    var input = document.createElement("input")
    input.type = "text"
    input.placeholder = "Option " + (menu.children.length+1)
    input.onchange = optionChange
    if (value != undefined) {
        input.value = value
    }

    menu.appendChild(input)
    window.scrollTo(0, document.body.scrollHeight)

    //parent.location.hash += "testloc"
    //console.log(parent.location.hash)
}

function titleChange(input) {
    if (input.value == "") {
        input.classList = []
    } else {
        input.classList = ["non-empty-input"]
    }

    updateLocationHash()
}

function optionChange() {
    let inputs = document.getElementById("menu").children

    let labels = []

    for (input of inputs) {
        if (input.value != "")
        labels.push(input.value)
    }

    if (labels.length > 0) {
        wheel = new Wheel(labels)
    }

    updateLocationHash()
}

function resetPage() {
    parent.location.hash = ""
    window.location = "./"
}

function updateLocationHash() {
    var hash = ""
    hash += "title="+document.getElementById("title-input").value
    hash += "&options="
    first = true
    for (input of document.getElementById("menu").children) {
        if (input.value != "") {
            hash += (first ? "" : "%11") + input.value
            first = false
        }
    }
    parent.location.hash = hash
}

function showWinner(text) {
    let winner = document.getElementById("winner")
    winner.innerHTML = text
    winner.style.display = "block"
    winner.classList = "appear"
}

function hideWinner() {
    document.getElementById("winner").classList = "disappear"
    setTimeout(() => {
        document.getElementById("winner").style.display = "none"
    }, 500);
}