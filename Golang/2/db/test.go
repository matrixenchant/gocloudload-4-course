package db

import (
	"database/sql"
	"fmt"
)

func CreateTable(db *sql.DB) error {
    query := `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INT NOT NULL
    );`

    _, err := db.Exec(query)
    if err != nil {
        return fmt.Errorf("error creating table: %v", err)
    }

    fmt.Println("Table 'users' created successfully.")
    return nil
}

func InsertUser(db *sql.DB, name string, age int) error {
    query := `
    INSERT INTO users (name, age)
    VALUES ($1, $2);`

    _, err := db.Exec(query, name, age)
    if err != nil {
        return fmt.Errorf("error inserting user: %v", err)
    }

    fmt.Printf("User %s inserted successfully.\n", name)
    return nil
}

func QueryUsers(db *sql.DB) error {
    query := `
    SELECT id, name, age FROM users;`

    rows, err := db.Query(query)
    if err != nil {
        return fmt.Errorf("error querying users: %v", err)
    }
    defer rows.Close()

    fmt.Println("Users:")
    for rows.Next() {
        var id int
        var name string
        var age int
        err := rows.Scan(&id, &name, &age)
        if err != nil {
            return fmt.Errorf("error scanning row: %v", err)
        }
        fmt.Printf("ID: %d, Name: %s, Age: %d\n", id, name, age)
    }

    if err := rows.Err(); err != nil {
        return fmt.Errorf("error during rows iteration: %v", err)
    }

    return nil
}

func ClearTable(db *sql.DB) error {
    query := `DELETE FROM users;`

    _, err := db.Exec(query)
    if err != nil {
        return fmt.Errorf("error clearing table: %v", err)
    }

    fmt.Println("Table 'users' cleared successfully.")
    return nil
}
