package models

import (
	"time"
)

type User struct {
	UserID       uint      `gorm:"primaryKey" json:"user_id"`
	Username     string    `gorm:"unique;not null" json:"username"`
	PasswordHash string    `gorm:"not null" json:"password_hash"`
	Email        string    `gorm:"unique;not null" json:"email"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	Role         string    `gorm:"not null" json:"role"`

	Reviews []Review       `gorm:"foreignKey:UserID" json:"-"`
	Carts   []ShoppingCart `gorm:"foreignKey:UserID" json:"-"`
	Orders  []Order        `gorm:"foreignKey:UserID" json:"-"`
}

type Product struct {
	ProductID   uint      `gorm:"primaryKey" json:"product_id"`
	Name        string    `gorm:"not null" json:"name"`
	Description string    `json:"description"`
	Price       float64   `gorm:"not null" json:"price"`
	Stock       int       `gorm:"not null" json:"stock"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`

	CategoryID uint     `gorm:"not null" json:"category_id"`
	Category   Category `json:"category"`

	Reviews []Review       `gorm:"foreignKey:ProductID" json:"reviews"`
	Images  []ProductImage `gorm:"foreignKey:ProductID" json:"images"`
}

type Category struct {
	CategoryID  uint      `gorm:"primaryKey" json:"category_id"`
	Name        string    `gorm:"unique;not null" json:"name"`
	Description string    `json:"description"`
	Products    []Product `gorm:"foreignKey:CategoryID" json:"-"`
}

type Review struct {
	ReviewID uint `gorm:"primaryKey" json:"review_id"`

	ProductID uint    `gorm:"not null" json:"product_id"`

	UserID uint `gorm:"not null" json:"user_id"`
	User   User `json:"user"`

	Rating    int       `gorm:"not null" json:"rating"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

// ORDERS

type Order struct {
	OrderID     uint      `gorm:"primaryKey" json:"order_id"`
	UserID      uint      `gorm:"not null" json:"user_id"`
	OrderDate   time.Time `gorm:"autoCreateTime" json:"order_date"`

	// PENDING | CANCELLED | FILLED
	Status      string    `gorm:"not null" json:"status"`
	TotalAmount float64   `gorm:"not null" json:"total_amount"`

	CartID uint `gorm:"not null" json:"cart_id"`

	Payment Payment `gorm:"foreignKey:OrderID" json:"payment"`
}

// type OrderItem struct {
// 	OrderItemID uint    `gorm:"primaryKey" json:"order_item_id"`
// 	OrderID     uint    `gorm:"not null" json:"order_id"`
// 	ProductID   uint    `gorm:"not null" json:"product_id"`
// 	Quantity    int     `gorm:"not null" json:"quantity"`
// 	Price       float64 `gorm:"not null" json:"price"`
// }

type ShoppingCart struct {
	CartID    uint       `gorm:"primaryKey" json:"cart_id"`
	CreatedAt time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UserID    uint       `gorm:"not null" json:"user_id"`
	IsShown   bool       `gorm:"default:true" json:"is_shown"`
	Items     []CartItem `gorm:"foreignKey:CartID" json:"items"`
	Order     Order      `gorm:"foreignKey:CartID" json:"-"`
}

type CartItem struct {
	CartItemID uint `gorm:"primaryKey" json:"cart_item_id"`
	Quantity   int  `gorm:"not null" json:"quantity"`

	ProductID uint `gorm:"not null" json:"product_id"`
	Product   Product `json:"product"`
	CartID uint `gorm:"not null" json:"cart_id"`
}

type Payment struct {
	PaymentID     uint      `gorm:"primaryKey" json:"payment_id"`
	OrderID       uint      `gorm:"not null" json:"order_id"`
	Amount        float64   `gorm:"not null" json:"amount"`
	PaymentDate   time.Time `gorm:"autoCreateTime" json:"payment_date"`
	PaymentMethod string    `gorm:"not null" json:"payment_method"`
}

// type Session struct {
// 	SessionID uint      `gorm:"primaryKey" json:"session_id"`
// 	UserID    uint      `gorm:"not null" json:"user_id"`
// 	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
// 	ExpiresAt time.Time `gorm:"not null" json:"expires_at"`
// }

type Role struct {
	RoleID   uint   `gorm:"primaryKey" json:"role_id"`
	RoleName string `gorm:"unique;not null" json:"role_name"`
}

type UserAddress struct {
	AddressID uint   `gorm:"primaryKey" json:"address_id"`
	UserID    uint   `gorm:"not null" json:"user_id"`
	Street    string `gorm:"not null" json:"street"`
	City      string `gorm:"not null" json:"city"`
	State     string `gorm:"not null" json:"state"`
	ZipCode   string `gorm:"not null" json:"zip_code"`
}

type ProductImage struct {
	ImageID   uint      `gorm:"primaryKey" json:"image_id"`
	ProductID uint      `gorm:"not null" json:"product_id"`
	ImageURL  string    `gorm:"not null" json:"image_url"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type AuditLog struct {
	LogID     uint      `gorm:"primaryKey" json:"log_id"`
	Action    string    `gorm:"not null" json:"action"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	Timestamp time.Time `gorm:"autoCreateTime" json:"timestamp"`
}

type Cache struct {
	CacheKey       string    `gorm:"primaryKey" json:"cache_key"`
	CacheValue     string    `gorm:"not null" json:"cache_value"`
	ExpirationTime time.Time `gorm:"not null" json:"expiration_time"`
}
