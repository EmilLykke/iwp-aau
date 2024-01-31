// 1 Looping triangle
console.log("1 Looping triangle")
let string = ""
for (let i = 0; i < 7; i++) {
    string += "#"
    console.log(string);
}
console.log("")

// 2 FizzBuzz
console.log("2 FizzBuzz")
for (let i = 1; i <= 100; i++) {
    if (i % 3 == 0 && i % 5 == 0) {
        console.log("FizzBuzz")
    }
    else if (i % 3 == 0) {
        console.log("Fizz")
    } else if (i % 5 == 0) {
        console.log("Buzz")
    } else {
        console.log(i)
    }
}
console.log("")

// 3 Chessboard
console.log("3 Chessboard")
let chess = ""
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        chess += (j + i) % 2 == 0 ? ' ' : '#'
    }
    chess += '\n'

}
console.log(chess)
console.log("")

// 4. Bean Counting
console.log("4. Bean Counting")
const countBs = (string) => {
    let count = 0;
    for (let i = 0; i < string.length; i++) {
        if (string[i] == "B") {
            count++;
        }
    }
    return count;
}
console.log(countBs("Big Backend"))
const countChar = (string, char) => {
    let count = 0;
    for (let i = 0; i < string.length; i++) {
        if (string[i] == char) {
            count++;
        }
    }
    return count;
}
console.log(countChar("kakkerlak", "k"))