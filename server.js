
// Modules
var express 		= require('express')
var session 		= require('express-session')
var cookieParser 	= require('cookie-parser')
var mysql 			= require('mysql')
var app 			= express()
var jade 			= require('jade')


// Mysql connection
var sql = require('./sql.js')
var db 	= mysql.createConnection({
				host : sql.host,
				user : sql.user,
				password : sql.password,
				database : sql.database
})

db.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack)
		return
	}
})


// Default settings
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(cookieParser())
app.use(session({secret:'bla123bla'}))
app.use(express.static('public'))


// Pages
var pages 	=
{
	'user'		: new (require('./controllers/user.controller.js'))(db),
	'article'	: new (require('./controllers/article.controller.js'))(db),
	//'home'		: new (require('./controllers/default.controller.js'))(db)
}


// Routes
app.get('/:page/:action', function(req, res)
{
	var page 	= req.params.page
	if (pages[page] !== undefined)
	{
		pages[page].exec(req, res)
	}
})

if (app.listen(8080))
{
	console.log('Server running on port 8080')
}