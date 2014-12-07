const getDb = require('../lib/db').getDb;


module.exports = function getOccupationRequirement(key) {
	var db = getDb('CAREER_DATABASE');
	return db.table('occupation_requirement', {
		fields: ['id',
			'occupationId',
			'requirementId'
		]
	});
};