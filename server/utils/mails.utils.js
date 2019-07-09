const	nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'matcha.no.reply42@gmail.com',
      pass: 'matchanoreply42'
    }
});

let resetMail = (email, code) => {
	let mail = {
		from: 'matcha.no.reply.42@gmail.com',
		to: email,
		subject: 'Demande de réinitialisation de mot de passe',
		html: '<p>Une demande de reinitialisation de mot de passe à été effectué. Cliquez ' +
			'<a href="http://localhost:3000/reset/' + code + '">ici</a> ' +
			'pour procéder à la réinitialisation. Si vous n\'êtes pas l\'auteur de cette demande, contactez le support.</p>'
	};
	return mail;
};

function mailOptions(email, token) {
	let mailOption = {
	from: 'matcha.no.reply.42@gmail.com',
	to: email,
	subject: 'Bienvenue sur Matcha !',
	html: '<p>Clique <a href="http://localhost:3000/validate' + token + '">ici</a> pour valider ton compte !</p>'
  };
  return mailOption;
}

module.exports = {
	sendEmail: function(email, token) {
		transporter.sendMail(mailOptions(email, token));
	},
	sendResetEmail: (email, code) => {
		transporter.sendMail(resetMail(email, code));
		return Promise.resolve();
	},
	ValidateEmail: function(email) {
		let mailformat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
		return email.match(mailformat);
	}
};