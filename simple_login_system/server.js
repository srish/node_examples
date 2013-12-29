/* Module Dependencies */
var connect = require('connect'),
	users = require('./users'),
	express = require('express')

var app = express();

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(connect.session({ secret: "my app secret"})); // for security 
										// reasons, we need to supply a 
										// secret option while initializing
										// the middleware
});

app.use(function(req, res, next) {

	//This module displays a form to log in
	if('/' == req.url && 'GET' == req.method) {	
		res.writeHead(200, {'Content-Type': 'text/html' });
		res.end([
			'<form action"/login" method="POST">',
			'<fieldset>',
			'<legend> Please log in : </legend>',
			'<p>User: <input type="text" name="user"></p>',
			'<p>Password: <input type="password" name="password"></p>',
			'<button>Submit</button>',
			'</fieldset>',
			'</form>'
			].join(''));
	} else {
		next();
	}

	// This module checks if the credentials entered by a user exists and
	// if so logs in the user as a result
	if('POST' == req.method) {		
		if(!users[req.body.user] || req.body.password != users[req.body.user].
			password) {
			res.end('Bad Username / Password');
		} else {
			req.session.logged_in = true;
			req.session.name = users[req.body.user].name;
			res.end('Authenticated!');
		}
	} 

	// Checks if the user is already logged in
	if('/' == req.url && req.session.logged_in) {
		res.end(
			'Welcome Back, <b>' + req.session.name + '</b>'
			+ '<a href="/logout"> Logout</a>'
		);
	} 

	//Handles the logout action in a similar fashion
	if('/logout' == req.url) {
		req.session.logged_in = false;
		res.end('Logged out');
	} 
});

app.listen(3000);
