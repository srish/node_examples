window.onload = function() {
	var socket = io.connect();
	var lastMessage;

	socket.on('connect', function() {

		window.onmousemove = mousemoved;

		function mousemoved(ev) {
			socket.emit('move', { x: ev.clientX, y: ev.clientY });
		}

	});

	var initialized; 

	socket.on('position', function(id, x, y) {
		console.log(x +  ' : ' + y);

		//the first message is the position of all existing cursors
		if(!initialized) {
			initialized = true;
			
			move(id, x, y);
			
		}  
		
		move(id, x, y);
	

		function move(id, x, y) {
			var cursor = document.getElementById('cursor-' + id);

			if(!cursor) {
				cursor = document.createElement('img');
				cursor.id = 'cursor-' + id;
				cursor.src = '/cursor.png';
				cursor.style.position = 'absolute';
				cursor.style.width = '100px';
				cursor.style.height = '100px';
				document.body.appendChild(cursor);
			
			}

			cursor.style.left = x + 'px';
			cursor.style.top = y + 'px';
		}

	});
}