package controllers

import (
	"fmt"
	"log"
	"strconv"

	"github.com/christophernnh/TPA_web/database"
	"github.com/christophernnh/TPA_web/models"
	"github.com/gofiber/fiber/v2"
)

func AddReview(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	// Check for empty fields
	if data["userid"] == "" || data["hotelid"] == "" || data["rating"] == "" || data["description"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "All fields are required",
		})
	}

	anonymous, err := strconv.ParseBool(data["anonymous"])
	if err != nil {
		fmt.Println("Error parsing anonymous bool: ", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid value for anonymous",
		})
	}

	rating, err := strconv.ParseFloat(data["rating"], 32)
	if err != nil {
		fmt.Println("Error parsing rating: ", err)
		return err
	}

	uid, err := strconv.Atoi(data["userid"])
	if err != nil {
		fmt.Println("Error converting userid to int: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error converting userid to int",
		})
	}

	hotelid, err := strconv.Atoi(data["hotelid"])
	if err != nil {
		fmt.Println("Error converting hotelid to int: ", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error converting hotelid to int",
		})
	}

	var review = models.HotelReview{}

	if anonymous {
		review = models.HotelReview{
			HotelID:     uint(hotelid),
			Rating:      float32(rating),
			Description: data["description"],
			Anonymous:   anonymous,
		}
	} else {
		review = models.HotelReview{
			UserID:      uint(uid),
			HotelID:     uint(hotelid),
			Rating:      float32(rating),
			Description: data["description"],
			Anonymous:   anonymous,
		}
	}

	if err := database.DB.Create(&review).Error; err != nil {
		log.Println("Error creating review:", err)
		return err
	}

	return c.JSON(review)
}

func GetReviews(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Error parsing json: ", err)
		return err
	}

	var hotelreviews []models.HotelReview

	if err := database.DB.Table("hotel_reviews").
		Where("hotel_reviews.hotel_id = ?", data["hotelid"]).
		Find(&hotelreviews).Error; err != nil {

		fmt.Println("Error querying hotel reviews:", err)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch hotel Transaction",
		})
	}

	if len(hotelreviews) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no hotel reviews found",
		})
	}

	response := make([]map[string]interface{}, len(hotelreviews))
	for i, hotelreview := range hotelreviews {
		var user models.User

		//getting users
		if err := database.DB.Table("users").
			Where("users.id = ?", hotelreview.UserID).
			Find(&user).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed to fetch the user",
			})
		}

		response[i] = map[string]interface{}{
			"id":          hotelreview.ID,
			"firstname":   user.FirstName,
			"lastname":    user.LastName,
			"rating":      hotelreview.Rating,
			"description": hotelreview.Description,
			"isanonymous": hotelreview.Anonymous,
			"createdat":   hotelreview.CreatedAt,
		}
	}

	return c.JSON(fiber.Map{
		"message":      "success",
		"hotelreviews": response,
	})

}
