var getDb = require('../lib/db').getDb;

module.exports = function getPromotionModel(key) {
    var db = getDb(key);

    var Promotion = db.table('promotion', {
        fields: ['id',
            'slug',//internal mapping
            'author',//the one who created the promotion
            'weight',//aka priority, the heavier the weight, the higher position it is in explorer
            'imageFront',//this is a must, in the front layer, this will be displayed
            'imageBack',//this is optional, in the front layer, this will be used as a background for imageFront
            'content',//this is a must, in the back layer, this is the content of the promotion
            'sourceName',//where the information can be found
            'sourceUrl',//the link, for instance, if this is VAK test, then it is http://interview.toxbadge.com/vak/view
            'status',//active, inactive(not published/draft or already archived)
            'createdTime',
            'lastUpdated',
            'backgroundColor'
        ]});

    return Promotion;
};
