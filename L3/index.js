// Originally exercises from lecture 2

// 4. Flattening
console.log("4. Flattening")
let arrays = [[1, 2, 3], [4, 5], [6]];

console.log(arrays.reduce((val, arr) => val.concat(arr), []))
// => [1, 2, 3, 4, 5, 6]

// BONUS: calculates total
// console.log(arrays.reduce((val, arr)=> val+arr.reduce((a,b)=>a+b), 0))


// 5. Your own loop

console.log("5. Your own loop")
// Recursive way
function loop(val, test, update, body) {
    if (!test(val)) {
        return
    }

    body(val);
    loop(update(val), test, update, body)

}

console.log("Recursive:")
loop(3, n => n > 0, n => n - 1, console.log);
// => 3
// => 2
// => 1

// With loop
function loop2(val, test, update, body) {
    for (let i = val; test(i); i = update(i)) {
        body(i);

    }
}

console.log("Loop:")
loop2(3, n => n > 0, n => n - 1, console.log);
// => 3
// => 2
// => 1

// 6. Everything
console.log("6. Everything")
function every(array, test) {
    for (let i = 0; i < array.length; i++) {
        if (!test(array[i])) {
            return false
        }
    }
    return true

}

console.log("With loop")
console.log(every([1, 3, 5], n => n < 10));
// => true
console.log(every([2, 4, 16], n => n < 10));
// => false
console.log(every([], n => n < 10));
// => true

function everyWithSome(array, test) {
    return !array.some((item) => !test(item))
}
console.log("With some")
console.log(everyWithSome([1, 3, 5], n => n < 10));
// => true
console.log(everyWithSome([2, 4, 16], n => n < 10));
// => false
console.log(everyWithSome([], n => n < 10));
// => true