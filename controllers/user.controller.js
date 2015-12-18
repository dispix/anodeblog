function User(db)
{
	this.db = db
}

User.prototype =
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

			}
		}
	},
	login : function(req, res)
	{
		if (req.method == 'GET')
		{
			res.render('skel.jade')
		}
		else
		{

		}
	},
	register : function(req, res)
	{

	},
	logout : function(req, res)
	{

	}
}

module.exports = User