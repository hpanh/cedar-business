const Major = require('../major')('CAREER_DATABASE');
const async = require('async');
const common = require('../../lib/common');
const connection = require('../../lib/db').getDb('CAREER_DATABASE').connection;

exports.createMajor = function createMajor(major, callback) {
	Major.getOne({major: major}, function (err, resultMajor) {
		if (err) {
			return callback(err);
		};
		if (resultMajor == null) {
			var insertMajor = {
				major: major,
				slug: common.randomString(16)
			};
			Major.put(insertMajor, function (err, major) {
				if (err) {
					return callback(err);
				}
				Major.getOne({ id: major.insertId }, function (err, resultMajor) {
					if (err) {
						return callback(err);
					}
					return callback(null, resultMajor);
				});
			});
		} else {
			return callback (null, resultMajor);
		}
	});
};


exports.getMajorBySlug = function getMajorBySlug(majorSlug, callback) {
	Major.getOne({slug: majorSlug}, function (err, major) {
		callback(err, major);
	});
};

exports.getAllMajors = function getAllMajors(callback) {
	Major.get([
			'SELECT * FROM $table',
			[]
		],
		function (err, allMajors) {
			callback(err, allMajors);
		}
	);
};

exports.updateMajorWithSlug = function updateMajorWithSlug(major, callback) {
	Major.getOne({slug: major.slug}, function (err, oldmajor) {
		if (err) {
			return callback(err);
		};
		major.id = oldmajor.id;
		Major.put(major, function (err, major) {
			callback(err, major);
		});
	});	
};

exports.getMajorWithHollandCode = function getMajorWithHollandCode(hollandCode, page, offset,callback) {
	Major.get(['SELECT major.* ' 
		+ ' FROM major join hollandCode on major.hollandCodeId = hollandCode.id ' 
		+ ' WHERE hollandCode.slug like ' + connection.escape(hollandCode + '%')
		+ ' GROUP BY major.id '
		+ ' LIMIT ' + Number(page) + ', ' + Number(offset) ,[]], 
		function (err, majors) {
			if (err) {
				return callback(err);
			};
			return callback(null, majors);
		});
}

exports.getMajorWithPaging = function getMajorWithPaging(limit, page, callback) {
	Major.get({}, {limit: limit, page: page}, function (err, resultMajors) {
		if (err) {
			return callback(err);
		};
		return callback(null, resultMajors);
	});
}