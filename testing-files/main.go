package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"unsafe"
)

type QueryResult struct {
	Results []struct {
		Balance json.Number `json:"balance"`
	} `json:"results"`
}

var globalAmount float64

//export TinyGo
func TinyGo() {}

//export execute_credit_leg
func execute_credit_leg(amountPtr *byte, amountLen int32, accountPtr *byte, accountLen int32) *byte {
	amount := string(unsafe.Slice(amountPtr, amountLen))
	account := string(unsafe.Slice(accountPtr, accountLen))

	amountFloat, err := strconv.ParseFloat(amount, 64)
	if err != nil {
		errorMsg := fmt.Sprintf("Error: Invalid amount value \"%s\"", amount)
		fmt.Println(errorMsg)
		return stringToPtr(errorMsg)
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

	queryBytes := []byte(query)
	resultPtr := query_rdf_tbv_cli(&queryBytes[0], int32(len(queryBytes)))
	if resultPtr == nil {
		errorMsg := "Error: RDF query failed"
		fmt.Println(errorMsg)
		return stringToPtr(errorMsg)
	}
	resultStr := readCString(resultPtr)
	if strings.HasPrefix(resultStr, "Error:") {
		return stringToPtr(resultStr)
	}

	return process_credit_result(resultPtr)
}

//go:wasm-module env
//export query_rdf_tbv_cli
func query_rdf_tbv_cli(queryPtr *byte, queryLen int32) *byte

//export process_credit_result
func process_credit_result(resultPtr *byte) *byte {
	if resultPtr == nil {
		errorMsg := "Error executing RDF query"
		fmt.Println(errorMsg)
		return stringToPtr(errorMsg)
	}

	resultStr := readCString(resultPtr)
	fmt.Printf("Query result: %s\n", resultStr)

	currentBalance, err := parseBalance(resultStr)
	if err != nil {
		errorMsg := fmt.Sprintf("Error: %v", err)
		fmt.Println(errorMsg)
		return stringToPtr(errorMsg)
	}

	newBalance := currentBalance + globalAmount
	formattedNewBalance := fmt.Sprintf("%.2f", newBalance)

	message := fmt.Sprintf("Credited %.2f to account. Previous balance: %.2f, New balance: %s", globalAmount, currentBalance, formattedNewBalance)
	fmt.Printf("Credit leg result: %s\n", message)

	return stringToPtr(message)
}

//go:wasm-module env
//export set_query_result
func set_query_result(resultPtr *byte)

func query_rdf_tbv_cli_wrapper(queryPtr *byte, queryLen int32) *byte {
	result := query_rdf_tbv_cli(queryPtr, queryLen)
	if result == nil {
		fmt.Println("Error: query_rdf_tbv_cli returned nil")
		return stringToPtr("Error: RDF query failed")
	}
	return result
}

func readCString(ptr *byte) string {
	if ptr == nil {
		return ""
	}
	var bytes []byte
	for {
		b := *ptr
		if b == 0 {
			break
		}
		bytes = append(bytes, b)
		ptr = (*byte)(unsafe.Pointer(uintptr(unsafe.Pointer(ptr)) + 1))
	}
	return string(bytes)
}

//export malloc
func malloc(size int32) unsafe.Pointer

func stringToPtr(s string) *byte {
	ptr := malloc(int32(len(s) + 1))
	if ptr == nil {
		fmt.Println("Error: Failed to allocate memory")
		return nil
	}
	copy(unsafe.Slice((*byte)(ptr), len(s)+1), append([]byte(s), 0))
	return (*byte)(ptr)
}

func parseBalance(resultStr string) (float64, error) {
	var queryResult QueryResult
	err := json.Unmarshal([]byte(resultStr), &queryResult)
	if err != nil {
		return 0, fmt.Errorf("Error parsing JSON: %v", err)
	}

	if len(queryResult.Results) == 0 {
		return 0, fmt.Errorf("No results found in the query response")
	}

	balance, err := queryResult.Results[0].Balance.Float64()
	if err != nil {
		return 0, fmt.Errorf("Error parsing balance: %v", err)
	}

	return balance, nil
}

//export execute_debit_leg
func execute_debit_leg(amountPtr *byte, amountLen int, accountPtr *byte, accountLen int) *byte {
	amount := string(unsafe.Slice(amountPtr, amountLen))
	account := string(unsafe.Slice(accountPtr, accountLen))
	message := fmt.Sprintf("Debiting %s from account %s", amount, account)
	return &([]byte(message)[0])
}

//export getStringLength
func getStringLength(ptr *byte) int {
	str := unsafe.Slice(ptr, 1<<30)
	for i, b := range str {
		if b == 0 {
			return i
		}
	}
	return 0
}

//export logList
func logList(listPtr *byte, listLen int) {
	list := string(unsafe.Slice(listPtr, listLen))
	fmt.Printf("Received test list: %s\n", list)
}

//export add_to_list
func add_to_list(itemPtr *byte, itemLen int) *byte {
	item := string(unsafe.Slice(itemPtr, itemLen))
	message := fmt.Sprintf("add:%s", item)
	return &([]byte(message)[0])
}

//export delete_from_list
func delete_from_list(itemPtr *byte, itemLen int) *byte {
	item := string(unsafe.Slice(itemPtr, itemLen))
	message := fmt.Sprintf("delete:%s", item)
	return &([]byte(message)[0])
}

//export get_from_list
func get_from_list(indexPtr *byte, indexLen int) *byte {
	index := string(unsafe.Slice(indexPtr, indexLen))
	return &([]byte(index)[0])
}

type Book struct {
	Title      string `json:"title"`
	AuthorName string `json:"authorName"`
}

//export Rdf_Test
func Rdf_Test(rdfDataPtr *byte, rdfDataLen int) *byte {
	rdfData := string(unsafe.Slice(rdfDataPtr, rdfDataLen))
	var books []Book
	err := json.Unmarshal([]byte(rdfData), &books)
	if err != nil {
		return &([]byte(fmt.Sprintf("Error parsing books data: %v", err))[0])
	}
	result := "RDF_TEST:"
	for _, book := range books {
		result += fmt.Sprintf("Title: %s, Author: %s; ", book.Title, book.AuthorName)
	}
	return &([]byte(result)[0])
}

//export add_book
func add_book(bookDataPtr *byte, bookDataLen int) *byte {
	bookData := string(unsafe.Slice(bookDataPtr, bookDataLen))
	var book Book
	err := json.Unmarshal([]byte(bookData), &book)
	if err != nil {
		return &([]byte(fmt.Sprintf("Error parsing book data: %v", err))[0])
	}
	result := fmt.Sprintf("Added book: %s by %s", book.Title, book.AuthorName)
	return &([]byte(result)[0])
}

//export delete_book
func delete_book(titlePtr *byte, titleLen int) *byte {
	title := string(unsafe.Slice(titlePtr, titleLen))
	result := fmt.Sprintf("Deleted book: %s", title)
	return &([]byte(result)[0])
}

//export get_book
func get_book(titlePtr *byte, titleLen int) *byte {
	title := string(unsafe.Slice(titlePtr, titleLen))
	result := fmt.Sprintf("Retrieved book: %s", title)
	return &([]byte(result)[0])
}

func main() {}
