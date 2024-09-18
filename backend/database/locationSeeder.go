package database

import (
	"fmt"

	"github.com/christophernnh/TPA_web/models"
)

func seedLocations() {
	db := DB
	countries := []models.Country{
		{Name: "United States"},
		{Name: "Japan"},
		{Name: "United Kingdom"},
		{Name: "France"},
		{Name: "Germany"},
		{Name: "United Arab Emirates"},
		{Name: "Singapore"},
		{Name: "South Korea"},
		{Name: "Netherlands"},
		{Name: "Australia"},
		{Name: "Canada"},
		{Name: "China"},
		{Name: "India"},
		{Name: "Brazil"},
		{Name: "Russia"},
		{Name: "Mexico"},
		{Name: "Turkey"},
		{Name: "Thailand"},
		{Name: "Indonesia"},
	}

	for _, country := range countries {
		db.FirstOrCreate(&country, models.Country{Name: country.Name})
	}

	cities := map[string][]string{
		"United States":        {"New York", "Los Angeles", "Chicago", "San Francisco", "Miami"},
		"Japan":                {"Tokyo", "Osaka", "Kyoto", "Sapporo", "Fukuoka"},
		"United Kingdom":       {"London", "Birmingham", "Liverpool"},
		"France":               {"Paris", "Bordeaux", "Marseille"},
		"Germany":              {"Berlin", "Munich", "Frankfurt"},
		"United Arab Emirates": {"Dubai"},
		"Singapore":            {"Singapore"},
		"South Korea":          {"Seoul", "Jeju"},
		"Netherlands":          {"Amsterdam", "Eindhoven"},
		"Australia":            {"Sydney", "Melbourne"},
		"Canada":               {"Montreal", "Ottawa"},
		"China":                {"Beijing", "Guangzhou"},
		"India":                {"Mumbai"},
		"Brazil":               {"Rio de Janeiro", "São Paulo"},
		"Indonesia":            {"Jakarta", "Binus"},
	}

	for countryName, cityNames := range cities {
		var country models.Country
		if err := db.Where("name = ?", countryName).First(&country).Error; err != nil {
			fmt.Printf("Could not find country '%s': %v\n", countryName, err)
			continue
		}
		for _, cityName := range cityNames {
			city := models.City{Name: cityName, CountryID: country.ID}
			db.FirstOrCreate(&city, models.City{Name: cityName, CountryID: country.ID})
		}
	}

	airports := []struct {
		Name string
		City string
		Code string
	}{
		{Name: "John F. Kennedy International Airport", City: "New York", Code: "JFK"},
		{Name: "Los Angeles International Airport", City: "Los Angeles", Code: "LAX"},
		{Name: "Midway International Airport", City: "Chicago", Code: "MDW"},
		{Name: "San Francisco International Airport", City: "San Francisco", Code: "SFO"},
		{Name: "Miami International Airport", City: "Miami", Code: "MIA"},

		{Name: "Narita International Airport", City: "Tokyo", Code: "NRT"},
		{Name: "Kansai International Airport", City: "Osaka", Code: "KIX"},
		{Name: "New Chitose Airport", City: "Sapporo", Code: "CTS"},
		{Name: "Fukuoka Airport", City: "Fukuoka", Code: "FUK"},

		{Name: "London City Airport", City: "London", Code: "LCY"},
		{Name: "Birmingham Airport", City: "Birmingham", Code: "BHX"},
		{Name: "Liverpool John Lennon Airport", City: "Liverpool", Code: "LPL"},

		{Name: "Charles de Gaulle Airportt", City: "Paris", Code: "CDG"},
		{Name: "Bordeaux–Mérignac Airport", City: "Bordeaux", Code: "BOD"},
		{Name: "Marseille Provence Airport", City: "Marseille", Code: "MRS"},

		{Name: "Berlin Brandenburg Airport", City: "Berlin", Code: "BER"},
		{Name: "Munich Airport", City: "Munich", Code: "MUC"},
		{Name: "Frankfurt Airport", City: "Frankfurt", Code: "FRA"},

		{Name: "Dubai International Airport", City: "Dubai", Code: "DXB"},

		{Name: "Changi Airport", City: "Singapore", Code: "SIN"},

		{Name: "Incheon International Airport", City: "Seoul", Code: "ICN"},
		{Name: "Jeju International Airport", City: "Jeju", Code: "CJU"},

		{Name: "Amsterdam Airport Schiphol", City: "Amsterdam", Code: "AMS"},
		{Name: "Eindhoven Airport", City: "Eindhoven", Code: "EIN"},

		{Name: "Sydney Airport", City: "Sydney", Code: "SYD"},
		{Name: "Melbourne Airport", City: "Melbourne", Code: "MEL"},

		{Name: "Montréal–Trudeau International Airport", City: "Montreal", Code: "YUL"},
		{Name: "Ottawa Macdonald–Cartier International Airport", City: "Ottawa", Code: "YOW"},

		{Name: "Beijing Capital International Airport", City: "Beijing", Code: "PEK"},
		{Name: "Guangzhou Baiyun International Airport", City: "Guangzhou", Code: "CAN"},

		{Name: "Chhatrapati Shivaji Maharaj International Airport", City: "Mumbai", Code: "BOM"},

		{Name: "Rio de Janeiro International Airport", City: "Rio de Janeiro", Code: "GIG"},
		{Name: "São Paulo International Airport", City: "São Paulo", Code: "GRU"},

		{Name: "Soekarno–Hatta International Airport", City: "Jakarta", Code: "CGK"},
		{Name: "Binus University Airport", City: "Binus", Code: "BNS"},
	}

	for _, airport := range airports {
		var city models.City
		if err := db.Where("name = ?", airport.City).First(&city).Error; err != nil {
			fmt.Printf("Could not find city '%s' for airport seeding: %v\n", airport.City, err)
			continue
		}
		newAirport := models.Airport{Name: airport.Name, CityID: city.ID, Code: airport.Code}
		db.FirstOrCreate(&newAirport, models.Airport{Code: airport.Code})
	}
}
