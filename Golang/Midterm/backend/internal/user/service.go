package user

import (
	m "midterm/internal"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	router.POST("/users", func(c *gin.Context) {
		var newUser m.User
		if err := c.ShouldBindJSON(&newUser); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		CreateUser(db, newUser)
		c.JSON(http.StatusCreated, newUser)
	})

	router.GET("/users", func(c *gin.Context) {
		users, err := ReadUsers(db)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, users)
	})

	router.GET("/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		user, err := GetUserById(db, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, user)
	})

	router.PUT("/users/:id", func(c *gin.Context) {
		var updateUser m.User
		if err := c.ShouldBindJSON(&updateUser); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		id := c.Param("id")
		UpdateUser(db, id, updateUser)
		c.JSON(http.StatusOK, updateUser)
	})

	router.DELETE("/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		err := DeleteUser(db, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusNoContent, nil)
	})
}
