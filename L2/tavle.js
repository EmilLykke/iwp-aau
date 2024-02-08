function sumRange(from, to){
    function sumEven(from, to){
        let num = 0;
        for (let i = from; i <= to; i++) {
            if (i%2==0) {
               num += i; 
            }
        }
        return num;
    }

    function sumOdd(from,to){
        let num = 0;
        for (let i = from; i <= to; i++) {
            if (i%2!=0) {
               num += i; 
            }
        }
        return num;
    }

    return sumEven(from,to) + sumOdd(from,to)
}
console.log(sumRange(4,23))


let hej = {
    hej_med_dig: 2
}

console.log(hej.hej_med_dig)

let hej2 = {
    "hej med dig": 2
}
console.log(hej2["hej med dig"])

// find all index
let arr = [1,2,3,4,5,6,3,7]

let indices = arr.map((item,idx)=> item === 3 ? idx : undefined).filter((item)=>item!==undefined)

console.log(indices)
