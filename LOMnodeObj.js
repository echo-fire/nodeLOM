/*

this is the node.js max file
this hosts a socket io server 

the Max API allows node to 
connect with the JS object

this file can't export 
the handler library directly because
the max api can't be exported outside max 

*/

// start a socket io server

const Max = require('max-api');

const http = require('http');

const server = http.createServer(function(req, res){})

const io = require('socket.io').listen(server)

let idList = []

io.sockets.on('connection', function (socket) {

	idList.push(socket.id) 

    // this emits only to the socket that just connected

    socket.emit('fromServer', { message: `Connected to Ableton Live via socket.io at socket id: ${socket.id}`} ); 

    // socket.emit('fromServer', { type: 'id', id: socket.id} ); 
    	// send to the client, will append get and observer requests
    	// with id tag later 

    // client listeners have to be put inside the sever side connection callback

    // simply relaying the data into the Max JS object

    socket.on('fromClient', function(data2){

		Max.outlet(data2)

	})

});

server.listen(8080);


// handlers for the get and observer inputs 

Max.addHandler("got", (path, val, result) => { 

	io.emit('fromServer', { type: 'got', path: path, prop: val, value: result } )

})

Max.addHandler("observed", (path, val, result) => { 

	io.emit('fromServer', { type: 'observed', path: path, prop: val, value: result } )

})

