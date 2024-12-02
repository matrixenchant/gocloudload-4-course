package modules

import (
	"e-commerce/src/models"
	"e-commerce/src/utils"

	"github.com/gofiber/fiber/v2"
)

type cartItemDto struct {
	CartID    uint `json:"cart_id" validate:"required"`
	ProductID uint `json:"product_id" validate:"required"`
	Quantity  int  `json:"quantity" validate:"required,min=1"`
}

type cartItemUpdateDto struct {
	CartID    uint `json:"cart_id"`
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity" validate:"min=1"`
}

func CreateCartItem(c *fiber.Ctx) error {
	var cartItemData cartItemDto
	if err := utils.ValidateBody(c, &cartItemData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var product models.Product
	if err := utils.DB.First(&product, cartItemData.ProductID).Error; err != nil {
		return utils.BadRequest(c, "Product not found", err.Error())
	}

	cartItem := models.CartItem{
		CartID:    cartItemData.CartID,
		ProductID: cartItemData.ProductID,
		Quantity:  cartItemData.Quantity,
	}

	if err := utils.DB.Create(&cartItem).Error; err != nil {
		return utils.BadRequest(c, "Error creating cart item", err.Error())
	}

	return c.JSON(cartItem)
}

func GetCartItem(c *fiber.Ctx) error {
	cartItemID := c.Params("id")

	var cartItem models.CartItem
	if err := utils.DB.First(&cartItem, cartItemID).Error; err != nil {
		return utils.NotFound(c, "Cart item not found", err.Error())
	}

	return c.JSON(cartItem)
}

func GetAllCartItems(c *fiber.Ctx) error {
	var cartItems []models.CartItem
	if err := utils.DB.Find(&cartItems).Error; err != nil {
		return utils.BadRequest(c, "Error retrieving cart items", err.Error())
	}

	return c.JSON(cartItems)
}

func UpdateCartItem(c *fiber.Ctx) error {
	cartItemID := c.Params("id")

	var cartItemData cartItemUpdateDto
	if err := utils.ValidateBody(c, &cartItemData); err != nil {
		return err
	}

	var cartItem models.CartItem
	if err := utils.DB.First(&cartItem, cartItemID).Error; err != nil {
		return utils.NotFound(c, "Cart item not found", err.Error())
	}

	if cartItemData.CartID > 0 {
		cartItem.CartID = cartItemData.CartID
	}
	if cartItemData.ProductID > 0 {
		var product models.Product
		if err := utils.DB.First(&product, cartItemData.ProductID).Error; err != nil {
			return utils.NotFound(c, "Product not found", err.Error())
		}
		cartItem.ProductID = cartItemData.ProductID
	}
	if cartItemData.Quantity > 0 {
		cartItem.Quantity = cartItemData.Quantity
	}

	if err := utils.DB.Save(&cartItem).Error; err != nil {
		return utils.BadRequest(c, "Error updating cart item", err.Error())
	}

	return c.JSON(cartItem)
}

func DeleteCartItem(c *fiber.Ctx) error {
	cartItemID := c.Params("id")

	var cartItem models.CartItem
	if err := utils.DB.First(&cartItem, cartItemID).Error; err != nil {
		return utils.NotFound(c, "Cart item not found", err.Error())
	}

	if err := utils.DB.Delete(&cartItem).Error; err != nil {
		return utils.BadRequest(c, "Error deleting cart item", err.Error())
	}

	return c.JSON(fiber.Map{"message": "Cart item deleted successfully"})
}
