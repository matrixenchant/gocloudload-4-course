package main

import (
	"app/handlers"
	"app/middleware"
	"app/models"
	"app/utils"
	"log"
	"net/http"

	gorilla "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	// Load config
	config := utils.LoadConfig()

	models.InitDB()

	// Router
	router := mux.NewRouter()

	// CSRF protection
	// csrfMiddleware := csrf.Protect([]byte(config.CSRFKey), csrf.Secure(false))

	// Routes
	handlers.RegisterRoutes(router)

	// Apply middleware
	router.Use(gorilla.CORS())
	router.Use(middleware.SecurityHeaders)
	router.Use(middleware.Logging)

	// HTTPS Server
	server := &http.Server{
		Addr:    config.Address,
		Handler: router,
	}

	log.Printf("Server started at %s", config.Address)
	log.Fatal(server.ListenAndServe())
	// log.Fatal(server.ListenAndServeTLS(config.CertFile, config.KeyFile))
}
