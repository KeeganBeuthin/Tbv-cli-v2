package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"syscall/js"
)

// executeCreditLeg simulates a credit transaction
//
//export executeCreditLeg
func executeCreditLeg(this js.Value, args []js.Value) interface{} {
	if len(args) != 1 {
		return js.ValueOf("Invalid number of arguments")
	}
	amount := args[0].Float()
	fmt.Printf("Credit Leg Executed: Amount Credited $%.2f\n", amount)
	return nil
}

// executeDebitLeg simulates a debit transaction
//
//export executeDebitLeg
func executeDebitLeg(this js.Value, args []js.Value) interface{} {
	if len(args) != 1 {
		return js.ValueOf("Invalid number of arguments")
	}
	amount := args[0].Float()
	fmt.Printf("Debit Leg Executed: Amount Debited $%.2f\n", amount)
	return nil
}

// httpRequest makes a simple GET request to the specified URL
//
//export httpRequest
func httpRequest(this js.Value, args []js.Value) interface{} {
	if len(args) != 1 {
		return js.ValueOf("Invalid number of arguments")
	}
	url := args[0].String()
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("HTTP Request Failed:", err)
		return js.ValueOf(fmt.Sprintf("HTTP Request Failed: %v", err))
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to read response body:", err)
		return js.ValueOf(fmt.Sprintf("Failed to read response body: %v", err))
	}

	fmt.Println("HTTP Request Output:", string(body))
	return js.ValueOf(string(body))
}

func main() {
	// Register the exported functions
	js.Global().Set("executeCreditLeg", js.FuncOf(executeCreditLeg))
	js.Global().Set("executeDebitLeg", js.FuncOf(executeDebitLeg))
	js.Global().Set("httpRequest", js.FuncOf(httpRequest))

	// Keep the program running
	select {}
}
