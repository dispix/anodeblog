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
			}
		}
	},

	login : function(req, res)
	{
		if (req.method == 'GET')
		{
			res.render('login.jade')
		}
		if  (req.method == 'POST')
		{
			console.log(req.body)
		}
	},

	register : function(req, res)
	{
		var UserCtrl = this

		if (req.method == 'GET')
		{
			res.render('content/register.jade')
		}

		if (req.method == 'POST')
		{
			if (req.body.register_name &&
				req.body.register_password &&
				req.body.register_password_repeat)
			{
				UserCtrl.manager.create
				(
					req.body.register_name,
					req.body.register_password,
					req.body.register_password_repeat,
					function(err, response)
					{
						if (err)
						{
							res.json(err)
							res.end
						}
						else
						{
							res.json(response)
							res.end
						}
					}
				)
			}
			else
			{
				res.end('Pas ok')
			}
		}
	},

	logout : function(req, res)
	{

	}
}

module.exports = UserCtrl