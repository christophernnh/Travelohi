package controllers

import (
	// "fmt"
	// "log"
	// "strconv"
	// "time"

	// "fmt"

	"bytes"
	"fmt"
	"html/template"
	"log"
	"strconv"
	"time"

	"github.com/christophernnh/TPA_web/database"
	"github.com/christophernnh/TPA_web/models"
	"github.com/go-gomail/gomail"
	"github.com/gofiber/fiber/v2"
)

// @Summary Get hotel transactions for a user
// @Description Get hotel transactions based on user ID
// @Tags HotelTransactions
// @Accept json
// @Produce json
// @Param userId body string true "User ID"
// @Success 200 {object} HotelTransactionResponse
// @Router /api/gethoteltransactions [post]
func GetHotelTransactions(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error")
		return err
	}
	var hoteltransactions []models.HotelTransaction

	if err := database.DB.Table("hotel_transactions").
		Where("hotel_transactions.user_id = ?", data["userId"]).
		Find(&hoteltransactions).Error; err != nil {

		fmt.Println("Error querying hotel transactions:", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch hotel Transaction",
		})
	}

	if len(hoteltransactions) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no hotel transactions found",
		})
	}

	response := make([]map[string]interface{}, len(hoteltransactions))
	for i, hoteltransaction := range hoteltransactions {
		var hotel models.Hotel
		var roomtype models.RoomType

		// getting hotel details
		if err := database.DB.Table("hotels").
			Joins("join cities on hotels.city_id = cities.id").
			Joins("join countries on cities.country_id = countries.id").
			Where("hotels.id = ?", hoteltransaction.HotelID).
			Preload("City").
			Preload("City.Country").
			Find(&hotel).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed to fetch hotel",
			})
		}
		//getting rooms
		if err := database.DB.Table("room_types").
			Where("hotel_id = ? AND room_types.id = ?", hoteltransaction.HotelID, hoteltransaction.RoomTypeID).
			Find(&roomtype).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed to fetch (rooms)",
			})
		}

		response[i] = map[string]interface{}{
			"id":           hoteltransaction.ID,
			"hotelid":      hoteltransaction.HotelID,
			"roomtypeid":   hoteltransaction.RoomTypeID,
			"checkindate":  hoteltransaction.CheckInDate,
			"checkoutdate": hoteltransaction.CheckOutDate,

			"ispaid":        hoteltransaction.IsPaid,
			"orderdate":     hoteltransaction.OrderDate,
			"paymentmethod": hoteltransaction.PaymentMethod,

			// hotel details
			"name":    hotel.Name,
			"city":    hotel.City.Name,
			"country": hotel.City.Country.Name,
			"address": hotel.Address,

			// room details
			"roomname": roomtype.Name,
			"price":    roomtype.Price,
		}
	}

	return c.JSON(fiber.Map{
		"message":           "success",
		"hoteltransactions": response,
	})
}

type HotelTransactionResponse struct {
    // in: body
    Body struct {
        Message string `json:"message"`
        // HotelTransactions is a list of hotel transaction details.
        HotelTransactions []HotelTransactionDetails `json:"hoteltransactions"`
    } `json:"body"`
}

// HotelTransactionDetails represents details of a hotel transaction.
type HotelTransactionDetails struct {
    ID           uint    `json:"id"`
    HotelID      string  `json:"hotelid"`
    RoomTypeID   string  `json:"roomtypeid"`
    CheckInDate  string  `json:"checkindate"`
    CheckoutDate string  `json:"checkoutdate"`
    IsPaid       bool    `json:"ispaid"`
    OrderDate    string  `json:"orderdate"`
    PaymentMethod string `json:"paymentmethod"`
    Name         string  `json:"name"`
    City         string  `json:"city"`
    Country      string  `json:"country"`
    Address      string  `json:"address"`
    RoomName     string  `json:"roomname"`
    Price        float64 `json:"price"`
}


func HotelAddToCart(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing JSON",
		})
	}

	checkindate, err := time.Parse(time.RFC3339, data["checkindate"])
	if err != nil {
		fmt.Println("Error parsing checkindate: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing checkindate",
		})
	}

	checkoutdate, err := time.Parse(time.RFC3339, data["checkoutdate"])
	if err != nil {
		fmt.Println("Error parsing checkoutdate: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing checkoutdate",
		})
	}
	if !checkindate.Before(checkoutdate) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Check-in date must be earlier than check-out date",
		})
	}

	now := time.Now().UTC()

	if checkindate.Before(now) || checkoutdate.Before(now) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Check-in and check-out dates must be in the future",
		})
	}

	uid, err := strconv.Atoi(data["userid"])
	if err != nil {
		fmt.Println("Error converting userid to int: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error converting userid to int",
		})
	}

	var hoteltransaction = models.HotelTransaction{
		UserID:       uint(uid),
		IsPaid:       false,
		HotelID:      data["hotelid"],
		RoomTypeID:   data["roomtypeid"],
		CheckInDate:  checkindate,
		CheckOutDate: checkoutdate,
	}

	if err := database.DB.Create(&hoteltransaction).Error; err != nil {
		fmt.Println("Error creating hotel transaction: ", err)
		return err
	}

	return c.JSON(hoteltransaction)
}


func UpdateHotelCartDate(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing JSON",
		})
	}

	var hoteltransaction models.HotelTransaction

	database.DB.Where("id = ?", data["id"]).First(&hoteltransaction)

	if hoteltransaction.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "promo not found",
		})
	}

	var checkindate, checkoutdate time.Time
	var err error

	if data["checkindate"] != "" {
		checkindate, err = time.Parse(time.RFC3339, data["checkindate"])
		if err != nil {
			fmt.Println("Error parsing checkindate: ", err)
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Error parsing checkindate",
			})
		}
	}

	if data["checkoutdate"] != "" {
		checkoutdate, err = time.Parse(time.RFC3339, data["checkoutdate"])
		if err != nil {
			fmt.Println("Error parsing checkoutdate: ", err)
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Error parsing checkoutdate",
			})
		}
	}

	// validasi checkin < checkout
	if !checkindate.Before(checkoutdate) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Check-in date must be earlier than check-out date",
		})
	}

	now := time.Now().UTC()

	if checkindate.Before(now) || checkoutdate.Before(now) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Check-in and check-out dates must be in the future",
		})
	}

	tx := database.DB.Begin()
	if data["checkindate"] != "" {
		tx.Model(&hoteltransaction).UpdateColumn("check_in_date", checkindate)
	}

	if data["checkoutdate"] != "" {
		tx.Model(&hoteltransaction).UpdateColumn("check_out_date", checkoutdate)
	}

	if err := tx.Commit().Error; err != nil {
		log.Println("Error updating hotel date:", err)
		return err
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func GetWalletBalance(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing JSON",
		})
	}

	var wallet models.Wallet
	database.DB.Where("user_id = ?", data["uid"]).First(&wallet)

	if wallet.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "wallet not found",
		})
	}

	response := map[string]interface{}{
		"id":      wallet.ID,
		"balance": wallet.Balance,
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"wallet":  response,
	})
}


func DeductWalletBalance(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing JSON",
		})
	}

	var wallet models.Wallet
	database.DB.Where("user_id = ?", data["uid"]).First(&wallet)

	if wallet.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "wallet not found",
		})
	}

	balance, err := strconv.ParseFloat(data["balance"], 32)
	if err != nil {
		log.Println("Error parsing discount:", err)
		return err
	}

	tx := database.DB.Begin()
	tx.Model(&wallet).UpdateColumn("balance", balance)

	if err := tx.Commit().Error; err != nil {
		log.Println("Error updating balance:", err)
		return err
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}


func BuyHotels(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing JSON",
		})
	}

	var hoteltransactions []models.HotelTransaction

	if err := database.DB.Table("hotel_transactions").
		Where("user_id = ?", data["userId"]).
		Find(&hoteltransactions).Error; err != nil {

		fmt.Println("Error querying hotel transactions:", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch hotel Transactions",
		})
	}

	tx := database.DB.Begin()
	for _, hoteltransaction := range hoteltransactions {
		if !hoteltransaction.IsPaid {
			tx.Model(&hoteltransaction).Update("is_paid", true)
			tx.Model(&hoteltransaction).Update("order_date", time.Now())
		}
	}

	if err := tx.Commit().Error; err != nil {
		fmt.Println("Error updating hotel transactions to paid:", err)
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Failed to update hotel transactions to paid",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}


func SendReceipt(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return c.JSON(fiber.Map{
			"error": err,
		})
	}

	fmt.Println(data["email"])
	fmt.Println(data["grandtotal"])

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "user not found",
		})
	}

	grandtotal := data["grandtotal"]

	templatePath := "./controllers/template/receipt-template.html"

	var body bytes.Buffer
	t, err := template.ParseFiles(templatePath)

	if err != nil {
		fmt.Println(err)
		return c.JSON(fiber.Map{
			"error": err,
		})
	}

	err = t.Execute(&body, struct{ OTP string }{OTP: grandtotal})
	if err != nil {
		fmt.Println("Error executing HTML template:", err)
		return c.JSON(fiber.Map{
			"error": err,
		})
	}

	m := gomail.NewMessage()
	m.SetHeader("From", "hchrisnath@gmail.com")
	m.SetHeader("To", data["email"])
	m.SetHeader("Subject", "Transaction Receipt")
	m.SetBody("text/html", body.String())

	d := gomail.NewDialer("smtp.gmail.com", 587, "hchrisnath@gmail.com", "azjikqjtwarzothv")

	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}

	return c.JSON(fiber.Map{
		"message": "Succesfully sent receipt",
	})
}


func FlightAddToCart(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing JSON",
		})
	}

	uid, err := strconv.Atoi(data["userid"])
	if err != nil {
		fmt.Println("Error converting userid to int: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error converting userid to int",
		})
	}

	luggage, err := strconv.Atoi(data["luggage"])
	if err != nil {
		fmt.Println("Error converting luggage to int: ", err)
		luggage = 0
	}

	var seat models.Seat

	database.DB.Where("seat_id = ? AND flight_id = ?", data["seatid"], data["flightid"]).First(&seat)

	if seat.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "seat not found",
		})
	}

	// filling in seat
	// tx := database.DB.Begin()

	// tx.Model(&seat).UpdateColumn("passenger_id", uid)
	// tx.Model(&seat).UpdateColumn("taken", true)

	// if err := tx.Commit().Error; err != nil {
	// 	log.Println("Error updating selected seat:", err)
	// 	return err
	// }

	// inserting new flight
	var flighttransaction = models.FlightTransaction{
		UserID: uint(uid),
		IsPaid: false,

		FlightID: data["flightid"],
		SeatID:   data["seatid"],
		Luggage:  uint(luggage),
	}

	if err := database.DB.Create(&flighttransaction).Error; err != nil {
		fmt.Println("Error creating flight transaction: ", err)
		return err
	}

	return c.JSON(flighttransaction)
}


func GetFlightTransactions(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error")
		return err
	}
	var flighttransactions []models.FlightTransaction

	if err := database.DB.Table("flight_transactions").
		Where("flight_transactions.user_id = ?", data["userId"]).
		Find(&flighttransactions).Error; err != nil {

		fmt.Println("Error querying flight transactions:", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch hotel Transaction",
		})
	}

	if len(flighttransactions) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no flight transactions found",
		})
	}

	response := make([]map[string]interface{}, len(flighttransactions))
	for i, flightransaction := range flighttransactions {
		var flight models.Flight
		var airline models.Airline
		var fromairport models.Airport
		var toairport models.Airport

		if err := database.DB.Table("flights").
			Where("flights.flight_id = ?", flightransaction.FlightID).
			Find(&flight).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed to fetch flight",
			})
		}

		if flight.ID == 0 {
			c.Status(fiber.StatusNotFound)
			fmt.Println("Flight not found")
			return c.JSON(fiber.Map{
				"message": "Flight not found",
			})
		}
		if err := database.DB.Table("airlines").
			Where("airlines.id = ?", flight.AirlineID).
			Find(&airline).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed to fetch airline",
			})
		}

		// From
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

		// To
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
			// flight details
			// "id":              flight.ID,
			"airlinelogo":     airline.Emblem,
			"airlinename":     airline.Name,
			"toairportcode":   toairport.Code,
			"fromairportcode": fromairport.Code,
			"tocity":          toairport.City.Name,
			"tocountry":       toairport.City.Country.Name,
			"fromcity":        fromairport.City.Name,
			"fromcountry":     fromairport.City.Country.Name,
			"departuretime":   flight.DepartureTime,
			"arrivaltime":     flight.ArrivalTime,
			"istransit":       flight.IsTransit,

			"flightid":      flight.FlightID,
			"luggage":       flightransaction.Luggage,
			"seatid":        flightransaction.SeatID,
			"ispaid":        flightransaction.IsPaid,
			"orderdate":     flightransaction.OrderDate,
			"paymentmethod": flightransaction.PaymentMethod,
		}
	}

	return c.JSON(fiber.Map{
		"message":            "success",
		"flighttransactions": response,
	})
}

func BookSeat(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing JSON",
		})
	}

	var flighttransactions []models.FlightTransaction

	if err := database.DB.Table("flight_transactions").
		Where("user_id = ?", data["userId"]).
		Find(&flighttransactions).Error; err != nil {

		fmt.Println("Error querying flight transactions:", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch flight Transactions",
		})
	}

	tx := database.DB.Begin()
	for _, flighttransaction := range flighttransactions {
		if !flighttransaction.IsPaid {
			tx.Model(&flighttransaction).Update("is_paid", true)
			tx.Model(&flighttransaction).Update("order_date", time.Now())
		}
		var seat models.Seat
		database.DB.Where("seat_id = ? AND flight_id = ?", flighttransaction.SeatID, flighttransaction.FlightID).First(&seat)
		if seat.ID == 0 {
			c.Status(fiber.StatusNotFound)
			return c.JSON(fiber.Map{
				"message": "seat not found",
			})
		}
		tx.Model(&seat).UpdateColumn("passenger_id", data["userId"])
		tx.Model(&seat).UpdateColumn("taken", true)
	}

	if err := tx.Commit().Error; err != nil {
		fmt.Println("Error updating flight transactions to paid:", err)
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Failed to update flight transactions to paid",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
