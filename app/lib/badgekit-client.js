var config = require('./config');
const getAllUserOfABadge = require('../models/getAllUserOfABadge').getAllUserOfABadge;

exports = module.exports = require('badgekit-api-client')(
    config('BADGETKITAPI_URL'),
    config('BADGETKITAPI_SECRET')
);

module.exports.toCedarDate = function toCedarDate(datetime) {
    return translateDayOfWeek(datetime.getDay()) + ', ngày ' + datetime.getDate()
                           + ' tháng ' + datetime.getMonth() + ' năm ' + datetime.getFullYear();
}

module.exports.toCedarBadge = function toCedarBadge(badge) {
    var newBadge = {};
    newBadge.id = badge.id; //Review this please
    newBadge.slug = badge.slug;
    newBadge.description = badge.strapline;
    newBadge.name = badge.name;
    newBadge.status = badge.archived ? 'archived' : 'published';
    newBadge.earnerDescription = badge.earnerDescription;
    newBadge.consumerDescription = badge.consumerDescription;
    newBadge.rubricUrl = badge.rubricUrl;
    newBadge.timeValue = badge.timeValue;
    newBadge.timeUnits = badge.timeUnits;
    newBadge.limit = badge.limit;
    newBadge.unique = badge.unique;
    newBadge.imageUrl = badge.imageUrl;
    if (badge.issuerUrl) {
        newBadge.issuerUrl = "http://" + badge.issuerUrl.replace("http://", "");
    } else newBadge.issuerUrl = null;
    newBadge.criteria = badge.criteria;
    newBadge.created = new Date(badge.created);
    newBadge.createdView = translateDayOfWeek(newBadge.created.getDay()) + ', ngày ' + newBadge.created.getDate()
                           + ' tháng ' + newBadge.created.getMonth() + ' năm ' + newBadge.created.getFullYear();
    newBadge.lastUpdated = new Date(badge.created); // not a typo.  badgekit-api doesn't yet have a notion of last updated.
    // sure, bacause badge can not be edited!
    newBadge.badgeType = badge.type;
    newBadge.categories = badge.categories || [];
    newBadge.issuer = badge.issuer;
    return newBadge;
};

function translateDayOfWeek(dayInNumber) {
    if (dayInNumber == 0) {
        return 'Chủ Nhật';
    } else {
        return 'Thứ ' + (dayInNumber + 1);
    }
}

module.exports.toOpenbadgerBadge = function toOpenbadgerBadge(badge) {
    var newBadge = {};
    newBadge.name = badge.name;
    newBadge.slug = badge.name.trim().toLowerCase().replace(/\s+/g, '-');
    newBadge.strapline = badge.description || ' ';
    // openbadger-issue-client doesn't yet support uploading an image file, so for now we're keeping the images in the badgekit db
    newBadge.imageUrl = config('CEDAR_AUDIENCE') + '/images/badge/' + badge.id;
    newBadge.earnerDescription = badge.earnerDescription;
    newBadge.consumerDescription = badge.consumerDescription;
    newBadge.rubricUrl = badge.rubricUrl;
    newBadge.issuerUrl = badge.issuerUrl;
    newBadge.criteriaUrl = config('CEDAR_AUDIENCE') + '/system/' + badge.system + '/badge/' + newBadge.slug + '/criteria';
    newBadge.timeValue = badge.timeValue;
    newBadge.timeUnits = badge.timeUnits;
    newBadge.limit = badge.limit;
    newBadge.unique = badge.unique;
    newBadge.criteria = badge.criteria;
    newBadge.criteria.forEach(function (criterion) {
        delete criterion.badgeId;
        delete criterion.id;
    });
    newBadge.type = badge.badgeType;
    newBadge.categories = (badge.categories || []).map(function (category) {
        return category.label;
    });

    return newBadge;
};

module.exports.toCedarIssuer = function toCedarIssuer(issuer) {
    var newIssuer = {
        name: issuer.name,
        slug: issuer.slug,
        url: issuer.url,
        description: issuer.description,
        email: issuer.email,
        image: issuer.imageUrl
    };

    return newIssuer;
}