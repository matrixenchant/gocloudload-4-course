package modules

import (
	"e-commerce/src/models"
	"e-commerce/src/utils"
	"github.com/gofiber/fiber/v2"
	"time"
)

type paymentUpdateDto struct {
	Amount        float64 `json:"amount" validate:"required,min=0"`
	PaymentMethod string  `json:"payment_method" validate:"required"`
}

func CreatePayment(c *fiber.Ctx) error {
	var paymentData models.Payment
	if err := utils.ValidateBody(c, &paymentData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var order models.Order
	if err := utils.DB.First(&order, paymentData.OrderID).Error; err != nil {
		return utils.NotFound(c, "Order not found", err.Error())
	}

	// Create the payment record
	payment := models.Payment{
		OrderID:      paymentData.OrderID,
		Amount:       paymentData.Amount,
		PaymentDate:  time.Now(),
		PaymentMethod: paymentData.PaymentMethod,
	}

	if err := utils.DB.Create(&payment).Error; err != nil {
		return utils.BadRequest(c, "Error creating payment", err.Error())
	}

	return c.JSON(payment)
}

func GetPayment(c *fiber.Ctx) error {
	paymentID := c.Params("id")

	var payment models.Payment
	if err := utils.DB.First(&payment, paymentID).Error; err != nil {
		return utils.NotFound(c, "Payment not found", err.Error())
	}

	return c.JSON(payment)
}

func GetAllPayments(c *fiber.Ctx) error {
	var payments []models.Payment
	if err := utils.DB.Find(&payments).Error; err != nil {
		return utils.BadRequest(c, "Error retrieving payments", err.Error())
	}

	return c.JSON(payments)
}

func UpdatePayment(c *fiber.Ctx) error {
	paymentID := c.Params("id")

	var paymentData paymentUpdateDto
	if err := utils.ValidateBody(c, &paymentData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var payment models.Payment
	if err := utils.DB.First(&payment, paymentID).Error; err != nil {
		return utils.NotFound(c, "Payment not found", err.Error())
	}

	// Update fields
	payment.Amount = paymentData.Amount
	payment.PaymentMethod = paymentData.PaymentMethod

	if err := utils.DB.Save(&payment).Error; err != nil {
		return utils.BadRequest(c, "Error updating payment", err.Error())
	}

	return c.JSON(payment)
}

func DeletePayment(c *fiber.Ctx) error {
	paymentID := c.Params("id")

	var payment models.Payment
	if err := utils.DB.First(&payment, paymentID).Error; err != nil {
		return utils.NotFound(c, "Payment not found", err.Error())
	}

	if err := utils.DB.Delete(&payment).Error; err != nil {
		return utils.BadRequest(c, "Error deleting payment", err.Error())
	}

	return c.JSON(fiber.Map{"message": "Payment deleted successfully"})
}
