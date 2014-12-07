var getDb = require('../lib/db').getDb;

module.exports = function getPathwayPerformanceModel(key) {
    var db = getDb(key);

    var PathwayPerformance = db.table('pathwayPerformance', {
        fields: [
            'id',
            'badgeCount',
            'followerCount',
            'viewCount',
            'dropCount',
            'inprogressCount',
            'completedCount',
            'shareCount',
            'created',
            'lastUpdated',
        ]
    });

    return PathwayPerformance;
};