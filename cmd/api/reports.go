package main

import (
	"encoding/json"
	"net/http"
)

func (app *application) reportStartupHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email     string `json:"email"`
		StartupID uint   `json:"startup_id"`
		Reason    string `json:"reason"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Find user by email
	var user User
	if err := DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		jsonError(w, http.StatusNotFound, "User not found")
		return
	}

	// Check if already reported
	var existing Report
	if err := DB.Where("reporter_id = ? AND startup_id = ?", user.ID, req.StartupID).First(&existing).Error; err == nil {
		jsonError(w, http.StatusConflict, "You have already reported this startup")
		return
	}

	// Save the report
	report := Report{
		ReporterID: user.ID,
		StartupID:  req.StartupID,
		Reason:     req.Reason,
	}
	if err := DB.Create(&report).Error; err != nil {
		jsonError(w, http.StatusInternalServerError, "Failed to submit report")
		return
	}

	// Count total reports for the startup
	var count int64
	DB.Model(&Report{}).Where("startup_id = ?", req.StartupID).Count(&count)

	// Auto-delete startup if >= 5 reports
	if count >= 5 {
		if err := DB.Where("id = ?", req.StartupID).Delete(&Startup{}).Error; err != nil {
			jsonError(w, http.StatusInternalServerError, "Startup reached report threshold but failed to delete")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Report submitted. Startup has been removed after receiving 5 reports.",
		})
		return
	}

	// Normal response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Report submitted successfully",
	})
}
