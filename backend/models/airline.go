package models

import (
	"gorm.io/gorm"
)

type Airline struct{
	gorm.Model
	Name string
	Emblem string
}