package task

import (
	m "midterm/internal"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	router.POST("/tasks", func(c *gin.Context) {
		var newTask m.Task
		if err := c.ShouldBindJSON(&newTask); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		err := CreateTask(db, newTask)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, newTask)
	})

	router.GET("/tasks", func(c *gin.Context) {
		userID := c.Query("user")

		var tasks []m.Task
		var err error

		if userID != "" {
			tasks, err = ReadTasksByUser(db, userID)
		} else {
			tasks, err = ReadTasks(db)
		}

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, tasks)
	})

	router.GET("/tasks/:id", func(c *gin.Context) {
		id := c.Param("id")
		task, err := GetTaskById(db, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, task)
	})

	router.PUT("/tasks/:id", func(c *gin.Context) {
		var updateTask m.Task
		if err := c.ShouldBindJSON(&updateTask); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		id := c.Param("id")
		UpdateTask(db, id, updateTask)
		c.JSON(http.StatusOK, updateTask)
	})

	router.DELETE("/tasks/:id", func(c *gin.Context) {
		id := c.Param("id")
		DeleteTask(db, id)
		c.JSON(http.StatusNoContent, nil)
	})
}
