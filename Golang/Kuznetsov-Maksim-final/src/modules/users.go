package modules

import (
	"e-commerce/src/models"
	"e-commerce/src/utils"

	"github.com/gofiber/fiber/v2"
)

type userAddressDto struct {
	Street  string `json:"street" validate:"required,min=3,max=255"`
	City    string `json:"city" validate:"required,min=3,max=255"`
	State   string `json:"state" validate:"required,min=3,max=255"`
	ZipCode string `json:"zip_code" validate:"required,len=6"`
}

func CreateAddress(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	var addressData userAddressDto
	if err := utils.ValidateBody(c, &addressData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	address := models.UserAddress{
		UserID:  userContext.UserID,
		Street:  addressData.Street,
		City:    addressData.City,
		State:   addressData.State,
		ZipCode: addressData.ZipCode,
	}

	if err := utils.DB.Create(&address).Error; err != nil {
		return utils.BadRequest(c, "Error creating address", err.Error())
	}

	return c.JSON(address)
}

func GetAllAddresses(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	var addresses []models.UserAddress
	if err := utils.DB.Where("user_id = ?", userContext.UserID).Find(&addresses).Error; err != nil {
		return utils.BadRequest(c, "Error retrieving addresses", err.Error())
	}

	return c.JSON(addresses)
}

type userAddressPatchDto struct {
	Street  string `json:"street" validate:"min=3,max=255"`
	City    string `json:"city" validate:"min=3,max=255"`
	State   string `json:"state" validate:"min=3,max=255"`
	ZipCode string `json:"zip_code" validate:"len=6"`
}

func PatchAddress(c *fiber.Ctx) error {
	addressID := c.Params("id")
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	var addressData userAddressPatchDto
	if err := utils.ValidateBody(c, &addressData); err != nil {
		return err
	}

	var address models.UserAddress
	if err := utils.DB.First(&address, addressID).Error; err != nil {
		return utils.NotFound(c, "Address not found", err.Error())
	}

	if address.UserID != userContext.UserID {
		return utils.Forbidden(c, "You are not allowed to update this address", "Permission denied")
	}

	if addressData.Street != "" {
		address.Street = addressData.Street
	}
	if addressData.City != "" {
		address.City = addressData.City
	}
	if addressData.State != "" {
		address.State = addressData.State
	}
	if addressData.ZipCode != "" {
		address.ZipCode = addressData.ZipCode
	}

	if err := utils.DB.Save(&address).Error; err != nil {
		return utils.BadRequest(c, "Error updating address", err.Error())
	}

	return c.JSON(address)
}

func DeleteAddress(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	addressID := c.Params("id")
	var address models.UserAddress
	if err := utils.DB.First(&address, addressID).Error; err != nil {
		return utils.NotFound(c, "Address not found", err.Error())
	}

	if address.UserID != userContext.UserID {
		return utils.Forbidden(c, "You are not allowed to delete this address", "Permission denied")
	}

	if err := utils.DB.Delete(&address).Error; err != nil {
		return utils.BadRequest(c, "Error deleting address", err.Error())
	}

	return c.JSON(fiber.Map{"message": "Address deleted successfully"})
}
