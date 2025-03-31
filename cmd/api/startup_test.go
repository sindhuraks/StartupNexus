package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestInsertStartupHandler(t *testing.T) {
	app := &application{}

	t.Run("Insert Startup Successfully", func(t *testing.T) {
		user := User{FullName: "Startup User", Email: "entrepreneur@example.com", Role: "Entrepreneur"}
		DB.Create(&user)
		DB.Create(&Entrepreneur{UserID: user.ID})

		startup := Startup{
			EntrepreneurEmail: "entrepreneur@example.com",
			StartupName:       "AI Startup",
			Industry:          "AI",
			Description:       "Revolutionizing AI",
			Budget:            150000,
			Timeframe:         "6 months",
		}

		body, _ := json.Marshal(startup)
		req, _ := http.NewRequest("POST", "/v1/startup/insert", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.insertStartupHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "success")
	})

	t.Run("Insert Fails - User Not Found", func(t *testing.T) {
		startup := Startup{
			EntrepreneurEmail: "nonexistent@example.com",
			StartupName:       "Ghost Startup",
		}
		body, _ := json.Marshal(startup)
		req, _ := http.NewRequest("POST", "/v1/startup/insert", bytes.NewBuffer(body))
		rr := httptest.NewRecorder()

		app.insertStartupHandler(rr, req)

		assert.Equal(t, http.StatusNotFound, rr.Code)
	})
}

func TestGetAllStartupsHandler(t *testing.T) {
	app := &application{}

	t.Run("Get All Startups", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/v1/startup/all", nil)
		rr := httptest.NewRecorder()

		app.getAllStartupsHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "startups")
	})
}

func TestGetStartupsByUserHandler(t *testing.T) {
	app := &application{}

	t.Run("Valid Entrepreneur Gets Their Startups", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/v1/startup/user?email=entrepreneur@example.com", nil)
		rr := httptest.NewRecorder()

		app.getStartupsByUserHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), `"status":"success"`)
	})

	t.Run("User Not Found", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/v1/startup/user?email=unknown@example.com", nil)
		rr := httptest.NewRecorder()

		app.getStartupsByUserHandler(rr, req)

		assert.Equal(t, http.StatusNotFound, rr.Code)
	})
}

func TestUpdateStartupHandler(t *testing.T) {
	app := &application{}

	t.Run("Update Startup Successfully", func(t *testing.T) {
		var user User
		DB.Where("email = ?", "entrepreneur@example.com").First(&user)

		var ent Entrepreneur
		DB.Where("user_id = ?", user.ID).First(&ent)

		startup := Startup{
			EntrepreneurID:    ent.ID,
			EntrepreneurEmail: user.Email,
			StartupName:       "Old Name",
			Industry:          "Tech",
			Description:       "Desc",
			Budget:            100000,
			Timeframe:         "3 months",
		}
		DB.Create(&startup)

		payload := map[string]interface{}{
			"email":        user.Email,
			"startup_id":   startup.ID,
			"startup_name": "Updated Name",
			"industry":     "AI",
			"description":  "Updated Description",
			"budget":       200000,
			"timeframe":    "6 months",
		}

		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("PUT", "/v1/startup/update", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.updateStartupHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "updated successfully")
	})
}

func TestDeleteStartupHandler(t *testing.T) {
	app := &application{}

	t.Run("Delete Startup Successfully", func(t *testing.T) {
		var user User
		DB.Where("email = ?", "entrepreneur@example.com").First(&user)

		var ent Entrepreneur
		DB.Where("user_id = ?", user.ID).First(&ent)

		startup := Startup{
			EntrepreneurID:    ent.ID,
			EntrepreneurEmail: user.Email,
			StartupName:       "Temp Startup",
			Industry:          "Finance",
			Description:       "To be deleted",
			Budget:            50000,
			Timeframe:         "2 months",
		}
		DB.Create(&startup)

		payload := map[string]interface{}{
			"email":      user.Email,
			"startup_id": startup.ID,
		}

		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("DELETE", "/v1/startup/delete", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.deleteStartupHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "deleted successfully")
	})

	t.Run("Delete Fails - Not Owner", func(t *testing.T) {
		payload := map[string]interface{}{
			"email":      "fakeowner@example.com",
			"startup_id": 999,
		}
		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("DELETE", "/v1/startup/delete", bytes.NewBuffer(body))
		rr := httptest.NewRecorder()

		app.deleteStartupHandler(rr, req)

		assert.Equal(t, http.StatusNotFound, rr.Code)
	})
}
