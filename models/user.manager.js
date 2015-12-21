function UserMng(db)
{
	this.db = db,
	this.class = new(require('../models/user.class.js'))(db)
}

UserMng.prototype =
{
	create : function(name, password, password2, callback)
	{
		var UserMng = this
		UserMng.db.query(
			'SELECT * FROM user WHERE name = ?',
			[name],
			function(err, results, fields)
			{
				if (results.length > 0)
				{
					console.log(results)
					return callback('User already exists')
				}
				else
				{
					if (password == password2)
					{
						UserMng.db.query(
							'INSERT INTO user (name, hash) VALUES (?, ?)',
							[name, password],
							function(err, result)
							{
								if (err)
								{
									return callback(err)
								}
								else
								{
									return callback(null, result.insertId)
								}
							}
						)
					}
					else
					{
						res.end('passwords don\'t match')
					}
				}
			}
		)
	}
}

module.exports = UserMng