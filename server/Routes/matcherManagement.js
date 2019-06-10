const dbUtils = require('../utils/db.query');
const validationUtils = require('../utils/validation.utils');

module.exports = {
    matchSuggestion: async (req, res) => {
        let {user, count} = req.body;
        let searchG = [];
        let searchS = [];
        switch (user.sexuality) {
            default:
            case 'Heterosexual':
                if (user.gender === 'Female') {
                    searchG[0] = ['Male'];
                    searchS = ['Heterosexual', 'Bisexual'];
                } else if (user.gender === 'Male') {
                    searchG[0] = ['Female'];
                    searchS = ['Heterosexual', 'Bisexual'];
                } else {
                    searchG[0] = ['Undefined'];
                    searchS = ['Heterosexual'];
                }
                break;
            case 'Homosexual':
                if (user.gender === 'Female') {
                    searchG[0] = ['Female'];
                    searchS = ['Homosexual', 'Bisexual'];
                } else if (user.gender === 'Male') {
                    searchG[0] = ['Male'];
                    searchS = ['Homosexual', 'Bisexual'];
                } else {
                    searchG[0] = ['Undefined'];
                    searchS = ['Homosexual'];
                }
                break;
            case 'Bisexual':
                if (user.gender === 'Female') {
                    searchG[0] = ['Male', 'Male', 'Female', 'Female'];
                    searchS = ['Heterosexual', 'Bisexual', 'Homosexual', 'Bisexual'];
                } else if (user.gender === 'Male') {
                    searchG[0] = ['Female', 'Female', 'Male', 'Male'];
                    searchS = ['Heterosexual', 'Bisexual', 'Homosexual', 'Bisexual'];
                } else {
                    searchG[0] = ['Female', 'Undefined', 'Male', ''];
                    searchS = ['Bisexual', 'Bisexual', 'Bisexual', ''];
                }
                break;
        }
        return dbUtils.matchSuggestion(user.sexuality, searchG, searchS, user.latitude,
            user.longitude, count, user.tag).then(users => {
                users.forEach(user => {
                    user.matchScore = (user.score * 50 + user.match_tag * 150) - user.dist / 25;
                });
                res.status(200).send(validationUtils.matcherSort(users));
        })
    }
};