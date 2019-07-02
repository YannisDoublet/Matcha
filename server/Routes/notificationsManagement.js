const dbUtils = require('../utils/db.query');

module.exports = {
    getNotifications: (req, res) => {
        let {acc_id} = req.body;

        dbUtils.getUserNotifications(acc_id)
            .then(data => {
                return res.status(200).send(data);
            });
    }
};

