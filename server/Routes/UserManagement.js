const fs = require('fs');
const path = require('path');
const secret = require('../config/private/secret');
const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = secret.SECRET;
const bcrypt = require('bcrypt');
const rand = require('rand-token');
const jwtUtils = require('../utils/jwt.utils');
const dbUtils = require('../utils/db.query');
const mailsUtils = require('../utils/mails.utils');
const validationUtils = require('../utils/validation.utils');
const {StringDecoder} = require('string_decoder');
const decoder = new StringDecoder('utf8');
const Socket = require('../utils/socket');

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
            return res.status(200).json({status: true, type: 'error', message: 'Invalid inputs !'});
        return dbUtils.searchUserByEmailOrUsername(email, username).then(user => {
            if (!user) {
                validationUtils.getUserLocationByIp()
                    .then(data => {
                        psw = bcrypt.hashSync(psw, 10);
                        let token = rand.generate(50);
                        let acc_id = Math.random().toString(36).substr(2, 9);
                        dbUtils.insertUser(acc_id, email, firstname, lastname, username,
                            psw, age, gender, sexuality, 2.50, 'Never connected...', '', token, 0);
                        dbUtils.insertPictureAccountCreation(acc_id, '/assets/tulips.jpg', 'profile_pic');
                        dbUtils.insertPictureAccountCreation(acc_id, '/assets/banner.png', 'banner_pic');
                        dbUtils.insertUserLocation(acc_id, data.lat, data.lon).then(() => {
                            mailsUtils.sendEmail(email, token);
                        });
                    });
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
                            return res.status(200).json({type: 'success', token: token, id: user.acc_id});
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
    sendForgotPassword: (req, res) => {
        let {email} = req.body;

        dbUtils.verifyUser(email)
            .then(user => {
                if (user.length) {
                    const key = crypto.scryptSync(secret.SECRET, secret.SALT, 32);
                    const iv = Buffer.alloc(16, 0);
                    let cipher = crypto.createCipheriv(algorithm, key, iv);
                    let crypted = cipher.update(email, 'utf8', 'hex');
                    crypted += cipher.final('hex');
                    mailsUtils.sendResetEmail(email, crypted)
                        .then(() => {
                            return res.status(200).json({
                                status: true,
                                type: 'success',
                                message: 'Email sent !'
                            });
                        });
                } else {
                    return res.status(200).json({
                        status: true,
                        type: 'error',
                        message: 'Invalid email !'
                    });
                }
            })
    },
    resetPassword: (req, res) => {
        let {password, code} = req.body;

        if (password.length >= 8 && !!/[A-Z]+/.test(password) && !!/[0-9]+/.test(password)
            && !!/[!@#$%^&*(),.?":{}|<>]+/.test(password)) {
            const key = crypto.scryptSync(secret.SECRET, secret.SALT, 32);
            const iv = Buffer.alloc(16, 0);
            let decipher = crypto.createDecipheriv(algorithm, key, iv);
            let dec = decipher.update(code, 'hex', 'utf8');
            dec += decipher.final('utf8');
            return dbUtils.resetPassword(bcrypt.hashSync(password, 10), dec)
                .then(() => {
                    return res.status(200).json({type: 'redirect'});
                })
        } else {
            return res.status(200).json({
                status: true,
                type: 'error',
                message: 'Invalid password provided !'
            });
        }
    },
    verifyToken: (req, res) => {
        let token = req.body.token;
        if (token) {
            let decoded = jwtUtils.verifyUserToken(token);
            if (!decoded.id) {
                return res.status(200).json({message: 'Token expired !'});
            } else {
                return res.status(200).json(decoded);
            }
        } else {
            return res.status(200).json({message: 'No token provided !'});
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
    checkBlock: (req, res) => {
        let {acc_id, username} = req.body;

        dbUtils.checkBlock(acc_id, username)
            .then(data => {
                return res.status(200).json({'block_status': data});
            })
    },
    checkLikes: (req, res) => {
        let {acc_id, username} = req.body;

        dbUtils.checkLikes(acc_id, username)
            .then(data => {
                if (!data) {
                    return res.status(200).json({like: 'no_one', status: false})
                }
                if (!Object.keys(data).length || data.match === 1) {
                    return res.status(200).json({like: 'no_one', status: false})
                } else if (Object.keys(data).length) {
                    let like = {};
                    if (data.person1 === acc_id) {
                        like = data.like1 !== 1 ? {like: 'dislike', status: false} : {like: 'you', status: true}
                    } else if (data.person2 !== acc_id && data.like2 === 1) {
                        like = data.like2 !== 1 ? {like: 'other', status: false} : {like: 'other', status: true}
                    }
                    return res.status(200).send(like)
                }
            })
    },
    changeInfo: (req, res) => {
        let {acc_id, name, value} = req.body;

        if (acc_id && name && value) {
            name = name === 'check_password' ? 'password' : name;
            if (name === 'password') {
                value = bcrypt.hashSync(value, 10);
            }
            dbUtils.updateUserInfo(acc_id, name, value);
            return res.status(200).send('OK');
        }
    },
    changeLocation: (req, res) => {
        let {acc_id, lat, lng} = req.body;

        if (acc_id && lat && lng && typeof lat === 'number' && typeof lng === 'number') {
            dbUtils.updateLocation(acc_id, lat, lng);
            return res.status(200).send('OK');
        }
    },
    fetchUserProfileByUsername: (req, res) => {
        let username = req.body.username;

        if (username) {
            dbUtils.getUserPublicInfo('', username)
                .then(data => {
                    return res.status(200).json(data);
                })
        }
    },
    addTag: (req, res) => {
        let {acc_id, tag} = req.body;

        dbUtils.insertTag(acc_id, tag)
            .then(() => {
                return res.status(200).json({type: 'ADD', value: tag});
            })
    },
    deleteTag: (req, res) => {
        let {acc_id, tag} = req.body;

        dbUtils.deleteTag(acc_id, tag)
            .then(() => {
                return res.status(200).json({type: 'DELETE', value: tag});
            })
    },
    manageBio: (req, res) => {
        let {acc_id, bio} = req.body;

        dbUtils.insertBio(acc_id, bio)
            .then(() => {
                return res.status(200).json({type: 'MANAGE', value: bio});
            })
    },
    uploadPicture: (req, res) => {
        let acc_id = req.body.id;
        let pic = req.files.file;
        let root = process.env.PWD.replace('/server', '');
        let filePath = `${root}/client/public/assets/uploads/${Date.now()}.jpg`;
        let dbPath = filePath.split('/').slice(-1)[0];
        if ((pic.mimetype === 'image/jpeg') || (pic.mimetype === 'image/png')) {
            if (validationUtils.validateImage(pic.mimetype, Buffer.from(pic.data, 'hex')) === true) {
                dbUtils.checkNumbersOfPicture(acc_id)
                    .then(num => {
                        if (num < 6) {
                            pic.mv(filePath, (err) => {
                                if (err) throw err;
                                dbUtils.insertPicture(acc_id, dbPath, 'pic')
                                    .then(() => {
                                        return res.status(200).json({
                                            status: 'UPLOAD',
                                            path: `/assets/uploads/${dbPath}`
                                        });
                                    })
                            })
                        } else {
                            return res.status(200).json({status: 'UPLOAD', error: 'Too much pictures !'});
                        }
                    });
            } else {
                return res.status(200).json({status: 'UPLOAD', error: 'Invalid image !'});
            }
        } else {
            return res.status(200).json({status: 'UPLOAD', error: 'Invalid image !'});
        }
    },
    updateProfilePicture: (req, res) => {
        let {acc_id, pic, pic_id} = req.body;

        dbUtils.updateProfilePicture(acc_id, pic, pic_id)
            .then(() => {
                return res.status(200).send({status: 'UPDATE'})
            });
    },
    deletePicture: (req, res) => {
        let {acc_id, pic, pic_id} = req.body;

        dbUtils.deletePicture(acc_id, pic)
            .then(data => {
                return res.status(200).json({status: 'DELETE', pic_id: pic_id, type: data});
            })
    },
    reportUser: (req, res) => {
        let {acc_id, username, pattern, message} = req.body;

        if (acc_id.length && username.length && pattern.length) {
            if (pattern === 'Harassment' || pattern === 'Fake account' || pattern === 'Spam' || pattern === 'Hacked') {
                dbUtils.reportUser(acc_id, username, pattern, message)
                    .then(data => {
                        return data === false ? res.status(200).send('Error') : res.status(200).send('REPORTED');
                    })
            } else {
                return res.status(200).send('Wrong select value !');
            }
        }
    },
    blockUser: (req, res) => {
        let {acc_id, username} = req.body;

        if (acc_id.length && username.length) {
            dbUtils.blockUser(acc_id, username)
                .then(data => {
                    return data === false ? res.status(200).send('Error') : res.status(200).send('BLOCKED');
                })
        } else {
            return res.status(200).send('Wrong value !');
        }
    },
    unblockUser: (req, res) => {
        let {acc_id, username} = req.body;

        if (acc_id.length && username.length) {
            dbUtils.unblockUser(acc_id, username)
                .then(data => {
                    return data === false ? res.status(200).send('Error') : res.status(200).send('UNBLOCKED');
                })
        } else {
            return res.status(200).send('Wrong value !');
        }
    },
    logoutUser: (req, res) => {
        let time = req.body.time;
        let id = req.body.id;

        dbUtils.updateConnectionStatus(id, time).then(() => {
            return res.status(200).send('OK');
        });
    },
};