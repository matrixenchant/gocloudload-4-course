package utils

import (
	"encoding/json"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

type ValidationErrorResponse struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

type ValidationError struct {
	Errors []ValidationErrorResponse `json:"errors"`
}

func (e *ValidationError) Error() string {
	errorsJSON, _ := json.Marshal(e.Errors)
	return string(errorsJSON)
}

func ValidateStruct(data interface{}) error {
	err := validate.Struct(data)
	if err != nil {
		// Если ошибки есть, создаем срез для ошибок
		var validationErrors []ValidationErrorResponse
		for _, e := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, ValidationErrorResponse{
				Field:   e.Field(),
				Message: e.Error(),
			})
		}

		// Возвращаем ошибку с подробностями валидации
		return &ValidationError{Errors: validationErrors}
	}
	return nil
}
