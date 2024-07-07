package main

import (
	"fmt"
	"unsafe"
)

//export greet
func greet(name *byte, length int) *byte {
	goName := string(unsafe.Slice(name, length))
	message := fmt.Sprintf("Hello, %s!", goName)
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
