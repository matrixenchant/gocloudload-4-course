package utils

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

var validate = validator.New()

func ValidateBody(c *fiber.Ctx, data interface{}) error {
	if err := c.BodyParser(data); err != nil {
		return err
	}

	if err := validate.Struct(data); err != nil {
		return err
	}

	return nil
}
