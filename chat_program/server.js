/* Module dependencies */
var express = require('express'),
	sio = require('socket.io')

/* Create app */
app = express.createServer(
	express.bodyParser(),
	express.static('public')
);

/* Attach socket.io */
var io = sio.listen(app);

/* Set up connection's listener */
io.sockets.on('connection', function(socket) {
	//console.log('someone connected');
	socket.on('join', function(name) {
		socket.nickname = name;
		socket.broadcast.emit('announcement', name + ' joined the chat.');
	});

	socket.on('text', function(msg){
		socket.broadcast.emit('text', socket.nickname, msg);
	});
});

/* Listen */
app.listen(3000);

