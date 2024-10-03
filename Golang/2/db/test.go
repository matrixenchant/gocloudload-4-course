package db

import (
	"database/sql"
	"fmt"
)

func CreateTable(db *sql.DB) error {
	query := `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
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

// ADVANCED
func InsertUsers(db *sql.DB, users []struct {
	name string
	age  int
}) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	query := `INSERT INTO users (name, age) VALUES ($1, $2)`
	for _, user := range users {
		_, err := tx.Exec(query, user.name, user.age)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func QueryUsersAdvanced(db *sql.DB, ageFilter int, limit, offset int) error {
	var rows *sql.Rows
	var err error

	if ageFilter > 0 {
		query := `SELECT id, name, age FROM users WHERE age = $1 LIMIT $2 OFFSET $3`
		rows, err = db.Query(query, ageFilter, limit, offset)
	} else {
		query := `SELECT id, name, age FROM users LIMIT $1 OFFSET $2`
		rows, err = db.Query(query, limit, offset)
	}

	if err != nil {
		return fmt.Errorf("Failed to query users: %s", err)
	}
	defer rows.Close()

	fmt.Println("Users:")
	for rows.Next() {
		var id int
		var name string
		var age int
		if err := rows.Scan(&id, &name, &age); err != nil {
			return err
		}
		fmt.Printf("ID: %d, Name: %s, Age: %d\n", id, name, age)
	}
	return rows.Err()
}

func DeleteUser(db *sql.DB, id int) error {
	query := `DELETE FROM users WHERE id = $1`
	result, err := db.Exec(query, id)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("no user found with ID %d", id)
	}
	fmt.Printf("User with ID %d deleted.\n", id)
	return nil
}

func UpdateUser(db *sql.DB, id int, name string, age int) error {
	query := `UPDATE users SET name = $1, age = $2 WHERE id = $3`
	result, err := db.Exec(query, name, age, id)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("no user found with ID %d", id)
	}
	fmt.Printf("User with ID %d updated.\n", id)
	return nil
}
