package roomHandler

type RoomData struct {
	Clients int `json:"clients"`

	Title   string   `json:"title"`
	Options []string `json:"options"`

	WheelRotation      float64 `json:"wheelRot"`
	WheelSpeed         float64 `json:"wheelVel"`
	MasterMouseX       float64 `json:"masterMouseX"`
	MasterMouseY       float64 `json:"masterMouseY"`
	MasterMousePressed bool    `json:"masterMousePressed"`
}

/*func (rd RoomData) Changes(new RoomData) RoomData {
	dif := RoomData{}

	jsonA, _ := json.Mar

	return dif
}*/
