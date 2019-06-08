const dbUtils = require('../utils/db.query');

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
                users.sort((a, b) => {
                    console.log(a.username + ' vs ' + b.username);
                    return (a.dist / 100  - (a.score * 75 + a.match_tag * 100)) + (b.dist / 100 - (b.score * 75 + b.match_tag * 100));
                });
                res.status(200).send(users.sort(users.dist));
        })
    }
};