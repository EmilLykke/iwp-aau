// 1. The sum of a range
/**
 * 
 * @param {number} start 
 * @param {number} end 
 * @param {number} step 
 * @returns {number[]}
 */
function range(start, end, step =1){
    let array = []
    for (let i = start; step > 0 ? i <= end : i >= end; i+=step) {
       array.push(i); 
    }
    return array
}
console.log(range(1,10))
// => [1,2,3,4,5,6,7,8,9,10]

console.log(range(1,10,2))
// => [ 1, 3, 5, 7, 9 ]

/**
 * 
 * @param {number[]} nums 
 * @returns {number}
 */
function sum(nums){
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i]
    }
    return sum
}

console.log(sum(range(1,10)))
// => 55

console.log(range(5, 2, -1))
// => [ 5, 4, 3, 2 ]



// 2. Reversing an array
/**
 * 
 * @param {any[]} array 
 */
function reverseArray(array){
    let newArr = []
    for (let i = array.length-1; i >= 0; i--) {
       newArr[array.length-1-i] = array[i] 
        
    }
    return newArr

}

console.log(reverseArray(["A", "B", "C"]))
// => [ 'C', 'B', 'A' ]

function reverseArrayInPlace(array){
    let newArr = array.slice()
    for (let i = array.length-1; i >= 0; i--) {
        array[array.length-1-i]=newArr[i]
    }
}
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// => [5, 4, 3, 2, 1]


// 3. Deep comparison

function deepEqual(obj1, obj2){
    if(obj1 === obj2){
        return true
    }
    else if(typeof obj1 === 'object' && typeof obj2 === 'object'){
        const obj1Keys = Object.keys(obj1)
        
        if(obj1Keys.some((item) => !deepEqual(obj1[item], obj2[item]) )){
            return false
        }

        return true

    } else{

    return false
    }

}

let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj))
// => true

console.log(deepEqual(obj, {here: 1, object: 2}));
// => false

console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// => true


// 4. Flattening
let arrays = [[1, 2, 3], [4, 5], [6]];

console.log(arrays.reduce((val, arr)=>val.concat(arr), []))
// => [1, 2, 3, 4, 5, 6]

// BONUS: calculates total
// console.log(arrays.reduce((val, arr)=> val+arr.reduce((a,b)=>a+b), 0))


// 5. Your own loop

// Recursive way
function loop(val, test, update, body){
    if(!test(val)){
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
function loop2(val, test, update, body){
    for (let i = val; test(i) ; i = update(i)) {
        body(i);
        
    }
}

console.log("Loop:")
loop2(3, n => n > 0, n => n - 1, console.log);
// => 3
// => 2
// => 1

// 6. Everything
function every(array, test){
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

function everyWithSome(array, test){
    return !array.some((item)=>!test(item))
}
console.log("With some")
console.log(everyWithSome([1, 3, 5], n => n < 10));
// => true
console.log(everyWithSome([2, 4, 16], n => n < 10));
// => false
console.log(everyWithSome([], n => n < 10));
// => true