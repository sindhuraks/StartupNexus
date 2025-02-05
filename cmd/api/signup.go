package main

import (
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

// Request structure
type SignupRequest struct {
	FullName          string `json:"full_name"`
	Email             string `json:"email"`
	Password          string `json:"password"`
	Role              string `json:"role"`
	PhoneNumber       string `json:"phone_number"`
	Location          string `json:"location"`
	LinkedInProfile   string `json:"linkedin_profile"`
	VerificationProof string `json:"verification_proof,omitempty"`
}

// Hash password function
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// Signup API
func (app *application) signupHandler(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	hashedPassword, _ := HashPassword(req.Password)

	user := User{
		FullName:           req.FullName,
		Email:              req.Email,
		Password:           hashedPassword,
		Role:               req.Role,
		PhoneNumber:        req.PhoneNumber,
		Location:           req.Location,
		LinkedIn:           req.LinkedInProfile,
		VerificationProof:  &req.VerificationProof, // Fixed the error
		VerificationStatus: "pending",
	}

	DB.Create(&user)

	response := map[string]string{"message": "User registered successfully, pending verification"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// getting the users from the database
func (app *application) getUsers(w http.ResponseWriter, r *http.Request) {
	var users []User
	DB.Find(&users)
	//remove the password from the response
	for i := range users {
		users[i].Password = ""
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
