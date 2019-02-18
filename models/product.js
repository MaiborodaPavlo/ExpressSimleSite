const db = require('./db');

module.exports.set = (name, price, src) => {
    db.get('products')
        .push({ name, price, src })
        .write();
};

module.exports.get = () => {
    return db.get('products').value();
};
