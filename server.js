// A simple web server example
// Demonstrates form submission

var qs = require('querystring');
require('http').createServer(function(req, res) {

	/* If else loop here inspects the url property of the request object */

	if('/' == req.url) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		
		res.end([
		'<form method="POST" action="/url">',
		'<h1>My Form</h1>',
		'<fieldset>',
		'<label> Personal Information </label>',
		'<p> What is your name?</p>',
		'<input type="text" name="name">',
		'<p><button>Submit</button></p>',
		'</form>'
		].join(''));
		
	} else if ('/url' == req.url) {
		var body = '';
		req.on('data', function(chunk) {
			body += chunk;
		});

		req.on('end', function() {
			res.writeHead(200, {'Content-Type' : 'text/html'});

			/* 
				Here we are listening to the data and end events. We create a 
				body string that gets populated with different chunks. 
				We get all the data only after the end event is fired 
				Content type here is url-encoded 
			*/ 

			// res.end('<p> Content-Type: ' + req.headers['content-type']  +
			// 	'</p>' + '<p> Data: <pre>' + body + '</pre>');

			/* Here we are parsing the body with querystring module */
			res.end('<p> Your name is : <b>' + qs.parse(body).name + '</b></p>'); 
			
		});
	} else {
		//Bulletproofing : If a specific url is not found
		res.writeHead(404);
		res.end('Not Found');
	}

	}).listen(3000);
