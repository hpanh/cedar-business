const getDb = require('../lib/db').getDb;

module.exports = function getHollandCodes(key) {
	var db = getDb(key);
	return db.table('hollandCode', {
		fields: ['id',
			'slug',
			'code1',
			'code2',
			'code3',
			'createdDate',
			'lastEdited'
		]
	});
};