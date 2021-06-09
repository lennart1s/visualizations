console.log("Starting ws-client...")

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
}