package roomHandler

import (
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Client struct {
	connection     *websocket.Conn
	isConnected    bool
	ID             string
	MessageHandler func(c *Client, data []byte)
}

func NewClient(conn *websocket.Conn) *Client {
	client := &Client{}
	client.connection = conn
	client.isConnected = true

	client.ID = uuid.New().String()

	go client.listen()

	return client
}

func (c *Client) SendMsg(msgType int, data []byte) {
	c.connection.WriteMessage(msgType, data)
}

func (c *Client) IsConnected() bool {
	return c.isConnected
}

func (c *Client) Disconnect(status int) {
	c.isConnected = false
	c.connection.CloseHandler()(status, "")
	c.connection.Close()
}

func (c *Client) Reconnect(conn *websocket.Conn) {
	c.Disconnect(4002)
	c.connection = conn
	c.isConnected = true
	go c.listen()
}

func (c *Client) listen() {
	var data []byte
	var err error

	for {
		_, data, err = c.connection.ReadMessage()
		if err != nil {
			break
		}

		if c.MessageHandler != nil {
			c.MessageHandler(c, data)
		}
	}

	c.isConnected = false
}
