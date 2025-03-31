package main

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/stretchr/testify/assert"
)

func TestAddCommentHandler(t *testing.T) {
	app := &application{}

	t.Run("Add Comment Successfully", func(t *testing.T) {
		// Seed user and startup
		user := User{FullName: "Commenter", Email: "commenter@example.com", Role: "Investor"}
		DB.Create(&user)

		startup := Startup{StartupName: "Test Startup", Industry: "AI", Budget: 100000}
		DB.Create(&startup)

		reqBody := map[string]interface{}{
			"email":      user.Email,
			"startup_id": startup.ID,
			"content":    "This is a test comment.",
		}
		body, _ := json.Marshal(reqBody)

		req, _ := http.NewRequest("POST", "/v1/startup/comment", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.addCommentHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "Comment added successfully")
	})

	t.Run("Add Comment - User Not Found", func(t *testing.T) {
		reqBody := map[string]interface{}{
			"email":      "ghost@example.com",
			"startup_id": 999,
			"content":    "Should fail",
		}
		body, _ := json.Marshal(reqBody)

		req, _ := http.NewRequest("POST", "/v1/startup/comment", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()

		app.addCommentHandler(rr, req)

		assert.Equal(t, http.StatusNotFound, rr.Code)
		assert.Contains(t, rr.Body.String(), "User not found")
	})

	t.Run("Add Comment - Invalid Payload", func(t *testing.T) {
		req, _ := http.NewRequest("POST", "/v1/startup/comment", bytes.NewBuffer([]byte("{invalid json")))
		rr := httptest.NewRecorder()

		app.addCommentHandler(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
	})
}

func TestGetCommentsHandler(t *testing.T) {
	app := &application{}

	t.Run("Get Comments - Valid Startup", func(t *testing.T) {
		// Create user and startup
		user := User{FullName: "Comment Fetcher", Email: "fetch@example.com", Role: "Investor"}
		DB.Create(&user)

		startup := Startup{StartupName: "Fetch Startup", Industry: "Health", Budget: 80000}
		DB.Create(&startup)

		// Add comment
		DB.Create(&Comment{
			UserID:    user.ID,
			StartupID: startup.ID,
			Content:   "Fetch test comment",
		})

		req, _ := http.NewRequest("GET", "/v1/startup/comments/"+strconv.Itoa(int(startup.ID)), nil)
		req = contextWithChiParams(req, "id", strconv.Itoa(int(startup.ID)))
		rr := httptest.NewRecorder()

		app.getCommentsHandler(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)
		assert.Contains(t, rr.Body.String(), "Fetch test comment")
	})

	t.Run("Get Comments - Invalid Startup ID", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/v1/startup/comments/abc", nil)
		req = contextWithChiParams(req, "id", "abc")
		rr := httptest.NewRecorder()

		app.getCommentsHandler(rr, req)

		assert.Equal(t, http.StatusBadRequest, rr.Code)
	})
}

// Correct helper: returns full request with Chi params
func contextWithChiParams(req *http.Request, key, value string) *http.Request {
	ctx := chi.NewRouteContext()
	ctx.URLParams.Add(key, value)
	return req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, ctx))
}
