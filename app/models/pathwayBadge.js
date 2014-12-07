var getDb = require('../lib/db').getDb;

module.exports = function getPathwayBadgeModel(key) {
    var db = getDb(key);

    var PathwayBadge = db.table('pathwayBadge', {
        fields: [
            'id',
            'pathwayId',
            'badgeSlug',
            'parentBadgeSlug',
            'group',
            'level',
        ]
    });

    return PathwayBadge;
};