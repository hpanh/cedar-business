var config = require('../lib/config');
var badgekitClient = require('../lib/badgekit-client');
var _ = require('underscore');

const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;
const DEFAULT_SETTING = {
    system: config('SYSTEM'),
    limit: DEFAULT_LIMIT,
    page: DEFAULT_PAGE,
}

exports.getBadges = function getBadges(req, res, next) {
    var options = req.query;
    var setting = _.extend(DEFAULT_SETTING, options);

    var badgekitOptions = {
        paginate: {
            count: setting.limit,
            page: setting.page
        }
    }
    var context = {
        system: setting.system,
    }

    badgekitClient.getBadges(context, badgekitOptions, function (err, badges, pageData) {
        if (err) {
            return res.status(500).send(err.message);
        };

        return res.send(badges.map(badgekitClient.toCedarBadge));
    })
}

exports.getBadge = function getBadge(req, res, next) {
    var options = req.query;
    var setting = _.extend(DEFAULT_SETTING, options);
    var badgeSlug = req.params.badgeSlug;
    var context = {
        system: setting.system,
        badge: {
            slug: badgeSlug
        }
    }

    badgekitClient.getBadge(context, function (err, badge) {
        if (err) {
            return res.status(500).send(err.message);
        };

        return res.send(badgekitClient.toCedarBadge(badge));
    })
}