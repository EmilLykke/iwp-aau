// https://open.kattis.com/problems/averagecharacter

const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', line => {
    let sum = 0;
    for (let c of line) {
        sum += c.charCodeAt(0);
    }
    let avg = sum / line.length;
    console.log(String.fromCharCode(avg));

    rl.close();
});
