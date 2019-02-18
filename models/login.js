const db = require('./db');

module.exports.getUser = () => {
    return db
        .getState()
        .user;
};
