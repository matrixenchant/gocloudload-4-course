package modules

import (
	"e-commerce/src/models"
	"e-commerce/src/utils"

	"github.com/gofiber/fiber/v2"
)

type productImageDto struct {
	ProductID uint   `json:"product_id" validate:"required"`
	ImageURL  string `json:"image_url" validate:"required,url"`
}

func CreateProductImage(c *fiber.Ctx) error {
	var imageData productImageDto
	if err := utils.ValidateBody(c, &imageData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var product models.Product
	if err := utils.DB.First(&product, imageData.ProductID).Error; err != nil {
		return utils.NotFound(c, "Product not found", err.Error())
	}

	productImage := models.ProductImage{
		ProductID: imageData.ProductID,
		ImageURL:  imageData.ImageURL,
	}

	if err := utils.DB.Create(&productImage).Error; err != nil {
		return utils.BadRequest(c, "Error creating product image", err.Error())
	}

	return c.JSON(productImage)
}

func GetProductImage(c *fiber.Ctx) error {
	imageID := c.Params("id")

	var productImage models.ProductImage
	if err := utils.DB.First(&productImage, imageID).Error; err != nil {
		return utils.NotFound(c, "Product image not found", err.Error())
	}

	return c.JSON(productImage)
}

func GetAllProductImages(c *fiber.Ctx) error {
	productID := c.Query("product_id")

	var productImages []models.ProductImage
	query := utils.DB
	if productID != "" {
		query = query.Where("product_id = ?", productID)
	}
	if err := query.Find(&productImages).Error; err != nil {
		return utils.BadRequest(c, "Error retrieving product images", err.Error())
	}

	return c.JSON(productImages)
}

func UpdateProductImage(c *fiber.Ctx) error {
	imageID := c.Params("id")

	var imageData productImageDto
	if err := utils.ValidateBody(c, &imageData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var productImage models.ProductImage
	if err := utils.DB.First(&productImage, imageID).Error; err != nil {
		return utils.NotFound(c, "Product image not found", err.Error())
	}

	if imageData.ImageURL != "" {
		productImage.ImageURL = imageData.ImageURL
	}
	if imageData.ProductID > 0 {
		var product models.Product
		if err := utils.DB.First(&product, imageData.ProductID).Error; err != nil {
			return utils.NotFound(c, "Product not found", err.Error())
		}
		productImage.ProductID = imageData.ProductID
	}

	if err := utils.DB.Save(&productImage).Error; err != nil {
		return utils.BadRequest(c, "Error updating product image", err.Error())
	}

	return c.JSON(productImage)
}

func DeleteProductImage(c *fiber.Ctx) error {
	imageID := c.Params("id")

	var productImage models.ProductImage
	if err := utils.DB.First(&productImage, imageID).Error; err != nil {
		return utils.NotFound(c, "Product image not found", err.Error())
	}

	if err := utils.DB.Delete(&productImage).Error; err != nil {
		return utils.BadRequest(c, "Error deleting product image", err.Error())
	}

	return c.JSON(fiber.Map{"message": "Product image deleted successfully"})
}
