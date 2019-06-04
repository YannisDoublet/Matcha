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
        let extractMagic = Buffer.data.toString().split(',').join(' ').substr(0, 8).split(' ');
        extractMagic.pop();
        // console.log(magic[0].toString(16));
        switch (type) {
            case 'image/jpeg':
                for (let i = 0; i < extractMagic.length; i++) {
                    magic[i] = parseInt(extractMagic[i]).toString(16);
                }
                return magic.join(' ') === 'ff d8';
            case 'image/png':
                extractMagic.map((number, i) => {

                });
            default:
                return 'Error';
        }
    }
};