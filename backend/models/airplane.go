package models

import "gorm.io/gorm"

type Airplane struct {
	gorm.Model
	Name string
	Economy uint
	Business uint
	First uint
}