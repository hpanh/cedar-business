const MajorListing = require('../majorListing')('CAREER_DATABASE');
const async = require('async');
const common = require('../../lib/common');
const School = require('../school');
const Major = require('../major');

exports.createMajorListing = function createMajorListing(majorListing, callback) {
	MajorListing.put(majorListing, function (err, majorListingReturn) {
		if (err) {
			return callback(err);
		}
		MajorListing.getOne({id: majorListingReturn.insertId}, function(err, innerMajorListingReturn) {
			if (err) {
				return callback(err);
			};
			return callback(null, innerMajorListingReturn);
		});
	});
}

exports.getMajorListingBySchool = function getMajorListingBySchool(schoolSlug, callback) {
	School.getOne({slug: schoolSlug}, function (err, resultSchool) {
		MajorListing.get({ schoolId: resultSchool.id }, { relationships: true }, function (err, resultMajorLisings) {
			if (err) {
				return callback(err);
			}
			return callback(null, resultMajorLisings);
		});
	});
}

exports.getMajorListingByMajor = function getMajorListingByMajor(majorSlug, callback) {
	Major.getOne({slug: majorSlug}, function (err, resultMajor) {
		MajorListing.get({ majorId: resultMajor.id }, { relationships: true }, function (err, resultMajorLisings) {
			if (err) {
				return callback(err);
			}
			return callback(null, resultMajorLisings);
		});
	});
}	
