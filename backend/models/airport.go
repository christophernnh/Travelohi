package models

import "gorm.io/gorm"

type Airport struct {
	gorm.Model
	CityID uint   `gorm:"not null"`
	Name   string `gorm:"type:varchar(100);not null"`
	Code   string `gorm:"type:char(3);not null;unique"`
	City   City   `gorm:"foreignKey:CityID"`
   }
