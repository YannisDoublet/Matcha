const axios = require('axios');
const pip = require('public-ip');

module.exports = {
    validateName: (name) => {
        let regex = RegExp('^[A-Za-z]+$');
        return (regex.test(name));
    },
    validateAge: (age) => {
        let regex = RegExp('^[0-9]+$');
        return regex.test(age);
    },
    validateGender: (gender) => {
        return (gender === 'Male' || gender === 'Female' || gender === 'Undefined')
    },
    validateSexuality: (sexuality) => {
        return (sexuality === 'Heterosexual' || sexuality === 'Bisexual' || sexuality === 'Homosexual')
    },
    validateImage: (type, tmpBuffer) => {
        let magic = [];
        let Buffer = JSON.parse(JSON.stringify(tmpBuffer));
        let extractMagic = null;
        switch (type) {
            case 'image/jpeg':
                extractMagic = Buffer.data.toString().split(',').join(' ').substr(0, 8).split(' ');
                extractMagic.pop();
                for (let i = 0; i < extractMagic.length; i++) {
                    magic[i] = parseInt(extractMagic[i]).toString(16);
                }
                return magic.join(' ') === 'ff d8';
            case 'image/png':
                extractMagic = Buffer.data.toString().split(',').join(' ').substr(0, 24).split(' ');
                for (let i = 0; i < extractMagic.length; i++) {
                    magic[i] = parseInt(extractMagic[i]).toString(16);
                }
                return magic.join(' ') === '89 50 4e 47 d a 1a a';
            default:
                return false;
        }
    },
    matcherSort: (match) => {
        for (let i = match.length - 1; i >= 0; i--) {
            for (let j = 1; j <= i; j++) {
                if (match[j - 1].matchScore > match[j].matchScore) {
                    let temp = match[j - 1];
                    match[j - 1] = match[j];
                    match[j] = temp;
                }
            }
        }
        return match;
    },
    getUserLocationByIp: async () => {
        return axios.get(`http://ip-api.com/json/${await pip.v4()}`)
            .then(res => {
                return Promise.resolve(res.data);
            })
    },
    checkOpen: (notifications) => {
        for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].open === 0) {
                return false;
            }
            if (i === notifications.length - 1) {
                return true;
            }
        }
    }
};