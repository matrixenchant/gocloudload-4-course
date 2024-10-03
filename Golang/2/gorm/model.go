package gorm

type User struct {
	ID   uint   `gorm:"primaryKey"`
	Name string
	Age  int
}