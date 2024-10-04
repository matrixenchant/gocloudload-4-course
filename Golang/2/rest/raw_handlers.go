package main

import (
	"app/db"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RawGetUsers(c *gin.Context) {
	rows, err := db.Conn.Query("SELECT id, name, age FROM users")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer rows.Close()

	var users []map[string]interface{}
	for rows.Next() {
		var id int
		var name string
		var age int
		if err := rows.Scan(&id, &name, &age); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		users = append(users, map[string]interface{}{"id": id, "name": name, "age": age})
	}

	c.JSON(http.StatusOK, users)
}

func RawCreateUser(c *gin.Context) {
	var user struct {
		Name string `json:"name"`
		Age  int    `json:"age"`
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.Conn.Exec("INSERT INTO users (name, age) VALUES ($1, $2)", user.Name, user.Age)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}

func RawUpdateUser(c *gin.Context) {
	id := c.Param("id")

	var user struct {
		Name string `json:"name"`
		Age  int    `json:"age"`
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := db.Conn.Exec("UPDATE users SET name=$1, age=$2 WHERE id=$3", user.Name, user.Age, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func RawDeleteUser(c *gin.Context) {
	id := c.Param("id")

	result, err := db.Conn.Exec("DELETE FROM users WHERE id=$1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// Advanced
func RawAdvancedGetUsers(c *gin.Context) {
	age := c.Query("age")
	sort := c.DefaultQuery("sort", "asc")

	query := "SELECT id, name, age FROM users"
	var args []interface{}

	if age != "" {
		query += " WHERE age = $1"
		args = append(args, age)
	}

	query += fmt.Sprintf(" ORDER BY name %s", sort)

	rows, err := db.Conn.Query(query, args...)
	if err != nil {
		c.Error(err)
		return
	}
	defer rows.Close()

	users := make([]map[string]interface{}, 0)
	for rows.Next() {
		var id int
		var name string
		var age int
		if err := rows.Scan(&id, &name, &age); err != nil {
			c.Error(err)
			return
		}
		users = append(users, map[string]interface{}{"id": id, "name": name, "age": age})
	}

	c.JSON(http.StatusOK, users)
}

func RawAdvancedCreateUser(c *gin.Context) {
	var user struct {
		Name string `json:"name"`
		Age  int    `json:"age"`
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.Error(err)
		return
	}

	_, err := db.Conn.Exec("INSERT INTO users (name, age) VALUES ($1, $2)", user.Name, user.Age)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}