const Database = require('../config/db.config').Database;
const dbCredentials = require('../config/private/db.credentials').dbCredentials;
const db = new Database(dbCredentials);
const moment = require('moment');
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
    '`connection` varchar NOT NULL,' +
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
        return db.query('SELECT profile_pic, banner_pic, firstname, lastname, username, age, gender, sexuality, score, connection, latitude, longitude FROM `users`' +
            'INNER JOIN users_coordinates ON users.acc_id = users_coordinates.acc_id WHERE users.acc_id=? OR users.username=?;', [id, username])
            .then(data => {
                // let user = data[0];
                return data[0];
            });
    },
    insertUser: (acc_id, profile_pic, banner_pic, email, firstname, lastname, user, psw, age, gender, sexuality, score, token, activate) => {
        return db.query("INSERT INTO `users` SET acc_id=?, email=?, profile_pic=?, banner_pic=?, firstname=?," +
            "lastname=?, username=?, password=?, age=?, gender=?, sexuality=?, score=?, token=?, activate=?",
            [acc_id, email, profile_pic, banner_pic, firstname.charAt(0).toUpperCase() + firstname.slice(1),
                lastname.charAt(0).toUpperCase() + lastname.slice(1), user, psw, age,
                gender.charAt(0).toUpperCase() + gender.slice(1), sexuality, score, token, activate]);
    },
    insertUserLocation: (acc_id, latitude, longitude) => {
        return db.query("INSERT INTO `users_coordinates` SET acc_id=?, latitude=?, longitude=?",
            [acc_id, latitude, longitude]);
    },
    insertTag: (acc_id, tag) => {
        return db.query("INSERT INTO `tags` SET acc_id=?, tag=?", [acc_id, tag]);
    },
    validateUser: (token) => {
        return db.query('UPDATE users SET activate=? WHERE token=?', [1, token]);
    },
    updateConnectionStatus: (acc_id, time) => {
        return db.query('UPDATE users SET connection=? WHERE acc_id=?', [time, acc_id]);
    },
};