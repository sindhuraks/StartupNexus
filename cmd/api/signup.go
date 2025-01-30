package main

import "net/http"

func (app *application) signupHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Sign Up"))
}
