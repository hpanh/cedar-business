const OccupationRequirement = require('../occupationRequirement')('CAREER_DATABASE');

exports.addOccupationRequirement = function addOccupationRequirement(occupationId, requirementId, callback) {
	OccupationRequirement.put({
			occupationId: occupationId, 
			requirementId: requirementId 
		}, 
		function (err, result) {
			if (err) {
				return callback(err);
			};
			return callback(null, result);
		}
	);
};