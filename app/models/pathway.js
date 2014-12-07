var getDb = require('../lib/db').getDb;

module.exports = function getPathwayModel(key) {
    var db = getDb(key);

    var Pathway = db.table('pathway', {
        fields: [
            'id',
            'name',
            'slug',
            'description',
            'type',
            'picture',
            'systemSlug',
            'issuerSlug',
            'programSlug',
            'totalBadge',
            'created',
            'lastUpdated',
            'pathwayCategoryId'
        ],
        relationships: {
            category: {
                type: 'hasOne',
                local: 'pathwayCategoryId',
                foreign: { table: 'pathwayCategory', key: 'id' }
            },
            badges: {
                type: 'hasMany',
                local: 'id',
                foreign: { table: 'pathwayBadge', key: 'pathwayId'},
                optional: true
            },
            performance: {
                type: 'hasOne',
                local: 'id',
                foreign: { table: 'pathwayPerformance', key: 'id'},
                optional: true
            },
            instances: {
                type: 'hasMany',
                local: 'id',
                foreign: { table: 'pathwayInstance', key: 'pathwayId'}
            }
        }
    });

    return Pathway;
};
