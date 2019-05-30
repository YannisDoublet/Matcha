const	jwt = require('jsonwebtoken');
const 	JWT_SECRET_TOKEN = '37Q4EutKDdfL9KK2G3mWUt9F3BXeXTdQ5AP6qAjkgXVhxDNhsgKO';

module.exports = {
	generateTokenforUser: (userData) => {
		return jwt.sign({
			id: userData.acc_id
		},
		JWT_SECRET_TOKEN,
		{
			expiresIn: '1h'
		});
	},
	verifyUserToken: (token) => {
		return jwt.verify(token, JWT_SECRET_TOKEN, (err, decoded) => {
			if (err) return err;
			return decoded;
		});
	}
};