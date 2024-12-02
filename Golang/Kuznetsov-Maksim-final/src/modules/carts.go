package modules

import (
	"e-commerce/src/models"
	"e-commerce/src/utils"

	"github.com/gofiber/fiber/v2"
)

type shoppingCartDto struct {
	UserID uint `json:"user_id" validate:"required"`
}

func CreateShoppingCart(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	shoppingCart := models.ShoppingCart{
		UserID: userContext.UserID,
	}

	if err := utils.DB.Create(&shoppingCart).Error; err != nil {
		return utils.BadRequest(c, "Error creating shopping cart", err.Error())
	}

	return c.JSON(shoppingCart)
}

func GetAllShoppingCarts(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	var shoppingCarts []models.ShoppingCart
	if err := utils.DB.Where("user_id = ?", userContext.UserID).Find(&shoppingCarts).Error; err != nil {
		return utils.NotFound(c, "Error fetchin shopping carts", err.Error())
	}

	return c.JSON(shoppingCarts)
}

func GetShoppingCart(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	cartID := c.Params("id")

	var shoppingCart models.ShoppingCart
	if err := utils.DB.Preload("Items.Product").First(&shoppingCart, cartID).Error; err != nil {
		return utils.NotFound(c, "Shopping cart not found", err.Error())
	}

	if shoppingCart.UserID != userContext.UserID {
		return utils.Forbidden(c, "Forbidden", "You are not authorized to see this shopping cart")
	}

	return c.JSON(shoppingCart)
}

func DeleteShoppingCart(c *fiber.Ctx) error {
	cartID := c.Params("id")

	var shoppingCart models.ShoppingCart
	if err := utils.DB.First(&shoppingCart, cartID).Error; err != nil {
		return utils.NotFound(c, "Shopping cart not found", err.Error())
	}

	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	if shoppingCart.UserID != userContext.UserID {
		return utils.Forbidden(c, "Forbidden", "You are not authorized to delete this shopping cart")
	}

	if err := utils.DB.Where("cart_id = ?", shoppingCart.CartID).Delete(&models.CartItem{}).Error; err != nil {
		return utils.BadRequest(c, "Error deleting cart items", err.Error())
	}

	if err := utils.DB.Delete(&shoppingCart).Error; err != nil {
		return utils.BadRequest(c, "Error deleting shopping cart", err.Error())
	}

	return c.JSON(fiber.Map{"message": "Shopping cart deleted successfully"})
}
