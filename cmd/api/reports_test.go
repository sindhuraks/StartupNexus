package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReportStartupHandler(t *testing.T) {
	app := &application{}

	// Ensure the Report table is created
	err := DB.AutoMigrate(&Report{})
	if err != nil {
		t.Fatalf("Failed to migrate report table: %v", err)
	}

	// Helper to create a test user
	createUser := func(email string) User {
		user := User{
			FullName: "Reporter",
			Email:    email,
			Role:     "Investor",
		}
		DB.Create(&user)
		return user
	}

	// Helper to create a test startup
	createStartup := func(email string) Startup {
		user := createUser(email)
		entrepreneur := Entrepreneur{UserID: user.ID}
		DB.Create(&entrepreneur)

		startup := Startup{
			EntrepreneurEmail: email,
			EntrepreneurID:    entrepreneur.ID,
			StartupName:       "ReportMe",
			Industry:          "Tech",
			Description:       "For reporting test",
			Budget:            10000,
			Timeframe:         "6 months",
		}
		DB.Create(&startup)
		return startup
	}

	t.Run("Submit Report Successfully", func(t *testing.T) {
		user := createUser("reporter1@example.com")
		startup := createStartup("entre1@example.com")

		reqBody := map[string]interface{}{
			"email":      user.Email,
			"startup_id": startup.ID,
			"reason":     "Inappropriate content",
		}
		jsonBody, _ := json.Marshal(reqBody)

		req, _ := http.NewRequest("POST", "/v1/startup/report", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.reportStartupHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "Report submitted successfully")
	})

	t.Run("Duplicate Report", func(t *testing.T) {
		user := createUser("reporter2@example.com")
		startup := createStartup("entre2@example.com")

		// Submit first report
		DB.Create(&Report{
			ReporterID: user.ID,
			StartupID:  startup.ID,
			Reason:     "Already reported",
		})

		reqBody := map[string]interface{}{
			"email":      user.Email,
			"startup_id": startup.ID,
			"reason":     "Duplicate report",
		}
		jsonBody, _ := json.Marshal(reqBody)

		req, _ := http.NewRequest("POST", "/v1/startup/report", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.reportStartupHandler(rr, req)

		assert.Equal(t, http.StatusConflict, rr.Code)
		assert.Contains(t, rr.Body.String(), "already reported")
	})

	t.Run("Auto-Delete After 5 Reports", func(t *testing.T) {
		startup := createStartup("entre3@example.com")

		// Add 4 previous reports
		for i := 1; i <= 4; i++ {
			user := createUser("auto" + strconv.Itoa(i) + "@example.com")
			DB.Create(&Report{
				ReporterID: user.ID,
				StartupID:  startup.ID,
				Reason:     "Spam " + strconv.Itoa(i),
			})
		}

		// 5th report triggers deletion
		user := createUser("auto5@example.com")
		reqBody := map[string]interface{}{
			"email":      user.Email,
			"startup_id": startup.ID,
			"reason":     "Final report",
		}
		jsonBody, _ := json.Marshal(reqBody)

		req, _ := http.NewRequest("POST", "/v1/startup/report", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.reportStartupHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "Startup has been removed")
	})

	t.Run("User Not Found", func(t *testing.T) {
		reqBody := map[string]interface{}{
			"email":      "ghost@example.com",
			"startup_id": 1,
			"reason":     "Random reason",
		}
		jsonBody, _ := json.Marshal(reqBody)

		req, _ := http.NewRequest("POST", "/v1/startup/report", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.reportStartupHandler(rr, req)

		assert.Equal(t, http.StatusNotFound, rr.Code)
		assert.Contains(t, rr.Body.String(), "User not found")
	})

	t.Run("Invalid Payload", func(t *testing.T) {
		req, _ := http.NewRequest("POST", "/v1/startup/report", bytes.NewBuffer([]byte("bad json")))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.reportStartupHandler(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
		assert.Contains(t, rr.Body.String(), "Invalid request payload")
	})
}
