package main

import (
	"fmt"
	"example.com/m/types"
)

func main() {
	var age int = 24
	var name string = "John"
	var isActive bool = false
	var speed float64 = 42.2

	maxSpeed := 32 + speed

	fmt.Println("Hello world")
	fmt.Printf("Age: %d; Name: %s; Active: %t; Speed: %.2f/%.2f", age, name, isActive, speed, maxSpeed)
	fmt.Println("")

	test := types.Shedule{
		Mentor:    "Ph. Marok",
		StartTime: "14:00",
		EndTime:   "15:00",
		Subject: types.Subject{
			Code:      "SMF234",
			Name:      "Basics of enchantment",
		},
	}

	test.GetCode()

	if test.Code == "GGG" {
		fmt.Println("1")
	} else if 1 == 2 {
		fmt.Println("2")
	} else {
		fmt.Println("3")
	}

	i := 0

	for ; i < 10; i++ {
		fmt.Println(i)
	}

	man := types.Person{
		Name: "Ake",
	}

	man.Greet()

	fmt.Println()

	var check types.Checker = false
	check.Toggle()
	fmt.Printf("check: %t", check)

}
