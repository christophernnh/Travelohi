package models

import "gorm.io/gorm"

type Country struct {
	gorm.Model
	Name   string `gorm:"type:varchar(100);not null"`
	Cities []City
}
