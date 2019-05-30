const bcrypt = require('bcrypt');
const rand = require('rand-token');
const dbUtils = require('../utils/db.query');
const axios = require('axios');
const tags = ['Surf', 'Beach', 'Cocktails', 'Ski', 'Sport', 'Books', 'Video Games', 'Make-up', 'Bicycle', 'Roller',
    'Skateboard', 'Reading', 'Watching TV', 'Eat', 'Sushi', 'Burgers', 'Old Cars', 'Tuning', 'Beer',
    'Bowling', 'Laser Game', 'Game of Thrones', 'Lord of the Rings', 'Harry Potter', 'Star Wars',
    'Fashion', 'Music', 'Jazz', 'Classical', 'Blues', 'Rock', 'Pop', 'Thrillers', 'Bagel', 'Travel',
    'Religion', 'History', 'Tech', 'Metal', 'Netflix and Chill', 'Shopping', '42'
];

const displayTags = (tags) => {
    const maxTag = 5;
    let userTags = [];
    for (let i = 0; i < maxTag; i++) {
        userTags[i] = tags[Math.floor(Math.random() * 42)];
    }
    let filter = (userTags) => userTags.filter((t, i) => userTags.indexOf(t) === i);
    return (filter(userTags));
};

const seed_creator = async () => {
    displayTags(tags);
    for (let i = 0; i < 750; i++) {
        await axios.get('https://randomuser.me/api/')
            .then((user) => {
                let fake = user.data.results[0];
                let token = rand.generate(50);
                let acc_id = Math.random().toString(36).substr(2, 9);
                let psw = bcrypt.hashSync('FakeAccount123', 10);
                let sexuality = Math.floor(Math.random() * 3) + 1;
                dbUtils.insertUser(acc_id, fake.picture.large, '/assets/banner.jpg',
                    fake.email, fake.name.first, fake.name.last, fake.login.username, psw,
                    fake.dob.age, fake.gender, sexuality, token, 1);
                dbUtils.insertUserLocation(acc_id, fake.location.coordinates.latitude,
                    fake.location.coordinates.longitude);
                displayTags(tags).map(tag => {
                    dbUtils.insertTag(acc_id, tag);
                });
                console.log(`${i} profile created.`);
            })
            .catch((err) => {
                if (err) throw err;
            });
    }
    return process.exit(0);
};

return seed_creator();