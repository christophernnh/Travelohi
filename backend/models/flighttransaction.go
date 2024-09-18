package models

import (
	"time"

	"gorm.io/gorm"
)

type FlightTransaction struct {
	gorm.Model
	UserID    uint
	IsPaid    bool
	OrderDate time.Time

	FlightID string
	SeatID   string
	Luggage  uint

	PaymentMethod string
}
