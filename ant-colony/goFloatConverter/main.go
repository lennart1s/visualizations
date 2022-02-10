package main

import (
	"fmt"
	"math"
)

func main() {
	exponentBits := 7
	mantissaBits := 16
	fmt.Printf("Num exponent bits: %v\n", exponentBits)
	fmt.Printf("Num mantissa bits: %v\n", mantissaBits)

	f := 0.0
	// x := 0b0010

	sign := 0.0
	if f < 0 {
		sign = 1.0
		f *= -1
	}
	mantissa := f
	exponent := 0.0
	for mantissa >= 2 || mantissa < 1 {
		if mantissa >= 2 {
			mantissa /= 2
			exponent++
		} else if mantissa < 1 {
			mantissa *= 2
			exponent--
		}
	}

	fmt.Println(sign)
	fmt.Println(exponent)
	fmt.Println(mantissa)

	fmt.Println("")

	fmt.Println(sign)

	exponentInt := int(math.Pow(2.0, float64(exponentBits)-1) - 1.0 + exponent)
	fmt.Println(exponentInt)
	printBits(exponentInt, 7)
	fmt.Println("")

	mantissa -= 1
	mantissaInt := 0.0
	for mb := 1; mb <= mantissaBits; mb++ {
		ib := mantissaBits - mb
		if mantissa >= math.Pow(2.0, -float64(mb)) {
			mantissaInt += math.Pow(2.0, float64(ib))
			mantissa -= math.Pow(2.0, -float64(mb))
		}
	}
	fmt.Println(int(mantissaInt))
	printBits(int(mantissaInt), mantissaBits)
	fmt.Println("")
	_, _, a, b := intToVec4(int(mantissaInt))
	printBits(a, 8)
	printBits(b, 8)
	fmt.Println("")
	fmt.Printf("Exponent converts to: %v\n", exponentInt)
	fmt.Printf("Mantissa converts to: %v %v\n", a, b)
}

func printBits(x int, bitsize int) {

	bitVal := int(math.Pow(2, float64(bitsize-1)))
	for b := bitsize - 1; b >= 0; b-- {
		if x >= int(bitVal) {
			x -= bitVal
			fmt.Print("1")
		} else {
			fmt.Print("0")
		}

		bitVal >>= 1
	}
	//fmt.Println("")
}

func intToVec4(val int) (int, int, int, int) {
	x := val / int(math.Pow(2.0, 24.0))
	val -= x * int(math.Pow(2.0, 24.0))
	y := val / int(math.Pow(2.0, 16.0))
	val -= y * int(math.Pow(2.0, 16.0))
	z := val / int(math.Pow(2.0, 8.0))
	val -= z * int(math.Pow(2.0, 8.0))
	w := val

	return x, y, z, w
}
