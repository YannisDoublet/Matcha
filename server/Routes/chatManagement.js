const dbUtils = require('../utils/db.query');
const server = require('../server');

module.exports = {
    fetchCard: (req, res) => {
        let id = req.body.id;
        if (id) {
            dbUtils.fetchCard(id)
                .then(data => {
                    return res.status(200).send(data);
                });
        } else {
            return res.status(200).send('Bad request');
        }
    },
    fetchMsg: (req, res) => {
        let conv_id = req.body.conv_id;
        if (conv_id) {
            dbUtils.fetchMsg(conv_id)
                .then(data => {
                    return res.status(200).send(data);
                });
        } else {
            return res.status(200).send('Bad request');
        }
    },
    sendMsg: (req, res) => {
        let conv_id = req.body.conv_id;
        let sender = req.body.sender;
        let message = req.body.message;

        if (conv_id && sender && message) {
            dbUtils.sendMsg(conv_id, sender, message)
                .then(() => {
                    server.notificationCenter(server.socketIo, 'new message');
                    return res.status(200);
                })
        } else {
            return res.status(200).send('Bad request');
        }
    }
};