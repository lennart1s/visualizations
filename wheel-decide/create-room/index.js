function sendCreationRequest() {
    var req = new XMLHttpRequest()
    req.open("POST", "http://127.0.0.1:8080/create-room")
    req.onload = function(event) {
        console.log("Response: " + event.target.response)
        ///connectToRoom(event.target.response)
        window.location = "/wheel-decide/?room=" + event.target.response
    }

    //var data = new FormData(document.getElementById("creation-form"))
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    //req.send(data)
    let data = ""
    for (let input of document.getElementsByTagName("input")) {
        data += input.name + "=" + input.value + "&"
    }
    //req.send("tet=hello&test2=tschau")
    req.send(data)
}