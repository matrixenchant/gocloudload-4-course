package internal

type User struct {
	ID    uint   `json:"id" gorm:"primaryKey"`
	Name  string `json:"name"`
	Tasks []Task `json:"tasks" gorm:"foreignKey:UserID"`
}

type Task struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Title       string `json:"title" gorm:"not null"`
	Description string `json:"description"`
	Status      string `json:"status"`

	UserID uint `json:"userID"`
	User   User `json:"user"`
}
