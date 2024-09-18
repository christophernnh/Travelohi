package models

import (
	"time"
)

type User struct {
	ID               uint      `json:"id"`
	FirstName        string    `json:"firstname"`
	LastName         string    `json:"lastname"`
	Email            string    `json:"email"`
	Password         []byte    `json:"-"`
	DateOfBirth      time.Time `json:"birthDate"`
	OTP              string    `json:"otp"`
	SecurityQuestion string    `json:"securityQuestion"`
	SecurityAnswer   string    `json:"securityAnswer"`
	Gender           string    `json:"gender"`
	IsBanned         bool      `json:"isbanned"`
	IsSubscribed     bool      `json:"issubscribed"`
	ProfileImage     string    `json:"profilepicture"`
	Role             string    `json:"role"`
	OtpExpiry        time.Time `json:"otpexpiry"`

	CardNumber string `json:"cardnumber"`
	CVV        string `json:"cvv"`
	ExpMonth   string `json:"expiremonth"`
	ExpYear    string `json:"expireyear"`
}
