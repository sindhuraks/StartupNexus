package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func (app *application) likeStartupHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email     string `json:"email"`
		StartupID uint   `json:"startup_id"`
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

	var existing Like
	if err := DB.Where("user_id = ? AND startup_id = ?", user.ID, req.StartupID).First(&existing).Error; err == nil {
		jsonError(w, http.StatusConflict, "Already liked")
		return
	}

	like := Like{
		UserID:    user.ID,
		StartupID: req.StartupID,
	}
	if err := DB.Create(&like).Error; err != nil {
		jsonError(w, http.StatusInternalServerError, "Failed to like")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Startup liked successfully",
	})
}

func (app *application) unlikeStartupHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email     string `json:"email"`
		StartupID uint   `json:"startup_id"`
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

	if err := DB.Where("user_id = ? AND startup_id = ?", user.ID, req.StartupID).Delete(&Like{}).Error; err != nil {
		jsonError(w, http.StatusInternalServerError, "Failed to unlike")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Startup unliked successfully",
	})
}

func (app *application) getStartupLikesHandler(w http.ResponseWriter, r *http.Request) {
	startupIDStr := chi.URLParam(r, "id")
	startupID, err := strconv.Atoi(startupIDStr)
	if err != nil {
		jsonError(w, http.StatusBadRequest, "Invalid startup ID")
		return
	}

	var count int64
	if err := DB.Model(&Like{}).Where("startup_id = ?", startupID).Count(&count).Error; err != nil {
		jsonError(w, http.StatusInternalServerError, "Failed to retrieve likes")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":     "success",
		"startup_id": startupID,
		"like_count": count,
	})
}
