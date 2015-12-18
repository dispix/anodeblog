var express 	= require('express')
var session 	= require('express-session')
var cookieParser = require('cookie-parser')
var mysql 		= require('mysql')
var app 		= express()
var jade 		= require('jade')

// var db 	= mysql.createConnection({
// 				host : 'localhost',
// 				user : 'pma',
// 				password : '',
// 				database : 'test'})
//
// db.connect(function(err) {
// 	if (err) {
// 		console.error('error connecting: ' + err.stack);
// 		return;

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(cookieParser())
app.use(session({secret:'bla123bla'}))
app.use(express.static('public'))

// Public routes
app.get('/login', function(req, res)
{
	if (req.session.sessionId)
	{
		res.location('/home')
	}
	else
	{
		res.render('skel.jade', {page: 'content/login'})
	}
})
app.get('/register', function(req, res)
{
	if (req.session.sessionId)
	{
		res.location('/home')
	}
	else
	{
		res.render('skel.jade', {locals: {page: 'content/register'}})
	}
})

// Default route
app.get('/', function(req, res)
{
	res.render('skel.jade')
})

if (app.listen(8080))
{
	console.log('Server running on port 8080')
}
