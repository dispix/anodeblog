function UserCtrl(db)
{
	this.db 		= db,
	this.manager 	= new(require('../models/user.manager.js'))(db)
}

UserCtrl.prototype =
{
	exec : function(req, res)
	{
		if (req.params.action == 'login')
		{
			this.login(req, res)
		}
		else if (req.params.action == 'logout')
		{
			this.logout(req, res)
		}
		else if (req.params.action == 'register')
		{
			this.register(req, res)
		}
		else
		{
			if (!isNaN(req.params.action))
			{

			}
			else
			{
				res.render('404.jade')
				res.status(404).end()
			}
		}
	},

	login : function(req, res)
	{
		var self = this

		if (req.method == 'GET')
		{
			res.render('content/login')
		}
		if  (req.method == 'POST')
		{
			if (req.body.login_email && req.body.login_password)
			{
				self.manager.readByEmail(req.body.login_email, function(err, results, fields)
				{
					if (err)
					{
						res.json(err)
						res.end()
					}

					if (results.length === 0)
					{
						res.render('content/login', {error: 'Wrong email'})
						res.end()
					}
					else
					{
						bcrypt.compare(req.body.login_password, results[0].hash, function(err, result)
						{
							if (err)
							{
								res.json(err)
								res.end()
							}

							if (result)
							{
								res.end('You are logged in')
							}
							else
							{
								res.render('content/login', {error: 'Wrong password'})
								res.end()
							}
						})
					}
				})
			}
			else
			{
				res.end('Not ok')
			}
		}
	},

	register : function(req, res)
	{
		var self = this


		// Serve register page
		if (req.method == 'GET')
		{
			res.render('content/register')
		}


		// Register new user
		if (req.method == 'POST')
		{
			if (req.body.register_name &&
				req.body.register_email &&
				req.body.register_password &&
				req.body.register_password2)
			{
				self.manager.create
				(
					req.body.register_name,
					req.body.register_email,
					req.body.register_password,
					req.body.register_password2,
					function(err, response)
					{
						if (err)
						{
							res.render('content/register', {error: err})
							res.end()
						}
						else
						{
							res.json(response)
							res.end()
						}
					}
				)
			}
			else
			{
				res.end('Not ok')
			}
		}
	},

	logout : function(req, res)
	{

	}
}

module.exports = UserCtrl