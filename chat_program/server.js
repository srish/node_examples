/* Module dependencies */
var express = require('express'),
	sio = require('socket.io'),
	request = require('superagent')

/* Create app */
app = express.createServer(
	express.bodyParser(),
	express.static('public')
);

/* Attach socket.io */
var io = sio.listen(app),
	apiKey = '{ 511efc4655606a43267479ea32e803e9 }',
	currentSong, dj

/* Elect function does the following 
   1. Mark the current user as the DJ
   2. Emit an announcement to everyone that a new DJ is ready
   3. Let the user know that she had been elected by emitting an elected event.
   4. Upon the user being disconnected, mark the DJ spot as available so that
      the next connection becomes the DJ. 
*/


function elect(socket) {
	dj = socket; 
	io.sockets.emit('announcement', socket.nickname + ' is the new dj');
	socket.emit('elected');
	socket.dj = true;
	socket.on('disconnect', function() {
		dj = null;
		io.sockets.emit('announcement', 'the dj left - next one to join becomes dj');
	});
}

/* Set up connection's listener */
io.sockets.on('connection', function(socket) {
	//console.log('someone connected');
	socket.on('join', function(name) {
		socket.nickname = name;
		socket.broadcast.emit('announcement', socket.nickname + ' joined the chat.');
	
		if(!dj) {
			elect(socket);
		} else {
			socket.emit('song', currentSong);
		}

	});

	

	socket.on('search', function(q, fn) {
		request('http://tinysong.com/s/' + encodeURIComponent(q) + '?format=json&limit=3&key=511efc4655606a43267479ea32e803e9', function(res) {
				if(200 == res.status) 
					fn(JSON.parse(res.text));
			});
	});

	socket.on('text', function(msg, fn){
		socket.broadcast.emit('text', socket.nickname, msg);
		
		//confirm the reception
		fn(Date.now());
	});

	socket.on('song', function(song) {
		if(socket.dj) {
			currentSong = song;
			socket.broadcast.emit('song', song);
		}
	});
});

/* Listen */
app.listen(3000);

