package main

import (
	"fmt"
	"syscall/js"
)

//export execute_credit_leg
func execute_credit_leg(amount float64, account float64) {
	message := fmt.Sprintf("Crediting %.2f to account %.2f", amount, account)
	js.Global().Get("console").Call("log", message)
}

//export execute_debit_leg
func execute_debit_leg(amount float64, account float64) {
	message := fmt.Sprintf("Debiting %.2f from account %.2f", amount, account)
	js.Global().Get("console").Call("log", message)
}

//export http_request
func http_request(a float64, b float64) float64 {
	return a + b
}

func main() {
	// Expose the functions to JavaScript
	js.Global().Set("execute_credit_leg", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		amount := args[0].Float()
		account := args[1].Float()
		execute_credit_leg(amount, account)
		return nil
	}))
	js.Global().Set("execute_debit_leg", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		amount := args[0].Float()
		account := args[1].Float()
		execute_debit_leg(amount, account)
		return nil
	}))
	js.Global().Set("http_request", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		a := args[0].Float()
		b := args[1].Float()
		return http_request(a, b)
	}))

	// Keep the program running
	<-make(chan bool)
}
