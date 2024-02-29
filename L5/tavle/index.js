const express = require('express')
const cors = require('cors')

const PORT = 5000

const app = express()


app.use(cors());
app.use(express.json());

app.use('/', (req,res)=>{
    res.send('hej')
})

app.listen(PORT, () => {
    console.log('server running')
})
