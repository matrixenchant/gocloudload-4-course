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

func UpdateUser(db *gorm.DB, id uint64, name string, age int) error {
	user := User{}
	result := db.First(&user, id)
	if result.Error != nil {
		return result.Error
	}

	user.Name = name
	user.Age = age
	result = db.Save(&user)
	if result.Error != nil {
		return result.Error
	}

	fmt.Printf("User %s updated successfully.\n", name)
	return nil
}

func DeleteUser(db *gorm.DB, id uint64) error {
	result := db.Delete(&User{}, id)
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
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

// Advanced
func InsertUserWithProfile(db *gorm.DB, user User) (uint64, error) {
	if err := db.Create(&user).Error; err != nil {
			return 0, err
	}

	fmt.Printf("Inserted User: %+v\n", user)
	return user.ID, nil
}

func GetUsersWithProfiles(db *gorm.DB) ([]User, error) {
	var users []User
	err := db.Preload("Profile").Find(&users).Error
	if err != nil {
		return nil, err
	}

	for _, user := range users {
		fmt.Printf("User: %+v, Profile: %+v\n", user, user.Profile)
	}

	return users, nil
}

func UpdateUserWithProfile(db *gorm.DB, userID uint64, updatedUser User) error {
	if err := db.Model(&User{ID: userID}).Updates(User{
		Name: updatedUser.Name,
		Age:  updatedUser.Age,
		Profile: Profile{
			Bio:              updatedUser.Profile.Bio,
			ProfilePictureURL: updatedUser.Profile.ProfilePictureURL,
		},
	}).Error; err != nil {
		return err
	}

	fmt.Printf("Updated User with ID: %d\n", userID)
	return nil
}

func DeleteUserWithProfile(db *gorm.DB, userID uint64) error {
	if err := db.Delete(&User{}, userID).Error; err != nil {
		return err
	}

	fmt.Printf("Deleted User with ID: %d\n", userID)
	return nil
}
