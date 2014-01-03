var express = require('express'),
	wsio = require('websocket.io')

/* Create express app */ 
var app = express.createServer();

/* Attach websocket server */
var ws = wsio.attach(app);

/* Serve your code */
app.use(express.static('public'));

/*Listening on connections */
ws.on('connection', function(socket) {
	socket.on('message', function(msg) {
		console.log('Got message : ' + msg);
		socket.send('pong');
	});
	// ...
});

/* Listen */
app.listen(3000);


