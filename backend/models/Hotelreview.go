package models

import "gorm.io/gorm"

type HotelReview struct {
	gorm.Model
	HotelID     uint
	UserID      uint
	User        User `gorm:"foreignKey:ID"`
	Rating      float32
	Description string
	Anonymous   bool
}
