package main
import "net/http"

func (app *application) loginHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Login"))
}