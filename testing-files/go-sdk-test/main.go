package main

import (
	"encoding/json"
	"fmt"
	"syscall/js"

	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/transactions"
	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/utils"
)

var done chan struct{}

func main() {
	fmt.Println("Go program started")
	done = make(chan struct{})
	js.Global().Set("runTest", js.FuncOf(runTest))
	js.Global().Set("setQueryResult", js.FuncOf(setQueryResult))
	fmt.Println("runTest function set in global scope")
	<-done
	fmt.Println("Go program exiting")
}

func runTest(this js.Value, args []js.Value) interface{} {
	fmt.Println("runTest function called")
	amount := "100.00"
	account := "account123"

	fmt.Println("Executing credit leg")
	queryPtr := transactions.Execute_Credit_Leg(utils.StringToPtr(amount), int32(len(amount)), utils.StringToPtr(account), int32(len(account)))
	if queryPtr == nil {
		fmt.Println("ExecuteCreditLeg returned nil")
		return nil
	}
	query := utils.GoString(queryPtr, -1)
	fmt.Printf("Generated query: %s\n", query)

	// Execute the RDF query by calling a JavaScript function
	js.Global().Call("executeRdfQuery", query)

	return nil
}

func setQueryResult(this js.Value, args []js.Value) interface{} {
	if len(args) > 0 {
		result := args[0].String()
		fmt.Printf("RDF query result: %s\n", result)

		fmt.Println("Processing credit result")
		processedResultPtr := transactions.Process_Credit_Result(&result)
		var processedResult string
		if processedResultPtr == nil {
			processedResult = "Error processing credit result"
		} else {
			processedResult = *processedResultPtr
		}
		fmt.Printf("Processed result: %s\n", processedResult)

		resultMap := map[string]interface{}{
			"result": processedResult,
		}

		jsonResult, err := json.Marshal(resultMap)
		if err != nil {
			fmt.Println("Error marshaling result:", err)
			return nil
		}

		js.Global().Call("setFinalResult", string(jsonResult))
	}

	// Close the done channel to signal that the program can exit
	close(done)

	return nil
}
