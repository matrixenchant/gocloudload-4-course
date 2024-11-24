package handlers

import (
	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", LoginHandler).Methods("POST")
	router.HandleFunc("/register", RegisterHandler).Methods("POST")

}
