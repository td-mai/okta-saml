/**
 * http://usejsdoc.org/
 */
const express = require("express");
const connect = require('connect');
const auth = require('./auth');
const path =require("path");
const app = express();
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
flash = require('connect-flash'),

app.set('port', 3000);
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser("secrettexthere"));
//code for importing static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession(
		{   secret: "secrettexthere",
			resave: false,
			saveUninitialized: true,
			cookie:{httpOnly:true/*, secure: true*/},
			}));

app.use(flash());

app.use(auth.initialize());
app.use(auth.session());

app.get('/', auth.protected, function(req, res){
	res.sendFile(__dirname + "/index.html");
});

app.get('/home', auth.protected, function(req, res){
	res.sendFile(__dirname + "/home.html");
});


// GET login, Call passport authentication method

app.get('/login', auth.authenticate('saml', {failureRedirect: '/', failureFlash: true}),
		function(req, res){
			res.redirect('/');
		}	
)

// POST methods, redirect to home successful login
app.post('/login/callback', auth.authenticate('saml', {failureRedirect: '/', failureFlash: true}),
		function(req, res){
			req.session.save(() => {
			      res.redirect('/home');
			});
		}	
)

const currentPort = app.listen(3000);
console.log("Server started at PORT " + currentPort);