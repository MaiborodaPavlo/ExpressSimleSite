const db = require('./db');

module.exports.set = (skills) => {
    console.log(skills);
    db.set('skills.age.number', skills.age)
        .set('skills.concerts.number', skills.concerts)
        .set('skills.cities.number', skills.cities)
        .set('skills.years.number', skills.years)
        .write();
};

module.exports.get = () => {
    return db.get('skills').value();
};
