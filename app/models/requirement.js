const getDb = require('../lib/db').getDb;


module.exports = function getRequirement(key) {
	var db = getDb('CAREER_DATABASE');
	return db.table('requirement', {
		fields: ['id',
			'slug',
			'description'
		]
	});
};