package gorm

import (
	"fmt"

	"gorm.io/gorm"
)

func InsertUser(db *gorm.DB, name string, age int) error {
	user := User{Name: name, Age: age}
	result := db.Create(&user)
	if result.Error != nil {
		return result.Error
	}

	fmt.Printf("User %s inserted successfully.\n", name)
	return nil
}

func QueryUsers(db *gorm.DB) error {
	var users []User
	result := db.Find(&users)
	if result.Error != nil {
		return result.Error
	}

	fmt.Println("Users:")
	for _, user := range users {
		fmt.Printf("ID: %d, Name: %s, Age: %d\n", user.ID, user.Name, user.Age)
	}

	return nil
}

func ClearTable(db *gorm.DB) error {
    result := db.Unscoped().Where("1 = 1").Delete(&User{})
    if result.Error != nil {
        return result.Error
    }

    fmt.Println("Table 'users' cleared successfully.")
    return nil
}