var getDb = require('../lib/db').getDb;

module.exports = function getUserPerformanceModel(key) {
    var db = getDb(key);

    var UserPerformance = db.table('userperformance', {
        fields: ['id',
            'userId',
            'applyCount',
            'badgeCount'
        ]
    });

    return UserPerformance;
};
