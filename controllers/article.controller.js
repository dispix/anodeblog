function Article(db)
{
	this.db = db
}

Article.prototype =
{
	exec : function(req, res)
	{
		if (req.params.action == 'list')
		{
			this.list(req, res)
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
	list : function(req, res)
	{
		res.render('skel.jade')
	}
}

module.exports = Article