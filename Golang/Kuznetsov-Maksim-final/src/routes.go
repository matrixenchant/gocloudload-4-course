package src

import (
	"e-commerce/src/middleware"
	"e-commerce/src/modules"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to the API")
	})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	app.Post("/auth/register", modules.Register)
	app.Post("/auth/login", modules.Login)

	// User routes
	userRoutes := app.Group("/users", middleware.AuthMiddleware)
	{
		userRoutes.Post("/addresses", modules.CreateAddress)
		userRoutes.Get("/addresses", modules.GetAllAddresses)
		userRoutes.Patch("/addresses/:id", modules.PatchAddress)
		userRoutes.Delete("/addresses/:id", modules.DeleteAddress)
	}

	// Product routes
	app.Get("/products", modules.GetAllProducts)
	productRoutes := app.Group("/products", middleware.AuthMiddleware, middleware.AdminMiddleware)
	{
		productRoutes.Post("/", modules.CreateProduct)
		productRoutes.Patch("/:id", modules.UpdateProduct)
		productRoutes.Delete("/:id", modules.DeleteProduct)
	}

	// Product Images routes
	imagesRoutes := app.Group("/product-images", middleware.AuthMiddleware, middleware.AdminMiddleware)
	{
		imagesRoutes.Get("/", modules.GetAllProductImages)
		imagesRoutes.Post("/", modules.CreateProductImage)
		imagesRoutes.Patch("/:id", modules.UpdateProductImage)
		imagesRoutes.Delete("/:id", modules.DeleteProductImage)
	}

	// Categories routes
	app.Get("/categories", modules.GetAllCategories)
	app.Get("/categories/:id", modules.GetCategoryByID)
	app.Post("/categories", middleware.AuthMiddleware, middleware.AdminMiddleware, modules.CreateCategory)
	app.Patch("/categories/:id", middleware.AuthMiddleware, middleware.AdminMiddleware, modules.UpdateCategory)
	app.Delete("/categories/:id", middleware.AuthMiddleware, middleware.AdminMiddleware, modules.DeleteCategory)

	// Reviews routes
	app.Get("/reviews-by-product/:product_id", modules.GetReviewsByProduct)
	app.Get("/reviews/:id", modules.GetReview)
	app.Post("/reviews", middleware.AuthMiddleware, modules.CreateReview)
	app.Patch("/reviews/:id", middleware.AuthMiddleware, modules.UpdateReview)
	app.Delete("/reviews/:id", middleware.AuthMiddleware, modules.DeleteReview)

	// CartItem routes
	app.Get("/carts", middleware.AuthMiddleware, modules.GetAllShoppingCarts)
	app.Get("/carts/:id", middleware.AuthMiddleware, modules.GetShoppingCart)
	app.Post("/carts", middleware.AuthMiddleware, modules.CreateShoppingCart)
	app.Delete("/carts/:id", middleware.AuthMiddleware, modules.DeleteShoppingCart)

	// CartItem routes
	app.Get("/cart-item", middleware.AuthMiddleware, modules.GetAllCartItems)
	app.Post("/cart-item", middleware.AuthMiddleware, modules.CreateCartItem)
	app.Patch("/cart-item/:id", middleware.AuthMiddleware, modules.UpdateCartItem)
	app.Delete("/cart-item/:id", middleware.AuthMiddleware, modules.DeleteCartItem)

	// Orders routes
	app.Get("/orders", middleware.AuthMiddleware, modules.GetMyAllOrders)
	app.Post("/orders", middleware.AuthMiddleware, modules.CreateOrder)
	app.Get("/orders/:id/cancel", middleware.AuthMiddleware, modules.CancelOrder)

	app.Post("/cart-item", middleware.AuthMiddleware, modules.CreateCartItem)
	app.Patch("/cart-item/:id", middleware.AuthMiddleware, modules.UpdateCartItem)

	app.All("*", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).SendString("404 Not Found")
	})
}
