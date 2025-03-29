package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strings"
)

// Suggestion represents a single connection suggestion
type Suggestion struct {
	Type        string `json:"type"`
	ID          uint   `json:"id"`
	Email       string `json:"email"`
	Name        string `json:"name"`
	Location    string `json:"location"`
	MatchReason string `json:"match_reason"`
	Score       int    `json:"score"`
}

// SuggestionsResponse represents the API response structure
type SuggestionsResponse struct {
	Status      string       `json:"status"`
	UserEmail   string       `json:"user_email"`
	UserRole    string       `json:"user_role"`
	Suggestions []Suggestion `json:"suggestions"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

// getConnectionSuggestionsHandler handles GET requests for connection suggestions
func (app *application) getConnectionSuggestionsHandler(w http.ResponseWriter, r *http.Request) {
	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Get email from query parameters
	email := r.URL.Query().Get("email")
	if email == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  "error",
			Message: "Email parameter is required",
		})
		return
	}

	// Get the user by email with their role-specific data
	var user User
	if err := DB.Where("email = ?", email).First(&user).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  "error",
			Message: "User not found",
		})
		return
	}

	var suggestions []Suggestion
	var err error

	switch user.Role {
	case "Entrepreneur":
		suggestions, err = app.getEntrepreneurSuggestions(user)
	case "Investor":
		suggestions, err = app.getInvestorSuggestions(user)
	case "Mentor":
		suggestions, err = app.getMentorSuggestions(user)
	default:
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  "error",
			Message: "Invalid user role",
		})
		return
	}

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{
			Status:  "error",
			Message: "Failed to generate suggestions",
		})
		return
	}

	// Process suggestions (remove duplicates, sort by score)
	suggestions = app.processSuggestions(suggestions)

	// Return successful response
	json.NewEncoder(w).Encode(SuggestionsResponse{
		Status:      "success",
		UserEmail:   user.Email,
		UserRole:    user.Role,
		Suggestions: suggestions,
	})
}

// getEntrepreneurSuggestions generates suggestions for entrepreneurs
func (app *application) getEntrepreneurSuggestions(user User) ([]Suggestion, error) {
	var suggestions []Suggestion

	// First get the entrepreneur record for this user
	var entrepreneur Entrepreneur
	if err := DB.Where("user_id = ?", user.ID).First(&entrepreneur).Error; err != nil {
		return nil, fmt.Errorf("entrepreneur record not found")
	}

	// Get all startups by this entrepreneur
	var startups []Startup
	if err := DB.Where("entrepreneur_id = ?", entrepreneur.ID).Find(&startups).Error; err != nil {
		return nil, err
	}

	for _, startup := range startups {
		// Find investors interested in this industry
		var investors []Investor
		if err := DB.Joins("JOIN users ON investors.user_id = users.id").
			Where("preferred_industries LIKE ?", "%"+startup.Industry+"%").
			Where("investors.id NOT IN (SELECT sender_id FROM connections WHERE receiver_id = ? AND status = 'accepted')", user.ID).
			Order("experience_years DESC").
			Limit(5).
			Find(&investors).Error; err != nil {
			continue
		}

		for _, investor := range investors {
			var investorUser User
			if err := DB.First(&investorUser, investor.UserID).Error; err != nil {
				continue
			}

			score := app.calculateMatchScore(startup.Industry, investor.PreferredIndustries)
			suggestions = append(suggestions, Suggestion{
				Type:        "investor",
				ID:          investor.ID,
				Email:       investorUser.Email,
				Name:        investorUser.FullName,
				Location:    investorUser.Location,
				MatchReason: fmt.Sprintf("Invests in %s industry", startup.Industry),
				Score:       score,
			})
		}

		// Find mentors with relevant expertise
		var mentors []Mentor
		if err := DB.Joins("JOIN users ON mentors.user_id = users.id").
			Where("expertise LIKE ?", "%"+startup.Industry+"%").
			Where("mentors.id NOT IN (SELECT sender_id FROM connections WHERE receiver_id = ? AND status = 'accepted')", user.ID).
			Order("experience_years DESC").
			Limit(5).
			Find(&mentors).Error; err != nil {
			continue
		}

		for _, mentor := range mentors {
			var mentorUser User
			if err := DB.First(&mentorUser, mentor.UserID).Error; err != nil {
				continue
			}

			score := app.calculateMatchScore(startup.Industry, mentor.Expertise)
			suggestions = append(suggestions, Suggestion{
				Type:        "mentor",
				ID:          mentor.ID,
				Email:       mentorUser.Email,
				Name:        mentorUser.FullName,
				Location:    mentorUser.Location,
				MatchReason: fmt.Sprintf("Expert in %s", startup.Industry),
				Score:       score,
			})
		}
	}

	return suggestions, nil
}

// getInvestorSuggestions generates suggestions for investors
func (app *application) getInvestorSuggestions(user User) ([]Suggestion, error) {
	var suggestions []Suggestion

	// First get the investor record for this user
	var investor Investor
	if err := DB.Where("user_id = ?", user.ID).First(&investor).Error; err != nil {
		return nil, fmt.Errorf("investor record not found")
	}

	// Find startups in preferred industries
	var startups []Startup
	if err := DB.Joins("JOIN entrepreneurs ON startups.entrepreneur_id = entrepreneurs.id").
		Joins("JOIN users ON entrepreneurs.user_id = users.id").
		Where("industry IN (?)", strings.Split(investor.PreferredIndustries, ",")).
		Where("startups.id NOT IN (SELECT receiver_id FROM connections WHERE sender_id = ? AND status = 'accepted')", user.ID).
		Order("startups.created_at DESC").
		Limit(10).
		Find(&startups).Error; err != nil {
		return nil, err
	}

	for _, startup := range startups {
		var entrepreneur Entrepreneur
		if err := DB.Where("id = ?", startup.EntrepreneurID).First(&entrepreneur).Error; err != nil {
			continue
		}

		var entrepreneurUser User
		if err := DB.Where("id = ?", entrepreneur.UserID).First(&entrepreneurUser).Error; err != nil {
			continue
		}

		score := app.calculateMatchScore(startup.Industry, investor.PreferredIndustries)
		suggestions = append(suggestions, Suggestion{
			Type:        "startup",
			ID:          startup.ID,
			Email:       entrepreneurUser.Email,
			Name:        startup.StartupName,
			Location:    entrepreneurUser.Location,
			MatchReason: fmt.Sprintf("Startup in %s industry", startup.Industry),
			Score:       score,
		})
	}

	return suggestions, nil
}

// getMentorSuggestions generates suggestions for mentors
func (app *application) getMentorSuggestions(user User) ([]Suggestion, error) {
	var suggestions []Suggestion

	// First get the mentor record for this user
	var mentor Mentor
	if err := DB.Where("user_id = ?", user.ID).First(&mentor).Error; err != nil {
		return nil, fmt.Errorf("mentor record not found")
	}

	// Find startups that could benefit from mentor's expertise
	var startups []Startup
	if err := DB.Joins("JOIN entrepreneurs ON startups.entrepreneur_id = entrepreneurs.id").
		Joins("JOIN users ON entrepreneurs.user_id = users.id").
		Where("industry LIKE ?", "%"+mentor.Expertise+"%").
		Where("startups.id NOT IN (SELECT receiver_id FROM connections WHERE sender_id = ? AND status = 'accepted')", user.ID).
		Order("startups.created_at DESC").
		Limit(10).
		Find(&startups).Error; err != nil {
		return nil, err
	}

	for _, startup := range startups {
		var entrepreneur Entrepreneur
		if err := DB.Where("id = ?", startup.EntrepreneurID).First(&entrepreneur).Error; err != nil {
			continue
		}

		var entrepreneurUser User
		if err := DB.Where("id = ?", entrepreneur.UserID).First(&entrepreneurUser).Error; err != nil {
			continue
		}

		score := app.calculateMatchScore(startup.Industry, mentor.Expertise)
		suggestions = append(suggestions, Suggestion{
			Type:        "startup",
			ID:          startup.ID,
			Email:       entrepreneurUser.Email,
			Name:        startup.StartupName,
			Location:    entrepreneurUser.Location,
			MatchReason: fmt.Sprintf("Could benefit from your %s expertise", mentor.Expertise),
			Score:       score,
		})
	}

	return suggestions, nil
}

// calculateMatchScore calculates a match score between 0-100
func (app *application) calculateMatchScore(target, source string) int {
	target = strings.ToLower(strings.TrimSpace(target))
	source = strings.ToLower(strings.TrimSpace(source))

	if strings.Contains(source, target) {
		return 100
	}

	// Split by commas and check for any match
	sourceParts := strings.Split(source, ",")
	for _, part := range sourceParts {
		if strings.Contains(strings.TrimSpace(part), target) {
			return 80
		}
	}

	return 50 // Default score for weak matches
}

// processSuggestions removes duplicates and sorts by score
func (app *application) processSuggestions(suggestions []Suggestion) []Suggestion {
	// Remove duplicates
	seen := make(map[string]bool)
	unique := []Suggestion{}

	for _, s := range suggestions {
		key := fmt.Sprintf("%s-%s", s.Type, s.Email)
		if !seen[key] {
			seen[key] = true
			unique = append(unique, s)
		}
	}

	// Sort by score (descending)
	sort.Slice(unique, func(i, j int) bool {
		return unique[i].Score > unique[j].Score
	})

	// Return top 10 suggestions
	if len(unique) > 10 {
		return unique[:10]
	}
	return unique
}
