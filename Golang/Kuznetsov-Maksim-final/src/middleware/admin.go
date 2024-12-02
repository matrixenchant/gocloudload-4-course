package middleware

import (
	"e-commerce/src/utils"

	"github.com/gofiber/fiber/v2"
)

func AdminMiddleware(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	if userContext.Role != "admin" {
		return utils.Forbidden(c, "Permission denied", "You do not have admin rights")
	}

	return c.Next()
}
