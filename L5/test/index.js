const express = require('express')

const app = express()

const PORT = 3000

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.json())

// Define a route that sends the HTML file in response
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/mongoose', (req, res)=>{
    res.send("Hej med dig mongoose")
})

app.get('/ralle', (req, res)=>{
    res.render('./views/index.html')
})

app.listen(PORT, ()=>{
    console.log('hej')
})