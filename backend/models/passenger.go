package models

import (
	"time"

	"gorm.io/gorm"
)

type Passenger struct {
	gorm.Model
	FirstName      string
	LastName       string
	PassportNumber string
	DateOfBirth    time.Time
}
