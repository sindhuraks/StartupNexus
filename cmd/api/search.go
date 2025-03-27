package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

func (app *application) searchUsersByNameHandler(w http.ResponseWriter, r *http.Request) {
	// Get search query from URL parameters
	query := r.URL.Query().Get("name")
	if query == "" {
		http.Error(w, `{"status": "error", "message": "Name query parameter is required"}`, http.StatusBadRequest)
		return
	}

	// Prepare the search term (case-insensitive partial match)
	searchTerm := "%" + strings.ToLower(query) + "%"

	// Search for users
	var users []User
	result := DB.Where("LOWER(full_name) LIKE ?", searchTerm).Find(&users)
	if result.Error != nil {
		http.Error(w, `{"status": "error", "message": "Database error"}`, http.StatusInternalServerError)
		return
	}

	// Prepare response
	type UserResponse struct {
		ID       uint   `json:"id"`
		FullName string `json:"full_name"`
		Email    string `json:"email"`
		Role     string `json:"role"`
		Location string `json:"location"`
		LinkedIn string `json:"linkedin_profile"`
	}

	var response []UserResponse
	for _, user := range users {
		response = append(response, UserResponse{
			ID:       user.ID,
			FullName: user.FullName,
			Email:    user.Email,
			Role:     user.Role,
			Location: user.Location,
			LinkedIn: user.LinkedIn,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"count":  len(response),
		"users":  response,
	})
}
