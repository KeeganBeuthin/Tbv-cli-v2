package main

import (
	"encoding/json"
	"fmt"
	"syscall/js"

	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/transactions"
	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/utils"
)

func main() {
	fmt.Println("Go program started")
	c := make(chan struct{}, 0)
	js.Global().Set("runTest", js.FuncOf(runTest))
	fmt.Println("runTest function set in global scope")
	<-c
	fmt.Println("Go program exiting")
}

func runTest(this js.Value, args []js.Value) interface{} {
	fmt.Println("runTest function called")
	amount := "100.00"
	account := "account123"

	fmt.Println("Executing credit leg")
	queryPtr := transactions.ExecuteCreditLeg(utils.StringToPtr(amount), int32(len(amount)), utils.StringToPtr(account), int32(len(account)))
	query := utils.GoString(queryPtr, -1)
	fmt.Printf("Generated query: %s\n", query)

	result := `{"results": [{"balance": "500.00"}]}`
	fmt.Println("Processing credit result")
	processedResultPtr := transactions.ProcessCreditResult(utils.StringToPtr(result))
	processedResult := utils.GoString(processedResultPtr, -1)
	fmt.Printf("Processed result: %s\n", processedResult)

	fmt.Println("runTest function completed")
	resultMap := map[string]interface{}{
		"query":  query,
		"result": processedResult,
	}

	// Convert the map to a JSON string
	jsonResult, err := json.Marshal(resultMap)
	if err != nil {
		fmt.Println("Error marshaling result:", err)
		return js.Null()
	}

	// Return the JSON string
	return js.ValueOf(string(jsonResult))
}
