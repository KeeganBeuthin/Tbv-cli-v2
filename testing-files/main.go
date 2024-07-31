package main

import (
	"encoding/json"
	"fmt"
	"unsafe"
)

//export TinyGo
func TinyGo() {}

//export execute_credit_leg
func execute_credit_leg(amountPtr *byte, amountLen int, accountPtr *byte, accountLen int) *byte {
	amount := string(unsafe.Slice(amountPtr, amountLen))
	account := string(unsafe.Slice(accountPtr, accountLen))
	message := fmt.Sprintf("Crediting %s to account %s", amount, account)
	return &([]byte(message)[0])
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
