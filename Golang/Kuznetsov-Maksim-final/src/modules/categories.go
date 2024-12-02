package modules

import (
	"e-commerce/src/models"
	"e-commerce/src/utils"

	"github.com/gofiber/fiber/v2"
)

func GetAllCategories(c *fiber.Ctx) error {
	var categories []models.Category
	if err := utils.DB.Find(&categories).Error; err != nil {
		return utils.BadRequest(c, "Error fetching categories", err.Error())
	}

	return c.JSON(categories)
}

func GetCategoryByID(c *fiber.Ctx) error {
	categoryID := c.Params("id")

	var category models.Category
	if err := utils.DB.First(&category, categoryID).Error; err != nil {
		return utils.NotFound(c, "Category not found", err.Error())
	}

	return c.JSON(category)
}

func CreateCategory(c *fiber.Ctx) error {
	var categoryData struct {
		Name        string `json:"name" validate:"required,min=3,max=255"`
		Description string `json:"description" validate:"max=255"`
	}

	if err := utils.ValidateBody(c, &categoryData); err != nil {
		return err
	}

	category := models.Category{
		Name:        categoryData.Name,
		Description: categoryData.Description,
	}

	if err := utils.DB.Create(&category).Error; err != nil {
		return utils.BadRequest(c, "Error creating category", err.Error())
	}

	return c.JSON(category)
}

func UpdateCategory(c *fiber.Ctx) error {
	categoryID := c.Params("id")

	var categoryData struct {
		Name        string `json:"name" validate:"required,min=3,max=255"`
		Description string `json:"description" validate:"max=255"`
	}

	if err := utils.ValidateBody(c, &categoryData); err != nil {
		return err
	}

	var category models.Category
	if err := utils.DB.First(&category, categoryID).Error; err != nil {
		return utils.NotFound(c, "Category not found", err.Error())
	}

	if categoryData.Name != "" {
		category.Name = categoryData.Name
	}
	if categoryData.Description != "" {
		category.Description = categoryData.Description
	}

	if err := utils.DB.Save(&category).Error; err != nil {
		return utils.BadRequest(c, "Error updating category", err.Error())
	}

	return c.JSON(category)
}

func DeleteCategory(c *fiber.Ctx) error {
	categoryID := c.Params("id")

	var category models.Category
	if err := utils.DB.First(&category, categoryID).Error; err != nil {
		return utils.NotFound(c, "Category not found", err.Error())
	}

	if err := utils.DB.Delete(&category).Error; err != nil {
		return utils.BadRequest(c, "Error deleting category", err.Error())
	}

	return c.JSON(fiber.Map{"message": "Category deleted successfully"})
}
