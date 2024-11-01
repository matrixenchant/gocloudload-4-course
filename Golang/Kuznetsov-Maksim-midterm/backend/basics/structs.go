package basics

import "time"

// Abstract
type Tasker interface {
	UpdateStatus(newStatus string)
	GetStatus() string
}

// Incapsulation
type Task struct {
	ID    int
	Title string

	// # hidden
	status string
}

// Task Methods
func (t *Task) UpdateStatus(newStatus string) {
	t.status = newStatus
}

func (t Task) GetStatus() string {
	return t.status
}

// Combination
type UrgentTask struct {
	Task
	deadline int
}

func (ut UrgentTask) GetStatus() string {
	if int(time.Now().Unix()) > ut.deadline {
		return "expired"
	}

	return ut.status
}
