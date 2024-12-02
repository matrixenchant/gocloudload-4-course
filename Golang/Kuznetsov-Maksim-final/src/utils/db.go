package utils

import (
	"e-commerce/src/models"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	dsn := os.Getenv("DATABASE_URL")
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	err = DB.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.Category{},
		&models.Order{},
		// &models.OrderItem{},
		&models.CartItem{},
		&models.ShoppingCart{},
		&models.Payment{},
		&models.Review{},
		&models.Role{},
		&models.UserAddress{},
		&models.ProductImage{},
		&models.AuditLog{},
		&models.Cache{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
}

func CloseDB() {
	dbInstance, err := DB.DB()
	if err != nil {
		log.Println("Failed to retrieve database instance:", err)
		return
	}
	if err := dbInstance.Close(); err != nil {
		log.Println("Failed to close database connection:", err)
	}
	log.Println("Database connection closed.")
}
