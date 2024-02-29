import http from 'http'

const server = http.createServer((req,res)=>{
    res.end('hej')
})

server.listen(5000, '127.0.0.1', (req,res)=>{
    console.log('The server is running')
})