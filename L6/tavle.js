"use strict"
let a = 4;
console.log(a*3)

function test(label, body){
    return !body() ? console.log(`Failed: ${label}`) : console.log(`Passed: ${label}`)
}



test("Test om a === a", ()=>{
    return 'a'==='a';
})

test("Test om a === b", ()=>{
    return 'a'==='b';
})

function integerDivision(a,b){
    return Math.floor(a/b);
}

// console.log(integerDivision(7,4)) // 1
test('Dividing 7 by 4', ()=>{
    return integerDivision(7,4) === 1;
})

function integerDivision2(a,b){
    return a/b;
}

// console.log(integerDivision(7,4)) // 1
test('Dividing 7 by 4', ()=>{
    return integerDivision2(7,4) === 1;
})

function numberToString(n, base = 10) {
  let result = "", sign = "";
  if (n < 0) {
    sign = "-";
    n = -n;
  }
  do {
    result = String(n % base) + result;
    n = Math.floor(n/base);
  } while (n > 0);
  return sign + result;
}

console.log(numberToString(16,0))

test('Test numberToString(16,2) === 10000', ()=>{
    return numberToString(16,2) === '10000'
})
