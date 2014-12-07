const getDb = require('../lib/db').getDb;

module.exports = function getJob(key) {
	var db = getDb(key);
	return db.table('job', {
		fields: ['id',
			'slug',
			'name',
			'shortDescription',
			'description',
			'salary',
			'requirement',
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