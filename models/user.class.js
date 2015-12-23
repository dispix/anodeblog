function User(db)
{
	this.db 	= db
	this._id 	= 0
	this._name 	= ''
	this._hash 	= ''
	this._email = ''
}

User.prototype =
{
	get id()
	{

	},
	get name()
	{
		return this._name
	},
	get hash()
	{
		return this._hash
	},
	get email()
	{
		return this._email
	},
	set name(name)
	{
		this._name = name
		return true
	},
	setHash : function(password, password2, callback)
	{
		var self = this
		if (password === password2)
		{
			bcrypt.hash(password, 10, function(err, hash)
			{
				if (err)
					return callback(err)

				self._hash = hash
				return callback(null, true)
			})
		}
		else
		{
			callback('Passwords don\'t match')
		}
	},
	set email(email)
	{
		this._email = email
		return true
	},
	checkPassword : function(password, callback)
	{
		bcrypt.compare(password, this._hash, function(err, result)
		{
			return callback(err, result)
		})
	}
}

module.exports = User