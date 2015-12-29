function UserCtrl(db)
{
	this.db 		= db,
	this.manager 	= new(require('../models/user.manager.js'))(db)
}

UserCtrl.prototype =
{
	exec : function(req, res)
	{
		var action = req.params.action
		var self = this

		if (this[action+'Action'] !== undefined)
		{
			this[action+'Action'](req, res)
		}
		else
		{
			this.manager.readByName(action, function(err, results, fields)
			{
				if (err)
				{
					res.json(err)
					res.end
				}

				if (results.length === 0)
				{
					if (req.session.userId !== undefined)
					{
						self.manager.readById(req.session.userId, function(err, curUser, fields)
						{
							res.status(404).render('content/404', {currentUser: curUser[0]})
							res.end()
						})
					}
					else
					{
						res.status(404).render('content/404')
						res.end()
					}
				}
				else
				{
					if (req.session.userId !== undefined)
					{
						self.manager.readById(req.session.userId, function(err, curUser, fields)
						{
							res.status(404).render('content/user',
								{
									user: results[0],
									currentUser: curUser[0]
								}
							)
							res.end()
						})
					}
					else
					{
						res.render('content/user', {user: results[0]})
						res.end()
					}
				}
			})
		}
	},

	loginAction : function(req, res)
	{
		var self = this


		// Logout if logged in
		if (req.session.userId !== undefined)
		{
			delete req.session.userId
		}


		// Serve login page
		if (req.method == 'GET')
		{
			res.render('content/login')
		}


		// Login user
		if  (req.method == 'POST')
		{
			if (req.body.login_email && req.body.login_password)
			{
				self.manager.readByEmail(req.body.login_email, function(err, results, fields)
				{
					if (err)
					{
						res.status(500).json(err)
						return res.end()
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
								res.status(500).json(err)
								return res.end()
							}

							if (result)
							{
								req.session.userId = results[0].id

								self.manager.readById(results[0].id, function(err, results, fields)
								{
									res.redirect(200, '/', {currentUser: results[0]})
								})
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
				res.render('content/login', {error: 'Please fill all fields'})
				res.end()
			}
		}
	},

	registerAction : function(req, res)
	{
		var self = this


		// Logout if logged in
		if (req.session.userId !== undefined)
		{
			delete req.session.userId
		}


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

	logoutAction : function(req, res)
	{
		if (req.session.userId !== undefined)
		{
			delete req.session.userId
			res.redirect(302, '/')
		}
		else
		{
			res.redirect(302, '/')
		}
	}
}

module.exports = UserCtrl