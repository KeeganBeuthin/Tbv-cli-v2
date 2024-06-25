package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"syscall/js"
)

//export execute_credit_leg
func execute_credit_leg(amount float64) float64 {
	fmt.Printf("Credit Leg Executed: Amount Credited $%.2f\n", amount)
	return amount
}

//export execute_debit_leg
func execute_debit_leg(amount float64) float64 {
	fmt.Printf("Debit Leg Executed: Amount Debited $%.2f\n", amount)
	return amount
}

//export http_request
func http_request(url string) js.Value {
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("HTTP Request Failed:", err)
		return js.Undefined()
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to read response body:", err)
		return js.Undefined()
	}

	return js.ValueOf(string(body))
}

func main() {
	// Simulate a credit operation
	execute_credit_leg(100.0)

	// Simulate a debit operation
	execute_debit_leg(50.0)

	// Perform an HTTP GET request
	http_request("https://jsonplaceholder.typicode.com/posts/1")
}
