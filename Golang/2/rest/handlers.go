package main

import (
	"app/gorm"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// UserResponse - структура для представления пользователя в ответе
// @Description User response model
// @ID UserResponse
// @Property id int true "User ID"
// @Property name string true "User Name"
// @Property age int true "User Age"
type UserResponse struct {
	ID   uint64 `json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}

// SuccessResponse - структура для успешного ответа
// @Description Response for a successful operation
// @ID SuccessResponse
// @Property data array UserResponse true "List of users"
type SuccessResponse struct {
	Data []UserResponse `json:"data"`
}

// ErrorResponse - структура для ошибки
// @Description Response for an error
// @ID ErrorResponse
// @Property error string true "Error message"
type ErrorResponse struct {
	Error string `json:"error"`
}

// GetUsers godoc
// @Summary Get all users
// @Description Get all users with optional filtering, sorting, and pagination
// @Produce json
// @Param age query int false "Age to filter"
// @Param sortBy query string false "Field to sort by"
// @Param page query int false "Page number"
// @Param limit query int false "Limit number of users"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /users [get]
func GetUsers(c *gin.Context) {
	var users []gorm.User
	query := gorm.Conn.Model(&gorm.User{})

	age := c.Query("age")
	if age != "" {
		query = query.Where("age = ?", age)
	}

	sortBy := c.Query("sortBy")
	if sortBy != "" {
		query = query.Order(sortBy)
	}

	pageStr := c.Query("page")
	limitStr := c.Query("limit")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit
	query = query.Offset(offset).Limit(limit)

	if err := query.Find(&users).Error; err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, users)
}

// @Summary Create a new user
// @Description Create a new user with validation
// @Accept json
// @Produce json
// @Param user body UserResponse true "User data"
// @Success 201 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /users [post]
func CreateUser(c *gin.Context) {
	var user gorm.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.Error(err)
		return
	}

	err := gorm.InsertUser(gorm.Conn, user.Name, user.Age)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}

// @Summary Update an existing user by ID
// @Description Update an existing user by ID
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param user body UserResponse true "User data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /users/{id} [put]
func UpdateUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)

	var user gorm.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.Error(err)
		return
	}

	err2 := gorm.UpdateUser(gorm.Conn, id, user.Name, user.Age)
	if err2 != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

// @Summary Delete a user by ID
// @Description Delete a user by ID
// @Param id path int true "User ID"
// @Success 204
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /users/{id} [delete]
func DeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32) // конвертация id в uint64
	if err != nil {
		c.Error(err)
		return
	}

	err = gorm.DeleteUser(gorm.Conn, id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
