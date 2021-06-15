let socket
let clientID
let isMaster

let masterMouseX
let masterMouseY
let masterMousePressed

function connectToRoom(id) {
    var sessionID
    let cookies = document.cookie.split(";")
    for (c of cookies) {
        c = c.trim()
        if (c.startsWith("sessionID=")) {
            sessionID = c.replace("sessionID=", "")
        }
    }

    let url = "ws://localhost:8080/ws?room=" + id
    if (sessionID != undefined) {
        url += "&clientID=" + sessionID
    }

    socket = new WebSocket(url)
    console.log("Connecting...")

    socket.onopen = () => {
        console.log("Connected!")
    }

    socket.onclose = data => {
        console.log(data)
    }
    
    socket.onmessage = event => {
        let params = new URLSearchParams(event.data)
        clientID = params.get("cid")
        isMaster = params.get("urm") == "true"

        if (!isMaster) {
            titleHandler.disable()
            optionHandler.disable()
            document.getElementById("new-option-btn").disabled = true
        }
        if (isMaster) {
            wheel.controllers.push(new MouseController(wheel))
            wheel.controllers.push(new SendController(wheel))
        }
        // add server client controller

        document.cookie ="sessionID="+clientID+";"

        socket.onmessage = msgHandler
    }

    socket.onerror = err => {
        console.log(err)
    }
}

function msgHandler(evt) {
    let json = JSON.parse(evt.data)
    if (!isMaster) {
        masterMouseX = json.masterMouseX
        masterMouseY = json.masterMouseY
        masterMousePressed = json.masterMousePressed
        wheel.rotation = json.wheelRot
        wheel.speed = json.wheelVel
        titleHandler.setTitle(json.title)
        optionHandler.setOptions(json.options)
    }
    numClientsHandler.set(json.clients)
}

function sendData() {
    if (socket == undefined || socket.readyState != WebSocket.OPEN) {
        return
    }
    
    let data = {
        "title": titleHandler.getTitle(),
        "options": optionHandler.getOptions(),
        "wheelRot": wheel.rotation,
        "wheelVel": wheel.speed,
        "masterMouseX": mouseX,
        "masterMouseY": mouseY,
        "masterMousePressed": mouseIsPressed,
    }
    socket.send(JSON.stringify(data))
}