const dbUtils = require('../utils/db.query');

module.exports = {
    fetchCard: (req, res) => {
        let id = req.body.id;
        dbUtils.fetchCard(id)
            .then(data => {
                return res.status(200).send(data);
            });
    }
};