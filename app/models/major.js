const getDb = require('../lib/db.js').getDb;

module.exports = function getMajor(key) {
	var db = getDb(key);
	return db.table('major',{
		fields: ['id',
			'slug',
			'externalId',
			'name',
			'description',
			'curriculum',
			'goal',
			'jobOpportunities',
			'hollandCodeId',
			'createdDate',
			'lastEdited',
			'createdBy',
			'deleted'
		],
		relationships: {
			hollandCode: {
				type: 'hasOne',
				local: 'hollandCodeId',
				foreign: { table: 'hollandCode', key: 'id' }
			}
		}
	});
};