const	jwt = require('jsonwebtoken');

const 	JWT_SECRET_TOKEN = '37Q4EutKDdfL9KK2G3mWUt9F3BXeXTdQ5AP6qAjkgXVhxDNhsgKO';

module.exports = {
	generateTokenforUser: (userData) => {
		return jwt.sign({
			userUsername: userData.username
		},
		JWT_SECRET_TOKEN,
		{
			expiresIn: '1h'
		});
	}
};