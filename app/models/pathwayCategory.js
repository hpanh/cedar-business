var getDb = require('../lib/db').getDb;

module.exports = function getPathwayCategoryModel(key) {
    var db = getDb(key);

    var PathwayCategory = db.table('pathwayCategory', {
        fields: [
            'id',
            'name',
            'description',
        ]
    });

    return PathwayCategory;
};