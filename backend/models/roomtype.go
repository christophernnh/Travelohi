package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type RoomType struct {
	gorm.Model

	HotelID    uint
	Name       string
	Facilities datatypes.JSON
	Price      float32
}
