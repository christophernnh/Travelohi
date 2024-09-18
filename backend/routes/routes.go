package routes

import (
	"github.com/christophernnh/TPA_web/controllers"
	"github.com/christophernnh/TPA_web/websocket"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Post("/api/loginadmin", controllers.AdminLogin)
	app.Post("/api/send-otp", controllers.SendOTPToEmail)
	app.Post("/api/login-otp", controllers.LoginOTP)
	app.Get("/api/user", controllers.User)
	app.Get("/api/admin", controllers.Admin)
	app.Post("/api/logout", controllers.Logout)
	app.Post("/api/forgot-password", controllers.ForgotPassword)
	app.Post("/api/answer-question", controllers.AnswerQuestion)
	app.Post("/api/reset-password", controllers.ResetPassword)
	app.Get("/websocket", websocket.HandleWebSocket)
	app.Put("/api/updateprofile", controllers.UpdateProfile)
	app.Put("/api/updatecredit", controllers.UpdateCredit)
	app.Put("/api/updateuser", controllers.AdminUpdateUser)
	app.Get("/api/getusers", controllers.GetUsers)
	app.Post("/api/sendnewsletter", controllers.SendNewsletter)
	app.Get("/api/getpromos", controllers.GetPromos)
	app.Put("/api/updatepromo", controllers.AdminUpdatePromo)
	app.Post("/api/createpromo", controllers.AdminCreatePromo)
	app.Delete("/api/deletepromo", controllers.AdminDeletePromo)
	app.Get("/api/gethotels", controllers.GetHotels)
	app.Get("/api/getcities", controllers.GetCities)
	app.Post("/api/createhotel", controllers.AdminCreateHotel)
	app.Post("/api/createroom", controllers.AdminCreateRoom)
	app.Post("/api/getrooms", controllers.GetRooms)
	app.Post("api/gethoteldetail", controllers.GetHotelDetail)
	app.Post("api/search", controllers.Search)
	app.Get("api/getairlines", controllers.GetAirlines)
	app.Get("api/getairplanes", controllers.GetAirplanes)
	app.Get("api/getairports", controllers.GetAirports)
	app.Post("api/createflight", controllers.CreateFlight)
	app.Get("api/getflights", controllers.GetFlights)
	app.Post("api/locationresults", controllers.LocationResults)
	app.Post("api/locationresultsflight", controllers.LocationResultsFlight)
	app.Post("api/searchhotelfiltered", controllers.SearchHotelFiltered)
	app.Post("api/searchflightfiltered", controllers.SearchFlightFiltered)
	app.Post("api/getflightdetail", controllers.GetFlightDetail)
	app.Post("api/getseats", controllers.GetSeats)

	app.Post("api/gethoteltransactions", controllers.GetHotelTransactions)
	app.Post("api/addhoteltocart", controllers.HotelAddToCart)
	
	app.Post("api/checkpromo", controllers.CheckPromo)
	app.Post("api/updatehotelcartdate", controllers.UpdateHotelCartDate)
	app.Post("api/getwalletbalance", controllers.GetWalletBalance)
	app.Post("api/deductwalletbalance", controllers.DeductWalletBalance)
	app.Post("api/checkouthotels", controllers.BuyHotels)
	
	app.Post("api/addflighttocart", controllers.FlightAddToCart)
	app.Post("api/getflighttransactions", controllers.GetFlightTransactions)

	app.Post("api/checkoutflights", controllers.BookSeat)

	app.Post("api/sendreceipt", controllers.SendReceipt)

	app.Post("api/addreview", controllers.AddReview)
	app.Post("api/getreviews", controllers.GetReviews)
}
