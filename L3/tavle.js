function repeat(n, action) {
    for (let i = 0; i < n; i++) {
        action(i);
    }
}

function addTwo(n) {
    return n + 2
}

console.log("Repeat")
repeat(4, console.log)
repeat(3, addTwo)

console.log()

// high-order functions for arrays: forEach, filter, map, reduce
let array = [3, 0, -4, -9, 12, 6, -2, 34]

console.log('For each')
array.forEach((item) => console.log(item))

console.log()
console.log('For n of array')
for (let n of array) {
    console.log(n)
}

console.log()
console.log('Filter')

let positives = array.filter((item) => item > 0)
console.log(positives)

console.log()
console.log('Filter Even')

let evens = array.filter((item) => item % 2 === 0)
console.log(evens)


console.log()
console.log('Map')
let operation = array.map((item) => item * 2)
console.log(array)
console.log(operation)


console.log()
console.log('Map uden map')

let old = [];
array.forEach(n => old.push(n * 2))
console.log(old)


console.log()
console.log('Reduce')

let red = array.reduce((prev, current) => prev + current, 0)
console.log(red)
// 40

console.log()
console.log('Reduce to prouckt')

let product = array.reduce((prev, current) => prev * current, 1)
console.log(product)
// -0