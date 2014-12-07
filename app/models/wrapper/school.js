const School = require('../school')('CAREER_DATABASE');
const async = require('async');
const common = require('../../lib/common');

exports.createSchool = function createSchool(school, callback) {
	school.slug = common.randomString(16);
	School.put(school, function (err, schoolReturn) {
		if (err) {
			return callback(err);
		}
		School.getOne({id: schoolReturn.insertId}, function(err, innerSchool) {
			if (err) {
				return callback(err);
			};
			return callback(null, innerSchool);
		});
	});
}

exports.getSchoolBySlug = function getSchoolBySlug(schoolSlug, callback) {
	School.getOne({slug: schoolSlug}, function (err, resultSchool) {
		if (err) {
			return callback(err);
		}
		return callback(null, resultSchool);
	});
}

exports.getSchoolsWithPaging = function getSchoolsWithPaging(limit, page, callback) {
	School.get({},{ limit: limit, page: page }, function (err, resultSchools) {
		if (err) {
			return callback(err);
		};
		return callback(null, resultSchools);
	});
}