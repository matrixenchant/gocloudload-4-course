package types

import (
	"encoding/json"
	"fmt"
)

type Subject struct {
	Name      string
	Code      string
}

func (s Subject) GetCode() string {
	return s.Code
}

type Shedule struct {
	Subject
	Mentor    string
	StartTime string
	EndTime   string
}

type Person struct {
	Name string
	Age  int
}

func (p Person) Greet() {
	fmt.Printf("Hello %s", p.Name)
}

type Checker bool

func (c *Checker) Toggle() {
	*c = !*c
}

// Common interface
type Shape interface {
	Area() float64
}

type Circle struct {
	Radius float64
}

type Rectangle struct {
	Width, Height float64
}


func (c Circle) Area() float64 {
	return 3.1416 * c.Radius * c.Radius
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}


type Product struct {
	Name string
	Price int
	Quantity int
}

func (p Product) Serialize() (string, error) {
	jsonData, err := json.Marshal(p)

	if (err != nil) {
		return "", err
	}

	return string(jsonData), nil
}

func Deserialize(productJson string) (Product, error) {
	var p Product
	err := json.Unmarshal([]byte(productJson), &p)

	if (err != nil) {
		return Product{}, err
	}

	return p, nil
}