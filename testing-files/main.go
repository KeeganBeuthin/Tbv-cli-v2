package main

import (
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

func main() {}
