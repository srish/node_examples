/* Module dependencies */
var express = require('express'),
	sio = require('socket.io')

/* Create app */
app = express.createServer(
	express.bodyParser(),
	express.static('public')
);

var positions = {}, 
        total = 0

/* Attach socket.io */
var io = sio.listen(app);

/* Set up connection's listener */
io.sockets.on('connection', function(socket) {
	// you give the socket an id
	socket.id = ++total; 

	socket.on('move', function(pos) {
		socket.x = pos.x;
		socket.y = pos.y;	

		socket.broadcast.emit('position', socket.id, pos.x, pos.y);
	});
});

/* Listen */
app.listen(3000);


