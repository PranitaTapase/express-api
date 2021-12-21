const EventEmitter = require('events');
const http = require('http');
//const myEmitter = new EventEmitter();

class Sales extends EventEmitter{
    constructor(){
        super();
    }
}

const myEmitter = new Sales();

myEmitter.on('newSale', ()=>{
    console.log("There was a new sale");
})

myEmitter.on('newSale', ()=>{
    console.log('Constumer Name: jonas');
})

myEmitter.on('newSale', stock => {
    console.log(`Stock at : ${stock}`);
})

myEmitter.emit('newSale', 9);

////////////////////////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
    console.log(("Request Recieved"));
    console.log(req.url);
    res.end("Request received");
});

server.on('request', (req, res) => {
    console.log("Request 2nd received");
});

server.on('close', () =>{
    console.log("closedc");
});


server.listen(8000, "127.0.0.1",() => {
    console.log("Waiting for request");
})




