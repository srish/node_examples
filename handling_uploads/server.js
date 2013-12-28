var connect = require('connect'),
	fs = require('fs'),
	express = require('express')

var app = express();

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(connect.static('static'));
});


app.listen(3000);

app.use(function(req, res, next) {
	if('POST' == req.method) { 
		console.log(req.files);
		fs.readFile(req.files.name.path, 'utf8', function(err, data) {
			if(err) {
				res.writeHead(500);
				res.end('Error!');
				return;
			} else {
				console.log('can post');
			}

		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end([

			'<h3> File: ' + req.files.name.name + '</h3>',
			'<h4> Type: ' + req.files.name.type + '</h4>',
			'<h4> Contents: </h4><pre>' + data + '</pre'

		].join(''));
		});

	} else {
		next();
	}
});

