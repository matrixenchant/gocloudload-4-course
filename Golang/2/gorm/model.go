package gorm

// @Description User model for storing user data
// @ID User
// @Property id integer true "User ID"
// @Property name string true "User name"
// @Property age integer true "User age"
// @Property profile Profile true "User profile"
type User struct {
	ID   uint64 `gorm:"primaryKey"`
	Name string `gorm:"uniqueIndex" json:"name"`
	Age  int    `json:"age"`

	Profile Profile `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// @Description User profile information
// @ID Profile
// @Property bio string true "User biography"
// @Property website string false "User website URL"
type Profile struct {
	ID                uint   `gorm:"primaryKey"`
	UserID            uint   `gorm:"index"`
	Bio               string `json:"bio"`
	ProfilePictureURL string `json:"picture"`
}
