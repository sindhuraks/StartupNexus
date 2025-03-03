package main

import (
	"encoding/json"
	"net/http"
)

// Handler to fetch all startups
func (app *application) getAllStartupsHandler(w http.ResponseWriter, r *http.Request) {
	var startups []Startup
	if err := DB.Find(&startups).Error; err != nil {
		http.Error(w, "Failed to retrieve startups", http.StatusInternalServerError)
		return
	}

	var result []map[string]interface{}
	for _, startup := range startups {
		var entrepreneur User
		if err := DB.Where("id = ?", startup.EntrepreneurID).First(&entrepreneur).Error; err != nil {
			continue // Skip if entrepreneur not found
		}

		result = append(result, map[string]interface{}{
			"id":           startup.ID,
			"startup_name": startup.StartupName,
			"industry":     startup.Industry,
			"description":  startup.Description,
			"budget":       startup.Budget,
			"timeframe":    startup.Timeframe,
			"entrepreneur": map[string]interface{}{
				"id":       entrepreneur.ID,
				"name":     entrepreneur.FullName,
				"email":    entrepreneur.Email,
				"location": entrepreneur.Location,
			},
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":   "success",
		"startups": result,
	})
}

func (app *application) insertStartupHandler(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var startup Startup
	if err := json.NewDecoder(r.Body).Decode(&startup); err != nil {
		http.Error(w, `{"status": "error", "message": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	// Find user by email
	var user User
	if err := DB.Where("email = ?", startup.EntrepreneurEmail).First(&user).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "User not found"}`, http.StatusNotFound)
		return
	}

	// Ensure the user is an Entrepreneur
	var entrepreneur Entrepreneur
	if err := DB.Where("user_id = ?", user.ID).First(&entrepreneur).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "User is not registered as an entrepreneur"}`, http.StatusForbidden)
		return
	}

	// Insert startup
	startup.EntrepreneurID = entrepreneur.ID
	if err := DB.Create(&startup).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "Failed to insert startup"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Startup inserted successfully",
	})
}

func (app *application) updateStartupHandler(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var request struct {
		Email       string  `json:"email"`
		StartupID   int     `json:"startup_id"`
		StartupName string  `json:"startup_name"`
		Industry    string  `json:"industry"`
		Description string  `json:"description"`
		Budget      float64 `json:"budget"`
		Timeframe   string  `json:"timeframe"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, `{"status": "error", "message": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	// Find user by email
	var user User
	if err := DB.Where("email = ?", request.Email).First(&user).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "User not found"}`, http.StatusNotFound)
		return
	}

	// Ensure the user is an Entrepreneur
	var entrepreneur Entrepreneur
	if err := DB.Where("user_id = ?", user.ID).First(&entrepreneur).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "User is not registered as an entrepreneur"}`, http.StatusForbidden)
		return
	}

	// Check if the startup exists and belongs to the entrepreneur
	var startup Startup
	if err := DB.Where("id = ? AND entrepreneur_id = ?", request.StartupID, entrepreneur.ID).First(&startup).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "Startup not found or does not belong to the entrepreneur"}`, http.StatusNotFound)
		return
	}

	// Update startup details
	startup.StartupName = request.StartupName
	startup.Industry = request.Industry
	startup.Description = request.Description
	startup.Budget = request.Budget
	startup.Timeframe = request.Timeframe

	if err := DB.Save(&startup).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "Failed to update startup"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Startup updated successfully",
	})
}

// Delete startup handler 
func (app *application) deleteStartupHandler(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var request struct {
		Email     string `json:"email"`
		StartupID int    `json:"startup_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, `{"status": "error", "message": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	// Find user by email
	var user User
	if err := DB.Where("email = ?", request.Email).First(&user).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "User not found"}`, http.StatusNotFound)
		return
	}

	// Ensure the user is an Entrepreneur
	var entrepreneur Entrepreneur
	if err := DB.Where("user_id = ?", user.ID).First(&entrepreneur).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "User is not registered as an entrepreneur"}`, http.StatusForbidden)
		return
	}

	// Check if the startup exists and belongs to the entrepreneur
	var startup Startup
	if err := DB.Where("id = ? AND entrepreneur_id = ?", request.StartupID, entrepreneur.ID).First(&startup).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "Startup not found or does not belong to the entrepreneur"}`, http.StatusNotFound)
		return
	}

	// Delete the startup
	if err := DB.Delete(&startup).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "Failed to delete startup"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Startup deleted successfully",
	})
}

func (app *application) getStartupsByUserHandler(w http.ResponseWriter, r *http.Request) {
	// Get email from query parameter
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, `{"status": "error", "message": "Email is required"}`, http.StatusBadRequest)
		return
	}

	// Find user by email
	var user User
	if err := DB.Where("email = ?", email).First(&user).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "User not found"}`, http.StatusNotFound)
		return
	}

	// Ensure the user is an Entrepreneur
	var entrepreneur Entrepreneur
	if err := DB.Where("user_id = ?", user.ID).First(&entrepreneur).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "User is not registered as an entrepreneur"}`, http.StatusForbidden)
		return
	}

	// Fetch all startups for the entrepreneur
	var startups []Startup
	if err := DB.Where("entrepreneur_id = ?", entrepreneur.ID).Find(&startups).Error; err != nil {
		http.Error(w, `{"status": "error", "message": "Failed to retrieve startups"}`, http.StatusInternalServerError)
		return
	}

	// Prepare response
	var result []map[string]interface{}
	for _, startup := range startups {
		result = append(result, map[string]interface{}{
			"id":           startup.ID,
			"startup_name": startup.StartupName,
			"industry":     startup.Industry,
			"description":  startup.Description,
			"budget":       startup.Budget,
			"timeframe":    startup.Timeframe,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":   "success",
		"startups": result,
	})
}