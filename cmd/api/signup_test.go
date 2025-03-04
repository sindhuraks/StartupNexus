package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"gorm.io/gorm"

	"github.com/stretchr/testify/assert"
)

// Global TestDB variable
var TestDB *gorm.DB

func TestCheckUserHandler(t *testing.T) {
	app := &application{}

	t.Run("User Exists", func(t *testing.T) {
		// Clean up before test
		defer DB.Exec("DELETE FROM users")

		// Insert a mock user
		mockUser := User{
			FullName:           "Existing User",
			Email:              "existing@example.com",
			Role:               "Entrepreneur",
			PhoneNumber:        "1234567890",
			Location:           "New York",
			LinkedIn:           "https://linkedin.com/in/existinguser",
			VerificationStatus: "verified",
		}
		DB.Create(&mockUser)

		req, _ := http.NewRequest("GET", "/v1/user/check?email=existing@example.com", nil)
		rr := httptest.NewRecorder()

		app.checkUserHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		expected := `{"exists":true,"role":"Entrepreneur","full_name":"Existing User","email":"existing@example.com","phone_number":"1234567890","location":"New York","linkedin":"https://linkedin.com/in/existinguser","verification_status":"verified"}`
		assert.JSONEq(t, expected, rr.Body.String())
	})

	t.Run("User Does Not Exist", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/v1/user/check?email=newuser@example.com", nil)
		rr := httptest.NewRecorder()

		app.checkUserHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		expected := `{"exists":false}`
		assert.JSONEq(t, expected, rr.Body.String())
	})

	t.Run("Missing Email Parameter", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/v1/user/check", nil)
		rr := httptest.NewRecorder()

		app.checkUserHandler(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
	})
}

func TestSignupHandler(t *testing.T) {
	app := &application{}

	t.Run("Successful Signup", func(t *testing.T) {
		defer DB.Exec("DELETE FROM users") // Cleanup

		payload := SignupRequest{
			FullName:        "John Doe",
			Email:           "john.doe@example.com",
			Role:            "Entrepreneur",
			PhoneNumber:     "1234567890",
			Location:        "San Francisco",
			LinkedInProfile: "https://linkedin.com/in/johndoe",
		}
		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", "/v1/user/signup", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.signupHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var response map[string]string
		json.Unmarshal(rr.Body.Bytes(), &response)

		assert.Equal(t, "success", response["status"])
		assert.Equal(t, "User registered successfully! Please verify your account.", response["message"])
	})

	t.Run("Duplicate Email Signup", func(t *testing.T) {
		defer DB.Exec("DELETE FROM users") // Cleanup

		// Ensure the user already exists
		DB.Where("email = ?", "existing@example.com").Delete(&User{}) // Delete any existing
		DB.Create(&User{FullName: "Existing User", Email: "existing@example.com", Role: "Entrepreneur"})

		payload := SignupRequest{
			FullName: "Existing User",
			Email:    "existing@example.com",
			Role:     "Entrepreneur",
		}
		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", "/v1/user/signup", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.signupHandler(rr, req)

		assert.Equal(t, http.StatusConflict, rr.Code)
		assert.Contains(t, rr.Body.String(), `"status":"error"`)
		assert.Contains(t, rr.Body.String(), `"message":"User already exists with this email. Please log in."`)
	})

	t.Run("Invalid Request Payload", func(t *testing.T) {
		req, _ := http.NewRequest("POST", "/v1/user/signup", bytes.NewBuffer([]byte("{invalid json}")))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.signupHandler(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		expected := `{"status":"error","message":"Invalid request payload."}`
		assert.JSONEq(t, expected, rr.Body.String())
	})
}
