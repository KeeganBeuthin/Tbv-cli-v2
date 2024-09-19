package main

import (
	"fmt"
	"syscall/js"

	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/transactions"
	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/utils"
)

var lastQuery string
var globalAmount float64

func runTest(this js.Value, args []js.Value) interface{} {
	fmt.Println("Running Go SDK test")
	amount := "100.00"
	account := "account123"

	fmt.Println("Executing credit leg")
	queryPtr := transactions.Execute_credit_leg(utils.StringToPtr(amount), int32(len(amount)), utils.StringToPtr(account), int32(len(account)))
	if queryPtr == nil {
		fmt.Println("Execute_credit_leg returned nil")
		return nil
	}
	lastQuery = utils.GoString(queryPtr, -1)
	fmt.Printf("Credit leg query: %s\n", lastQuery)

	// Execute the RDF query by calling a JavaScript function
	js.Global().Call("executeRdfQuery", lastQuery)

	return nil
}

func setQueryResult(this js.Value, args []js.Value) interface{} {
	if len(args) == 0 {
		fmt.Println("Error: No arguments passed to setQueryResult")
		return nil
	}
	result := args[0].String()
	fmt.Printf("RDF query result received in setQueryResult: %s\n", result)

	fmt.Println("Calling Process_credit_result")
	processedResultPtr := transactions.Process_credit_result(utils.StringToPtr(result))
	if processedResultPtr == nil {
		fmt.Println("Error: Process_credit_result returned nil")
		return nil
	}
	processedResult := utils.GoString(processedResultPtr, -1)
	fmt.Printf("Processed credit result: %s\n", processedResult)

	resultMap := map[string]interface{}{
		"creditQuery":  lastQuery,
		"creditResult": processedResult,
	}

	js.Global().Call("setFinalResult", js.ValueOf(resultMap))
	return nil
}

func main() {
	fmt.Println("Go program started")
	c := make(chan struct{}, 0)
	js.Global().Set("runTest", js.FuncOf(runTest))
	js.Global().Set("setQueryResult", js.FuncOf(setQueryResult))
	fmt.Println("Functions set in global scope")
	<-c // This will keep the program running
}
