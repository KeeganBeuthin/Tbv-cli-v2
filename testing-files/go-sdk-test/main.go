package main

import (
	"fmt"
	"syscall/js"

	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/transactions"
	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/utils"
)

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("runTest", js.FuncOf(runTest))
	<-c
}

func runTest(this js.Value, args []js.Value) interface{} {
	amount := "100.00"
	account := "account123"

	queryPtr := transactions.ExecuteCreditLeg(utils.StringToPtr(amount), int32(len(amount)), utils.StringToPtr(account), int32(len(account)))
	query := utils.GoString(queryPtr, -1)
	fmt.Printf("Generated query: %s\n", query)

	result := `{"results": [{"balance": "500.00"}]}`
	processedResultPtr := transactions.ProcessCreditResult(utils.StringToPtr(result))
	processedResult := utils.GoString(processedResultPtr, -1)
	fmt.Printf("Processed result: %s\n", processedResult)

	return nil
}
