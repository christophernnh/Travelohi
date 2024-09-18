package database

import (
	// "github.com/christophernnh/TPA_web/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := "host=localhost user=postgres password=030504 dbname=TPA-web port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Could not connect to database: " + err.Error())
	}

	DB = db

	//users & admins
	// if err := db.AutoMigrate(&models.User{}); err != nil {
	// 	panic("Auto-migration failed: " + err.Error())
	// }
	// if err := db.AutoMigrate(&models.Admin{}); err != nil {
	// 	panic("Auto-migration failed: " + err.Error())
	// }

	// //Promos
	// if err := db.AutoMigrate(&models.Promo{}); err != nil {
	// 	panic("Auto-migration failed: " + err.Error())
	// }

	//City & country models
	// if err := db.AutoMigrate(&models.Country{}); err != nil {
	// 	panic("Auto-migration failed: " + err.Error())
	// }
	// if err := db.Migrator().CreateTable(&models.City{}); err != nil {
	// 	panic("Auto-migration failed: " + err.Error())
	// }

	//Airport models
	// if err := db.Migrator().CreateTable(&models.Airport{}); err != nil {
	// 	panic("Auto-migration failed: " + err.Error())
	// }

	// if err := db.Migrator().CreateTable(&models.HotelReview{}); err != nil {
	// 	panic("Auto-migration failed: " + err.Error())
	// }
	// if err := db.Migrator().CreateTable(&models.RoomType{}); err != nil {
	// 	panic("Auto-migration failed: " + err.Error())
	// }
	// if err := db.Migrator().CreateTable(&models.Hotel{}); err != nil {
	// 	panic("Auto-migration failed: " + err.Error())
	// }


	// Seeding()
}
