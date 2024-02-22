// Exercise 1: Build a table
/*
Given a data set of mountains, an array of objects with name, height, and place properties, generate the DOM structure for a table that enumerates the objects. It should have one column per key and one row per object, plus a header row with <th> elements at the top, listing the column names.
Write this so that the columns are automatically derived from the objects, by taking the property names of the first object in the data.
Add the resulting table to the element with an id attribute of "mountains" so that it becomes visible in the document.
Once you have this working, right-align cells that contain number values by setting their style.textAlign property to "right".
*/
const MOUNTAINS = [
    { name: "Kilimanjaro", height: 5895, place: "Tanzania" },
    { name: "Everest", height: 8848, place: "Nepal" },
    { name: "Mount Fuji", height: 3776, place: "Japan" },
    { name: "Vaalserberg", height: 323, place: "Netherlands" },
    { name: "Denali", height: 6168, place: "United States" },
    { name: "Popocatepetl", height: 5465, place: "Mexico" },
    { name: "Mont Blanc", height: 4808, place: "Italy/France" }
];

const mountainDiv = document.getElementById("mountains")

const table = mountainDiv.appendChild(document.createElement('table'))
const row = table.appendChild(document.createElement('tr'))
Object.keys(MOUNTAINS[0]).map((key) => {
    const th = row.appendChild(document.createElement('th'))
    th.textContent = key
})

for (const mountain of MOUNTAINS) {
    const row = table.appendChild(document.createElement('tr'))
    Object.keys(mountain).map((key) => {
        const td = row.appendChild(document.createElement('td'))
        if (typeof mountain[key] === 'number') {
            td.style.textAlign = "right"
        }
        td.textContent = mountain[key]
    })
}


// Exercise 2: Balloon
/*
Write a page that displays a balloon (using the balloon emoji, 🎈). When you press the up arrow, it should inflate (grow) 10 percent, and when you press the down arrow, it should deflate (shrink) 10 percent.
You can control the size of text (emoji are text) by setting the font-size CSS property (style.fontSize) on its parent element. Remember to include a unit in the value—for example, pixels (10px).
The key names of the arrow keys are "ArrowUp" and "ArrowDown". Make sure the keys change only the balloon, without scrolling the page.
When that works, add a feature where, if you blow up the balloon past a certain size, it explodes. In this case, exploding means that it is replaced with an 💥 emoji, and the event handler is removed (so that you can’t inflate or deflate the explosion).
*/

const ballon = document.getElementById('ballon')
let size = 24
ballon.style.fontSize = `${size}px`
document.addEventListener('keydown', (event) => {

    const key = event.key
    if (size > 50) {
        ballon.textContent = '💥 '
    } else
        if (key === 'ArrowUp') {
            size += 0.8
        } else
            if (key === 'ArrowDown') {
                size -= 0.8
            }


    ballon.style.fontSize = `${size}px`
})



// Exercise 3: Mouse trail
// In JavaScript’s early days, which was the high time of gaudy home pages with lots of animated images, people came up with some truly inspiring ways to use the language.
// One of these was the mouse trail—a series of elements that would follow the mouse pointer as you moved it across the page.
// In this exercise, I want you to implement a mouse trail. Use absolutely positioned <div> elements with a fixed size and background color (refer to the code in the “Mouse Clicks” section for an example). Create a bunch of such elements and, when the mouse moves, display them in the wake of the mouse pointer.
// There are various possible approaches here. You can make your solution as simple or as complex as you want. A simple solution to start with is to keep a fixed number of trail elements and cycle through them, moving the next one to the mouse’s current position every time a "mousemove" event occurs.
const mouseDiv = document.getElementById('mouse')

const listeAfDots = []

window.addEventListener('mousemove', (event) => {
    const x = event.clientX
    const y = event.clientY

    const dot = document.createElement('div')
    dot.className = 'trail'
    dot.style.left = `${x}px`
    dot.style.top = `${y}px`

    listeAfDots.push(dot)

    listeAfDots.forEach((item) => {
        mouseDiv.appendChild(item)
    })

    setTimeout(() => mouseDiv.removeChild(listeAfDots.shift()), 200)

})


// Tavle opg
const button = document.getElementById('backgroundChange')

let clicked = 0
button.addEventListener('click', () => {
    clicked++
    console.log(clicked)
    if (clicked % 10 === 0) {

        document.body.style.backgroundColor = 'white'
    }
    else if (clicked % 2 !== 0) {
        document.body.style.backgroundColor = 'red'
    } else if (clicked % 2 === 0) {
        document.body.style.backgroundColor = 'magenta'
    }
})