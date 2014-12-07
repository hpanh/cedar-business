const Occupation = require('../occupation')('CAREER_DATABASE');
const HollandCodes = require('../hollandCodes')('CAREER_DATABASE');
const async = require('async');
const crypto = require('crypto');
const randomStr = require('../../lib/utils').randomString;
const connection = require('../../lib/db').getDb('CAREER_DATABASE').connection;

exports.createOccupation = function createOccupation(occupationInfo, callback) {

	function processRequirementAndMajor(innerOccupationAdd) {
		Occupation.put(innerOccupationAdd, function (err, result) {
			if (err) {
				return callback(err);
			};
			// add requirement and major
			return callback(null, result);
		});
	}

	var occupationAdd = {
		name: occupationInfo.name,
		slug: randomStr(16),
		shortDescription: occupationInfo.shortDescription,
		description: occupationInfo.description,
		jobPotential: occupationInfo.jobPotential,
	};
	if (occupationInfo.hollandCodesId == null) {
		HollandCodes.getOne({slug: hollandCode}, function (err, hollandCodeObject) {
			if (err) {
				return callback(err);
			};
			occupationAdd['hollandCodesId'] = hollandCodeObject['id'];
			processRequirementAndMajor(occupationAdd);
		});
	} else {
		occupationAdd['hollandCodesId'] = occupationInfo['hollandCodesId'];
		processRequirementAndMajor(occupationAdd);
	}
};

exports.getOccupationBySlug = function getOccupationBySlug(occupationSlug, callback) {
	Occupation.getOne({slug: occupationSlug}, function (err, innerOccupation) {
		return callback(err, innerOccupation);
	});
};

exports.getOccupationByHollandCodeAndName = function getOccupationByHollandCodeAndName(occupationHollandCodeSlug, occupationName, startIndex, offset ,callback) {
	var queryCondition = [];
	var querySentence = '';
	if (occupationHollandCodeSlug) {
		queryCondition.push(' hollandCodes.slug like ' + connection.escape(occupationHollandCodeSlug + '%') + ' ');
	};
	if (occupationName) {
		queryCondition.push(' occupation.name like ' + connection.escape('%' + occupationName + '%') + ' ');
	};
	for (queryPos in queryCondition) {
		querySentence += queryCondition[queryPos];
		if (queryPos != queryCondition.length - 1) {
			querySentence += ' AND ';
		};
	};
	Occupation.get(['SELECT * FROM occupation join hollandCodes on occupation.hollandCodesId = hollandCodes.id '
					+ ' join occupation_major on occupation.id = occupation_major.occupationId '
					+ ' join major on major.id = occupation_major.majorId '
					+ ' where '
					+ querySentence
					+ ' GROUP BY major.id '
					+ ' LIMIT ' + Number(startIndex) + ', ' + Number(offset) 
					,
					[]
				], 
		function (err, occupations) {
			if (err) {
				return callback(err);
			};
			return callback(null, occupations);
		}
	);
};

exports.getOccupationByHollandCodes = function getOccupationByHollandCodes(occupationHollandCodeSlugs, startIndex,offset, callback) {     
	var queryGroup = '';     
	for (sId in occupationHollandCodeSlugs) {
	    queryGroup = queryGroup + '' + occupationHollandCodeSlugs[sId] + ',';     
	}     
    queryGroup = queryGroup.substr(0, queryGroup.length - 1);
    Occupation.get(['SELECT * FROM occupation join hollandCodes on occupation.hollandCodesId = hollandCodes.id'
    	+ ' where hollandCodes.slug IN (' + connection.escape(queryGroup) + ') '                     
    	+ ' LIMIT ' + startIndex + ', ' + offset ,
    	[]
    	],
    	function (err, occupations) {
    	    if (err) {
    	        return callback(err);
    	    };
    	  	return callback(null, occupations);
    	}
    );
}


exports.matchHollandCodes = function matchHollandCodes(hollandCode) {
	var hollandCodeDic = ['R','I','A','S','E','C'];
	var relatedHolland = [];
	if (hollandCode.length == 2) {
		for (hc in hollandCodeDic) {
			if (hollandCodeDic[hc] != hollandCode[0] && hollandCodeDic[hc] != hollandCode[1]) {
				relatedHolland.push(hollandCode + hollandCodeDic[hc]);
			}
		}
	} else if (hollandCode.length == 3) {
		relatedHolland.push(hollandCode.slice(0,2));
		var lastChar = hollandCode[2];
		for (hc in hollandCodeDic) {
			if (hollandCodeDic[hc] != hollandCode[0] 
				&& hollandCodeDic[hc] != hollandCode[1] 
				&& hollandCodeDic[hc] != lastChar) {
				relatedHolland.push(hollandCode.slice(0,2) + hollandCodeDic[hc]);
			}
		}
	} else if (hollandCode.length == 1) {
		var lastChar = hollandCode[0];
		for (c2 in hollandCodeDic) {
			if (hollandCodeDic[c2] != lastChar) {
				relatedHolland.push(lastChar + hollandCodeDic[c2]);
			}
			for (c3 in hollandCodeDic) {
				if (hollandCodeDic[c2] != lastChar && hollandCodeDic[c3] != hollandCodeDic[c2]) {
					relatedHolland.push(lastChar + hollandCodeDic[c2] + hollandCodeDic[c3]);
				}
			}
		}
	}
	return relatedHolland;
}