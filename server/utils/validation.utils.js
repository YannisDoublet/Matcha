module.exports = {
    validateGender: (gender) => {
        return (gender === 'Man' || gender === 'Woman' || gender === 'Undefined')
    },
    validateSexuality: (sexuality) => {
        return (sexuality === 'Heterosexual' || sexuality === 'Bisexual' || sexuality === 'Homosexual')
    }
};