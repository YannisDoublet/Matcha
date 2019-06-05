module.exports = {
    validateGender: (gender) => {
        return (gender === 'Man' || gender === 'Woman' || gender === 'Undefined')
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
                console.log(extractMagic);
                for (let i = 0; i < extractMagic.length; i++) {
                    magic[i] = parseInt(extractMagic[i]).toString(16);
                }
                console.log(magic.join(' '));
                return magic.join(' ') === '89 50 4e 47 d a 1a a';
            default:
                return false;
        }
    }
};