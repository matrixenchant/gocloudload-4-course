package modules

import (
	"context"
	"e-commerce/src/models"
	"e-commerce/src/utils"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

type productDto struct {
	Name        string  `json:"name" validate:"required,min=3,max=255"`
	Description string  `json:"description" validate:"required,min=3"`
	Price       float64 `json:"price" validate:"required,min=0"`
	Stock       int     `json:"stock" validate:"required,min=0"`
	CategoryID  uint    `json:"category_id" validate:"required"`
}

type productUpdateDto struct {
	Name        string  `json:"name" validate:"min=3,max=255"`
	Description string  `json:"description" validate:"min=3"`
	Price       float64 `json:"price" validate:"min=0"`
	Stock       int     `json:"stock" validate:"min=0"`
	CategoryID  uint    `json:"category_id"`
}

func CreateProduct(c *fiber.Ctx) error {
	var productData productDto
	if err := utils.ValidateBody(c, &productData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var category models.Category
	if err := utils.DB.First(&category, productData.CategoryID).Error; err != nil {
		return utils.BadRequest(c, "Category not found", err.Error())
	}

	product := models.Product{
		Name:        productData.Name,
		Description: productData.Description,
		Price:       productData.Price,
		Stock:       productData.Stock,
		Category:    category,
	}

	if err := utils.DB.Create(&product).Error; err != nil {
		return utils.BadRequest(c, "Error creating product", err.Error())
	}

	return c.JSON(product)
}

func GetProduct(c *fiber.Ctx) error {
	productID := c.Params("id")

	var product models.Product
	if err := utils.DB.First(&product, productID).Error; err != nil {
		return utils.NotFound(c, "Product not found", err.Error())
	}

	return c.JSON(product)
}

func GetAllProducts(c *fiber.Ctx) error {
	ctx := context.Background()
	cacheKey := "all_products"
	ch := make(chan []models.Product)
	errCh := make(chan error)

	// Check Cache
	cachedData, err := utils.GetCachedData(ctx, cacheKey)
	if err == nil {
		var products []models.Product
		if jsonErr := json.Unmarshal([]byte(cachedData), &products); jsonErr == nil {
			return c.JSON(products)
		}
	}

	go func() {
		var products []models.Product
		err := utils.DB.Preload("Category").Preload("Reviews").Preload("Images").Find(&products).Error
		if err != nil {
			errCh <- err
			return
		}

		productsJSON, _ := json.Marshal(products)
		_ = utils.SetCacheData(ctx, cacheKey, string(productsJSON), 2*time.Minute)
		ch <- products
	}()

	select {
	case products := <-ch:
		return c.JSON(products)
	case err := <-errCh:
		return utils.BadRequest(c, "Error retrieving products", err.Error())
	case <-time.After(5 * time.Second):
		return utils.BadRequest(c, "Timeout", "Fetching products took too long")
	}
}

func UpdateProduct(c *fiber.Ctx) error {
	productID := c.Params("id")

	var productData productUpdateDto
	if err := utils.ValidateBody(c, &productData); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var product models.Product
	if err := utils.DB.First(&product, productID).Error; err != nil {
		return utils.NotFound(c, "Product not found", err.Error())
	}

	if productData.CategoryID > 0 {
		var category models.Category
		if err := utils.DB.First(&category, productData.CategoryID).Error; err != nil {
			return utils.NotFound(c, "Category not found", err.Error())
		}
		product.CategoryID = productData.CategoryID
	}

	if productData.Name != "" {
		product.Name = productData.Name
	}
	if productData.Description != "" {
		product.Description = productData.Description
	}
	if productData.Price >= 0 {
		product.Price = productData.Price
	}
	if productData.Stock >= 0 {
		product.Stock = productData.Stock
	}

	if err := utils.DB.Save(&product).Error; err != nil {
		return utils.BadRequest(c, "Error updating product", err.Error())
	}

	if err := utils.DeleteCachedData(context.Background(), "all_products"); err != nil {
		fmt.Println("Error clear cache: " + err.Error())
	}

	return c.JSON(product)
}

func DeleteProduct(c *fiber.Ctx) error {
	productID := c.Params("id")

	var product models.Product
	if err := utils.DB.First(&product, productID).Error; err != nil {
		return utils.NotFound(c, "Product not found", err.Error())
	}

	if err := utils.DB.Delete(&product).Error; err != nil {
		return utils.BadRequest(c, "Error deleting product", err.Error())
	}

	return c.JSON(fiber.Map{"message": "Product deleted successfully"})
}
