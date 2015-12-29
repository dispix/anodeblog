function Article(db)
{
	this.db = db
	this.manager 	= new(require('../models/article.manager.js'))(db)
}

Article.prototype =
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
		}
	},
	listAction : function(req, res)
	{
		res.render('skel.jade')
	},
	createAction : function(req, res)
	{

	}
}

module.exports = Article