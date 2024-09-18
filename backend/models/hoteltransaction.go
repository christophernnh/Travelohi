package models

import (
	"time"

	"gorm.io/gorm"
)

type HotelTransaction struct {
	gorm.Model
	UserID uint
	IsPaid bool
	OrderDate time.Time

	HotelID string
	RoomTypeID string
	CheckInDate time.Time
	CheckOutDate time.Time

	PaymentMethod string

}
