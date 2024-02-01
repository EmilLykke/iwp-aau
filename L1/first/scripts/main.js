
const header = document.getElementById("name");
const body = document.getElementById("IdBody");
const comment = document.getElementById("comment");

let r = 0, g = 0, b = 0;

console.log(document.head.textContent.trim())

function changeBody() {

    r = Math.random() * 255;
    g = Math.random() * 255;
    b = Math.random() * 255;
    body.style = `background-color: rgb(${r},${g},${b});`;
}
function changeComment() {

    r = Math.random() * 255;
    g = Math.random() * 255;
    b = Math.random() * 255;
    comment.style = `color: rgb(${r},${g},${b}); font-size: 100px;`;
}

function change() {

    r = Math.random() * 255;
    g = Math.random() * 255;
    b = Math.random() * 255;
    header.style = `color: rgb(${r},${g},${b}); font-size: 100px;`;
    changeBody();
    changeComment();

}

console.log(2 * "5")
console.log(2 + "5")
console.log(2 - "5")
console.log(2 / "5")
console.log(2 % "5")
console.log(null == "")
console.log(null == 0)
console.log(null == undefined)
console.log(undefined == "")
console.log(undefined == 0)
console.log(NaN == NaN)
console.log(false == 0)
console.log(false === 0)

setInterval(() => change(), 500)

/**
 * Returns power of number
 * @param x {number}
 * @returns {number}
 */
const square = function (x) {
    return x * x;
}

console.log(square(4))
console.log(square())


/**
 * Returns power of number
 * @param x {number}
 * @param y {number}
 * @returns {number}
 */
function power(x, y = 2) {
    return Math.pow(x, y);
}

console.log(power(3, 4))
console.log(power(3))
