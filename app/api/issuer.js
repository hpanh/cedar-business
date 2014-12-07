var config = require('../lib/config');
var badgekitClient = require('../lib/badgekit-client');
var _ = require('underscore');

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const DEFAULT_SETTING = {
    system: config('SYSTEM'),
    limit: DEFAULT_LIMIT,
    page: DEFAULT_PAGE,
}

exports.getIssuers = function getIssuers(req, res, next) {
    var options = req.query;
    var setting = _.extend(DEFAULT_SETTING, options);

    var badgekitOptions = {
        paginate: {
            page: setting.page,
            count: setting.limit
        }
    }

    var context = {
        system: setting.system
    };

    badgekitClient.getIssuers(context, badgekitOptions, function (err, issuers) {
        if (err) {
            return res.status(500).send(err.message);
        }

        issuers = issuers.map(badgekitClient.toCedarIssuer);
        res.send(issuers);
    });
};

exports.getIssuer = function getIssuer(req, res, next) {
    var issuerSlug = req.params.issuerSlug;

    var context = {
        system: setting.system,
        issuer: issuerSlug
    };

    badgekitClient.getIssuer(context, function (err, issuer) {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.send(badgekitClient.toCedarIssuer(issuer));
    });
};