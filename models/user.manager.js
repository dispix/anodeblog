function UserMng(db)
{
	this.db = db
	this.class = new(require('../models/user.class.js'))(db)
}

UserMng.prototype =
{
	create : function(name, email, password, password2, callback)
	{
		var self = this
		var user = new(require('../models/user.class.js'))(self.db)

		self.readByEmail(email, function(err, results, fields)
		{
			if (err)
				return callback(err)

			if (results.length > 0)
			{
				return callback('This email is already registered')
			}
			else
			{
				try {
					user.name = name
				} catch (e) {
					return callback(e)
				}
				try {
					user.email = email
				} catch (e) {
					return callback(e)
				}
				user.setHash(password, password2, function(err, callback)
				{
					if (err)
						return callback(err)

					self.db.query('INSERT INTO user (name, email, hash) VALUE (?, ?, ?)',
						[user.name, user.email, user.hash],
						function(err, result)
						{
							if (err)
								return callback(err)

							return self.readById(result.insertId, callback)
						}
					)
				})
			}
		})
		// self.db.query(
		// 	'SELECT * FROM user WHERE name = ?',
		// 	[name],
		// 	function(err, results, fields)
		// 	{
		// 		if (results.length > 0)
		// 		{
		// 			console.log(results)
		// 			return callback('User already exists')
		// 		}
		// 		else
		// 		{
		// 			if (password == password2)
		// 			{
		// 				self.db.query(
		// 					'INSERT INTO user (name, hash) VALUES (?, ?)',
		// 					[name, password],
		// 					function(err, result)
		// 					{
		// 						if (err)
		// 						{
		// 							return callback(err)
		// 						}
		// 						else
		// 						{
		// 							return callback(null, result.insertId)
		// 						}
		// 					}
		// 				)
		// 			}
		// 			else
		// 			{
		// 				res.end('passwords don\'t match')
		// 			}
		// 		}
		// 	}
		// )
	},
	readById : function(id, callback)
	{
		var self = this
		self.db.query('SELECT * FROM user WHERE id = ?', [id], function(err, results, fields)
		{
			return callback(err, results, fields)
		})
	},
	readByName : function(name, callback)
	{
		var self = this
		self.db.query('SELECT * FROM user WHERE name = ?', [name], function(err, results, fields)
		{
			return callback(err, results, fields)
		})
	},
	readByEmail : function(email, callback)
	{
		var self = this
		self.db.query('SELECT * FROM user WHERE email = ?', [email], function(err, results, fields)
		{
			return callback(err, results, fields)
		})
	},
	update : function(user, callback)
	{
		this.db.query('UPDATE user SET name = ?, email = ?, hash = ? WHERE id = ?',
			[user.name, user.email, user.hash, user.id],
			function(err, result)
			{
				return callback(err, result)
			}
		)
	},
	delete : function(user, callback)
	{
		this.db.query('DELETE FROM user WHERE id = ?', [user.id], function(err, result)
		{
			return callback(err, result)
		})
	}
}

module.exports = UserMng