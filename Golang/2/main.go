package main

import (
	"app/db"
	"app/gorm"
	"fmt"
)

func main() {

	//

	conn, err := db.Connect()

	if err != nil {
		fmt.Print("Error: " + err.Error())
		return
	}

	db.CreateTable(conn)

	db.InsertUser(conn, "John", 19)
	db.InsertUser(conn, "John2", 54)
	db.InsertUser(conn, "John3", 26)
	db.InsertUser(conn, "John4", 43)

	// db.QueryUsers(conn)
	if err := db.QueryUsersAdvanced(conn, 19, 10, 0); err != nil {
		fmt.Println("Failed to query users: %s", err)
	}

	db.ClearTable(conn)

	// GORM
	fmt.Println(" \n\n\n ================ \n\n\n ")

	gormConn, gormErr := gorm.Connect()

	if gormErr != nil {
		fmt.Print("Error: " + gormErr.Error())
		return
	}

	gorm.InsertUser(gormConn, "Gorm_User1", 224)
	gorm.InsertUser(gormConn, "Gorm_User2", 322)
	gorm.InsertUser(gormConn, "Gorm_User3", 441)

	user := gorm.User{
		Name: "John Doe With Profile",
		Age:  30,
		Profile: gorm.Profile{
			Bio:               "Software developer",
			ProfilePictureURL: "http://example.com/pic.jpg",
		},
	}

	id, err := gorm.InsertUserWithProfile(gormConn, user)

	// gorm.QueryUsers(gormConn)
	gorm.GetUsersWithProfiles(gormConn)

	gorm.DeleteUserWithProfile(gormConn, id)

	gorm.ClearTable(gormConn)
}
