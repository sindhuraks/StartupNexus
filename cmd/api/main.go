package main

import "log"

func main() {
	// Initialize the database
	InitDB() // This will now be recognized

	// Create app instance
	cfg := config{
		addr: ":8080",
	}
	app := &application{
		config: cfg,
	}

	// Start the server
	mux := app.mount()
	log.Println("Database migration successful!")
	log.Println("Server running on port", app.config.addr)
	log.Fatal(app.run(mux))
}
