package main

import (
	"app/db"
	"app/gorm"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"

	_ "app/rest/docs"

	"github.com/swaggo/files"       // swagger embed files
	"github.com/swaggo/gin-swagger" // gin-swagger middleware
)

func main() {

	gorm.Connect()
	db.Connect()

	r := gin.Default()

	r.Use(ErrorHandlingMiddleware())


	r.GET("/users", GetUsers)
	r.POST("/users", CreateUser)
	r.PUT("/users/:id", UpdateUser)
	r.DELETE("/users/:id", DeleteUser)

	raw := r.Group("/raw")
	{
		raw.GET("/users", RawAdvancedGetUsers)
		raw.POST("/users", RawAdvancedCreateUser)
		raw.PUT("/users/:id", RawUpdateUser)
		raw.DELETE("/users/:id", RawDeleteUser)
	}

	// Start the server
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.Run(":8080")
	fmt.Println("SERVER STARTED!")
}

func ErrorHandlingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			var status int
			var errMessage string

			for _, err := range c.Errors {

				if err.Type == gin.ErrorTypePublic {
					status = http.StatusBadRequest
					errMessage = err.Error()
					continue
				}

				// PSQL
				var pqError *pq.Error
				if errors.As(err.Err, &pqError) {
					switch pqError.Code {
					case "23505": // unique_violation
						status = http.StatusConflict
						errMessage = "Conflict: " + pqError.Message
					case "23503": // foreign_key_violation
						status = http.StatusBadRequest
						errMessage = "Bad Request: Foreign key violation"
					default:
						status = http.StatusInternalServerError
						errMessage = "Database error: " + pqError.Message
					}
				} else {
					status = http.StatusInternalServerError
					errMessage = "Internal Server Error: " + err.Error()
				}
			}

			c.JSON(status, gin.H{"errors": errMessage})
		}
	}
}
