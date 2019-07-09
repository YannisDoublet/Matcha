const dbUtils = require('../utils/db.query');

module.exports = {
    getNotifications: (req, res) => {
        let {acc_id} = req.body;

        setTimeout(() => {
            dbUtils.getUserNotifications(acc_id)
                .then(data => {
                    return res.status(200).send(data);
                });
        },250);
    },
    readNotifications: (req, res) => {
        let {acc_id} = req.body;

        dbUtils.readUserNotifications(acc_id)
            .then(() => {
                return res.status(200).send('OK');
            })
    }
};

