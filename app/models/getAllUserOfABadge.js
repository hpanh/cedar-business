var getDb = require('../lib/db').getDb;
var async = require('async');
var BadgeInstance = require('./badgeInstance')('DATABASE');
var user = require('../Parse/user');
var badgekitClient = require('../lib/badgekit-client');

module.exports.getAllUserOfABadge = function getAllUserOfABadge(badge, callback) {
    var result = [];
    BadgeInstance.get({badgeSlug: badge.slug}, {limit:5, page: 1}, function (err, data) {
		if (err) {
            return callback(err);
        }
        // only get 5 user or less
        async.each(data, function(entry, innercallback) {
            user.getUserById(entry.userId, function(err, innerdata) {
				if (err) {
                    return err;
                }
                result.push(innerdata);
                innercallback();
            });
        },
        function (err) {
            if (err) { 
                return err;
            }
            callback(result);
        });
	});
}

module.exports.getEachUserOfABadge = function getEachUserOfABadge(badgeSlug, callback) {
    BadgeInstance.get({badgeSlug: badgeSlug}, function (err, data) {
        if (err) {
            return;
        }
        data.forEach(function(entry) {
            getUserById(entry, function(err, data) {
                if (err) {
                    return;
                }
                callback(null, data);
            });
        });
    });
}

module.exports.getUserOfBadge = function getUserOfBadge(badgeSlug, callback) {
    BadgeInstance.get({badgeSlug: badgeSlug}, function(err,data) {
        if (err) {
            callback(err);
        }
        callback(null, data);
    });
}
