const getDb = require('../lib/db').getDb;

module.exports = function getSchool(key) {
	var db = getDb(key);
	return db.table('school', {
		fields: ['id',
			'slug',
			'name',
			'location',
			'createdDate',
			'lastEdited',
            'deleted'
		]
	});
};