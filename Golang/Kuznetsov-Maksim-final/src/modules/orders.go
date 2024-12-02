package modules

import (
	"e-commerce/src/models"
	"e-commerce/src/utils"
	"time"

	"github.com/gofiber/fiber/v2"
)

type orderCreateDto struct {
	CartID uint `json:"cart_id" validate:"required"`
}

type orderUpdateDto struct {
	Status string `json:"status" validate:"required"`
}

func CreateOrder(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	var orderData orderCreateDto
	if err := utils.ValidateBody(c, &orderData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var cart models.ShoppingCart
	if err := utils.DB.Preload("Items.Product").Where("user_id = ?", userContext.UserID).First(&cart, orderData.CartID).Error; err != nil {
		return utils.NotFound(c, "Shopping cart not found", err.Error())
	}

	if len(cart.Items) == 0 {
		return utils.BadRequest(c, "Cart is empty", "")
	}

	var totalAmount float64
	for _, item := range cart.Items {
		totalAmount += item.Product.Price * float64(item.Quantity)
	}

	order := models.Order{
		UserID:      cart.UserID,
		OrderDate:   time.Now(),
		Status:      "PENDING",
		TotalAmount: totalAmount,
		CartID:      cart.CartID,
	}

	if err := utils.DB.Create(&order).Error; err != nil {
		return utils.BadRequest(c, "Error creating order", err.Error())
	}

	return c.JSON(order)
}

func GetOrder(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}
	orderID := c.Params("id")

	var order models.Order
	if err := utils.DB.Where("user_id = ?", userContext.UserID).Where("order_id = ?", orderID).First(&order, orderID).Error; err != nil {
		return utils.NotFound(c, "Order not found", err.Error())
	}

	return c.JSON(order)
}

func GetMyAllOrders(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	var orders []models.Order
	if err := utils.DB.Preload("Payment").Where("user_id = ?", userContext.UserID).Find(&orders).Error; err != nil {
		return utils.BadRequest(c, "Error retrieving orders", err.Error())
	}

	return c.JSON(orders)
}

func UpdateOrder(c *fiber.Ctx) error {
	orderID := c.Params("id")

	var orderData orderUpdateDto
	if err := utils.ValidateBody(c, &orderData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var order models.Order
	if err := utils.DB.First(&order, orderID).Error; err != nil {
		return utils.NotFound(c, "Order not found", err.Error())
	}

	order.Status = orderData.Status

	if err := utils.DB.Save(&order).Error; err != nil {
		return utils.BadRequest(c, "Error updating order", err.Error())
	}

	return c.JSON(order)
}

func CancelOrder(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}
	orderID := c.Params("id")

	var order models.Order
	if err := utils.DB.First(&order, orderID).Error; err != nil {
		return utils.NotFound(c, "Order not found", err.Error())
	}

	if order.UserID != userContext.UserID {
		return utils.Forbidden(c, "Forbidden", "You are not authorized to see this shopping cart")
	}

	if order.Status == "CANCELLED" {
		return utils.BadRequest(c, "Order already cancelled", "")
	}

	order.Status = "CANCELLED"

	if err := utils.DB.Save(&order).Error; err != nil {
		return utils.BadRequest(c, "Error updating order", err.Error())
	}

	return c.JSON(order)
}

func PayOrder(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}
	orderID := c.Params("id")

	var order models.Order
	if err := utils.DB.First(&order, orderID).Error; err != nil {
		return utils.NotFound(c, "Order not found", err.Error())
	}

	if order.UserID != userContext.UserID {
		return utils.Forbidden(c, "Forbidden", "You are not authorized to see this shopping cart")
	}

	if order.Status == "FILLED" {
		return utils.BadRequest(c, "Order already payed", "")
	}

	order.Status = "FILLED"

	if err := utils.DB.Save(&order).Error; err != nil {
		return utils.BadRequest(c, "Error updating order", err.Error())
	}

	payment := models.Payment{
		OrderID:       order.OrderID,
		Amount:        order.TotalAmount,
		PaymentMethod: "CREDIT_CARD",
	}

	if err := utils.DB.Create(&payment).Error; err != nil {
		return utils.BadRequest(c, "Error creating payment", err.Error())
	}

	return c.JSON(payment)
}
