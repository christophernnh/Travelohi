package controllers

import (
	"fmt"
	// "log"
	// "strconv"
	// "time"

	"github.com/christophernnh/TPA_web/database"
	"github.com/christophernnh/TPA_web/models"
	"github.com/gofiber/fiber/v2"
)

func SearchHotelFiltered(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}


	var hotels []models.Hotel

	if err := database.DB.Table("hotels").
		Joins("join cities on hotels.city_id = cities.id").
		Joins("join countries on cities.country_id = countries.id").
		Where("hotels.name ILIKE ?", "%"+data["query"]+"%").
		Or("cities.name ILIKE ?", "%"+data["query"]+"%").
		Or("countries.name ILIKE ?", "%"+data["query"]+"%").
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

func SearchFlightFiltered(c *fiber.Ctx) error {
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