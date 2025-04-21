package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSearchUsersByNameHandler(t *testing.T) {
	// Setup test DB and app instance
	setupTestDB()
	app := &application{}

	// Seed the database with test users
	DB.Create(&User{
		FullName: "Alice Johnson",
		Email:    "alice@example.com",
		Role:     "Entrepreneur",
		Location: "San Francisco",
		LinkedIn: "https://linkedin.com/in/alice",
	})

	DB.Create(&User{
		FullName: "Bob Smith",
		Email:    "bob@example.com",
		Role:     "Mentor",
		Location: "New York",
		LinkedIn: "https://linkedin.com/in/bob",
	})

	t.Run("Successful search with matching results", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/v1/user/search?name=Alice", nil)
		rr := httptest.NewRecorder()

		app.searchUsersByNameHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var res map[string]interface{}
		err := json.Unmarshal(rr.Body.Bytes(), &res)
		assert.NoError(t, err)
		assert.Equal(t, "success", res["status"])
		assert.Equal(t, float64(1), res["count"])
	})

	t.Run("Missing name parameter returns 400", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/v1/user/search", nil)
		rr := httptest.NewRecorder()

		app.searchUsersByNameHandler(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "Name query parameter is required")
	})
}
