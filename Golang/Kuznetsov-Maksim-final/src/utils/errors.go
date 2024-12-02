package utils

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

func ErrorResponse(c *fiber.Ctx, statusCode int, msg string, err string) error {
	fmt.Printf("ERROR [%s] %d %s: %s\n", time.Now().UTC().Format(time.RFC3339), statusCode, msg, err)

	return c.Status(statusCode).JSON(fiber.Map{
		"message":    msg,
		"error":      err,
		"statusCode": statusCode,
		"timestamp":  time.Now().UTC().Format(time.RFC3339),
		"path":       c.Path(),
	})
}

func NotFound(c *fiber.Ctx, msg string, err string) error {
	return ErrorResponse(c, 404, msg, err)
}

func BadRequest(c *fiber.Ctx, msg string, err string) error {
	return ErrorResponse(c, 400, msg, err)
}

func Unauthorized(c *fiber.Ctx, msg string, err string) error {
	return ErrorResponse(c, 401, msg, err)
}

func Forbidden(c *fiber.Ctx, msg string, err string) error {
	return ErrorResponse(c, 403, msg, err)
}
