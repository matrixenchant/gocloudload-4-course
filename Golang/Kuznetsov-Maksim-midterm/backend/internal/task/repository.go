package task

import (
	m "midterm/internal"

	"gorm.io/gorm"
)

func CreateTask(db *gorm.DB, task m.Task) error {
	if err := db.Create(&task).Error; err != nil {
		return err
	}
	return nil
}

func ReadTasks(db *gorm.DB) ([]m.Task, error) {
	var tasks []m.Task
	if err := db.Find(&tasks).Error; err != nil {
		return nil, err
	}
	return tasks, nil
}

func ReadTasksByUser(db *gorm.DB, userId string) ([]m.Task, error) {
	var tasks []m.Task
	if err := db.Where("user_id = ?", userId).Find(&tasks).Error; err != nil {
		return nil, err
	}
	return tasks, nil
}

func GetTaskById(db *gorm.DB, id string) (m.Task, error) {
	var task m.Task
	if err := db.Preload("User").First(&task, id).Error; err != nil {
		return task, err
	}
	return task, nil
}

func UpdateTask(db *gorm.DB, id string, updatedTask m.Task) error {
	var task m.Task
	if err := db.First(&task, id).Error; err != nil {
		return err
	}
	task.Title = updatedTask.Title
	task.Description = updatedTask.Description
	task.Status = updatedTask.Status
	task.UserID = updatedTask.UserID
	if err := db.Save(&task).Error; err != nil {
		return err
	}
	return nil
}

func DeleteTask(db *gorm.DB, id string) error {
	if err := db.Delete(&m.Task{}, id).Error; err != nil {
		return err
	}
	return nil
}
