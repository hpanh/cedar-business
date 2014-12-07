const getDb = require('../lib/db.js').getDb;

module.exports = function getOccupation(key) {
	var db = getDb('CAREER_DATABASE');
	return db.table('occupation', {
		fields: ['id',
			'name',
			'slug',
			'shortDescription',
			'description',
			'jobPotential',
			'hollandCodesId'
		]
	});
};