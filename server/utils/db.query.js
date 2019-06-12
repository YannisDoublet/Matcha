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
    '`latitude` varchar(10) NOT NULL,' +
    '`longitude` varchar(10) NOT NULL)');

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
    '`conv_id` varchar(10) NOT NULL,' +
    '`match` boolean)');

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
                let user = [];
                for (let i = 0; i <= data.length; i++) {
                    if (i === data.length - 1 && user) {
                        return user;
                    }
                    user[i] = await module.exports.getUserPublicInfo(data[i].acc_id, '');
                    // console.log(lat ,lng , user[i].latitude, user[i].longitude);
                    user[i].dist = await geolib.getPreciseDistance({latitude: lat, longitude: lng},
                        {latitude: user[i].latitude, longitude: user[i].longitude}) / 1000;
                }
            });
    },
    fetchTags: () => {
        return db.query('SELECT `tag` from tags')
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
    getUserPublicInfo: (id, username) => {
        return db.query('SELECT users.acc_id, firstname, lastname, username, age, gender, sexuality, score, connection, bio, latitude, longitude FROM `users`' +
            'INNER JOIN users_coordinates ON users.acc_id = users_coordinates.acc_id WHERE users.acc_id=? OR users.username=?;', [id, username])
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
                            return db.query('SELECT * FROM users_pictures WHERE acc_id=?', [acc_id])
                                .then(res => {
                                    if (res.length) {
                                        for (let i = 0; i < res.length; i++) {
                                            user.pictures = [...user.pictures, {
                                                picture: res[i].picture,
                                                type: res[i].type
                                            }];
                                            if (i === res.length - 1 && user) {
                                                return user;
                                            }
                                        }
                                    } else {
                                        user.pictures.unshift(user.profile_pic);
                                        return user;
                                    }
                                })
                        }
                    });
            });
    },
    insertUser: (acc_id, email, firstname, lastname, user, psw, age, gender, sexuality, score, connection, bio, token, activate) => {
        return db.query("INSERT INTO `users` SET acc_id=?, email=?, firstname=?," +
            "lastname=?, username=?, password=?, age=?, gender=?, sexuality=?, score=?, connection=?, bio=?,token=?, activate=?",
            [acc_id, email, firstname.charAt(0).toUpperCase() + firstname.slice(1),
                lastname.charAt(0).toUpperCase() + lastname.slice(1), user, psw, age,
                gender.charAt(0).toUpperCase() + gender.slice(1), sexuality, score, connection, bio, token, activate]);
    },
    insertUserLocation: (acc_id, latitude, longitude) => {
        return db.query("INSERT INTO `users_coordinates` SET acc_id=?, latitude=?, longitude=?",
            [acc_id, latitude, longitude]);
    },
    insertTag: (acc_id, tag) => {
        return db.query("INSERT INTO `tags` SET acc_id=?, tag=?", [acc_id, tag]);
    },
    insertPicture: (acc_id, img, type) => {
        return db.query("INSERT INTO `users_pictures` SET acc_id=?, picture=?, type=?", [acc_id, img, type]);
    },
    checkNumbersOfPicture: (acc_id) => {
        return db.query('SELECT * FROM `users_pictures` WHERE acc_id=?', [acc_id])
            .then(data => {
                return data.length;
            })
    },
    deletePicture: (acc_id, img) => {
        return db.query("DELETE FROM `users_pictures` WHERE acc_id=? AND picture=?", [acc_id, img]);
    },
    validateUser: (token) => {
        return db.query('UPDATE users SET activate=? WHERE token=?', [1, token]);
    },
    updateConnectionStatus: (acc_id, time) => {
        return db.query('UPDATE users SET connection=? WHERE acc_id=?', [time, acc_id]);
    },
    fetchCard: (id) => {
        return db.query('SELECT person1, person2, conv_id FROM `matcher` WHERE person1=? OR person2=? AND `match`=?', [id, id, 1])
            .then(async data => {
                let card = [];
                for (let i = 0; i < data.length; i++) {
                    let other = data[i].person1 === id ? data[i].person2 : data[i].person1;
                    card[i] = await db.query('SELECT firstname, lastname, connection, picture FROM `users` ' +
                        'INNER JOIN users_pictures ON users.acc_id = users_pictures.acc_id WHERE users.acc_id=? ' +
                        'AND users_pictures.type=?', [other, 'profile_pic']).then(res => {
                        return res[0]
                    });
                    let msg = await db.query('SELECT conv_id, last_message, date FROM `chat` WHERE conv_id=?', [data[i].conv_id]).then(res => {
                        return res[0]
                    });
                    card[i] = {...card[i], msg};
                    if (i === data.length - 1 && card) {
                        return card;
                    }
                }
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
    matchSuggestion: (sexuality, searchG, searchS, logged_ltg, logged_lng, count, logged_tags) => {
        if (sexuality !== 'Bisexual') {
            return db.query('SELECT `acc_id` FROM `users` WHERE gender=? AND sexuality=? OR gender=? AND sexuality=? LIMIT ?, 10', [searchG[0], searchS[0], searchG[0], searchS[1], count])
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
                                user[i].match_tag = m;
                            });
                            if (i === data.length - 1 && user) {
                                return user;
                            }
                        }
                    }
                )
        } else {
            return db.query('SELECT `acc_id` FROM `users` WHERE gender=? AND sexuality=? OR gender=? AND sexuality=? ' +
                'OR gender=? AND sexuality=? OR gender=? AND sexuality=? LIMIT ?, 10',
                [searchG[0], searchS[0], searchG[1], searchS[1], searchG[2], searchS[2], searchG[3], searchS[3], count])
                .then(async data => {
                        let user = [];
                        for (let i = 0; i < data.length; i++) {
                            user[i] = await module.exports.getUserPublicInfo(data[i].acc_id);
                            user[i].dist = await geolib.getPreciseDistance({latitude: logged_ltg, longitude: logged_lng},
                                {latitude: user[i].latitude, longitude: user[i].longitude}) / 1000;
                            if (i === data.length - 1 && user) {
                                return user;
                            }
                        }
                    }
                )
        }
    }
};