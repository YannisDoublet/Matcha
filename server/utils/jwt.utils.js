const	jwt = require('jsonwebtoken');

const 	JWT_SECRET_TOKEN = '37Q4EutKDdfL9KK2G3mWUt9F3BXeXTdQ5AP6qAjkgXVhxDNhsgKO';

module.exports = {
	generateTokenforUser: function(userData) {
		return jwt.sign({
			userPrenom: userData.prenom,
			userToken: userData.token
		},
		JWT_SECRET_TOKEN,
		{
			expiresIn: '1h'
		});
	}
};