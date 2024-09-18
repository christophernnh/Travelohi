package controllers

import (
	"fmt"
	"log"
	"sort"
	"strconv"
	"time"

	"github.com/christophernnh/TPA_web/database"
	"github.com/christophernnh/TPA_web/models"
	"github.com/gofiber/fiber/v2"
)

func GetAirlines(c *fiber.Ctx) error {
	var airlines []models.Airline

	database.DB.Find(&airlines)

	if len(airlines) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no airlines found",
		})
	}

	response := make([]map[string]interface{}, len(airlines))
	for i, airline := range airlines {
		response[i] = map[string]interface{}{
			"id":   airline.ID,
			"name": airline.Name,
			"logo": airline.Emblem,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"airline": response,
	})
}

func GetAirplanes(c *fiber.Ctx) error {
	var airplanes []models.Airplane

	database.DB.Find(&airplanes)

	if len(airplanes) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no airplanes found",
		})
	}

	response := make([]map[string]interface{}, len(airplanes))
	for i, airplane := range airplanes {
		response[i] = map[string]interface{}{
			"id":            airplane.ID,
			"name":          airplane.Name,
			"economyseats":  airplane.Economy,
			"businessseats": airplane.Business,
			"firstseats":    airplane.First,
		}
	}

	return c.JSON(fiber.Map{
		"message":  "success",
		"airplane": response,
	})
}

func CreateFlight(c *fiber.Ctx) error {

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	airlineid, err := strconv.ParseUint(data["airlineid"], 10, 32)
	if err != nil {
		log.Println("Error parsing cityID:", err)
		return err
	}
	airlineiduint := uint(airlineid)

	toid, err := strconv.ParseUint(data["toid"], 10, 32)
	if err != nil {
		log.Println("Error parsing cityID:", err)
		return err
	}
	toiduint := uint(toid)

	fromid, err := strconv.ParseUint(data["fromid"], 10, 32)
	if err != nil {
		log.Println("Error parsing cityID:", err)
		return err
	}
	fromiduint := uint(fromid)

	DepartureTime, err := time.Parse(time.RFC3339, data["departuretime"])
	if err != nil {
		log.Println("Error parsing ValidFrom:", err)
		return err
	}
	ArrivalTime, err := time.Parse(time.RFC3339, data["arrivaltime"])
	if err != nil {
		log.Println("Error parsing ValidFrom:", err)
		return err
	}

	isTransitBool, err := strconv.ParseBool(data["istransit"])
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid value for issubscribed",
		})
	}

	airplaneid, err := strconv.ParseUint(data["airplaneid"], 10, 32)
	if err != nil {
		log.Println("Error parsing airplaneID:", err)
		return err
	}
	airplaneiduint := uint(airplaneid)

	var flight = models.Flight{
		FlightID:      data["flightid"],
		AirlineID:     airlineiduint,
		ToID:          toiduint,
		FromID:        fromiduint,
		DepartureTime: DepartureTime,
		ArrivalTime:   ArrivalTime,
		IsTransit:     isTransitBool,
		AirplaneID:    airplaneiduint,
	}

	if err := database.DB.Create(&flight).Error; err != nil {
		log.Println("Error creating flight:", err)
		return err
	}

	var airplane models.Airplane
	if err := database.DB.Table("airplanes").
		Where("airplanes.id = ?", airplaneiduint).
		Find(&airplane).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (airplanes)",
		})
	}

	createSeatsForClass("economy", airplane.Economy, data["flightid"])
	createSeatsForClass("business", airplane.Business, data["flightid"])
	createSeatsForClass("first", airplane.First, data["flightid"])

	return c.JSON(flight)
}

func createSeatsForClass(class string, numSeats uint, flightID string) {
	for i := 1; i <= int(numSeats); i++ {
		seatID := fmt.Sprintf("%s-%d", class, i)

		seat := models.Seat{
			SeatID:      seatID,
			FlightID:    flightID,
			Taken:       false,
			Class:       class,
			PassengerID: 0,
		}

		if err := database.DB.Create(&seat).Error; err != nil {
			log.Printf("Error creating seat for class %s: %v\n", class, err)
		}
	}
}

func GetAirports(c *fiber.Ctx) error {
	var airports []models.Airport

	if err := database.DB.Table("airports").
		Joins("join cities on airports.city_id = cities.id").
		Joins("join countries on cities.country_id = countries.id").
		Preload("City").
		Preload("City.Country").
		Find(&airports).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (airports)",
		})
	}

	if len(airports) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no airports found",
		})
	}

	response := make([]map[string]interface{}, len(airports))
	for i, airport := range airports {
		response[i] = map[string]interface{}{
			"id":      airport.ID,
			"name":    airport.Name,
			"code":    airport.Code,
			"city":    airport.City.Name,
			"country": airport.City.Country.Name,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"airport": response,
	})
}

func GetFlights(c *fiber.Ctx) error {
	var flights []models.Flight

	database.DB.Find(&flights)

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
			"id":              flight.ID,
			"flightid":        flight.FlightID,
			"airlinelogo":     airline.Emblem,
			"toairportcode":   toairport.Code,
			"fromairportcode": fromairport.Code,
			"tocity":          toairport.City.Name,
			"tocountry":       toairport.City.Country.Name,
			"fromcity":        fromairport.City.Name,
			"fromcountry":     fromairport.City.Country.Name,
			"departuretime":   flight.DepartureTime,
			"arrivaltime":     flight.ArrivalTime,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"flights": response,
	})
}
func GetFlightDetail(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var flight models.Flight

	if err := database.DB.Table("flights").
		Where("flights.flight_id = ?", data["flightid"]).
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

	var airline models.Airline
	var fromairport models.Airport
	var toairport models.Airport

	// Getting airline details
	if err := database.DB.Table("airlines").
		Where("airlines.id = ?", flight.AirlineID).
		Find(&airline).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch airline",
		})
	}

	// Getting to and from airport details
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

	response := map[string]interface{}{
		"id":              flight.ID,
		"flightid":        flight.FlightID,
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
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"flight":  response,
	})
}

func GetSeats(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var seats []models.Seat

	if err := database.DB.Table("seats").
		Where("seats.flight_id = ?", data["flightid"]).
		Find(&seats).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch seats",
		})
	}

	if len(seats) == 0 {
		c.Status(fiber.StatusNotFound)
		fmt.Println("Flight not found")
		return c.JSON(fiber.Map{
			"message": "Flight not found",
		})
	}

	sort.Slice(seats, func(i, j int) bool {
		return seats[i].ID < seats[j].ID
	})

	response := make([]map[string]interface{}, len(seats))
	for i, seat := range seats {
		response[i] = map[string]interface{}{
			"id":          seat.ID,
			"seatid":      seat.SeatID,
			"flightid":    seat.FlightID,
			"taken":       seat.Taken,
			"class":       seat.Class,
			"passengerid": seat.PassengerID,
		}
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"seats":   response,
	})
}
