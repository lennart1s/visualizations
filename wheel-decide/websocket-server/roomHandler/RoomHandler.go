package roomHandler

import (
	"encoding/json"
	"strconv"

	"github.com/gorilla/websocket"
)

var (
	idSeed = []byte("abcd")
)

type RoomHandler struct {
	ID       string
	Clients  []*Client
	masterID string

	Settings map[string]string

	Data RoomData
}

func NewRoomHandler() *RoomHandler {
	rh := &RoomHandler{}
	rh.ID = nextID()
	rh.Settings = make(map[string]string)

	return rh
}

func NewRoomHandlerFromSettings(settings map[string]string) *RoomHandler {
	rh := NewRoomHandler()
	for k, v := range settings {
		rh.Settings[k] = v
	}

	return rh
}

func (rh *RoomHandler) AddConnection(conn *websocket.Conn) {
	if maxStr, ok := rh.Settings["max-clients"]; ok {
		if max, _ := strconv.Atoi(maxStr); len(rh.Clients) >= max {
			conn.CloseHandler()(4002, "")
			conn.Close()
			return
		}
	}

	client := NewClient(conn)
	if len(rh.Clients) == 0 {
		rh.masterID = client.ID
	}
	client.MessageHandler = rh.clientMsgHandler
	client.SendMsg(websocket.TextMessage, []byte("cid="+client.ID+"&urm="+strconv.FormatBool(client.ID == rh.masterID)))
	rh.sendDataToUsers()

	rh.Clients = append(rh.Clients, client)
}

func (rh *RoomHandler) ReconnectClient(conn *websocket.Conn, clientID string) {
	for _, c := range rh.Clients {
		if c.ID == clientID {
			c.Reconnect(conn)
			c.SendMsg(websocket.TextMessage, []byte("cid="+c.ID+"&urm="+strconv.FormatBool(c.ID == rh.masterID)))

			return
		}
	}

	rh.AddConnection(conn)
}

func (rh *RoomHandler) clientMsgHandler(c *Client, data []byte) {
	if c.ID == rh.masterID {
		var rd RoomData
		err := json.Unmarshal(data, &rd)
		if err != nil {
			//TODO: Handle error
			return
		}
		rh.Data = rd
		rh.Data.Clients = len(rh.Clients)
		rh.sendDataToUsers()
	}
}

func (rh *RoomHandler) sendDataToUsers() {
	cn := 0
	for _, c := range rh.Clients {
		if c.IsConnected() {
			cn++
		}
	}
	rh.Data.Clients = cn
	data, _ := json.Marshal(rh.Data)

	for _, c := range rh.Clients {
		c.SendMsg(websocket.TextMessage, data)
	}
}

func nextID() string {
	i := len(idSeed) - 1
	for {
		idSeed[i]++
		if idSeed[i] > 122 {
			idSeed[i] = 97
			i--
		} else {
			break
		}
	}

	return string(idSeed)
}
