
function displayTime(){
    let date = new Date()
    let time = date.toLocaleTimeString()
    document.querySelector('.clock').textContent = time;
}

displayTime();

let clock = setInterval(displayTime,1000)
setTimeout(()=> clearInterval(clock), 1000)


let milliseconds = 0
let seconds = 0
let minutes = 0
let hours = 0
let runningTime;
let interval;

// Resets the stopwatch to 0 and updates the display
function reset() {
    clearInterval(interval);
    milliseconds = 0;
    updateDisplay();
}

// Starts the stopwatch
function start() {
    // Prevents multiple intervals from being set if start is clicked multiple times
    if (interval) {
        return;
    }

    const startTime = Date.now() - milliseconds;
    interval = setInterval(() => {
        milliseconds = Date.now() - startTime;
        updateDisplay();
    }, 1); // Update every millisecond
}

// Stops the stopwatch
function stopTime() {
    clearInterval(interval);
    interval = null;
}

// Updates the display with the current time
function updateDisplay() {
    let time = new Date(milliseconds);
    let hours = time.getUTCHours();
    let minutes = time.getUTCMinutes();
    let seconds = time.getUTCSeconds();
    let ms = time.getUTCMilliseconds();

    // Formatting each time component to ensure two digits for hours, minutes, and seconds
    // and three digits for milliseconds
    let formattedTime = 
        `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(ms, 3)}`;

    document.querySelector('.timerTime').textContent = formattedTime;
}

// Utility function for padding numbers with leading zeros
function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

reset();



function loadAsset(url,type,callback){
    let xhr = new XMLHttpRequest()
    xhr.open('GET',url)
    xhr.responseType = type
    xhr.onload = ()=> {
        callback(xhr.response)
    }

    xhr.send()
}

function displayImage(blob){
    let objectURL = URL.createObjectURL(blob)

    let images = document.querySelector('.images')
    let image = document.createElement('img')
    image.src = objectURL
    images.appendChild(image)

}

loadAsset('images/manymen.jpg','blob',displayImage)
loadAsset('images/manymen.jpg','blob',displayImage)
loadAsset('images/manymen.jpg','blob',displayImage)
loadAsset('images/manymen.jpg','blob',displayImage)
loadAsset('images/manymen.jpg','blob',displayImage)
loadAsset('images/manymen.jpg','blob',displayImage)