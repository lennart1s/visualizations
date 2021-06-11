let socket
let clientID

let masterMouseX
let masterMouseY

function connectToRoom(id) {
    socket = new WebSocket("ws://localhost:8080/ws?room=" + id)
    console.log("Connecting...")

    socket.onopen = () => {
        console.log("Connected!")
    }
    
    socket.onmessage = event => {
        //console.log("Received: ", event.data)
        if (event.data.startsWith("cid=") && clientID == undefined) {
            clientID = event.data.replace("cid=", "")
            console.log(clientID)
        } else {
            //console.log(event.data)
            let data = JSON.parse(event.data)
            wheel.rotation = data.rot
            console.log(data.mouseX)
            masterMouseX = Number(data.mouseX)
            masterMouseY = Number(data.mouseY)
        }
    }
}


/*console.log("Starting ws-client...")

let socket = new WebSocket("ws://localhost:8080/ws")
console.log("Connecting...")

socket.onopen = () => {
    console.log("Connected!")

    socket.send("Hi! Im the client.")
}

socket.onclose = event => {
    console.log("Socket connection closed: ", event)
}

socket.onerror = err => {
    console.log("Socket Error: ", err)
}

socket.onmessage = event => {
    console.log("Received: ", event.data)
}*/