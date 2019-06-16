module.exports = {
    filterTags: (filter, tags) => {
        let valid = [];
        filter.map(user => {
            let checkTags = [];
            user.tag.forEach(tag => {
                tags.value.filter(val => val.indexOf(tag) === 0 ? checkTags.push(tag) : checkTags);
            });
            if (checkTags.length === tags.value.length) {
                valid.push(user);
            }
        });
        return valid;
    },
    filterDist: (filter, dist) => {
        if (dist.touched && dist.value) {
            let checkDist = [];
            filter.forEach(user => {
                parseInt(user.dist) >= dist.value[0] && parseInt(user.dist) <= dist.value[1] && checkDist.push(user);
            });
            return checkDist;
        } else {
            return filter;
        }

    },
    filterAge: (filter, age) => {
        if (age.touched && age.value) {
            let checkAge = [];
            filter.forEach(user => {
                parseInt(user.age) >= age.value[0] && parseInt(user.age) <= age.value[1] && checkAge.push(user);
            });
            return checkAge;
        } else {
            return filter;
        }
    },
    filterPopularity: (filter, pop) => {
        if (pop.touched && pop.value) {
            let checkPop = [];
            filter.forEach(user => {
                user.score >= pop.value[0] && user.score <= pop.value[1] && checkPop.push(user);
            });
            return checkPop;
        } else {
            return filter;
        }
    },
    filterOrderSort: (filter, order, sort) => {
        let ord = order.touched ? order.value : 'Ascending';

        switch (sort.value) {
            case 'Tags':
                if (ord === 'Ascending') {
                    filter.sort((a, b) => (a.match_tag > b.match_tag) ? -1 :
                        ((b.match_tag > a.match_tag) ? 1 : 0));
                } else {
                    filter.sort((a, b) => (a.match_tag > b.match_tag) ? 1 :
                        ((b.match_tag > a.match_tag) ? -1 : 0));
                }
                return filter;
            case 'Location':
                if (ord === 'Ascending') {
                    filter.sort((a, b) => (parseInt(a.dist) > parseInt(b.dist)) ? -1 :
                        ((parseInt(b.dist) > parseInt(a.dist)) ? 1 : 0));
                } else {
                    filter.sort((a, b) => (parseInt(a.dist) > parseInt(b.dist)) ? 1 :
                        ((parseInt(b.dist) > parseInt(a.dist)) ? -1 : 0));
                }
                return filter;

            case 'Age':
                if (ord === 'Ascending') {
                    filter.sort((a, b) => (parseInt(a.age) > parseInt(b.age)) ? -1 :
                        ((parseInt(b.age) > parseInt(a.age)) ? 1 : 0));
                } else {
                    filter.sort((a, b) => (parseInt(a.age) > parseInt(b.age)) ? 1 :
                        ((parseInt(b.age) > parseInt(a.age)) ? -1 : 0));
                }
                return filter;
            case 'Popularity':
                if (ord === 'Ascending') {
                    filter.sort((a, b) => (a.score > b.score) ? -1 :
                        (b.score > a.score) ? 1 : 0);
                } else {
                    filter.sort((a, b) => (a.score > b.score) ? 1 :
                        (b.score > a.score) ? -1 : 0);
                }
                return filter;
            default:
                return filter;
        }
    },
};