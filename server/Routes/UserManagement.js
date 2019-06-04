const bcrypt = require('bcrypt');
const rand = require('rand-token');
const jwtUtils = require('../utils/jwt.utils');
const dbUtils = require('../utils/db.query');
const mailsUtils = require('../utils/mails.utils');
const validationUtils = require('../utils/validation.utils');
const { StringDecoder } = require('string_decoder');
const {loremIpsum} = require('lorem-ipsum');
const decoder = new StringDecoder('utf8');

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
                let profile;
                let banner = '/assets/banner.jpg';
                psw = bcrypt.hashSync(psw, 10);
                let token = rand.generate(50);
                let acc_id = Math.random().toString(36).substr(2, 9);
                if (gender === 'Man' || gender === 'Woman') {
                    profile = gender === 'Man' ? '/assets/profile_man.jpg' : '/assets/profile_woman.jgp'
                } else {
                    profile = '/assets/undefined_profile.png'
                }
                dbUtils.insertUser(acc_id, profile, banner, email, firstname, lastname, username,
                    psw, age, gender, sexuality, 2.50, 'Never connected...', loremIpsum(4), token, 0);
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

        if (!email.length || !psw.length) return res.status(400).json({
            status: true,
            type: 'error',
            message: 'Invalid inputs !'
        });
        return dbUtils.searchUserByEmailOrUsername(email, '').then(user => {
            if (user) {
                if (user.activate === 0) {
                    return res.status(200).json({
                        status: true,
                        type: 'error',
                        message: 'Account unvalidated ! Check your mails !'
                    });
                } else {
                    bcrypt.compare(psw, user.password, (err, result) => {
                        if (err) throw err;
                        if (result === false) {
                            return res.status(200).json({
                                status: true,
                                type: 'error',
                                message: 'Wrong password !'
                            });
                        } else {
                            dbUtils.updateConnectionStatus(user.acc_id, 'Connected');
                            let token = jwtUtils.generateTokenforUser(user);
                            return res.status(200).json({success: token});
                        }
                    })
                }
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
    },
    verifyToken: (req, res) => {
        let token = req.body.token;

        if (token) {
            let decoded = jwtUtils.verifyUserToken(token);
            console.log('Je suis le token: ', decoded);
            if (!decoded.id) {
                // module.exports.logoutUser();
            } else {
                return res.status(200).json(decoded);
            }
        } else {
            // module.exports.logoutUser();
        }
    },
    userInfo: (req, res) => {
        let acc_id = req.body.acc_id;

        if (acc_id) {
            return dbUtils.getUserPublicInfo(acc_id, '')
                .then(user => {
                    return res.status(200).json(user);
                })
        } else {
            return res.status(200).json({'error': 'Invalid id'});
        }
    },
    fetchUserProfileByUsername: (req, res) => {
        let username = req.body.username;

        console.log(req.body);
        if (username) {
            dbUtils.getUserPublicInfo('', username)
                .then(data => {
                    return res.status(200).json(data);
                })
        }
    },
    uploadPicture: (req, res) => {
        let acc_id = req.body.id;
        let pic = req.files.file;
        let root = process.env.PWD.replace('/server', '');
        let filePath = `${root}/client/public/assets/uploads/${Date.now()}.jpg`;
        let dbPath = filePath.substr(51);
        validationUtils.validateImage(pic.mimetype, Buffer.from(pic.data, 'hex'));

        // if (Buff) {
        //     console.log(Buff.data);
        // }
         // if ((pic.mimetype === 'image/jpeg' && ) || (pic.mimetype === 'image/png')) {
         //
         // }

        // dbUtils.checkNumbersOfPicture(acc_id)
        //     .then(num => {
        //         if (num < 4) {
        //             pic.mv(filePath, (err) => {
        //                 if (err) throw err;
        //                 dbUtils.insertPicture(acc_id, dbPath)
        //                     .then(() => {
        //                         return res.status(200).json({status: 'UPLOAD', path: dbPath});
        //                     })
        //             })
        //         } else {
        //             return res.status(200).json({error: 'Too much pictures !'});
        //         }
        //     });
        return res.status(200);
    },
    deletePicture: (req, res) => {
        let acc_id = req.body.acc_id;
        let pic = req.body.pic;
        let pic_id = req.body.pic_id;

        dbUtils.deletePicture(acc_id, pic)
            .then(() => {
                return res.status(200).json({status: 'DELETE', pic_id: pic_id});
            })
    },
    logoutUser: (req, res) => {
        let time = req.body.time;
        let id = req.body.id;

        dbUtils.updateConnectionStatus(id, time).then(() => {
            return res.status(200).send('OK');
        });
    },
};