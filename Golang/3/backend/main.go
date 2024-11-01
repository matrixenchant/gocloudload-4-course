package main

import (
	"fmt"
	"log"

	"assigment3/internal/book"
	"assigment3/internal/user"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	// Create gin router
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	book.SetupRoutes(router)
	user.SetupRoutes(router)

	fmt.Println("Backend App Started... ✨")

	if err := router.Run(":8080"); err != nil {
		log.Fatal("Unable to start server:", err)
	}
}
