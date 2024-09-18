package models

import (
	"time"

	"gorm.io/gorm"
)

type Promo struct {
	gorm.Model
	PromoCode string
	Discount float32
	Description string
	ValidFrom time.Time
	ValidUntil time.Time
	Image string
	PromoType string

}