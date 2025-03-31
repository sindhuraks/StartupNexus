package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetConnectionSuggestionsHandler(t *testing.T) {
	setupTestDB()
	app := &application{}

	// Helpers
	createUser := func(email, role string, location string) User {
		user := User{
			FullName: "Test User",
			Email:    email,
			Role:     role,
			Location: location,
		}
		DB.Create(&user)
		return user
	}

	t.Run("Missing Email Parameter", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/suggestions", nil)
		rr := httptest.NewRecorder()
		app.getConnectionSuggestionsHandler(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "Email parameter is required")
	})

	t.Run("User Not Found", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/suggestions?email=ghost@example.com", nil)
		rr := httptest.NewRecorder()
		app.getConnectionSuggestionsHandler(rr, req)

		assert.Equal(t, http.StatusNotFound, rr.Code)
		assert.Contains(t, rr.Body.String(), "User not found")
	})

	t.Run("Invalid Role", func(t *testing.T) {
		user := createUser("random@example.com", "Alien", "Nowhere")
		req, _ := http.NewRequest("GET", "/suggestions?email="+user.Email, nil)
		rr := httptest.NewRecorder()
		app.getConnectionSuggestionsHandler(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "Invalid user role")
	})

	t.Run("Valid Entrepreneur Suggestions", func(t *testing.T) {
		entreUser := createUser("entre@example.com", "Entrepreneur", "Chennai")
		entre := Entrepreneur{UserID: entreUser.ID}
		DB.Create(&entre)

		startup := Startup{
			EntrepreneurEmail: entreUser.Email,
			EntrepreneurID:    entre.ID,
			StartupName:       "TechNova",
			Industry:          "Tech",
			Description:       "A tech startup",
			Budget:            50000,
			Timeframe:         "6 months",
		}
		DB.Create(&startup)

		// Add Investors
		for i := 1; i <= 3; i++ {
			user := createUser("investor"+strconv.Itoa(i)+"@example.com", "Investor", "Bangalore")
			investor := Investor{
				UserID:              user.ID,
				PreferredIndustries: "Tech,Finance",
				ExperienceYears:     5,
			}
			DB.Create(&investor)
		}

		// Add Mentors
		for i := 1; i <= 2; i++ {
			user := createUser("mentor"+strconv.Itoa(i)+"@example.com", "Mentor", "Hyderabad")
			mentor := Mentor{
				UserID:          user.ID,
				Expertise:       "Tech,Education",
				ExperienceYears: 4,
			}
			DB.Create(&mentor)
		}

		req, _ := http.NewRequest("GET", "/suggestions?email="+entreUser.Email, nil)
		rr := httptest.NewRecorder()
		app.getConnectionSuggestionsHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var res SuggestionsResponse
		json.Unmarshal(rr.Body.Bytes(), &res)

		assert.Equal(t, "success", res.Status)
		assert.Equal(t, entreUser.Email, res.UserEmail)
		assert.Greater(t, len(res.Suggestions), 0)
	})
}
