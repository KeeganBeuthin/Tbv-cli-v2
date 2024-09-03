package main

import (
	"encoding/json"
	"fmt"
	"syscall/js"
	"unsafe"

	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/transactions"
	"github.com/KeeganBeuthin/TBV-Go-SDK/pkg/utils"
)

var done chan struct{}

const htmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebAssembly HTML</title>
</head>
<body>
    <h1>Hello from WebAssembly!</h1>
    <p>This HTML was generated in Go and passed through WebAssembly.</p>
</body>
</html>
`

func getHtmlCode() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		processedHtml, err := utils.ReadHtmlCode(htmlCode)
		if err != nil {
			return err.Error()
		}
		return processedHtml
	})
}

func handleHttpRequest() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 1 {
			return "Invalid arguments"
		}

		requestJSON := args[0].String()
		requestPtr := utils.StringToPtr(requestJSON)
		responsePtr := transactions.HandleHttpRequest(requestPtr)
		response := utils.PtrToString(responsePtr)

		utils.Free(unsafe.Pointer(requestPtr))
		utils.Free(unsafe.Pointer(responsePtr))

		return response
	})
}

func main() {
	fmt.Println("Go program started")
	c := make(chan struct{}, 0)
	js.Global().Set("runTest", js.FuncOf(runTest))
	js.Global().Set("setQueryResult", js.FuncOf(setQueryResult))
	js.Global().Set("getHtmlCode", getHtmlCode())
	js.Global().Set("handleHttpRequest", handleHttpRequest())
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
