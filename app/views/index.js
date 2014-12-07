const ParseUser = require('../Parse/user');
const badgekitClient = require('../lib/badgekit-client');

exports.home = function home(req, res, next) {
    res.render('home.html');
};

exports.partner = require('./partner');

exports.changeLanguage = function changeLanguage(req, res) {
    res.cookie('lang', req.params.locale);
    res.redirect('/');
    return;
}

exports.announce = function announce(req, res) {
    res.render('announce.html', {message: req.cookies.message});
}
