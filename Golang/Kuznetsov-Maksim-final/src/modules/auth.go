package modules

import (
	"e-commerce/src/models"
	"e-commerce/src/utils"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type userRegister struct {
	Username string `json:"username" validate:"required,min=3,max=32"`
	Password string `json:"password" validate:"required,min=6"`
	Email    string `json:"email" validate:"required,email"`
}

func Register(c *fiber.Ctx) error {
	var registerData userRegister
	if err := utils.ValidateBody(c, &registerData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var user models.User
	user.Username = registerData.Username
	user.Email = registerData.Email
	user.Role = "user"

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerData.Password), bcrypt.DefaultCost)
	if err != nil {
		return utils.BadRequest(c, "Error hashing password", err.Error())
	}
	user.PasswordHash = string(hashedPassword)

	if err := utils.DB.Create(&user).Error; err != nil {
		return utils.BadRequest(c, "Error registering user", err.Error())
	}

	token, err := utils.GenerateJWT(user.UserID, user.Role)
	if err != nil {
		return utils.BadRequest(c, "Error generating JWT token", err.Error())
	}

	return c.JSON(fiber.Map{
		"token": token,
		"user":  user,
	})
}

type userLogin struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

func Login(c *fiber.Ctx) error {
	var loginData userLogin
	if err := utils.ValidateBody(c, &loginData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var user models.User
	if err := utils.DB.Where("username = ?", loginData.Username).First(&user).Error; err != nil {
		return utils.BadRequest(c, "User not found", err.Error())
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginData.Password)); err != nil {
		return utils.Unauthorized(c, "Invalid password", err.Error())
	}

	token, err := utils.GenerateJWT(user.UserID, user.Role)
	if err != nil {
		return utils.BadRequest(c, "Error generating JWT token", err.Error())
	}

	return c.JSON(fiber.Map{
		"token": token,
		"user":  user,
	})
}
