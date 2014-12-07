const JobMajor = require('../jobMajor')('CAREER_DATABASE');
const async = require('async');


exports.createJobMajor = function createJobMajor(jobMajor, callback) {
	JobMajor.put(jobMajor, function (err, jobMajorReturn) {
		if (err) {
			return callback(err);
		}
		JobMajor.getOne({id: jobMajorReturn.insertId}, function(err, innerJobMajor) {
			if (err) {
				return callback(err);
			};
			return callback(null, innerJobMajor);
		});
	});
}

exports.getJobMajor = function getJobMajor(jobMajorId, callback) {
	JobMajor.getOne({ id: jobMajorId }, { relationships: true }, function (err, jobMajor) {
		if (err) {
			return callback(err);
		}
		return callback(null, jobMajor);
	});
}