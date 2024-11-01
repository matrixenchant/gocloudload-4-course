package book

import (
	"fmt"
	"net/http"
	"strconv"

	m "assigment3/internal"

	"github.com/gin-gonic/gin"
)

var books = []m.Book{
	{ID: 1, Title: "Book One", Author: "Author One", Description: "First book description"},
	{ID: 2, Title: "Book Two", Author: "Author Two", Description: "Second book description"},
}
var nextID = 3

func SetupRoutes(router *gin.Engine) {
	router.GET("/books", getBooks)
	router.GET("/books/:id", getBookByID)

	router.POST("/books", m.AuthMiddleware, createBook)
	router.PUT("/books/:id", m.AuthMiddleware, updateBook)
	router.DELETE("/books/:id", m.AuthMiddleware, deleteBook)
}

func createBook(c *gin.Context) {
	role, exists := c.Get("role")
	fmt.Println(role)
	if role != "admin" || !exists {
		c.JSON(http.StatusForbidden, gin.H{"message": "Dont have permissions"})
		return
	}

	var newBook m.Book
	if err := c.ShouldBindJSON(&newBook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if newBook.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Title is required"})
		return
	}

	if newBook.Description == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Description is required"})
		return
	}

	newBook.ID = nextID
	nextID++
	books = append(books, newBook)
	c.JSON(http.StatusCreated, newBook)
}

func getBooks(c *gin.Context) {
	c.JSON(http.StatusOK, books)
}

func getBookByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	for _, book := range books {
		if book.ID == id {
			c.JSON(http.StatusOK, book)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"message": "Book not found"})
}

func updateBook(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	var updatedBook m.Book
	if err := c.ShouldBindJSON(&updatedBook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if updatedBook.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Title is required"})
		return
	}

	if updatedBook.Description == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Description is required"})
		return
	}

	for i, book := range books {
		if book.ID == id {
			books[i].Title = updatedBook.Title
			books[i].Author = updatedBook.Author
			books[i].Description = updatedBook.Description
			c.JSON(http.StatusOK, books[i])
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"message": "Book not found"})
}

func deleteBook(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	for i, book := range books {
		if book.ID == id {
			books = append(books[:i], books[i+1:]...)
			c.JSON(http.StatusNoContent, nil)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"message": "Book not found"})
}
