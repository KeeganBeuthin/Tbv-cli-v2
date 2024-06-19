package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

//export executeCreditLeg
func executeCreditLeg(amount float64) {
	fmt.Printf("Credit Leg Executed: Amount Credited $%.2f\n", amount)
}

//export executeDebitLeg
func executeDebitLeg(amount float64) {
	fmt.Printf("Debit Leg Executed: Amount Debited $%.2f\n", amount)
}

//export httpRequest
func httpRequest(url string) {
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("HTTP Request Failed:", err)
		return
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to read response body:", err)
		return
	}
	fmt.Println("HTTP Request Output:", string(body))
}

func main() {
	// Simulate a credit operation
	executeCreditLeg(100.0)

	// Simulate a debit operation
	executeDebitLeg(50.0)

	// Perform an HTTP GET request
	httpRequest("https://jsonplaceholder.typicode.com/posts/1")
}
