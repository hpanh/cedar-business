const ParseUser = require('../Parse/user');
const _ = require('underscore');
const badgekitClient = require('../lib/badgekit-client');

exports.getUser = function getUser(req, res, next) {
    var username = req.params.username;
    var email = req.params.email;

    if (username) {
        ParseUser.getUser(username, function (err, user) {
            if (err) {
                return res.status(500).send(err);
            };

            return res.status(200).send(user);
        });
    };

    if (email) {
        ParseUser.getUserByEmail(email, function (err, user) {
            if (err) {
                return res.status(500).send(err);
            };

            return res.status(200).send(user);
        });
    };
}

exports.getUsers = function getUsers(req, res, next) {
    var setting = {
        page: 1,
        limit: 40
    }

    var options = req.query;
    setting = _.extend(setting, options);

    ParseUser.getUsers(setting, function(err, users) {
        if (err) {
            return res.status(500).send(err.message);
        };

        return res.send(users);
    })
};

exports.getCurrentUser = function getCurrentUser(req, res, next) {
    var user = req.session ? req.session.currentUser : null;
    if (user) {
        var str = 'var userEmail = "' + user.email + '";\n'
                + 'var username = "' + user.username + '";\n'
                + 'var userFullname = "' + user.name + '";\n'
                + 'var userImageUrl = "' + user.imageUrl + '";\n'
                + 'var userId = "' + user.id + '";';
        return res.status(200).send(str);
    } else {
        return res.status(200).send('var userEmail = null;');
    }
}
