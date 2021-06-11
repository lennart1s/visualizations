window.onload = function() {
    let urlParams = new URLSearchParams(window.location.search)
    let roomID = urlParams.get("room")

    if (roomID != "" && roomID != null) {
        connectToRoom(roomID)
    } else {
        deserialize()
    }
}

let wheel
let titleHandler
let optionHandler
let winnerPromptHandler

function init() {
    titleHandler = new TitleHandler(document.getElementById("title-input"))
    optionHandler = new OptionHandler(document.getElementById("menu"), wheel)
    winnerPromptHandler = new WinnerPromptHandler(document.getElementById("winner"))
}
document.addEventListener('DOMContentLoaded', init, false)

function resetPage() {
    parent.location.hash = ""
    window.location = "./"
}
