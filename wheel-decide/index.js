window.onload = function() {
    let urlParams = new URLSearchParams(window.location.search)
    let roomID = urlParams.get("room")

    if (wheel == undefined) {
        wheel = new Wheel(["Monday", "Tuesday", "Sunday"])
    }

    if (roomID != "" && roomID != null) {
        connectToRoom(roomID)
    } else {
        deserialize()
        wheel.controllers.push(new MouseController(wheel))
    }
}

let wheel
let titleHandler
let optionHandler
let winnerPromptHandler
let numClientsHandler

function init() {
    titleHandler = new TitleHandler(document.getElementById("title-input"))
    optionHandler = new OptionHandler(document.getElementById("menu"), wheel)
    winnerPromptHandler = new WinnerPromptHandler(document.getElementById("winner"))
    numClientsHandler = new NumClientsHandler(document.getElementById("num-clients"))
}
document.addEventListener('DOMContentLoaded', init, false)

function resetPage() {
    parent.location.hash = ""
    window.location = "./"
}
