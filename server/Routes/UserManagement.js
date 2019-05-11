const	bcrypt = require('bcrypt');
const	rand = require('rand-token');
const	jwtUtils = require('../utils/jwt.utils');
const	dbUtils = require('../utils/db.query');
const	mailsUtils = require('../utils/mails.utils');

module.exports = {
	register: function(req, res) {
		let email = String(req.body.email);
		let prenom = String(req.body.prenom);
		let nom = String(req.body.nom);
		let psw = String(req.body.psw);
		let psw1 = String(req.body.psw1);
		let age = Number(req.body.age);
		let gender = String(req.body.gender);

		if (!email.length || mailsUtils.ValidateEmail(email) === false ||
		!prenom.length || !nom.length || !psw.length || !psw1.length ||
		age < 18 && age >= 130 || !gender.length || psw !== psw1)
			return res.status(400).json({'error': 'Champs Invalide !'});
		if (dbUtils.searchEmail(email) != undefined) {
			psw = bcrypt.hashSync(psw, 10);
			let token = rand.generate(50);
			if (dbUtils.insertUser('user', email, prenom, nom, psw, age, gender, 0, token, 0) === true) {
				mailsUtils.sendEmail(email, token);
			}
		}
		else {
			return res.status(409).json({'error': 'Utilisateur déjà existant !'});
		}
		return res.status(200).json({'success': 'Utilisateurs Créé !'});
	},
	login: function(req, res) {

	}
};