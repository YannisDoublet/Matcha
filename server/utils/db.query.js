const db = require('mysql');

const con = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
});

con.connect(function (err) {
    if (err) throw err;
    console.log('Database Matcha connected !');
    con.query('CREATE DATABASE IF NOT EXISTS Matcha', function (err, result) {
        if (err) throw err;
    });
    con.query('USE Matcha', function (err, result) {
        if (err) throw err;
    });
    con.query('CREATE TABLE IF NOT EXISTS `user` (' +
        '`id` int NOT NULL AUTO_INCREMENT,' +
        '`E_MAIL` varchar(100) NOT NULL,' +
        '`FIRST_NAME` varchar(100) NOT NULL,' +
        '`LAST_NAME` varchar(50) DEFAULT NULL,' +
        '`PASSWORD` varchar(100) NOT NULL,' +
        '`AGE` int NOT NULL,' +
        '`GENDER` varchar(100) NOT NULL,' +
        '`LIKE` int NOT NULL,' +
        '`TOKEN` varchar(100) NOT NULL,' +
        '`ACTIVATE` int,' +
        'PRIMARY KEY (`id`))', function (err, result) {
        if (err) throw err;
    });
});

module.exports = {
    searchEmail: function (email) {
        let user = con.query("SELECT email FROM user WHERE email=?", email, function (err, result) {
            let mail = result.email;
            return mail;
        });
        return user;
    },
    insertUser: function (table, email, prenom, nom, psw, age, gender, like, token, activate) {
        con.query("INSERT INTO" + table + "SET E_MAIL=?, FIRST_NAME=?," +
            "LAST_NAME=?, PASSWORD=?, AGE=?, GENDER=?, LIKE=?, TOKEN=?, ACTIVATE=?",
            [email, prenom, nom, psw, age, gender, like, token, activate],
            function (err, result) {
                if (err) throw err;
            });
        return true;
    }
};