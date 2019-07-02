const Database = require('../config/db.config').Database;
const dbCredentials = require('../config/private/db.credentials').dbCredentials;
const db = new Database(dbCredentials);
const geolib = require('geolib');
db.query('CREATE DATABASE IF NOT EXISTS `Matcha`');
db.query('USE `Matcha`');

db.query('CREATE TABLE IF NOT EXISTS `users` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`acc_id` varchar(10) NOT NULL,' +
    '`email` varchar(100) NOT NULL,' +
    '`firstname` varchar(100) NOT NULL,' +
    '`lastname` varchar(50) DEFAULT NULL,' +
    '`username` varchar(50) DEFAULT NULL,' +
    '`password` varchar(100) NOT NULL,' +
    '`age` int NOT NULL,' +
    '`gender` varchar(100) NOT NULL,' +
    '`sexuality` varchar(100) NOT NULL,' +
    '`score` FLOAT NOT NULL,' +
    '`connection` varchar(100) NOT NULL,' +
    '`bio` varchar(750) NOT NULL,' +
    '`token` varchar(100) NOT NULL,' +
    '`activate` int)');

db.query('CREATE TABLE IF NOT EXISTS `users_coordinates` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`acc_id` varchar(10) NOT NULL,' +
    '`latitude` varchar(40) NOT NULL,' +
    '`longitude` varchar(40) NOT NULL)');

db.query('CREATE TABLE IF NOT EXISTS `tags` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`acc_id` varchar(10) NOT NULL,' +
    '`tag` varchar(300) NOT NULL)');

db.query('CREATE TABLE IF NOT EXISTS `users_pictures` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`acc_id` varchar(10) NOT NULL,' +
    '`picture` varchar(300) NOT NULL,' +
    '`type` varchar(20) NOT NULL)');

db.query('CREATE TABLE IF NOT EXISTS `chat` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`conv_id` varchar(10) NOT NULL,' +
    '`person1` varchar(10) NOT NULL,' +
    '`person2` varchar(10) NOT NULL,' +
    '`last_message` varchar(5000) NOT NULL,' +
    '`date` varchar(100) NOT NULL)');

db.query('CREATE TABLE IF NOT EXISTS `chat_messages` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`conv_id` varchar(10) NOT NULL,' +
    '`sender_id` varchar(10) NOT NULL,' +
    '`message` varchar(5000) NOT NULL,' +
    '`date` varchar(100) NOT NULL)');

db.query('CREATE TABLE IF NOT EXISTS `matcher` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`person1` varchar(10) NOT NULL,' +
    '`person2` varchar(10) NOT NULL,' +
    '`like1` boolean,' +
    '`like2` boolean,' +
    '`match` boolean)');

db.query('CREATE TABLE IF NOT EXISTS `reports` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`reporter` varchar(10) NOT NULL,' +
    '`reported` varchar(10) NOT NULL,' +
    '`pattern` varchar(100),' +
    '`message` varchar(10000))');

db.query('CREATE TABLE IF NOT EXISTS `block` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`blocker` varchar(10) NOT NULL,' +
    '`blocked` varchar(10) NOT NULL,' +
    '`status` boolean)');

db.query('CREATE TABLE IF NOT EXISTS `notifications` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`sender` varchar(10) NOT NULL,' +
    '`receiver` varchar(10) NOT NULL,' +
    '`type` varchar(100) NOT NULL,' +
    '`img` varchar(1000) NOT NULL,' +
    '`message` varchar(1000) NOT NULL,' +
    '`open` boolean)');

module.exports = {
    searchUserByEmailOrUsername: (email, username) => {
        return db.query('SELECT * FROM `users` WHERE email=? OR username=?', [email, username])
            .then(data => {
                return data[0];
            });
    },
    searchUserByToken: (token) => {
        return db.query('SELECT * FROM `users` WHERE token=?', [token])
            .then(data => {
                return data[0];
            });
    },
    fetchAllUsers: (acc_id, lat, lng) => {
        return db.query('SELECT `acc_id` FROM `users` WHERE acc_id<>?', [acc_id])
            .then(async data => {
                let users = [];
                const fetchUserData = async (user, i) => {
                    users[i] = await module.exports.getUserPublicInfo(user.acc_id, '');
                    users[i].dist = await geolib.getPreciseDistance({latitude: lat, longitude: lng},
                        {latitude: users[i].latitude, longitude: users[i].longitude}) / 1000;
                    return Promise.resolve(users[i]);
                };
                const getUser = async (user, i) => {
                    return await fetchUserData(user, i);
                };
                const getData = async () => {
                    return await Promise.all(data.map((user, i) => getUser(user, i)))
                };
                return await getData();
            });
    },
    fetchTags: () => {
        return db.query('SELECT `tag` FROM tags')
            .then(data => {
                let removeDuplicates = (data, comp) => {
                    const unique = data
                        .map(e => e[comp])
                        .map((e, i, final) => final.indexOf(e) === i && i)
                        .filter(e => data[e]).map(e => data[e]);
                    return unique;
                };
                return (removeDuplicates(data, 'tag'));
            })
    },
    fetchCount: (acc_id) => {
        return db.query('SELECT * FROM matcher WHERE person1=?', [acc_id]);
    },
    getUserPublicInfo: (id, username) => {
        return db.query('SELECT users.acc_id, firstname, lastname, username, age, gender, sexuality, score, ' +
            '`connection`, bio, latitude, longitude ' +
            'FROM `users` ' +
            'INNER JOIN users_coordinates ON users.acc_id = users_coordinates.acc_id ' +
            'WHERE users.acc_id=? OR users.username=?',
            [id, username])
            .then(data => {
                let acc_id = data[0].acc_id;
                delete data[0].acc_id;
                let user = data[0];
                user.tag = [];
                user.pictures = [];
                return db.query('SELECT * FROM tags WHERE acc_id=?', [acc_id])
                    .then(res => {
                        if (res.length) {
                            for (let i = 0; i < res.length; i++) {
                                user.tag = [...user.tag, res[i].tag];
                            }
                        }
                        return db.query('SELECT * FROM users_pictures WHERE acc_id=?', [acc_id])
                            .then(res => {
                                if (res.length) {
                                    for (let i = 0; i < res.length; i++) {
                                        user.pictures = [...user.pictures, {
                                            picture: res[i].picture,
                                            type: res[i].type
                                        }];
                                        if (user.pictures[i].type === 'profile_pic' && i !== 0) {
                                            let tmp = user.pictures[i];
                                            user.pictures[i] = user.pictures[0];
                                            user.pictures[0] = tmp;
                                        }
                                        if (i === res.length - 1 && user) {
                                            return user;
                                        }
                                    }
                                } else {
                                    return user;
                                }
                            })
                    });
            });

    },
    getUserNotifications: (acc_id) => {
      return db.query('SELECT `sender`, `img`, `message`, `open` FROM notifications WHERE receiver=?', [acc_id])
          .then(res => {
              return res;
          })
    },
    insertUser: (acc_id, email, firstname, lastname, user, psw, age, gender, sexuality, score, connection, bio, token, activate) => {
        return db.query("INSERT INTO `users` SET acc_id=?, email=?, firstname=?," +
            "lastname=?, username=?, password=?, age=?, gender=?, sexuality=?, score=?, connection=?, bio=?,token=?, activate=?",
            [acc_id, email, firstname.charAt(0).toUpperCase() + firstname.slice(1),
                lastname.charAt(0).toUpperCase() + lastname.slice(1), user, psw, age,
                gender.charAt(0).toUpperCase() + gender.slice(1), sexuality, score, connection, bio, token, activate]);
    },
    resetPassword: (password, email) => {
        return db.query('UPDATE users SET password=? WHERE email=?', [password, email]);
    },
    updateUserInfo: (acc_id, name, value) => {
        return db.query(`UPDATE users SET ${name}=? WHERE acc_id=?`, [value, acc_id]);
    },
    updateLocation: (acc_id, lat, lng) => {
        return db.query('UPDATE users_coordinates SET latitude=?, longitude=? WHERE acc_id=?', [lat, lng, acc_id]);
    },
    insertUserLocation: (acc_id, latitude, longitude) => {
        return db.query("INSERT INTO `users_coordinates` SET acc_id=?, latitude=?, longitude=?",
            [acc_id, latitude, longitude]);
    },
    insertTag: (acc_id, tag) => {
        return db.query("INSERT INTO `tags` SET acc_id=?, tag=?", [acc_id, tag]);
    },
    deleteTag: (acc_id, tag) => {
        return db.query("DELETE FROM `tags` WHERE acc_id=? AND tag=?", [acc_id, tag]);
    },
    insertBio: (acc_id, bio) => {
        return db.query("UPDATE `users` SET bio=? WHERE acc_id=?", [bio, acc_id]);
    },
    insertPictureAccountCreation: (acc_id, img, type) => {
        return db.query("INSERT INTO `users_pictures` SET acc_id=?, picture=?, type=?", [acc_id, img, type]);
    },
    insertPicture: (acc_id, img, type) => {
        return db.query("INSERT INTO `users_pictures` SET acc_id=?, picture=?, type=?", [acc_id, `/assets/uploads/${img}`, type]);
    },
    insertNotification: (sender, receiver, type, img, msg) => {
        return db.query('SELECT firstname FROM users WHERE acc_id=?', [sender])
            .then(sender_info => {
                msg = sender_info[0].firstname + msg;
                return db.query('SELECT acc_id FROM users WHERE username=?', [receiver])
                    .then(receiver_info => {
                        return db.query('SELECT `open` FROM notifications WHERE sender=? AND receiver=? AND type=?',
                            [sender_info[0].firstname, receiver_info[0].acc_id, type])
                            .then(res => {
                                if (!res.length || res[0].open === 1) {
                                    return db.query('INSERT INTO notifications SET sender=?, receiver=?, type=?, ' +
                                        'img=?, message=?, open=?', [sender_info[0].firstname,
                                        receiver_info[0].acc_id, type, img, msg, 0])
                                        .then(() => {
                                            return receiver_info[0].acc_id;
                                        })
                                } else if (res[0].open === 0) {
                                    return null;
                                }
                            })
                    })
            })
    },
    checkNumbersOfPicture: (acc_id) => {
        return db.query('SELECT * FROM `users_pictures` WHERE acc_id=?', [acc_id])
            .then(data => {
                return data.length;
            })
    },
    updateProfilePicture: (acc_id, pic) => {
        return db.query('UPDATE users_pictures SET type=? WHERE type=? AND acc_id=?', ['pic', 'profile_pic', acc_id])
            .then(() => {
                return db.query('UPDATE users_pictures SET type=? WHERE picture=? AND acc_id=?', ['profile_pic', pic, acc_id]);
            })
    },
    deletePicture: (acc_id, img) => {
        return db.query('SELECT type FROM `users_pictures` WHERE acc_id=? AND picture=?', [acc_id, img])
            .then(res => {
                return db.query("DELETE FROM `users_pictures` WHERE acc_id=? AND picture=?", [acc_id, img])
                    .then(() => {
                        if (res[0].type === 'profile_pic') {
                            return module.exports.insertPictureAccountCreation(acc_id, '/assets/tulips.jpg', 'profile_pic')
                                .then(() => {
                                    return res[0].type;
                                })
                        } else {
                            return res[0].type;
                        }
                    })
            });
    },
    validateUser: (token) => {
        return db.query('UPDATE users SET activate=? WHERE token=?', [1, token]);
    },
    verifyUser: (email) => {
        return db.query('SELECT acc_id FROM users WHERE email=?', [email]);
    },
    updateConnectionStatus: (acc_id, time) => {
        return db.query('UPDATE users SET connection=? WHERE acc_id=?', [time, acc_id]);
    },
    fetchCard: (id) => {
        return db.query('SELECT chat.person1, chat.person2, conv_id FROM `chat` ' +
            'INNER JOIN matcher ON chat.person1 = matcher.person1 OR chat.person1 = matcher.person2 ' +
            'WHERE matcher.`match`=? AND chat.person1=? ' +
            'OR matcher.`match`=? AND chat.person2=?', [1, id, 1, id])
            .then(async data => {
                let card = [];
                for (let i = 0; i < data.length; i++) {
                    let other = data[i].person1 === id ? data[i].person2 : data[i].person1;
                    card[i] = await db.query('SELECT firstname, lastname, connection, picture FROM `users` ' +
                        'INNER JOIN users_pictures ON users.acc_id = users_pictures.acc_id WHERE users.acc_id=? ' +
                        'AND users_pictures.type=?', [other, 'profile_pic']).then(res => {
                        return res[0];
                    });
                    let msg = await db.query('SELECT last_message, date FROM `chat` WHERE conv_id=?', [data[i].conv_id]).then(res => {
                        return res[0] ? res[0] : '';
                    });
                    card[i] = {...card[i], msg, conv_id: data[i].conv_id};
                    if (i === data.length - 1 && card) {
                        return card;
                    }
                }
                return card;
            })
    },
    fetchMsg: (conv_id) => {
        return db.query('SELECT `sender_id`, `message`, `date` FROM `chat_messages` WHERE `conv_id`=? ORDER BY `date` ASC', [conv_id]);
    },
    sendMsg: (conv_id, sender, message) => {
        return db.query('INSERT INTO `chat_messages` SET `conv_id`=?, `sender_id`=?, `message`=?, `date`=?', [conv_id, sender, message, Date.now()])
            .then(() => {
                return db.query('UPDATE `chat` SET `last_message`=?, `date`=?', [message, Date.now()])
            });
    },
    matchSuggestion: (sexuality, searchG, searchS, logged_ltg, logged_lng, count, logged_tags, username, logged_acc_id) => {
        if (sexuality !== 'Bisexual') {
            return db.query('SELECT acc_id, username ' +
                'FROM users ' +
                'LEFT JOIN matcher on users.acc_id = matcher.person2 OR users.acc_id = matcher.person1 ' +
                'WHERE (username<>? AND gender=? AND sexuality=? ' +
                'AND matcher.person1<>? AND matcher.person2=? AND `match`=? ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id)) ' +
                'OR username<>? AND gender=? AND sexuality=? AND matcher.`match` IS NULL ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id) ' +
                'OR (username<>? AND gender=? AND sexuality=? ' +
                'AND matcher.person1<>? AND matcher.person2=? AND `match`=? ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id)) ' +
                'OR username<>? AND gender=? AND sexuality=? AND matcher.`match` IS NULL ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id) LIMIT ?, 10',
                [username, searchG[0], searchS[0], logged_acc_id, logged_acc_id, 0, logged_acc_id,
                    username, searchG[0], searchS[0], logged_acc_id, username, searchG[0], searchS[1],
                    logged_acc_id, logged_acc_id, 0, logged_acc_id, username, searchG[0], searchS[1], logged_acc_id, count])
                .then(async data => {
                        let user = [];
                        for (let i = 0; i < data.length; i++) {
                            let m = 0;
                            user[i] = await module.exports.getUserPublicInfo(data[i].acc_id);
                            user[i].dist = await geolib.getPreciseDistance({
                                    latitude: logged_ltg,
                                    longitude: logged_lng
                                },
                                {latitude: user[i].latitude, longitude: user[i].longitude}) / 1000;
                            logged_tags.forEach(match_tag => {
                                user[i].tag.forEach(tag => {
                                    if (match_tag === tag) {
                                        m++;
                                    }
                                });
                            });
                            user[i].match_tag = m;
                            if (i === data.length - 1 && user) {
                                return user.filter(val => val);
                            }
                        }
                    }
                )
        } else {
            return db.query('SELECT acc_id, username ' +
                'FROM users ' +
                'LEFT JOIN matcher on users.acc_id = matcher.person2 OR users.acc_id = matcher.person1 ' +
                'WHERE (username<>? AND gender=? AND sexuality=? ' +
                'AND matcher.person1<>? AND matcher.person2=? AND `match`=? ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id)) ' +
                'OR username<>? AND gender=? AND sexuality=? AND matcher.`match` IS NULL ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id) ' +
                'OR (username<>? AND gender=? AND sexuality=? ' +
                'AND matcher.person1<>? AND matcher.person2=? AND `match`=? ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id)) ' +
                'OR username<>? AND gender=? AND sexuality=? AND matcher.`match` IS NULL ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id) ' +
                'OR (username<>? AND gender=? AND sexuality=? ' +
                'AND matcher.person1<>? AND matcher.person2=? AND `match`=? ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id)) ' +
                'OR username<>? AND gender=? AND sexuality=? AND matcher.`match` IS NULL ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id) ' +
                'OR (username<>? AND gender=? AND sexuality=? ' +
                'AND matcher.person1<>? AND matcher.person2=? AND `match`=? ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id)) ' +
                'OR username<>? AND gender=? AND sexuality=? AND matcher.`match` IS NULL ' +
                'AND NOT EXISTS (SELECT blocker, blocked FROM `block` WHERE `blocker`=? AND `blocked`=users.acc_id) LIMIT ?, 10',
                [username, searchG[0], searchS[0], logged_acc_id, logged_acc_id, 0, logged_acc_id,
                    username, searchG[0], searchS[0], logged_acc_id,
                    username, searchG[1], searchS[1], logged_acc_id, logged_acc_id, 0, logged_acc_id,
                    username, searchG[1], searchS[1], logged_acc_id,
                    username, searchG[2], searchS[2], logged_acc_id, logged_acc_id, 0, logged_acc_id,
                    username, searchG[2], searchS[2], logged_acc_id,
                    username, searchG[3], searchS[3], logged_acc_id, logged_acc_id, 0, logged_acc_id,
                    username, searchG[3], searchS[3], logged_acc_id, count])
                .then(async data => {
                        let user = [];
                        for (let i = 0; i < data.length; i++) {
                            let m = 0;
                            user[i] = await module.exports.getUserPublicInfo(data[i].acc_id);
                            user[i].dist = await geolib.getPreciseDistance({latitude: logged_ltg, longitude: logged_lng},
                                {latitude: user[i].latitude, longitude: user[i].longitude}) / 1000;
                            logged_tags.forEach(match_tag => {
                                user[i].tag.forEach(tag => {
                                    if (match_tag === tag) {
                                        m++;
                                    }
                                });
                            });
                            user[i].match_tag = m;
                            if (i === data.length - 1 && user) {
                                return user;
                            }
                        }
                    }
                )
        }
    },
    likeUser: (acc_id, username) => {
        return db.query('SELECT acc_id FROM users WHERE username=?', [username])
            .then(res => {
                return db.query('SELECT person1, person2, like1, like2 FROM matcher WHERE person1=? AND person2=? ' +
                    'OR person1=? AND person2=?', [acc_id, res[0].acc_id, res[0].acc_id, acc_id])
                    .then(fetch => {
                            if (!fetch.length) {
                                return db.query('INSERT INTO `matcher` SET person1=?, person2=?, like1=?, ' +
                                    'like2=?, `match`=?', [acc_id, res[0].acc_id, 1, 0, 0])
                                    .then(() => {
                                        return module.exports.increaseScore(res[0].acc_id, 0.02);
                                    })
                            } else if (acc_id === fetch[0].person1) {
                                if (fetch[0].like2 !== 1) {
                                    return db.query('UPDATE `matcher` SET like1=? WHERE person1=? AND person2=?',
                                        [1, acc_id, res[0].acc_id])
                                        .then(() => {
                                            return module.exports.increaseScore(res[0].acc_id, 0.02);
                                        })
                                } else if (fetch[0].like2 === 1) {
                                    return db.query('UPDATE `matcher` SET like1=?, `match`=? WHERE person1=? AND person2=?',
                                        [1, 1, acc_id, res[0].acc_id])
                                        .then(() => {
                                            return db.query('INSERT INTO `chat` SET conv_id=?, person1=?, person2=?, ' +
                                                'last_message=?, date=?',
                                                [Math.random().toString(36).substr(2, 9),
                                                    acc_id, res[0].acc_id, '', Date.now()])
                                                .then(() => {
                                                    return module.exports.increaseScore(res[0].acc_id, 0.05);
                                                })
                                        })
                                }
                            } else if (acc_id === fetch[0].person2) {
                                if (fetch[0].like1 !== 1) {
                                    return db.query('UPDATE `matcher` SET like2=? WHERE person1=? AND person2=?'
                                        , [1, res[0].acc_id, acc_id])
                                        .then(() => {
                                            return module.exports.increaseScore(res[0].acc_id, 0.02);
                                        })
                                } else if (fetch[0].like1 === 1) {
                                    return db.query('UPDATE `matcher` SET like2=?, `match`=? WHERE person1=? AND person2=?',
                                        [1, 1, res[0].acc_id, acc_id])
                                        .then(() => {
                                            return db.query('INSERT INTO `chat` SET conv_id=?, person1=?, person2=?, ' +
                                                'last_message=?, date=?',
                                                [Math.random().toString(36).substr(2, 9),
                                                    acc_id, res[0].acc_id, '', Date.now()])
                                                .then(() => {
                                                    return module.exports.increaseScore(res[0].acc_id, 0.05);
                                                })
                                        })
                                }
                            }
                        }
                    )
            })
    },
    dislikeUser: (acc_id, username) => {
        return db.query('SELECT acc_id FROM users WHERE username=?', [username])
            .then(res => {
                return db.query('SELECT like1, like2, person1, person2 FROM matcher WHERE person1=? AND person2=? ' +
                    'OR person1=? AND person2=?', [acc_id, res[0].acc_id, res[0].acc_id, acc_id])
                    .then(fetch => {
                        if (!fetch.length) {
                            return db.query('INSERT INTO `matcher` SET person1=?, person2=?, like1=?, ' +
                                'like2=?, `match`=?', [acc_id, res[0].acc_id, -1, 0, 0])
                                .then(() => {
                                    return module.exports.decreaseScore(res[0].acc_id, 0.02);
                                })
                        } else if (fetch[0].like1 === 1 && fetch[0].like2 === 1) {
                            return db.query('DELETE FROM `matcher` WHERE person1=? AND person2=? OR person1=? AND person2=?',
                                [acc_id, res[0].acc_id, res[0].acc_id, acc_id])
                                .then(() => {
                                    return db.query('DELETE FROM chat WHERE person1=? AND person2=?' +
                                        'OR person1=? AND person2=?', [acc_id, res[0].acc_id,
                                        res[0].acc_id, acc_id])
                                        .then(() => {
                                            return module.exports.decreaseScore(res[0].acc_id, 0.05);
                                        })
                                })
                        } else {
                            if (acc_id === fetch[0].person1) {
                                return db.query('UPDATE `matcher` SET like1=?, `match`=? WHERE person1=? AND person2=?',
                                    [-1, 0, acc_id, res[0].acc_id])
                                    .then(() => {
                                        return module.exports.decreaseScore(res[0].acc_id, 0.02);
                                    })
                            } else if (acc_id === fetch[0].person2) {
                                return db.query('UPDATE `matcher` SET like2=?, `match`=? WHERE person1=? AND person2=?',
                                    [-1, 0, res[0].acc_id, acc_id])
                                    .then(() => {
                                        return module.exports.decreaseScore(res[0].acc_id, 0.05);
                                    })
                            }
                        }
                    })
            })
    },
    reportUser: (acc_id, username, pattern, message) => {
        return db.query('SELECT acc_id FROM users WHERE username=?', [username])
            .then(res => {
                if (res[0].acc_id !== acc_id) {
                    return db.query('INSERT INTO reports SET reporter=?, reported=?, pattern=?, message=?',
                        [acc_id, res[0].acc_id, pattern, message])
                        .then(() => {
                            return module.exports.decreaseScore(res[0].acc_id, 0.20);
                        })
                } else {
                    return false;
                }
            })
    },
    blockUser: (acc_id, username) => {
        return db.query('SELECT acc_id FROM users WHERE username=?', [username])
            .then(res => {
                if (acc_id !== res[0].acc_id) {
                    return db.query('INSERT INTO `block` SET `blocker`=?, `blocked`=?', [acc_id, res[0].acc_id])
                        .then(() => {
                            return module.exports.decreaseScore(res[0].acc_id, 0.40);
                        })
                } else {
                    return false;
                }
            })
    },
    unblockUser: (acc_id, username) => {
        return db.query('SELECT acc_id FROM users WHERE username=?', [username])
            .then(res => {
                if (acc_id !== res[0].acc_id) {
                    return db.query('DELETE FROM `block` WHERE `blocker`=? AND `blocked`=?', [acc_id, res[0].acc_id]);
                } else {
                    return false;
                }
            })
    },
    checkLikes: (acc_id, username) => {
        return db.query('SELECT acc_id from `users` WHERE username=?', [username])
            .then(data => {
                return db.query('SELECT person1, person2, like1, like2, `match` FROM matcher WHERE person1=?' +
                    'AND person2=? OR person1=? AND person2=?', [data[0].acc_id, acc_id, acc_id, data[0].acc_id])
                    .then(data => {
                        return data[0];
                    })
            })
    },
    checkBlock: (acc_id, username) => {
        return db.query('SELECT acc_id from `users` WHERE username=?', [username])
            .then(data => {
                return db.query('SELECT * FROM `block` WHERE blocker=? AND blocked=?',
                    [acc_id, data[0].acc_id])
                    .then(data => {
                        return data.length;
                    })
            })
    },
    increaseScore(acc_id, score) {
        return db.query('SELECT score FROM users WHERE acc_id=?', [acc_id])
            .then(data => {
                if (data[0].score !== 5) {
                    let newScore;
                    if (data[0].score + score > 5) {
                        newScore = 5;
                    } else {
                        newScore = parseFloat(data[0].score) + score;
                    }
                    return db.query('UPDATE users SET score=? WHERE acc_id=?', [newScore, acc_id]);
                }
            })
    },
    decreaseScore(acc_id, score) {
        return db.query('SELECT score FROM users WHERE acc_id=?', [acc_id])
            .then(data => {
                if (data[0].score !== 0) {
                    let newScore;
                    if (data[0].score - score < 0) {
                        newScore = 0;
                    } else {
                        newScore = parseFloat(data[0].score) - score;
                    }
                    return db.query('UPDATE users SET score=? WHERE acc_id=?', [newScore, acc_id]);
                }
            })
    }
};