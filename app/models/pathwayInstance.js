var getDb = require('../lib/db').getDb;

module.exports = function getPathwayInstanceModel(key) {
    var db = getDb(key);

    var PathwayInstance = db.table('pathwayInstance', {
        fields: [
            'id',
            'slug',
            'pathwayId',
            'userId',
            'completedBadgeCount',
            'status',
            'created',
            'lastUpdated'
        ],
        relationships: {
            pathway: {
                type: 'hasOne',
                local: 'pathwayId',
                foreign: { table: 'pathway', key: 'id' }
            }
        }
    });

    return PathwayInstance;
};