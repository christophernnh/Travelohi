package models

import (

	"gorm.io/gorm"
)

type Seat struct {
	gorm.Model
	SeatID string
	FlightID string
	Taken bool
	Class string
	PassengerID uint
}
