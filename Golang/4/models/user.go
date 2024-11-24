package models

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Username string `json:"username" validate:"required,min=3,max=20,alphanum"`
	Password string `json:"password" validate:"required,min=6"`
	Role     string `json:"role" validate:"oneof=user manager admin"`

	Age   uint8  `validate:"gte=0,lte=130"`
	Email string `validate:"required,email"`
}

var DB *sql.DB

func CheckCredentials(user User) bool {
	var hashedPassword string
	err := DB.QueryRow("SELECT password FROM users WHERE username=$1", user.Username).Scan(&hashedPassword)
	if err != nil {
		return false
	}

	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(user.Password)) == nil
}

func InitDB() *sql.DB {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		"localhost", "5432", "postgres", "root", "postgres")

	// Подключение к базе данных
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	// Проверка подключения
	if err := db.Ping(); err != nil {
		log.Fatalf("Database ping failed: %v", err)
	}

	log.Println("Connected to the database successfully")
	DB = db
	return db
}

func CreateUser(user *User) error {
	query := `INSERT INTO users (username, password, email) VALUES ($1, $2, $3)`
	_, err := DB.Exec(query, user.Username, user.Password, user.Email)
	if err != nil {
		return fmt.Errorf("error inserting user: %v", err.Error())
	}
	return nil
}
