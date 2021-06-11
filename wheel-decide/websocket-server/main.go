package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/lennart1s/visualizations/wheel-decide/websocket-server/roomHandler"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var rooms map[string]*roomHandler.RoomHandler

func main() {
	rooms = make(map[string]*roomHandler.RoomHandler)

	http.HandleFunc("/", handleIndex)
	http.HandleFunc("/ws", wsEndpoint)
	http.HandleFunc("/create-room", creationHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World"))
}

func creationHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Got creation request: ")

	r.ParseForm()
	fmt.Println(r.Form)

	rh := roomHandler.New()
	fmt.Println("Created room with id: " + rh.ID)

	//rooms = append(rooms, rh)
	//TODO: check if id is in use by mistake
	rooms[rh.ID] = rh

	w.Header().Add("Content-type", "text/plain")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(rh.ID))
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint access: " + r.RemoteAddr)
	roomID, ok := r.URL.Query()["room"]

	if !ok {
		fmt.Println("No id in url")
		return
	} else {
		fmt.Println(roomID)
	}
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("[WARN] Couln't create new web socket: " + err.Error())
		return
	}

	log.Println("[INFO] Accepted new ws-connection: " + ws.RemoteAddr().String())

	//conListener(ws)
	//roomHandler
	rooms[roomID[0]].AddConnection(ws)
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
