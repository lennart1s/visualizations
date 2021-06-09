package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func main() {

	http.HandleFunc("/", handleIndex)
	http.HandleFunc("/ws", wsEndpoint)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World"))
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint access: " + r.RemoteAddr)
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("[WARN] Couln't create new web socket: " + err.Error())
		return
	}

	log.Println("[INFO] Accepted new ws-connection: " + ws.RemoteAddr().String())

	conListener(ws)
}

func conListener(conn *websocket.Conn) {
	for {
		msgType, data, err := conn.ReadMessage()
		if _, ok := err.(*websocket.CloseError); ok {
			fmt.Println("Close")
			return
		} else if err != nil {
			log.Println("[WARN] Couldn't read message from ws-client: " + err.Error())
			continue
		}

		fmt.Println("Received: " + string(data))

		err = conn.WriteMessage(msgType, []byte("I heard you!"))
	}
}
