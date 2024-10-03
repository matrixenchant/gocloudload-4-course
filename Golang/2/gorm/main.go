package gorm

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Conn *gorm.DB

func Connect() (*gorm.DB, error) {
	dsn := "host=localhost user=postgres password=postgres dbname=template1 port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Автоматическая миграция
	err = db.AutoMigrate(&User{})
	if err != nil {
		return nil, err
	}

	Conn = db

	return db, nil
}