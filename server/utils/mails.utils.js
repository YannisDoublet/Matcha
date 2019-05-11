const	nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'matcha.no.reply42@gmail.com',
      pass: 'matchanoreply42'
    }
});

function mailOptions(email, token) {
	let mailOption = {
	from: 'matcha.no.reply.42@gmail.com',
	to: email,
	subject: 'Bienvenue sur Matcha !',
	html: '<p>Clique <a href="http://localhost:8080/validation?token=' + token + '">ici</a> pour valider ton compte !</p>'
  };
  return mailOption;
}

module.exports = {
	sendEmail: function(email, token) {
		transporter.sendMail(mailOptions(email, token));
	},
	ValidateEmail: function(email) {
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(email.match(mailformat)) {
			console.log('Email valide !');
			return true;
		} else {
			console.log("Email invalide !");
			return false;
		}
	}
};