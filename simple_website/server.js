/** 
* Module Dependencies 
*/

var http = require('http'),
	fs = require('fs')

/**
* Create the server
*/

var server = http.createServer(function(req, res) {
	if('GET' == req.method && '/images' == req.url.substr(0, 7)
		&& '.jpg' == req.url.substr(-4)) {

		fs.stat(__dirname + req.url, function(err, stat) {
			if(err || !stat.isFile()) {
				res.write(404);
				res.end('Not Found');
			} else {
				serve(__dirname + req.url, 'application/jpg');
			}
		});

	} else if ('GET' == req.method && '/' == req.url) {
		serve(__dirname + '/index.html', 'text/html');
	} else {
		res.write(404);
		res.end('Not Found');
	}

	function serve(path, type) {
		res.writeHead(200, {'Content-Type': type});

		//Piping the filesystem stream to the http response
		fs.createReadStream(path).pipe(res);
	}
});

/**
* And finally you listen
*/

server.listen(3000);