package models

import (
	"gorm.io/gorm"

	"gorm.io/datatypes"
)

type Hotel struct {
	gorm.Model
	Name        string
	Description string
	Rating      uint
	Address     string

	CityID uint
	City   City

	Reviews []HotelReview
	Images  datatypes.JSON

	Capacity   uint
	Available  uint
	Facilities datatypes.JSON

	RoomTypes []RoomType `gorm:"many2many:hotel_roomtypes;"`
}
