package user

import (
	m "midterm/internal"

	"gorm.io/gorm"
)

func CreateUser(db *gorm.DB, user m.User) error {
	if err := db.Create(&user).Error; err != nil {
		return err
	}
	return nil
}

func ReadUsers(db *gorm.DB) ([]m.User, error) {
	var users []m.User
	if err := db.Preload("Tasks").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func GetUserById(db *gorm.DB, id string) (m.User, error) {
	var user m.User
	if err := db.Preload("Tasks").First(&user, id).Error; err != nil {
		return user, err
	}
	return user, nil
}

func UpdateUser(db *gorm.DB, id string, updatedUser m.User) error {
	var user m.User
	if err := db.First(&user, id).Error; err != nil {
		return err
	}
	user.Name = updatedUser.Name
	if err := db.Save(&user).Error; err != nil {
		return err
	}
	return nil
}

func DeleteUser(db *gorm.DB, id string) error {
	if err := db.Delete(&m.User{}, id).Error; err != nil {
		return err
	}
	return nil
}
