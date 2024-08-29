package main

import (
	"encoding/json"
	"fmt"
	"syscall/js"

	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/transactions"
	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/utils"
)

var done chan struct{}

func readHtmlFileWrapper() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 1 {
			return "Invalid number of arguments"
		}
		content := args[0].String()
		result, err := utils.ReadHtmlFile(content)
		if err != nil {
			return err.Error()
		}
		return result
	})
}

func main() {
	fmt.Println("Go program started")
	c := make(chan struct{}, 0)
	js.Global().Set("runTest", js.FuncOf(runTest))
	js.Global().Set("setQueryResult", js.FuncOf(setQueryResult))
	js.Global().Set("readHtmlFile", readHtmlFileWrapper())
	fmt.Println("Functions set in global scope")
	<-c // This will keep the program running
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

	return nil
}
