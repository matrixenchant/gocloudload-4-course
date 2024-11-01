package user

import (
	m "assigment3/internal"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

func generateJWT(user m.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": user.Username,
		"role":     user.Role,
		"exp":      time.Now().Add(time.Hour * 72).Unix(),
	})
	return token.SignedString(m.JwtSecret)
}
