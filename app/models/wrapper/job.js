const Job = require('../job')('CAREER_DATABASE');
const async = require('async');
const common = require('../../lib/common');
const HollandCode = require('../hollandCodes')('CAREER_DATABASE');

exports.createJob = function createJob(job, callback) {
	job.slug = common.randomString(16);
	Job.put(job, function (err, jobReturn) {
		if (err) {
			return callback(err);
		}
		Job.getOne({ id: jobReturn.insertId }, function(err, innerJob) {
			if (err) {
				return callback(err);
			};
			return callback(null, innerJob);
		});
	});
}

exports.getJob = function getJob(jobSlug, callback) {
	Job.getOne({ slug: jobSlug }, { relationships: true }, function(err, innerJob) {
		if (err) {
			return callback(err);
		};
		return callback(null, innerJob);
	});
}

exports.getJobByHolland = function getJobByHolland(hollandCodeSlug, jobName, limit, page, callback) {
	if (hollandCodeSlug) {
		HollandCode.getOne({ slug: hollandCodeSlug }, function (err, resultHollandCode) {
			if (err) {
				return callback(err);
			};
			var queryObject = {
				hollandCodeId: resultHollandCode.id
			};
			if (jobName) {
				queryObject.name = jobName;
			}
			Job.get(queryObject, {limit: limit, page: page, relationships: true }, function (err, jobs) {
				return callback(err, jobs);
			});
		});
	} else {
		Job.get({ 
			name: jobName
		}, { limit: limit, page: page, relationships: true }, function (err, jobs) {
			return callback(err, jobs);
		});
	}
}

exports.getJobWithPaging = function getJobWithPaging(limit, page, callback) {
	Job.get({},{ limit:limit, page:page }, function (err, resultJobs){
		if (err) {
			return callback(err);
		};
		return callback(null, resultJobs);
	});
}