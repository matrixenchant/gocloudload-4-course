package db

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

const (
    host     = "localhost"
    port     = 5432
    user     = "postgres"
    password = "root"
    dbname   = "gotest"
)

var Conn *sql.DB

func Connect() (*sql.DB, error) {
    psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
        host, port, user, password, dbname)

    db, err := sql.Open("postgres", psqlInfo)
    if err != nil {
        return nil, err
    }

    db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(0)

    // Verify connection
    err = db.Ping()
    if err != nil {
        return nil, err
    }

    Conn = db

	fmt.Println("Database connected succesfully.")

    return db, nil
}