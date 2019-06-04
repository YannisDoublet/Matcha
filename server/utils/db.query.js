const Database = require('../config/db.config').Database;
const dbCredentials = require('../config/private/db.credentials').dbCredentials;
const db = new Database(dbCredentials);
db.query('CREATE DATABASE IF NOT EXISTS `Matcha`');
db.query('USE `Matcha`');

db.query('CREATE TABLE IF NOT EXISTS `users` (' +
    '`id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,' +
    '`acc_id` varchar(10) NOT NULL,' +
    '`email` varchar(100) NOT NULL,' +
    '`profile_pic` varchar(100) NOT NULL,' +
    '`banner_pic` varchar(100) NOT NULL,' +
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
    '`picture` varchar(300) NOT NULL)');

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
    getAllUserInfo: (id) => {
        return db.query('SELECT * FROM `users` WHERE acc_id=?', [id])
            .then(data => {
                return data[0];
            });
    },
    getUserPublicInfo: (id, username) => {
        return db.query('SELECT users.acc_id, profile_pic, banner_pic, firstname, lastname, username, age, gender, sexuality, score, connection, bio, latitude, longitude FROM `users`' +
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
                                            user.pictures = [...user.pictures, res[i].picture];
                                            if (i === res.length - 1 && user) {
                                                user.pictures.unshift(user.profile_pic);
                                                return user;
                                            }
                                        }
                                    }
                                     else {
                                        user.pictures.unshift(user.profile_pic);
                                        return user;
                                    }
                                })
                        }
                    });
            });
    },
    insertUser: (acc_id, profile_pic, banner_pic, email, firstname, lastname, user, psw, age, gender, sexuality, score, connection, bio, token, activate) => {
        return db.query("INSERT INTO `users` SET acc_id=?, email=?, profile_pic=?, banner_pic=?, firstname=?," +
            "lastname=?, username=?, password=?, age=?, gender=?, sexuality=?, score=?, connection=?, bio=?,token=?, activate=?",
            [acc_id, email, profile_pic, banner_pic, firstname.charAt(0).toUpperCase() + firstname.slice(1),
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
    insertPicture: (acc_id, img) => {
        return db.query("INSERT INTO `users_pictures` SET acc_id=?, picture=?", [acc_id, img]);
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
};