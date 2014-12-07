const HollandCodes = require('../hollandCodes')('CAREER_DATABASE');
const Occupation = require('../occupation')('CAREER_DATABASE');
const async = require('async');


exports.createHollandCodes = function createHollandCodes(hollandCode, callback) {
	HollandCodes.put(hollandCode, function(err, innerHollandCode) {
		if (err) {
			return callback(err);
		};

		HollandCodes.getOne({id: innerHollandCode.insertId}, function(err, innerInnerHollandCode) {
			if (err) {
				return callback(err);
			};
			return callback(null, innerInnerHollandCode);
		});
	});
};


exports.getOccupationOfHollandCode = function getOccupationOfHollandCode(hollandCode, callback) {
	function hollandCodesGetCallback(err, innerHollandCode) {
		if (err) {
			return callback(err);
		};
		Occupation.get({hollandCodesId: innerHollandCode.id}, function (err, occupationEntries) {
			if (err) {
				return callback(err);
			};
			return callback(null, occupationEntries);
		});
	}

	if (hollandCode.slug != null) {
		HollandCodes.getOne({slug: hollandCode.slug}, function (err, innerHollandCode) {
			hollandCodesGetCallback(err, innerHollandCode);	
		});
	} else {
		HollandCodes.getOne({code1: hollandCode.code1, 
			code2: hollandCode.code2, 
			code3: hollandCode.code3}, function (err, innerHollandCode) {
				hollandCodesGetCallback(err, innerHollandCode);
			});
	}
};

exports.getHollandCode = function getHollandCode(hollandCodeSlug, callback) {
	HollandCodes.getOne({slug: hollandCodeSlug}, function (err, innerHollandCode) {
		if (err) {
			return callback(err);
		};
		return callback(err, innerHollandCode);
	});
};

exports.getAllHollandCode = function getAllHollandCode(callback) {
	HollandCodes.get( 
		function (err, allHollandCodes) {
			if (err) {
				return callback(err);
			}
			return callback(null, allHollandCodes);
		}
	);
};

exports.calculateHollandCodeRelevanceScore = function calculateHollandCodeRelevanceScore(firstHollandCode, secondHollandCode) {
	var score = 0;
	for (var i = 0 ; i < 3; ++i) {
		if (firstHollandCode.charAt(i) === secondHollandCode.charAt(i)) {
			score += 1/3;
		} else if (i > 0) { 
			if (firstHollandCode.charAt(i) !== secondHollandCode.charAt(i - 1)) {
				score += 0.15;
			};
			if (firstHollandCode.charAt(i - 1) !== secondHollandCode.charAt(i)) {
				score += 0.15;
			};
		} 
	}
	return score;
}