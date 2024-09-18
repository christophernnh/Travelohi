package models

import (
	"time"

	"gorm.io/gorm"
)

type Flight struct {
	gorm.Model
	FlightID      string
	AirlineID     uint

	ToID          uint
	FromID        uint
	DepartureTime time.Time
	ArrivalTime   time.Time
	IsTransit     bool

	AirplaneID uint

	Price float32
}
