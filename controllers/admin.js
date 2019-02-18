const createError = require('http-errors');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const productModel = require('../models/product');
const skillsModel = require('../models/skills');

module.exports.get = (req, res, next) => {
    console.log(req.session.isAuthorized);
    if (req.session.isAuthorized) {
        let msgfile = req.flash('msgfile');
        let msgskill = req.flash('msgskill');
        let skills = skillsModel.get();

        res.render('pages/admin', { skills, msgfile, msgskill });
    } else {
        next(createError(401));
        // res.render('error', {
        //     status: 401,
        //     error: 'Unauthorized' });
    }
};

module.exports.postUpload = (req, res, next) => {

    let form = new formidable.IncomingForm();
    let upload = path.join('./public', 'upload');
    let fileName;

    if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload);
    }

    form.uploadDir = path.join(process.cwd(), upload);

    form.parse(req, function (err, fields, files) {
        console.log(fields, files);
        if (err) {
            console.log(err);
        }

        if (!fields.name) {
            fs.unlink(files.photo.path, (err) => {
                if (err) throw err;
                console.log(`${files.photo.path} was deleted`);
            });

            req.flash('msgfile', 'Не указано название товара!');
            res.redirect('/admin');
            return;
        }

        if (!fields.price) {
            fs.unlink(files.photo.path, (err) => {
                if (err) throw err;
                console.log(`${files.photo.path} was deleted 2`);
            });

            req.flash('msgfile', 'Не указана цена товара!');
            res.redirect('/admin');
            return;
        }

        fileName = path.join(upload, files.photo.name);

        fs.rename(files.photo.path, fileName, function (err) {
            if (err) {
                fs.unlink(fileName, (err) => {
                    if (err) throw err;
                    console.log(`${files.photo.path} was deleted 3`);
                });
                fs.rename(files.photo.path, fileName, (err) => {
                    if (err) throw err;
                    console.log(`${files.photo.path} was renamed`);
                });
            }

            let dir = fileName.substr(fileName.indexOf(path.sep));

            productModel.set(fields.name, fields.price, dir);

            req.flash('msgfile', 'Картинка успешно загружена');
            res.redirect('/admin');
        })
    });
};

module.exports.postSkills = (req, res) => {

    if(!req.body.age || !req.body.concerts || !req.body.cities || !req.body.years){
        req.flash('msgskill', 'Все поля должны быть заполнены');
        res.redirect('/admin');
    }

    skillsModel.set(req.body);

    req.flash('msgskill', 'Данные сохранены');
    res.redirect('/admin');
};
