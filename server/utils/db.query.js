const Database = require('../config/db.config').Database;
const dbCredentials = require('../config/private/db.credentials').dbCredentials;
const db = new Database(dbCredentials);
db.query('CREATE DATABASE IF NOT EXISTS `Matcha`');
db.query('USE `Matcha`');

db.query('CREATE TABLE IF NOT EXISTS `user` (' +
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
    '`token` varchar(100) NOT NULL,' +
    '`activate` int)');

module.exports = {
    searchUserByEmailOrUsername: (email, username) => {
        return db.query('SELECT * FROM user WHERE email=? OR username=?', [email, username])
            .then(data => {
                 return data[0];
            });
    },
    searchUserByToken: (token) => {
        return db.query('SELECT * FROM user WHERE token=?', [token])
            .then(data => {
                return data[0];
            });
    },
    insertUser: (acc_id, email, firstname, lastname, user, psw, age, gender, sexuality, token, activate) => {
        return db.query("INSERT INTO `user` SET acc_id=?, email=?, firstname=?," +
            "lastname=?, username=?, password=?, age=?, gender=?, sexuality=?, token=?, activate=?",
            [acc_id, email, firstname, lastname, user, psw, age, gender, sexuality, token, activate]);
    },
    validateUser: (token) => {
        return db.query('UPDATE user SET activate=? WHERE token=?', [1, token]);
    },
};