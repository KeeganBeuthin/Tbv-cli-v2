package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"unsafe"
)

var globalAmount float64

//export TinyGo
func TinyGo() {}

//export execute_credit_leg
func execute_credit_leg(amountPtr *byte, amountLen int32, accountPtr *byte, accountLen int32) *byte {
	amount := goString(amountPtr, amountLen)
	account := goString(accountPtr, accountLen)

	amountFloat, err := strconv.ParseFloat(amount, 64)
	if err != nil {
		return createErrorResult(fmt.Sprintf("Invalid amount value \"%s\"", amount))
	}
	globalAmount = amountFloat

	fmt.Printf("Executing credit leg for amount: %s, account: %s\n", amount, account)

	query := fmt.Sprintf(`
    PREFIX ex: <http://example.org/>
    SELECT ?balance
    WHERE {
      ex:%s ex:hasBalance ?balance .
    }
  `, account)

	// Return the query string pointer
	return stringToPtr(query)
}

//export process_credit_result
func process_credit_result(resultPtr *byte) *byte {
	if resultPtr == nil {
		return createErrorResult("Error executing RDF query")
	}

	resultStr := goString(resultPtr, -1)
	fmt.Printf("Processing credit result: %s\n", resultStr)

	var queryResult struct {
		Results []struct {
			Balance json.Number `json:"balance"`
		} `json:"results"`
	}
	err := json.Unmarshal([]byte(resultStr), &queryResult)
	if err != nil {
		return createErrorResult(fmt.Sprintf("Error parsing JSON: %v", err))
	}

	if len(queryResult.Results) == 0 {
		return createErrorResult("Invalid result format")
	}

	balance, err := queryResult.Results[0].Balance.Float64()
	if err != nil {
		return createErrorResult(fmt.Sprintf("Invalid balance format: %v", err))
	}

	newBalance := balance + globalAmount
	message := fmt.Sprintf("Current balance: %.2f. After credit of %.2f, new balance: %.2f", balance, globalAmount, newBalance)
	return createSuccessResult(message)
}

//export execute_debit_leg
func execute_debit_leg(amountPtr *byte, amountLen int32, accountPtr *byte, accountLen int32) *byte {
	amount := goString(amountPtr, amountLen)
	account := goString(accountPtr, accountLen)

	message := fmt.Sprintf("Debiting %s from account %s", amount, account)
	fmt.Printf("Created message: \"%s\"\n", message)

	return stringToPtr(message)
}

func createErrorResult(message string) *byte {
	errorMessage := fmt.Sprintf("Error: %s", message)
	return stringToPtr(errorMessage)
}

func createSuccessResult(message string) *byte {
	return stringToPtr(message)
}

func goString(ptr *byte, length int32) string {
	if ptr == nil {
		return ""
	}
	if length < 0 {
		// Find null terminator
		end := ptr
		for *end != 0 {
			end = (*byte)(unsafe.Pointer(uintptr(unsafe.Pointer(end)) + 1))
		}
		length = int32(uintptr(unsafe.Pointer(end)) - uintptr(unsafe.Pointer(ptr)))
	}
	return string(unsafe.Slice(ptr, length))
}

func stringToPtr(s string) *byte {
	bytes := []byte(s)
	ptr := malloc(int32(len(bytes) + 1))
	if ptr == nil {
		fmt.Println("Error: Failed to allocate memory")
		return nil
	}
	copy(unsafe.Slice((*byte)(ptr), len(bytes)+1), append(bytes, 0))
	return (*byte)(ptr)
}

//go:wasm-module env
//export query_rdf_tbv_cli
func query_rdf_tbv_cli(queryPtr *byte, queryLen int32) *byte

//export malloc
func malloc(size int32) unsafe.Pointer

func main() {}
