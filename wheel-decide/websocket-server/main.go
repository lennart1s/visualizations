package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/lennart1s/visualizations/wheel-decide/websocket-server/roomHandler"
)

const (
	MAX_ROOMS = 100
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var rooms map[string]*roomHandler.RoomHandler

func main() {
	//TODO: actually check origin
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	rooms = make(map[string]*roomHandler.RoomHandler)
	go cleanRooms()

	http.HandleFunc("/ws", wsEndpoint)
	http.HandleFunc("/create-room", creationHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func creationHandler(w http.ResponseWriter, r *http.Request) {
	if len(rooms) >= MAX_ROOMS {
		log.Println("[WARN] Room maximum reached. Creation request got rejected")
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("There are no rooms available. Please try again later"))
		return
	}

	r.ParseForm()
	// TODO: use settings from form
	settings := make(map[string]string)
	if val := r.FormValue("max-users"); val != "" {
		settings["max-clients"] = val
	}

	rh := roomHandler.NewRoomHandlerFromSettings(settings)
	if _, ok := rooms[rh.ID]; ok {
		log.Printf("[ERROR] Room with id '%v' already in use\n", rh.ID)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Sorry, something went wrong.\nPlease try again in a few minutes"))
		return
	}
	rooms[rh.ID] = rh

	w.Header().Add("Content-type", "text/plain")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(rh.ID))
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("[WARN] Couln't create new web socket: " + err.Error())
		ws.CloseHandler()(4500, "")
		ws.Close()
		return
	}

	params := r.URL.Query()

	roomID, rIDok := params["room"]
	if !rIDok {
		ws.CloseHandler()(4400, "")
		ws.Close()
		return
	} else if _, ok := rooms[roomID[0]]; !ok {
		ws.CloseHandler()(4404, "")
		ws.Close()
		return
	}

	clientID, cIDok := params["clientID"]

	if cIDok {
		rooms[roomID[0]].ReconnectClient(ws, clientID[0])
		return
	}
	rooms[roomID[0]].AddConnection(ws)
}

func cleanRooms() {
	for {
		var toDelete []string
		for id, r := range rooms {
			cn := 0
			for _, c := range r.Clients {
				if c.IsConnected() {
					cn++
				}
			}
			if cn == 0 {
				toDelete = append(toDelete, id)
			}
		}
		for _, id := range toDelete {
			delete(rooms, id)
		}

		time.Sleep(time.Until(time.Now().Add(20 * time.Second)))
	}
}
