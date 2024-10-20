package main

import (
	"fmt"
	"log"

	"midterm/internal"
	"midterm/internal/task"
	"midterm/internal/user"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to DB
	db, err := internal.ConnectDatabase()
	if err != nil {
		log.Fatal("Unable to connect to database:", err)
	}

	// Create gin router
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	task.SetupRoutes(router, db)
	user.SetupRoutes(router, db)

	fmt.Println("Backend App Started... ✨")

	if err := router.Run(":8080"); err != nil {
		log.Fatal("Unable to start server:", err)
	}
}
