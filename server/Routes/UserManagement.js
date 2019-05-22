const bcrypt = require('bcrypt');
const rand = require('rand-token');
const jwtUtils = require('../utils/jwt.utils');
const dbUtils = require('../utils/db.query');
const mailsUtils = require('../utils/mails.utils');
const validationUtils = require('../utils/validation.utils');

module.exports = {
    register: (req, res) => {
        let email = req.body.email;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let username = req.body.username;
        let psw = req.body.password;
        let psw1 = req.body.check_password;
        let age = parseInt(req.body.age);
        let sexuality = !req.body.sexuality ? 'Bisexual' : req.body.sexuality;
        let gender = req.body.gender;

        if (!email.length || mailsUtils.ValidateEmail(email) === false ||
            !firstname.length || !lastname.length || !psw.length || !psw1.length ||
            age < 18 && age > 99 || !gender.length || validationUtils.validateGender(gender) === false
            || !sexuality.length || validationUtils.validateSexuality(sexuality) === false || psw !== psw1)
            return res.status(400).json({status: true, type: 'error', message: 'Invalid inputs !'});
        return dbUtils.searchUserByEmailOrUsername(email, username).then(user => {
            if (!user) {
                psw = bcrypt.hashSync(psw, 10);
                let token = rand.generate(50);
                let acc_id = Math.random().toString(36).substr(2, 9);
                dbUtils.insertUser(acc_id, email, firstname, lastname, username, psw, age, gender, sexuality, token, 0);
                mailsUtils.sendEmail(email, token);
            } else {
                return res.status(200).json({
                    status: true,
                    type: 'error',
                    message: 'Username or email already taken !'
                });
            }
            return res.status(200).json({
                status: true,
                type: 'success',
                message: 'User successfully created ! Check your email before login!'
            });
        });
    },
    login: (req, res) => {
        let email = req.body.email;
        let psw = req.body.password;

        if (!email.length || !psw.length) return res.status(400).json({status: true, type: 'error', message: 'Invalid inputs !'});
        return dbUtils.searchUserByEmailOrUsername(email, '').then(user => {
            if (user) {
                bcrypt.compare(psw, user.password, (err, result) => {
                    if (err) throw err;
                    if (result === false) {
                        return res.status(200).json({
                            status: true,
                            type: 'error',
                            message: 'Wrong password !'
                        });
                    } else {
                        let token = jwtUtils.generateTokenforUser(user);
                        return res.status(200).json({success: token});
                    }
                })
            } else {
                return res.status(200).json({
                    status: true,
                    type: 'error',
                    message: 'Unknown user !'
                });
            }
        })
    },
    validate: (req, res) => {
        let token = req.query.token;

        if (token && parseInt(token.length) === 50) {
            return dbUtils.searchUserByToken(token).then(user => {
                if (user) {
                    if (user.activate === 1) {
                        return res.status(200).json({
                            status: true,
                            type: 'error',
                            message: 'Account already validated !'
                        });
                    } else {
                        return dbUtils.validateUser(token).then(() => {
                            return res.status(200).json({
                                status: true,
                                type: 'success',
                                message: 'Account validated !'
                            });
                        })
                    }
                } else {
                    return res.status(200).json({
                        status: true,
                        type: 'error',
                        message: 'Invalid token provided !'
                    });
                }
            })
        } else {
            return res.status(200).json({
                status: true,
                type: 'error',
                message: 'Invalid token provided !'
            });
        }
    }
};