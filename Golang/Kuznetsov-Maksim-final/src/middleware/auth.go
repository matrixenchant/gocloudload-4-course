package middleware

import (
	"e-commerce/src/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return utils.Forbidden(c, "Missing Authorization header", "")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return utils.Forbidden(c, "Invalid Authorization header format", "")
	}

	tokenString := parts[1]

	claims, err := utils.ValidateJWT(tokenString)
	if err != nil {
		return utils.Forbidden(c, "Invalid or expired token", "")
	}

	c.Locals("userID", claims.UserID)
	c.Locals("role", claims.Role)

	return c.Next()
}
