package middleware

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
)

func SetupLogger() *log.Logger {
	file, err := os.OpenFile("app.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatalf("Error opening log file: %s", err)
	}
	return log.New(file, "APP_LOG: ", log.Ldate|log.Ltime|log.Lshortfile)
}

func LoggingMiddleware(logger *log.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if c.Method() == fiber.MethodOptions {
			return c.Next()
		}
		start := time.Now()
		err := c.Next()
		duration := time.Since(start)

		logMessage := fmt.Sprintf("Method: %s, Path: %s, Status: %d, Duration: %v",
			c.Method(), c.Path(), c.Response().StatusCode(), duration)

		logger.Println(logMessage)

		fmt.Println(logMessage)

		return err
	}
}
