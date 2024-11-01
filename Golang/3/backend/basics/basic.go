package basics

import "fmt"

func main() {

	// Variable Declarations
	var x int = 10
	var y float64 = 20.5

	z := "Hello, Go!"

	fmt.Println(x, y, z)

	// Control Structures
	age := 18

	if age < 18 {
		fmt.Println("You are a minor.")
	} else if age == 18 {
		fmt.Println("You just became an adult.")
	} else {
		fmt.Println("You are an adult.")
	}

	// Cycles
	for i := 0; i < 5; i++ {
		fmt.Println(i)
	}

	j := 0
	for j < 5 {
		fmt.Println(j)
		j++
	}

	fruits := []string{"apple", "banana", "cherry"}
	for index, fruit := range fruits {
		fmt.Printf("%d: %s\n", index, fruit)
	}

	t := &Task{1, "Learn Go", "active"}

	// Создаем срочную задачу
	ut := &UrgentTask{Task{1, "Complete project", "completed"}, 13424234}

	// Используем интерфейс для полиморфизма
	var tasks []Tasker = []Tasker{t, ut}

	for _, task := range tasks {

		println(task.GetStatus())
	}
}

// Functions
func greet() {
	fmt.Println("Hello, World!")
}

func add(a int, b int) int {
	return a + b
}
