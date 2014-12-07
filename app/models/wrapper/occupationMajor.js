const OccupationMajor = require('../occupationMajor')('CAREER_DATABASE');

exports.addOccupationMajor = function addOccupationMajor(occupationId, majorId, callback) {
	OccupationMajor.put({
			occupationId: occupationId, 
			majorId: majorId 
		}, 
		function (err, result) {
			if (err) {
				return callback(err);
			};
			return callback(null, result);
		}
	);
};