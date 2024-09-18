package controllers

import (
	// "errors"
	"encoding/json"
	"errors"
	"html/template"
	"io/ioutil"
	"log"
	"time"

	// "regexp"

	// "regexp"

	"strconv"
	// "time"

	"github.com/christophernnh/TPA_web/database"
	"github.com/christophernnh/TPA_web/models"
	"gorm.io/gorm"

	// "github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	// "golang.org/x/crypto/bcrypt"
	// "gorm.io/gorm"

	// "github.com/google/uuid"
	"bytes"
	"fmt"

	// "math/rand"

	"github.com/go-gomail/gomail"
)

func GetUsers(c *fiber.Ctx) error {
	var users []models.User

	database.DB.Find(&users)

	if len(users) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no users found",
		})
	}

	response := make([]map[string]interface{}, len(users))
	for i, user := range users {
		response[i] = map[string]interface{}{
			"id":        user.ID,
			"firstname": user.FirstName,
			"lastname":  user.LastName,
			"email":     user.Email,
			// "password":         user.Password,
			"birthDate":        user.DateOfBirth,
			"otp":              user.OTP,
			"securityQuestion": user.SecurityQuestion,
			"securityAnswer":   user.SecurityAnswer,
			"gender":           user.Gender,
			"isbanned":         user.IsBanned,
			"issubscribed":     user.IsSubscribed,
			"profilepicture":   user.ProfileImage,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"users":   response,
	})
}

func AdminUpdateUser(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	var user models.User

	database.DB.Where("id = ?", data["id"]).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "user not found",
		})
	}

	isSubscribed, err := strconv.ParseBool(data["issubscribed"])
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid value for issubscribed",
		})
	}

	isBanned, err := strconv.ParseBool(data["isbanned"])
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid value for isbanned",
		})
	}

	tx := database.DB.Begin()

	tx.Model(&user).UpdateColumn("is_subscribed", isSubscribed)
	tx.Model(&user).UpdateColumn("is_banned", isBanned)

	if err := tx.Commit().Error; err != nil {
		log.Println("Error updating user:", err)
		return err
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func SendNewsletter(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing or invalid file in the request",
		})
	}

	fileContent, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error opening the uploaded file",
		})
	}
	defer fileContent.Close()

	htmlContent, err := ioutil.ReadAll(fileContent)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error reading HTML content from the file",
		})
	}

	template, err := template.New("newsletter").Parse(string(htmlContent))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error parsing HTML template",
		})
	}

	var body bytes.Buffer

	err = template.Execute(&body, nil)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error executing HTML template",
		})
	}

	subscribedUsers := []models.User{}
	database.DB.Find(&subscribedUsers, "is_subscribed = ?", true)

	for _, user := range subscribedUsers {
		m := gomail.NewMessage()
		m.SetHeader("From", "hchrisnath@gmail.com")
		m.SetHeader("To", user.Email)
		m.SetHeader("Subject", "Travelohi Newsletter")
		m.SetBody("text/html", body.String())

		d := gomail.NewDialer("smtp.gmail.com", 587, "hchrisnath@gmail.com", "azjikqjtwarzothv")

		if err := d.DialAndSend(m); err != nil {
			fmt.Println("Error sending email:", err)
		}
	}

	return c.JSON(fiber.Map{
		"message": "Successfully sent newsletters to subscribed users",
	})
}

func GetPromos(c *fiber.Ctx) error {
	var promos []models.Promo

	database.DB.Find(&promos)

	if len(promos) == 0 {
		c.Status(fiber.StatusNotFound)
		fmt.Println("Promos empty")
		return c.JSON(fiber.Map{
			"message": "no users found",
		})
	}

	response := make([]map[string]interface{}, len(promos))
	for i, promos := range promos {
		response[i] = map[string]interface{}{
			"id":          promos.ID,
			"promocode":   promos.PromoCode,
			"discount":    promos.Discount,
			"description": promos.Description,
			"validfrom":   promos.ValidFrom,
			"validuntil":  promos.ValidUntil,
			"image":       promos.Image,
			"promotype":   promos.PromoType,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"promos":  response,
	})
}

func CheckPromo(c *fiber.Ctx)error{
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	var promo models.Promo

	database.DB.Where("promo_code = ?", data["promocode"]).First(&promo)

	if promo.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "promo not found",
		})
	}


	response := map[string]interface{}{
		"id":          promo.ID,
		"promocode":   promo.PromoCode,
		"discount":    promo.Discount,
		"description": promo.Description,
		"validfrom":   promo.ValidFrom,
		"validuntil":  promo.ValidUntil,
		"promotype":   promo.PromoType,
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"promo":  response,
	})
}

func AdminUpdatePromo(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	var promo models.Promo

	database.DB.Where("id = ?", data["id"]).First(&promo)

	if promo.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "promo not found",
		})
	}

	tx := database.DB.Begin()

	discount, err := strconv.ParseFloat(data["discount"], 32)
	if err != nil {
		log.Println("Error parsing discount:", err)
		return err
	}

	validFrom, err := time.Parse(time.RFC3339, data["validfrom"])
	if err != nil {
		log.Println("Error parsing ValidFrom:", err)
		return err
	}

	validUntil, err := time.Parse(time.RFC3339, data["validuntil"])
	if err != nil {
		log.Println("Error parsing ValidUntil:", err)
		return err
	}

	tx.Model(&promo).Updates(models.Promo{
		PromoCode:   data["promocode"],
		Discount:    float32(discount),
		Description: data["promodescription"],
		ValidFrom:   validFrom,
		ValidUntil:  validUntil,
		Image:       data["promoimage"],
		PromoType:   data["promotype"],
	})

	if err := tx.Commit().Error; err != nil {
		log.Println("Error updating promo:", err)
		return err
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func AdminCreatePromo(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	existingPromo := models.Promo{}
	if err := database.DB.Where("promo_code = ?", data["promocode"]).First(&existingPromo).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Promo code already exists",
		})
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	discount, err := strconv.ParseFloat(data["discount"], 32)
	if err != nil {
		log.Println("Error parsing discount:", err)
		return err
	}

	validFrom, err := time.Parse(time.RFC3339, data["validfrom"])
	if err != nil {
		log.Println("Error parsing ValidFrom:", err)
		return err
	}

	validUntil, err := time.Parse(time.RFC3339, data["validuntil"])
	if err != nil {
		log.Println("Error parsing ValidUntil:", err)
		return err
	}

	if validFrom.After(validUntil) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ValidFrom cannot be later than ValidUntil",
		})
	}

	var promo = models.Promo{
		PromoCode:   data["promocode"],
		Discount:    float32(discount),
		Description: data["promodescription"],
		ValidFrom:   validFrom,
		ValidUntil:  validUntil,
		Image:       data["promoimage"],
		PromoType:   data["promotype"],
	}

	if err := database.DB.Create(&promo).Error; err != nil {
		log.Println("Error creating promo:", err)
		return err
	}

	return c.JSON(promo)
}

// SuccessResponseDeletePromo represents a successful API response for the AdminDeletePromo endpoint.
type SuccessResponseDeletePromo struct {
	Message string `json:"message"`
}

// ErrorResponseDeletePromo represents an error API response for the AdminDeletePromo endpoint.
type ErrorResponseDeletePromo struct {
	Error string `json:"error"`
}

// @Summary Delete promo by ID
// @Description Delete a promo based on the given ID.
// @Tags Promo
// @Security ApiKeyAuth
// @Accept json
// @Produce json
// @Param id body string true "Promo ID"
// @Success 200 {object} SuccessResponseDeletePromo
// @Failure 400 {object} ErrorResponseDeletePromo
// @Failure 404 {object} ErrorResponseDeletePromo
// @Failure 500 {object} ErrorResponseDeletePromo
// @Router /api/deletepromo [delete]
func AdminDeletePromo(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	existingPromo := models.Promo{}
	if err := database.DB.Where("id = ?", data["id"]).First(&existingPromo).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Promo doesn't exist",
		})
	}

	// Delete the promo
	if err := database.DB.Delete(&existingPromo).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete promo",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Promo deleted successfully",
	})
}

func GetHotels(c *fiber.Ctx) error {
	var hotels []models.Hotel

	if err := database.DB.Table("hotels").
		Joins("join cities on hotels.city_id = cities.id").
		Joins("join countries on cities.country_id = countries.id").
		// Joins("join room_types on hotels.id = room_types.hotel_id").
		// Joins("join facilities on hotels.id = facilites.hotelid").
		// Where("hotels.name ILIKE ?", search).
		// Or("cities.name ILIKE ?", search).
		// Or("countries.name ILIKE ?", search).
		Preload("City").
		Preload("City.Country").
		Order("hotels.rating asc").
		Find(&hotels).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (hotel)",
		})
	}

	// database.DB.Find(&hotels)

	if len(hotels) == 0 {
		c.Status(fiber.StatusNotFound)
		fmt.Println("Hotels empty")
		return c.JSON(fiber.Map{
			"message": "no hotels found",
		})
	}

	response := make([]map[string]interface{}, len(hotels))
	for i, hotel := range hotels {
		response[i] = map[string]interface{}{
			"id":          hotel.ID,
			"name":        hotel.Name,
			"city":        hotel.City.Name,
			"country":     hotel.City.Country.Name,
			"description": hotel.Description,
			"rating":      hotel.Rating,
			"address":     hotel.Address,
			"images":      hotel.Images,
			"capacity":    hotel.Capacity,
			"available":   hotel.Available,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"hotels":  response,
	})
}

func GetHotelDetail(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var hotel models.Hotel

	if err := database.DB.Table("hotels").
		Joins("join cities on hotels.city_id = cities.id").
		Joins("join countries on cities.country_id = countries.id").
		Where("hotels.id = ?", data["id"]).
		Preload("City").
		Preload("City.Country").
		Find(&hotel).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch hotel",
		})
	}

	if hotel.ID == 0 {
		c.Status(fiber.StatusNotFound)
		fmt.Println("Hotel not found")
		return c.JSON(fiber.Map{
			"message": "Hotel not found",
		})
	}

	response := map[string]interface{}{
		"id":          hotel.ID,
		"name":        hotel.Name,
		"city":        hotel.City.Name,
		"country":     hotel.City.Country.Name,
		"description": hotel.Description,
		"rating":      hotel.Rating,
		"address":     hotel.Address,
		"images":      hotel.Images,
		"capacity":    hotel.Capacity,
		"available":   hotel.Available,
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"hotel":   response,
	})
}

func GetRooms(c *fiber.Ctx) error {
	var roomtypes []models.RoomType
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	if err := database.DB.Table("room_types").
		Where("hotel_id = ?", data["id"]).
		Find(&roomtypes).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (rooms)",
		})
	}
	fmt.Println("here")

	if len(roomtypes) == 0 {
		c.Status(fiber.StatusNotFound)
		fmt.Println("Room Types empty")
		return c.JSON(fiber.Map{
			"message": "no room types found",
		})
	}

	response := make([]map[string]interface{}, len(roomtypes))
	for i, room := range roomtypes {
		response[i] = map[string]interface{}{
			"id":         room.ID,
			"name":       room.Name,
			"hotelid":    room.HotelID,
			"price":      room.Price,
			"facilities": room.Facilities,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"rooms":   response,
	})
}

func GetCities(c *fiber.Ctx) error {
	var cities []models.City

	database.DB.Find(&cities)

	if len(cities) == 0 {
		c.Status(fiber.StatusNotFound)
		fmt.Println("Promos empty")
		return c.JSON(fiber.Map{
			"message": "no hotels found",
		})
	}

	response := make([]map[string]interface{}, len(cities))
	for i, city := range cities {
		response[i] = map[string]interface{}{
			"id":   city.ID,
			"name": city.Name,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"cities":  response,
	})
}

func AdminCreateHotel(c *fiber.Ctx) error {

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	var existingHotel models.Hotel
    if err := database.DB.Where("name = ?", data["name"]).First(&existingHotel).Error; err == nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "message": "Duplicate hotel name",
        })
    }

	imagesJSON, err := json.Marshal(data["images"])
	if err != nil {
		return c.JSON(err)
	}

	cityID, err := strconv.ParseUint(data["cityID"], 10, 32)
	if err != nil {
		log.Println("Error parsing cityID:", err)
		return err
	}
	cityIDuint := uint(cityID)

	capacity, err := strconv.ParseUint(data["capacity"], 10, 32)
	if err != nil {
		log.Println("Error parsing cityID:", err)
		return err
	}
	capacityuint := uint(capacity)

	var hotel = models.Hotel{
		Name:        data["name"],
		Description: data["description"],
		Rating:      0,
		Address:     data["address"],
		CityID:      cityIDuint,
		Images:      imagesJSON,
		Capacity:    capacityuint,
		Available:   capacityuint,
	}

	if err := database.DB.Create(&hotel).Error; err != nil {
		log.Println("Error creating hotel:", err)
		return err
	}

	return c.JSON(hotel)

}

func AdminCreateRoom(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	hotelID, err := strconv.ParseUint(data["hotelid"], 10, 32)
	if err != nil {
		log.Println("Error parsing hotelid:", err)
		return err
	}
	hotelIDuint := uint(hotelID)

	price, err := strconv.ParseFloat(data["price"], 32)
	if err != nil {
		log.Println("Error parsing price:", err)
		return err
	}

	facilitesJSON, err := json.Marshal(data["facilities"])
	if err != nil {
		return c.JSON(err)
	}

	var roomtype = models.RoomType{
		HotelID:    hotelIDuint,
		Name:       data["name"],
		Facilities: facilitesJSON,
		Price:      float32(price),
	}

	if err := database.DB.Create(&roomtype).Error; err != nil {
		log.Println("Error creating promo:", err)
		return err
	}

	return c.JSON(roomtype)
}

func Search(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}


	var hotels []models.Hotel

	if err := database.DB.Table("hotels").
		Joins("join cities on hotels.city_id = cities.id").
		Joins("join countries on cities.country_id = countries.id").
		Where("hotels.name ILIKE ?", "%"+data["input"]+"%").
		Or("cities.name ILIKE ?", "%"+data["input"]+"%").
		Or("countries.name ILIKE ?", "%"+data["input"]+"%").
		Preload("City").
		Preload("City.Country").
		Find(&hotels).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (hotel)",
		})
	}

	if len(hotels) == 0 {
		c.Status(fiber.StatusNotFound)
		fmt.Println("Hotels empty")
		return c.JSON(fiber.Map{
			"message": "no hotels found",
		})
	}

	response := make([]map[string]interface{}, len(hotels))
	for i, hotel := range hotels {
		response[i] = map[string]interface{}{
			"id":          hotel.ID,
			"name":        hotel.Name,
			"city":        hotel.City.Name,
			"country":     hotel.City.Country.Name,
			"description": hotel.Description,
			"rating":      hotel.Rating,
			"address":     hotel.Address,
			"images":      hotel.Images,
			"capacity":    hotel.Capacity,
			"available":   hotel.Available,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"hotels":  response,
	})
}

func LocationResults(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	var hotels []models.Hotel

	if err := database.DB.Table("hotels").
		Joins("join cities on hotels.city_id = cities.id").
		Joins("join countries on cities.country_id = countries.id").
		Where("countries.ID = ?", data["countryId"]).
		Preload("City").
		Preload("City.Country").
		Find(&hotels).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (hotel)",
		})
	}

	if len(hotels) == 0 {
		c.Status(fiber.StatusNotFound)
		fmt.Println("Hotels empty")
		return c.JSON(fiber.Map{
			"message": "no hotels found",
		})
	}

	response := make([]map[string]interface{}, len(hotels))
	for i, hotel := range hotels {
		response[i] = map[string]interface{}{
			"id":          hotel.ID,
			"name":        hotel.Name,
			"city":        hotel.City.Name,
			"country":     hotel.City.Country.Name,
			"description": hotel.Description,
			"rating":      hotel.Rating,
			"address":     hotel.Address,
			"images":      hotel.Images,
			"capacity":    hotel.Capacity,
			"available":   hotel.Available,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"hotels":  response,
	})
}

func LocationResultsFlight(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	var flights []models.Flight

	database.DB.Find(&flights)
	if err := database.DB.Table("flights").
	Where("flights.from_id = ?", data["countryId"]).
	Or("flights.to_id = ?", data["countryId"]).
	Find(&flights).Error; err != nil {
	c.Status(fiber.StatusBadRequest)
	return c.JSON(fiber.Map{
		"message": "Failed to fetch (flights)",
	})
}

	if len(flights) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no flights found",
		})
	}

	response := make([]map[string]interface{}, len(flights))
	for i, flight := range flights {
		var airline models.Airline
		var fromairport models.Airport
		var toairport models.Airport

		//getting airline details
		if err := database.DB.Table("airlines").
			Where("airlines.id = ?", flight.AirlineID).
			Find(&airline).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed to fetch airline",
			})
		}
		//getting to and from airport details
		// from
		if err := database.DB.Table("airports").
			Joins("join cities on airports.city_id = cities.id").
			Joins("join countries on cities.country_id = countries.id").
			Preload("City").
			Preload("City.Country").
			Where("airports.id = ?", flight.FromID).
			Find(&fromairport).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed to fetch from airport",
			})
		}
		// to
		if err := database.DB.Table("airports").
			Joins("join cities on airports.city_id = cities.id").
			Joins("join countries on cities.country_id = countries.id").
			Preload("City").
			Preload("City.Country").
			Where("airports.id = ?", flight.ToID).
			Find(&toairport).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed to fetch to airport",
			})
		}
		response[i] = map[string]interface{}{
			"id":          flight.ID,
			"flightid":    flight.FlightID,
			"airlinelogo": airline.Emblem,
			"toairportcode": toairport.Code,
			"fromairportcode": fromairport.Code,
			"tocity": toairport.City.Name,
			"tocountry": toairport.City.Country.Name,
			"fromcity": fromairport.City.Name, 
			"fromcountry": fromairport.City.Country.Name, 
			"departuretime": flight.DepartureTime,
			"arrivaltime": flight.ArrivalTime,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"flights": response,
	})
}

