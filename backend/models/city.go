package models

import "gorm.io/gorm"

type City struct {
	gorm.Model
	CountryID uint   `gorm:"not null"`
	Name      string `gorm:"type:varchar(100);not null"`
	LT        string `gorm:"type:varchar(50);not null"`
	Country   Country
}
