
// Modules
var express 		= require('express')
var session 		= require('express-session')
var cookieParser 	= require('cookie-parser')
var bodyParser 		= require('body-parser')
var mysql 			= require('mysql')
var app 			= express()
var jade 			= require('jade')
global.bcrypt 		= require('bcrypt')

var infos = require('./infos.js')

// Mysql connection
var db 	= mysql.createConnection(
{
	host : 		infos.sql.host,
	port: 		infos.sql.port,
	user : 		infos.sql.user,
	password : 	infos.sql.password,
	database : 	infos.sql.database
})
db.connect(function(err)
{
	if (err)
	{
		console.error('error connecting: ' + err.stack)
		return
	}

	console.log('connected as id ' + db.threadId)
})


// Default settings
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({secret: infos.secret}))
app.use(express.static('public'))


// Pages
var pages 	=
{
	'user'		: new (require('./controllers/user.controller.js'))(db),
	'article'	: new (require('./controllers/article.controller.js'))(db),
	//'home'		: new (require('./controllers/default.controller.js'))(db)
}


// Routes
app.use('/:page/:action', function(req, res)
{
	var page 	= req.params.page
	if (pages[page] !== undefined)
	{
		pages[page].exec(req, res)
	}
	else
	{
		res.status(404).render('content/404')
	}
})
app.use('/:page', function(req, res)
{
	var page 	= req.params.page
	if (pages[page] !== undefined)
	{
		pages[page].exec(req, res)
	}
	else
	{
		res.status(404).render('content/404')
		res.end()
	}
})

app.use('/', function(req, res)
{
	if (req.session.userId !== undefined)
	{
		pages.user.manager.readById(req.session.userId, function(err, results, fields)
		{
			if (err)
				res.status(500).json(err)
				return res.end()

			res.render('skel', {currentUser: results[0]})
			res.end()
		})
	}
	else
	{
		res.render('skel')
		res.end()
	}
})


// Server starts
if (app.listen(8080))
{
	console.log('Server running on port 8080')
}