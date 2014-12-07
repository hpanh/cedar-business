const Requirement = require('../requirement')('CAREER_DATABASE');
const randomString = require('../../lib/utils').randomString;

exports.createRequirement = function createRequirement(requirement, callback) {
	requirement.slug = randomString(16);
	Requirement.getOne({description: requirement.description }, function (err, innerReq) {
		if (err) {
			return callback(err);
		};
		if (innerReq == null) {
			Requirement.put(requirement, function (err, innerInnerReq) {
				if (err) {
					return callback(err);
				};
				Requirement.getOne({id: innerInnerReq.insertId}, function(err, resultReq) {
					if (err) {
						return callback(err);
					};
					return callback(null, resultReq);
				});
			});
		} else {
			return callback(null, innerReq);
		}
	});
};

exports.getRequirementById = function getRequirementById(requirementId, callback) {
	Requirement.getOne({id: requirementId}, function (err, innerRequirement) {
		if (err) {
			return callback(err);
		};
		return callback(null, innerRequirement);
	});
};

exports.getAllRequirement = function getAllRequirement(callback) {
	Requirement.getAll(callback);
};