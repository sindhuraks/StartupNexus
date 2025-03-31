package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// Handler to add a comment to a startup
func (app *application) addCommentHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email     string `json:"email"`
		StartupID uint   `json:"startup_id"`
		Content   string `json:"content"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	var user User
	if err := DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		jsonError(w, http.StatusNotFound, "User not found")
		return
	}

	comment := Comment{
		UserID:    user.ID,
		StartupID: req.StartupID,
		Content:   req.Content,
	}
	if err := DB.Create(&comment).Error; err != nil {
		jsonError(w, http.StatusInternalServerError, "Failed to add comment")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Comment added successfully",
	})
}

// Handler to fetch comments for a startup
func (app *application) getCommentsHandler(w http.ResponseWriter, r *http.Request) {
	startupIDStr := chi.URLParam(r, "id")
	startupID, err := strconv.Atoi(startupIDStr)
	if err != nil {
		jsonError(w, http.StatusBadRequest, "Invalid startup ID")
		return
	}

	var comments []Comment
	if err := DB.Where("startup_id = ?", startupID).Order("created_at DESC").Find(&comments).Error; err != nil {
		jsonError(w, http.StatusInternalServerError, "Failed to fetch comments")
		return
	}

	var response []map[string]interface{}
	for _, c := range comments {
		var user User
		DB.First(&user, c.UserID)

		response = append(response, map[string]interface{}{
			"id":         c.ID,
			"user_name":  user.FullName,
			"user_email": user.Email,
			"content":    c.Content,
			"timestamp":  c.CreatedAt,
		})
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":   "success",
		"comments": response,
	})
}
