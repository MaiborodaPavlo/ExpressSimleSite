const loginModel = require('../models/login');
const psw = require('../lib/password');

module.exports.get = (req, res, next) => {
    let msgs = req.flash('info');

    console.log(msgs);

    res.render('pages/login', { msglogin: msgs });
};

module.exports.post = (req, res, next) => {
    console.log(req.body);
    //требуем наличия имени, обратной почты и текста
    if (!req.body.password || !req.body.email) {
        //если что-либо не указано - сообщаем об этом
        req.flash('info', 'Все поля нужно заполнить!');
        return res.redirect('/login');
    }

    const { email, password } = req.body;
    const user = loginModel.getUser();

    if (user.login === email && psw.validPassword(password)) {
        req.session.isAuthorized = true;
        res.redirect('/admin');
    } else {
        req.flash('info', 'Логин и/или пароль введены неверно!');
        res.redirect('/login');
    }
};
