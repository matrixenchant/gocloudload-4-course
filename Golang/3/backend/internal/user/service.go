package user

import (
	m "assigment3/internal"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

var users = []m.User{
	{ID: 1, Username: "admin", Password: "$2a$10$YE8V2Kn2QeggjlyfFMpRfOa8PYQAqcK5Nhxk.E1OgnucA9c6ALd/y", Role: "user"}, // admin
}
var nextUserID = 2

func SetupRoutes(router *gin.Engine) {
	router.POST("/login", loginUser)
	router.POST("/register", registerUser)

	router.GET("/users", getAll)
}

func registerUser(c *gin.Context) {
	var newUser m.User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if userExists(users, newUser.Username) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "User already exist"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to hash password"})
		return
	}
	newUser.Password = string(hashedPassword)
	newUser.ID = nextUserID
	newUser.Role = "user"
	nextUserID++

	users = append(users, newUser)

	token, err := generateJWT(newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"token": token, "user": newUser})
}

func loginUser(c *gin.Context) {
	var creds m.User
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}


	var user m.User
	for _, u := range users {
		if u.Username == creds.Username {
			user = u
			break
		}
	}

	if user.ID == 0 || bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid username or password"})
		return
	}

	token, err := generateJWT(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}

func getAll(c *gin.Context) {
	c.JSON(http.StatusOK, users)
}


func userExists(users []m.User, username string) bool {
	for _, user := range users {
		if user.Username == username {
			return true
		}
	}
	return false
}