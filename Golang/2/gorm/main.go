package gorm

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Conn *gorm.DB

func Connect() (*gorm.DB, error) {
	dsn := "host=localhost user=postgres password=root dbname=gotest port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&User{}, &Profile{})
	if err != nil {
		return nil, err
	}

	Conn = db

	return db, nil
}