const nodemailer = require('nodemailer');
const config = require('../config.json');

const skillsModel = require('../models/skills');
const productsModel = require('../models/product');

module.exports.get = (req, res) => {
    const skills = skillsModel.get();
    const products = productsModel.get();

    const msgemail = req.flash('msgemail');

    res.render('pages/index', {skills, products, msgemail});
};

module.exports.postMail = (req, res) => {

    //требуем наличия имени, обратной почты и текста
    if (!req.body.name || !req.body.email || !req.body.message) {
        //если что-либо не указано - сообщаем об этом
        req.flash('msgemail', 'Все поля нужно заполнить!');
        res.redirect('/');
        return;
    }
    //инициализируем модуль для отправки писем и указываем данные из конфига
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
        from: `"${req.body.name}" <${req.body.email}>`,
        to: config.mail.smtp.auth.user,
        subject: config.mail.subject,
        message:
        req.body.message.trim().slice(0, 500) +
        `\n Отправлено с: <${req.body.email}>`
    };
    //отправляем почту
    transporter.sendMail(mailOptions, function(error, info) {
        //если есть ошибки при отправке - сообщаем об этом
        if (error) {
            req.flash('msgemail', 'При отправке произошла ошибка');
            res.redirect('/');
            return;
        }

        req.flash('msgemail', 'Письмо успешно отправлено');
        res.redirect('/');
    });
};
