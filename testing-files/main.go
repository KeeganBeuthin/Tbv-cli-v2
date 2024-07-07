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

func main() {}
