const getDb = require('../lib/db').getDb;

module.exports = function getJobMajor(key) {
	var db = getDb(key);
	return db.table('job_major', {
		fields: ['id',
			'jobId',
			'majorId'
		],
		relationships: {
			job: {
				type: 'hasOne',
				local: 'jobId',
				foreign: { table: 'job', key: 'id' }
			},
			major: {
				type: 'hasOne',
				local: 'majorId',
				foreign: { table: 'major', key: 'id' }
			}
		}

	});
};