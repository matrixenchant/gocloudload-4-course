package main

import (
	"app/gorm"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	_ "app/rest/docs"
	"github.com/swaggo/gin-swagger" // gin-swagger middleware
	"github.com/swaggo/files" // swagger embed files
)

func main() {

	gorm.Connect()

	r := gin.Default()

	r.Use(ErrorHandlingMiddleware())


	r.GET("/users", GetUsers)
	r.POST("/users", CreateUser)
	r.PUT("/users/:id", UpdateUser)
	r.DELETE("/users/:id", DeleteUser)

	// Start the server
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.Run(":8080")
	fmt.Println("SERVER STARTED!")
}

func ErrorHandlingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next() // обрабатываем запрос

		// Проверяем наличие ошибок
		if len(c.Errors) > 0 {
			var status int
			if c.Errors.Last().Type == gin.ErrorTypePublic {
				status = http.StatusBadRequest
			} else {
				status = http.StatusInternalServerError
			}
			c.JSON(status, gin.H{"errors": c.Errors.Errors()})
		}
	}
}
