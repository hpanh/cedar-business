const getDb = require('../lib/db').getDb;


module.exports = function getOccupationMajor(key) {
	var db = getDb('CAREER_DATABASE');
	return db.table('occupation_major', {
		fields: ['id',
			'occupationId',
			'majorId'
		]
	});
};