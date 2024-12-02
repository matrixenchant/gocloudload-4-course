package modules

import (
	"e-commerce/src/models"
	"e-commerce/src/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type CreateReviewDto struct {
	ProductID uint   `json:"product_id" validate:"required"`
	Rating    int    `json:"rating" validate:"required,min=1,max=5"`
	Comment   string `json:"comment" validate:"max=500"`
}

func CreateReview(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	var dto CreateReviewDto
	if err := utils.ValidateBody(c, &dto); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var product models.Product
	if err := utils.DB.First(&product, dto.ProductID).Error; err != nil {
		return utils.NotFound(c, "Product not found", err.Error())
	}

	review := models.Review{
		ProductID: dto.ProductID,
		UserID:    userContext.UserID,
		Rating:    dto.Rating,
		Comment:   dto.Comment,
	}

	if err := utils.DB.Create(&review).Error; err != nil {
		return utils.BadRequest(c, "Error creating review", err.Error())
	}

	return c.JSON(review)
}

func GetReviewsByProduct(c *fiber.Ctx) error {
	productID := c.Params("product_id")

	var reviews []models.Review
	if err := utils.DB.Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("user_id, username, email")
	}).
		Where("product_id = ?", productID).Find(&reviews).Error; err != nil {
		return utils.BadRequest(c, "Error retrieving reviews", err.Error())
	}

	return c.JSON(reviews)
}

func GetReview(c *fiber.Ctx) error {
	reviewID := c.Params("id")

	var review models.Review
	if err := utils.DB.First(&review, reviewID).Error; err != nil {
		return utils.NotFound(c, "Review not found", err.Error())
	}

	return c.JSON(review)
}

type UpdateReviewDto struct {
	Rating  *int   `json:"rating" validate:"omitempty,min=1,max=5"`
	Comment string `json:"comment" validate:"max=500"`
}

func UpdateReview(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	reviewID := c.Params("id")

	var dto UpdateReviewDto
	if err := utils.ValidateBody(c, &dto); err != nil {
		return utils.BadRequest(c, "Validation Error", err.Error())
	}

	var review models.Review
	if err := utils.DB.First(&review, reviewID).Error; err != nil {
		return utils.NotFound(c, "Review not found", err.Error())
	}

	if review.UserID != userContext.UserID {
		return utils.Forbidden(c, "Forbidden", "You are not the author of this review")
	}

	if dto.Rating != nil {
		review.Rating = *dto.Rating
	}
	if dto.Comment != "" {
		review.Comment = dto.Comment
	}

	if err := utils.DB.Save(&review).Error; err != nil {
		return utils.BadRequest(c, "Error updating review", err.Error())
	}

	return c.JSON(review)
}

func DeleteReview(c *fiber.Ctx) error {
	userContext, err := utils.GetAuthUser(c)
	if err != nil {
		return utils.Unauthorized(c, "Unauthorized", err.Error())
	}

	reviewID := c.Params("id")

	var review models.Review
	if err := utils.DB.First(&review, reviewID).Error; err != nil {
		return utils.NotFound(c, "Review not found", err.Error())
	}

	if review.UserID != userContext.UserID {
		return utils.Forbidden(c, "Forbidden", "You are not the author of this review")
	}

	if err := utils.DB.Delete(&review).Error; err != nil {
		return utils.BadRequest(c, "Error deleting review", err.Error())
	}

	return c.JSON(fiber.Map{"message": "Review deleted successfully"})
}
