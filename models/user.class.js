function User(db)
{
	this.db 	= db
	this._name 	= ''
	this._hash 	= ''
	this._email = ''
}

User.prototype =
{
	set name(name)
	{
		this._name = name
		return true
	},
	get name()
	{
		return this._name
	},
	setHash: function(password, password2, callback)
	{
		var self = this
		if (password === password2)
		{
			bcrypt.genSalt(10, function(err, salt)
			{
				if (err)
					return callback(err)
				bcrypt.hash(password, salt, function(err, hash)
				{
					if (err)
						return callback(err)

					self._hash = hash
					return callback(null, true)
				})
			})
		}
		else
		{
			callback('Passwords don\'t match')
		}
	},
	get hash()
	{
		return this._hash
	},
	set email(email)
	{
		this._email = email
		return true
	},
	get email()
	{
		return this._email
	}
}

module.exports = User