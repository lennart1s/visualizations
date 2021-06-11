package roomHandler

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"

	"github.com/google/uuid"
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

	/*Title   string
	Options []string*/

	WheelRotation float64
	WheelSpeed    float64
	MasterMouseX  float64
	MasterMouseY  float64
}

func New() *RoomHandler {
	// Check room amount

	rh := &RoomHandler{}
	rh.ID = nextID()

	return rh
}

func (rh *RoomHandler) AddConnection(conn *websocket.Conn) {
	// Check user cap
	// Maybe password
	fmt.Println("User connected to room" + rh.ID)

	cid, _ := uuid.NewUUID()
	conn.WriteMessage(websocket.TextMessage, []byte("cid="+cid.String()))
	client := &Client{Connection: conn, ID: cid.String()}

	if len(rh.Clients) == 0 {
		rh.masterID = cid.String()
	}

	rh.Clients = append(rh.Clients, client)
	go rh.connectionListener(conn)
}

func (rh *RoomHandler) connectionListener(conn *websocket.Conn) {
	for {
		_, data, err := conn.ReadMessage()
		if _, ok := err.(*websocket.CloseError); ok {
			fmt.Println("lost connection to user: " + conn.RemoteAddr().String())
			return
		} else if err != nil {
			log.Println("[WARN] Couldn't read message from ws-client: " + err.Error())
			continue
		}

		var fdata FrameData
		err = json.Unmarshal(data, &fdata)
		if fdata.ClientID == rh.masterID {
			rh.WheelRotation, _ = strconv.ParseFloat(fdata.Rotation, 64)
			rh.WheelSpeed, _ = strconv.ParseFloat(fdata.Speed, 64)
			rh.MasterMouseX, _ = strconv.ParseFloat(fdata.MouseX, 64)
			rh.MasterMouseY, _ = strconv.ParseFloat(fdata.MouseY, 64)

			rh.sendFrameDataToUsers()
		}
	}
}

func (rh *RoomHandler) sendFrameDataToUsers() {
	for _, c := range rh.Clients {
		if c.ID != rh.masterID {
			fd := FrameData{
				Rotation: strconv.FormatFloat(rh.WheelRotation, 'f', 8, 64),
				Speed:    strconv.FormatFloat(rh.WheelSpeed, 'f', 8, 64),
				MouseX:   strconv.FormatFloat(rh.MasterMouseX, 'f', 8, 64),
				MouseY:   strconv.FormatFloat(rh.MasterMouseY, 'f', 8, 64),
			}
			c.Connection.WriteJSON(fd)
		}
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

type Client struct {
	Connection *websocket.Conn
	ID         string
}

type FrameData struct {
	ClientID string `json:"clientID"`
	MouseX   string `json:"mouseX"`
	MouseY   string `json:"mouseY"`
	Rotation string `json:"rot"`
	Speed    string `json:"vel"`
}
